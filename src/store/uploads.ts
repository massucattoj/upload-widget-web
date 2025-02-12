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
  abortController: AbortController
  status: 'progress' | 'success' | 'error' | 'cancelled'
  originalSizeInBytes: number
  uploadSizeInBytes: number
}

type UploadState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
  cancelUpload: (uploadId: string) => void
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

      try {
        const compressedFile = await compressImage({
          file: upload.file,
          maxWidth: 200,
          maxHeight: 200,
          quality: 0.5,
        })

        await uploadFileToStorage(
          {
            file: upload.file,
            onProgress(sizeInBytes) {
              updateUpload(uploadId, {
                uploadSizeInBytes: sizeInBytes,
              })
            },
          },
          { signal: upload.abortController.signal }
        )

        updateUpload(uploadId, {
          status: 'success',
        })
      } catch (err) {
        if (err instanceof CanceledError) {
          updateUpload(uploadId, {
            status: 'cancelled',
          })

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

      upload.abortController.abort() // Abort the request (Http request)
    }

    // Add uploads
    function addUploads(files: File[]) {
      console.log(files)
      for (const file of files) {
        const uploadId = crypto.randomUUID()
        const abortController = new AbortController()

        const upload: Upload = {
          name: file.name,
          file,
          abortController,
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
          acc.total += upload.originalSizeInBytes
          acc.uploaded += upload.uploadSizeInBytes

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
