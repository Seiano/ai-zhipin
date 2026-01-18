'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, MessageSquare, Clock, CheckCircle, Pause, 
  ChevronRight, User, Briefcase, Star, Calendar,
  ArrowRight
} from 'lucide-react'
import { mockConversations, getConversationStats } from '@/lib/recruiter/mockConversations'

type FilterStatus = 'all' | 'active' | 'completed' | 'paused'

export default function RecruiterConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  const stats = getConversationStats()

  const filteredConversations = useMemo(() => {
    return mockConversations.filter(conv => {
      const matchesSearch = conv.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || conv.status === statusFilter
      return matchesSearch && matchesStatus
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [searchQuery, statusFilter])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string, text: string, icon: any, label: string }> = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: MessageSquare, label: '进行中' },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: CheckCircle, label: '已完成' },
      paused: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Pause, label: '已暂停' }
    }
    const { bg, text, icon: Icon, label } = config[status] || config.active
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI对话记录</h1>
          <p className="text-slate-400">查看AI与候选人的所有对话记录</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'all' ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">全部对话</div>
          </button>
          <button 
            onClick={() => setStatusFilter('active')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'active' ? 'border-green-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            <div className="text-sm text-slate-400">进行中</div>
          </button>
          <button 
            onClick={() => setStatusFilter('completed')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'completed' ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-blue-400">{stats.completed}</div>
            <div className="text-sm text-slate-400">已完成</div>
          </button>
          <button 
            onClick={() => setStatusFilter('paused')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'paused' ? 'border-yellow-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-yellow-400">{stats.paused}</div>
            <div className="text-sm text-slate-400">已暂停</div>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索候选人姓名或职位..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {filteredConversations.map((conv) => (
            <div 
              key={conv.id}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition group"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {conv.candidateName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{conv.candidateName}</h3>
                        {getStatusBadge(conv.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {conv.jobTitle}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {conv.updatedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {conv.messages.length} 条消息
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/recruiter/conversations/${conv.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition"
                  >
                    查看详情
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Messages Preview */}
              <div className="p-6 space-y-3">
                {conv.messages.slice(-3).map((msg, idx) => (
                  <div 
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'candidate' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'hr' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {msg.role === 'hr' ? '🤖' : <User className="h-4 w-4" />}
                    </div>
                    <div className={`flex-1 max-w-[70%] ${msg.role === 'candidate' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-4 py-2 rounded-xl text-sm ${
                        msg.role === 'hr'
                          ? 'bg-slate-700/50 text-slate-200'
                          : 'bg-green-500/20 text-green-100'
                      }`}>
                        {msg.content.length > 100 ? msg.content.slice(0, 100) + '...' : msg.content}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Assessment (if completed) */}
              {conv.aiAssessment && (
                <div className="px-6 pb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
                      <Star className="h-4 w-4" />
                      AI评估结果
                    </div>
                    <p className="text-slate-300 text-sm">{conv.aiAssessment}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-400 mb-2">没有找到对话记录</h3>
            <p className="text-slate-500">尝试调整搜索条件</p>
          </div>
        )}
      </div>
    </div>
  )
}
