import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDishes } from '../context/DishContext'

const CATEGORIES = [
  { key: 'diet', label: '减脂餐' },
  { key: 'normal', label: '好美味' },
]

const SUB_CATS = {
  diet: ['酸甜', '清淡', '微辣', '咸鲜'],
  normal: ['酸甜', '清淡', '微辣', '咸鲜'],
}

const MEAT_TYPES = ['猪肉', '牛肉', '鸡肉', '羊肉', '海鲜', '蔬菜']
const MEAT_EMOJIS = { '猪肉': '🥓', '牛肉': '🥩', '鸡肉': '🍗', '羊肉': '🍖', '海鲜': '🦐', '蔬菜': '🥬' }

export default function AddDish() {
  const navigate = useNavigate()
  const { addDish } = useDishes()
  const fileInputRef = useRef(null)

  const [photo, setPhoto] = useState(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('normal')
  const [subCat, setSubCat] = useState('酸甜')
  const [meatType, setMeatType] = useState('猪肉')
  const [cal, setCal] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('')
  const [carbs, setCarbs] = useState('')
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '' },
    { name: '', amount: '' },
  ])
  const [steps, setSteps] = useState([
    { text: '', tip: '' },
  ])

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCatChange = (key) => {
    setCategory(key)
    setSubCat(SUB_CATS[key][0])
  }

  const updateIngredient = (i, field, val) => {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing))
  }
  const addIngredient = () => setIngredients(prev => [...prev, { name: '', amount: '' }])
  const removeIngredient = (i) => setIngredients(prev => prev.filter((_, idx) => idx !== i))

  const updateStep = (i, field, val) => {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }
  const addStep = () => setSteps(prev => [...prev, { text: '', tip: '' }])
  const removeStep = (i) => setSteps(prev => prev.filter((_, idx) => idx !== i))

  const canSave = name.trim() && cal.trim()

  const handleSave = () => {
    if (!canSave) return
    const validIngredients = ingredients.filter(ing => ing.name.trim())
    const validSteps = steps.filter(s => s.text.trim())

    const newId = addDish({
      name: name.trim(),
      cal: Number(cal) || 0,
      tag: subCat,
      category,
      meatType,
      photo,
      protein: protein || '—',
      fat: fat || '—',
      carbs: carbs || '—',
      tags: [
        `${category === 'diet' ? '减脂' : '好美味'} · ${subCat}`,
        '自家出品',
      ],
      ingredients: validIngredients.map(ing => ({ name: ing.name.trim(), amount: ing.amount.trim() || '适量' })),
      steps: validSteps.map(s => ({ text: s.text.trim(), tip: s.tip.trim() })),
    })

    // 把照片存到 localStorage 给 ImageUploader 用
    if (photo) {
      try {
        localStorage.setItem(`dish_img_home_${newId}`, photo)
        localStorage.setItem(`dish_img_hero_${newId}`, photo)
      } catch (e) { /* ignore */ }
    }

    navigate(`/dish/${newId}`)
  }

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

      {/* Nav Bar */}
      <div className="flex items-center justify-between h-11 px-4">
        <button onClick={() => navigate(-1)} className="text-sm text-[var(--color-text-secondary)]">取消</button>
        <span className="text-base font-semibold text-[var(--color-text-primary)]">新建菜品</span>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`text-sm font-semibold transition-colors ${
            canSave ? 'text-[var(--color-primary)]' : 'text-[#C7C7CC]'
          }`}
        >
          保存
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto px-4 pb-8 flex flex-col gap-4">
        {/* Photo Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-[180px] rounded-[14px] overflow-hidden cursor-pointer bg-gradient-to-br from-[var(--color-secondary-green)] to-[var(--color-primary)]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          {photo ? (
            <>
              <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white text-xs font-medium drop-shadow-sm">更换照片</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-white text-sm font-medium">上传菜品照片</span>
              <span className="text-white/70 text-[11px]">点击选择图片</span>
            </div>
          )}
        </div>

        {/* Dish Name */}
        <FormField label="菜名">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="比如：家常红烧肉"
            className="w-full h-11 rounded-[12px] bg-white border border-[var(--color-border-light)] px-4 text-sm text-[var(--color-text-primary)] placeholder:text-[#C7C7CC] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </FormField>

        {/* Category */}
        <FormField label="分类">
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => handleCatChange(cat.key)}
                className={`flex-1 h-11 rounded-[12px] text-sm font-medium transition-colors ${
                  category === cat.key
                    ? 'bg-[var(--color-secondary-green)] text-white'
                    : 'bg-white border border-[var(--color-border-light)] text-[#949499]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </FormField>

        {/* Sub-category */}
        <FormField label="做法分类">
          <div className="flex flex-wrap gap-2">
            {SUB_CATS[category].map(sc => (
              <button
                key={sc}
                onClick={() => setSubCat(sc)}
                className={`h-9 px-4 rounded-[10px] text-[13px] font-medium transition-colors ${
                  subCat === sc
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white border border-[var(--color-border-light)] text-[#949499]'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        </FormField>

        {/* Meat Type */}
        <FormField label="肉类分类">
          <div className="flex flex-wrap gap-2">
            {MEAT_TYPES.map(mt => (
              <button
                key={mt}
                onClick={() => setMeatType(mt)}
                className={`h-9 px-4 rounded-[10px] text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
                  meatType === mt
                    ? 'bg-[var(--color-secondary-green)] text-white'
                    : 'bg-white border border-[var(--color-border-light)] text-[#949499]'
                }`}
              >
                <span>{MEAT_EMOJIS[mt]}</span>
                {mt}
              </button>
            ))}
          </div>
        </FormField>

        {/* Calories */}
        <FormField label="卡路里 (kcal)">
          <input
            value={cal}
            onChange={e => setCal(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="450"
            inputMode="numeric"
            className="w-full h-11 rounded-[12px] bg-white border border-[var(--color-border-light)] px-4 text-sm text-[var(--color-text-primary)] placeholder:text-[#C7C7CC] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </FormField>

        {/* Nutrition */}
        <FormField label="营养成分（选填）">
          <div className="flex gap-2">
            <NutritionInput label="蛋白质" value={protein} onChange={setProtein} placeholder="28g" />
            <NutritionInput label="脂肪" value={fat} onChange={setFat} placeholder="22g" />
            <NutritionInput label="碳水" value={carbs} onChange={setCarbs} placeholder="18g" />
          </div>
        </FormField>

        {/* Ingredients */}
        <FormField label={`食材清单（${ingredients.filter(i => i.name.trim()).length}）`}>
          <div className="flex flex-col gap-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={ing.name}
                  onChange={e => updateIngredient(i, 'name', e.target.value)}
                  placeholder="食材名称"
                  className="flex-1 h-10 rounded-[10px] bg-white border border-[var(--color-border-light)] px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[#C7C7CC] outline-none focus:border-[var(--color-primary)] transition-colors"
                />
                <input
                  value={ing.amount}
                  onChange={e => updateIngredient(i, 'amount', e.target.value)}
                  placeholder="用量"
                  className="w-20 h-10 rounded-[10px] bg-white border border-[var(--color-border-light)] px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[#C7C7CC] outline-none focus:border-[var(--color-primary)] transition-colors"
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(i)}
                    className="w-8 h-8 flex items-center justify-center text-[#C7C7CC] hover:text-[var(--color-accent-fire)] flex-shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addIngredient}
              className="h-10 rounded-[10px] border border-dashed border-[var(--color-border-light)] text-[var(--color-text-secondary)] text-sm flex items-center justify-center gap-1.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 11V3M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              添加食材
            </button>
          </div>
        </FormField>

        {/* Steps */}
        <FormField label={`制作步骤（${steps.filter(s => s.text.trim()).length}）`}>
          <div className="flex flex-col gap-3">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-[12px] border border-[var(--color-border-light)] p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(i)}
                      className="w-6 h-6 flex items-center justify-center text-[#C7C7CC] hover:text-[var(--color-accent-fire)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
                <textarea
                  value={step.text}
                  onChange={e => updateStep(i, 'text', e.target.value)}
                  placeholder={`第 ${i + 1} 步：描述制作过程`}
                  rows={2}
                  className="w-full bg-[var(--color-bg-primary)] rounded-[8px] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[#C7C7CC] outline-none resize-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                />
                <input
                  value={step.tip}
                  onChange={e => updateStep(i, 'tip', e.target.value)}
                  placeholder="小贴士（选填）"
                  className="w-full h-8 bg-[var(--color-bg-primary)] rounded-[8px] px-3 text-xs text-[var(--color-text-secondary)] placeholder:text-[#C7C7CC] outline-none focus:ring-1 focus:ring-[var(--color-secondary-green)] transition-all"
                />
              </div>
            ))}
            <button
              onClick={addStep}
              className="h-10 rounded-[10px] border border-dashed border-[var(--color-border-light)] text-[var(--color-text-secondary)] text-sm flex items-center justify-center gap-1.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 11V3M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              添加步骤
            </button>
          </div>
        </FormField>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`h-12 rounded-full text-white text-sm font-semibold shadow-lg transition-all ${
            canSave
              ? 'bg-[var(--color-primary)] shadow-[var(--color-primary)]/40 active:scale-95'
              : 'bg-[#C7C7CC] shadow-none'
          }`}
        >
          保存菜品
        </button>
      </div>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</span>
      {children}
    </div>
  )
}

function NutritionInput({ label, value, onChange, placeholder }) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <span className="text-[11px] text-[var(--color-text-secondary)]">{label}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 rounded-[10px] bg-white border border-[var(--color-border-light)] px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[#C7C7CC] outline-none focus:border-[var(--color-primary)] transition-colors"
      />
    </div>
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
