'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Calendar, Briefcase, GraduationCap, Clock, ArrowLeft, Bot, Send, User, MessageCircle, Sparkles, X, MousePointer2, ChevronRight, CheckCircle2, Star, MessageSquare, Zap, Edit3, Hand } from 'lucide-react'
import { mockJobs, jobCategories, type Job } from '@/lib/mockData'
import { getDemoResume, type ResumeInfo } from '@/lib/storage/resumeStorage'
import { useAIOperation } from '@/components/AIOperationProvider'
import { type MatchResult } from '@/lib/resumeAnalyzer'

interface Message {
  id: string
  role: 'ai_assistant' | 'electronic_hr' | 'user'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

// 职位聊天状态
interface JobChatState {
  messages: Message[]
  isComplete: boolean
  isFocused: boolean // HR给出正面反馈，需要重点跟进
  round: number
}

// 对话模式类型
type ChatMode = 'auto' | 'semi-auto' | 'manual'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const job = mockJobs.find(j => j.id === Number(params.id))
  
  // 获取AI操作上下文中的匹配职位列表
  const { state: aiState } = useAIOperation()
  const matchedJobs = aiState.matchedJobs
  
  const [showChat, setShowChat] = useState(false)
  
  // 每个职位的聊天状态 - 使用Map存储
  const [jobChats, setJobChats] = useState<Map<number, JobChatState>>(new Map())
  
  // 当前正在对话的职位ID（在对话框内切换时使用）
  const [currentChatJobId, setCurrentChatJobId] = useState<number | null>(null)
  
  // 重点跟进的职位列表
  const [focusedJobIds, setFocusedJobIds] = useState<number[]>([])
  
  const [isAITyping, setIsAITyping] = useState(false)
  const [statusText, setStatusText] = useState('')
  
  // 对话模式：auto(全自动), semi-auto(半自动), manual(手动)
  const [chatMode, setChatMode] = useState<ChatMode>('auto')
  
  // 编辑框内容（半自动和手动模式下使用）
  const [draftContent, setDraftContent] = useState('')
  
  // 是否等待用户确认发送
  const [waitingForSend, setWaitingForSend] = useState(false)
  
