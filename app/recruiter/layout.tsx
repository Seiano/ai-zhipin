import RecruiterNavigation from '@/components/RecruiterNavigation'

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <RecruiterNavigation />
      <main>{children}</main>
      <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">AI智聘 · 招聘者</h3>
              <p className="text-slate-400 text-sm">
                智能招聘管理平台，AI助力高效招聘
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">招聘管理</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>职位发布</li>
                <li>候选人筛选</li>
                <li>面试安排</li>
                <li>Offer管理</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">AI功能</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>智能简历筛选</li>
                <li>AI面试助手</li>
                <li>人才匹配推荐</li>
                <li>对话记录分析</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">联系我们</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>客服热线: 400-888-8888</li>
                <li>企业邮箱: hr@aizhipin.com</li>
                <li>工作时间: 9:00 - 18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
            © 2024 AI智聘 招聘者平台. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
