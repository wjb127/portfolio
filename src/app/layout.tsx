import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '웹 개발 포트폴리오',
  description: 'Next.js와 Tailwind CSS를 활용한 포트폴리오',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
