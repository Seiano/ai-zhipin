'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, UserSearch, Sparkles, Building2, Users, Bot, ArrowRight, CheckCircle } from 'lucide-react'

export default function RoleSelectPage() {
  const router = useRouter()
  const [hoveredRole, setHoveredRole] = useState<'seeker' | 'recruiter' | null>(null)
  const [savedRole, setSavedRole] = useState<string | null>(null)

  // 检查是否有保存的角色选择
  useEffect(() => {
    const role = localStorage.getItem('user_role')
    setSavedRole(role)
  }, [])

  // 选择角色并跳转
  const selectRole = (role: 'seeker' | 'recruiter') => {
    localStorage.setItem('user_role', role)
    if (role === 'seeker') {
      router.push('/seeker')
    } else {
      router.push('/recruiter')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 顶部品牌栏 */}
      <header className="py-6 px-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AI智聘</span>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl">
          {/* 标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              选择你的角色
            </h1>
            <p className="text-xl text-gray-400">
              AI驱动的智能招聘平台，连接人才与机会
            </p>
          </div>

          {/* 角色选择卡片 */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 求职者入口 */}
            <div
              className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
                hoveredRole === 'seeker' ? 'scale-[1.02]' : ''
              }`}
              onMouseEnter={() => setHoveredRole('seeker')}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => selectRole('seeker')}
            >
              {/* 背景渐变 */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90" />
              
              {/* 装饰圆圈 */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
              
              {/* 内容 */}
              <div className="relative p-10 min-h-[400px] flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <UserSearch className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">我是求职者</h2>
                    <p className="text-white/70">找到你的AI梦想工作</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>智能匹配 43+ AI领域职位</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>AI求职助手自动帮你沟通</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>AI智能面试模拟训练</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>简历分析与优化建议</span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-white font-semibold text-lg mt-6 transition-transform duration-300 ${
                  hoveredRole === 'seeker' ? 'translate-x-2' : ''
                }`}>
                  <span>开始找工作</span>
                  <ArrowRight className="w-5 h-5" />
                </div>

                {savedRole === 'seeker' && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                    上次选择
                  </div>
                )}
              </div>
            </div>

            {/* 招聘者入口 */}
            <div
              className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
                hoveredRole === 'recruiter' ? 'scale-[1.02]' : ''
              }`}
              onMouseEnter={() => setHoveredRole('recruiter')}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => selectRole('recruiter')}
            >
              {/* 背景渐变 - 深蓝商务风 */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 opacity-95" />
              
              {/* 装饰圆圈 */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10" />
              
              {/* 内容 */}
              <div className="relative p-10 min-h-[400px] flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">我是招聘者</h2>
                    <p className="text-white/70">高效招聘AI人才</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-blue-300" />
                    <span>电子HR自动筛选候选人</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-blue-300" />
                    <span>查看AI对话记录与评估</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-blue-300" />
                    <span>智能匹配度分析报告</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-blue-300" />
                    <span>高效管理职位与候选人</span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-white font-semibold text-lg mt-6 transition-transform duration-300 ${
                  hoveredRole === 'recruiter' ? 'translate-x-2' : ''
                }`}>
                  <span>进入招聘工作台</span>
                  <ArrowRight className="w-5 h-5" />
                </div>

                {savedRole === 'recruiter' && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-sm text-white">
                    上次选择
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 底部统计 */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">43+</div>
              <div className="text-gray-400">AI领域职位</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">300+</div>
              <div className="text-gray-400">合作企业</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">20万+</div>
              <div className="text-gray-400">AI人才</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">92%</div>
              <div className="text-gray-400">匹配成功率</div>
            </div>
          </div>
        </div>
      </main>

      {/* 底部版权 */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2024 AI智聘 - 专注AI领域的智能招聘平台</p>
      </footer>
    </div>
  )
}
