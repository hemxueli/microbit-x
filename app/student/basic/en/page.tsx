'use client'

import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

export default function LearningPage({ user }: { user?: any }) {
  const { t } = useI18n()

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Image
              src={user?.image ?? '/images/default-avatar.png'}
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full border"
            />
            <span className="font-medium">{user?.name ?? t('student.defaultName')}</span>
            <Button variant="ghost" size="sm">
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* 页面主体：三个学习卡片 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          <h2 className="text-2xl font-bold mb-6">{t('student.basiclearningContent')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'pdf', labelEn: 'Knowledge Scroll', labelMs: 'Gulungan Ilmu', labelZh: '知识卷轴', image: '/images/pdf.png', link: '/student/pdf' },
              { key: 'website', labelEn: 'Discovery Portal', labelMs: 'Pintu Penemuan', labelZh: '探索入口', image: '/images/website.png', link: '/student/website' },
              { key: 'video', labelEn: 'Vision Stream', labelMs: 'Aliran Visual', labelZh: '视觉之流', image: '/images/video.png', link: '/student/video' },
            ].map(({ key, labelEn, labelMs, labelZh, image, link }) => (
              <a
                key={key}
                href={link}
                className="relative h-[280px] rounded-lg shadow-md overflow-hidden cursor-pointer group"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold group-hover:scale-110 transition">
                    {/* 根据当前语言显示不同文字 */}
                    {t('lang') === 'en' ? labelEn : t('lang') === 'ms' ? labelMs : labelZh}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* 底部版权栏 */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBOT-X</span>
        </div>
      </footer>
    </div>
  )
}
