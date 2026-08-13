import { useNavigate } from 'react-router-dom'
import { useDishes } from '../context/DishContext'

export default function LikesStats() {
  const navigate = useNavigate()
  const { dishes, favorites, isFavorite, toggleFavorite, clickCounts, topClickedDish, totalClicks } = useDishes()

  const likedDishes = dishes.filter(d => favorites.includes(d.id))

  // 排序：按点击次数降序，相同时按收藏先后
  const ranked = [...likedDishes]
    .map(d => ({ ...d, clicks: clickCounts[d.id] || 0 }))
    .sort((a, b) => b.clicks - a.clicks)

  const top = topClickedDish || ranked[0] || null

  return (
    <div className="flex flex-col min-h-screen pb-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between h-[62px] px-6">
        <span className="text-[15px] font-[600] text-[var(--color-text-primary)] font-primary">9:41</span>
        <div className="flex items-center gap-1.5">
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white border border-[var(--color-border-light)] flex items-center justify-center shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">大王喜欢</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 px-4">
        {/* Hero Card — 大王最爱 */}
        {top && (
          <div
            className="relative rounded-[18px] p-5 overflow-hidden text-white"
            style={{
              background: 'linear-gradient(135deg, #3E3A35 0%, #B08A7D 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white/15 text-[11px] font-semibold">
                <FavHeart />
                大王最爱
              </span>
              <span className="text-[13px] font-medium text-white/85">
                点击 {clickCounts[top.id] || 0} 次
              </span>
            </div>
            <h2 className="text-[28px] font-bold leading-tight">{top.name}</h2>
            <p className="text-[12px] text-white/70 mt-1">
              {top.author || '博主'} · {top.tag} · {top.cal} kcal
            </p>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[14px] p-4 border border-[var(--color-border-light)]">
            <div className="text-[28px] font-bold text-[#C0504D] leading-none">
              {likedDishes.length}
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">道菜被喜欢</div>
          </div>
          <div className="bg-white rounded-[14px] p-4 border border-[var(--color-border-light)]">
            <div className="text-[28px] font-bold text-[var(--color-primary)] leading-none">
              {totalClicks}
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">次点击查看</div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">喜欢的菜</h3>
          <span className="text-[11px] text-[var(--color-text-secondary)]">按热度排序</span>
        </div>

        {/* Liked List */}
        {ranked.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <span className="text-4xl opacity-50">🍽️</span>
            <p className="text-sm text-[var(--color-text-secondary)]">还没有喜欢的菜</p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 h-9 px-5 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium"
            >
              去逛逛
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {ranked.map((dish, idx) => (
              <div
                key={dish.id}
                onClick={() => navigate(`/dish/${dish.id}`)}
                className="flex items-center gap-3 bg-white rounded-[14px] p-3 border border-[var(--color-border-light)] cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                  style={{
                    background: idx === 0 ? '#C0504D' : idx === 1 ? '#A89080' : '#D6CCBC',
                  }}
                >
                  {idx + 1}
                </div>
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #D4B8A0 0%, #F4EEE1 100%)',
                  }}
                >
                  {dish.emoji || '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{dish.name}</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)]">
                    {dish.author || '博主'} · {dish.tag}
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-[16px] font-bold text-[#C0504D]">{dish.clicks}</span>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">次</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(dish.id) }}
                  className="ml-1 flex-shrink-0"
                >
                  <FavHeart filled={isFavorite(dish.id)} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FavHeart({ filled = true }) {
  return (
    <svg width="14" height="13" viewBox="0 0 13 12" fill="none">
      <path
        d="M6.5 12l-1.1-1C2.5 8.5 0 6.4 0 3.8 0 1.7 1.7 0 3.8 0c1.2 0 2.4.6 3.1 1.5C7.7.6 8.8 0 10 0 12.3 0 14 1.7 14 3.8c0 2.6-2.5 4.7-5.4 7.2L6.5 12z"
        fill={filled ? '#E8658A' : 'none'}
        stroke={filled ? '#E8658A' : 'white'}
        strokeWidth="1.2"
      />
    </svg>
  )
}

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
