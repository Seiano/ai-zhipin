'use client'

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { loadResume, getDemoResume, type ResumeInfo } from '@/lib/storage/resumeStorage'
import { mockJobs } from '@/lib/mockData'
import { extractKeywordsFromResume, calculateMatchScore, rankJobs, type MatchResult } from '@/lib/resumeAnalyzer'

// AI操作状态
interface AIOperationState {
  isActive: boolean
  status: string
  cursorPosition: { x: number; y: number }
  isClicking: boolean
  resume: ResumeInfo | null
  currentPhase: 'idle' | 'analyzing' | 'searching' | 'filtering' | 'viewing' | 'chatting' | 'completed'
  matchedJobs: MatchResult[]
  currentJobIndex: number
}

// Context
interface AIOperationContextType {
  state: AIOperationState
  startAIOperation: () => void
  stopAIOperation: () => void
  moveCursor: (x: number, y: number, duration?: number) => Promise<void>
  clickAt: (x: number, y: number) => Promise<void>
  setStatus: (status: string) => void
  setPhase: (phase: AIOperationState['currentPhase']) => void
  typeText: (selector: string, text: string) => Promise<void>
  scrollPage: (amount: number) => Promise<void>
  navigateTo: (url: string) => void
}

const AIOperationContext = createContext<AIOperationContextType | null>(null)

export function useAIOperation() {
  const context = useContext(AIOperationContext)
  if (!context) {
    throw new Error('useAIOperation must be used within AIOperationProvider')
  }
  return context
}

