'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin, Calendar, Briefcase, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { mockJobs, jobCategories } from '@/lib/mockData'

export default function SeekerJobsPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '')
  const [levelFilter, setLevelFilter] = useState('')
  const [showAllCategories, setShowAllCategories] = useState(false)

  // 从URL参数初始化分类筛选
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setCategoryFilter(category)
    }
  }, [searchParams])

  // 为每个分类计算实际职位数量
  const categoryJobCounts = jobCategories.map(cat => ({
    ...cat,
    count: mockJobs.filter(job => job.category === cat.id).length
  }))

  const filteredJobs = mockJobs.filter(job => {
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
  const displayedCategories = showAllCategories ? categoryJobCounts : categoryJobCounts.slice(0, 8)

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
        {/* 专业领域分类 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {jobCategories.length} 个AI专业领域
            </h2>
            <button
              onClick={() => {
                setCategoryFilter('')
                setShowAllCategories(!showAllCategories)
              }}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
            >
              {showAllCategories ? (
                <>收起 <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>展开全部 <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setCategoryFilter('')}
              className={`p-3 rounded-lg text-left transition border-2 ${
                categoryFilter === ''
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">🌟</div>
              <div className="font-medium text-sm">全部领域</div>
              <div className="text-xs text-gray-500">{mockJobs.length} 个职位</div>
            </button>
            
            {displayedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`p-3 rounded-lg text-left transition border-2 ${
                  categoryFilter === category.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="font-medium text-sm truncate">{category.name}</div>
                <div className="text-xs text-gray-500">{category.count} 个职位</div>
              </button>
            ))}
          </div>
          
          {!showAllCategories && categoryJobCounts.length > 8 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllCategories(true)}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                查看全部 {categoryJobCounts.length} 个领域 →
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
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
            {['初级', '中级', '高级', '专家', '研究员', '架构师'].map(level => (
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
            {categoryFilter && (
              <span className="mr-2">
                当前筛选: <span className="text-indigo-600 font-medium">
                  {jobCategories.find(c => c.id === categoryFilter)?.name}
                </span>
              </span>
            )}
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
                        热招
                      </span>
                    )}
                    {job.isUrgent && (
                      <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded">
                        急聘
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
