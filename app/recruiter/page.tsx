'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Briefcase, Users, MessageSquare, TrendingUp, 
  Eye, Clock, CheckCircle, XCircle, 
  ArrowUpRight, Calendar, User, Star,
  Plus, ChevronRight, BarChart3, Bot, Sparkles,
  FileSearch, Brain, MessageCircle, DollarSign,
  LineChart, Database, Zap, Shield, Target, UserCheck
} from 'lucide-react'

// 模拟统计数据
const mockStats = {
  totalJobs: 12,
  activeJobs: 8,
  totalApplications: 156,
  newApplications: 23,
  totalConversations: 89,
  pendingReview: 15,
  interviewScheduled: 7,
  hired: 3
}

// 模拟最近申请
const mockRecentApplications = [
  {
    id: '1',
    candidateName: '张三',
    position: '高级前端工程师',
    matchScore: 92,
    appliedAt: '2小时前',
    status: 'pending'
  },
  {
    id: '2',
    candidateName: '李四',
    position: 'Python后端开发',
    matchScore: 88,
    appliedAt: '3小时前',
    status: 'reviewing'
  },
  {
    id: '3',
    candidateName: '王五',
    position: 'AI算法工程师',
    matchScore: 95,
    appliedAt: '5小时前',
    status: 'interview'
  },
  {
    id: '4',
    candidateName: '赵六',
    position: '产品经理',
    matchScore: 78,
    appliedAt: '1天前',
    status: 'rejected'
  },
]

// 模拟热门职位
const mockHotJobs = [
  { id: '1', title: '高级前端工程师', applications: 45, views: 320 },
  { id: '2', title: 'AI算法工程师', applications: 38, views: 280 },
  { id: '3', title: 'Python后端开发', applications: 32, views: 245 },
  { id: '4', title: '产品经理', applications: 28, views: 210 },
]

