import { UploadCloud } from 'lucide-react'

export function UploadWidgetTitle() {
  const isThereAnyPendingUpload = true
  const uploadGlobalPrecentage = 66

  return (
    <div className="flex items-center gap-1.5 text-sm font-medium">
      <UploadCloud className="size-4 text-zinc-400" />

      {isThereAnyPendingUpload ? (
        <span className="flex items-baseline gap-1">
          Uploading{' '}
          <span className="text-xs text-zinc-400 tabular-nums">
            {uploadGlobalPrecentage}%
          </span>
        </span>
      ) : (
        <span>Upload your files</span>
      )}
    </div>
  )
}
