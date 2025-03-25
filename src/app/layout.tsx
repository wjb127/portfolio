import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개발자 포트폴리오',
  description: '안전하고 빠른 웹 개발 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
