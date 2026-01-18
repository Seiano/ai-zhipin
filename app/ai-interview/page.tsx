'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Send, Upload, FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react'
import { parseResume, ParsedResume } from '@/lib/resumeParser'

interface Message {
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}

interface MatchResult {
  score: number
  strengths: string[]
  concerns: string[]
  recommendation: 'strong' | 'medium' | 'weak'
}

export default function AIInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: '你好！我是AI招聘助手小智。我会通过几个问题了解你的背景和期望，然后根据你的简历和我们的职位需求，为你匹配最合适的岗位。请问你叫什么名字？',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [interviewStage, setInterviewStage] = useState(0)
  const [aiPersonality, setAiPersonality] = useState<'friendly' | 'professional' | 'technical'>('professional')
  const [interviewMode, setInterviewMode] = useState<'chat' | 'structured'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // AI问题序列
  const aiQuestions = {
    friendly: [
      '很高兴认识你！请简单介绍一下自己吧！',
      '听起来很有趣！你在工作中最喜欢的部分是什么？',
      '很棒的经历！你有什么特别的爱好或兴趣吗？',
      '很好！你觉得自己最大的优势是什么？',
      '了解了！你对未来的职业发展有什么期待？',
      '很不错！你希望在什么样的团队环境中工作？',
      '非常感谢你的分享！请上传你的简历，我会帮你找到最合适的岗位。'
    ],
    professional: [
      '您好，我是AI招聘助手。请简要介绍您的专业背景和工作经历。',
      '了解了，您在AI领域有哪些具体的经验和专长？',
      '您提到了很多有价值的经验。您最擅长的技术栈是什么？',
      '很棒。您参与过哪些有代表性的AI项目？',
      '您期望的薪资范围是多少？',
      '您希望在哪个城市发展？',
      '感谢您的详细回答。请上传简历以便我们进行智能匹配。'
    ],
    technical: [
      '请介绍您的技术栈和主要使用的AI框架。',
      '您在机器学习/深度学习方面有哪些实践经验？',
      '请详细介绍一个您认为最有成就感的AI项目。',
      '您如何评估模型的性能？使用哪些指标？',
      '在模型训练过程中遇到过哪些挑战？如何解决的？',
      '您对当前AI技术发展趋势有什么看法？',
      '请上传您的技术简历，我们将进行深度技术匹配。'
    ]
  }
  
  const questions = aiQuestions[aiPersonality]
  const questionSequence = interviewMode === 'structured' ? questions : [questions[interviewStage]]

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // 模拟AI思考
    setTimeout(() => {
      setIsTyping(false)
      
      const nextStage = interviewStage + 1
      setInterviewStage(nextStage)

      const questions = aiQuestions[aiPersonality]
      if (nextStage < questions.length) {
        const aiMessage: Message = {
          role: 'ai',
          content: questions[nextStage],
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      }
    }, 1500)
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeUploaded(true)
      setIsTyping(true)

      try {
        // 解析简历
        const parsedResume = await parseResume(file)
        
        const aiMessage: Message = {
          role: 'ai',
          content: `✅ 简历已上传成功！姓名：${parsedResume.name}
我正在分析你的简历内容...

提取到的技能：${parsedResume.skills.slice(0, 5).join(', ')}
工作经验：${parsedResume.experience}年
教育背景：${parsedResume.education}
所在城市：${parsedResume.location}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])

        // 模拟匹配分析
        setTimeout(() => {
          analyzeMatch(parsedResume)
        }, 2000)
      } catch (error) {
        console.error('简历解析失败:', error)
        setIsTyping(false)
        
        const errorMessage: Message = {
          role: 'ai',
          content: '❌ 简历解析失败，请确保上传的是有效的PDF或Word文档。',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    }
  }

  const analyzeMatch = async (resumeData: ParsedResume) => {
    try {
      const response = await fetch('/api/ai-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: {
            name: resumeData.name,
            skills: resumeData.skills,
            experience: resumeData.experience,
            education: resumeData.education,
            projects: resumeData.projects,
            location: resumeData.location,
            salaryExpectation: resumeData.salaryExpectation || 40
          },
          jobId: 'job_001'
        }),
      })

      if (!response.ok) {
        throw new Error('AI匹配分析失败')
      }

      const result = await response.json()
      setMatchResult(result)

      const resultMessage: Message = {
        role: 'ai',
        content: `🎯 **智能匹配分析完成！**

**综合匹配度：${result.score}分**

**优势亮点：**
${result.strengths.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

**需要关注：**
${result.concerns.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}

**推荐结论：** ${result.recommendation === 'strong' ? '你与我们的"大模型算法专家（字节跳动）"岗位高度匹配！我已经将你的简历推送给HR，他们会在24小时内与你联系。' : result.recommendation === 'medium' ? '你与岗位有一定匹配度，建议进一步面试评估。' : '匹配度较低，建议考虑其他更适合的岗位。'}

同时，我还为你匹配了其他3个合适的岗位，你可以查看详情。`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, resultMessage])
    } catch (error) {
      console.error('AI匹配分析失败:', error)
      
      const errorMessage: Message = {
        role: 'ai',
        content: '❌ 很抱歉，AI匹配分析出现了一些问题。请稍后再试或联系客服。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🤖 AI智能面试</h1>
              <p className="text-white/90">由AI助手为你匹配最合适的岗位</p>
            </div>
            <Link href="/" className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition">
              返回首页
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：对话区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ height: '70vh' }}>
              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="border-t bg-white p-4">
                {!resumeUploaded && interviewStage >= aiQuestions[aiPersonality].length - 1 ? (
                  <div className="flex gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleResumeUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                      <Upload className="w-5 h-5" />
                      上传简历 (PDF/Word)
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="输入你的回答..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={resumeUploaded}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || resumeUploaded}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：状态面板 */}
          <div className="space-y-6">
            {/* 面试进度 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                面试进度
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">基本信息</span>
                  <CheckCircle className={`w-5 h-5 ${interviewStage >= 1 ? 'text-green-500' : 'text-gray-300'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">技能背景</span>
                  <CheckCircle className={`w-5 h-5 ${interviewStage >= 3 ? 'text-green-500' : 'text-gray-300'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">项目经验</span>
                  <CheckCircle className={`w-5 h-5 ${interviewStage >= 4 ? 'text-green-500' : 'text-gray-300'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">期望条件</span>
                  <CheckCircle className={`w-5 h-5 ${interviewStage >= 6 ? 'text-green-500' : 'text-gray-300'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">简历上传</span>
                  <CheckCircle className={`w-5 h-5 ${resumeUploaded ? 'text-green-500' : 'text-gray-300'}`} />
                </div>
              </div>
            </div>

            {/* 匹配结果 */}
            {matchResult && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">匹配结果</h3>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">
                    {matchResult.score}
                  </div>
                  <div className="text-sm text-gray-600">综合匹配度</div>
                </div>
                <div className={`px-4 py-3 rounded-lg ${
                  matchResult.recommendation === 'strong' ? 'bg-green-50 text-green-700' :
                  matchResult.recommendation === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  <div className="font-semibold mb-1">
                    {matchResult.recommendation === 'strong' ? '🎉 强烈推荐' :
                     matchResult.recommendation === 'medium' ? '👍 推荐面试' :
                     '🤔 需要评估'}
                  </div>
                  <div className="text-sm">
                    已自动推送给HR
                  </div>
                </div>
              </div>
            )}

            {/* AI功能说明 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">🤖 AI智能助手</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span>
                  <span>智能对话了解候选人背景</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span>
                  <span>自动解析简历关键信息</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span>
                  <span>匹配度评分和推荐理由</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span>
                  <span>高匹配度自动推送HR</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
