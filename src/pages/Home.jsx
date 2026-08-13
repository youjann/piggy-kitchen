import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUploader from '../components/ImageUploader'
import { useDishes } from '../context/DishContext'
import ConfirmDialog from '../components/ConfirmDialog'

// 减脂餐子分类
const DIET_SUB_CATS = ['全部', '酸甜', '清淡', '微辣', '咸鲜']
// 好美味子分类（与减脂餐统一）
const NORMAL_SUB_CATS = ['全部', '酸甜', '清淡', '微辣', '咸鲜']
// 肉类分类（通用）
const MEAT_TYPES = ['全部', '猪肉', '牛肉', '鸡肉', '羊肉', '海鲜', '蔬菜']

export default function Home() {
  const navigate = useNavigate()
  const { dishes, toggleFavorite, isFavorite, deleteDish } = useDishes()
  const [activeCat, setActiveCat] = useState('normal')
  const [activeChip, setActiveChip] = useState(0)
  const [activeMeat, setActiveMeat] = useState('全部')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const subCats = activeCat === 'diet' ? DIET_SUB_CATS : NORMAL_SUB_CATS

  // 过滤菜品
  const filteredDishes = dishes.filter(d => {
    if (d.category !== activeCat) return false
    if (activeMeat !== '全部' && d.meatType !== activeMeat) return false
    if (activeChip > 0 && d.tag !== subCats[activeChip]) return false
    return true
  }).map(d => ({
    ...d,
    fav: isFavorite(d.id),
  }))

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
      <div className="flex-1 flex flex-col gap-3 px-4 overflow-auto">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">猪猪小饭桌</h1>
            <p className="text-[13px] text-[var(--color-text-secondary)]">家里的温暖小饭桌 🐷</p>
          </div>
          {/* Search Bar */}
          <div className="flex items-center gap-1.5 h-9 w-[140px] rounded-[18px] bg-white border border-[var(--color-border-light)] px-3">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#949499" strokeWidth="1.5"/>
              <path d="M9.5 9.5L12 12" stroke="#949499" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xs text-[#C7C7CC]">搜索菜品</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 h-[42px]">
          <button
            onClick={() => { setActiveCat('diet'); setActiveChip(0) }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-[21px] text-sm font-medium transition-colors ${
              activeCat === 'diet'
                ? 'bg-[var(--color-secondary-green)] text-white'
                : 'bg-white border border-[var(--color-border-light)] text-[#949499]'
            }`}
          >
            <LeafIcon className={activeCat === 'diet' ? 'text-white' : 'text-[var(--color-primary)]'} />
            减脂餐
          </button>
          <button
            onClick={() => { setActiveCat('normal'); setActiveChip(0) }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-[21px] text-sm font-medium transition-colors ${
              activeCat === 'normal'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white border border-[var(--color-border-light)] text-[#949499]'
            }`}
          >
          <SpoonIcon className={activeCat === 'normal' ? 'text-white' : 'text-[var(--color-primary)]'} />
          好美味
        </button>
        </div>

        {/* Subcategory Chips — 做法 */}
        <div className="flex gap-2 h-[30px] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {subCats.map((chip, i) => (
            <button
              key={chip}
              onClick={() => setActiveChip(i)}
              className={`h-[30px] px-4 rounded-[15px] text-[13px] font-medium whitespace-nowrap transition-colors ${
                i === activeChip
                  ? (activeCat === 'diet' ? 'bg-[var(--color-secondary-green)] text-white' : 'bg-[var(--color-primary)] text-white')
                  : 'bg-white border border-[var(--color-border-light)] text-[#949499]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Meat Type Chips — 肉类分类 */}
        <div className="flex gap-2 h-[30px] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {MEAT_TYPES.map((meat) => (
            <button
              key={meat}
              onClick={() => setActiveMeat(meat)}
              className={`h-[30px] px-3.5 rounded-[15px] text-[12px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeMeat === meat
                  ? 'bg-[var(--color-bg-screen)] text-[var(--color-text-primary)] border border-[var(--color-primary)]'
                  : 'bg-white border border-[var(--color-border-light)] text-[#949499]'
              }`}
            >
              {meatIcon(meat)}
              {meat}
            </button>
          ))}
        </div>

        {/* Dish Grid — 双列布局，最多显示全部 */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          {filteredDishes.length === 0 && (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-[#949499]">
              <span className="text-3xl mb-2">🍽️</span>
              <span className="text-sm">这个分类下还没有菜品</span>
              <button
                onClick={() => navigate('/add-dish')}
                className="mt-3 text-sm text-[var(--color-primary)] font-medium"
              >
                + 添加一道新菜
              </button>
            </div>
          )}
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => navigate(`/dish/${dish.id}`)}
              className="relative flex flex-col gap-1.5 bg-white rounded-[14px] overflow-hidden cursor-pointer active:opacity-80 transition-opacity shadow-sm"
            >
              {/* Image */}
              <ImageUploader
                dishId={`home_${dish.id}`}
                className="relative h-[120px] rounded-b-[14px]"
                rounded="0 0 14px 14px"
                showHint
                src={dish.image}
              >
                <span className="text-4xl opacity-40">{dish.emoji || '🍽️'}</span>
              </ImageUploader>
              {/* Calorie badge */}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-[2px] h-[20px] px-2 rounded-[10px] bg-[var(--color-primary)] z-10">
                <CalIcon />
                <span className="text-[10px] font-medium text-white">{dish.cal} kcal</span>
              </div>
              {/* 大王喜欢 Heart Button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(dish.id) }}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm z-10 active:scale-90 transition-transform"
              >
                <HeartIcon filled={dish.fav} />
              </button>
              {/* Meat type badge */}
              <div className="absolute bottom-[54px] right-1.5 h-[18px] px-1.5 rounded-[9px] bg-[var(--color-secondary-green)]/90 flex items-center z-10">
                <span className="text-[9px] font-medium text-white">{dish.meatType}</span>
              </div>
              {/* Info */}
              <div className="px-2 pb-2">
                <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] leading-tight">{dish.name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="h-[22px] px-2.5 rounded-[11px] bg-[var(--color-bg-primary)] text-[10px] text-[var(--color-accent-fire)] font-medium flex items-center">
                    {dish.category === 'diet' ? '减脂' : '好美味'} · {dish.tag}
                  </span>
                  <span
                    onClick={(e) => { e.stopPropagation(); navigate(`/recipe/${dish.id}`) }}
                    className="ml-auto text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] cursor-pointer flex items-center gap-0.5"
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
                      <path d="M4.5 8.5V3.5l4 2.5-4 2.5z" fill="currentColor"/>
                    </svg>
                    菜谱 →
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(dish) }}
                    className="w-5 h-5 flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="删除"
                  >
                    <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                      <path d="M2.5 3.5h8M5.2 3.5V2.2a1 1 0 011-1h.6a1 1 0 011 1v1.3M3.5 3.5l.5 7a1 1 0 001 .9h2a1 1 0 001-.9l.5-7" stroke="#C0504D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/add-dish')}
        className="absolute right-4 bottom-[100px] w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/40 flex items-center justify-center active:scale-90 transition-transform z-20"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 18V6M6 12h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="删除这道菜？"
        message={deleteTarget ? `「${deleteTarget.name}」删除后将无法恢复，确定要删除吗？` : ''}
        confirmText="删除"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteDish(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />

      {/* Bottom Tab Bar */}
      <div className="flex items-center justify-around h-[84px] bg-white border-t border-[var(--color-border-light)]">
        <TabItem icon={<HomeTabIcon />} label="首页" active />
        <TabItem icon={<CartTabIcon />} label="购物车" onClick={() => navigate('/cart')} />
        <TabItem icon={<ProfileTabIcon />} label="我的" onClick={() => navigate('/profile')} />
      </div>
    </div>
  )
}

function meatIcon(meat) {
  const icons = {
    '全部': '🍽️',
    '猪肉': '🥓',
    '牛肉': '🥩',
    '鸡肉': '🍗',
    '羊肉': '🍖',
    '海鲜': '🦐',
    '蔬菜': '🥬',
  }
  return <span className="text-[11px]">{icons[meat] || '🍽️'}</span>
}

function TabItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-[var(--color-primary)]' : 'text-[#949499]'}`}>
      {icon}
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 13 12" fill="none">
      <path
        d="M6.5 12l-1.1-1C2.5 8.5 0 6.4 0 3.8 0 1.7 1.7 0 3.8 0c1.2 0 2.4.6 3.1 1.5C7.7.6 8.8 0 10 0 12.3 0 14 1.7 14 3.8c0 2.6-2.5 4.7-5.4 7.2L6.5 12z"
        fill={filled ? '#E8658A' : 'none'}
        stroke={filled ? '#E8658A' : '#949499'}
        strokeWidth="1.2"
      />
    </svg>
  )
}

/* --- SVG Icons --- */
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

function LeafIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 14s2-3 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 8c2-4 8-5 11-4 0 3-1 8-5 10-3 2-6 0-6-6z" fill="currentColor"/>
    </svg>
  )
}

function SpoonIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1.4c-1.5 0-2.6 1.1-2.6 2.6 0 1.2.8 2.2 1.9 2.5V14a.9.9 0 001.4 0V6c1.1-.3 1.9-1.3 1.9-2.5C10.6 2.5 9.5 1.4 8 1.4z" fill="currentColor"/>
    </svg>
  )
}

function CalIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 4 9" fill="none">
      <path d="M2 9C.5 9 0 7.2 0 5.8 0 4 2 .5 2 .5S4 4 4 5.8C4 7.2 3.5 9 2 9z" fill="white"/>
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
