'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Bot, ArrowLeft, Sparkles, Building2, CheckCircle2 } from 'lucide-react'
import { mockJobs, jobCategories } from '@/lib/mockData'
import { getDemoResume, type ResumeInfo } from '@/lib/storage/resumeStorage'

interface Message {
  id: string
  role: 'ai_assistant' | 'electronic_hr' | 'system'
  content: string
  isStreaming?: boolean
  timestamp?: Date
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = Number(params.jobId)
  const job = mockJobs.find(j => j.id === jobId)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSpeaker, setCurrentSpeaker] = useState<'ai_assistant' | 'electronic_hr' | null>(null)
  const [resume, setResume] = useState<ResumeInfo | null>(null)
  const [round, setRound] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [statusText, setStatusText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false)
  const userScrolledRef = useRef(false) // 用户是否手动滚动了

  // 获取简历
  useEffect(() => {
    const storedResume = localStorage.getItem('user_resume')
    if (storedResume) {
      setResume(JSON.parse(storedResume))
    } else {
      setResume(getDemoResume())
    }
  }, [])

  // 自动滚动 - 只在用户没有手动滚动时才自动滚动到底部
  useEffect(() => {
    if (!userScrolledRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 检测用户滚动行为
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    // 检查是否滚动到底部附近（100px以内）
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
    
    // 如果用户滚动到底部，恢复自动滚动
    if (isNearBottom) {
      userScrolledRef.current = false
    } else {
      userScrolledRef.current = true
    }
  }

  // 开始对话
  useEffect(() => {
    if (resume && job && !hasStartedRef.current) {
      hasStartedRef.current = true
      startConversation()
    }
  }, [resume, job])

  // 流式生成消息
  const streamMessage = async (
    role: 'ai_assistant' | 'electronic_hr',
    chatHistory: Message[]
  ): Promise<string> => {
    const messageId = `msg_${Date.now()}_${role}`
    
    // 添加一个空消息，准备流式填充
    setMessages(prev => [...prev, {
      id: messageId,
      role,
      content: '',
      isStreaming: true,
      timestamp: new Date()
    }])
    setCurrentSpeaker(role)
    setIsGenerating(true)
    setStatusText(role === 'ai_assistant' ? '你的AI助手正在思考...' : '电子HR正在回复...')

    try {
      const response = await fetch('/api/ai-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
          resume,
          job,
          mode: role,
          round
        })
      })

      if (!response.ok) {
        throw new Error('API请求失败')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        // 用于缓存待显示的字符队列
        let pendingChars: string[] = []
        let isDisplaying = false

        // 逐字符显示函数，带延迟
        const displayNextChar = async () => {
          if (isDisplaying) return
          isDisplaying = true
          
          while (pendingChars.length > 0) {
            const char = pendingChars.shift()!
            fullContent += char
            setMessages(prev => prev.map(m => 
              m.id === messageId 
                ? { ...m, content: fullContent }
                : m
            ))
            // 每个字符之间延迟60-100ms，模拟打字效果
            await new Promise(r => setTimeout(r, 60 + Math.random() * 40))
          }
          
          isDisplaying = false
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  // 将内容按字符加入队列
                  pendingChars.push(...parsed.content.split(''))
                  // 开始逐字符显示
                  displayNextChar()
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }

        // 等待所有字符显示完毕
        while (pendingChars.length > 0 || isDisplaying) {
          await new Promise(r => setTimeout(r, 50))
          if (!isDisplaying && pendingChars.length > 0) {
            await displayNextChar()
          }
        }
      }

      // 标记流式结束
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, isStreaming: false }
          : m
      ))

      return fullContent

    } catch (error) {
      console.error('流式生成失败:', error)
      // 返回一个默认回复
      const fallback = role === 'ai_assistant' 
        ? `您好！我对${job?.title}职位非常感兴趣，期待与您交流。`
        : `感谢您的关注！请介绍一下您的相关经验。`
      
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, content: fallback, isStreaming: false }
          : m
      ))
      return fallback
    } finally {
      setIsGenerating(false)
      setCurrentSpeaker(null)
      setStatusText('')
    }
  }

  // 开始对话流程
  const startConversation = async () => {
    if (!job || !resume) return

    setStatusText('正在连接电子HR...')
    await new Promise(r => setTimeout(r, 2000))

    // 电子HR欢迎消息
    const welcomeMsg: Message = {
      id: 'hr_welcome',
      role: 'electronic_hr',
      content: `您好！我是${job.company}的电子HR，负责${job.title}职位的初步沟通。很高兴与您交流！\n\n请简单介绍一下您的背景和对这个职位的兴趣。`,
      timestamp: new Date()
    }
    setMessages([welcomeMsg])
    setStatusText('')

    // 等待用户"阅读"
    await new Promise(r => setTimeout(r, 3000))

    // 开始多轮对话
    let chatHistory: Message[] = [welcomeMsg]
    const maxRounds = 3

    for (let i = 0; i < maxRounds; i++) {
      setRound(i + 1)

      // AI助手回复
      const aiContent = await streamMessage('ai_assistant', chatHistory)
      const aiMsg: Message = {
        id: `ai_${i}`,
        role: 'ai_assistant',
        content: aiContent,
        timestamp: new Date()
      }
      chatHistory = [...chatHistory, aiMsg]

      // 等待"阅读"时间
      await new Promise(r => setTimeout(r, 2500))

      // 电子HR回复
      let hrContent = await streamMessage('electronic_hr', chatHistory)
      
      // 最后一轮添加结论
      if (i === maxRounds - 1) {
        hrContent += '\n\n🎉 综合评估：您的背景与职位要求匹配度很高！我已将您的信息推荐给技术团队，HR将在1-2个工作日内与您联系安排面试。'
        setMessages(prev => prev.map(m => 
          m.role === 'electronic_hr' && prev.indexOf(m) === prev.length - 1
            ? { ...m, content: hrContent }
            : m
        ))
      }

      const hrMsg: Message = {
        id: `hr_${i}`,
        role: 'electronic_hr',
        content: hrContent,
        timestamp: new Date()
      }
      chatHistory = [...chatHistory, hrMsg]

      if (i < maxRounds - 1) {
        // 等待下一轮
        await new Promise(r => setTimeout(r, 2500))
      }
    }

    setIsComplete(true)
  }

  // 格式化时间
  const formatTime = (date?: Date) => {
    if (!date) return ''
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-xl">职位不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">返回</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">{job.company}</div>
                <div className="text-xs text-gray-500">{job.title}</div>
              </div>
            </div>
            
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* 职位信息卡片 */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-gray-900">{job.title}</h1>
              <div className="text-sm text-gray-500">{job.company} · {job.location}</div>
              <div className="text-lg font-bold text-indigo-600 mt-1">{job.salary}</div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                {jobCategories.find(c => c.id === job.category)?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 聊天区域 */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pb-32"
      >
        <div className="max-w-3xl mx-auto space-y-6 py-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 animate-fadeIn ${msg.role === 'ai_assistant' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'system' ? (
                <div className="w-full text-center py-4">
                  <span className="text-gray-400 text-sm">{msg.content}</span>
                </div>
              ) : (
                <>
                  {/* 头像 */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    msg.role === 'ai_assistant' 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                      : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                  }`}>
                    {msg.role === 'ai_assistant' ? (
                      <Sparkles className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className={`flex flex-col ${msg.role === 'ai_assistant' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <div className={`flex items-center gap-2 mb-1 ${msg.role === 'ai_assistant' ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-xs font-medium ${msg.role === 'ai_assistant' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                        {msg.role === 'ai_assistant' ? '你的AI助手' : '电子HR'}
                      </span>
                      <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === 'ai_assistant'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-100'
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed text-sm">
                        {msg.content}
                        {msg.isStreaming && (
                          <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* 正在输入指示器 */}
          {statusText && !isComplete && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm text-gray-500">{statusText}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {isComplete ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span>对话完成</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">您的简历已被推荐给技术团队，HR将在1-2个工作日内联系您</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.push('/jobs')}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition text-sm"
                >
                  继续浏览职位
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition text-sm"
                >
                  查看我的简历
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 text-sm">AI助手正在为您与电子HR沟通中，请稍候...</span>
            </div>
          )}
        </div>
      </div>

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
