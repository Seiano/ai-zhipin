'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Award, Code, Save, Bot, CheckCircle, Sparkles, 
  Edit3, Download, Eye, FileText, Building2, Calendar
} from 'lucide-react'
import { saveResume, loadResume, getDemoResume, type ResumeInfo } from '@/lib/storage/resumeStorage'
import { zhangsanResume, type FullResumeData } from '@/lib/resumeData/zhangsan'

type ViewMode = 'view' | 'edit'

export default function ProfilePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('view')
  const [resume, setResume] = useState<ResumeInfo | null>(null)
  const [fullResume, setFullResume] = useState<FullResumeData | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)

  // 页面加载时读取简历
  useEffect(() => {
    // 优先从localStorage读取，没有则使用默认的张三简历
    let savedResume = loadResume()
    if (!savedResume) {
      savedResume = getDemoResume()
      // 自动保存默认简历到localStorage
      saveResume(savedResume)
    }
    setResume(savedResume)
    // 如果是张三，加载详细简历数据
    if (savedResume.name === '张三') {
      setFullResume(zhangsanResume)
    }
  }, [])

  // 打印/导出PDF
  const handlePrint = () => {
    window.print()
  }

  const handleStartAIAssistant = () => {
    router.push('/?startAI=true')
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 工具栏 - 打印时隐藏 */}
      <div className="print:hidden sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">我的简历</h1>
            <span className="text-sm text-gray-500">已登录: {resume.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {viewMode === 'view' ? (
              <>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <Download className="w-4 h-4" />
                  下载PDF
                </button>
                <button
                  onClick={() => setViewMode('edit')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  编辑简历
                </button>
                <button
                  onClick={handleStartAIAssistant}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <Bot className="w-4 h-4" />
                  AI求职助手
                </button>
              </>
            ) : (
              <button
                onClick={() => setViewMode('view')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <Eye className="w-4 h-4" />
                查看简历
              </button>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'view' ? (
        // 简历展示模式
        <div className="max-w-5xl mx-auto py-8 px-4 print:py-0 print:px-0 print:max-w-none">
          <div 
            ref={resumeRef}
            className="bg-white shadow-lg print:shadow-none"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* 简历头部 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{resume.name}</h1>
                  <p className="text-xl text-white/90 mb-4">
                    {fullResume?.basicInfo.targetPosition || resume.desiredPositions?.join(' / ')}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {resume.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {resume.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {resume.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {resume.experience}年经验
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {resume.education}
                    </span>
                  </div>
                </div>
                <div className="hidden print:hidden md:flex flex-col items-end gap-2">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl">
                    {resume.name[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* 核心优势 */}
            {fullResume && (
              <section className="px-8 py-6 border-b">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                  <Award className="w-5 h-5" />
                  核心优势
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {fullResume.coreAdvantages.map((adv, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-2">{index + 1}. {adv.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{adv.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 核心技能 */}
            <section className="px-8 py-6 border-b">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                <Code className="w-5 h-5" />
                核心技能
              </h2>
              {fullResume ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">{fullResume.coreSkills.visionCore.title}</h3>
                    <div className="space-y-2">
                      {fullResume.coreSkills.visionCore.skills.map((skill, index) => (
                        <div key={index} className="flex">
                          <span className="font-medium text-gray-700 min-w-28">• {skill.category}：</span>
                          <span className="text-gray-600 text-sm">{skill.items}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">{fullResume.coreSkills.supplementary.title}</h3>
                    <div className="space-y-2">
                      {fullResume.coreSkills.supplementary.skills.map((skill, index) => (
                        <div key={index} className="flex">
                          <span className="font-medium text-gray-700 min-w-28">• {skill.category}：</span>
                          <span className="text-gray-600 text-sm">{skill.items}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* 工作经历 */}
            <section className="px-8 py-6 border-b">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                <Building2 className="w-5 h-5" />
                工作经历
              </h2>
              {fullResume ? (
                <div className="space-y-6">
                  {fullResume.workExperience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-indigo-200">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-indigo-600"></div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{exp.company}</h3>
                          <p className="text-indigo-600 font-medium">{exp.position}</p>
                          <p className="text-sm text-gray-500">{exp.department}</p>
                        </div>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {exp.duration}
                        </span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="whitespace-pre-line text-gray-600">
                  {resume.workExperience}
                </div>
              )}
            </section>

            {/* 项目经验 */}
            <section className="px-8 py-6 border-b">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                <FileText className="w-5 h-5" />
                项目经验
              </h2>
              {fullResume ? (
                <div className="space-y-6">
                  {fullResume.keyProjects.map((project, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800">{index + 1}. {project.name}</h3>
                        <span className="text-sm text-gray-500">{project.duration}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium text-gray-700">项目背景：</span><span className="text-gray-600">{project.background}</span></p>
                        <p><span className="font-medium text-gray-700">担任角色：</span><span className="text-gray-600">{project.role}</span></p>
                        <div>
                          <span className="font-medium text-gray-700">核心工作：</span>
                          <ul className="list-disc list-inside ml-2 text-gray-600">
                            {project.coreWork.map((work, i) => (
                              <li key={i}>{work}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">项目成果：</span>
                          <ul className="list-disc list-inside ml-2 text-gray-600">
                            {project.results.map((result, i) => (
                              <li key={i}>{result}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.techStack.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {resume.detailedProjects?.map((project, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-2">{project.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {project.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 教育背景 */}
            <section className="px-8 py-6 border-b">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                <GraduationCap className="w-5 h-5" />
                教育背景
              </h2>
              {fullResume ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium">
                      {fullResume.education.degree}
                    </span>
                    <span className="font-bold text-gray-800">{fullResume.education.school}</span>
                    <span className="text-gray-600">{fullResume.education.major}</span>
                    <span className="text-gray-500 text-sm">{fullResume.education.duration}</span>
                  </div>
                  {fullResume.education.undergraduate && (
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-gray-500 text-white rounded text-sm font-medium">
                        {fullResume.education.undergraduate.degree}
                      </span>
                      <span className="font-bold text-gray-800">{fullResume.education.undergraduate.school}</span>
                      <span className="text-gray-600">{fullResume.education.undergraduate.major}</span>
                      <span className="text-gray-500 text-sm">{fullResume.education.undergraduate.duration}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">{resume.education}</p>
              )}
            </section>

            {/* 工作总结 */}
            {fullResume && (
              <section className="px-8 py-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                  工作总结
                </h2>
                <p className="text-gray-600 leading-relaxed indent-8">
                  {fullResume.summary}
                </p>
              </section>
            )}
          </div>
        </div>
      ) : (
        // 编辑模式 - 保留原有的表单
        <EditResumeForm 
          resume={resume} 
          onSave={(newResume) => {
            setResume(newResume)
            setShowSuccessMessage(true)
            setTimeout(() => setShowSuccessMessage(false), 3000)
          }}
          showSuccessMessage={showSuccessMessage}
        />
      )}

      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            margin: 10mm;
            size: A4;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

// 编辑表单组件
function EditResumeForm({ 
  resume, 
  onSave,
  showSuccessMessage 
}: { 
  resume: ResumeInfo
  onSave: (resume: ResumeInfo) => void
  showSuccessMessage: boolean
}) {
  const [formData, setFormData] = useState({
    name: resume.name || '',
    email: resume.email || '',
    phone: resume.phone || '',
    location: resume.location || '',
    title: resume.desiredPositions?.join(', ') || '',
    experience: `${resume.experience || 0}年`,
    education: resume.education || '',
    skills: resume.skills?.join(', ') || '',
    summary: resume.summary || '',
    workExperience: resume.workExperience || '',
    projects: resume.detailedProjects?.map(p => 
      `${p.name}\n${p.achievements.join('\n')}`
    ).join('\n\n') || '',
    certifications: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 解析并保存
    const skillsArray = formData.skills.split(/[,，、\n]/).map(s => s.trim()).filter(s => s)
    const expMatch = formData.experience.match(/(\d+)/)
    const experienceYears = expMatch ? parseInt(expMatch[1]) : 0
    const desiredPositions = formData.title.split(/[,，、\n]/).map(s => s.trim()).filter(s => s)

    const newResume: ResumeInfo = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      skills: skillsArray,
      experience: experienceYears,
      education: formData.education,
      desiredPositions,
      summary: formData.summary,
      workExperience: formData.workExperience,
    }
    
    saveResume(newResume)
    onSave(newResume)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <p className="font-medium text-green-800">简历保存成功!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            基本信息
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所在城市</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 职业信息 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            职业信息
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">期望职位</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">工作经验</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="应届生">应届生</option>
                <option value="1-3年">1-3年</option>
                <option value="3-5年">3-5年</option>
                <option value="5年">5年</option>
                <option value="5-10年">5-10年</option>
                <option value="10年以上">10年以上</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* 技能 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-600" />
            专业技能
          </h2>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="用逗号分隔，如：Python, PyTorch, YOLO..."
          />
        </div>

        {/* 工作经历 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            工作经历
          </h2>
          <textarea
            name="workExperience"
            value={formData.workExperience}
            onChange={handleChange}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <Save className="h-5 w-5" />
          保存简历
        </button>
      </form>
    </div>
  )
}
