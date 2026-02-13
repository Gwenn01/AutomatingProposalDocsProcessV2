import React from 'react'

interface ReviewerLayoutProps {
    children: React.ReactNode
}

export default function ReviewerLayout({ children }: ReviewerLayoutProps) {
  return (
    <div>
      <aside>

      </aside>
      <main>
        {children}
      </main>
    </div>
  )
}


