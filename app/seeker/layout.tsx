'use client'

import { ReactNode } from 'react'
import Navigation from '@/components/Navigation'

export default function SeekerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="seeker" />
      <main>{children}</main>
      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">AI智聘</h3>
              <p className="text-gray-400">专注AI领域的专业招聘平台，8年深耕，服务300+AI企业</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/seeker/jobs" className="hover:text-white transition">浏览职位</a></li>
                <li><a href="/seeker/profile" className="hover:text-white transition">我的简历</a></li>
                <li><a href="/seeker/ai-interview" className="hover:text-white transition">AI面试</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关于我们</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">公司介绍</a></li>
                <li><a href="#" className="hover:text-white transition">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">联系方式</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@aizhipin.com</li>
                <li>400-888-8888</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 AI智聘. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
