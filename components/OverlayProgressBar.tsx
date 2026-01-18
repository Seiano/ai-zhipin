'use client'

type PhaseKey = 'analyze' | 'search' | 'filter' | 'view' | 'contact'

interface Phase {
  key: PhaseKey
  label: string
  icon: string
}

const PHASES: Phase[] = [
  { key: 'analyze', label: '分析简历', icon: '📋' },
  { key: 'search', label: '搜索职位', icon: '🔍' },
  { key: 'filter', label: '筛选匹配', icon: '🎯' },
  { key: 'view', label: '查看详情', icon: '👁️' },
  { key: 'contact', label: '发起对话', icon: '💬' },
]

interface OverlayProgressBarProps {
  currentPhase: PhaseKey
  completedPhases: PhaseKey[]
}

export default function OverlayProgressBar({ currentPhase, completedPhases }: OverlayProgressBarProps) {
  const getPhaseStatus = (phase: Phase) => {
    if (completedPhases.includes(phase.key)) return 'completed'
    if (phase.key === currentPhase) return 'active'
    return 'pending'
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
      <div className="flex items-center justify-between">
        {PHASES.map((phase, index) => {
          const status = getPhaseStatus(phase)
          return (
            <div key={phase.key} className="flex items-center">
              {/* 节点 */}
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-xl
                    transition-all duration-300
                    ${status === 'completed' 
                      ? 'bg-green-500 shadow-lg shadow-green-500/30' 
                      : status === 'active'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-purple-500/30 animate-pulse'
                        : 'bg-white/10'
                    }
                  `}
                >
                  {status === 'completed' ? '✓' : phase.icon}
                </div>
                <span 
                  className={`
                    mt-2 text-xs font-medium
                    ${status === 'completed' 
                      ? 'text-green-400' 
                      : status === 'active'
                        ? 'text-white'
                        : 'text-white/40'
                    }
                  `}
                >
                  {phase.label}
                </span>
              </div>
              
              {/* 连接线 */}
              {index < PHASES.length - 1 && (
                <div 
                  className={`
                    w-8 h-1 mx-2 rounded-full transition-all duration-300
                    ${completedPhases.includes(PHASES[index + 1].key) || 
                      (status === 'completed' && PHASES[index + 1].key === currentPhase)
                      ? 'bg-gradient-to-r from-green-500 to-indigo-500' 
                      : status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-white/10'
                    }
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type { PhaseKey }
