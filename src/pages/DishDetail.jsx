import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ImageUploader from '../components/ImageUploader'
import { useDishes } from '../context/DishContext'
import ConfirmDialog from '../components/ConfirmDialog'

export default function DishDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getDish, toggleFavorite, isFavorite, deleteDish, incrementClick } = useDishes()
  const [qty, setQty] = useState(1)
  const [showDelete, setShowDelete] = useState(false)

  const dish = getDish(id)
  const fav = isFavorite(id)

  // 进入菜品详情时记录一次点击
  useEffect(() => {
    if (dish) incrementClick(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!dish) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-3">
        <span className="text-4xl">🍽️</span>
        <p className="text-sm text-[#949499]">菜品找不到了</p>
        <button onClick={() => navigate('/')} className="text-sm text-[var(--color-primary)] font-medium">返回首页</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen relative">
      {/* Hero Image — 可上传 */}
      <div className="relative w-full h-[280px]">
        <ImageUploader
          dishId={`hero_${id}`}
          className="absolute inset-0 w-full h-full"
          rounded="0"
          showHint
        >
          <span className="text-7xl opacity-30">{dish.emoji || '🥘'}</span>
        </ImageUploader>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-[54px] left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm z-10"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 大王喜欢 Heart Button */}
        <button
          onClick={() => toggleFavorite(id)}
          className="absolute top-[54px] right-4 flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm z-10 active:scale-90 transition-transform"
        >
          <svg width="16" height="16" viewBox="0 0 13 12" fill="none">
            <path
              d="M6.5 12l-1.1-1C2.5 8.5 0 6.4 0 3.8 0 1.7 1.7 0 3.8 0c1.2 0 2.4.6 3.1 1.5C7.7.6 8.8 0 10 0 12.3 0 14 1.7 14 3.8c0 2.6-2.5 4.7-5.4 7.2L6.5 12z"
              fill={fav ? '#E8658A' : 'none'}
              stroke={fav ? '#E8658A' : '#949499'}
              strokeWidth="1.2"
            />
          </svg>
          <span className={`text-xs font-medium ${fav ? 'text-[#E8658A]' : 'text-[#949499]'}`}>
            大王喜欢
          </span>
        </button>
      </div>

      {/* Info Card */}
      <div className="flex-1 bg-white rounded-t-[24px] -mt-5 relative z-10 px-6 pt-6 pb-4 flex flex-col gap-5 overflow-auto">
        {/* Title */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="h-[22px] px-2.5 rounded-[11px] bg-[var(--color-tag-green-bg)] text-[11px] text-[var(--color-accent-fire)] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                {dish.tags ? dish.tags[0] : `${dish.category === 'diet' ? '减脂' : '好美味'} · ${dish.tag}`}
              </span>
              <span className="h-[22px] px-2.5 rounded-[11px] bg-[var(--color-bg-primary)] text-[11px] text-[var(--color-orange-accent)] font-medium">
                {dish.tags ? dish.tags[1] : '自家出品'}
              </span>
              {dish.meatType && (
                <span className="h-[22px] px-2.5 rounded-[11px] bg-[var(--color-secondary-green)]/15 text-[11px] text-[var(--color-secondary-green)] font-medium">
                  {dish.meatType}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{dish.name}</h1>
          </div>
        </div>

        {/* Nutrition Row */}
        <div className="flex items-center justify-around bg-[var(--color-bg-primary)] rounded-xl px-4 py-3">
          <NutritionItem value={dish.cal} unit="kcal" highlight />
          <div className="w-px h-[30px] bg-[var(--color-border-light)]" />
          <NutritionItem value={dish.protein || '—'} unit="蛋白质" />
          <div className="w-px h-[30px] bg-[var(--color-border-light)]" />
          <NutritionItem value={dish.fat || '—'} unit="脂肪" />
          <div className="w-px h-[30px] bg-[var(--color-border-light)]" />
          <NutritionItem value={dish.carbs || '—'} unit="碳水" />
        </div>

        {/* Recipe Source */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-[#1A1A2E]">菜谱来源</span>
              <span className="text-[11px] text-[#949499]">一手视频 · 文字版</span>
            </div>
            <button
              onClick={() => navigate(`/recipe/${id}`)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-[14px] bg-[var(--color-secondary-green)] text-white text-[11px] font-medium"
            >
              <ImageUploader
                dishId="author_btn_avatar"
                className="w-5 h-5 rounded-full flex-shrink-0 overflow-hidden"
                rounded="9999px"
                showHint={false}
              >
                <span className="text-[10px] text-white">{dish.author?.[0] || '博'}</span>
              </ImageUploader>
              {dish.author || '博主'} · 小红书
            </button>
          </div>

          {/* Author Card */}
          <div className="flex items-center gap-2.5 bg-[var(--color-bg-primary)] rounded-xl p-3">
            <ImageUploader
              dishId="author_avatar"
              className="w-9 h-9 rounded-full flex-shrink-0"
              rounded="9999px"
              showHint={false}
            >
              <span className="text-white text-sm font-bold">{dish.author?.[0] || '博'}</span>
            </ImageUploader>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{dish.author || '博主'}</span>
              <span className="text-[11px] text-[var(--color-text-secondary)]">小红书美食博主 | 百万粉丝</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => navigate(`/edit-dish/${id}`)}
                className="h-7 px-3 rounded-[14px] bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1 active:scale-95 transition-transform"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8.5 1.5a1.414 1.414 0 012 2l-7 7L1 11.5l1-2.5 7-7z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                编辑
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="h-7 px-3 rounded-[14px] bg-[#FBEDEB] border border-[#F0C9C4] text-[11px] text-[#C0504D] font-medium flex items-center gap-1 active:scale-95 transition-transform"
              >
                <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 3.5h8M5.2 3.5V2.2a1 1 0 011-1h.6a1 1 0 011 1v1.3M3.5 3.5l.5 7a1 1 0 001 .9h2a1 1 0 001-.9l.5-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-sm font-semibold text-[#1A1A2E]">食材清单</span>
            <span className="text-[11px] text-[#949499]">{(dish.ingredients || []).length} 种</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(dish.ingredients || []).map((ing) => (
              <span
                key={ing.name}
                className="h-6 px-2.5 rounded-[12px] bg-[#FFF8F3] text-[11px] text-[var(--color-text-primary)] font-medium flex items-center"
              >
                {ing.name} {ing.amount}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-[84px] bg-white border-t border-[var(--color-border-light)] flex items-center justify-between px-6">
        {/* Quantity */}
        <div className="flex items-center gap-0 h-7 rounded-[14px] bg-[var(--color-bg-primary)]">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] text-lg">−</button>
          <span className="w-6 h-7 flex items-center justify-center text-sm font-semibold text-[var(--color-text-primary)]">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] text-lg">+</button>
        </div>

        <button className="h-11 px-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/40 active:scale-95 transition-transform">
          开始烹饪
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="删除这道菜？"
        message={`「${dish.name}」删除后将无法恢复，确定要删除吗？`}
        confirmText="删除"
        danger
        onCancel={() => setShowDelete(false)}
        onConfirm={() => { deleteDish(id); setShowDelete(false); navigate('/') }}
      />
    </div>
  )
}

function NutritionItem({ value, unit, highlight }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-lg font-bold ${highlight ? 'text-[var(--color-accent-fire)]' : 'text-[#1A1A2E]'}`}>
        {value}
      </span>
      <span className="text-[10px] text-[#949499]">{unit}</span>
    </div>
  )
}
