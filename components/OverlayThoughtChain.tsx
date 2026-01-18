'use client'

import { useRef, useEffect } from 'react'

interface ThoughtLog {
  id: string
  type: 'thought' | 'action' | 'status' | 'match' | 'conversation' | 'error'
  content: string
  timestamp: number
  metadata?: {
    jobTitle?: string
    company?: string
    matchScore?: number
  }
}

interface OverlayThoughtChainProps {
  logs: ThoughtLog[]
  autoScroll?: boolean
}

export default function OverlayThoughtChain({ logs, autoScroll = true }: OverlayThoughtChainProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  const getLogStyle = (type: ThoughtLog['type']) => {
    switch (type) {
      case 'thought':
        return { icon: '🧠', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-300', borderColor: 'border-emerald-500/30' }
      case 'action':
        return { icon: '⚡', bgColor: 'bg-blue-500/20', textColor: 'text-blue-300', borderColor: 'border-blue-500/30' }
      case 'status':
        return { icon: '📌', bgColor: 'bg-purple-500/20', textColor: 'text-purple-300', borderColor: 'border-purple-500/30' }
      case 'match':
        return { icon: '🎯', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-300', borderColor: 'border-yellow-500/30' }
      case 'conversation':
        return { icon: '💬', bgColor: 'bg-pink-500/20', textColor: 'text-pink-300', borderColor: 'border-pink-500/30' }
      case 'error':
        return { icon: '❌', bgColor: 'bg-red-500/20', textColor: 'text-red-300', borderColor: 'border-red-500/30' }
      default:
        return { icon: '📝', bgColor: 'bg-gray-500/20', textColor: 'text-gray-300', borderColor: 'border-gray-500/30' }
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="text-xl">🔮</span>
        AI 思维链 (Thought Chain)
      </h3>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {logs.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            <div className="text-4xl mb-2">🤖</div>
            <p>等待AI启动...</p>
          </div>
        ) : (
          logs.map((log) => {
            const style = getLogStyle(log.type)
            return (
              <div 
                key={log.id}
                className={`${style.bgColor} ${style.borderColor} border rounded-lg p-3 animate-fade-in`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${style.textColor}`}>
                        {formatTime(log.timestamp)}
                      </span>
                      {log.metadata?.matchScore && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          log.metadata.matchScore >= 85 
                            ? 'bg-green-500/30 text-green-300' 
                            : log.metadata.matchScore >= 70 
                              ? 'bg-yellow-500/30 text-yellow-300'
                              : 'bg-gray-500/30 text-gray-300'
                        }`}>
                          匹配度 {log.metadata.matchScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed break-words">
                      {log.content}
                    </p>
                    {log.metadata?.jobTitle && (
                      <div className="mt-2 text-xs text-white/60">
                        📋 {log.metadata.company} - {log.metadata.jobTitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={endRef} />
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/10 text-center text-xs text-white/40">
        POWERED BY GUI-OWL + 通义千问
      </div>
    </div>
  )
}

export type { ThoughtLog }
