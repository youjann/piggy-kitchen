import { useEffect } from 'react'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  danger = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onCancel?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full bg-white rounded-t-[20px] p-5 pb-7 flex flex-col gap-4 animate-slide-up">
        <div className="flex flex-col gap-1.5 text-center px-2">
          <span className="text-base font-semibold text-[var(--color-text-primary)] font-primary">{title}</span>
          {message && (
            <span className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onConfirm}
            className={`h-11 rounded-full text-white text-sm font-semibold transition-all active:scale-95 ${
              danger ? 'bg-[#C0504D]' : 'bg-[var(--color-primary)]'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="h-11 rounded-full bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-sm font-semibold active:scale-95 transition-transform"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
