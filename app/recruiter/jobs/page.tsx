'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, Search, Filter, MoreVertical, Eye, Users, 
  Clock, CheckCircle, Pause, Trash2, Edit, ChevronRight,
  TrendingUp, Calendar, MapPin, Briefcase
} from 'lucide-react'
import { mockJobs } from '@/lib/mockData'
import { mockApplications, getApplicationsByJobId } from '@/lib/recruiter/mockApplications'

// 模拟招聘者发布的职位（取mockJobs的前15个作为示例）
const recruiterJobs = mockJobs.slice(0, 15).map(job => ({
  ...job,
  status: Math.random() > 0.2 ? 'active' : (Math.random() > 0.5 ? 'paused' : 'closed'),
  viewsCount: Math.floor(Math.random() * 500) + 100,
  createdAt: `2026-01-${String(Math.floor(Math.random() * 15) + 1).padStart(2, '0')}`,
  updatedAt: `2026-01-${String(Math.floor(Math.random() * 5) + 13).padStart(2, '0')}`
}))

type JobStatus = 'all' | 'active' | 'paused' | 'closed'

export default function RecruiterJobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus>('all')
  const [showMenu, setShowMenu] = useState<number | null>(null)

  const filteredJobs = useMemo(() => {
    return recruiterJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string, text: string, icon: any, label: string }> = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle, label: '招聘中' },
      paused: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Pause, label: '已暂停' },
      closed: { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: Clock, label: '已关闭' }
    }
    const { bg, text, icon: Icon, label } = config[status] || config.active
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    )
  }

  const stats = useMemo(() => ({
    total: recruiterJobs.length,
    active: recruiterJobs.filter(j => j.status === 'active').length,
    paused: recruiterJobs.filter(j => j.status === 'paused').length,
    closed: recruiterJobs.filter(j => j.status === 'closed').length
  }), [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">职位管理</h1>
              <p className="text-slate-400">管理您发布的所有招聘职位</p>
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'all' ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">全部职位</div>
          </button>
          <button 
            onClick={() => setStatusFilter('active')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'active' ? 'border-green-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            <div className="text-sm text-slate-400">招聘中</div>
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
          <button 
            onClick={() => setStatusFilter('closed')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'closed' ? 'border-slate-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-slate-400">{stats.closed}</div>
            <div className="text-sm text-slate-400">已关闭</div>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索职位名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const applications = getApplicationsByJobId(job.id)
            const pendingCount = applications.filter(a => a.status === 'pending' || a.status === 'reviewing').length
            
            return (
              <div 
                key={job.id}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        href={`/recruiter/jobs/${job.id}`}
                        className="text-xl font-bold text-white group-hover:text-blue-400 transition"
                      >
                        {job.title}
                      </Link>
                      {getStatusBadge(job.status)}
                      {job.isHot && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">热门</span>
                      )}
                      {job.isUrgent && (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">急招</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="text-blue-400 font-medium">{job.salary}</span>
                      <span>{job.experience}</span>
                      <span>{job.education}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.slice(0, 5).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">{job.viewsCount}</span>
                      </div>
                      <div className="text-xs text-slate-500">浏览</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{applications.length}</span>
                      </div>
                      <div className="text-xs text-slate-500">申请</div>
                    </div>
                    {pendingCount > 0 && (
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{pendingCount}</span>
                        </div>
                        <div className="text-xs text-slate-500">待处理</div>
                      </div>
                    )}

                    <div className="relative">
                      <button 
                        onClick={() => setShowMenu(showMenu === job.id ? null : job.id)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition"
                      >
                        <MoreVertical className="h-5 w-5 text-slate-400" />
                      </button>
                      
                      {showMenu === job.id && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10">
                          <Link 
                            href={`/recruiter/jobs/${job.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 transition"
                          >
                            <Eye className="h-4 w-4" />
                            查看详情
                          </Link>
                          <button className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 transition w-full text-left">
                            <Edit className="h-4 w-4" />
                            编辑职位
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 transition w-full text-left">
                            <Pause className="h-4 w-4" />
                            暂停招聘
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-700 transition w-full text-left">
                            <Trash2 className="h-4 w-4" />
                            删除职位
                          </button>
                        </div>
                      )}
                    </div>

                    <Link 
                      href={`/recruiter/jobs/${job.id}`}
                      className="p-2 hover:bg-slate-700 rounded-lg transition"
                    >
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-400 mb-2">没有找到职位</h3>
            <p className="text-slate-500 mb-6">尝试调整搜索条件或发布新职位</p>
            <Link 
              href="/recruiter/jobs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              <Plus className="h-5 w-5" />
              发布新职位
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
