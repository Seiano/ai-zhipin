import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ClientProviders } from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI招聘平台 - 专注人工智能领域招聘',
  description: '连接AI人才与顶尖企业的专业招聘平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
