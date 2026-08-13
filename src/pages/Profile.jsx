import { useNavigate } from 'react-router-dom'
import { useDishes } from '../context/DishContext'

const MEAT_TYPES = ['猪肉', '牛肉', '鸡肉', '羊肉', '海鲜', '蔬菜']
const MEAT_EMOJIS = { '猪肉': '🥓', '牛肉': '🥩', '鸡肉': '🍗', '羊肉': '🍖', '海鲜': '🦐', '蔬菜': '🥬' }

export default function Profile() {
  const navigate = useNavigate()
  const { dishes, favoriteDishes, toggleFavorite } = useDishes()

  const favCount = favoriteDishes.length
  const totalCal = favoriteDishes.reduce((sum, d) => sum + (d.cal || 0), 0)
  const avgCal = favCount > 0 ? Math.round(totalCal / favCount) : 0

  // 按分类统计
  const dietCount = favoriteDishes.filter(d => d.category === 'diet').length
  const normalCount = favoriteDishes.filter(d => d.category === 'normal').length

  // 按肉类统计
  const meatStats = MEAT_TYPES.map(meat => ({
    meat,
    count: favoriteDishes.filter(d => (d.meatType || '猪肉') === meat).length,
  })).filter(s => s.count > 0)

  // 按做法统计
  const tagStats = {}
  favoriteDishes.forEach(d => {
    const tag = d.tag || '其他'
    tagStats[tag] = (tagStats[tag] || 0) + 1
  })
  const topTags = Object.entries(tagStats).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // 全部菜品数
  const totalDishes = dishes.length

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
      <div className="flex-1 overflow-auto px-4 pb-2 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">我的</h1>
          <p className="text-[13px] text-[var(--color-text-secondary)]">大王喜欢了什么菜？这里都有记录 👑</p>
        </div>

        {/* 大王喜欢 Summary Card */}
        <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[#D4A0A0] rounded-[18px] p-5 overflow-hidden">
          <div className="absolute top-3 right-3 text-4xl opacity-20">👑</div>
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">大王喜欢</span>
              <span className="w-1 h-1 rounded-full bg-white/60" />
              <span className="text-white/80 text-xs">收藏统计</span>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex flex-col">
                <span className="text-white text-4xl font-bold">{favCount}</span>
                <span className="text-white/70 text-[11px] mt-0.5">道喜欢的菜</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-2xl font-bold">{avgCal}</span>
                <span className="text-white/70 text-[11px] mt-0.5">平均卡路里</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-2xl font-bold">{totalCal}</span>
                <span className="text-white/70 text-[11px] mt-0.5">总卡路里</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/likes-stats')}
              className="self-start mt-1 h-9 px-4 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              查看喜欢统计 →
            </button>
          </div>
        </div>

        {/* 分类偏好 */}
        <div className="bg-white rounded-[14px] p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-semibold text-[#1A1A2E]">分类偏好</span>
            <span className="text-[11px] text-[#949499]">减脂 vs 好美味</span>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col items-center gap-1.5 bg-[var(--color-secondary-green)]/8 rounded-xl py-3">
              <span className="text-2xl font-bold text-[var(--color-secondary-green)]">{dietCount}</span>
              <span className="text-[11px] text-[#949499]">减脂餐</span>
              <div className="w-full h-1.5 rounded-full bg-[var(--color-bg-primary)] overflow-hidden mt-1">
                <div
                  className="h-full bg-[var(--color-secondary-green)] rounded-full transition-all"
                  style={{ width: `${favCount > 0 ? (dietCount / favCount) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5 bg-[var(--color-primary)]/8 rounded-xl py-3">
              <span className="text-2xl font-bold text-[var(--color-primary)]">{normalCount}</span>
              <span className="text-[11px] text-[#949499]">好美味</span>
              <div className="w-full h-1.5 rounded-full bg-[var(--color-bg-primary)] overflow-hidden mt-1">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                  style={{ width: `${favCount > 0 ? (normalCount / favCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 肉类偏好 */}
        <div className="bg-white rounded-[14px] p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-semibold text-[#1A1A2E]">肉类偏好</span>
            <span className="text-[11px] text-[#949499]">大王最爱的食材</span>
          </div>
          {meatStats.length === 0 ? (
            <p className="text-sm text-[#C7C7CC] text-center py-4">还没有收藏任何菜品</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {meatStats.map(({ meat, count }) => {
                const maxCount = Math.max(...meatStats.map(s => s.count))
                const percent = (count / maxCount) * 100
                return (
                  <div key={meat} className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{MEAT_EMOJIS[meat]}</span>
                    <span className="text-sm text-[#1A1A2E] w-10">{meat}</span>
                    <div className="flex-1 h-6 rounded-lg bg-[var(--color-bg-primary)] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary-green)] rounded-lg flex items-center justify-end px-2 transition-all"
                        style={{ width: `${percent}%` }}
                      >
                        <span className="text-[10px] text-white font-bold">{count}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 做法偏好 */}
        {topTags.length > 0 && (
          <div className="bg-white rounded-[14px] p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm font-semibold text-[#1A1A2E]">做法偏好</span>
              <span className="text-[11px] text-[#949499]">大王喜欢的烹饪方式</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="h-8 px-3 rounded-[10px] bg-[var(--color-bg-primary)] flex items-center gap-1.5"
                >
                  <span className="text-[13px] text-[#1A1A2E] font-medium">{tag}</span>
                  <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">{count}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 大王喜欢的菜列表 */}
        <div className="bg-white rounded-[14px] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#1A1A2E]">大王喜欢的菜</span>
              <span className="text-[11px] text-[#949499]">{favCount} 道</span>
            </div>
            {favCount > 0 && (
              <span className="text-[11px] text-[#949499]">全部菜品 {totalDishes} 道</span>
            )}
          </div>
          {favoriteDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <span className="text-3xl">👑</span>
              <p className="text-sm text-[#949499]">大王还没有喜欢的菜</p>
              <button
                onClick={() => navigate('/')}
                className="mt-2 text-sm text-[var(--color-primary)] font-medium"
              >
                去首页逛逛 →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {favoriteDishes.map(dish => (
                <div
                  key={dish.id}
                  onClick={() => navigate(`/dish/${dish.id}`)}
                  className="flex items-center gap-3 p-2 rounded-[12px] bg-[var(--color-bg-primary)] cursor-pointer active:opacity-80 transition-opacity"
                >
                  <span className="text-2xl">{dish.emoji || '🍽️'}</span>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-[#1A1A2E]">{dish.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--color-secondary-green)] font-medium">{dish.tag}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-[#949499]" />
                      <span className="text-[11px] text-[#949499]">{dish.meatType || '猪肉'}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-[#949499]" />
                      <span className="text-[11px] text-[#949499]">{dish.cal} kcal</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(dish.id) }}
                    className="w-8 h-8 flex items-center justify-center text-[#E8658A]"
                  >
                    <svg width="16" height="16" viewBox="0 0 13 12" fill="none">
                      <path
                        d="M6.5 12l-1.1-1C2.5 8.5 0 6.4 0 3.8 0 1.7 1.7 0 3.8 0c1.2 0 2.4.6 3.1 1.5C7.7.6 8.8 0 10 0 12.3 0 14 1.7 14 3.8c0 2.6-2.5 4.7-5.4 7.2L6.5 12z"
                        fill="#E8658A"
                        stroke="#E8658A"
                        strokeWidth="1"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="flex items-center justify-around h-[84px] bg-white border-t border-[var(--color-border-light)]">
        <TabItem icon={<HomeTabIcon />} label="首页" onClick={() => navigate('/')} />
        <TabItem icon={<CartTabIcon />} label="购物车" onClick={() => navigate('/cart')} />
        <TabItem icon={<ProfileTabIcon />} label="我的" active />
      </div>
    </div>
  )
}

function TabItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-[var(--color-primary)]' : 'text-[#949499]'}`}>
      {icon}
      <span className="text-[11px] font-medium">{label}</span>
    </button>
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

function HomeTabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M2 8.5L11 2l9 6.5M4 10v8a2 2 0 002 2h10a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CartTabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="8" cy="19" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="19" r="1.5" fill="currentColor"/>
      <path d="M2 3h3l1.5 12h9l2-8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ProfileTabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M2 20c0-4.4 4-8 9-8s9 3.6 9 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
