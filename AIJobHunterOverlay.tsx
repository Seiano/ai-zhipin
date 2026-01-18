'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Pause, Play, Square, Settings } from 'lucide-react'
import OverlayVideoStream from './OverlayVideoStream'
import OverlayThoughtChain, { type ThoughtLog } from './OverlayThoughtChain'
import OverlayProgressBar, { type PhaseKey } from './OverlayProgressBar'
import { type ResumeInfo } from '@/lib/storage/resumeStorage'

interface AIJobHunterOverlayProps {
  resume: ResumeInfo
  onClose: () => void
}

interface SSEEvent {
  type: string
  data: any
  timestamp: number
}

interface JobStats {
  viewed: number
  matched: number
  contacted: number
}

export default function AIJobHunterOverlay({ resume, onClose }: AIJobHunterOverlayProps) {
  // 状态管理
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<PhaseKey>('analyze')
  const [completedPhases, setCompletedPhases] = useState<PhaseKey[]>([])
  const [logs, setLogs] = useState<ThoughtLog[]>([])
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 640, y: 360 })
  const [isClicking, setIsClicking] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('localhost:3001')
  const [status, setStatus] = useState('准备中')
  const [stats, setStats] = useState<JobStats>({ viewed: 0, matched: 0, contacted: 0 })
  const [matchThreshold, setMatchThreshold] = useState(85)
  
  const eventSourceRef = useRef<EventSource | null>(null)
  const logIdCounter = useRef(0)

  // 添加日志
  const addLog = useCallback((
    type: ThoughtLog['type'], 
    content: string, 
    metadata?: ThoughtLog['metadata']
  ) => {
    const newLog: ThoughtLog = {
      id: `log-${logIdCounter.current++}`,
      type,
      content,
      timestamp: Date.now(),
      metadata
    }
    setLogs(prev => [...prev, newLog])
  }, [])

  // 启动AI求职助手
  const startJobHunting = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
    addLog('status', '🚀 AI求职助手启动中...')
    addLog('thought', `正在分析简历: ${resume.name}，技能: ${resume.skills.slice(0, 5).join(', ')}...`)

    // 构建请求参数
    const params = new URLSearchParams({
      resume: JSON.stringify(resume),
      threshold: matchThreshold.toString()
    })

    // 建立SSE连接
    const eventSource = new EventSource(`/api/ai-job-hunter?${params}`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      addLog('status', '✅ 连接已建立，开始执行任务...')
    }

    eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data)
        handleSSEEvent(data)
      } catch (error) {
        console.error('解析SSE消息失败:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE连接错误:', error)
      // 检查readyState: 0=CONNECTING, 1=OPEN, 2=CLOSED
      if (eventSource.readyState === EventSource.CLOSED) {
        // 服务器正常关闭连接（任务完成），不需要重连
        console.log('SSE连接已关闭')
        eventSource.close()
        eventSourceRef.current = null
      } else {
        addLog('error', '连接异常，请检查网络...')
        // 关闭当前连接，避免无限重连
        eventSource.close()
        eventSourceRef.current = null
        setIsRunning(false)
      }
    }
  }, [resume, matchThreshold, addLog])

  // 处理SSE事件
  const handleSSEEvent = useCallback((event: SSEEvent) => {
    switch (event.type) {
      case 'screenshot':
        setScreenshot(event.data.image)
        if (event.data.url) setCurrentUrl(event.data.url)
        break

      case 'cursor':
        setCursorPosition({ x: event.data.x, y: event.data.y })
        setIsClicking(event.data.clicking || false)
        break

      case 'thought':
        addLog('thought', event.data.content)
        break

      case 'action':
        addLog('action', `执行: ${event.data.action} ${JSON.stringify(event.data.parameters || {})}`)
        break

      case 'status':
        setStatus(event.data.status)
        addLog('status', event.data.message || event.data.status)
        break

      case 'phase_change':
        setCurrentPhase(event.data.phase as PhaseKey)
        if (event.data.completed) {
          setCompletedPhases(prev => 
            prev.includes(event.data.completed) ? prev : [...prev, event.data.completed]
          )
        }
        break

      case 'resume_analyzed':
        addLog('thought', `简历分析完成! 提取关键词: ${event.data.keywords?.join(', ')}`)
        setCompletedPhases(prev => [...prev, 'analyze'])
        setCurrentPhase('search')
        break

      case 'job_found':
        setStats(prev => ({ ...prev, viewed: prev.viewed + 1 }))
        addLog('match', `发现职位: ${event.data.title}`, {
          jobTitle: event.data.title,
          company: event.data.company,
          matchScore: event.data.matchScore
        })
        break

      case 'match_score':
        if (event.data.score >= matchThreshold) {
          setStats(prev => ({ ...prev, matched: prev.matched + 1 }))
        }
        addLog('match', `匹配度评估: ${event.data.score}%`, {
          matchScore: event.data.score,
          jobTitle: event.data.jobTitle,
          company: event.data.company
        })
        break

      case 'conversation_start':
        setStats(prev => ({ ...prev, contacted: prev.contacted + 1 }))
        setCurrentPhase('contact')
        addLog('conversation', `开始与 ${event.data.company} 的电子HR对话...`)
        break

      case 'conversation_message':
        addLog('conversation', `${event.data.role === 'jobseeker_ai' ? '🤖 AI助手' : '👔 电子HR'}: ${event.data.content}`)
        break

      case 'error':
        addLog('error', event.data.message || '发生未知错误')
        break

      case 'complete':
        setIsRunning(false)
        // 使用事件数据中的统计信息，避免闭包问题
        const completeData = event.data
        addLog('status', `✨ 任务完成! 共查看 ${completeData.viewed || 0} 个职位，匹配 ${completeData.matched || 0} 个，发起 ${completeData.contacted || 0} 次对话`)
        // 确保关闭 EventSource
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null
        }
        break
    }
  }, [addLog, matchThreshold])

  // 停止任务
  const stopJobHunting = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setIsRunning(false)
    setIsPaused(false)
    addLog('status', '⏹️ 任务已停止')
  }, [addLog])

  // 暂停/继续
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
    addLog('status', isPaused ? '▶️ 任务已继续' : '⏸️ 任务已暂停')
  }, [isPaused, addLog])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  // 自动启动
  useEffect(() => {
    const timer = setTimeout(() => {
      startJobHunting()
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center">
      {/* 主容器 */}
      <div className="w-[95vw] h-[90vh] bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* 顶部栏 */}
        <div className="h-14 bg-black/30 border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h2 className="text-white font-bold">AI求职助手</h2>
              <p className="text-white/50 text-xs">基于 {resume.name} 的简历</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 统计信息 */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/60">
                👁️ 已查看 <span className="text-white font-bold">{stats.viewed}</span>
              </span>
              <span className="text-white/60">
                🎯 已匹配 <span className="text-green-400 font-bold">{stats.matched}</span>
              </span>
              <span className="text-white/60">
                💬 已对话 <span className="text-purple-400 font-bold">{stats.contacted}</span>
              </span>
            </div>
            
            {/* 控制按钮 */}
            <div className="flex items-center gap-2">
              {isRunning && (
                <>
                  <button
                    onClick={togglePause}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                    title={isPaused ? '继续' : '暂停'}
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={stopJobHunting}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition"
                    title="停止"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="px-6 py-4">
          <OverlayProgressBar 
            currentPhase={currentPhase} 
            completedPhases={completedPhases} 
          />
        </div>

        {/* 主内容区 */}
        <div className="flex h-[calc(100%-8rem)] px-6 pb-6 gap-6">
          {/* 左侧：视频流 */}
          <div className="w-[60%]">
            <OverlayVideoStream
              screenshot={screenshot}
              cursorPosition={cursorPosition}
              isClicking={isClicking}
              currentUrl={currentUrl}
              status={status}
            />
          </div>
          
          {/* 右侧：思维链 */}
          <div className="w-[40%] bg-gradient-to-b from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-white/10">
            <OverlayThoughtChain logs={logs} />
          </div>
        </div>
      </div>
    </div>
  )
}
