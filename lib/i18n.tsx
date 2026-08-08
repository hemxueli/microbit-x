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
    en: 'Discover micro:bit through fun and play',
    zh: '用趣味与探索开启 micro:bit 之旅',
    ms: 'Terokai micro:bit dengan cara yang menyeronokkan',
  },
  'nav.features': { en: 'Features', zh: '功能', ms: 'Ciri' },
  'nav.topics': { en: 'Topics', zh: '主题', ms: 'Topik' },
  'nav.login': { en: 'Log in', zh: '登录', ms: 'Log masuk' },
  'nav.getStarted': { en: 'Get started', zh: '开始使用', ms: 'Mula sekarang' },
  'nav.dashboard': { en: 'Dashboard', zh: '仪表盘', ms: 'Papan pemuka' },
  'nav.logout': { en: 'Log out', zh: '退出登录', ms: 'Log keluar' },

  'home.heroTitle': {
    en: 'Master micro:bit with AI and hands-on adventures',
    zh: '借助 AI 与动手探险，掌握 micro:bit',
    ms: 'Kuasai micro:bit dengan AI dan pembelajaran praktikal',
  },

  
  'home.heroSubtitle': {
    en: 'Dive into interactive lessons, build with MakeCode, challenge yourself with interesting quizzes, and chat with your personal AI tutor — all in one exciting platform.',
    zh: '沉浸于互动课程，玩转 MakeCode，挑战趣味测验，并与专属 AI 导师交流——这一切尽在充满乐趣的平台。',
    ms: 'Sertai pelajaran interaktif, bina dengan MakeCode, cabar diri dengan kuiz menarik, dan berbual dengan tutor AI peribadi — semuanya dalam satu platform yang menyeronokkan.',
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
  en: 'Rich and engaging learning materials',
  zh: '丰富有趣的学习内容',
  ms: 'Bahan pembelajaran yang menarik dan kaya',
  },
  
  'feature.materials.desc': {
    en: 'Provides interactive courses and resources to help students master micro:bit with ease.',
    zh: '提供大量互动课程与素材，让学生在探索中轻松掌握 micro:bit。',
    ms: 'Menyediakan kursus interaktif dan sumber untuk membantu pelajar menguasai micro:bit dengan mudah.',
  },

  'feature.quiz.title': {
    en: 'Basic student quizzes',
    zh: '基础学生测验',
    ms: 'Kuiz asas pelajar',
  },
  'feature.quiz.desc': {
    en: 'Carefully designed tests help beginners check their learning progress and improve step by step.',
    zh: '精心设计的测试帮助初学者检验学习成果，逐步提升能力。',
    ms: 'Ujian yang direka dengan teliti membantu pelajar baharu menilai kemajuan pembelajaran dan meningkatkan tahap secara beransur.',
  },

  'feature.ai.title': {
    en: 'AI chat assistant',
    zh: 'AI 聊天助手',
    ms: 'Pembantu sembang AI',
  },
  'feature.ai.desc': {
    en: 'Ask questions anytime and get instant, friendly guidance like having a personal tutor.',
    zh: '随时提问，获得即时而友好的指导，就像身边有一位专属导师。',
    ms: 'Boleh bertanya pada bila-bila masa dan mendapat panduan mesra serta segera, seolah-olah mempunyai tutor peribadi.',
  },

  'feature.feedback.title': {
    en: 'Personalized feedback',
    zh: '个性化反馈',
    ms: 'Maklum balas peribadi',
  },
  'feature.feedback.desc': {
    en: 'AI analyzes your learning and quiz results to provide tailored suggestions for improvement.',
    zh: 'AI 会分析你的学习与测验结果，给出针对性的改进建议，助你不断进步。',
    ms: 'AI menganalisis pembelajaran dan keputusan kuiz anda untuk memberikan cadangan penambahbaikan yang disesuaikan.',
  },

  'feature.dashboard.title': {
    en: 'Easy class management for teachers',
    zh: '教师轻松管理班级',
    ms: 'Pengurusan kelas mudah untuk guru',
  },
  'feature.dashboard.desc': {
    en: 'The teacher dashboard makes class management, progress tracking, and grading simple and efficient.',
    zh: '教师仪表盘让班级管理、进度监控和成绩评估变得简单高效。',
    ms: 'Papan pemuka guru memudahkan pengurusan kelas, pemantauan kemajuan, dan penilaian dengan lebih cekap.',
  },

  'quiz.start': {en: 'START', zh: '开始', ms: 'MULA',},

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
  },

  'analysis.title': {
  en: 'AI Analysis Result',
  zh: 'AI 分析结果',
  ms: 'Hasil Analisis AI',
  },
  'analysis.save': {
    en: 'Save Analysis',
    zh: '保存分析',
    ms: 'Simpan Analisis',
  },
  'analysis.exit': {
    en: 'Exit',
    zh: '退出',
    ms: 'Keluar',
  },
  'analysis.stop': {
    en: 'Stop Generation',
    zh: '停止生成',
    ms: 'Hentikan Penjanaan',
  },
  'analysis.error': {
    en: 'AI analysis failed, please check configuration.',
    zh: 'AI 分析失败，请检查配置。',
    ms: 'Analisis AI gagal, sila semak konfigurasi.',
  },
  'analysis.success': {
    en: 'AI analysis saved successfully!',
    zh: 'AI 分析已保存！',
    ms: 'Analisis AI berjaya disimpan!',
  },

  "makecode.open": { "en": "Open MakeCode", "zh": "打开 MakeCode", "ms": "Buka MakeCode" },
  "makecode.title": { "en": "MakeCode Editor", "zh": "MakeCode 编辑器", "ms": "Editor MakeCode" },
  "makecode.confirmText": { "en": "Do you want to jump to MakeCode official editor?", "zh": "要跳转到 MakeCode 官方编辑器吗？", "ms": "Adakah anda mahu pergi ke editor rasmi MakeCode?" },
  "makecode.yes": { "en": "Yes", "zh": "确定", "ms": "Ya" },
  "makecode.no": { "en": "Cancel", "zh": "取消", "ms": "Batal" },
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

  'forgot.title': {
  en: 'Forgot Password',
  zh: '忘记密码',
  ms: 'Lupa Kata Laluan',
  },

  'forgot.placeholder': {
    en: 'Enter your email',
    zh: '请输入邮箱',
    ms: 'Masukkan emel anda',
  },

  'forgot.button': {
    en: 'Send Reset Code',
    zh: '发送验证码',
    ms: 'Hantar Kod Reset',
  },

  'forgot.success': {
    en: 'Please check your email for the reset code.',
    zh: '请检查邮箱获取验证码。',
    ms: 'Sila semak emel anda untuk kod reset.',
  },

  'reset.title': {
  en: 'Reset Password',
  zh: '重置密码',
    ms: 'Tetapkan Semula Kata Laluan',
  },

  'reset.code': {
    en: 'Enter verification code',
    zh: '输入验证码',
    ms: 'Masukkan kod pengesahan',
  },

  'reset.newPassword': {
    en: 'Enter new password',
    zh: '输入新密码',
    ms: 'Masukkan kata laluan baharu',
  },

  'reset.confirmPassword': {
    en: 'Confirm new password',
    zh: '确认新密码',
    ms: 'Sahkan kata laluan baharu',
  },

  'reset.success': {
    en: 'Password reset successful.',
    zh: '密码重置成功。',
    ms: 'Kata laluan berjaya ditetapkan semula.',
  },

  'reset.error': {
    en: 'Invalid or expired code.',
    zh: '验证码无效或已过期。',
    ms: 'Kod tidak sah atau telah tamat tempoh.',
  },

  'reset.mismatch': {
    en: 'Passwords do not match.',
    zh: '两次输入的密码不一致。',
    ms: 'Kata laluan tidak sepadan.',
  },

  'forgot.emailButton': {
  en: 'Send Reset Email',
  zh: '发送重置邮件',
  ms: 'Hantar Emel Reset',
  },

  'reset.button': {
  en: 'Update Password',
  zh: '更新密码',
  ms: 'Kemas kini Kata Laluan',
  },

  'student.myClass': {
  en: 'My Class',
  zh: '我的班级',
  ms: 'Kelas Saya',
},

