import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useId, useRef, useState } from 'react'

type UploadFieldProps = {
  label: string
  hint?: string
  /** Current preview URL (object URL or remote) */
  previewUrl: string | null
  fileName: string | null
  accept?: string
  onFile: (file: File) => void
  onClear?: () => void
  disabled?: boolean
}

export function UploadField({
  label,
  hint,
  previewUrl,
  fileName,
  accept = 'image/*',
  onFile,
  onClear,
  disabled,
}: UploadFieldProps) {
  const inputId = useId()
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pickFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (file && file.type.startsWith('image/')) onFile(file)
    },
    [onFile],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (disabled) return
      pickFiles(e.dataTransfer.files)
    },
    [disabled, pickFiles],
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={inputId}
          className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted"
        >
          {label}
        </label>
        {hint ? (
          <p className="text-right text-[12px] text-ink-muted">{hint}</p>
        ) : null}
      </div>

      <motion.div
        layout
        className={[
          'relative overflow-hidden rounded-lg border border-line bg-surface-raised/90',
          'shadow-[var(--shadow-panel)] transition-colors',
          dragOver ? 'border-accent bg-surface' : '',
          disabled ? 'pointer-events-none opacity-50' : '',
        ].join(' ')}
        animate={{
          scale: dragOver ? 1.008 : 1,
          borderColor: dragOver
            ? 'color-mix(in oklab, var(--color-accent) 55%, transparent)'
            : undefined,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onDragEnter={(e) => {
          e.preventDefault()
          if (!disabled) setDragOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            pickFiles(e.target.files)
            e.target.value = ''
          }}
        />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="filled"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-stretch gap-0"
            >
              <button
                type="button"
                className="relative aspect-[5/7] w-[min(44%,140px)] shrink-0 cursor-pointer border-0 bg-black/5 p-0 text-left"
                onClick={() => inputRef.current?.click()}
              >
                <img
                  src={previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-4 py-3">
                <p className="truncate text-[13px] font-medium text-ink">
                  {fileName ?? 'Image'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-line-strong bg-white/70 px-3 py-1.5 text-[12px] font-medium text-ink hover:bg-white"
                    onClick={() => inputRef.current?.click()}
                  >
                    Replace
                  </button>
                  {onClear ? (
                    <button
                      type="button"
                      className="rounded-md px-3 py-1.5 text-[12px] font-medium text-ink-muted hover:text-ink"
                      onClick={onClear}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="empty"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex w-full flex-col items-start gap-1 px-5 py-8 text-left"
              onClick={() => inputRef.current?.click()}
            >
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                Drop an image
              </span>
              <span className="text-[13px] text-ink-muted">
                or click to browse — PNG, JPG, WebP
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
