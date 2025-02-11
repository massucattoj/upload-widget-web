/**
 * Upload file to storage
 */

import axios from 'axios'

interface UploadFileToStorageParams {
  file: File
}

export async function uploadFileToStorage({ file }: UploadFileToStorageParams) {
  // Enviar o arquivo para o servidor com um FormData
  const data = new FormData()

  data.append('file', file)

  const response = await axios.post<{ url: string }>(
    'http://localhost:3333/uploads',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  console.log('response', response.data)
  console.log('url', response.data.url)

  return { url: response.data.url }
}
