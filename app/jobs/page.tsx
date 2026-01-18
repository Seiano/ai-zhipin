'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Calendar, Briefcase, Search } from 'lucide-react'
import { mockJobs, jobCategories } from '@/lib/mockData'
import { useAIOperation } from '@/components/AIOperationProvider'
import { extractKeywordsFromResume, rankJobs } from '@/lib/resumeAnalyzer'

export default function JobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const { state, moveCursor, clickAt, setStatus, setPhase, typeText, scrollPage, navigateTo } = useAIOperation()
  const isAIMode = searchParams.get('ai') === 'true'
  const hasStarted = useRef(false)

  // AI自动化操作
  useEffect(() => {
    if (isAIMode && state.isActive && !hasStarted.current) {
      hasStarted.current = true
      runAIAutomation()
    }
  }, [isAIMode, state.isActive])

  const runAIAutomation = async () => {
    if (!state.resume) return
    
    // 等待页面加载
    await new Promise(r => setTimeout(r, 800))
    
    // 1. 移动到搜索框
    setStatus('正在移动到搜索框...')
    const searchBox = searchInputRef.current
    if (searchBox) {
      const rect = searchBox.getBoundingClientRect()
      await moveCursor(rect.left + rect.width / 2, rect.top + rect.height / 2, 600)
      await clickAt(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
    
    await new Promise(r => setTimeout(r, 300))
    
    // 2. 调用 LLM 分析简历，决定搜索什么职位
    setStatus('AI正在分析您的简历...')
    let searchText = '算法工程师' // 默认值
    
    try {
      const response = await fetch('/api/ai-analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: state.resume })
      })
      
      if (response.ok) {
        const result = await response.json()
        searchText = result.searchKeyword || searchText
        setStatus(`AI决策: 搜索"${searchText}" - ${result.reasoning || ''}`)
        await new Promise(r => setTimeout(r, 500))
      }
    } catch (error) {
      console.error('AI分析失败:', error)
      // 使用简历中的期望职位作为备选
      searchText = state.resume.desiredPositions?.[0] || searchText
    }
    
    setStatus(`正在搜索: ${searchText}`)
    
    // 逐字输入
    for (let i = 0; i < searchText.length; i++) {
      setSearchTerm(searchText.substring(0, i + 1))
      await new Promise(r => setTimeout(r, 80 + Math.random() * 40))
    }
    
    await new Promise(r => setTimeout(r, 500))
    setPhase('filtering')
    
    // 3. 滚动浏览职位列表
    setStatus('正在浏览职位列表...')
    await scrollPage(200)
    await new Promise(r => setTimeout(r, 400))
    
    // 4. 找到最匹配的职位
    const rankedJobs = rankJobs(mockJobs, state.resume)
    const topJob = rankedJobs[0]
    
    if (topJob && topJob.score >= 70) {
      setStatus(`发现高匹配职位: ${topJob.job.title} (${topJob.score}%)`)
      await new Promise(r => setTimeout(r, 800))
      
      // 5. 移动到该职位并点击
      const jobLink = document.querySelector(`a[href="/jobs/${topJob.job.id}"]`)
      if (jobLink) {
        const rect = jobLink.getBoundingClientRect()
        
        // 滚动到可见
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          await scrollPage(rect.top - 200)
          await new Promise(r => setTimeout(r, 300))
        }
        
        const newRect = jobLink.getBoundingClientRect()
        setStatus(`正在点击: ${topJob.job.company} - ${topJob.job.title}`)
        await moveCursor(newRect.left + newRect.width / 2, newRect.top + newRect.height / 2, 500)
        await clickAt(newRect.left + newRect.width / 2, newRect.top + newRect.height / 2)
        
        await new Promise(r => setTimeout(r, 300))
        
        // 6. 跳转到职位详情页的AI模式
        setPhase('viewing')
        navigateTo(`/jobs/${topJob.job.id}?ai=true`)
      }
    } else {
      setStatus('未找到高匹配度职位')
    }
  }

  const filteredJobs = mockJobs.filter(job => {
    // 支持多关键词搜索（空格分隔）
    const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(t => t.length > 0)
    const matchesSearch = searchTerms.length === 0 || searchTerms.some(term =>
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.tags.some(tag => tag.toLowerCase().includes(term))
    )
    const matchesLocation = !locationFilter || job.location === locationFilter
    const matchesCategory = !categoryFilter || job.category === categoryFilter
    const matchesLevel = !levelFilter || job.level.includes(levelFilter)
    return matchesSearch && matchesLocation && matchesCategory && matchesLevel
  })

  const locations = Array.from(new Set(mockJobs.map(job => job.location)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">AI职位大厅</h1>
          <p className="text-lg text-white/90">探索 {mockJobs.length} 个前沿AI岗位机会</p>
        </div>
      </div>



      <div className="container mx-auto px-6 py-8">

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="搜索职位、公司或技能..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">所有领域</option>
              {jobCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">所有城市</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setLevelFilter('')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                levelFilter === '' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部职级
            </button>
            {['初级', '高级', '专家', '研究员', '架构师'].map(level => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  levelFilter === level ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            找到 <span className="text-indigo-600 font-semibold">{filteredJobs.length}</span> 个职位
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <Link 
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition p-5 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {job.isHot && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                        🔥 热招
                      </span>
                    )}
                    {job.isUrgent && (
                      <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded">
                        ⚡ 急聘
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{job.location} · {job.company}</div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-indigo-600">{job.salary}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                      {jobCategories.find(c => c.id === job.category)?.name || '其他'}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                      {job.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {job.postedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.tags.slice(0, 6).map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {job.tags.length > 6 && (
                  <span className="text-xs text-gray-500">+{job.tags.length - 6}</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg mb-2">没有找到匹配的职位</p>
            <p className="text-gray-500 text-sm">试试调整筛选条件或搜索关键词</p>
          </div>
        )}
      </div>
    </div>
  )
}
