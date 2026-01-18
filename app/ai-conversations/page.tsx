'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bot, Briefcase, AlertCircle, CheckCircle, Clock, TrendingUp, Eye, MessageSquare, Play, Pause, Square, MousePointer2, Zap } from 'lucide-react'
import { AIAutomationController, createJobSearchSteps } from '@/lib/aiAutomation'

interface Message {
  id: string;
  role: 'electronic_hr' | 'jobseeker_ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface Conversation {
  id: string;
  jobTitle: string;
  companyName: string;
  messages: Message[];
  status: string;
  satisfactionScores: {
    hrScore: number;
    seekerScore: number;
  };
  keyPoints: string[];
  createdAt: Date;
  updatedAt: Date;
}

// SSE事件类型
interface SSEEvent {
  type: 'screenshot' | 'thought' | 'action' | 'status' | 'message' | 'error' | 'complete' | 'cursor';
  data: any;
  timestamp: number;
}

// 思维链日志项
interface ThoughtLog {
  id: string;
  type: 'thought' | 'action' | 'status' | 'error';
  content: string;
  timestamp: number;
}

// 光标状态
interface CursorState {
  x: number;
  y: number;
  visible: boolean;
  clicking: boolean;
}

export default function AIConversationsPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [isAutoSearching, setIsAutoSearching] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [automationStatus, setAutomationStatus] = useState<string>('')
  const [showAutomation, setShowAutomation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const automationRef = useRef<AIAutomationController | null>(null)

  // 模拟用户数据（使用真实的演示数据）
  const mockUserProfile = {
    userId: 'user_demo_001',
    userName: '张伟',
    skills: ['Python', 'PyTorch', 'Transformer', 'BERT', 'NLP'],
    experience: 4,
    desiredPositions: ['NLP算法工程师', '大模型工程师', 'AI研究员']
  }

  useEffect(() => {
    // 模拟加载对话列表
    loadConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [selectedConv?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = () => {
    // 模拟已有的对话
    const mockConvs: Conversation[] = [
      {
        id: 'conv_001',
        jobTitle: 'NLP算法工程师',
        companyName: '字节跳动',
        messages: [
          {
            id: 'msg_001',
            role: 'jobseeker_ai',
            content: '您好！我是张三，看到贵公司字节跳动的NLP算法工程师职位，我很感兴趣。我有4年NLP相关经验，希望能进一步了解这个机会。',
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: 'msg_002',
            role: 'electronic_hr',
            content: '你好！我是字节跳动的AI招聘助手。很高兴收到你的申请！我已经查看了你的简历，让我们来聊聊这个NLP算法工程师的职位吧。我注意到你有Python、PyTorch、NLP相关的经验。能否详细介绍一下你在这些技术上最得意的项目？',
            timestamp: new Date(Date.now() - 3500000),
          },
          {
            id: 'msg_003',
            role: 'jobseeker_ai',
            content: '在我最近的项目中，我负责了端到端的NLP解决方案。具体来说，我使用Python和PyTorch技术栈，基于Transformer架构开发了一个文本分类系统，成功地将模型性能提升了30%。这个项目让我深刻理解了从数据处理到模型部署的完整流程，也锻炼了我的问题解决能力和团队协作能力。',
            timestamp: new Date(Date.now() - 3400000),
            metadata: {
              keyPointsForUser: ['HR关注你的项目经验', '准备详细的项目案例']
            }
          }
        ],
        status: 'ongoing',
        satisfactionScores: {
          hrScore: 60,
          seekerScore: 70
        },
        keyPoints: ['HR关注你的项目经验', '准备详细的项目案例', 'HR在考察技术深度'],
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3400000)
      }
    ]
    
    setConversations(mockConvs)
    if (mockConvs.length > 0) {
      setSelectedConv(mockConvs[0])
    }
  }

  const [liveScreenshot, setLiveScreenshot] = useState<string | null>(null)
  const [agentLogs, setAgentLogs] = useState<ThoughtLog[]>([])
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [agentStatus, setAgentStatus] = useState<string>('')
  const [stepCount, setStepCount] = useState(0)
  const [cursorState, setCursorState] = useState<CursorState>({ x: 640, y: 360, visible: false, clicking: false })
  const eventSourceRef = useRef<EventSource | null>(null)

  // 添加思维链日志
  const addLog = useCallback((type: ThoughtLog['type'], content: string) => {
    const log: ThoughtLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: Date.now()
    }
    setAgentLogs(prev => [...prev.slice(-19), log]) // 保留最近20条
  }, [])

  // 启动GUI-Owl视觉智能体
  const handleStartVisionAgent = useCallback(() => {
    if (isAgentRunning) return
    
    setIsAgentRunning(true)
    setIsPaused(false)
    setAgentLogs([])
    setStepCount(0)
    setCursorState({ x: 640, y: 360, visible: true, clicking: false })
    
    addLog('status', '正在连接 GUI-Owl 视觉引擎...')
    
    // 使用新的视觉智能体API
    const eventSource = new EventSource('/api/ai-vision-agent')
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const payload: SSEEvent = JSON.parse(event.data)
        
        switch (payload.type) {
          case 'screenshot':
            setLiveScreenshot(payload.data.dataUrl || payload.data)
            break
            
          case 'thought':
            addLog('thought', `${payload.data.thought}`)
            if (payload.data.description) {
              addLog('action', `准备执行: ${payload.data.description}`)
            }
            setStepCount(payload.data.step || stepCount + 1)
            break
            
          case 'action':
            addLog('action', `✓ 执行: ${payload.data.action} ${JSON.stringify(payload.data.parameters || {})}`)
            break
            
          case 'cursor':
            setCursorState(prev => ({
              ...prev,
              x: payload.data.x,
              y: payload.data.y,
              clicking: payload.data.action === 'click'
            }))
            break
            
          case 'status':
            setAgentStatus(payload.data.message || payload.data.state)
            addLog('status', payload.data.message || `状态: ${payload.data.state}`)
            break
            
          case 'message':
            // 处理对话消息
            if (payload.data) {
              addLog('status', `💬 新消息: ${payload.data.content?.substring(0, 50)}...`)
            }
            break
            
          case 'error':
            addLog('error', `错误: ${payload.data.message || payload.data}`)
            break
            
          case 'complete':
            addLog('status', `✅ 任务完成！执行了 ${payload.data.stepsExecuted || stepCount} 步`)
            setIsAgentRunning(false)
            setCursorState(prev => ({ ...prev, visible: false }))
            eventSource.close()
            break
        }
      } catch (e) {
        console.error('解析SSE事件失败:', e)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE连接错误:', error)
      addLog('error', 'SSE连接中断')
      setIsAgentRunning(false)
      setCursorState(prev => ({ ...prev, visible: false }))
      eventSource.close()
    }
  }, [isAgentRunning, addLog, stepCount])

  // 停止智能体
  const handleStopAgent = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setIsAgentRunning(false)
    setIsPaused(false)
    setCursorState(prev => ({ ...prev, visible: false }))
    addLog('status', '用户手动停止')
  }, [addLog])

  // 旧的启动方法（保留兼容性）
  const handleStartRealAgent = () => {
    handleStartVisionAgent()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-100 text-blue-700'
      case 'hr_notified': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return '对话进行中'
      case 'hr_notified': return '✅ 已推荐给HR'
      case 'completed': return '已完成'
      case 'rejected': return '不匹配'
      default: return '未知状态'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🤖 AI求职助手</h1>
              <p className="text-white/90">让AI代表你与电子HR对话，自动寻找最匹配的工作机会</p>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition">
                返回首页
              </Link>
              <button
                onClick={handleStartVisionAgent}
                disabled={isAgentRunning}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold disabled:opacity-50 shadow-lg flex items-center gap-2"
              >
                {isAgentRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    AI 正在操作...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    启动 GUI-Owl 视觉助手
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="container mx-auto px-6 py-4">
          {notifications.map((notif, index) => (
            <div key={index} className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{notif}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI 视觉智能体直播间 */}
      {(isAgentRunning || agentLogs.length > 0) && (
        <div className="container mx-auto px-6 py-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 实时视频流 */}
            <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-indigo-500/30 relative group">
              {/* LIVE标签 */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  LIVE
                </div>
                <div className="bg-indigo-600/90 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  GUI-Owl Vision
                </div>
                <div className="bg-gray-800/90 text-white text-xs px-2 py-1 rounded">
                  步骤: {stepCount}
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                {isAgentRunning && (
                  <button
                    onClick={handleStopAgent}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition flex items-center gap-1 text-xs font-medium"
                  >
                    <Square className="w-4 h-4" />
                    停止
                  </button>
                )}
              </div>

              {/* 截图显示 */}
              <div className="relative w-full aspect-video bg-gray-900">
                {liveScreenshot ? (
                  <>
                    <img 
                      src={liveScreenshot} 
                      alt="AI Agent View" 
                      className="w-full h-full object-contain"
                    />
                    {/* 虚拟光标 */}
                    {cursorState.visible && (
                      <div 
                        className="absolute pointer-events-none transition-all duration-200 ease-out"
                        style={{ 
                          left: `${(cursorState.x / 1280) * 100}%`, 
                          top: `${(cursorState.y / 720) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className={`relative ${cursorState.clicking ? 'scale-75' : 'scale-100'} transition-transform`}>
                          <MousePointer2 className="w-6 h-6 text-indigo-500 drop-shadow-lg" />
                          {cursorState.clicking && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500/30 rounded-full animate-ping"></div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <Bot className="w-12 h-12 mb-4 animate-bounce" />
                    <p>正在初始化视觉引擎...</p>
                    <p className="text-sm text-gray-600 mt-2">{agentStatus || '准备中'}</p>
                  </div>
                )}
                {/* 扫描线效果 */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent bg-[length:100%_4px] animate-scan"></div>
              </div>

              {/* 状态栏 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white text-sm">
                  <span className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    {agentStatus || (isAgentRunning ? 'AI正在操作...' : '就绪')}
                  </span>
                  <span className="text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 思维链面板 */}
            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-indigo-400 font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  AI 思维链 (Thought Chain)
                </h3>
              </div>
              
              <div className="flex-1 p-4 font-mono text-sm space-y-2 overflow-y-auto max-h-[350px] scrollbar-hide">
                {agentLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`${
                      log.type === 'thought' ? 'text-green-400 border-l-green-500' : 
                      log.type === 'action' ? 'text-blue-400 border-l-blue-500' :
                      log.type === 'error' ? 'text-red-400 border-l-red-500' : 
                      'text-gray-300 border-l-gray-500'
                    } border-l-2 pl-3 py-1.5 bg-white/5 rounded-r text-xs`}
                  >
                    <span className="text-gray-500 mr-2">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.type === 'thought' && '🧠 '}
                    {log.type === 'action' && '⚡ '}
                    {log.type === 'error' && '❌ '}
                    {log.type === 'status' && '📌 '}
                    {log.content}
                  </div>
                ))}
                {isAgentRunning && (
                  <div className="flex gap-1 pl-3 py-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
                {agentLogs.length === 0 && !isAgentRunning && (
                  <div className="text-gray-500 text-center py-8">
                    <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>等待启动...</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-gray-800 bg-gray-950">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest text-center">
                  Powered by GUI-Owl + 通义千问
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 注入全局动画样式 */}
      <style jsx global>{`
        @keyframes scan {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        .animate-scan {
          animation: scan 10s linear infinite;
        }
      `}</style>

      {/* AI自动化状态 */}
      {showAutomation && (
        <div className="container mx-auto px-6 py-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center animate-pulse">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-indigo-900 mb-1">🤖 AI助手正在工作...</h3>
                <p className="text-indigo-700 font-medium">{automationStatus}</p>
                <div className="mt-2 h-1 bg-indigo-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-indigo-600 bg-white/50 rounded p-3">
              👁️ <strong>提示：</strong>正在模拟真人操作，您可以看到AI助手如何移动鼠标、点击按钮、输入内容...
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：对话列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  活跃对话 ({conversations.length})
                </h2>
              </div>
              <div className="divide-y max-h-[70vh] overflow-y-auto">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedConv?.id === conv.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{conv.jobTitle}</h3>
                        <p className="text-sm text-gray-600">{conv.companyName}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(conv.status)}`}>
                        {getStatusText(conv.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>HR满意度: {conv.satisfactionScores.hrScore}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{conv.messages.length}条消息</span>
                      </div>
                    </div>

                    {conv.keyPoints.length > 0 && (
                      <div className="flex items-start gap-1 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{conv.keyPoints[conv.keyPoints.length - 1]}</span>
                      </div>
                    )}
                  </div>
                ))}

                {conversations.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>暂无活跃对话</p>
                    <p className="text-sm mt-2">点击"自动搜索职位"让AI助手为你寻找机会</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：对话详情 */}
          <div className="lg:col-span-2">
            {selectedConv ? (
              <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col" style={{ height: '75vh' }}>
                {/* 对话头部 */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-lg">{selectedConv.jobTitle}</h2>
                      <p className="text-sm text-gray-600">{selectedConv.companyName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">
                        {selectedConv.satisfactionScores.hrScore}分
                      </div>
                      <div className="text-xs text-gray-600">HR满意度</div>
                    </div>
                  </div>

                  {/* 关键提示 */}
                  {selectedConv.keyPoints.length > 0 && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="font-semibold text-sm text-yellow-800 mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        需要关注的要点：
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {selectedConv.keyPoints.slice(-3).map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedConv.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'jobseeker_ai' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${msg.role === 'jobseeker_ai' ? 'order-2' : 'order-1'}`}>
                        {/* 角色标签 */}
                        <div className={`text-xs mb-1 flex items-center gap-1 ${
                          msg.role === 'jobseeker_ai' ? 'justify-end text-indigo-600' : 'justify-start text-green-600'
                        }`}>
                          {msg.role === 'jobseeker_ai' ? (
                            <>
                              <Bot className="w-3 h-3" />
                              <span>你的AI助手</span>
                            </>
                          ) : (
                            <>
                              <Briefcase className="w-3 h-3" />
                              <span>电子HR</span>
                            </>
                          )}
                        </div>

                        {/* 消息内容 */}
                        <div className={`rounded-lg px-4 py-3 ${
                          msg.role === 'jobseeker_ai'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                          <div className={`text-xs mt-2 ${
                            msg.role === 'jobseeker_ai' ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>

                        {/* 关键提示 */}
                        {msg.metadata?.keyPointsForUser && msg.metadata.keyPointsForUser.length > 0 && (
                          <div className="mt-2 text-xs bg-orange-50 text-orange-700 px-3 py-2 rounded">
                            ⚠️ {msg.metadata.keyPointsForUser.join('；')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>

                {/* 底部状态 */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bot className="w-4 h-4" />
                      <span>AI助手正在代表你与电子HR交流...</span>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(selectedConv.status)}`}>
                      {getStatusText(selectedConv.status)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">选择一个对话查看详情</h3>
                <p className="text-gray-500">AI助手会自动代表你与电子HR交流</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