'student.leaveClass': {
  en: 'Leave Class',
  zh: '退出班级',
  ms: 'Keluar Kelas',
},

'student.teacher': {
  en: 'Teacher',
  zh: '老师',
  ms: 'Cikgu',
},

'student.assignments': {
  en: 'Assignments',
  zh: '作业',
  ms: 'Kerja Rumah',
},

'student.noAssignments': {
  en: 'No assignments yet',
  zh: '还没有作业',
  ms: 'Belum ada kerja rumah',
},

'student.createdAt': {
  en: 'Created at',
  zh: '创建时间',
  ms: 'Dibuat pada',
},

'student.submitAssignment': {
  en: 'Submit Assignment',
  zh: '提交作业',
  ms: 'Hantar Kerja Rumah',
},

'student.inputTextOrLink': {
  en: 'Enter text or link',
  zh: '输入文字或链接',
  ms: 'Masukkan teks atau pautan',
},

'student.commentsFromTeacher': {
  en: 'Comments from Teacher',
  zh: '老师的评语',
  ms: 'Komen daripada Cikgu',
},

'student.noComments': {
  en: 'No comments yet',
  zh: '还没有评语',
  ms: 'Belum ada komen',
},

  // Common
  'common.back': { en: 'Back', zh: '返回', ms: 'Kembali' },
  'common.save': { en: 'Save', zh: '保存', ms: 'Simpan' },
  'common.cancel': { en: 'Cancel', zh: '取消', ms: 'Batal' },
  'common.loading': { en: 'Loading...', zh: '加载中……', ms: 'Memuatkan...' },
  'common.submit': { en: 'Submit', zh: '提交', ms: 'Hantar' },
  'common.close': { en: 'Close', zh: '关闭', ms: 'Tutup' },
  'common.delete': { en: 'Delete', zh: '删除', ms: 'Hapus' },
  "common.english": {
      "en": "English",
      "zh": "英语",
      "ms": "Bahasa Inggeris"
    },
    "common.chinese": {
      "en": "Chinese",
      "zh": "中文",
      "ms": "Bahasa Cina"
    },
    "common.malay": {
      "en": "Malay",
      "zh": "马来语",
      "ms": "Bahasa Melayu"
    },
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


  // 分析列表页面
  'analysis.listTitle': {
    en: 'My Analysis Records',
    zh: '我的分析记录',
    ms: 'Rekod Analisis Saya',
  },
  'analysis.noRecords': {
    en: 'No analysis records',
    zh: '暂无分析记录',
    ms: 'Tiada rekod analisis',
  },
  'analysis.savedAt': {
    en: 'Saved at',
    zh: '保存时间',
    ms: 'Disimpan pada',
  },
  'analysis.deleteFailed': {
    en: 'Delete failed',
    zh: '删除失败',
    ms: 'Padam gagal',
  },
  'analysis.loading': {
    en: 'Loading analysis records...',
    zh: '正在加载分析记录...',
    ms: 'Sedang memuatkan rekod analisis...',
  },

  'analysis.generating': {
    en: 'Generating analysis...',
    zh: '正在生成分析...',
    ms: 'Sedang menjana analisis...',
  },
  'analysis.failed': {
    en: 'Analysis failed',
    zh: '分析失败',
    ms: 'Analisis gagal',
  },
  'analysis.score': {
    en: 'Score',
    zh: '得分',
    ms: 'Markah',
  },
  'analysis.completedAt': {
    en: 'Completed at',
    zh: '完成时间',
    ms: 'Selesai pada',
  },
  'analysis.question': {
    en: 'Question',
    zh: '题目',
    ms: 'Soalan',
  },
  'analysis.yourAnswer': {
    en: 'Your answer',
    zh: '你的答案',
    ms: 'Jawapan anda',
  },
  'analysis.correctAnswer': {
    en: 'Correct answer',
    zh: '正确答案',
    ms: 'Jawapan betul',
  },
  'analysis.correct': {
    en: 'Correct',
    zh: '答对了',
    ms: 'Betul',
  },
  'analysis.incorrect': {
    en: 'Incorrect',
    zh: '答错了',
    ms: 'Salah',
  },
  'analysis.aiFeedback': {
    en: 'AI Feedback',
    zh: 'AI 分析反馈',
    ms: 'Maklum balas AI',
  },
 
  'analysis.saveFailed': {
    en: 'Save failed',
    zh: '保存失败',
    ms: 'Simpan gagal'},

    "quiz.Basic Quiz": {
      "en": "Basic Quiz",
      "zh": "基础测验",
      "ms": "Kuiz Asas"
    },
    "quiz.Music Quiz": {
      "en": "Music Quiz",
      "zh": "音乐测验",
      "ms": "Kuiz Muzik"
    },
    "quiz.Input Quiz": {
      "en": "Input Quiz",
      "zh": "输入测验",
      "ms": "Kuiz Input"
    },
    "student.analysis": {
      "en": "Analysis Record",
      "zh": "分析记录",
      "ms": "Rekod Analisis"
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

    // Quiz 标题翻译
  'quiz.basic': {
    en: 'Quiz: MakeCode Basic',
    zh: '测验：MakeCode 基本',
    ms: 'Kuiz: MakeCode Asas',
  },
  'quiz.input': {
    en: 'Quiz: MakeCode Input',
    zh: '测验：MakeCode 输入',
    ms: 'Kuiz: MakeCode Input',
  },
  'quiz.music': {
    en: 'Quiz: MakeCode Music',
    zh: '测验：MakeCode 音乐',
    ms: 'Kuiz: MakeCode Muzik',
  },

  // 音乐控制按钮
  'quiz.sound': {
    en: 'Sound',
    zh: '声音',
    ms: 'Bunyi',
  },
  'quiz.mute': {
    en: 'Mute',
    zh: '静音',
    ms: 'Senyap',
  },

  // Basic Quiz
  'quiz.basic.q1': {
    en: 'Which category contains the Show Icon block?',
    zh: '哪一个类别包含 Show Icon 积木？',
    ms: 'Kategori manakah yang mempunyai blok Show Icon?',
  },
  'quiz.basic.q1.options': {
    en: 'Music, Input, Basic, Logic',
    zh: '音乐, 输入, 基本, 逻辑',
    ms: 'Muzik, Input, Asas, Logik',
  },
  'quiz.basic.q1.answer': { en: 'Basic', zh: '基本', ms: 'Asas' },

  'quiz.basic.q2': {
    en: 'What does the Show Number block do?',
    zh: 'Show Number 积木有什么作用？',
    ms: 'Apakah fungsi blok Show Number?',
  },
  'quiz.basic.q2.options': {
    en: 'Plays music, Displays a number, Detects temperature, Turns off the micro:bit',
    zh: '播放音乐, 显示数字, 检测温度, 关闭 micro:bit',
    ms: 'Mainkan muzik, Paparkan nombor, Mengesan suhu, Matikan micro:bit',
  },
  'quiz.basic.q2.answer': { en: 'Displays a number', zh: '显示数字', ms: 'Paparkan nombor' },

  'quiz.basic.q3': {
    en: 'Which block is used to display words such as "HELLO"?',
    zh: '哪一个积木可以显示 "HELLO" 这样的文字？',
    ms: 'Blok manakah digunakan untuk memaparkan perkataan seperti "HELLO"?',
  },
  'quiz.basic.q3.options': {
    en: 'Show Number, Show Icon, Show String, Pause',
    zh: '显示数字, 显示图示, 显示字符串, 暂停',
    ms: 'Paparkan nombor, Paparkan ikon, Paparkan rentetan, Jeda',
  },
  'quiz.basic.q3.answer': { en: 'Show String', zh: '显示字符串', ms: 'Paparkan rentetan' },

  'quiz.basic.q4': {
    en: 'Which block allows you to create your own 5×5 LED pattern?',
    zh: '哪一个积木可以自己设计 5×5 LED 图案？',
    ms: 'Blok manakah membolehkan anda mereka bentuk corak LED 5×5 sendiri?',
  },
  'quiz.basic.q4.options': {
    en: 'Show Arrow, Show Icon, Show LEDs, Clear Screen',
    zh: '显示箭头, 显示图示, 显示 LED, 清除屏幕',
    ms: 'Paparkan anak panah, Paparkan ikon, Paparkan LED, Kosongkan skrin',
  },
  'quiz.basic.q4.answer': { en: 'Show LEDs', zh: '显示 LED', ms: 'Paparkan LED' },

  'quiz.basic.q5': {
    en: 'Which block repeats the program continuously?',
    zh: '哪一个积木会不断重复执行程序？',
    ms: 'Blok manakah akan mengulangi program secara berterusan?',
  },
  'quiz.basic.q5.options': {
    en: 'Pause, On Start, Forever, Show Number',
    zh: '暂停, 当开始时, 永远, 显示数字',
    ms: 'Jeda, Semasa mula, Selamanya, Paparkan nombor',
  },
  'quiz.basic.q5.answer': { en: 'Forever', zh: '永远', ms: 'Selamanya' },

  'quiz.basic.q6': {
    en: 'Which block runs only once when the program starts?',
    zh: '哪一个积木会在程序开始时执行一次？',
    ms: 'Blok manakah hanya dijalankan sekali apabila program bermula?',
  },
  'quiz.basic.q6.options': {
    en: 'Forever, Show Icon, Pause, On Start',
    zh: '永远, 显示图示, 暂停, 当开始时',
    ms: 'Selamanya, Paparkan ikon, Jeda, Semasa mula',
  },
  'quiz.basic.q6.answer': { en: 'On Start', zh: '当开始时', ms: 'Semasa mula' },

  'quiz.basic.q7': {
    en: 'What does the Pause (ms) block do?',
    zh: 'Pause (毫秒) 积木有什么作用？',
    ms: 'Apakah fungsi blok Pause (ms)?',
  },
  'quiz.basic.q7.options': {
    en: 'Shows an icon, Clears the screen, Delays the program for a period of time, Displays a number',
    zh: '显示图示, 清除屏幕, 程序暂停一段时间, 显示数字',
    ms: 'Paparkan ikon, Kosongkan skrin, Jeda program seketika, Paparkan nombor',
  },
  'quiz.basic.q7.answer': { en: 'Delays the program for a period of time', zh: '程序暂停一段时间', ms: 'Jeda program seketika' },

  'quiz.basic.q8': {
    en: 'Which block clears all LEDs on the micro:bit screen?',
    zh: '哪一个积木可以清除 micro:bit 上所有 LED？',
    ms: 'Blok manakah memadam semua paparan LED pada micro:bit?',
  },
  'quiz.basic.q8.options': {
    en: 'Show LEDs, Show String, Pause, Clear Screen',
    zh: '显示 LED, 显示字符串, 暂停, 清除屏幕',
    ms: 'Paparkan LED, Paparkan rentetan, Jeda, Kosongkan skrin',
  },
  'quiz.basic.q8.answer': { en: 'Clear Screen', zh: '清除屏幕', ms: 'Kosongkan skrin' },

  'quiz.basic.q9': {
    en: 'Which block is used to display a direction such as North or East?',
    zh: '哪一个积木可以显示 North（北）或 East（东）等方向？',
    ms: 'Blok manakah digunakan untuk memaparkan arah seperti North atau East?',
  },
  'quiz.basic.q9.options': {
    en: 'Show Icon, Show LEDs, Show String, Show Arrow',
    zh: '显示图示, 显示 LED, 显示字符串, 显示箭头',
    ms: 'Paparkan ikon, Paparkan LED, Paparkan rentetan, Paparkan anak panah',
  },
  'quiz.basic.q9.answer': { en: 'Show Arrow', zh: '显示箭头', ms: 'Paparkan anak panah' },

  'quiz.basic.q10': {
    en: 'How many directions are available in the Show Arrow block?',
    zh: 'Show Arrow 积木共有几个方向可以选择？',
    ms: 'Berapakah jumlah arah yang terdapat dalam blok Show Arrow?',
  },
  'quiz.basic.q10.options': {
    en: '4, 6, 8, 10',
    zh: '4, 6, 8, 10',
    ms: '4, 6, 8, 10',
  },
  'quiz.basic.q10.answer': { en: '8', zh: '8', ms: '8' },

  // Input Quiz
  'quiz.input.q1': {
    en: 'Which category is used to receive information from buttons, sensors, and the environment?',
    zh: '哪一个类别用于接收按钮、传感器和周围环境的信息？',
    ms: 'Kategori manakah digunakan untuk menerima maklumat daripada butang, sensor dan persekitaran?',
  },
  'quiz.input.q1.options': {
    en: 'Basic, Input, Music, Loops',
    zh: '基本, 输入, 音乐, 循环',
    ms: 'Asas, Input, Muzik, Gelung',
  },
  'quiz.input.q1.answer': { en: 'Input', zh: '输入', ms: 'Input' },

  'quiz.input.q2': {
    en: 'Which block runs when Button A is pressed?',
    zh: '当按下 A 按钮时，哪一个积木会执行？',
    ms: 'Blok manakah dijalankan apabila Butang A ditekan?',
  },
  'quiz.input.q2.options': {
    en: 'Show Number, Forever, On Button A Pressed, Show Icon',
    zh: '显示数字, 永远, 当按下 A 按钮时, 显示图示',
    ms: 'Paparkan nombor, Selamanya, Semasa Butang A ditekan, Paparkan ikon',
  },
  'quiz.input.q2.answer': { en: 'On Button A Pressed', zh: '当按下 A 按钮时', ms: 'Semasa Butang A ditekan' },

  'quiz.input.q3': {
    en: 'Which gesture is detected when you shake the micro:bit?',
    zh: '当你摇动 micro:bit 时，会检测到哪一种动作？',
    ms: 'Gerakan manakah dikesan apabila anda menggoncang micro:bit?',
  },
  'quiz.input.q3.options': {
    en: 'Tilt Left, Logo Up, Shake, Screen Down',
    zh: '左倾斜, Logo 朝上, 摇动, 屏幕朝下',
    ms: 'Condong kiri, Logo menghadap atas, Goncang, Skrin menghadap bawah',
  },
  'quiz.input.q3.answer': { en: 'Shake', zh: '摇动', ms: 'Goncang' },

  'quiz.input.q4': {
    en: 'Which block is used to detect the brightness of the surrounding environment?',
    zh: '哪一个积木可以检测周围环境的亮度？',
    ms: 'Blok manakah digunakan untuk mengesan tahap kecerahan persekitaran?',
  },
  'quiz.input.q4.options': {
    en: 'Temperature, Compass Heading, Light Level, Sound Level',
    zh: '温度, 指南针方向, 光线强度, 声音强度',
    ms: 'Suhu, Arah kompas, Tahap cahaya, Tahap bunyi',
  },
  'quiz.input.q4.answer': { en: 'Light Level', zh: '光线强度', ms: 'Tahap cahaya' },

  'quiz.input.q5': {
    en: 'Which block measures the surrounding temperature?',
    zh: '哪一个积木可以测量周围温度？',
    ms: 'Blok manakah mengukur suhu persekitaran?',
  },
  'quiz.input.q5.options': {
    en: 'Light Level, Temperature, Acceleration, Rotation',
    zh: '光线强度, 温度, 加速度, 旋转',
    ms: 'Tahap cahaya, Suhu, Pecutan, Putaran',
  },
  'quiz.input.q5.answer': { en: 'Temperature', zh: '温度', ms: 'Suhu' },

  'quiz.input.q6': {
    en: 'Which pins can be used as touch or input pins on the micro:bit?',
    zh: 'micro:bit 的哪几个引脚可以作为输入引脚？',
    ms: 'Pin manakah boleh digunakan sebagai pin sentuhan atau input pada micro:bit?',
  },
  'quiz.input.q6.options': {
    en: 'P3; P4; P5, P0; P1; P2, P6; P7; P8, P9; P10; P11',
    zh: 'P3; P4; P5, P0; P1; P2, P6; P7; P8, P9; P10; P11',
    ms: 'P3; P4; P5, P0; P1; P2, P6; P7; P8, P9; P10; P11',
  },
  'quiz.input.q6.answer': { en: 'P0; P1; P2', zh: 'P0; P1; P2', ms: 'P0; P1; P2' },

  'quiz.input.q7': {
    en: 'Which block tells the direction (North, East, South, or West)?',
    zh: '哪一个积木可以显示方向（北、东、南、西）？',
    ms: 'Blok manakah menunjukkan arah seperti Utara, Timur, Selatan atau Barat?',
  },
  'quiz.input.q7.options': {
    en: 'Temperature, Light Level, Compass Heading, Running Time',
    zh: '温度, 光线强度, 指南针方向, 运行时间',
    ms: 'Suhu, Tahap cahaya, Arah kompas, Masa berjalan',
  },
  'quiz.input.q7.answer': { en: 'Compass Heading', zh: '指南针方向', ms: 'Arah kompas' },

  'quiz.input.q8': {
    en: 'Which block measures movement or acceleration?',
    zh: '哪一个积木可以测量移动或加速度？',
    ms: 'Blok manakah mengukur pergerakan atau pecutan?',
  },
  'quiz.input.q8.options': {
    en: 'Rotation, Sound Level, Acceleration, Temperature',
    zh: '旋转, 声音强度, 加速度, 温度',
    ms: 'Putaran, Tahap bunyi, Pecutan, Suhu',
  },
  'quiz.input.q8.answer': { en: 'Acceleration', zh: '加速度', ms: 'Pecutan' },

  'quiz.input.q9': {
    en: 'Which block can detect a loud sound? (micro:bit V2)',
    zh: '哪一个积木可以检测到很大的声音？（micro:bit V2）',
    ms: 'Blok manakah boleh mengesan bunyi yang kuat? (micro:bit V2)',
  },
  'quiz.input.q9.options': {
    en: 'Show Icon, Pause, Forever, On Loud Sound',
    zh: '显示图示, 暂停, 永远, 当检测到大声音时',
    ms: 'Paparkan ikon, Jeda, Selamanya, Semasa bunyi kuat',
  },
  'quiz.input.q9.answer': { en: 'On Loud Sound', zh: '当检测到大声音时', ms: 'Semasa bunyi kuat' },

  'quiz.input.q10': {
    en: 'What is the main purpose of the Input category?',
    zh: 'Input 类别的主要作用是什么？',
    ms: 'Apakah tujuan utama kategori Input?',
  },
  'quiz.input.q10.options': {
    en: 'To display icons and text, To play music, To receive input from users and sensors, To draw LED patterns only',
    zh: '显示图示和文字, 播放音乐, 接收来自用户和传感器的输入, 只绘制 LED 图案',
    ms: 'Memaparkan ikon dan teks, Memainkan muzik, Menerima input daripada pengguna dan sensor, Melukis corak LED sahaja',
  },
  'quiz.input.q10.answer': { en: 'To receive input from users and sensors', zh: '接收来自用户和传感器的输入', ms: 'Menerima input daripada pengguna dan sensor' },

  'quiz.music.q1': {
    en: 'Which category is used to play sounds and music on the micro:bit?',
    zh: '哪一个类别用于让 micro:bit 播放声音和音乐？',
    ms: 'Kategori manakah digunakan untuk memainkan bunyi dan muzik pada micro:bit?',
  },
  'quiz.music.q1.options': {
    en: 'Basic, Input, Music, Logic',
    zh: '基本, 输入, 音乐, 逻辑',
    ms: 'Asas, Input, Muzik, Logik',
  },
  'quiz.music.q1.answer': { en: 'Music', zh: '音乐', ms: 'Muzik' },

  'quiz.music.q2': {
    en: 'Which block is used to play a melody?',
    zh: '哪一个积木用于播放旋律？',
    ms: 'Blok manakah digunakan untuk memainkan melodi?',
  },
  'quiz.music.q2.options': {
    en: 'Show Icon, Play Melody, Show Number, Temperature',
    zh: '显示图标, 播放旋律, 显示数字, 温度',
    ms: 'Tunjuk Ikon, Mainkan Melodi, Tunjuk Nombor, Suhu',
  },
  'quiz.music.q2.answer': { en: 'Play Melody', zh: '播放旋律', ms: 'Mainkan Melodi' },

  'quiz.music.q3': {
    en: 'What does the Play Tone block do?',
    zh: 'Play Tone 积木有什么作用？',
    ms: 'Apakah fungsi blok Play Tone?',
  },
  'quiz.music.q3.options': {
    en: 'Displays text, Detects light, Plays a musical note or tone, Measures temperature',
    zh: '显示文字, 检测光线, 播放音符或音调, 测量温度',
    ms: 'Paparkan teks, Mengesan cahaya, Mainkan nota atau nada muzik, Ukur suhu',
  },
  'quiz.music.q3.answer': { en: 'Plays a musical note or tone', zh: '播放音符或音调', ms: 'Mainkan nota atau nada muzik' },

  'quiz.music.q4': {
    en: 'Which block is used to stop all sounds?',
    zh: '哪一个积木用于停止所有声音？',
    ms: 'Blok manakah digunakan untuk menghentikan semua bunyi?',
  },
  'quiz.music.q4.options': {
    en: 'Set Volume, Rest, Ring Tone, Stop All Sounds',
    zh: '设置音量, 休止, 铃声, 停止所有声音',
    ms: 'Tetapkan Volum, Rehat, Nada Dering, Hentikan Semua Bunyi',
  },
  'quiz.music.q4.answer': { en: 'Stop All Sounds', zh: '停止所有声音', ms: 'Hentikan Semua Bunyi' },

  'quiz.music.q5': {
    en: 'What is the function of the Set Volume block?',
    zh: 'Set Volume 积木有什么作用？',
    ms: 'Apakah fungsi blok Set Volume?',
  },
  'quiz.music.q5.options': {
    en: 'Changes LED brightness, Adjusts the sound volume, Changes the temperature, Changes the screen',
    zh: '改变 LED 亮度, 调整音量, 改变温度, 改变显示',
    ms: 'Ubah kecerahan LED, Laraskan volum bunyi, Ubah suhu, Ubah paparan',
  },
  'quiz.music.q5.answer': { en: 'Adjusts the sound volume', zh: '调整音量', ms: 'Laraskan volum bunyi' },

  'quiz.music.q6': {
    en: 'Which value is commonly used as the default volume?',
    zh: '哪一个数值通常是默认音量？',
    ms: 'Nilai manakah biasanya digunakan sebagai tahap bunyi lalai?',
  },
  'quiz.music.q6.options': {
    en: '0, 50, 127, 2550',
    zh: '0, 50, 127, 2550',
    ms: '0, 50, 127, 2550',
  },
  'quiz.music.q6.answer': { en: '127', zh: '127', ms: '127' },

  'quiz.music.q7': {
    en: 'What does Tempo (BPM) control?',
    zh: 'Tempo（BPM） 控制什么？',
    ms: 'Apakah yang dikawal oleh Tempo (BPM)?',
  },
  'quiz.music.q7.options': {
    en: 'Screen brightness, LED pattern, The speed of the music, Temperature',
    zh: '屏幕亮度, LED 图案, 音乐速度, 温度',
    ms: 'Kecerahan skrin, Corak LED, Kelajuan muzik, Suhu',
  },
  'quiz.music.q7.answer': { en: 'The speed of the music', zh: '音乐速度', ms: 'Kelajuan muzik' },

  'quiz.music.q8': {
    en: 'What does the Rest block do?',
    zh: 'Rest 积木有什么作用？',
    ms: 'Apakah fungsi blok Rest?',
  },
  'quiz.music.q8.options': {
    en: 'Plays music louder, Changes the tempo, Creates a short silence in the music, Displays a number',
    zh: '播放更大声, 改变节奏, 制造短暂的静音, 显示数字',
    ms: 'Mainkan muzik lebih kuat, Ubah tempo, Cipta senyap seketika dalam muzik, Tunjuk nombor',
  },
  'quiz.music.q8.answer': { en: 'Creates a short silence in the music', zh: '制造短暂的静音', ms: 'Cipta senyap seketika dalam muzik' },

  'quiz.music.q9': {
    en: 'Which built-in sound can make the micro:bit sound like laughter? (micro:bit V2)',
    zh: 'micro:bit V2 的哪一种内建音效像笑声？',
    ms: 'Bunyi terbina dalam manakah boleh membuat micro:bit berbunyi seperti ketawa? (micro:bit V2)',
  },
  'quiz.music.q9.options': {
    en: 'Magic, Twinkle, Giggle, Boing',
    zh: '魔法, 闪烁, 咯咯笑, 弹跳',
    ms: 'Magik, Kelip, Ketawa, Boing',
  },
  'quiz.music.q9.answer': { en: 'Giggle', zh: '咯咯笑', ms: 'Ketawa' },

  'quiz.music.q10': {
    en: 'What is the main purpose of the Music category?',
    zh: 'Music 类别的主要作用是什么？',
    ms: 'Apakah tujuan utama kategori Music?',
  },
  'quiz.music.q10.options': {
    en: 'To receive input from sensors, To display text and icons, To play sounds， tones， and melodies, To create LED patterns',
    zh: '接收传感器输入, 显示文字和图示, 播放声音、音调和旋律, 制作 LED 图案',
    ms: 'Menerima input daripada sensor, Paparkan teks dan ikon, Mainkan bunyi， nada dan melodi, Cipta corak LED',
  },
  'quiz.music.q10.answer': { en: 'To play sounds， tones， and melodies', zh: '播放声音、音调和旋律', ms: 'Mainkan bunyi， nada dan melodi' },
  
  'quiz.feedback.tryHarder': { en: 'Keep trying!', zh: '还需努力！', ms: 'Terus berusaha!' },
  'quiz.feedback.good': { en: 'Good job!', zh: '不错哦！', ms: 'Bagus!' },
  'quiz.feedback.great': { en: 'Excellent!', zh: '非常棒！', ms: 'Hebat!' },
  'quiz.feedback.perfect': { en: 'Perfect!', zh: '完美！', ms: 'Sempurna!' },

  'quiz.retry': { en: 'Try Again', zh: '再来一次', ms: 'Cuba lagi' },
  'quiz.aiEvaluation': { en: 'View AI Evaluation', zh: '查看 AI 评估', ms: 'Lihat Penilaian AI' },

  "analysis.noFeedback": { en: "No AI Analysis available", zh: "没有Ai分析", ms: "Tiada Analisis Ai"
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
  'teacher.noAssignments': {
    en: "You don't have any assignments yet",
    zh: '您还没有布置作业',
    ms: 'Anda belum mempunyai tugasan',
  },

  'teacher.addComment': {
      en: "Add a comment",
      zh: '添加评论',
      ms: 'Tambah komen',
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
  'teacher.noResults': {
  en: "No quiz results yet",
  zh: '还没有测验成绩',
  ms: 'Belum ada keputusan kuiz',
},

  'teacher.avatar': {
    en: "Avatar",
    zh: '头像',
    ms: 'Avatar',
  },

  'teacher.name': {
    en: "Name",
    zh: '姓名',
    ms: 'Nama',
  },

  'teacher.actions': {
    en: "Student Quiz Results",
    zh: '学生测验结果',
    ms: 'Keputusan Kuiz Pelajar',
  },

  'teacher.studentSubmissions': {
    en: "Student Submissions",
    zh: '学生提交',
    ms: 'Penyerahan Pelajar',
  },

  'teacher.noSubmissions': {
    en: "No student has submitted yet",
    zh: '还没有学生提交',
    ms: 'Belum ada pelajar menyerahkan tugasan',
  },

  'teacher.viewSubmissions': {
    en: "View Submissions",
    zh: '查看学生提交',
    ms: 'Lihat Penyerahan',
  },
  'teacher.noStudents': {
    en: 'No students in this class yet',
    zh: '当前班级还没有学生',
    ms: 'Tiada pelajar dalam kelas ini lagi',
  },
  'teacher.classList': {
    en: 'Class',
    zh: '班级',
    ms: 'Kelas',
  },
  'teacher.studentsCount': {
    en: 'Number of Students',
    zh: '学生人数',
    ms: 'Bilangan Murid',
  },
  'teacher.createtime':{
    en:'Creation Date',
    zh:'创建日期',
    ms:'Tarikh Penciptaan',
  },
  'teacher.clickClass':{
    en:'Enter Class',
    zh:'进入班级',
    ms:'Masuk Kelas',
  },
  'teacher.editClass':{
    en:"Edit",
    zh:"编辑",
    ms:"Sunting",
  },
  'editAvatar': {
    en: 'Edit Avatar',
    zh: '编辑头像',
    ms: 'Sunting Avatar',
  },
  'editUserName': {
    en: 'Edit User Name',
    zh: '编辑用户名字',
    ms: 'Sunting Nama Pengguna',
  },
    'teacher.classDetail': {
    en: 'Class Details',
    zh: '班级详情',
    ms: 'Butiran Kelas',
  },

  'teacher.students': {
    en: 'Student List',
    zh: '学生列表',
    ms: 'Senarai Pelajar',
  },

  'teacher.joinStudent': {
    en: 'Add Student',
    zh: '加入学生',
    ms: 'Tambah Pelajar',
  },

  'teacher.viewResults': {
    en: 'View Results',
    zh: '查询成绩',
    ms: 'Lihat Keputusan',
  },

  'teacher.quizResults': {
    en: 'Quiz Results',
    zh: '学生测验成绩',
    ms: 'Keputusan Kuiz',
  },

  'teacher.noQuiz': {
    en: 'This student has not completed any quiz',
    zh: '该学生还没有完成任何测验',
    ms: 'Pelajar ini belum menyiapkan sebarang kuiz',
  },

  'teacher.score': {
    en: 'Score',
    zh: '分数',
    ms: 'Markah',
  },

  'teacher.feedback': {
    en: 'Feedback',
    zh: '评语',
    ms: 'Maklum Balas',
  },

  'teacher.date': {
    en: 'Date',
    zh: '时间',
    ms: 'Tarikh',
  },

  'teacher.noFeedback': {
    en: 'No feedback yet',
    zh: '暂无评语',
    ms: 'Tiada maklum balas',
  },

  'teacher.enterFeedback': {
    en: 'Enter feedback',
    zh: '输入评语',
    ms: 'Masukkan maklum balas',
  },

  'teacher.assignments': {
    en: 'Assignments',
    zh: '布置作业',
    ms: 'Tugasan',
  },

  'teacher.viewFile': {
    en: 'View File',
    zh: '查看文件',
    ms: 'Lihat Fail',
  },

  'teacher.addAssignment': {
    en: 'Add Assignment',
    zh: '布置作业',
    ms: 'Tambah Tugasan',
  },

  'teacher.newAssignment': {
    en: 'New Assignment',
    zh: '布置新作业',
    ms: 'Tugasan Baharu',
  },

  'teacher.assignmentTitle': {
    en: 'Enter assignment title',
    zh: '输入作业标题',
    ms: 'Masukkan tajuk tugasan',
  },

  'teacher.assignmentDesc': {
    en: 'Enter assignment description',
    zh: '输入作业内容',
    ms: 'Masukkan penerangan tugasan',
  },

  'teacher.uploadFile': {
    en: 'Upload file path',
    zh: '上传文件路径',
    ms: 'Muat naik laluan fail',
  },

  'teacher.uploadLink': {
    en: 'Upload link',
    zh: '上传链接',
    ms: 'Muat naik pautan',
  },

  'teacher.joinCode': {
    en: 'Class Join Code',
    zh: '班级加入码',
    ms: 'Kod Sertai Kelas',
  },

  'teacher.noJoinCode': {
    en: 'No join code generated yet',
    zh: '尚未生成加入码',
    ms: 'Belum ada kod sertai',
  },

  'teacher.copied': {
    en: 'Join code copied',
    zh: '已复制加入码',
    ms: 'Kod sertai disalin',
  },
  'teacher.noComment': {
    en: 'No comments yet',
    zh: '目前还没有评论',
    ms: 'Belum ada komen lagi',
  },
  'teacher.noFile': {
    en: 'No file available',
    zh: '没有文件',
    ms: 'Tiada fail',
   },
   'common.edit': {
    en: 'Edit',
    zh: '编辑',
    ms: 'Sunting',
  },
  'common.copy': {
    en: 'Copy',
    zh: '复制',
    ms: 'Salin',
  },
  'teacher.deleteClass': {
    en: 'Delete',
    zh: '删除',
    ms: 'Hapus',
  },
  'student.classes': {
  en: 'Classes',
  zh: '班级',
    ms: 'Kelas',
  },

  'student.noClasses': {
    en: 'No classes yet',
    zh: '目前没有班级',
    ms: 'Tiada kelas lagi',
  },

  'student.className': {
    en: 'Class Name',
    zh: '班级名称',
    ms: 'Nama Kelas',
  },

  'student.enterJoinCode': {
    en: 'Enter class code',
    zh: '输入班级代码',
    ms: 'Masukkan kod kelas',
  },

  'student.confirmJoin': {
    en: 'Confirm Join',
    zh: '确认加入',
    ms: 'Sahkan Sertai',
  },
  'student.teacherFeedback': {
    en: 'Teacher Feedback',
    zh: '老师评语',
    ms: 'Maklum Balas Cikgu',
  },
  'student.studentSubmission': {
    en: 'My Submission',
    zh: '我的提交',
    ms: 'Hantaran Saya',
  },
  'student.studentComment': {
    en: 'My Comment',
    zh: '我的评论',
    ms: 'Komen Saya',
  },
  'student.noComment': {
    en: 'No comments yet',
    zh: '还没有评论',
    ms: 'Belum ada komen',
  },
  'student.submit': {
    en: 'Submit',
    zh: '提交',
    ms: 'Hantar',
  },
  'student.uploadFile': {
    en: "Upload File",
    zh: "上传文件",
    ms: "Muat naik fail",
  },

  'student.upload': {
    en: "Upload",
    zh: "上传",
    ms: "Muat naik",
  },
  'student.resources': {
    en: "Materials",
    zh: "资料",
    ms: "Bahan",
  },
  'student.uploadLink': {
    en: 'Upload Link',
    zh: '上传链接',
    ms: 'Muat Naik Pautan',
  },
  'teacher.studentText': {
    en: "Student Text",
    zh: "学生内容",
    ms: "Teks Pelajar",
  },

  'teacher.comment': {
    en: "Your Comment",
    zh: "您的评论",
    ms: "Komen Anda",
  },

  'teacher.saveComment': {
    en: "Send Comment",
    zh: "发送评论",
    ms: "Hantar Komen",
  },
  'teacher.teachingContent': {
    en: "Teaching Content",
    zh: "教学内容",
    ms: "Kandungan Pengajaran",
  }
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
    suggestions: ["How do I use the button?", "What is an accelerometer?"],
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
export function I18nProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode
  initialLang?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(initialLang || 'en')

  useEffect(() => {
    const stored = window.localStorage.getItem('mbx-lang') as Lang | null
    if (stored && ['en', 'zh', 'ms'].includes(stored)) {
      setLangState(stored)
    } else if (initialLang && ['en', 'zh', 'ms'].includes(initialLang)) {
      setLangState(initialLang)
    }
  }, [initialLang])

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
