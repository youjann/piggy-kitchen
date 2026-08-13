import { useRef, useState, useEffect } from 'react'

/**
 * ImageUploader — 可点击上传图片的组件
 *
 * Props:
 *   dishId       - 菜品 ID（用于按菜品区分存储）
 *   className    - 外层容器 className
 *   rounded      - 圆角值，默认 "14px"
 *   showHint     - 是否显示"点击上传"提示文字（默认 true）
 *   hintPosition - "center" | "bottom"（默认 "center"）
 *   src          - 默认图片（未上传时显示，例如画布导出的菜品图）
 *   children     - 无图片时的占位内容（emoji 等）
 */
export default function ImageUploader({
  dishId,
  className = '',
  rounded = '14px',
  showHint = true,
  hintPosition = 'center',
  src,
  children,
}) {
  const inputRef = useRef(null)
  const [image, setImage] = useState(null)

  // 从 localStorage 恢复图片
  useEffect(() => {
    if (!dishId) return
    try {
      const stored = localStorage.getItem(`dish_img_${dishId}`)
      if (stored) setImage(stored)
    } catch (e) { /* ignore */ }
  }, [dishId])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setImage(dataUrl)
      if (dishId) {
        try { localStorage.setItem(`dish_img_${dishId}`, dataUrl) } catch (e) { /* ignore */ }
      }
    }
    reader.readAsDataURL(file)
    // reset so same file re-upload works
    e.target.value = ''
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    setImage(null)
    if (dishId) {
      try { localStorage.removeItem(`dish_img_${dishId}`) } catch (e) { /* ignore */ }
    }
  }

  const hintMarkup = showHint && (
    <div
      className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center ${
        image || src ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-1.5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 16V8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.5" />
        </svg>
        <span className="text-white text-[11px] font-medium drop-shadow-sm">
          {image || src ? '更换照片' : '点击上传'}
        </span>
      </div>
    </div>
  )

  return (
    <div
      onClick={handleClick}
      className={`group relative overflow-hidden cursor-pointer ${className}`}
      style={{ borderRadius: rounded }}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Background gradient fallback */}
      {!image && !src && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary-green)] to-[var(--color-primary)]" />
      )}

      {/* Uploaded image */}
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Default image (from canvas, when not uploaded) */}
      {!image && src && (
        <img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Placeholder content (shown when no image) */}
      {!image && !src && children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}

      {/* Hint overlay */}
      {hintMarkup}

      {/* Delete button (shown on hover when image exists) */}
      {image && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="删除照片"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3l6 6M9 3l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
