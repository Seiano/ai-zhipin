'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, Filter, Users, Star, Clock, CheckCircle, 
  XCircle, Calendar, ChevronRight, Mail, Phone,
  Briefcase, GraduationCap, MapPin, MessageSquare
} from 'lucide-react'
import { mockCandidates, getCandidateById } from '@/lib/recruiter/mockCandidates'
import { mockApplications, getApplicationsByStatus } from '@/lib/recruiter/mockApplications'
import { ApplicationStatus } from '@/lib/recruiter/types'

type FilterStatus = 'all' | ApplicationStatus

export default function RecruiterCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  // 获取所有有申请的候选人
  const candidatesWithApplications = useMemo(() => {
    const candidateMap = new Map<string, {
      candidate: typeof mockCandidates[0],
      applications: typeof mockApplications,
      latestStatus: ApplicationStatus,
      highestMatch: number
    }>()

    mockApplications.forEach(app => {
      const candidate = getCandidateById(app.candidateId)
      if (!candidate) return

      if (!candidateMap.has(app.candidateId)) {
        candidateMap.set(app.candidateId, {
          candidate,
          applications: [app],
          latestStatus: app.status,
          highestMatch: app.matchScore
        })
      } else {
        const existing = candidateMap.get(app.candidateId)!
        existing.applications.push(app)
        if (app.matchScore > existing.highestMatch) {
          existing.highestMatch = app.matchScore
        }
        // 更新最新状态
        if (new Date(app.appliedAt) > new Date(existing.applications[0].appliedAt)) {
          existing.latestStatus = app.status
        }
      }
    })

    return Array.from(candidateMap.values())
  }, [])

  const filteredCandidates = useMemo(() => {
    return candidatesWithApplications.filter(item => {
      const matchesSearch = item.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.candidate.currentPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.candidate.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || 
                           item.applications.some(a => a.status === statusFilter)
      
      return matchesSearch && matchesStatus
    })
  }, [candidatesWithApplications, searchQuery, statusFilter])

  const stats = useMemo(() => ({
    total: candidatesWithApplications.length,
    pending: candidatesWithApplications.filter(c => c.applications.some(a => a.status === 'pending')).length,
    reviewing: candidatesWithApplications.filter(c => c.applications.some(a => a.status === 'reviewing')).length,
    interview: candidatesWithApplications.filter(c => c.applications.some(a => a.status === 'interview')).length,
    offer: candidatesWithApplications.filter(c => c.applications.some(a => a.status === 'offer')).length,
    hired: candidatesWithApplications.filter(c => c.applications.some(a => a.status === 'hired')).length
  }), [candidatesWithApplications])

  const getStatusBadge = (status: ApplicationStatus) => {
    const config: Record<ApplicationStatus, { bg: string, text: string, label: string }> = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '待处理' },
      reviewing: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '筛选中' },
      interview: { bg: 'bg-green-500/20', text: 'text-green-400', label: '已约面' },
      offer: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: '已发Offer' },
      hired: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: '已入职' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', label: '已拒绝' }
    }
    const { bg, text, label } = config[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    )
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 80) return 'text-blue-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-slate-400'
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">候选人管理</h1>
          <p className="text-slate-400">查看和管理所有申请候选人</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'all' ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">全部候选人</div>
          </button>
          <button 
            onClick={() => setStatusFilter('pending')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'pending' ? 'border-yellow-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-slate-400">待处理</div>
          </button>
          <button 
            onClick={() => setStatusFilter('reviewing')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'reviewing' ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-blue-400">{stats.reviewing}</div>
            <div className="text-sm text-slate-400">筛选中</div>
          </button>
          <button 
            onClick={() => setStatusFilter('interview')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'interview' ? 'border-green-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-green-400">{stats.interview}</div>
            <div className="text-sm text-slate-400">已约面试</div>
          </button>
          <button 
            onClick={() => setStatusFilter('offer')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'offer' ? 'border-purple-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-purple-400">{stats.offer}</div>
            <div className="text-sm text-slate-400">已发Offer</div>
          </button>
          <button 
            onClick={() => setStatusFilter('hired')}
            className={`bg-slate-800/50 backdrop-blur border rounded-xl p-4 text-left transition ${
              statusFilter === 'hired' ? 'border-cyan-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl font-bold text-cyan-400">{stats.hired}</div>
            <div className="text-sm text-slate-400">已入职</div>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索候选人姓名、职位或技能..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.map(({ candidate, applications, highestMatch }) => (
            <div 
              key={candidate.id}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {candidate.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                        {candidate.name}
                      </h3>
                      <div className={`flex items-center gap-1 ${getMatchScoreColor(highestMatch)}`}>
                        <Star className="h-4 w-4" />
                        <span className="font-medium">{highestMatch}%</span>
                      </div>
                    </div>
                    <div className="text-slate-300 mb-2">{candidate.currentPosition}</div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {candidate.currentCompany}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {candidate.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {candidate.education} · {candidate.school}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {candidate.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {candidate.skills.slice(0, 6).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 6 && (
                      <span className="px-2 py-1 text-slate-500 text-xs">
                        +{candidate.skills.length - 6}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{candidate.summary}</p>
                </div>

                {/* Applications */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="text-sm text-slate-400 mb-1">申请的职位 ({applications.length})</div>
                  {applications.slice(0, 2).map(app => (
                    <div key={app.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-slate-300 truncate max-w-[120px]">{app.jobTitle}</span>
                      {getStatusBadge(app.status)}
                    </div>
                  ))}
                  {applications.length > 2 && (
                    <span className="text-xs text-slate-500">还有 {applications.length - 2} 个申请</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/recruiter/candidates/${candidate.id}`}
                    className="p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition"
                    title="查看详情"
                  >
                    <Users className="h-5 w-5" />
                  </Link>
                  <button
                    className="p-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                    title="发送消息"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  <Link 
                    href={`/recruiter/candidates/${candidate.id}`}
                    className="p-2 hover:bg-slate-700 rounded-lg transition"
                  >
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-400 mb-2">没有找到候选人</h3>
            <p className="text-slate-500">尝试调整搜索条件</p>
          </div>
        )}
      </div>
    </div>
  )
}
