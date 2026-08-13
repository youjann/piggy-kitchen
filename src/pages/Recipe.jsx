import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ImageUploader from '../components/ImageUploader'
import { useDishes } from '../context/DishContext'

export default function Recipe() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getDish } = useDishes()
  const [activeTab, setActiveTab] = useState('text')

  const dish = getDish(id)
  const steps = dish?.steps || []
  const name = dish?.name || '菜品'
  const time = dish?.time || '20 分钟'
  const difficulty = dish?.difficulty || '新手友好'
  const cal = dish?.cal || 0
  const author = dish?.author || '博主'

  return (
    <div className="flex flex-col h-screen">
      {/* Video / Recipe Photo — 可上传 */}
      <div className="relative w-full h-[220px]">
        <ImageUploader
          dishId={`recipe_${id}`}
          className="absolute inset-0 w-full h-full"
          rounded="0"
          showHint
        >
          <span className="text-5xl opacity-20">🎬</span>
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

        {/* Video Badge */}
        <div className="absolute top-[62px] right-4 flex items-center gap-1 h-[26px] px-2.5 rounded-[13px] bg-[var(--color-primary)] z-10">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4.5" fill="white"/>
            <path d="M7 5L4 7V3l3 2z" fill="var(--color-primary)"/>
          </svg>
          <span className="text-[10px] text-white font-medium">{author}视频</span>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <svg width="22" height="22" viewBox="0 0 13 15" fill="none">
              <path d="M1 1l11 6.5L1 14V1z" fill="#EB6A35"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="flex-1 bg-white rounded-t-[24px] -mt-5 relative z-10 px-5 pt-5 pb-4 flex flex-col gap-4 overflow-auto">
        {/* Title + Meta */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#1A1A2E]">{name} · 做法</h1>
            <button
              onClick={() => navigate(`/edit-dish/${id}`)}
              className="flex items-center gap-1 h-7 px-3 rounded-[14px] bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] text-[11px] text-[var(--color-text-secondary)] font-medium active:scale-95 transition-transform"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8.5 1.5a1.414 1.414 0 012 2l-7 7L1 11.5l1-2.5 7-7z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              编辑菜谱
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-[#949499]">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <circle cx="5.5" cy="5.5" r="4.5" stroke="#949499" strokeWidth="1"/>
                <path d="M5.5 3v3l2 1.5" stroke="#949499" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              {time}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#949499]">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1L7 4.5l3.5.5L8 7.5 8.5 11 5.5 9 2.5 11 3 7.5 1 5l3.5-.5L5.5 1z" fill="#EB6A35"/>
              </svg>
              {difficulty}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#949499]">
              <CalIcon2 />
              {cal} kcal
            </div>
          </div>
        </div>

        {/* Tab Row */}
        <div className="flex gap-1 bg-[var(--color-bg-primary)] rounded-xl p-1">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 h-8 rounded-[10px] text-[13px] font-medium transition-colors ${
              activeTab === 'text' ? 'bg-white text-[#1A1A2E] shadow-sm' : 'text-[#949499]'
            }`}
          >
            文字版
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 h-8 rounded-[10px] text-[13px] font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'video' ? 'bg-white text-[#1A1A2E] shadow-sm' : 'text-[#949499]'
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 11 12" fill="none">
              <circle cx="5.5" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
              <path d="M7 6L5 4.5v3L7 6z" fill="currentColor"/>
            </svg>
            视频版 3:24
          </button>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1A1A2E]">制作步骤</span>
            <span className="text-[11px] text-[#949499]">{steps.length} 步</span>
          </div>

          {steps.length === 0 && (
            <p className="text-sm text-[#C7C7CC] text-center py-8">暂无制作步骤</p>
          )}

          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              {/* Step Number */}
              <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">{i + 1}</span>
              </div>
              {/* Step Content */}
              <div className={`flex-1 flex flex-col ${step.tip ? 'gap-1' : ''} pt-1`}>
                <p className="text-[13px] text-[#1A1A2E] leading-[1.6]">{step.text}</p>
                {step.tip && (
                  <p className="text-[11px] text-[var(--color-primary)]">{step.tip}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Spacer */}
        <div className="h-8" />
      </div>
    </div>
  )
}

function CalIcon2() {
  return (
    <svg width="10" height="10" viewBox="0 0 4 9" fill="none">
      <path d="M2 9C.5 9 0 7.2 0 5.8 0 4 2 .5 2 .5S4 4 4 5.8C4 7.2 3.5 9 2 9z" fill="#EB6A35"/>
    </svg>
  )
}
