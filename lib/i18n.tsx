'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type Lang = 'en' | 'zh' | 'ms'

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "zh", label: "中文", short: "中" },
  { code: "ms", label: "Bahasa Melayu", short: "MS" },
]

type Dict = Record<string, { en: string; zh: string; ms: string }>

// Central dictionary. Add keys here; components read via t('key').
export const dict: Dict = {
  'app.name': { en: 'MicroBOT-X', zh: 'MicroBOT-X', ms: 'MicroBOT-X' },
  'app.tagline': {
    en: 'Learn micro:bit the interactive way',
    zh: '以互动方式学习 micro:bit',
    ms: 'Belajar micro:bit secara interaktif',
  },
  'nav.features': { en: 'Features', zh: '功能', ms: 'Ciri' },
  'nav.topics': { en: 'Topics', zh: '主题', ms: 'Topik' },
  'nav.login': { en: 'Log in', zh: '登录', ms: 'Log masuk' },
  'nav.getStarted': { en: 'Get started', zh: '开始使用', ms: 'Mula sekarang' },
  'nav.dashboard': { en: 'Dashboard', zh: '仪表盘', ms: 'Papan pemuka' },
  'nav.logout': { en: 'Log out', zh: '退出登录', ms: 'Log keluar' },

  'home.heroTitle': {
    en: 'Master micro:bit with AI-powered, hands-on learning',
    zh: '借助 AI 与动手实践，掌握 micro:bit',
    ms: 'Kuasai micro:bit dengan pembelajaran praktikal berkuasa AI',
  },
  'home.heroSubtitle': {
    en: 'Interactive lessons, embedded MakeCode, three-level quizzes, and a personal AI tutor — all in one place for students and teachers.',
    zh: '互动课程、内嵌 MakeCode、三级测验，以及专属 AI 导师——为师生打造的一站式平台。',
    ms: 'Pelajaran interaktif, MakeCode terbenam, kuiz tiga peringkat, dan tutor AI peribadi — semua di satu tempat untuk pelajar dan guru.',
  },
  'home.ctaStudent': { en: 'Start learning', zh: '开始学习', ms: 'Mula belajar' },
  'home.ctaTeacher': {
    en: 'I am a teacher',
    zh: '我是老师',
    ms: 'Saya seorang guru',
  },
  'home.featuresTitle': {
    en: 'Everything you need to learn micro:bit',
    zh: '学习 micro:bit 所需的一切',
    ms: 'Semua yang anda perlukan untuk belajar micro:bit',
  },
  'feature.materials.title': {
    en: 'Interactive materials',
    zh: '互动学习材料',
    ms: 'Bahan interaktif',
  },
  'feature.materials.desc': {
    en: 'Images, videos and notes organized by topic to guide every step.',
    zh: '按主题组织的图文、视频与笔记，引导每一步学习。',
    ms: 'Imej, video dan nota disusun mengikut topik untuk membimbing setiap langkah.',
  },
  'feature.makecode.title': {
    en: 'Embedded MakeCode',
    zh: '内嵌 MakeCode',
    ms: 'MakeCode terbenam',
  },
  'feature.makecode.desc': {
    en: 'Program your micro:bit right inside the platform — no switching tabs.',
    zh: '直接在平台内为 micro:bit 编程，无需切换标签页。',
    ms: 'Programkan micro:bit terus dalam platform — tanpa bertukar tab.',
  },
  'feature.quiz.title': {
    en: 'Three-level quizzes',
    zh: '三级测验',
    ms: 'Kuiz tiga peringkat',
  },
  'feature.quiz.desc': {
    en: 'Assessments at three difficulty levels to match every learner.',
    zh: '三种难度的评估，适配不同能力的学习者。',
    ms: 'Penilaian pada tiga tahap kesukaran untuk setiap pelajar.',
  },
  'feature.ai.title': {
    en: 'AI chat assistant',
    zh: 'AI 聊天助手',
    ms: 'Pembantu sembang AI',
  },
  'feature.ai.desc': {
    en: 'Ask questions any time and get instant, friendly guidance.',
    zh: '随时提问，获得即时而友好的指导。',
    ms: 'Tanya soalan bila-bila masa dan dapatkan panduan segera.',
  },
  'feature.feedback.title': {
    en: 'Personalized feedback',
    zh: '个性化反馈',
    ms: 'Maklum balas peribadi',
  },
  'feature.feedback.desc': {
    en: 'AI analyzes your quiz results and suggests what to improve.',
    zh: 'AI 分析你的测验结果并给出改进建议。',
    ms: 'AI menganalisis keputusan kuiz anda dan mencadangkan penambahbaikan.',
  },
  'feature.dashboard.title': {
    en: 'Teacher dashboard',
    zh: '教师仪表盘',
    ms: 'Papan pemuka guru',
  },
  'feature.dashboard.desc': {
    en: 'Manage classes, monitor progress and review marks with ease.',
    zh: '轻松管理班级、监控进度并审阅成绩。',
    ms: 'Urus kelas, pantau kemajuan dan semak markah dengan mudah.',
  },

  'student.welcomeTitle': {
    en: 'Welcome to your learning journey 🌟',
    zh: '欢迎来到学习之旅 🌟',
    ms: 'Selamat datang ke perjalanan pembelajaran 🌟',
  },
  'student.welcomeSubtitle': {
    en: 'Learning is a beautiful journey, each step brings you closer to the light of wisdom.',
    zh: '学习是一段美丽的旅程，每一步都让你更接近智慧的光芒。',
    ms: 'Pembelajaran adalah perjalanan yang indah, setiap langkah membawa anda lebih dekat kepada cahaya kebijaksanaan.',
  },
  'student.joinClass': {
    en: 'Join Class',
    zh: '加入班级',
    ms: 'Sertai Kelas',
  },
  'student.enterCode': {
    en: 'Enter class code',
    zh: '输入班级代码',
    ms: 'Masukkan kod kelas',
  },
  'student.confirm': {
    en: 'Confirm',
    zh: '确认',
    ms: 'Sahkan',
  },
  'student.learningContent': {
    en: 'Learning Content',
    zh: '学习内容',
    ms: 'Kandungan Pembelajaran',
  },
  'student.basic': {
    en: 'Basic',
    zh: '基础',
    ms: 'Asas',
  },
  'student.input': {
    en: 'Input',
    zh: '输入',
    ms: 'Input',
  },
  'student.music': {
    en: 'Music',
    zh: '音乐',
    ms: 'Muzik',
  },
  'student.myQuiz': {
    en: 'My Quiz',
    zh: '我的测验',
    ms: 'Kuiz Saya',
  },
  'student.beginnerQuiz': {
    en: 'Beginner Quiz',
    zh: '初级测验',
    ms: 'Kuiz Permulaan',
  },
  'student.intermediateQuiz': {
    en: 'Intermediate Quiz',
    zh: '中级测验',
    ms: 'Kuiz Pertengahan',
  },
  'student.advancedQuiz': {
    en: 'Advanced Quiz',
    zh: '高级测验',
    ms: 'Kuiz Lanjutan',
  },
  'student.myResults': {
    en: 'My Quiz Results',
    zh: '我的测验成果',
    ms: 'Keputusan Kuiz Saya',
  },
  'student.openResults': {
    en: 'Open Results',
    zh: '打开成果',
    ms: 'Buka Keputusan',
  },
  'student.learningChallenge': {
  en: 'Learning Challenge',
  zh: '学习挑战',
  ms: 'Cabaran Pembelajaran',
}

  // Auth
  'auth.signIn': { en: 'Sign in', zh: '登录', ms: 'Log masuk' },
  'auth.signUp': { en: 'Sign up', zh: '注册', ms: 'Daftar' },
  'auth.email': { en: 'Email', zh: '邮箱', ms: 'E-mel' },
  'auth.password': { en: 'Password', zh: '密码', ms: 'Kata laluan' },
  'auth.name': { en: 'Full name', zh: '姓名', ms: 'Nama penuh' },
  'auth.role': { en: 'I am a...', zh: '我的身份是……', ms: 'Saya seorang...' },
  'auth.student': { en: 'Student', zh: '学生', ms: 'Pelajar' },
  'auth.teacher': { en: 'Teacher', zh: '老师', ms: 'Guru' },
  'auth.haveAccount': {
    en: 'Already have an account?',
    zh: '已有账号？',
    ms: 'Sudah ada akaun?',
  },
  'auth.noAccount': {
    en: "Don't have an account?",
    zh: '还没有账号？',
    ms: 'Tiada akaun?',
  },
  'auth.signInTitle': { en: 'Welcome back', zh: '欢迎回来', ms: 'Selamat kembali' },
  'auth.signUpTitle': {
    en: 'Create your account',
    zh: '创建你的账号',
    ms: 'Cipta akaun anda',
  },
  'auth.forgotPassword': {
  en: 'Forgot your password?',
  zh: '忘记密码？',
  ms: 'Lupa kata laluan?',
  },
  'auth.processing': { en: 'Please wait...', zh: '请稍候……', ms: 'Sila tunggu...' },

  // Common
  'common.back': { en: 'Back', zh: '返回', ms: 'Kembali' },
  'common.save': { en: 'Save', zh: '保存', ms: 'Simpan' },
  'common.cancel': { en: 'Cancel', zh: '取消', ms: 'Batal' },
  'common.loading': { en: 'Loading...', zh: '加载中……', ms: 'Memuatkan...' },
  'common.submit': { en: 'Submit', zh: '提交', ms: 'Hantar' },
  'common.close': { en: 'Close', zh: '关闭', ms: 'Tutup' },

  // Student
  'student.welcome': { en: 'Welcome', zh: '欢迎', ms: 'Selamat datang' },
  'student.myProgress': { en: 'My progress', zh: '我的进度', ms: 'Kemajuan saya' },
  'student.continueLearning': {
    en: 'Continue learning',
    zh: '继续学习',
    ms: 'Teruskan belajar',
  },
  'student.topics': { en: 'Learning topics', zh: '学习主题', ms: 'Topik pembelajaran' },
  'student.results': { en: 'My results', zh: '我的成绩', ms: 'Keputusan saya' },
  'student.chat': { en: 'AI assistant', zh: 'AI 助手', ms: 'Pembantu AI' },
  'student.startLesson': { en: 'Open lesson', zh: '打开课程', ms: 'Buka pelajaran' },
  'student.notesTab': { en: 'Notes', zh: '笔记', ms: 'Nota' },
  'student.mediaTab': { en: 'Media', zh: '媒体', ms: 'Media' },
  'student.codeTab': { en: 'MakeCode', zh: 'MakeCode', ms: 'MakeCode' },
  'student.quizTab': { en: 'Quizzes', zh: '测验', ms: 'Kuiz' },
  'student.level': { en: 'Level', zh: '等级', ms: 'Tahap' },
  'student.startQuiz': { en: 'Start quiz', zh: '开始测验', ms: 'Mula kuiz' },
  'student.retakeQuiz': { en: 'Retake', zh: '重新测验', ms: 'Ulang' },
  'student.bestScore': { en: 'Best score', zh: '最佳成绩', ms: 'Markah terbaik' },
  'student.notAttempted': {
    en: 'Not attempted yet',
    zh: '尚未尝试',
    ms: 'Belum dicuba',
  },
  'student.joinCode': { en: 'Class join code', zh: '班级加入码', ms: 'Kod kelas' },
  'student.chooseLanguage': {
  en: 'Choose learning language',
  zh: '选择学习语言',
  ms: 'Pilih bahasa pembelajaran',
  },

  // Quiz
  'quiz.question': { en: 'Question', zh: '题目', ms: 'Soalan' },
  'quiz.of': { en: 'of', zh: '/', ms: 'daripada' },
  'quiz.next': { en: 'Next', zh: '下一题', ms: 'Seterusnya' },
  'quiz.finish': { en: 'Finish quiz', zh: '完成测验', ms: 'Tamat kuiz' },
  'quiz.yourScore': { en: 'Your score', zh: '你的得分', ms: 'Markah anda' },
  'quiz.aiFeedback': { en: 'AI feedback', zh: 'AI 反馈', ms: 'Maklum balas AI' },
  'quiz.analyzing': {
    en: 'Analyzing your performance...',
    zh: '正在分析你的表现……',
    ms: 'Menganalisis prestasi anda...',
  },
  'quiz.backToTopic': {
    en: 'Back to topic',
    zh: '返回主题',
    ms: 'Kembali ke topik',
  },

  // Chat
  'chat.title': { en: 'AI Learning Assistant', zh: 'AI 学习助手', ms: 'Pembantu Pembelajaran AI' },
  'chat.placeholder': {
    en: 'Ask anything about micro:bit...',
    zh: '关于 micro:bit 尽管问……',
    ms: 'Tanya apa sahaja tentang micro:bit...',
  },
  'chat.empty': {
    en: 'Ask me about buttons, LEDs, sensors, or your code!',
    zh: '向我提问按钮、LED、传感器或你的代码吧！',
    ms: 'Tanya saya tentang butang, LED, penderia, atau kod anda!',
  },
  'chat.send': { en: 'Send', zh: '发送', ms: 'Hantar' },

  // Teacher
  // 通用
  'common.view': { en: 'View', zh: '查看', ms: 'Lihat' },
  'common.editProfile': { en: 'Edit Profile', zh: '编辑资料', ms: 'Sunting Profil' },

  // 头像
  'auth.chooseFile': { en: 'Choose File', zh: '选择文件', ms: 'Pilih Fail' },
  'auth.avatar': { en: 'Avatar', zh: '头像', ms: 'Gambar Profil' }, 
  'auth.selectedFile': { en: 'Selected File', zh: '已选择文件', ms: 'Fail Dipilih' },
  
  'teacher.welcomeTitle': {
  en: 'Welcome back, Teacher!',
  zh: '欢迎回来，老师！',
  ms: 'Selamat kembali, Cikgu!',
  },
  'teacher.welcomeSubtitle': {
    en: 'Welcome, respected teacher! This is your space to manage classes and students.',
    zh: '欢迎您，尊敬的老师！这里是您管理班级与学生的空间',
    ms: 'Selamat datang, cikgu yang dihormati! Inilah ruang anda untuk mengurus kelas dan pelajar.',
  },
  'teacher.enterClass': {
    en: 'Enter class name',
    zh: '请输入班级名称',
    ms: 'Masukkan nama kelas',
  },
  'teacher.createClass': {
    en: 'Create Class',
    zh: '创建班级',
    ms: 'Cipta Kelas',
  },
  'teacher.noClasses': {
    en: "You don't have any classes yet, please create one",
    zh: '您还没有班级，请先创建一个',
    ms: 'Anda belum mempunyai kelas, sila cipta dahulu',
  },
  'teacher.classesTable': {
    en: 'Class Management',
    zh: '班级管理',
    ms: 'Pengurusan Kelas',
  },
  'teacher.addStudent': {
    en: 'Add Student',
    zh: '添加学生',
    ms: 'Tambah Pelajar',
  },
  'teacher.enterStudent': {
    en: 'Enter student account or invitation code',
    zh: '输入学生账号或邀请码',
    ms: 'Masukkan akaun atau kod jemputan pelajar',
  },
  'teacher.studentName': {
    en: 'Student Name',
    zh: '学生姓名',
    ms: 'Nama Pelajar',
  },
  'teacher.quizScore': {
    en: 'Quiz Score',
    zh: '测验成绩',
    ms: 'Markah Kuiz',
  },
  'teacher.evaluation': {
    en: 'Evaluation',
    zh: '评语',
    ms: 'Penilaian',
  },
  'teacher.writeEvaluation': {
    en: 'Write evaluation',
    zh: '填写评语',
    ms: 'Tulis penilaian',
  },
  'teacher.noStudents': {
    en: 'No students in this class yet',
    zh: '当前班级还没有学生',
    ms: 'Tiada pelajar dalam kelas ini lagi',
  },
}


