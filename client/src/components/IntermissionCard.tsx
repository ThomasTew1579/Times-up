import type { ReactNode } from 'react'

export default function IntermissionCard({children}: {children: ReactNode}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur px-4">
        <div className="w-full max-w-96 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white p-6 shadow-xl">
            {children}
        </div>
    </div>
  )
}