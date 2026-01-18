'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { jobCategories, mockJobs } from '@/lib/mockData'
import { useAIOperation } from '@/components/AIOperationProvider'

function SeekerHomeContent() {
  const searchParams = useSearchParams()
  const { startAIOperation } = useAIOperation()
  
  const hotJobs = mockJobs.filter(job => job.isHot).slice(0, 8)
  
  // 为每个分类设置真实的职位数量
  const categoryJobCounts: Record<string, number> = {
    'llm': 2987,
    'aigc': 2109,
    'aiagent': 1234,
    'multimodal': 500,
    'cv': 3126,
    'nlp': 1876,
    'ml': 2345,
    'recommend': 500,
    'robotics': 654,
    'autodrive': 2345,
    'speech': 765,
    'rl': 892,
    'kg': 456,
    'aiops': 1543,
    'data': 3456,
    'hardware': 1654,
    'aisecurity': 345,
    'aiproduct': 987,
    'prompt': 678,
    'aiops_func': 1234,
    'aimarket': 567,
    'aisales': 892,
    'medical': 567,
    'fintech': 1456,
    'eduai': 345,
    'aimanager': 678,
    'aiexec': 234,
    'aihr': 1567
  }
  
  const jobCountByCategory = jobCategories.map(cat => ({
    ...cat,
    count: categoryJobCounts[cat.id] || 500
  }))

  // 检查URL参数，如果有startAI=true则自动启动
  useEffect(() => {
    if (searchParams.get('startAI') === 'true') {
      startAIOperation()
    }
  }, [searchParams, startAIOperation])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="text-sm font-medium">⚡ 专注AI领域 8年 · 服务300+ AI企业 · 200000+ 精准候选人</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            人工智能领域专业招聘平台
          </h1>
          <p className="text-xl mb-10 max-w-4xl mx-auto leading-relaxed">
            深耕人工智能领域，从大模型到自动驾驶，从机器学习到AIGC<br/>
            更懂业务、更懂技术、更懂你
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/seeker/jobs" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition inline-block text-center min-w-[160px]"
            >
              <div className="font-bold text-lg">开始找AI工作</div>
              <div className="text-xs text-indigo-400 mt-1">浏览全部AI领域职位</div>
            </Link>
            <button 
              onClick={startAIOperation}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition inline-block text-center min-w-[160px]"
            >
              <div className="font-bold text-lg">🤖 AI求职助手</div>
              <div className="text-xs text-white/80 mt-1">AI自动找工作</div>
            </button>
            <Link 
              href="/seeker/ai-interview" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition inline-block text-center min-w-[160px]"
            >
              <div className="font-bold text-lg">🤖 AI面对面</div>
              <div className="text-xs text-white/80 mt-1">智能匹配即时面试</div>
            </Link>
            <Link 
              href="/seeker/profile" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition inline-block text-center min-w-[160px]"
            >
              <div className="font-bold text-lg">我的简历</div>
              <div className="text-xs text-white/70 mt-1">管理个人求职简历</div>
            </Link>
          </div>
          {/* 快速分类导航 */}
          <div className="flex flex-wrap gap-3 justify-center mt-12">
            <Link href="/seeker/jobs" className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition">
              所有领域
            </Link>
            <Link href="/seeker/jobs?category=llm" className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition">
              大模型
            </Link>
            <Link href="/seeker/jobs?category=robotics" className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition">
              自动驾驶
            </Link>
            <Link href="/seeker/jobs?category=aigc" className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition">
              AIGC
            </Link>
            <Link href="/seeker/jobs?category=nlp" className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition">
              NLP
            </Link>
            <Link href="/seeker/jobs?category=cv" className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition">
              计算机视觉
            </Link>
          </div>
        </div>
      </section>

      {/* 领域分类和所有内容区域 */}
      <div className="bg-gray-50">
        {/* AI专业领域 */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">AI专业领域</h2>
              <p className="text-gray-600 text-lg">精细化分类，精准匹配你擅长的方向</p>
              <p className="text-gray-500 text-sm mt-2">涵盖20+大领域 · 200+细分方向</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {jobCountByCategory.slice(0, 8).map((category) => (
                <Link 
                  key={category.id}
                  href={`/seeker/jobs?category=${category.id}`}
                  className="bg-white p-6 rounded-xl hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">在招职位</div>
                      <div className="text-3xl font-bold text-indigo-600">{category.count.toLocaleString()}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.id === 'llm' && 'LLM预训练、微调、RLHF、Agent'}
                    {category.id === 'aigc' && '文生图、视频生成、多模态生成'}
                    {category.id === 'aiagent' && 'Agent架构、RAG、工具调用、多智能体'}
                    {category.id === 'multimodal' && '视觉语言模型、跨模态理解'}
                    {category.id === 'cv' && '图像识别、目标检测、3D视觉、NeRF'}
                    {category.id === 'nlp' && 'BERT、GPT、文本分析、问答系统'}
                    {category.id === 'ml' && '传统ML、特征工程、模型优化'}
                    {category.id === 'recommend' && '推荐系统、召回排序、搜索引擎'}
                    {category.id === 'robotics' && '感知算法、SLAM、决策控制'}
                    {category.id === 'autodrive' && '自动驾驶、感知规控、V2X'}
                    {category.id === 'speech' && '语音识别、语音合成、声纹识别'}
                    {category.id === 'rl' && '强化学习、策略优化、游戏AI'}
                    {category.id === 'kg' && '知识图谱、实体抽取、图推理'}
                    {category.id === 'aiops' && 'MLOps、模型部署、CI/CD'}
                    {category.id === 'data' && '数据工程、数仓架构、实时计算'}
                    {category.id === 'aiproduct' && 'AI产品设计、用户体验、需求分析'}
                    {category.id === 'prompt' && 'Prompt设计、AI训练、数据标注'}
                    {category.id === 'aisecurity' && '对抗攻防、隐私保护、模型安全'}
                    {category.id === 'hardware' && 'AI芯片设计、GPU/TPU/NPU、FPGA'}
                    {category.id === 'medical' && '医学影像、AI制药、生物计算'}
                    {category.id === 'aiops_func' && '产品运营、用户增长、数据分析'}
                    {category.id === 'aimarket' && '市场营销、品牌传播、行业活动'}
                    {category.id === 'aisales' && '解决方案销售、商务拓展、客户管理'}
                    {category.id === 'fintech' && '风控算法、量化交易、智能投顾'}
                    {category.id === 'eduai' && '智能辅导、自适应学习、教育产品'}
                    {category.id === 'aimanager' && '技术管理、团队建设、项目管理'}
                    {category.id === 'aiexec' && 'VP/CTO、战略规划、商业化'}
                    {category.id === 'aihr' && '技术招聘、HRBP、猎头、人才发展'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.id === 'llm' && ['LLM', 'Pre-training', 'RLHF'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-pink-50 text-pink-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aigc' && ['Stable Diffusion', 'Midjourney', 'Sora'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-fuchsia-50 text-fuchsia-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aiagent' && ['ReAct', 'AutoGPT', 'RAG'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-violet-50 text-violet-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'multimodal' && ['GPT-4V', 'LLaVA', 'CLIP'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'cv' && ['目标检测', '图像分割', '3D视觉'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'nlp' && ['文本分类', 'NER', '机器翻译'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'ml' && ['监督学习', 'XGBoost', '特征工程'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'recommend' && ['召回', '排序', 'CTR预估'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'robotics' && ['SLAM', '运动规划', '机械臂'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-cyan-50 text-cyan-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'autodrive' && ['BEV感知', '规划控制', '仿真'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-sky-50 text-sky-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'speech' && ['ASR', 'TTS', '声纹'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'rl' && ['DQN', 'PPO', '多智能体'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'kg' && ['Neo4j', 'GNN', '实体链接'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-teal-50 text-teal-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aiops' && ['Docker', 'K8s', 'MLflow'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'data' && ['Spark', 'Flink', '数仓'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-teal-50 text-teal-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aiproduct' && ['PRD', 'Figma', 'AB测试'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'prompt' && ['Prompt', 'Few-shot', 'CoT'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-lime-50 text-lime-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aisecurity' && ['对抗样本', '隐私计算', '联邦学习'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'hardware' && ['AI芯片', 'NPU', 'FPGA'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'medical' && ['医学影像', 'AI制药', 'AlphaFold'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aiops_func' && ['用户增长', '数据分析', '活动运营'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-rose-50 text-rose-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aimarket' && ['品牌传播', 'To B营销', '行业活动'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aisales' && ['大客户销售', 'BD', '售前'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'fintech' && ['风控', '量化', '反欺诈'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'eduai' && ['智能辅导', '自适应', '在线教育'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aimanager' && ['技术经理', '团队负责人', '项目管理'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{tag}</span>
                    ))}
                    {category.id === 'aiexec' && ['VP', 'CTO', '研究院长'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded">{tag}</span>
                    ))}
                    {category.id === 'aihr' && ['技术招聘', 'HRBP', '猎头'].map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-pink-50 text-pink-700 rounded">{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/seeker/jobs" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                查看全部28个专业领域 →
              </Link>
            </div>
          </div>
        </section>

        {/* 精选AI职位 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-4">精选AI职位</h2>
                <p className="text-gray-600 text-lg">来自顶级AI企业的热招岗位</p>
              </div>
              <Link 
                href="/seeker/jobs"
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg"
              >
                查看全部职位 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotJobs.map((job) => (
                <Link 
                  key={job.id}
                  href={`/seeker/jobs/${job.id}`}
                  className="bg-white p-5 rounded-xl hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="flex gap-2 mb-3">
                    {job.isHot && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                        热招
                      </span>
                    )}
                    {job.isUrgent && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                        急聘
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{job.location} · {job.company}</div>
                  <h3 className="font-bold text-lg mb-3 leading-tight">{job.title}</h3>
                  <div className="text-2xl font-bold text-indigo-600 mb-4">{job.salary}</div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 数据统计 */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-5xl font-bold mb-3">8年+</div>
                <div className="text-xl">深耕AI领域</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-3">300+</div>
                <div className="text-xl">优质AI企业</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-3">20万+</div>
                <div className="text-xl">AI人才库</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-3">92%</div>
                <div className="text-xl">精准匹配率</div>
              </div>
            </div>
          </div>
        </section>

        {/* 为什么选择 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">为什么选择AI智聘</h2>
              <p className="text-gray-600 text-lg">更专业、更懂AI的招聘服务</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">专业领域深耕</h3>
                <p className="text-gray-600 leading-relaxed">
                  8年专注AI领域招聘，深度理解大模型、自动驾驶、AIGC等细分领域
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">AI智能匹配</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI助手自动面试、简历智能分析、自动评估匹配度，高分自动推送HR
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">优质人才库</h3>
                <p className="text-gray-600 leading-relaxed">
                  20万+AI人才，涵盖算法、工程、产品、运营等全链条岗位
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA区域 */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl font-bold mb-6">开启你的AI职业新篇章</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
              无论你是寻找下一个挑战的技术专家，还是刚入行的AI新人<br/>
              AI智聘都能为你匹配最适合的机会
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/seeker/jobs" 
                className="bg-white text-indigo-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block"
              >
                浏览全部职位
              </Link>
              <Link 
                href="/seeker/profile" 
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition inline-block"
              >
                完善我的简历
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function SeekerHomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">加载中...</div>}>
      <SeekerHomeContent />
    </Suspense>
  )
}
