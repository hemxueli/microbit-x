'use client'

import { useState, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

export default function AvatarEditorModal({
  avatar,
  setAvatar,
  name,
  setName,
  onClose,
}: {
  avatar: string
  setAvatar: (v: string) => void
  name: string
  setName: (v: string) => void
  onClose: () => void
}) {
  const { t } = useI18n()
  const [file, setFile] = useState<File | null>(null)
  const [scale, setScale] = useState(1.2)
  const editorRef = useRef<AvatarEditor>(null)

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas()
      const url = canvas.toDataURL()
      setAvatar(url)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">{t('common.editProfile')}</h2>
        <div className="flex flex-col gap-4">
          {/* 姓名输入 */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">{t('auth.name')}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </label>

          {/* 上传头像 */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">{t('auth.avatar')}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setFile(f)
              }}
            />
          </label>

          {/* 裁剪预览 */}
          {file && (
            <div className="flex flex-col items-center gap-2">
              <AvatarEditor
                ref={editorRef}
                image={file}
                width={200}
                height={200}
                border={50}
                borderRadius={100} // 圆形裁剪
                scale={scale}
              />
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave}>{t('common.save')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
