'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  MessageSquare, Users, Briefcase, MapPin, DollarSign,
  Clock, Star, ChevronRight, Sparkles, Bot, Send,
  ArrowLeft, Settings, Maximize2, Monitor, RefreshCw
} from 'lucide-react'

// 模拟匹配的职位
const matchedJobs = [
  {
    id: 1,
    company: '字节跳动',
    logo: '字',
    position: '大模型算法工程师',
    location: '北京',
    salary: '50-80K',
    matchScore: 95,
    hrName: '王女士',
    hrTitle: 'AI研发部HR',
    status: 'online',
    tags: ['LLM', 'PyTorch', 'RLHF']
  },
  {
    id: 2,
    company: '阿里巴巴',
    logo: '阿',
    position: 'AIGC算法专家',
    location: '杭州',
    salary: '60-100K',
    matchScore: 92,
    hrName: '李先生',
    hrTitle: '达摩院招聘经理',
    status: 'online',
    tags: ['Stable Diffusion', 'LoRA', '多模态']
  },
  {
    id: 3,
    company: '腾讯',
    logo: '腾',
    position: 'NLP算法工程师',
    location: '深圳',
    salary: '45-70K',
    matchScore: 88,
    hrName: '张女士',
    hrTitle: 'AI Lab HR',
    status: 'away',
    tags: ['NLP', 'BERT', '文本分析']
  }
]

// 模拟聊天消息
const initialMessages = [
  { role: 'system', content: '系统提示：AI已为您智能匹配到3个高匹配度职位，HR正在线等待面试' },
]

