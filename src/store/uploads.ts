import { CanceledError } from 'axios'
import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/shallow'
import { uploadFileToStorage } from '../http/upload-file-to-storage'
import { compressImage } from '../utils/compress-image'

export type Upload = {
  name: string
  file: File
  abortController?: AbortController
  status: 'progress' | 'success' | 'error' | 'cancelled'
  originalSizeInBytes: number
  uploadSizeInBytes: number
  compressedSizeInBytes?: number
  remoteUrl?: string
}

type UploadState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
  cancelUpload: (uploadId: string) => void
  retryUpload: (uploadId: string) => void
}

enableMapSet()

export const useUploads = create<UploadState, [['zustand/immer', never]]>(
  immer((set, get) => {
    function updateUpload(uploadId: string, data: Partial<Upload>) {
      // Partial<Upload> get all the properties of Upload and make them optional
      const upload = get().uploads.get(uploadId)
      if (!upload) {
        return
      }

      // with immer just make the changes in the state, dont need to return a new state
      set(state => {
        state.uploads.set(uploadId, {
          ...upload,
          ...data,
        })
      })
    }

    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) {
        return
      }

      const abortController = new AbortController()

      // every time we call processUpload we call with a fresh upload object
      updateUpload(uploadId, {
        uploadSizeInBytes: 0,
        remoteUrl: undefined,
        compressedSizeInBytes: undefined,
        abortController,
        status: 'progress',
      })

      try {
        const compressedFile = await compressImage({
          file: upload.file,
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.8,
        })

        updateUpload(uploadId, { compressedSizeInBytes: compressedFile.size })

        const { url } = await uploadFileToStorage(
          {
            file: compressedFile,
            onProgress(sizeInBytes) {
              updateUpload(uploadId, {
                uploadSizeInBytes: sizeInBytes,
              })
            },
          },
          { signal: abortController?.signal }
        )

        updateUpload(uploadId, { status: 'success', remoteUrl: url })
      } catch (err) {
        if (err instanceof CanceledError) {
          updateUpload(uploadId, { status: 'cancelled' })
          return
        }

        updateUpload(uploadId, {
          status: 'error',
        })
      }
    }

    // Cancel an upload
    async function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) {
        return
      }

      upload.abortController?.abort() // Abort the request (Http request)
    }

    // Retry an upload
    function retryUpload(uploadId: string) {
      processUpload(uploadId)
    }

    // Add uploads
    function addUploads(files: File[]) {
      console.log(files)
      for (const file of files) {
        const uploadId = crypto.randomUUID()

        const upload: Upload = {
          name: file.name,
          file,
          status: 'progress',
          originalSizeInBytes: file.size,
          uploadSizeInBytes: 0,
        }

        set(state => {
          state.uploads.set(uploadId, upload)
        })

        processUpload(uploadId)
      }
    }

    return {
      uploads: new Map(),
      addUploads,
      cancelUpload,
      retryUpload,
    }
  })
)

export const usePendingUploads = () => {
  return useUploads(
    useShallow(store => {
      const isThereAnyPendingUploads = Array.from(store.uploads.values()).some(
        upload => upload.status === 'progress'
      )

      // if not upload in progress
      if (!isThereAnyPendingUploads) {
        return { isThereAnyPendingUploads, globalPercentage: 100 }
      }

      // if exist an upload in progress
      const { total, uploaded } = Array.from(store.uploads.values()).reduce(
        (acc, upload) => {
          if (upload.compressedSizeInBytes) {
            acc.uploaded += upload.compressedSizeInBytes
          }

          acc.total +=
            upload.compressedSizeInBytes || upload.originalSizeInBytes

          return acc
        },
        { total: 0, uploaded: 0 }
      )

      const globalPercentage = Math.min(
        Math.round((uploaded * 100) / total),
        100
      )

      return { isThereAnyPendingUploads, globalPercentage }
    })
  )
}
