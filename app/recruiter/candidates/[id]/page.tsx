'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Clock, Star, Calendar, MessageSquare, CheckCircle, XCircle,
  User, ChevronRight, FileText, Send
} from 'lucide-react'
import { getCandidateById } from '@/lib/recruiter/mockCandidates'
import { getApplicationsByCandidateId } from '@/lib/recruiter/mockApplications'
import { getConversationsByCandidateId } from '@/lib/recruiter/mockConversations'
import { ApplicationStatus } from '@/lib/recruiter/types'

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = params.id as string
  
  const candidate = getCandidateById(candidateId)
  const applications = getApplicationsByCandidateId(candidateId)
  const conversations = getConversationsByCandidateId(candidateId)

  const [activeTab, setActiveTab] = useState<'resume' | 'applications' | 'conversations'>('resume')

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">候选人不存在</h2>
          <Link href="/recruiter/candidates" className="text-blue-400 hover:text-blue-300">
            返回候选人列表
          </Link>
        </div>
      </div>
    )
  }

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

  const highestMatch = applications.length > 0 
    ? Math.max(...applications.map(a => a.matchScore))
    : 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/recruiter/candidates"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            返回候选人列表
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {candidate.name[0]}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{candidate.name}</h1>
                {highestMatch > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                    <Star className="h-4 w-4" />
                    <span className="font-medium">最高匹配 {highestMatch}%</span>
                  </div>
                )}
              </div>
              <div className="text-xl text-slate-300 mb-4">{candidate.currentPosition}</div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {candidate.currentCompany}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {candidate.experience}经验
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {candidate.education} · {candidate.school}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  期望薪资: {candidate.expectedSalary}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition font-medium">
                <Send className="h-5 w-5" />
                发送消息
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition font-medium">
                <Calendar className="h-5 w-5" />
                安排面试
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-6 py-4 font-medium transition border-b-2 ${
                activeTab === 'resume'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              简历详情
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-4 font-medium transition border-b-2 ${
                activeTab === 'applications'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <Briefcase className="h-4 w-4 inline mr-2" />
              申请记录 ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('conversations')}
              className={`px-6 py-4 font-medium transition border-b-2 ${
                activeTab === 'conversations'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              对话记录 ({conversations.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">个人简介</h2>
                <p className="text-slate-300 leading-relaxed">{candidate.summary}</p>
              </div>

              {/* Work Experience */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">工作经历</h2>
                <div className="space-y-6">
                  {candidate.workHistory.map((work, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-slate-700">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-800"></div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{work.position}</h3>
                        <span className="text-slate-400">@</span>
                        <span className="text-blue-400">{work.company}</span>
                      </div>
                      <div className="text-sm text-slate-500 mb-2">{work.duration}</div>
                      <p className="text-slate-300">{work.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">联系方式</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span>{candidate.phone}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">技能标签</h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">申请统计</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">申请职位数</span>
                    <span className="text-white font-medium">{applications.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">对话轮次</span>
                    <span className="text-white font-medium">{conversations.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">最高匹配度</span>
                    <span className="text-green-400 font-medium">{highestMatch}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.map(app => (
              <div 
                key={app.id}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{app.jobTitle}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        申请时间: {app.appliedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        匹配度: {app.matchScore}%
                      </span>
                      {app.interviewTime && (
                        <span className="flex items-center gap-1 text-green-400">
                          <Clock className="h-4 w-4" />
                          面试时间: {app.interviewTime}
                        </span>
                      )}
                    </div>
                    {app.notes && (
                      <p className="mt-2 text-sm text-slate-500">备注: {app.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                该候选人暂无申请记录
              </div>
            )}
          </div>
        )}

        {/* Conversations Tab */}
        {activeTab === 'conversations' && (
          <div className="space-y-6">
            {conversations.map(conv => (
              <div 
                key={conv.id}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{conv.jobTitle}</h3>
                    <div className="text-sm text-slate-400">
                      {conv.startedAt} · {conv.messages.length} 条消息
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    conv.status === 'completed' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : conv.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {conv.status === 'completed' ? '已完成' : conv.status === 'active' ? '进行中' : '已暂停'}
                  </span>
                </div>
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                  {conv.messages.map(msg => (
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
                      <div className={`max-w-[70%] ${msg.role === 'candidate' ? 'text-right' : ''}`}>
                        <div className={`inline-block px-4 py-2 rounded-xl text-sm ${
                          msg.role === 'hr'
                            ? 'bg-slate-700/50 text-slate-200'
                            : 'bg-green-500/20 text-green-100'
                        }`}>
                          {msg.content}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {conv.aiAssessment && (
                  <div className="p-4 border-t border-slate-700/50">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-1">
                        <Star className="h-4 w-4" />
                        AI评估
                      </div>
                      <p className="text-sm text-slate-300">{conv.aiAssessment}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                该候选人暂无对话记录
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
