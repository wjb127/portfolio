import './globals.css'
import type { Metadata } from 'next'

export const metadata = {
  title: 'DEV1L Portfolio',
  description: '웹 개발 포트폴리오',
  icons: {
    icon: '/portfolio/logo.jpg',
  },
};

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