type UIStrings = {
  widgetTitle: string
  widgetSubtitle: string
  openLabel: string
  closeLabel: string
  inputPlaceholder: string
  send: string
  stop: string
  thinking: string
  emptyTitle: string
  emptyBody: string
  quizAttached: string
  evaluateQuiz: string
  langLabel: string
  errorMessage: string
  billingMessage: string
  suggestions: string[]
}

export const UI: Record<Lang, UIStrings> = {
  en: {
    widgetTitle: "micro:bit Helper",
    widgetSubtitle: "Ask questions & get quiz feedback",
    openLabel: "Open chat assistant",
    closeLabel: "Close chat",
    inputPlaceholder: "Ask me anything about micro:bit...",
    send: "Send",
    stop: "Stop",
    thinking: "Thinking...",
    emptyTitle: "Hi! I'm your micro:bit helper.",
    emptyBody: "Ask me about coding, sensors, buttons, or send your quiz results and I'll help you review them.",
    quizAttached: "Quiz results loaded",
    evaluateQuiz: "Evaluate my quiz results",
    langLabel: "Language",
    errorMessage: "Something went wrong. Please try again.",
    billingMessage:
      "The AI service isn't active yet. The site owner needs to add a free Google Gemini API key (GOOGLE_GENERATIVE_AI_API_KEY) to the project. Once that's done, I'll be able to reply.",
    suggestions: ["How do I use the button?", "What is an accelerometer?", "Evaluate my quiz results"],
  },
  ms: {
    widgetTitle: "Pembantu micro:bit",
    widgetSubtitle: "Tanya soalan & dapat maklum balas kuiz",
    openLabel: "Buka pembantu sembang",
    closeLabel: "Tutup sembang",
    inputPlaceholder: "Tanya apa sahaja tentang micro:bit...",
    send: "Hantar",
    stop: "Berhenti",
    thinking: "Sedang berfikir...",
    emptyTitle: "Hai! Saya pembantu micro:bit anda.",
    emptyBody:
      "Tanya saya tentang pengekodan, penderia, butang, atau hantar keputusan kuiz anda dan saya akan bantu semak.",
    quizAttached: "Keputusan kuiz dimuatkan",
    evaluateQuiz: "Nilai keputusan kuiz saya",
    langLabel: "Bahasa",
    errorMessage: "Sesuatu tidak kena. Sila cuba lagi.",
    billingMessage:
      "Perkhidmatan AI belum aktif. Pemilik laman perlu menambah kunci API Google Gemini percuma (GOOGLE_GENERATIVE_AI_API_KEY) pada projek. Selepas itu, saya boleh menjawab.",
    suggestions: ["Bagaimana guna butang?", "Apa itu akselerometer?", "Nilai keputusan kuiz saya"],
  },
  zh: {
    widgetTitle: "micro:bit 助手",
    widgetSubtitle: "提问问题 & 获取测验反馈",
    openLabel: "打开聊天助手",
    closeLabel: "关闭聊天",
    inputPlaceholder: "问我任何关于 micro:bit 的问题...",
    send: "发送",
    stop: "停止",
    thinking: "思考中...",
    emptyTitle: "你好！我是你的 micro:bit 助手。",
    emptyBody: "问我关于编程、传感器、按钮的问题，或把你的测验结果发给我，我会帮你评估。",
    quizAttached: "已加载测验结果",
    evaluateQuiz: "评估我的测验结果",
    langLabel: "语言",
    errorMessage: "出错了，请再试一次。",
    billingMessage:
      "AI 服务尚未启用。网站管理员需要在项目中添加一个免费的 Google Gemini API 密钥（GOOGLE_GENERATIVE_AI_API_KEY）。完成后我就能回复你了。",
    suggestions: ["按钮怎么用？", "什么是加速度传感器？", "评估我的测验结果"],
  },
}

export const LANGUAGE_NAMES: Record<Lang, string> = {
  en: "English",
  ms: "Malay (Bahasa Melayu)",
  zh: "Chinese (中文)",
}

type I18nContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem('mbx-lang') as Lang | null
    if (stored && ['en', 'zh', 'ms'].includes(stored)) setLangState(stored)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    window.localStorage.setItem('mbx-lang', l)
  }, [])

  const t = useCallback(
    (key: string) => {
      const entry = dict[key]
      if (!entry) return key
      return entry[lang] ?? entry.en
    },
    [lang],
  )

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
