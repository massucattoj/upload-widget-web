interface CompressImageParams {
  file: File
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

function convertToWebp(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return `${filename}.webp`
  }
  return `${filename.substring(0, lastDotIndex)}.webp`
}

export function compressImage({
  file,
  maxWidth = Number.POSITIVE_INFINITY,
  maxHeight = Number.POSITIVE_INFINITY,
  quality = 1,
}: CompressImageParams) {
  // Need to verify if the file is an image of the mime types that we have
  const allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
  ]

  if (!allowedFileTypes.includes(file.type)) {
    throw new Error('Image format not supported.')
  }

  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader() // Allow the reading of files in pieces

    reader.onload = event => {
      const compressed = new Image()

      compressed.onload = () => {
        // create a canvas object
        const canvas = document.createElement('canvas')

        let width = compressed.width
        let height = compressed.height

        if (width > height) {
          // image is landscape
          if (width > maxWidth) {
            height *= maxWidth / width // keep the aspect ratio
            width = maxWidth
          }
        } else {
          // image is portrait
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')

        if (!context) {
          reject(new Error('Canvas context not available.'))
          return
        }

        context.drawImage(compressed, 0, 0, width, height)

        // jump of the cat
        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('Failed to compress image.'))
              return
            }

            const compressedFile = new File([blob], convertToWebp(file.name), {
              type: 'image/webp',
              lastModified: Date.now(),
            })

            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }

      compressed.src = event.target?.result as string
    }

    reader.readAsDataURL(file) // Read the file as a data URL
  })
}
