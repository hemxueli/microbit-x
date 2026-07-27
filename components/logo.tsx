import { cn } from '@/lib/utils'

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"
      >
        {/* 3x3 LED grid evoking the micro:bit display */}
        <span className="grid grid-cols-3 gap-[2px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'size-1 rounded-[1px] bg-primary-foreground',
                [0, 2, 4, 6, 8].includes(i) ? 'opacity-100' : 'opacity-40',
              )}
            />
          ))}
        </span>
      </span>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight">
          MicroBOT<span className="text-primary">-X</span>
        </span>
      )}
    </span>
  )
}