  // 虚拟光标状态
  const [showCursor, setShowCursor] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorPhase, setCursorPhase] = useState<'idle' | 'moving' | 'clicking'>('idle')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const aiButtonRef = useRef<HTMLButtonElement>(null)
  const hasStartedRef = useRef(false)
  const userScrolledRef = useRef(false)
  const conversationInProgressRef = useRef(false)
  
  const isAutoMode = searchParams.get('auto') === 'true' || searchParams.get('ai') === 'true'
  
  // 获取用户简历
  const [resume, setResume] = useState<ResumeInfo | null>(null)
  
  useEffect(() => {
    const storedResume = typeof window !== 'undefined' 
      ? localStorage.getItem('user_resume')
      : null
    if (storedResume) {
      setResume(JSON.parse(storedResume))
    } else {
      setResume(getDemoResume())
    }
  }, [])

  // 获取当前对话职位
  const currentChatJob = currentChatJobId ? mockJobs.find(j => j.id === currentChatJobId) : null
  const currentJobChat = currentChatJobId ? jobChats.get(currentChatJobId) : null
  const currentMessages = currentJobChat?.messages || []
  const isCurrentComplete = currentJobChat?.isComplete || false

  // 检测用户滚动行为
  const handleScroll = () => {
    const container = chatContainerRef.current
    if (!container) return
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50
    if (!isNearBottom) {
      userScrolledRef.current = true
    } else if (isNearBottom && userScrolledRef.current) {
      userScrolledRef.current = false
    }
  }

  // 滚动到底部
  const scrollToBottomOnce = () => {
    if (userScrolledRef.current) return
    setTimeout(() => {
      if (!userScrolledRef.current && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  // 当进入自动模式时，开始AI自动对话
  useEffect(() => {
    if (isAutoMode && resume && !hasStartedRef.current && job) {
      hasStartedRef.current = true
      startCursorAnimation()
    }
  }, [isAutoMode, resume, job])

  // 光标移动动画
  const startCursorAnimation = async () => {
    await new Promise(r => setTimeout(r, 500))
    
    const button = aiButtonRef.current
    if (!button) {
      if (job) startAIConversation(job.id)
      return
    }
    
    const rect = button.getBoundingClientRect()
    const targetX = rect.left + rect.width / 2
    const targetY = rect.top + rect.height / 2
    const startX = window.innerWidth / 2
    const startY = window.innerHeight / 2
    
    setShowCursor(true)
    setCursorPosition({ x: startX, y: startY })
    setCursorPhase('moving')
    
    const duration = 1500
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      const currentX = startX + (targetX - startX) * easeProgress
      const currentY = startY + (targetY - startY) * easeProgress
      
      setCursorPosition({ x: currentX, y: currentY })
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCursorPhase('clicking')
        setTimeout(() => {
          setShowCursor(false)
          if (job) startAIConversation(job.id)
        }, 500)
      }
    }
    
    requestAnimationFrame(animate)
  }

  // 更新职位聊天状态
  const updateJobChat = useCallback((jobId: number, updates: Partial<JobChatState>) => {
    setJobChats(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(jobId) || { messages: [], isComplete: false, isFocused: false, round: 0 }
      newMap.set(jobId, { ...existing, ...updates })
      return newMap
    })
  }, [])

  // 添加消息到指定职位
  const addMessageToJob = useCallback((jobId: number, message: Message) => {
    setJobChats(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(jobId) || { messages: [], isComplete: false, isFocused: false, round: 0 }
      newMap.set(jobId, { ...existing, messages: [...existing.messages, message] })
      return newMap
    })
  }, [])

  // 更新消息内容
  const updateMessageInJob = useCallback((jobId: number, messageId: string, content: string, isStreaming: boolean = true) => {
    setJobChats(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(jobId)
      if (existing) {
        const updatedMessages = existing.messages.map(m => 
          m.id === messageId ? { ...m, content, isStreaming } : m
        )
        newMap.set(jobId, { ...existing, messages: updatedMessages })
      }
      return newMap
    })
  }, [])

  // 生成礼貌性结束语
  const generateFarewellMessage = (targetJob: Job): string => {
    const farewells = [
      `非常感谢您今天抽出时间和我交流！通过这次对话，我对${targetJob.company}和这个${targetJob.title}职位有了更深入的了解，也更加期待能有机会加入团队。期待您的好消息，祝您工作顺利！`,
      `谢谢李雯老师的耐心沟通！今天聊得很愉快，也让我对${targetJob.company}的团队氛围有了很好的印象。非常期待后续的面试机会，有任何需要补充的材料请随时告诉我。再次感谢！`,
      `感谢您的时间！这次交流让我收获很多，也坚定了我想加入${targetJob.company}的想法。期待能有进一步交流的机会，也祝您工作顺心！`
    ]
    return farewells[Math.floor(Math.random() * farewells.length)]
  }

  // 发送礼貌性结束语（逐字显示）
  const sendFarewellMessage = async (jobId: number, content: string) => {
    setIsAITyping(true)
    setStatusText('AI助手正在组织告别语...')
    await new Promise(r => setTimeout(r, 750 + Math.random() * 375))
    
    const messageId = `farewell_${jobId}_${Date.now()}`
    const farewellMsg: Message = {
      id: messageId,
      role: 'ai_assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date()
    }
    addMessageToJob(jobId, farewellMsg)
    scrollToBottomOnce()
    
    setStatusText('AI助手正在输入...')
    
    // 逐字显示
    const contentChars = content.split('')
    let displayedContent = ''
    for (let i = 0; i < contentChars.length; i++) {
      displayedContent += contentChars[i]
      updateMessageInJob(jobId, messageId, displayedContent, true)
      await new Promise(r => setTimeout(r, 50 + Math.random() * 30))
    }
    
    updateMessageInJob(jobId, messageId, displayedContent, false)
    setIsAITyping(false)
    setStatusText('')
    scrollToBottomOnce()
  }

  // 开始AI对话 - 只发送HR欢迎消息，然后等待用户回复
  const startAIConversation = async (jobId: number) => {
    const targetJob = mockJobs.find(j => j.id === jobId)
    if (!targetJob) return
    
    // 如果已经有对话记录，直接显示
    const existingChat = jobChats.get(jobId)
    if (existingChat && existingChat.messages.length > 0) {
      setShowChat(true)
      setCurrentChatJobId(jobId)
      // 如果对话未完成，继续等待用户输入
      if (!existingChat.isComplete) {
        prepareNextResponse(jobId, existingChat.round)
      }
      return
    }
    
    // 防止重复启动
    if (conversationInProgressRef.current) return
    conversationInProgressRef.current = true
    
    setShowChat(true)
    setCurrentChatJobId(jobId)
    setStatusText('正在连接电子HR...')
    
    // 初始化聊天状态
    updateJobChat(jobId, { messages: [], isComplete: false, isFocused: false, round: 1 })
    
    await new Promise(r => setTimeout(r, 1125))
    
    // 电子HR欢迎消息
    const welcomeMsg: Message = {
      id: `hr_welcome_${jobId}`,
      role: 'electronic_hr',
      content: `您好！我是${targetJob.company}的电子HR，负责${targetJob.title}职位的初步沟通。很高兴与您交流！\n\n请简单介绍一下您的背景和对这个职位的兴趣。`,
      timestamp: new Date()
    }
    addMessageToJob(jobId, welcomeMsg)
    setStatusText('')
    
    conversationInProgressRef.current = false
    
    // 准备用户回复，传入当前round
    await new Promise(r => setTimeout(r, 750))
    prepareNextResponse(jobId, 1)
  }

  // 准备下一条回复（根据模式生成AI建议或等待手动输入）
  const prepareNextResponse = async (jobId: number, currentRound?: number) => {
    const targetJob = mockJobs.find(j => j.id === jobId)
    if (!targetJob) return
    
    // 使用传入的round或从状态获取
    const chatState = jobChats.get(jobId)
    const round = currentRound ?? chatState?.round ?? 1
    
    if (chatState?.isComplete) return
    
    if (chatMode === 'manual') {
      // 手动模式：清空编辑框，等待用户输入
      setDraftContent('')
      setWaitingForSend(true)
      setStatusText('请输入您的回复...')
    } else {
      // 半自动或全自动模式：先阅读对话内容，再生成建议
      const messages = chatState?.messages || []
      const lastMessage = messages[messages.length - 1]
      
      // 模拟阅读最后一条消息的时间
      if (lastMessage) {
        setStatusText('AI助手正在阅读对话内容...')
        const readingDelay = Math.min(lastMessage.content.length * 30 + 375, 2250) // 最少0.375秒，最多2.25秒
        await new Promise(r => setTimeout(r, readingDelay))
      }
      
      setStatusText('AI助手正在思考如何回复...')
      setIsAITyping(true)
      
      // 思考延迟
      await new Promise(r => setTimeout(r, 600 + Math.random() * 525))
      
      setStatusText('AI正在生成建议回复...')
      const aiSuggestion = await generateAISuggestion(jobId, messages, targetJob, round)
      
      if (chatMode === 'semi-auto') {
        // 半自动模式：将AI建议显示在编辑框，等待用户确认/修改
        setDraftContent(aiSuggestion)
        setWaitingForSend(true)
        setStatusText('AI已生成建议，您可以修改后发送')
      } else {
        // 全自动模式：直接发送
        setStatusText('AI正在自动发送回复...')
        await sendUserMessage(jobId, aiSuggestion, round)
      }
      
      setIsAITyping(false)
    }
  }

  // 生成AI建议回复（不添加到消息列表，只返回内容）
  const generateAISuggestion = async (
    jobId: number,
    chatHistory: Message[],
    targetJob: Job,
    round: number
  ): Promise<string> => {
    try {
      const response = await fetch('/api/ai-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
          resume,
          job: targetJob,
          mode: 'ai_assistant',
          round
        })
      })

      if (!response.ok) throw new Error('API请求失败')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        // 半自动模式下使用逐字显示效果（与全自动一致）
        let pendingChars: string[] = []
        let isDisplaying = false
        let displayedContent = ''

        const displayNextChar = async () => {
          if (isDisplaying) return
          isDisplaying = true
          
          while (pendingChars.length > 0) {
            const char = pendingChars.shift()!
            displayedContent += char
            if (chatMode === 'semi-auto') {
              setDraftContent(displayedContent)
            }
            // 与全自动模式相同的延迟：50-80ms
            await new Promise(r => setTimeout(r, 50 + Math.random() * 30))
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
                  fullContent += parsed.content
                  // 将新内容加入待显示队列
                  pendingChars.push(...parsed.content.split(''))
                  displayNextChar()
                }
              } catch (e) {}
            }
          }
        }

        // 等待所有字符显示完成
        while (pendingChars.length > 0 || isDisplaying) {
          await new Promise(r => setTimeout(r, 50))
          if (!isDisplaying && pendingChars.length > 0) {
            await displayNextChar()
          }
        }
      }

      return fullContent || `您好！我对${targetJob.title}职位非常感兴趣，期待与您交流。`
    } catch (error) {
      return `您好！我对${targetJob.title}职位非常感兴趣，期待与您交流。`
    }
  }

  // 发送用户消息并等待HR回复（AI助手的消息也逐字显示）
  const sendUserMessage = async (jobId: number, content: string, currentRound?: number) => {
    if (!content.trim()) return
    
    const targetJob = mockJobs.find(j => j.id === jobId)
    if (!targetJob) return
    
    const chatState = jobChats.get(jobId)
    const round = currentRound ?? chatState?.round ?? 1
    
    setWaitingForSend(false)
    setDraftContent('')
    
    // AI助手也要像真人一样：思考 -> 输入 -> 发送
    setIsAITyping(true)
    setStatusText('AI助手正在组织语言...')
    await new Promise(r => setTimeout(r, 600 + Math.random() * 525))
    
    // 创建空消息，然后逐字显示（和电子HR一样的效果）
    const messageId = `user_${jobId}_${round}`
    const userMsg: Message = {
      id: messageId,
      role: 'ai_assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date()
    }
    addMessageToJob(jobId, userMsg)
    scrollToBottomOnce()
    
    setStatusText('AI助手正在输入...')
    
    // 逐字显示AI助手的回复内容
    const contentChars = content.trim().split('')
    let displayedContent = ''
    for (let i = 0; i < contentChars.length; i++) {
      displayedContent += contentChars[i]
      updateMessageInJob(jobId, messageId, displayedContent, true)
      // 与电子HR相同的打字速度：50-80ms每字
      await new Promise(r => setTimeout(r, 50 + Math.random() * 30))
    }
    
    // 完成输入
    updateMessageInJob(jobId, messageId, displayedContent, false)
    setIsAITyping(false)
    setStatusText('')
    scrollToBottomOnce()
    
    // 获取更新后的消息历史
    const currentMessages = chatState?.messages || []
    const finalMsg: Message = {
      id: messageId,
      role: 'ai_assistant',
      content: content.trim(),
      timestamp: new Date()
    }
    const updatedMessages = [...currentMessages, finalMsg]
    
    // 模拟HR阅读消息的时间（基于消息长度，每个字约38-60ms）
    const readingTime = Math.min(content.length * 45 + 750, 3750) // 最少0.75秒，最多3.75秒
    setStatusText('HR正在阅读您的消息...')
    await new Promise(r => setTimeout(r, readingTime))
    
    // 电子HR回复
    let hrContent = await streamMessageForJob(jobId, 'electronic_hr', updatedMessages, targetJob, round)
    
    // 检查是否是最后一轮（共6轮对话）
    const maxRounds = 6
    if (round >= maxRounds) {
      // 最后一轮：AI助手需要发送礼貌性的结束语
      const hrReadingTime = Math.min(hrContent.length * 38 + 600, 3000)
      setStatusText('正在阅读HR的回复...')
      await new Promise(r => setTimeout(r, hrReadingTime))
      
      // 生成并发送礼貌性结束语
      const farewellMessage = generateFarewellMessage(targetJob)
      await sendFarewellMessage(jobId, farewellMessage)
      
      const matchResult = matchedJobs.find(m => m.job.id === jobId)
      const matchScore = matchResult?.score || 70
      
      if (matchScore >= 75) {
        setFocusedJobIds(prev => prev.includes(jobId) ? prev : [...prev, jobId])
        updateJobChat(jobId, { isFocused: true, isComplete: true })
      } else {
        updateJobChat(jobId, { isComplete: true })
      }
    } else {
      // 进入下一轮
      const nextRound = round + 1
      updateJobChat(jobId, { round: nextRound })
      
      // 模拟阅读HR回复的时间，然后准备下一轮
      const hrReadingTime = Math.min(hrContent.length * 38 + 600, 3000) // 最少0.8秒，最多4秒
      setStatusText('正在阅读HR的回复...')
      await new Promise(r => setTimeout(r, hrReadingTime))
      prepareNextResponse(jobId, nextRound)
    }
  }

  // 用户点击发送按钮
  const handleSendClick = () => {
    if (currentChatJobId && draftContent.trim()) {
      const chatState = jobChats.get(currentChatJobId)
      sendUserMessage(currentChatJobId, draftContent, chatState?.round)
    }
  }

  // 为指定职位流式生成消息
  const streamMessageForJob = async (
    jobId: number,
    role: 'ai_assistant' | 'electronic_hr',
    chatHistory: Message[],
    targetJob: Job,
    round: number
  ): Promise<string> => {
    const messageId = `msg_${Date.now()}_${role}_${jobId}`
    
    // 模拟思考/组织语言的时间
    setIsAITyping(true)
    if (role === 'electronic_hr') {
      setStatusText('HR正在思考如何回复...')
    } else {
      setStatusText('AI助手正在组织回复...')
    }
    
    // 思考延迟：0.75-1.5秒
    await new Promise(r => setTimeout(r, 750 + Math.random() * 750))
    
    const newMessage: Message = {
      id: messageId,
      role,
      content: '',
      isStreaming: true,
      timestamp: new Date()
    }
    addMessageToJob(jobId, newMessage)
    scrollToBottomOnce()
    setStatusText(role === 'ai_assistant' ? 'AI助手正在输入...' : 'HR正在输入...')

    try {
      const response = await fetch('/api/ai-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
          resume,
          job: targetJob,
          mode: role,
          round
        })
      })

      if (!response.ok) throw new Error('API请求失败')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        let pendingChars: string[] = []
        let isDisplaying = false

        const displayNextChar = async () => {
          if (isDisplaying) return
          isDisplaying = true
          
          while (pendingChars.length > 0) {
            const char = pendingChars.shift()!
            fullContent += char
            updateMessageInJob(jobId, messageId, fullContent, true)
            await new Promise(r => setTimeout(r, 50 + Math.random() * 30))
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
                  pendingChars.push(...parsed.content.split(''))
                  displayNextChar()
                }
              } catch (e) {}
            }
          }
        }

        while (pendingChars.length > 0 || isDisplaying) {
          await new Promise(r => setTimeout(r, 50))
          if (!isDisplaying && pendingChars.length > 0) {
            await displayNextChar()
          }
        }
      }

      updateMessageInJob(jobId, messageId, fullContent, false)
      return fullContent

    } catch (error) {
      const fallback = role === 'ai_assistant' 
        ? `您好！我对${targetJob.title}职位非常感兴趣，期待与您交流。`
        : `感谢您的关注！请介绍一下您的相关经验。`
      
      updateMessageInJob(jobId, messageId, fallback, false)
      return fallback
    } finally {
      setIsAITyping(false)
      setStatusText('')
    }
  }

  // 切换到指定职位的对话（不跳转页面）
  const switchToJobChat = (jobId: number) => {
    userScrolledRef.current = false
    setCurrentChatJobId(jobId)
    
    // 如果该职位还没有开始对话，则开始
    const existingChat = jobChats.get(jobId)
    if (!existingChat || existingChat.messages.length === 0) {
      startAIConversation(jobId)
    } else if (!existingChat.isComplete) {
      // 如果对话未完成，准备下一轮回复
      prepareNextResponse(jobId, existingChat.round)
    }
  }

  // 手动点击AI帮我聊按钮
  const handleAIChat = () => {
    setShowCursor(false)
    if (job) startAIConversation(job.id)
  }

  // 关闭对话窗口
  const closeChat = () => {
    setShowChat(false)
    setCurrentChatJobId(null)
    setStatusText('')
    conversationInProgressRef.current = false
  }

  // 格式化时间
  const formatTime = (date?: Date) => {
    if (!date) return ''
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  // 获取待聊职位列表（排除重点跟进的）
  const pendingJobs = matchedJobs.filter(m => !focusedJobIds.includes(m.job.id))
  // 获取重点跟进职位列表
  const focusedJobs = matchedJobs.filter(m => focusedJobIds.includes(m.job.id))

  if (!job) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-xl text-gray-600">职位不存在</p>
        <Link href="/jobs" className="text-indigo-600 hover:underline mt-4 inline-block">
          返回职位列表
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 虚拟光标 */}
      {showCursor && (
        <div 
          className="fixed z-[9999] pointer-events-none transition-transform"
          style={{ 
            left: cursorPosition.x, 
            top: cursorPosition.y,
            transform: `translate(-50%, -50%) scale(${cursorPhase === 'clicking' ? 0.8 : 1})`
          }}
        >
          <div className={`relative ${cursorPhase === 'clicking' ? 'animate-pulse' : ''}`}>
            <MousePointer2 className="w-8 h-8 text-indigo-600 drop-shadow-lg" fill="white" />
            {cursorPhase === 'clicking' && (
              <div className="absolute -inset-2 bg-indigo-400 rounded-full opacity-50 animate-ping"></div>
            )}
          </div>
          <div className="mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {cursorPhase === 'moving' ? '正在移动到按钮...' : '点击中...'}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-8">
        <div className="container mx-auto px-6">
          <Link href="/jobs" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回职位列表
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 主内容 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex gap-2 mb-3">
                  {job.isHot && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      热招
                    </span>
                  )}
                  {job.isUrgent && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                      紧急招聘
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-2">{job.location} · {job.postedDate}</div>
                <h1 className="text-3xl font-bold mb-3 text-gray-900">{job.title}</h1>
                <div className="text-2xl font-semibold text-gray-800 mb-3">{job.company}</div>
                <div className="text-3xl font-bold text-indigo-600 mb-4">{job.salary}</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {jobCategories.find(c => c.id === job.category)?.name || '其他'}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">{job.level}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {job.experience}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {job.education}
                  </span>
                </div>
              </div>

              <hr className="my-6" />

              {/* 职位描述 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-gray-900">职位描述</h2>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>

              {/* 技能标签 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-gray-900">技能要求</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 任职要求 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-gray-900">任职要求</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                      <span className="text-gray-700 leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 工作职责 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-gray-900">工作职责</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                      <span className="text-gray-700 leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 福利待遇 */}
              <div>
                <h2 className="text-xl font-bold mb-3 text-gray-900">福利待遇</h2>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, index) => (
                    <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded text-sm border border-green-200">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition mb-3">
                立即申请
              </button>
              <button className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition mb-3">
                收藏职位
              </button>

              {/* 与电子HR对话 */}
              <div className="border-2 border-indigo-200 rounded-lg p-4 mb-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">AI求职助手</h3>
                    <p className="text-xs text-gray-500">在线智能沟通</p>
                  </div>
                  <span className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
                
                {/* 模式选择 - 在开始对话前选择 */}
                <div className="mb-3 p-2 bg-white rounded-lg border border-indigo-100">
                  <div className="text-xs text-gray-500 mb-2">选择对话模式：</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setChatMode('auto')}
                      disabled={showChat}
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition ${
                        chatMode === 'auto' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } ${showChat ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Zap className="w-3 h-3 mx-auto mb-0.5" />
                      全自动
                    </button>
                    <button
                      onClick={() => setChatMode('semi-auto')}
                      disabled={showChat}
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition ${
                        chatMode === 'semi-auto' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } ${showChat ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Edit3 className="w-3 h-3 mx-auto mb-0.5" />
                      半自动
                    </button>
                    <button
                      onClick={() => setChatMode('manual')}
                      disabled={showChat}
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition ${
                        chatMode === 'manual' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } ${showChat ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Hand className="w-3 h-3 mx-auto mb-0.5" />
                      手动
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1.5 text-center">
                    {chatMode === 'auto' ? 'AI全程自动回复' : chatMode === 'semi-auto' ? 'AI生成建议可修改' : '完全手动输入'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => { setChatMode('manual'); handleAIChat(); }}
                    disabled={showChat}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-indigo-400 text-indigo-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-indigo-50 transition text-sm disabled:opacity-50"
                  >
                    <User className="w-4 h-4" />
                    我来聊
                  </button>
                  <button
                    ref={aiButtonRef}
                    onClick={handleAIChat}
                    disabled={showChat}
                    className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transition text-sm disabled:opacity-50 ${cursorPhase === 'clicking' ? 'ring-4 ring-indigo-300 scale-95' : ''}`}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI求职助手
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {chatMode === 'auto' ? '点击后AI全程自动与HR沟通' : chatMode === 'semi-auto' ? '点击后AI生成回复供您修改' : '点击后手动输入回复内容'}
                </p>
              </div>

              <hr className="my-4" />

              <div className="space-y-3 text-sm">
                <h3 className="font-bold text-gray-900">职位信息</h3>
                <div className="flex justify-between">
                  <span className="text-gray-600">职位类型</span>
                  <span className="font-semibold text-gray-900">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">工作经验</span>
                  <span className="font-semibold text-gray-900">{job.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">学历要求</span>
                  <span className="font-semibold text-gray-900">{job.education}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">职级</span>
                  <span className="font-semibold text-gray-900">{job.level}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <h3 className="font-bold text-gray-900 mb-2">公司信息</h3>
                <div className="text-lg font-bold text-gray-900 mb-1">{job.company}</div>
                <div className="text-gray-600 text-sm flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </div>
                <button className="w-full border-2 border-indigo-600 text-indigo-600 py-2 px-4 rounded-lg font-semibold hover:bg-indigo-50 transition text-sm">
                  查看公司详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 弹出式对话窗口 - 三栏布局 */}
      {showChat && (
        <>
          {/* 遮罩层 */}
          <div 
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(17, 24, 39, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999
            }}
            onClick={closeChat}
          />
          
          {/* 对话框容器 - 三栏布局，可调整大小 */}
          <div 
            style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%',
              maxWidth: matchedJobs.length > 0 ? '1400px' : '800px',
              minWidth: '600px',
              height: '85vh',
              minHeight: '400px',
              maxHeight: '95vh',
              zIndex: 100000,
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '2px solid #e5e7eb',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              resize: 'both'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 左侧栏 - 待聊职位列表 */}
            {matchedJobs.length > 0 && (
              <div style={{
                width: '240px',
                borderRight: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0
              }}>
                {/* 左侧栏头部 */}
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#f3f4f6'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MessageSquare style={{ width: '14px', height: '14px', color: '#6366f1' }} />
                    待聊职位
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {pendingJobs.length} 个职位待沟通
                  </div>
                </div>
                
                {/* 待聊职位列表 */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '8px'
                }}>
                  {pendingJobs.map((match, index) => {
                    const isCurrentJob = match.job.id === currentChatJobId
                    const chatState = jobChats.get(match.job.id)
                    const hasHistory = chatState && chatState.messages.length > 0
                    const isComplete = chatState?.isComplete
                    
                    return (
                      <div
                        key={match.job.id}
                        onClick={() => switchToJobChat(match.job.id)}
                        style={{
                          padding: '10px',
                          marginBottom: '4px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: isCurrentJob ? '#eef2ff' : 'transparent',
                          border: isCurrentJob ? '2px solid #6366f1' : '2px solid transparent',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrentJob) {
                            e.currentTarget.style.backgroundColor = '#f3f4f6'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrentJob) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                          {/* 状态图标 */}
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: isComplete ? '#10b981' : isCurrentJob ? '#6366f1' : hasHistory ? '#f59e0b' : '#e5e7eb',
                            color: (isComplete || isCurrentJob || hasHistory) ? 'white' : '#6b7280'
                          }}>
                            {isComplete ? (
                              <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                            ) : hasHistory ? (
                              <MessageCircle style={{ width: '10px', height: '10px' }} />
                            ) : (
                              index + 1
                            )}
                          </div>
                          
                          {/* 职位信息 */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              color: isCurrentJob ? '#4f46e5' : '#111827',
                              marginBottom: '2px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {match.job.title}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: '#6b7280',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {match.job.company}
                            </div>
                            <div style={{
                              marginTop: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: match.score >= 80 ? '#059669' : '#d97706',
                                backgroundColor: match.score >= 80 ? '#ecfdf5' : '#fffbeb',
                                padding: '1px 4px',
                                borderRadius: '3px'
                              }}>
                                {match.score}%
                              </span>
                              {isCurrentJob && !isComplete && (
                                <span style={{
                                  fontSize: '10px',
                                  color: '#6366f1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}>
                                  <span style={{
                                    width: '4px',
                                    height: '4px',
                                    backgroundColor: '#6366f1',
                                    borderRadius: '50%',
                                    animation: 'pulse 2s infinite'
                                  }}></span>
                                  对话中
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* 中间对话区域 */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0
            }}>
              {/* 头部 */}
              <div style={{ 
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Bot style={{ width: '20px', height: '20px', color: 'white' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>AI 智能对话</div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {currentChatJob ? `${currentChatJob.company} · ${currentChatJob.title}` : '选择职位开始对话'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={closeChat}
                    style={{ 
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  </button>
                </div>
                
                {statusText && (
                  <div style={{ 
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#eef2ff',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', backgroundColor: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                      <span style={{ width: '6px', height: '6px', backgroundColor: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite 0.1s' }}></span>
                      <span style={{ width: '6px', height: '6px', backgroundColor: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                    </div>
                    {statusText}
                  </div>
                )}
              </div>

              {/* 消息区域 */}
              <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                style={{ 
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px',
                  backgroundColor: '#ffffff'
                }}
              >
                {currentMessages.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#9ca3af'
                  }}>
                    <MessageCircle style={{ width: '48px', height: '48px', marginBottom: '12px', opacity: 0.5 }} />
                    <div style={{ fontSize: '14px' }}>从左侧选择职位开始对话</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {currentMessages.map((msg) => (
                      <div 
                        key={msg.id}
                        style={{ 
                          display: 'flex',
                          flexDirection: msg.role === 'ai_assistant' ? 'row-reverse' : 'row',
                          gap: '12px'
                        }}
                      >
                        {/* 头像 */}
                        <div style={{ 
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: msg.role === 'ai_assistant' 
                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        }}>
                          {msg.role === 'ai_assistant' ? (
                            <Sparkles style={{ width: '16px', height: '16px', color: 'white' }} />
                          ) : (
                            <Bot style={{ width: '16px', height: '16px', color: 'white' }} />
                          )}
                        </div>

                        {/* 消息内容 */}
                        <div style={{ 
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: msg.role === 'ai_assistant' ? 'flex-end' : 'flex-start'
                        }}>
                          <div style={{ 
                            fontSize: '12px',
                            color: '#9ca3af',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexDirection: msg.role === 'ai_assistant' ? 'row-reverse' : 'row'
                          }}>
                            <span style={{ fontWeight: 500, color: msg.role === 'ai_assistant' ? '#6366f1' : '#10b981' }}>
                              {msg.role === 'ai_assistant' ? 'AI 助手' : '电子 HR'}
                            </span>
                            <span>{formatTime(msg.timestamp)}</span>
                          </div>
                          <div style={{ 
                            padding: '12px 16px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            backgroundColor: msg.role === 'ai_assistant' ? '#6366f1' : '#f3f4f6',
                            color: msg.role === 'ai_assistant' ? 'white' : '#374151',
                            border: msg.role === 'ai_assistant' ? 'none' : '1px solid #e5e7eb'
                          }}>
                            {msg.content}
                            {msg.isStreaming && (
                              <span style={{ 
                                display: 'inline-block',
                                width: '2px',
                                height: '16px',
                                backgroundColor: 'currentColor',
                                marginLeft: '2px',
                                animation: 'blink 1s infinite'
                              }}></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 输入指示器 */}
                    {isAITyping && !currentMessages.some(m => m.isStreaming) && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ 
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        }}>
                          <Bot style={{ width: '16px', height: '16px', color: 'white' }} />
                        </div>
                        <div style={{ 
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center'
                        }}>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite 0.15s' }}></span>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite 0.3s' }}></span>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* 底部区域 - 模式切换 + 编辑框 + 发送 */}
              <div style={{ 
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                flexShrink: 0
              }}>
                {/* 模式切换栏 - 对话中也可切换 */}
                <div style={{
                  padding: '8px 16px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f3f4f6'
                }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '4px' }}>当前模式:</span>
                  <button
                    onClick={() => setChatMode('auto')}
                    disabled={isAITyping}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: chatMode === 'auto' ? '2px solid #6366f1' : '1px solid #d1d5db',
                      backgroundColor: chatMode === 'auto' ? '#eef2ff' : 'white',
                      color: chatMode === 'auto' ? '#4f46e5' : '#374151',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: isAITyping ? 'not-allowed' : 'pointer',
                      opacity: isAITyping ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Zap style={{ width: '12px', height: '12px' }} />
                    全自动
                  </button>
                  <button
                    onClick={() => setChatMode('semi-auto')}
                    disabled={isAITyping}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: chatMode === 'semi-auto' ? '2px solid #6366f1' : '1px solid #d1d5db',
                      backgroundColor: chatMode === 'semi-auto' ? '#eef2ff' : 'white',
                      color: chatMode === 'semi-auto' ? '#4f46e5' : '#374151',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: isAITyping ? 'not-allowed' : 'pointer',
                      opacity: isAITyping ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit3 style={{ width: '12px', height: '12px' }} />
                    半自动
                  </button>
                  <button
                    onClick={() => setChatMode('manual')}
                    disabled={isAITyping}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: chatMode === 'manual' ? '2px solid #6366f1' : '1px solid #d1d5db',
                      backgroundColor: chatMode === 'manual' ? '#eef2ff' : 'white',
                      color: chatMode === 'manual' ? '#4f46e5' : '#374151',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: isAITyping ? 'not-allowed' : 'pointer',
                      opacity: isAITyping ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Hand style={{ width: '12px', height: '12px' }} />
                    手动
                  </button>
                  <span style={{ 
                    marginLeft: 'auto', 
                    fontSize: '11px', 
                    color: '#9ca3af',
                    maxWidth: '200px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {chatMode === 'auto' ? 'AI自动回复并发送' : chatMode === 'semi-auto' ? 'AI生成建议，可修改后发送' : '完全手动输入回复'}
                  </span>
                </div>

                {/* 对话完成状态 */}
                {isCurrentComplete ? (
                  <div style={{ 
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: currentJobChat?.isFocused ? '#fef3c7' : '#ecfdf5',
                      borderRadius: '6px'
                    }}>
                      {currentJobChat?.isFocused ? (
                        <>
                          <Star style={{ width: '14px', height: '14px', color: '#f59e0b', fill: '#f59e0b' }} />
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#d97706' }}>已加入重点跟进</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} />
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#059669' }}>对话完成</span>
                        </>
                      )}
                    </div>
                    {pendingJobs.length > 0 && (
                      <button
                        onClick={() => {
                          const nextJob = pendingJobs.find(m => {
                            const chat = jobChats.get(m.job.id)
                            return !chat || !chat.isComplete
                          })
                          if (nextJob) switchToJobChat(nextJob.job.id)
                        }}
                        style={{ 
                          padding: '6px 12px',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Sparkles style={{ width: '12px', height: '12px' }} />
                        聊下一个
                      </button>
                    )}
                  </div>
                ) : currentChatJobId ? (
                  /* 编辑框和发送区域 */
                  <div style={{ padding: '12px 16px' }}>
                    {/* 状态提示 */}
                    {statusText && (
                      <div style={{
                        marginBottom: '8px',
                        padding: '6px 10px',
                        backgroundColor: '#eef2ff',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {isAITyping && (
                          <div style={{ display: 'flex', gap: '3px' }}>
                            <span style={{ width: '4px', height: '4px', backgroundColor: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                            <span style={{ width: '4px', height: '4px', backgroundColor: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite 0.1s' }}></span>
                            <span style={{ width: '4px', height: '4px', backgroundColor: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                          </div>
                        )}
                        {statusText}
                      </div>
                    )}
                    
                    {/* 编辑框 */}
                    {(waitingForSend || chatMode !== 'auto') && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                          <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder={
                              chatMode === 'manual' 
                                ? '请输入您的回复...' 
                                : chatMode === 'semi-auto'
                                  ? 'AI正在生成建议，您可以修改后发送...'
                                  : '等待AI生成回复...'
                            }
                            style={{
                              width: '100%',
                              minHeight: '80px',
                              maxHeight: '300px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '2px solid #e5e7eb',
                              fontSize: '13px',
                              lineHeight: '1.5',
                              resize: 'vertical',
                              outline: 'none',
                              fontFamily: 'inherit'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = '#6366f1'
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = '#e5e7eb'
                            }}
                          />
                          {chatMode === 'semi-auto' && !draftContent && isAITyping && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              left: '12px',
                              fontSize: '13px',
                              color: '#9ca3af',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Sparkles style={{ width: '12px', height: '12px', animation: 'pulse 1s infinite' }} />
                              AI正在生成建议...
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleSendClick}
                          disabled={!draftContent.trim() || isAITyping}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: draftContent.trim() && !isAITyping ? '#6366f1' : '#d1d5db',
                            color: 'white',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: draftContent.trim() && !isAITyping ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            height: 'fit-content'
                          }}
                        >
                          <Send style={{ width: '14px', height: '14px' }} />
                          发送
                        </button>
                      </div>
                    )}
                    
                    {/* 全自动模式下的状态显示 */}
                    {chatMode === 'auto' && !waitingForSend && !isAITyping && !statusText && (
                      <div style={{ 
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#9ca3af',
                        padding: '8px 0'
                      }}>
                        <span style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ 
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#10b981',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                          }}></span>
                          全自动模式运行中...
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ 
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#9ca3af'
                  }}>
                    点击左侧职位开始智能对话
                  </div>
                )}
              </div>
            </div>

            {/* 右侧栏 - 重点跟进职位 */}
            {matchedJobs.length > 0 && (
              <div style={{
                width: '240px',
                borderLeft: '1px solid #e5e7eb',
                backgroundColor: '#fffbeb',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0
              }}>
                {/* 右侧栏头部 */}
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #fde68a',
                  backgroundColor: '#fef3c7'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#92400e',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Star style={{ width: '14px', height: '14px', color: '#f59e0b', fill: '#f59e0b' }} />
                    重点跟进
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#b45309'
                  }}>
                    {focusedJobs.length} 个职位需要关注
                  </div>
                </div>
                
                {/* 重点跟进职位列表 */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '8px'
                }}>
                  {focusedJobs.length === 0 ? (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#d97706',
                      fontSize: '12px'
                    }}>
                      <Star style={{ width: '24px', height: '24px', margin: '0 auto 8px', opacity: 0.3 }} />
                      <div>聊完后HR认可的职位</div>
                      <div>会出现在这里</div>
                    </div>
                  ) : (
                    focusedJobs.map((match) => {
                      const isCurrentJob = match.job.id === currentChatJobId
                      
                      return (
                        <div
                          key={match.job.id}
                          onClick={() => switchToJobChat(match.job.id)}
                          style={{
                            padding: '10px',
                            marginBottom: '4px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: isCurrentJob ? '#fde68a' : '#fef9c3',
                            border: isCurrentJob ? '2px solid #f59e0b' : '2px solid transparent',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (!isCurrentJob) {
                              e.currentTarget.style.backgroundColor = '#fde68a'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isCurrentJob) {
                              e.currentTarget.style.backgroundColor = '#fef9c3'
                            }
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                          }}>
                            <Star style={{
                              width: '16px',
                              height: '16px',
                              color: '#f59e0b',
                              fill: '#f59e0b',
                              flexShrink: 0,
                              marginTop: '2px'
                            }} />
                            
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#92400e',
                                marginBottom: '2px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {match.job.title}
                              </div>
                              <div style={{
                                fontSize: '11px',
                                color: '#b45309',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {match.job.company}
                              </div>
                              <div style={{
                                marginTop: '4px',
                                fontSize: '10px',
                                color: '#d97706',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span style={{
                                  backgroundColor: '#fde68a',
                                  padding: '1px 4px',
                                  borderRadius: '3px'
                                }}>
                                  {match.score}% 匹配
                                </span>
                                <span>待面试</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                
                {/* 右侧栏底部提示 */}
                <div style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #fde68a',
                  backgroundColor: '#fef3c7',
                  fontSize: '11px',
                  color: '#b45309',
                  textAlign: 'center'
                }}>
                  HR将在1-2天内联系安排面试
                </div>
              </div>
            )}
          </div>

          {/* 动画样式 */}
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </>
      )}
    </div>
  )
}
