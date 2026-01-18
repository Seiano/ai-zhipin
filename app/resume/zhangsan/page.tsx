'use client'

import { useRef } from 'react'
import { zhangsanResume, type FullResumeData } from '@/lib/resumeData/zhangsan'
import { Download, Mail, Phone, MapPin } from 'lucide-react'

/**
 * 张三简历展示页面
 * 支持打印/导出PDF
 */
export default function ZhangsanResumePage() {
  const resumeRef = useRef<HTMLDivElement>(null)
  const resume = zhangsanResume

  // 打印/导出PDF
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 工具栏 - 打印时隐藏 */}
      <div className="print:hidden sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">简历预览</h1>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Download className="w-4 h-4" />
            下载PDF / 打印
          </button>
        </div>
      </div>

      {/* 简历内容 */}
      <div className="max-w-4xl mx-auto py-8 px-4 print:py-0 print:px-0 print:max-w-none">
        <div 
          ref={resumeRef}
          className="bg-white shadow-lg print:shadow-none"
          style={{ 
            fontFamily: 'SimSun, "宋体", serif',
            fontSize: '10.5pt',
            lineHeight: 1.6
          }}
        >
          {/* 简历头部 */}
          <div className="px-12 pt-10 pb-6 border-b-2 border-gray-800">
            <h1 className="text-3xl font-bold text-center mb-2" style={{ fontFamily: 'SimHei, "黑体", sans-serif' }}>
              {resume.basicInfo.name}个人简历
            </h1>
          </div>

          {/* 基本信息 */}
          <div className="px-12 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">姓名：</span>
                  <span>{resume.basicInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">求职岗位：</span>
                  <span className="text-sm">{resume.basicInfo.targetPosition}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{resume.basicInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{resume.basicInfo.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 核心优势 */}
          <section className="px-12 py-6 border-b">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b-2 border-indigo-600" style={{ fontFamily: 'SimHei, "黑体", sans-serif' }}>
              核心优势
            </h2>
            <ol className="space-y-3 list-decimal list-inside">
              {resume.coreAdvantages.map((adv, index) => (
                <li key={index}>
                  <span className="font-bold">{adv.title}：</span>
                  <span className="text-gray-700">{adv.description}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 教育背景 */}
          <section className="px-12 py-6 border-b">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b-2 border-indigo-600" style={{ fontFamily: 'SimHei, "黑体", sans-serif' }}>
              教育背景
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-bold">{resume.education.duration}年</span>
                <span className="mx-2">{resume.education.school}</span>
                <span className="mx-2">{resume.education.major}</span>
                <span className="text-indigo-600 font-medium">{resume.education.degree}</span>
              </p>
              {resume.education.undergraduate && (
                <p>
                  <span className="font-bold">{resume.education.undergraduate.duration}年</span>
                  <span className="mx-2">{resume.education.undergraduate.school}</span>
                  <span className="mx-2">{resume.education.undergraduate.major}</span>
                  <span className="text-indigo-600 font-medium">{resume.education.undergraduate.degree}</span>
                </p>
              )}
            </div>
          </section>

          {/* 核心技能 */}
          <section className="px-12 py-6 border-b">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b-2 border-indigo-600" style={{ fontFamily: 'SimHei, "黑体", sans-serif' }}>
              核心技能
            </h2>
            
            <h3 className="font-bold text-gray-800 mb-2">{resume.coreSkills.visionCore.title}</h3>
            <ul className="space-y-2 mb-4">
              {resume.coreSkills.visionCore.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <span className="font-bold min-w-24">• {skill.category}：</span>
                  <span className="text-gray-700">{skill.items}</span>
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-gray-800 mb-2">{resume.coreSkills.supplementary.title}</h3>
            <ul className="space-y-2">
              {resume.coreSkills.supplementary.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <span className="font-bold min-w-24">• {skill.category}：</span>
                  <span className="text-gray-700">{skill.items}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 工作经历 */}
          <section className="px-12 py-6 border-b">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b-2 border-indigo-600" style={{ fontFamily: 'SimHei, "黑体", sans-serif' }}>
              工作经历
            </h2>
            <div className="space-y-6">
              {resume.workExperience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold">{exp.company}</span>
                      <span className="mx-2 text-gray-500">{exp.department}</span>
                      <span className="text-indigo-600">{exp.position}</span>
                    </div>
                    <span className="text-gray-600 text-sm">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 重点项目经验 */}
          <section className="px-12 py-6 border-b">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b-2 border-indigo-600" style={{ fontFamily: 'SimHei, "黑体", sans-serif' }}>
              重点项目经验
            </h2>
            <div className="space-y-6">
              {resume.keyProjects.map((project, index) => (
                <div key={index} className="pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-indigo-700">{index + 1}. {project.name}</h3>
                    <span className="text-gray-500 text-sm">({project.duration})</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-bold">• 项目背景：</span>
                      <span className="text-gray-700">{project.background}</span>
                    </p>
                    <p>
                      <span className="font-bold">• 个人角色：</span>
                      <span className="text-gray-700">{project.role}</span>
                    </p>
                    <div>
                      <span className="font-bold">• 核心工作：</span>
                      <ul className="list-disc list-inside ml-4 text-gray-700">
                        {project.coreWork.map((work, i) => (
                          <li key={i}>{work}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold">• 项目成果：</span>
                      <ul className="list-disc list-inside ml-4 text-gray-700">
                        {project.results.map((result, i) => (
                          <li key={i}>{result}</li>
                        ))}
                      </ul>
                    </div>
                    <p>
                      <span className="font-bold">• 技术栈：</span>
                      <span className="text-gray-600">{project.techStack.join('、')}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 工作总结 */}
          <section className="px-12 py-6">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b-2 border-indigo-600" style={{ fontFamily: 'SimHei, "黑体", sans-serif' }}>
              工作总结
            </h2>
            <p className="text-gray-700 leading-relaxed indent-8">
              {resume.summary}
            </p>
          </section>

        </div>
      </div>

      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            margin: 15mm;
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
