import React from 'react'

interface ImplementorLayoutProps {
    children: React.ReactNode
}

export default function ImplementorLayout({ children }: ImplementorLayoutProps) {
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