// Provider组件
export function AIOperationProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AIOperationState>({
    isActive: false,
    status: '就绪',
    cursorPosition: { x: -100, y: -100 },
    isClicking: false,
    resume: null,
    currentPhase: 'idle',
    matchedJobs: [],
    currentJobIndex: 0
  })
  
  const animationRef = useRef<number | null>(null)

  // 移动光标（带动画）
  const moveCursor = useCallback(async (targetX: number, targetY: number, duration: number = 500) => {
    return new Promise<void>((resolve) => {
      const startX = state.cursorPosition.x < 0 ? targetX : state.cursorPosition.x
      const startY = state.cursorPosition.y < 0 ? targetY : state.cursorPosition.y
      const startTime = performance.now()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // 缓动函数
        const easeProgress = progress < 0.5 
          ? 2 * progress * progress 
          : -1 + (4 - 2 * progress) * progress
        
        const currentX = startX + (targetX - startX) * easeProgress
        const currentY = startY + (targetY - startY) * easeProgress
        
        // 添加微小抖动模拟真人
        const jitterX = (Math.random() - 0.5) * 2
        const jitterY = (Math.random() - 0.5) * 2
        
        setState(prev => ({
          ...prev,
          cursorPosition: { 
            x: currentX + (progress < 1 ? jitterX : 0), 
            y: currentY + (progress < 1 ? jitterY : 0)
          }
        }))
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
    })
  }, [state.cursorPosition])

  // 点击
  const clickAt = useCallback(async (x: number, y: number) => {
    await moveCursor(x, y, 300)
    
    setState(prev => ({ ...prev, isClicking: true }))
    await new Promise(r => setTimeout(r, 150))
    setState(prev => ({ ...prev, isClicking: false }))
    await new Promise(r => setTimeout(r, 100))
  }, [moveCursor])

  // 设置状态
  const setStatus = useCallback((status: string) => {
    setState(prev => ({ ...prev, status }))
  }, [])

  // 设置阶段
  const setPhase = useCallback((phase: AIOperationState['currentPhase']) => {
    setState(prev => ({ ...prev, currentPhase: phase }))
  }, [])

  // 输入文本
  const typeText = useCallback(async (selector: string, text: string) => {
    const element = document.querySelector(selector) as HTMLInputElement
    if (element) {
      element.focus()
      // 逐字输入
      for (let i = 0; i < text.length; i++) {
        element.value = text.substring(0, i + 1)
        element.dispatchEvent(new Event('input', { bubbles: true }))
        await new Promise(r => setTimeout(r, 50 + Math.random() * 50))
      }
    }
  }, [])

  // 滚动页面
  const scrollPage = useCallback(async (amount: number) => {
    const steps = 10
    const stepAmount = amount / steps
    for (let i = 0; i < steps; i++) {
      window.scrollBy({ top: stepAmount, behavior: 'auto' })
      await new Promise(r => setTimeout(r, 30))
    }
  }, [])

  // 导航
  const navigateTo = useCallback((url: string) => {
    router.push(url)
  }, [router])

  // 启动AI操作 - 直接匹配简历和职位，跳过搜索步骤
  const startAIOperation = useCallback(() => {
    let resumeData = loadResume()
    if (!resumeData) {
      resumeData = getDemoResume()
    }
    
    // 直接计算所有职位的匹配度
    const ranked = rankJobs(mockJobs, resumeData)
    const topMatch = ranked[0] // 取最匹配的职位
    const highMatch = ranked.filter(r => r.score >= 70)
    
    if (!topMatch || topMatch.score < 50) {
      // 如果没有匹配的职位或匹配度太低
      alert('未找到匹配的职位，请完善简历后重试')
      return
    }
    
    // 第1步：开始分析简历
    setState(prev => ({
      ...prev,
      isActive: true,
      resume: resumeData,
      matchedJobs: highMatch,
      currentJobIndex: 0,
      status: '🔍 正在解析您的简历信息...',
      currentPhase: 'analyzing',
      cursorPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    }))
    
    // 第2步：提取技能关键词
    setTimeout(() => {
      const skillCount = resumeData?.skills?.length || 0
      setState(prev => ({
        ...prev,
        status: `📋 已识别 ${skillCount} 项技能关键词`
      }))
    }, 1200)
    
    // 第3步：开始职位匹配
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: `🤖 正在智能匹配 ${mockJobs.length} 个热门职位...`,
        currentPhase: 'searching'
      }))
    }, 2400)
    
    // 第4步：计算匹配度
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: '📊 正在计算技能匹配度、经验匹配度...'
      }))
    }, 3600)
    
    // 第5步：筛选高匹配职位
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: `✨ 已筛选出 ${highMatch.length} 个高匹配职位`,
        currentPhase: 'filtering'
      }))
    }, 4800)
    
    // 第6步：显示最佳匹配
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: `🎯 最佳匹配: ${topMatch.job.title} @ ${topMatch.job.company} (${topMatch.score}%)`
      }))
    }, 6000)
    
    // 第7步：准备跳转
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: '🚀 正在为您打开职位详情...',
        currentPhase: 'viewing'
      }))
    }, 7200)
    
    // 第8步：跳转到最匹配的职位详情页
    setTimeout(() => {
      router.push(`/jobs/${topMatch.job.id}?ai=true`)
    }, 8000)
  }, [router])

  // 停止AI操作
  const stopAIOperation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setState(prev => ({
      ...prev,
      isActive: false,
      status: '已停止',
      currentPhase: 'idle',
      cursorPosition: { x: -100, y: -100 }
    }))
  }, [])

  // 清理
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <AIOperationContext.Provider value={{
      state,
      startAIOperation,
      stopAIOperation,
      moveCursor,
      clickAt,
      setStatus,
      setPhase,
      typeText,
      scrollPage,
      navigateTo
    }}>
      {children}
      
      {/* 全局虚拟光标 */}
      {state.isActive && (
        <div
          className="fixed pointer-events-none z-[99999] transition-transform duration-75"
          style={{
            left: state.cursorPosition.x,
            top: state.cursorPosition.y,
            transform: `translate(-4px, -4px) ${state.isClicking ? 'scale(0.8)' : 'scale(1)'}`,
          }}
        >
          {/* 光标主体 */}
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            className={`drop-shadow-lg ${state.isClicking ? 'text-pink-500' : 'text-indigo-500'}`}
            style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
          >
            <path 
              fill="currentColor" 
              d="M4 4l16 8-7 2-2 7z"
            />
          </svg>
          
          {/* 点击涟漪 */}
          {state.isClicking && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border-2 border-pink-500 rounded-full animate-ping" />
            </div>
          )}
        </div>
      )}
      
      {/* 状态提示条 */}
      {state.isActive && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99998] bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="font-medium">{state.status}</span>
          <button
            onClick={stopAIOperation}
            className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 transition"
          >
            停止
          </button>
        </div>
      )}
    </AIOperationContext.Provider>
  )
}
