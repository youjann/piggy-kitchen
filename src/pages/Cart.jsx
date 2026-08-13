import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUploader from '../components/ImageUploader'
import { useDishes } from '../context/DishContext'

const CART_ITEMS = [
  { id: 1, name: '农家一碗香', tag: '好美味 · 咸鲜', cal: 450, qty: 2, emoji: '🥘', gradient: 'from-[var(--color-secondary-green)] to-[var(--color-primary)]' },
  { id: 2, name: '风味茄子', tag: '好美味 · 酸甜', cal: 320, qty: 1, emoji: '🍆', gradient: 'from-[var(--color-accent-fire)] to-[var(--color-primary)]' },
  { id: 3, name: '口水鸡', tag: '好美味 · 微辣', cal: 350, qty: 1, emoji: '🍗', gradient: 'from-[var(--color-accent-calorie)] to-[var(--color-primary)]' },
]

const INGREDIENT_CHIPS = [
  '五花肉 150g', '螺丝椒 180g', '鸡蛋 4个',
]

export default function Cart() {
  const navigate = useNavigate()
  const { getDish } = useDishes()
  const [items, setItems] = useState(CART_ITEMS)

  const updateQty = (id, delta) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ))
  }

  const totalCal = items.reduce((sum, item) => sum + item.cal * item.qty, 0)
  const totalDishes = items.length
  const totalServings = items.reduce((sum, item) => sum + item.qty, 0)
  const calPercent = Math.round((totalCal / 2000) * 100)

  return (
    <div className="flex flex-col h-screen">
      {/* Status Bar */}
      <div className="flex items-center justify-between h-[62px] px-6">
        <span className="text-[15px] font-[600] text-[#1A1A2E] font-primary">9:41</span>
        <div className="flex items-center gap-1.5">
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 px-4 overflow-auto pb-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">我的购物车</h1>
          <button
            onClick={() => setItems(items.map(i => ({ ...i, qty: 1 })))}
            className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 2h10M3.5 2V1a1 1 0 011-1h1a1 1 0 011 1v1M2 2l.6 8a1 1 0 001 1h4.8a1 1 0 001-1L10 2M4.5 5v3M7.5 5v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            清空
          </button>
        </div>

        {/* Cart Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 bg-white rounded-[14px] p-3 shadow-sm cursor-pointer"
            onClick={() => navigate(`/dish/${item.id}`)}
          >
            {/* Image — 可上传 */}
            <div className="relative w-16 h-16 rounded-[10px] flex-shrink-0 overflow-hidden">
              <ImageUploader
                dishId={`cart_${item.id}`}
                className="absolute inset-0 w-full h-full"
                rounded="10px"
                showHint
                src={getDish(item.id)?.image}
              >
                <span className="text-2xl opacity-35">{item.emoji}</span>
              </ImageUploader>
              <div className="absolute top-1 left-1 h-[18px] px-1.5 rounded-[9px] bg-[var(--color-primary)] flex items-center gap-0.5 z-10">
                <CalIconMini />
                <span className="text-[9px] font-medium text-white">{item.cal}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-[#1A1A2E]">{item.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="h-[18px] px-2 rounded-[9px] bg-[var(--color-bg-primary)] text-[10px] text-[var(--color-accent-fire)] font-medium">
                  {item.tag}
                </span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">· {item.cal} kcal</span>
              </div>
            </div>

            {/* Qty Control */}
            <div className="flex items-center gap-0 h-7 rounded-[14px] bg-[var(--color-bg-primary)] self-end" onClick={e => e.stopPropagation()}>
              <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] text-sm">−</button>
              <span className="w-6 h-7 flex items-center justify-center text-xs font-semibold text-[var(--color-text-primary)]">{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] text-sm">+</button>
            </div>
          </div>
        ))}

        {/* Summary Card */}
        <div className="bg-[var(--color-bg-primary)] rounded-[14px] p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1A1A2E]">今日营养汇总</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[var(--color-primary)]">{totalCal.toLocaleString()}</span>
              <span className="text-[11px] text-[#949499]">kcal</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 rounded bg-[var(--color-border-light)] overflow-hidden">
            <div
              className="h-full rounded bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary-green)] transition-all"
              style={{ width: `${Math.min(calPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#949499]">已摄入 / 推荐 2000 kcal</span>
            <span className="font-semibold text-[var(--color-primary)]">{calPercent}%</span>
          </div>
        </div>

        {/* Ingredients Summary */}
        <div className="bg-white rounded-[14px] p-4 flex flex-col gap-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 15 13" fill="none">
                <path d="M1 2h2l1.5 9h7l1.5-6H4" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 1h7l-1.5 6" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm font-semibold text-[#1A1A2E]">所需食材汇总</span>
            </div>
            <span className="text-[11px] text-[#949499]">11 种</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {INGREDIENT_CHIPS.map((chip) => (
              <span key={chip} className="h-6 px-2.5 rounded-[12px] bg-[#FFF8F3] text-[11px] text-[#1A1A2E] font-medium flex items-center">
                {chip}
              </span>
            ))}
            <span className="h-6 px-2 rounded-[12px] bg-[var(--color-primary)] text-[11px] text-white font-medium flex items-center">
              +9
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Bar */}
      <div className="h-[84px] bg-white border-t border-[var(--color-border-light)] flex items-center justify-between px-6">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[var(--color-primary)]">{totalDishes} 道菜</span>
            <span className="text-xs text-[var(--color-text-secondary)]">/ 共 {totalServings} 份</span>
          </div>
        </div>
        <button className="h-11 px-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/40 active:scale-95 transition-transform">
          开始烹饪
        </button>
      </div>
    </div>
  )
}

/* --- Shared Icons (same as Home) --- */
function SignalIcon() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
      <rect x="0" y="7" width="3" height="4" rx="0.5" fill="#1A1A2E"/>
      <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="#1A1A2E"/>
      <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="#1A1A2E"/>
      <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="#1A1A2E"/>
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <path d="M1.8 2.9a9 9 0 0112.4 0" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4.5 5.7a4.8 4.8 0 017 0" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="9" r="1.5" fill="#1A1A2E"/>
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
      <rect x="0" y="0.5" width="22" height="12" rx="2.5" stroke="#1A1A2E" strokeWidth="1"/>
      <rect x="2" y="2.5" width="19" height="9" rx="1" fill="#1A1A2E"/>
      <path d="M23.5 3.5v6" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function CalIconMini() {
  return (
    <svg width="7" height="8" viewBox="0 0 4 9" fill="none">
      <path d="M2 9C.5 9 0 7.2 0 5.8 0 4 2 .5 2 .5S4 4 4 5.8C4 7.2 3.5 9 2 9z" fill="white"/>
    </svg>
  )
}
