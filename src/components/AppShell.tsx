import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="grain relative min-h-svh overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="mx-auto flex min-h-svh max-w-[1200px] flex-col px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-12">
        {children}
      </div>
    </div>
  )
}
