'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bot, Sparkles, FileSearch, Brain, MessageCircle,
  DollarSign, LineChart, Database, Zap, ChevronRight,
  Send, Clipboard, CheckCircle, RefreshCw, ArrowLeft,
  User, Briefcase, Search, Filter, Download
} from 'lucide-react'

// AI助手功能模块
const aiModules = [
  {
    id: 'resume-screening',
    name: '智能简历筛选',
    icon: FileSearch,
    color: 'blue',
    description: '上传简历或选择候选人，AI自动分析与岗位匹配度',
    features: ['批量简历解析', '智能匹配评分', '关键信息提取', '推荐排序']
  },
  {
    id: 'interview-questions',
    name: 'AI面试问题生成',
    icon: Brain,
    color: 'purple',
    description: '根据岗位JD和候选人背景，生成针对性面试问题',
    features: ['技术面试题', '行为面试题', '情景模拟题', '追问建议']
  },
  {
    id: 'communication',
    name: '候选人沟通助手',
    icon: MessageCircle,
    color: 'green',
    description: '智能生成各场景下的候选人沟通话术',
    features: ['面试邀约', '进度跟进', '拒绝通知', 'Offer沟通']
  },
  {
    id: 'salary-analysis',
    name: '薪资分析建议',
    icon: DollarSign,
    color: 'yellow',
    description: '基于市场数据，提供薪资定位和Offer建议',
    features: ['市场行情对标', '薪资结构建议', 'Offer生成', '谈薪策略']
  },
  {
    id: 'insights',
    name: '招聘数据洞察',
    icon: LineChart,
    color: 'cyan',
    description: '分析招聘数据，发现优化机会',
    features: ['漏斗分析', '效率报告', '趋势预测', '优化建议']
  },
  {
    id: 'talent-pool',
    name: '人才库管理',
    icon: Database,
    color: 'pink',
    description: '智能管理和激活历史候选人资源',
    features: ['智能标签', '人才画像', '主动推荐', '批量触达']
  }
]

// 示例对话
const exampleConversations = [
  { role: 'user', content: '我需要为大模型算法工程师岗位筛选简历，候选人需要有LLM训练经验' },
  { role: 'ai', content: '好的，我来帮您分析。根据您的需求，我会重点关注以下匹配维度：\n\n1. **LLM相关经验**：预训练、SFT、RLHF等\n2. **技术栈**：PyTorch、Transformers、DeepSpeed等\n3. **项目经历**：是否有大模型训练/微调实战经验\n4. **学历背景**：NLP/ML方向硕士及以上优先\n\n请上传候选人简历，我将为您进行智能筛选和评分。' },
  { role: 'user', content: '这位候选人的简历匹配度如何？' },
  { role: 'ai', content: '**候选人匹配度分析报告**\n\n综合评分：**92/100** ⭐⭐⭐⭐⭐\n\n✅ **强匹配项**\n- 3年LLM算法经验，参与过百亿参数模型训练\n- 熟悉PyTorch、DeepSpeed、Megatron-LM\n- 北大计算机硕士，NLP方向\n\n⚠️ **待确认项**\n- RLHF经验需在面试中深入了解\n- 团队管理经验较少\n\n💡 **面试建议**\n建议重点考察其在大规模分布式训练中的实际贡献，以及对RLHF的理解深度。\n\n是否需要我为这位候选人生成面试问题？' }
]