export default function RecruiterDashboard() {
  const [greeting, setGreeting] = useState('你好')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('早上好')
    else if (hour < 18) setGreeting('下午好')
    else setGreeting('晚上好')
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string, text: string, label: string }> = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '待处理' },
      reviewing: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '筛选中' },
      interview: { bg: 'bg-green-500/20', text: 'text-green-400', label: '已约面' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', label: '已拒绝' },
      hired: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: '已录用' }
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{greeting}，招聘官</h1>
              <p className="text-slate-400">欢迎回到AI智聘招聘管理平台</p>
            </div>
            <Link 
              href="/recruiter/jobs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium"
            >
              <Plus className="h-5 w-5" />
              发布新职位
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* AI招聘助手 - 核心功能展示 */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  AI招聘助手
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                </h2>
                <p className="text-white/80 text-sm">您的智能招聘伙伴，让招聘效率提升10倍</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
              <Link
                href="/recruiter/ai-assistant/resume-screening"
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/20 transition group"
              >
                <FileSearch className="h-6 w-6 text-white mb-2 group-hover:scale-110 transition" />
                <div className="text-white font-medium text-sm">智能简历筛选</div>
                <div className="text-white/60 text-xs mt-1">AI自动评估匹配度</div>
              </Link>
              
              <Link
                href="/recruiter/ai-assistant/interview-questions"
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/20 transition group"
              >
                <Brain className="h-6 w-6 text-white mb-2 group-hover:scale-110 transition" />
                <div className="text-white font-medium text-sm">面试问题生成</div>
                <div className="text-white/60 text-xs mt-1">根据JD自动生成</div>
              </Link>
              
              <Link
                href="/recruiter/ai-assistant/communication"
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/20 transition group"
              >
                <MessageCircle className="h-6 w-6 text-white mb-2 group-hover:scale-110 transition" />
                <div className="text-white font-medium text-sm">沟通话术建议</div>
                <div className="text-white/60 text-xs mt-1">邀约/拒绝模板</div>
              </Link>
              
              <Link
                href="/recruiter/ai-assistant/salary-analysis"
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/20 transition group"
              >
                <DollarSign className="h-6 w-6 text-white mb-2 group-hover:scale-110 transition" />
                <div className="text-white font-medium text-sm">薪资分析建议</div>
                <div className="text-white/60 text-xs mt-1">市场行情对标</div>
              </Link>
              
              <Link
                href="/recruiter/ai-assistant/insights"
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/20 transition group"
              >
                <LineChart className="h-6 w-6 text-white mb-2 group-hover:scale-110 transition" />
                <div className="text-white font-medium text-sm">招聘数据洞察</div>
                <div className="text-white/60 text-xs mt-1">漏斗分析优化</div>
              </Link>
              
              <Link
                href="/recruiter/ai-assistant/talent-pool"
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/20 transition group"
              >
                <Database className="h-6 w-6 text-white mb-2 group-hover:scale-110 transition" />
                <div className="text-white font-medium text-sm">人才库管理</div>
                <div className="text-white/60 text-xs mt-1">智能标签推荐</div>
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/recruiter/ai-assistant"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition font-medium"
              >
                <Zap className="h-5 w-5" />
                开始使用AI助手
              </Link>
              <div className="flex items-center gap-6 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  数据安全加密
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  准确率 95%+
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck className="h-4 w-4" />
                  已服务 10000+ HR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Briefcase className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +2
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{mockStats.activeJobs}</div>
            <div className="text-slate-400 text-sm">在招职位</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
              <span className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +{mockStats.newApplications}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{mockStats.totalApplications}</div>
            <div className="text-slate-400 text-sm">收到简历</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{mockStats.interviewScheduled}</div>
            <div className="text-slate-400 text-sm">待面试</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{mockStats.hired}</div>
            <div className="text-slate-400 text-sm">本月录用</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                最新申请
              </h2>
              <Link 
                href="/recruiter/candidates" 
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition"
              >
                查看全部
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {mockRecentApplications.map((app) => (
                <div 
                  key={app.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {app.candidateName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-white group-hover:text-blue-400 transition">
                        {app.candidateName}
                      </div>
                      <div className="text-sm text-slate-400">{app.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-white font-medium">{app.matchScore}%</span>
                      </div>
                      <div className="text-xs text-slate-500">{app.appliedAt}</div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hot Jobs */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                热门职位
              </h2>
              <Link 
                href="/recruiter/jobs" 
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition"
              >
                管理
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {mockHotJobs.map((job, index) => (
                <div 
                  key={job.id}
                  className="p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-white text-sm">{job.title}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 ml-8">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {job.applications} 申请
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {job.views} 浏览
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/recruiter/jobs/new"
              className="mt-4 w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-blue-500 hover:text-blue-400 transition flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              发布新职位
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/recruiter/candidates?status=pending"
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 hover:border-yellow-500/50 hover:bg-slate-800 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{mockStats.pendingReview}</div>
                <div className="text-sm text-slate-400">待筛选简历</div>
              </div>
            </div>
          </Link>

          <Link
            href="/recruiter/conversations"
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 hover:bg-slate-800 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{mockStats.totalConversations}</div>
                <div className="text-sm text-slate-400">AI对话记录</div>
              </div>
            </div>
          </Link>

          <Link
            href="/recruiter/candidates?status=interview"
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 hover:border-green-500/50 hover:bg-slate-800 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{mockStats.interviewScheduled}</div>
                <div className="text-sm text-slate-400">面试安排</div>
              </div>
            </div>
          </Link>

          <Link
            href="/recruiter/jobs"
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 hover:bg-slate-800 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Briefcase className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{mockStats.totalJobs}</div>
                <div className="text-sm text-slate-400">全部职位</div>
              </div>
            </div>
          </Link>
        </div>

        {/* AI助手功能详解 */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400" />
              AI助手能帮您做什么？
            </h2>
            <Link 
              href="/recruiter/ai-assistant" 
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition"
            >
              了解更多
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileSearch className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-medium text-white">智能简历筛选</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI自动分析简历与岗位匹配度，智能评分排序，节省80%筛选时间。支持批量处理，一键筛出优质候选人。
              </p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="font-medium text-white">AI面试问题生成</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                根据岗位JD和候选人简历，自动生成针对性面试问题。涵盖技术、行为、情景等多维度，让面试更专业。
              </p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="font-medium text-white">候选人沟通助手</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                提供专业的候选人沟通话术模板，包括邀约、跟进、拒绝等场景。AI根据候选人特点个性化调整措辞。
              </p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="font-medium text-white">薪资分析与Offer</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                实时对标市场薪资行情，结合候选人背景给出合理薪资建议。一键生成专业Offer Letter，提升成单率。
              </p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <LineChart className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="font-medium text-white">招聘数据洞察</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                全流程数据追踪，智能分析招聘漏斗瓶颈。提供优化建议，持续提升招聘效率和候选人体验。
              </p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Database className="h-5 w-5 text-pink-400" />
                </div>
                <h3 className="font-medium text-white">人才库智能管理</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI自动为候选人打标签，智能分类管理。当有新岗位时，自动推荐匹配的历史候选人，盘活人才资源。
              </p>
            </div>
          </div>

          {/* AI助手使用统计 */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex flex-wrap gap-6 justify-center text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">156</div>
                <div className="text-slate-400 text-sm">AI已筛选简历</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">89</div>
                <div className="text-slate-400 text-sm">AI生成面试题</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">45</div>
                <div className="text-slate-400 text-sm">AI辅助沟通</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">12</div>
                <div className="text-slate-400 text-sm">AI生成Offer</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">85%</div>
                <div className="text-slate-400 text-sm">效率提升</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
