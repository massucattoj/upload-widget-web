/**
 * Upload file to storage
 */

import axios from 'axios'

interface UploadFileToStorageParams {
  file: File
  onProgress: (sizeInBytes: number) => void
}

interface UploadFileToStorageOpts {
  signal?: AbortSignal
}

export async function uploadFileToStorage(
  { file, onProgress }: UploadFileToStorageParams,
  opts?: UploadFileToStorageOpts
) {
  // Send the file to the server as FormData
  const data = new FormData()

  data.append('file', file)

  const response = await axios.post<{ url: string }>(
    'http://localhost:3333/uploads',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: opts?.signal,
      onUploadProgress(progressEvent) {
        onProgress(progressEvent.loaded) // how much data has been uploaded to my backend
      },
    }
  )

  return { url: response.data.url }
}
