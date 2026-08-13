import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import dishImg1 from '../assets/dishes/dish1.png'
import dishImg2 from '../assets/dishes/dish2.png'
import dishImg3 from '../assets/dishes/dish3.png'
import dishImg4 from '../assets/dishes/dish4.png'
import dishImg5 from '../assets/dishes/dish5.png'
import dishImg6 from '../assets/dishes/dish6.png'
import dishImg7 from '../assets/dishes/dish7.png'
import dishImg8 from '../assets/dishes/dish8.png'
import dishImg9 from '../assets/dishes/dish9.png'
import dishImg10 from '../assets/dishes/dish10.png'

const DishContext = createContext(null)

const STORAGE_KEY = 'piggy_dishes'
const FAV_STORAGE_KEY = 'piggy_favorites'
const EDIT_STORAGE_KEY = 'piggy_edited_dishes'
const DELETED_STORAGE_KEY = 'piggy_deleted_dishes'
const CLICKS_STORAGE_KEY = 'piggy_click_counts'

// 默认菜品（多位小红书美食博主高赞菜谱）
const DEFAULT_DISHES = [
  {
    id: 1,
    name: '农家一碗香', cal: 450, tag: '咸鲜', category: 'normal', meatType: '猪肉', emoji: '🥘', image: dishImg1,
    protein: '28g', fat: '22g', carbs: '18g', author: '村驴', time: '20 分钟', difficulty: '新手友好',
    tags: ['好美味 · 咸鲜', '高赞爆款'],
    ingredients: [
      { name: '五花肉', amount: '150g' }, { name: '螺丝椒', amount: '180g' }, { name: '鸡蛋', amount: '4个' },
      { name: '大蒜', amount: '10g' }, { name: '大葱', amount: '10g' }, { name: '生抽', amount: '20g' },
    ],
    steps: [
      { text: '螺丝椒切块，大蒜切片，大葱切葱花，五花肉切薄片备用。', tip: '五花肉选七分瘦三分肥，口感最佳' },
      { text: '空锅不放油，倒入辣椒大火翻炒至表面起虎皮盛出。', tip: '一边按压一边翻炒，约1分钟即可' },
      { text: '倒油润锅烧至冒烟，打入鸡蛋搅碎蛋黄，定型后翻面铲大块盛出。', tip: '先润锅再倒出多余油，鸡蛋更香不粘' },
      { text: '下五花肉炒至变色微焦，加配菜大火爆香，放生抽老抽蚝油白糖鸡精，下鸡蛋翻匀出锅！', tip: '' },
    ],
  },
  {
    id: 2,
    name: '风味茄子', cal: 320, tag: '酸甜', category: 'normal', meatType: '蔬菜', emoji: '🍆', image: dishImg2,
    protein: '6g', fat: '18g', carbs: '34g', author: '村驴', time: '15 分钟', difficulty: '简单快手',
    tags: ['好美味 · 酸甜', '下饭神器'],
    ingredients: [
      { name: '茄子', amount: '300g' }, { name: '蒜末', amount: '15g' }, { name: '淀粉', amount: '30g' },
      { name: '醋', amount: '15g' }, { name: '糖', amount: '20g' }, { name: '生抽', amount: '15g' },
    ],
    steps: [
      { text: '茄子切滚刀块，撒盐腌制10分钟，挤干水分后裹上淀粉。', tip: '盐腌能去涩去水，裹粉更酥脆' },
      { text: '热油七成热，下茄子炸至金黄酥脆捞出控油。', tip: '茄子分批下锅，避免粘连' },
      { text: '锅中留底油，爆香蒜末，加入醋、糖、生抽调成糖醋汁。', tip: '比例是醋:糖 = 1:1.3' },
      { text: '倒入炸好的茄子快速翻炒，裹匀酱汁即可出锅，撒葱花点缀。', tip: '' },
    ],
  },
  {
    id: 3,
    name: '葱烧大排', cal: 480, tag: '咸鲜', category: 'normal', meatType: '猪肉', emoji: '🥩', image: dishImg3,
    protein: '35g', fat: '28g', carbs: '12g', author: '村驴', time: '25 分钟', difficulty: '有点挑战',
    tags: ['好美味 · 咸鲜', '肉食狂欢'],
    ingredients: [
      { name: '猪大排', amount: '400g' }, { name: '大葱', amount: '3根' }, { name: '姜片', amount: '10g' },
      { name: '料酒', amount: '20g' }, { name: '生抽', amount: '25g' }, { name: '老抽', amount: '10g' }, { name: '白糖', amount: '10g' },
    ],
    steps: [
      { text: '大排用刀背拍松，加料酒、姜片腌制15分钟。', tip: '拍松能让肉质更嫩更容易入味' },
      { text: '热锅凉油，大排两面煎至金黄盛出。', tip: '每面约煎2分钟，不要频繁翻动' },
      { text: '锅中留底油，大葱切段爆香至焦黄色，铺在锅底。', tip: '大葱焦化后甜味出来，是灵魂所在' },
      { text: '大排回锅码在葱段上，加生抽老抽白糖和半碗水，大火烧开转小火焖10分钟收汁。', tip: '' },
    ],
  },
  {
    id: 4,
    name: '口水鸡', cal: 350, tag: '微辣', category: 'normal', meatType: '鸡肉', emoji: '🍗', image: dishImg4,
    protein: '30g', fat: '20g', carbs: '8g', author: '村驴', time: '30 分钟', difficulty: '简单快手',
    tags: ['好美味 · 微辣', '开胃必备'],
    ingredients: [
      { name: '鸡腿', amount: '3只' }, { name: '黄瓜', amount: '1根' }, { name: '花生碎', amount: '30g' },
      { name: '红油辣椒', amount: '30g' }, { name: '花椒粉', amount: '5g' }, { name: '蒜泥', amount: '15g' }, { name: '生抽', amount: '20g' },
    ],
    steps: [
      { text: '鸡腿冷水下锅加姜片料酒，大火煮开转小火煮15分钟，关火焖5分钟。', tip: '这样鸡肉鲜嫩多汁不柴' },
      { text: '捞出鸡腿放入冰水中浸泡至凉透，切块装盘。', tip: '冰水激一下皮更Q弹' },
      { text: '黄瓜切丝铺底，淋上调好的红油酱汁。', tip: '酱汁=红油辣椒+蒜泥+花椒粉+生抽+醋+糖' },
      { text: '撒上花生碎和葱花，上桌前再淋一勺热油激香。', tip: '' },
    ],
  },
  {
    id: 5,
    name: '酸辣土豆丝', cal: 180, tag: '微辣', category: 'normal', meatType: '蔬菜', emoji: '🥔', image: dishImg5,
    protein: '4g', fat: '8g', carbs: '26g', author: '村驴', time: '10 分钟', difficulty: '简单快手',
    tags: ['好美味 · 微辣', '国民下饭菜'],
    ingredients: [
      { name: '土豆', amount: '2个' }, { name: '干辣椒', amount: '5个' }, { name: '花椒', amount: '3g' },
      { name: '白醋', amount: '15g' }, { name: '盐', amount: '3g' }, { name: '蒜片', amount: '10g' },
    ],
    steps: [
      { text: '土豆切细丝，清水浸泡10分钟去除多余淀粉，沥干水分。', tip: '切得越细越好，粗细均匀是关键' },
      { text: '热锅凉油，下花椒干辣椒小火爆香后捞出花椒。', tip: '小火炸花椒油更香不苦' },
      { text: '大火倒入土豆丝快速翻炒30秒，加白醋继续翻炒。', tip: '全程大火！醋沿锅边淋入更香' },
      { text: '加盐调味，翻炒均匀即可出锅，全程不超过2分钟。', tip: '久炒就不脆了，快手是王道' },
    ],
  },
  {
    id: 6,
    name: '红烧牛肉', cal: 520, tag: '咸鲜', category: 'normal', meatType: '牛肉', emoji: '🍖', image: dishImg6,
    protein: '38g', fat: '30g', carbs: '15g', author: '村驴', time: '90 分钟', difficulty: '有点挑战',
    tags: ['好美味 · 咸鲜', '硬菜担当'],
    ingredients: [
      { name: '牛腩', amount: '500g' }, { name: '土豆', amount: '2个' }, { name: '胡萝卜', amount: '1根' },
      { name: '八角', amount: '2个' }, { name: '桂皮', amount: '1块' }, { name: '豆瓣酱', amount: '30g' }, { name: '生抽', amount: '25g' },
    ],
    steps: [
      { text: '牛腩切块冷水下锅焯水，加料酒姜片，撇净浮沫捞出。', tip: '冷水下锅才能充分逼出血沫' },
      { text: '热锅放油，下豆瓣酱小火炒出红油，加八角桂皮炒香。', tip: '豆瓣酱一定要炒出红油才够香' },
      { text: '下牛腩翻炒上色，加生抽老抽翻炒均匀，倒入足量开水。', tip: '一定要加开水！冷水会让肉紧缩变老' },
      { text: '大火烧开转小火炖1小时，加土豆胡萝卜再炖20分钟，大火收汁即可。', tip: '' },
    ],
  },
  {
    id: 7,
    name: '清蒸鲈鱼', cal: 280, tag: '清淡', category: 'diet', meatType: '海鲜', emoji: '🐟', image: dishImg7,
    protein: '32g', fat: '10g', carbs: '5g', author: '村驴', time: '20 分钟', difficulty: '简单快手',
    tags: ['减脂 · 清淡', '鲜嫩低卡'],
    ingredients: [
      { name: '鲈鱼', amount: '1条(500g)' }, { name: '姜片', amount: '15g' }, { name: '葱丝', amount: '20g' },
      { name: '蒸鱼豉油', amount: '25g' }, { name: '料酒', amount: '10g' },
    ],
    steps: [
      { text: '鲈鱼处理干净，两面各划三刀，抹上料酒和姜片腌制10分钟。', tip: '划刀不要太深，不要划到骨' },
      { text: '蒸锅水烧开后放入鱼盘，大火蒸8分钟关火，虚蒸2分钟。', tip: '一定要水开后再放鱼，计时从放鱼算' },
      { text: '倒掉盘中蒸出的腥水，铺上葱丝，淋蒸鱼豉油。', tip: '倒掉腥水这一步很关键，去腥就靠它' },
      { text: '另起锅烧热油至冒烟，浇在葱丝上激香即可上桌。', tip: '' },
    ],
  },
  {
    id: 8,
    name: '干煸四季豆', cal: 200, tag: '咸鲜', category: 'normal', meatType: '蔬菜', emoji: '🫘', image: dishImg8,
    protein: '8g', fat: '14g', carbs: '18g', author: '村驴', time: '15 分钟', difficulty: '简单快手',
    tags: ['好美味 · 咸鲜', '素菜之王'],
    ingredients: [
      { name: '四季豆', amount: '300g' }, { name: '猪肉末', amount: '50g' }, { name: '干辣椒', amount: '5个' },
      { name: '花椒', amount: '3g' }, { name: '芽菜', amount: '20g' }, { name: '生抽', amount: '15g' },
    ],
    steps: [
      { text: '四季豆去筋掰成段，沥干水分（一定要沥干！）。', tip: '有水下锅会溅油，非常危险' },
      { text: '锅中多放油，六成热下四季豆炸至表面起皱，捞出控油。', tip: '炸到表皮微皱微微焦黄就对了' },
      { text: '锅中留底油，下肉末炒至变色，加干辣椒花椒芽菜爆香。', tip: '芽菜是灵魂，没有可以用榨菜代替' },
      { text: '倒入四季豆翻炒，加生抽调味，炒匀即可出锅。', tip: '' },
    ],
  },
  {
    id: 9,
    name: '糖醋里脊', cal: 480, tag: '酸甜', category: 'normal', meatType: '猪肉', emoji: '🐷', image: dishImg9,
    protein: '26g', fat: '24g', carbs: '36g', author: '村驴', time: '30 分钟', difficulty: '有点挑战',
    tags: ['好美味 · 酸甜', '酸甜酥脆'],
    ingredients: [
      { name: '猪里脊', amount: '300g' }, { name: '鸡蛋', amount: '1个' }, { name: '淀粉', amount: '50g' },
      { name: '番茄酱', amount: '40g' }, { name: '白醋', amount: '20g' }, { name: '白糖', amount: '30g' },
    ],
    steps: [
      { text: '里脊肉切条，加料酒盐腌制15分钟，打入鸡蛋抓匀。', tip: '切条大小均匀，保证熟度一致' },
      { text: '肉条裹上淀粉，六成油温下锅炸至淡黄色捞出。', tip: '油温判断：筷子放进去冒小泡就是六成' },
      { text: '油温升至八成，复炸至金黄酥脆捞出。', tip: '复炸是酥脆的关键，不要省略' },
      { text: '另起锅少许油，下番茄酱白糖白醋炒至浓稠，倒入里脊快速翻匀。', tip: '酱汁煮到冒大泡就够浓了' },
    ],
  },
  {
    id: 10,
    name: '孜然羊肉', cal: 390, tag: '微辣', category: 'normal', meatType: '羊肉', emoji: '🍖', image: dishImg10,
    protein: '32g', fat: '24g', carbs: '8g', author: '村驴', time: '15 分钟', difficulty: '简单快手',
    tags: ['好美味 · 微辣', '西北风味'],
    ingredients: [
      { name: '羊肉', amount: '300g' }, { name: '洋葱', amount: '半个' }, { name: '孜然粉', amount: '10g' },
      { name: '辣椒面', amount: '5g' }, { name: '香菜', amount: '适量' }, { name: '生抽', amount: '15g' },
    ],
    steps: [
      { text: '羊肉切薄片，加料酒生抽淀粉腌制10分钟。', tip: '横切牛羊竖切猪，逆纹切更嫩' },
      { text: '热锅多油大火，下羊肉快速滑炒至变色盛出。', tip: '全程大火！羊肉在锅里不超过1分钟' },
      { text: '锅中留底油，下洋葱丝爆香至透明。', tip: '洋葱炒到微焦会更香' },
      { text: '羊肉回锅，撒孜然粉辣椒面快速翻匀，出锅撒香菜。', tip: '' },
    ],
  },

  // === 林大厨（中餐厅明星主厨） ===
  {
    id: 11,
    name: '肉沫土豆', cal: 350, tag: '咸鲜', category: 'normal', meatType: '猪肉', emoji: '🥔',
    protein: '18g', fat: '16g', carbs: '32g', author: '林大厨', time: '15 分钟', difficulty: '简单快手',
    tags: ['好美味 · 咸鲜', '超级下饭'],
    ingredients: [
      { name: '土豆', amount: '2个' }, { name: '猪肉沫', amount: '150g' }, { name: '洋葱', amount: '半个' },
      { name: '红彩椒', amount: '半个' }, { name: '蒜末', amount: '10g' }, { name: '生抽', amount: '30g' },
      { name: '蚝油', amount: '15g' }, { name: '白糖', amount: '10g' },
    ],
    steps: [
      { text: '土豆切薄丁，清水洗净淀粉沥干。', tip: '薄丁比厚丁更容易煎出焦脆口感' },
      { text: '热锅冷油烧至冒烟，下土豆全程大火煎至表面焦黄盛出。', tip: '油温一定要高！低了土豆不脆' },
      { text: '不用洗锅，下肉沫炒至变色，加蒜末洋葱彩椒爆香。', tip: '热锅热油不粘锅，肉沫炒干一点更香' },
      { text: '土豆回锅，淋生抽蚝油白糖和半碗水，焖2分钟勾薄芡撒葱花出锅。', tip: '' },
    ],
  },
  {
    id: 12,
    name: '辣子鸡丁', cal: 420, tag: '微辣', category: 'normal', meatType: '鸡肉', emoji: '🌶️',
    protein: '30g', fat: '22g', carbs: '18g', author: '林大厨', time: '35 分钟', difficulty: '有点挑战',
    tags: ['好美味 · 微辣', '川味经典'],
    ingredients: [
      { name: '鸡腿', amount: '6个' }, { name: '干辣椒', amount: '30g' }, { name: '花椒', amount: '20g' },
      { name: '姜蒜末', amount: '20g' }, { name: '豆瓣酱', amount: '15g' }, { name: '鸡蛋', amount: '1个' },
      { name: '淀粉', amount: '30g' }, { name: '辣椒面', amount: '50g' },
    ],
    steps: [
      { text: '鸡腿去骨切1cm丁，加鸡蛋、料酒、盐、淀粉腌制30分钟。', tip: '脱骨时把脆骨也剁下来，炸了特别好吃' },
      { text: '宽油六成热，鸡肉分三次过油，每次炸1分钟捞出。', tip: '复炸三次才酥脆！每次捞起后油再加热3分钟' },
      { text: '冷油下辣椒段花椒小火炒香，加姜蒜末豆瓣酱炒出红油。', tip: '一定要冷油开始，不然辣椒秒糊' },
      { text: '倒入鸡块，加红油翻炒，撒盐/十三香/鸡精调味，余温翻匀即可出锅。', tip: '配面条绝了！铺一层辣子鸡丁就是豪华拌面' },
    ],
  },
  {
    id: 13,
    name: '凉拌鸡胸肉', cal: 280, tag: '清淡', category: 'diet', meatType: '鸡肉', emoji: '🥗',
    protein: '35g', fat: '8g', carbs: '10g', author: '林大厨', time: '20 分钟', difficulty: '简单快手',
    tags: ['减脂 · 清淡', '健康低卡'],
    ingredients: [
      { name: '鸡胸肉', amount: '2块' }, { name: '彩椒', amount: '1个' }, { name: '黄瓜', amount: '1根' },
      { name: '柠檬', amount: '半个' }, { name: '小米辣', amount: '2个' }, { name: '香醋', amount: '45g' },
      { name: '山茶油', amount: '45g' },
    ],
    steps: [
      { text: '鸡胸肉片成手指厚度的薄片，加盐、白胡椒粉、葱姜、山茶油抓匀腌制。', tip: '片薄一点更容易低温熟透，不柴' },
      { text: '密封袋装好鸡胸肉，电饭锅保温键加热10分钟焖熟。', tip: '低温慢煮法！比水煮嫩10倍' },
      { text: '黄瓜彩椒切丁，姜蒜小米辣捣成泥，加柠檬汁、香醋、山茶油、生抽调成碗汁。', tip: '姜味重一点更提鲜' },
      { text: '鸡胸肉切丁，所有食材拌匀，淋上碗汁即可。', tip: '加点辣椒油和麻油更过瘾' },
    ],
  },

  // === 夏叔厨房（340万粉丝） ===
  {
    id: 14,
    name: '黄焖鸡', cal: 450, tag: '咸鲜', category: 'normal', meatType: '鸡肉', emoji: '🍲',
    protein: '32g', fat: '22g', carbs: '28g', author: '夏叔厨房', time: '50 分钟', difficulty: '简单快手',
    tags: ['好美味 · 咸鲜', '米饭杀手'],
    ingredients: [
      { name: '鸡全腿', amount: '2个' }, { name: '土豆', amount: '1个' }, { name: '青椒', amount: '1个' },
      { name: '干香菇', amount: '10朵' }, { name: '甜面酱', amount: '30g' }, { name: '花雕酒', amount: '30g' },
      { name: '生抽', amount: '30g' }, { name: '蚝油', amount: '15g' },
    ],
    steps: [
      { text: '干香菇提前泡发，泡香菇的水留着备用。鸡腿切块，土豆切块炸至金黄。', tip: '炸土豆能定型不散，口感更好' },
      { text: '炒糖色至冒泡，下鸡肉翻炒上色，加炸过的葱姜蒜爆香。', tip: '糖色是黄焖鸡红亮色泽的关键' },
      { text: '下香菇、甜面酱、花雕酒、生抽、蚝油翻炒均匀，倒入香菇水和热水没过鸡肉。', tip: '香菇水是鲜味来源，不要倒掉' },
      { text: '加土豆，大火烧开转小火炖40分钟，砂锅放油炒青椒后转入，大火收汁2分钟出锅。', tip: '' },
    ],
  },

  // === 潘姥姥（510万粉丝） ===
  {
    id: 15,
    name: '农家小炒肉', cal: 380, tag: '微辣', category: 'normal', meatType: '猪肉', emoji: '🔥',
    protein: '24g', fat: '26g', carbs: '10g', author: '潘姥姥', time: '10 分钟', difficulty: '简单快手',
    tags: ['好美味 · 微辣', '经典湘味'],
    ingredients: [
      { name: '五花肉', amount: '250g' }, { name: '青线椒', amount: '200g' }, { name: '大蒜', amount: '15g' },
      { name: '豆豉', amount: '10g' }, { name: '生抽', amount: '20g' }, { name: '老抽', amount: '5g' },
    ],
    steps: [
      { text: '五花肉切薄片，青线椒斜切成圈，大蒜拍碎。', tip: '五花肉冷冻半小时再切，薄如纸' },
      { text: '锅不放油，下青椒圈干煸至表面微焦起虎皮盛出。', tip: '干煸去生味，辣椒更香' },
      { text: '热锅少油，下五花肉煸炒至卷曲出油呈灯盏窝状。', tip: '煸到微焦才香，多余的油可以倒出来炒菜' },
      { text: '加蒜、豆豉爆香，倒入青椒，淋生抽老抽大火翻匀出锅。', tip: '' },
    ],
  },

  // === 凡妈小厨房（410万粉丝） ===
  {
    id: 16,
    name: '红烧排骨', cal: 480, tag: '咸鲜', category: 'normal', meatType: '猪肉', emoji: '🦴',
    protein: '34g', fat: '30g', carbs: '14g', author: '凡妈小厨房', time: '60 分钟', difficulty: '有点挑战',
    tags: ['好美味 · 咸鲜', '家常硬菜'],
    ingredients: [
      { name: '排骨', amount: '500g' }, { name: '冰糖', amount: '30g' }, { name: '八角', amount: '2个' },
      { name: '桂皮', amount: '1块' }, { name: '香叶', amount: '2片' }, { name: '生抽', amount: '30g' },
      { name: '老抽', amount: '10g' }, { name: '料酒', amount: '20g' },
    ],
    steps: [
      { text: '排骨冷水下锅加料酒姜片焯水，撇净浮沫捞出温水洗净。', tip: '一定要用温水洗，冷水冲会让肉质紧缩' },
      { text: '小火炒冰糖至琥珀色冒泡，快速下排骨翻炒上色。', tip: '糖色变深就在一瞬间，手速要快' },
      { text: '加八角桂皮香叶炒香，淋生抽老抽料酒翻炒均匀。', tip: '先炒香料再淋酱油，香味翻倍' },
      { text: '加开水没过排骨，大火烧开转小火炖45分钟，挑出香料大火收汁至浓稠。', tip: '' },
    ],
  },
]

