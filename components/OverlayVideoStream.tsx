'use client'

import { useRef, useEffect } from 'react'
import { MousePointer2 } from 'lucide-react'

interface OverlayVideoStreamProps {
  screenshot: string | null
  cursorPosition: { x: number; y: number }
  isClicking: boolean
  currentUrl: string
  status: string
}

export default function OverlayVideoStream({
  screenshot,
  cursorPosition,
  isClicking,
  currentUrl,
  status
}: OverlayVideoStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* LIVE 标签 */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          LIVE
        </div>
        <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <span className="text-purple-400">⚡</span>
          GUI-Owl Vision
        </div>
      </div>

      {/* 截图显示区域 */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
      >
        {screenshot ? (
          <img 
            src={screenshot}
            alt="AI Agent View"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/50">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-lg">正在初始化视觉引擎...</p>
            <p className="text-sm text-white/30 mt-2">准备连接 GUI-Owl</p>
          </div>
        )}

        {/* 虚拟光标 */}
        {screenshot && (
          <div 
            className="absolute pointer-events-none transition-all duration-100 ease-out"
            style={{
              left: `${(cursorPosition.x / 1280) * 100}%`,
              top: `${(cursorPosition.y / 720) * 100}%`,
              transform: `translate(-50%, -50%) ${isClicking ? 'scale(0.8)' : 'scale(1)'}`,
            }}
          >
            <MousePointer2 
              className={`w-8 h-8 drop-shadow-lg transition-colors ${
                isClicking ? 'text-pink-400' : 'text-cyan-400'
              }`}
              style={{
                filter: 'drop-shadow(0 0 8px currentColor)'
              }}
            />
            {/* 点击涟漪效果 */}
            {isClicking && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 border-2 border-pink-400 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        )}

        {/* 扫描线效果 */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
          }}
        />
      </div>

      {/* 底部状态栏 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">{status || '就绪'}</span>
          </div>
          <div className="text-sm text-white/60 truncate max-w-[60%]">
            {currentUrl || 'localhost:3001'}
          </div>
          <div className="text-sm text-white/60">
            {new Date().toLocaleTimeString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  )
}