export default function AIInterviewPage() {
  const [selectedJob, setSelectedJob] = useState(matchedJobs[0])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'matching' | 'connecting' | 'connected'>('idle')
  const [matchingProgress, setMatchingProgress] = useState(0)

  // 模拟匹配过程
  const startMatching = () => {
    setConnectionStatus('matching')
    setMatchingProgress(0)
    
    const interval = setInterval(() => {
      setMatchingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setConnectionStatus('connecting')
          // 2秒后连接成功
          setTimeout(() => {
            setConnectionStatus('connected')
            setIsConnected(true)
            setMessages(prev => [...prev, 
              { role: 'system', content: `已连接到 ${selectedJob.company} - ${selectedJob.hrName}` },
              { role: 'hr', content: `您好！我是${selectedJob.company}${selectedJob.hrTitle}${selectedJob.hrName}，很高兴认识您。我看了您的简历，对您的背景很感兴趣，我们来聊聊？` }
            ])
          }, 2000)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const endCall = () => {
    setIsConnected(false)
    setConnectionStatus('idle')
    setMessages([...initialMessages])
  }

  const sendMessage = () => {
    if (!inputValue.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: inputValue }])
    setInputValue('')
    
    // 模拟HR回复
    setTimeout(() => {
      const responses = [
        '您之前在大模型方面的项目经验很丰富，能详细讲讲您负责的那个预训练项目吗？',
        '您对我们团队现在做的方向有什么想法？',
        '薪资方面您的期望是多少呢？',
        '如果顺利的话，您最快什么时候可以入职？'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, { role: 'hr', content: randomResponse }])
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/seeker" className="text-slate-400 hover:text-white transition">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Video className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h1 className="text-white font-bold flex items-center gap-2">
                  AI面对面
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </h1>
                <p className="text-slate-400 text-xs">智能匹配 · 即时面试</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">匹配到</span>
            <span className="text-green-400 font-bold">{matchedJobs.length}</span>
            <span className="text-slate-400">个高匹配职位</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
          {/* 左侧 - 匹配职位列表 */}
          <div className="lg:col-span-1 bg-slate-800/50 rounded-2xl border border-slate-700 p-4 overflow-y-auto">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400" />
              AI智能匹配
            </h2>
            <div className="space-y-3">
              {matchedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl cursor-pointer transition ${
                    selectedJob.id === job.id
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50'
                      : 'bg-slate-900/50 border border-transparent hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {job.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium text-sm truncate">{job.position}</span>
                        <span className="text-green-400 text-xs font-bold">{job.matchScore}%</span>
                      </div>
                      <div className="text-slate-400 text-xs mb-2">{job.company}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">{job.location}</span>
                        <span className="text-emerald-400 font-medium">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${job.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                        <span className="text-slate-400 text-xs">{job.hrName} {job.status === 'online' ? '在线' : '离开'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400 mb-2">匹配说明</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                AI已分析您的简历与{matchedJobs.length}个职位需求，按匹配度排序。点击职位可查看详情并发起面试。
              </p>
            </div>
          </div>

          {/* 中间 - 视频面试区域 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* 视频区域 */}
            <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden relative">
              {connectionStatus === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">准备好开始面试了吗？</h2>
                    <p className="text-slate-400 mb-6">
                      AI已为您匹配到 <span className="text-green-400 font-bold">{selectedJob.company}</span> 的 
                      <span className="text-white font-medium"> {selectedJob.position}</span> 职位
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>匹配度 {selectedJob.matchScore}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span>{selectedJob.salary}</span>
                      </div>
                    </div>
                    <button
                      onClick={startMatching}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/25 transition flex items-center gap-2 mx-auto"
                    >
                      <Video className="h-5 w-5" />
                      开始面对面
                    </button>
                  </div>
                  
                  {/* 职位标签 */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedJob.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {connectionStatus === 'matching' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 border-4 border-green-500/30 rounded-full"></div>
                    <div 
                      className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-green-500 rounded-full animate-spin"
                    ></div>
                    <Bot className="absolute inset-0 m-auto h-10 w-10 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">AI正在智能匹配...</h2>
                  <p className="text-slate-400 mb-4">正在分析简历与职位需求</p>
                  <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-200"
                      style={{ width: `${matchingProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-green-400 text-sm mt-2">{matchingProgress}%</span>
                </div>
              )}

              {connectionStatus === 'connecting' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90">
                  <div className="flex items-center gap-8 mb-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                        我
                      </div>
                      <span className="text-slate-400 text-sm">您</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                        {selectedJob.logo}
                      </div>
                      <span className="text-slate-400 text-sm">{selectedJob.hrName}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">正在连接...</h2>
                  <p className="text-slate-400">正在连接 {selectedJob.company} {selectedJob.hrTitle}</p>
                </div>
              )}

              {connectionStatus === 'connected' && (
                <div className="absolute inset-0 flex">
                  {/* HR视频（大） */}
                  <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 mx-auto">
                          {selectedJob.logo}
                        </div>
                        <div className="text-white font-bold text-xl">{selectedJob.hrName}</div>
                        <div className="text-slate-400 text-sm">{selectedJob.company} · {selectedJob.hrTitle}</div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm">面试中</span>
                      <span className="text-slate-400 text-sm">· 00:03:24</span>
                    </div>
                  </div>
                  
                  {/* 自己视频（小） */}
                  <div className="absolute bottom-4 right-4 w-48 h-36 bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl border-2 border-slate-600 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isCameraOn ? (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          我
                        </div>
                      ) : (
                        <VideoOff className="h-8 w-8 text-slate-500" />
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
                      {isCameraOn ? '摄像头开启' : '摄像头关闭'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 控制栏 */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-4 rounded-full transition ${
                    isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white'
                  }`}
                >
                  {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </button>
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-4 rounded-full transition ${
                    isCameraOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white'
                  }`}
                >
                  {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </button>
                <button className="p-4 bg-slate-700 rounded-full text-white hover:bg-slate-600 transition">
                  <Monitor className="h-6 w-6" />
                </button>
                <button className="p-4 bg-slate-700 rounded-full text-white hover:bg-slate-600 transition">
                  <Maximize2 className="h-6 w-6" />
                </button>
                {isConnected && (
                  <button
                    onClick={endCall}
                    className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 右侧 - 聊天区域 */}
          <div className="lg:col-span-1 bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-white font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                面试对话
              </h2>
            </div>
            
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`${
                  msg.role === 'system' ? 'text-center' :
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {msg.role === 'system' ? (
                    <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  ) : (
                    <div className={`inline-block max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-slate-100'
                    }`}>
                      {msg.role === 'hr' && (
                        <div className="text-xs text-cyan-400 mb-1">{selectedJob.hrName}</div>
                      )}
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 输入区域 */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isConnected ? "输入消息..." : "连接后可发送消息"}
                  disabled={!isConnected}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!isConnected}
                  className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