// 合并默认菜（剔除已删除的）、编辑覆盖、用户自建菜 → 当前全部菜品
function buildDishes(edited, deleted, userDishes) {
  const base = DEFAULT_DISHES
    .filter(d => !deleted.includes(d.id))
    .map(d => ({ ...d, ...(edited[d.id] || {}) }))
  return [...base, ...userDishes]
}

export function DishProvider({ children }) {
  const [editedDishes, setEditedDishes] = useState(() => {
    try {
      const stored = localStorage.getItem(EDIT_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) { /* ignore */ }
    return {}
  })

  const [deletedIds, setDeletedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(DELETED_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) { /* ignore */ }
    return []
  })

  const [dishes, setDishes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const userDishes = stored ? JSON.parse(stored) : []
      return buildDishes(editedDishes, deletedIds, userDishes)
    } catch (e) { return buildDishes(editedDishes, deletedIds, []) }
  })

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAV_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) { /* ignore */ }
    return []
  })

  useEffect(() => {
    try { localStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(editedDishes)) } catch (e) { /* ignore */ }
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const userDishes = stored ? JSON.parse(stored) : []
      setDishes(buildDishes(editedDishes, deletedIds, userDishes))
    } catch (e) {
      setDishes(buildDishes(editedDishes, deletedIds, []))
    }
  }, [editedDishes, deletedIds])

  const updateDish = useCallback((dishId, updates) => {
    const id = Number(dishId)
    const isDefault = DEFAULT_DISHES.some(d => d.id === id)
    if (isDefault) {
      setEditedDishes(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }))
    } else {
      setDishes(prev => {
        const updated = prev.map(d => d.id === id ? { ...d, ...updates } : d)
        const userDishes = updated.filter(d => !DEFAULT_DISHES.find(dd => dd.id === d.id))
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userDishes)) } catch (e) { /* ignore */ }
        return updated
      })
    }
  }, [])

  const addDish = useCallback((dish) => {
    const newId = Date.now()
    const newDish = { id: newId, emoji: '🍽️', author: '我自己', meatType: '猪肉', ...dish }
    setDishes(prev => {
      const updated = [...prev, newDish]
      const userDishes = updated.filter(d => !DEFAULT_DISHES.find(dd => dd.id === d.id))
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userDishes)) } catch (e) { /* ignore */ }
      return updated
    })
    return newId
  }, [])

  const getDish = useCallback((id) => {
    return dishes.find(d => d.id === Number(id))
  }, [dishes])

  const deleteDish = useCallback((id) => {
    const numId = Number(id)
    const isDefault = DEFAULT_DISHES.some(d => d.id === numId)
    if (isDefault) {
      // 默认菜：记入删除集合并持久化，重建逻辑会自动剔除
      setDeletedIds(prev => {
        const next = prev.includes(numId) ? prev : [...prev, numId]
        try { localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(next)) } catch (e) { /* ignore */ }
        return next
      })
    } else {
      // 用户自建菜：直接从列表与 localStorage 中移除
      setDishes(prev => {
        const updated = prev.filter(d => d.id !== numId)
        const userDishes = updated.filter(d => !DEFAULT_DISHES.find(dd => dd.id === d.id))
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userDishes)) } catch (e) { /* ignore */ }
        return updated
      })
    }
  }, [])

  const toggleFavorite = useCallback((dishId) => {
    setFavorites(prev => {
      const id = Number(dishId)
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      try { localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(updated)) } catch (e) { /* ignore */ }
      return updated
    })
  }, [])

  const isFavorite = useCallback((dishId) => {
    return favorites.includes(Number(dishId))
  }, [favorites])

  const favoriteDishes = dishes.filter(d => favorites.includes(d.id))

  const [clickCounts, setClickCounts] = useState(() => {
    try {
      const stored = localStorage.getItem(CLICKS_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) { /* ignore */ }
    return {}
  })

  const incrementClick = useCallback((dishId) => {
    const id = Number(dishId)
    setClickCounts(prev => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 }
      try { localStorage.setItem(CLICKS_STORAGE_KEY, JSON.stringify(next)) } catch (e) { /* ignore */ }
      return next
    })
  }, [])

  const getClickCount = useCallback((dishId) => {
    return clickCounts[Number(dishId)] || 0
  }, [clickCounts])

  const topClickedDish = (() => {
    if (Object.keys(clickCounts).length === 0) return null
    const topId = Object.entries(clickCounts).sort((a, b) => b[1] - a[1])[0][0]
    return dishes.find(d => d.id === Number(topId)) || null
  })()

  const totalClicks = Object.values(clickCounts).reduce((sum, n) => sum + n, 0)

  return (
    <DishContext.Provider value={{
      dishes, addDish, getDish, deleteDish, updateDish,
      favorites, toggleFavorite, isFavorite, favoriteDishes,
      clickCounts, incrementClick, getClickCount, topClickedDish, totalClicks,
    }}>
      {children}
    </DishContext.Provider>
  )
}

export function useDishes() {
  const ctx = useContext(DishContext)
  if (!ctx) throw new Error('useDishes must be used within DishProvider')
  return ctx
}