export default function AIAssistantPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState(exampleConversations)
  const [isTyping, setIsTyping] = useState(false)

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50' },
      green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
      yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
      cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/50' },
      pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/50' }
    }
    return colors[color] || colors.blue
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = { role: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        '面试问题': '根据该岗位JD，我为您生成以下面试问题：\n\n**技术问题**\n1. 请介绍一下您在LLM预训练中的具体工作，数据规模和模型参数量是多少？\n2. 您如何处理训练过程中的loss spike问题？\n\n**行为问题**\n1. 请举例说明您如何在紧张的deadline下完成项目交付？\n\n需要更多问题吗？',
        '邀约': '好的，为您生成面试邀约话术：\n\n---\n您好 [候选人姓名]，\n\n我是 [公司名称] 的HR [您的姓名]。通过您的简历，我们对您在大模型领域的经验非常感兴趣。\n\n我们正在招聘大模型算法工程师，这个岗位将参与公司核心大模型的研发工作。基于您的背景，我认为这个机会与您非常匹配。\n\n方便的话，我们是否可以安排一次简短的电话沟通？\n\n期待您的回复！\n\n---\n\n需要调整语气或内容吗？',
        'default': '收到您的需求。作为您的AI招聘助手，我可以帮助您：\n\n1. **简历筛选** - 快速分析候选人与岗位的匹配度\n2. **面试问题** - 根据JD和简历生成针对性问题\n3. **沟通话术** - 提供专业的候选人沟通模板\n4. **薪资建议** - 基于市场数据给出定薪建议\n\n请告诉我您需要什么帮助？'
      }

      let response = aiResponses.default
      if (inputValue.includes('面试') && inputValue.includes('问题')) {
        response = aiResponses['面试问题']
      } else if (inputValue.includes('邀约') || inputValue.includes('沟通')) {
        response = aiResponses['邀约']
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/recruiter" className="text-white/80 hover:text-white transition">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  AI招聘助手
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                </h1>
                <p className="text-white/80 text-sm">您的智能招聘伙伴，让招聘效率提升10倍</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧功能模块 */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                AI能力
              </h2>
              <div className="space-y-2">
                {aiModules.map((module) => {
                  const colors = getColorClasses(module.color)
                  const Icon = module.icon
                  return (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module.id)}
                      className={`w-full p-3 rounded-xl text-left transition ${
                        selectedModule === module.id
                          ? `${colors.bg} ${colors.border} border`
                          : 'bg-slate-900/50 border border-transparent hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${colors.bg} rounded-lg`}>
                          <Icon className={`h-4 w-4 ${colors.text}`} />
                        </div>
                        <span className="text-white text-sm font-medium">{module.name}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* 快捷操作 */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <h3 className="text-sm text-slate-400 mb-3">快捷操作</h3>
                <div className="space-y-2">
                  <button className="w-full p-2 bg-slate-900/50 rounded-lg text-slate-300 text-sm hover:bg-slate-900 transition flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    搜索人才库
                  </button>
                  <button className="w-full p-2 bg-slate-900/50 rounded-lg text-slate-300 text-sm hover:bg-slate-900 transition flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    筛选待处理简历
                  </button>
                  <button className="w-full p-2 bg-slate-900/50 rounded-lg text-slate-300 text-sm hover:bg-slate-900 transition flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    导出招聘报告
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 中间对话区域 */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl h-[calc(100vh-200px)] flex flex-col">
              {/* 对话头部 */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">AI助手在线</span>
                  </div>
                  <button className="text-slate-400 hover:text-white transition flex items-center gap-1 text-sm">
                    <RefreshCw className="h-4 w-4" />
                    新对话
                  </button>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mb-2 text-cyan-400 text-sm">
                          <Bot className="h-4 w-4" />
                          AI助手
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content}
                      </div>
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-600">
                          <button className="text-slate-400 hover:text-white transition p-1">
                            <Clipboard className="h-4 w-4" />
                          </button>
                          <button className="text-slate-400 hover:text-green-400 transition p-1">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-100 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-cyan-400 text-sm">
                        <Bot className="h-4 w-4" />
                        AI助手正在输入...
                      </div>
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 输入区域 */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="输入您的需求，如：帮我筛选这份简历 / 生成面试问题..."
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    onClick={handleSend}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition flex items-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    发送
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => setInputValue('帮我筛选这位候选人的简历')}
                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs hover:bg-slate-600 transition"
                  >
                    筛选简历
                  </button>
                  <button
                    onClick={() => setInputValue('为这个岗位生成面试问题')}
                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs hover:bg-slate-600 transition"
                  >
                    生成面试题
                  </button>
                  <button
                    onClick={() => setInputValue('帮我写一封面试邀约消息')}
                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs hover:bg-slate-600 transition"
                  >
                    面试邀约
                  </button>
                  <button
                    onClick={() => setInputValue('这个岗位的市场薪资水平是多少')}
                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs hover:bg-slate-600 transition"
                  >
                    薪资分析
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧功能详情 */}
          <div className="lg:col-span-1">
            {selectedModule ? (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4">
                {(() => {
                  const module = aiModules.find(m => m.id === selectedModule)
                  if (!module) return null
                  const colors = getColorClasses(module.color)
                  const Icon = module.icon
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 ${colors.bg} rounded-xl`}>
                          <Icon className={`h-6 w-6 ${colors.text}`} />
                        </div>
                        <h2 className="text-lg font-bold text-white">{module.name}</h2>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{module.description}</p>
                      <div className="space-y-2">
                        {module.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <button className={`mt-4 w-full py-3 ${colors.bg} ${colors.text} rounded-xl font-medium hover:opacity-80 transition`}>
                        开始使用
                      </button>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4">
                <h2 className="text-lg font-bold text-white mb-4">使用提示</h2>
                <div className="space-y-3 text-slate-400 text-sm">
                  <p>点击左侧功能模块，查看详细说明</p>
                  <p>在对话框中直接输入您的需求</p>
                  <p>使用快捷按钮快速开始常用操作</p>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    今日AI助手数据
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">筛选简历</span>
                      <span className="text-blue-400 font-medium">23份</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">生成问题</span>
                      <span className="text-purple-400 font-medium">15组</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">沟通协助</span>
                      <span className="text-green-400 font-medium">8次</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">节省时间</span>
                      <span className="text-cyan-400 font-medium">约3.5小时</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
