import { Conversation, ConversationMessage } from './types'

// 模拟AI对话记录 - 30条对话
export const mockConversations: Conversation[] = [
  {
    id: 'conv001',
    applicationId: 'app001',
    jobId: 9,
    jobTitle: '高级前端工程师',
    candidateId: 'c001',
    candidateName: '张三',
    messages: [
      { id: 'm1', role: 'hr', content: '您好张三，我是AI智聘的HR助手小智。看到您申请了我们的高级前端工程师职位，您有5年前端经验，这很棒！能简单介绍一下您最近的项目经验吗？', timestamp: '2026-01-17 10:31' },
      { id: 'm2', role: 'candidate', content: '好的，我目前在腾讯负责微信小程序框架开发，主要使用React和TypeScript。最近完成了一个大型组件库的重构项目，将打包体积减少了40%。', timestamp: '2026-01-17 10:32' },
      { id: 'm3', role: 'hr', content: '非常专业的项目经验！组件库优化确实很考验技术功底。请问您在性能优化方面有什么心得？我们这边对Web性能有较高要求。', timestamp: '2026-01-17 10:33' },
      { id: 'm4', role: 'candidate', content: '我对性能优化有深入研究，包括懒加载、代码分割、虚拟列表、Web Workers等。之前还做过一个性能监控平台，可以实时追踪FCP、LCP等核心指标。', timestamp: '2026-01-17 10:34' },
      { id: 'm5', role: 'hr', content: '太棒了！这些都是我们非常看重的能力。最后想了解一下您的期望薪资和到岗时间？', timestamp: '2026-01-17 10:35' },
      { id: 'm6', role: 'candidate', content: '期望薪资40-50K，如果offer合适的话，可以在一个月内到岗。', timestamp: '2026-01-17 10:36' }
    ],
    status: 'completed',
    startedAt: '2026-01-17 10:31',
    updatedAt: '2026-01-17 10:36',
    roundsCompleted: 3,
    aiAssessment: '候选人技术能力强，有大厂经验，性能优化经验丰富。沟通清晰，薪资在预算范围内。建议进入面试环节。'
  },
  {
    id: 'conv002',
    applicationId: 'app004',
    jobId: 10,
    jobTitle: 'Python后端开发',
    candidateId: 'c002',
    candidateName: '李四',
    messages: [
      { id: 'm1', role: 'hr', content: '您好李四，欢迎申请Python后端开发岗位！您在阿里的后端经验很扎实，能聊聊您对微服务架构的理解吗？', timestamp: '2026-01-17 08:46' },
      { id: 'm2', role: 'candidate', content: '微服务架构我比较熟悉，在阿里主要负责淘宝商品系统的服务拆分。我们使用Dubbo做RPC，配合Nacos做服务发现，Sentinel做限流熔断。', timestamp: '2026-01-17 08:47' },
      { id: 'm3', role: 'hr', content: '很专业的技术栈！那在高并发场景下，您是如何保证系统稳定性的？', timestamp: '2026-01-17 08:48' },
      { id: 'm4', role: 'candidate', content: '主要从几个方面：1.缓存预热和多级缓存 2.数据库读写分离和分库分表 3.异步处理和消息队列削峰 4.完善的监控告警体系', timestamp: '2026-01-17 08:49' }
    ],
    status: 'active',
    startedAt: '2026-01-17 08:46',
    updatedAt: '2026-01-17 08:49',
    roundsCompleted: 2
  },
  {
    id: 'conv003',
    applicationId: 'app007',
    jobId: 1,
    jobTitle: '大模型算法工程师（LLM方向）',
    candidateId: 'c003',
    candidateName: '王五',
    messages: [
      { id: 'm1', role: 'hr', content: '王五博士您好！非常高兴收到您的申请。看到您有大模型研发经验，能介绍一下您在商汤的主要工作内容吗？', timestamp: '2026-01-17 09:01' },
      { id: 'm2', role: 'candidate', content: '我在商汤主要负责大模型的预训练和微调工作。参与了公司百亿参数模型的训练，使用DeepSpeed进行分布式训练优化。也做过一些RLHF的探索。', timestamp: '2026-01-17 09:02' },
      { id: 'm3', role: 'hr', content: '百亿参数模型的训练经验非常宝贵！请问您在训练过程中遇到过哪些挑战，是如何解决的？', timestamp: '2026-01-17 09:03' },
      { id: 'm4', role: 'candidate', content: '主要挑战是训练稳定性和效率。我们通过梯度检查点、混合精度训练来优化显存使用，用ZeRO-3来分布参数。还开发了自动恢复机制处理训练中断。', timestamp: '2026-01-17 09:04' },
      { id: 'm5', role: 'hr', content: '解决方案非常专业！您有顶会论文发表吗？未来的研究方向是什么？', timestamp: '2026-01-17 09:05' },
      { id: 'm6', role: 'candidate', content: '我在ACL 2025发表了一篇关于高效微调的论文。未来想深入研究多模态大模型和Agent方向，觉得这是AGI的关键路径。', timestamp: '2026-01-17 09:06' }
    ],
    status: 'completed',
    startedAt: '2026-01-17 09:01',
    updatedAt: '2026-01-17 09:06',
    roundsCompleted: 3,
    aiAssessment: '顶级候选人，有博士学历和顶会论文。大模型训练经验丰富，技术深度强。强烈建议安排技术面试。'
  },
  {
    id: 'conv004',
    applicationId: 'app012',
    jobId: 6,
    jobTitle: '计算机视觉算法工程师',
    candidateId: 'c009',
    candidateName: '郑十一',
    messages: [
      { id: 'm1', role: 'hr', content: '郑博士您好，看到您在旷视有CV算法经验，能介绍一下您的研究方向吗？', timestamp: '2026-01-10 10:01' },
      { id: 'm2', role: 'candidate', content: '我主要研究目标检测和图像分割，在CVPR 2025发表了一篇关于实时目标检测的论文。目前在旷视负责安防场景的视觉算法优化。', timestamp: '2026-01-10 10:02' },
      { id: 'm3', role: 'hr', content: 'CVPR论文非常有含金量！您在模型部署和优化方面有经验吗？', timestamp: '2026-01-10 10:03' },
      { id: 'm4', role: 'candidate', content: '有的，我熟悉TensorRT、ONNX等部署工具，也做过模型量化和剪枝。把检测模型从100ms优化到了30ms，满足实时性需求。', timestamp: '2026-01-10 10:04' },
      { id: 'm5', role: 'hr', content: '模型优化能力很强！请问您的期望薪资是多少？', timestamp: '2026-01-10 10:05' },
      { id: 'm6', role: 'candidate', content: '期望50-70K，主要看公司的发展平台和技术挑战。', timestamp: '2026-01-10 10:06' }
    ],
    status: 'completed',
    startedAt: '2026-01-10 10:01',
    updatedAt: '2026-01-10 10:06',
    roundsCompleted: 3,
    aiAssessment: '优秀的CV算法候选人，有顶会论文和工程落地能力。综合评分95分，已发offer。'
  },
  {
    id: 'conv005',
    applicationId: 'app015',
    jobId: 8,
    jobTitle: 'NLP算法研究员',
    candidateId: 'c010',
    candidateName: '王小明',
    messages: [
      { id: 'm1', role: 'hr', content: '王小明您好！您在百度的NLP经验很吸引我们。能介绍一下您在文心一言项目中的工作吗？', timestamp: '2026-01-11 11:01' },
      { id: 'm2', role: 'candidate', content: '我在文心一言项目主要负责应用层开发，包括RAG系统的搭建和Prompt优化。也参与了一些垂直领域模型的微调工作。', timestamp: '2026-01-11 11:02' },
      { id: 'm3', role: 'hr', content: 'RAG系统很热门！您是如何优化检索质量的？', timestamp: '2026-01-11 11:03' },
      { id: 'm4', role: 'candidate', content: '我们用了混合检索策略，结合BM25和向量检索。还做了Query改写和结果重排序，最终将召回准确率提升了25%。', timestamp: '2026-01-11 11:04' }
    ],
    status: 'completed',
    startedAt: '2026-01-11 11:01',
    updatedAt: '2026-01-11 11:04',
    roundsCompleted: 2,
    aiAssessment: 'NLP工程能力强，有大模型应用经验。建议进入面试阶段深入考察。'
  },
  {
    id: 'conv006',
    applicationId: 'app021',
    jobId: 5,
    jobTitle: 'MLOps平台工程师',
    candidateId: 'c016',
    candidateName: '黄小龙',
    messages: [
      { id: 'm1', role: 'hr', content: '黄小龙您好！MLOps是一个新兴领域，能介绍一下您的相关经验吗？', timestamp: '2026-01-05 10:01' },
      { id: 'm2', role: 'candidate', content: '我在华为云ModelArts团队工作，主要负责模型训练平台的开发。熟悉MLflow、Kubeflow等开源框架，也自研了一些模型管理和部署工具。', timestamp: '2026-01-05 10:02' },
      { id: 'm3', role: 'hr', content: '华为云的MLOps平台做得很好！您在模型部署方面有什么经验？', timestamp: '2026-01-05 10:03' },
      { id: 'm4', role: 'candidate', content: '我设计过自动化的模型部署流水线，支持A/B测试和灰度发布。使用Kubernetes做容器编排，TensorFlow Serving和Triton做推理服务。', timestamp: '2026-01-05 10:04' },
      { id: 'm5', role: 'hr', content: '非常专业！您觉得MLOps领域最大的挑战是什么？', timestamp: '2026-01-05 10:05' },
      { id: 'm6', role: 'candidate', content: '我认为是模型监控和持续优化。生产环境的数据漂移、模型性能下降都需要及时发现和处理。这块我们建立了完整的可观测性体系。', timestamp: '2026-01-05 10:06' }
    ],
    status: 'completed',
    startedAt: '2026-01-05 10:01',
    updatedAt: '2026-01-05 10:06',
    roundsCompleted: 3,
    aiAssessment: 'MLOps专家级候选人，华为云背景，工程能力强。已完成面试并入职。'
  },
  {
    id: 'conv007',
    applicationId: 'app023',
    jobId: 7,
    jobTitle: '强化学习研究员',
    candidateId: 'c018',
    candidateName: '孙小林',
    messages: [
      { id: 'm1', role: 'hr', content: '孙博士您好！强化学习是个很有挑战的方向，能介绍一下您的研究吗？', timestamp: '2026-01-08 09:01' },
      { id: 'm2', role: 'candidate', content: '我主要研究游戏AI和机器人决策。在腾讯AI Lab用PPO和A3C训练了多款游戏的AI，也在探索离线强化学习。', timestamp: '2026-01-08 09:02' },
      { id: 'm3', role: 'hr', content: '游戏AI很有趣！您在Sim2Real方面有经验吗？', timestamp: '2026-01-08 09:03' },
      { id: 'm4', role: 'candidate', content: '有一些，我们用域随机化和系统辨识来缩小仿真和现实的差距。在机械臂抓取任务上取得了不错的迁移效果。', timestamp: '2026-01-08 09:04' }
    ],
    status: 'completed',
    startedAt: '2026-01-08 09:01',
    updatedAt: '2026-01-08 09:04',
    roundsCompleted: 2,
    aiAssessment: 'RL专家，有顶级实验室经验。已发offer。'
  },
  {
    id: 'conv008',
    applicationId: 'app024',
    jobId: 11,
    jobTitle: '语音算法工程师',
    candidateId: 'c017',
    candidateName: '赵小雪',
    messages: [
      { id: 'm1', role: 'hr', content: '赵博士您好！科大讯飞的语音技术是业界领先的，能介绍一下您的工作吗？', timestamp: '2026-01-13 10:31' },
      { id: 'm2', role: 'candidate', content: '我在讯飞主要负责语音识别的优化工作，包括端到端模型和流式识别。我们最近在Whisper基础上做了中文适配和加速。', timestamp: '2026-01-13 10:32' },
      { id: 'm3', role: 'hr', content: 'Whisper中文优化是个好方向！TTS方面您有经验吗？', timestamp: '2026-01-13 10:33' },
      { id: 'm4', role: 'candidate', content: '有的，我也研究过VITS和其他神经网络TTS。我们做了一个多说话人的TTS系统，支持风格迁移和情感控制。', timestamp: '2026-01-13 10:34' }
    ],
    status: 'completed',
    startedAt: '2026-01-13 10:31',
    updatedAt: '2026-01-13 10:34',
    roundsCompleted: 2,
    aiAssessment: '语音领域专家，ASR和TTS都有经验。建议安排技术面试。'
  },
  {
    id: 'conv009',
    applicationId: 'app030',
    jobId: 17,
    jobTitle: 'Go后端开发工程师',
    candidateId: 'c012',
    candidateName: '张小华',
    messages: [
      { id: 'm1', role: 'hr', content: '张小华您好！蚂蚁集团的Go开发经验很吸引我们。能介绍一下您负责的系统吗？', timestamp: '2026-01-14 09:01' },
      { id: 'm2', role: 'candidate', content: '我在蚂蚁负责支付核心系统的开发，主要用Go+gRPC。处理的是金融级的高并发场景，对事务一致性要求很高。', timestamp: '2026-01-14 09:02' },
      { id: 'm3', role: 'hr', content: '支付系统确实要求很高！您是如何保证事务一致性的？', timestamp: '2026-01-14 09:03' },
      { id: 'm4', role: 'candidate', content: '我们用了TCC和Saga模式来处理分布式事务，配合自研的一致性中间件。同时有完善的对账系统来兜底。', timestamp: '2026-01-14 09:04' }
    ],
    status: 'completed',
    startedAt: '2026-01-14 09:01',
    updatedAt: '2026-01-14 09:04',
    roundsCompleted: 2,
    aiAssessment: 'Go开发能力强，有金融级系统经验。建议进入面试。'
  },
  {
    id: 'conv010',
    applicationId: 'app032',
    jobId: 18,
    jobTitle: 'iOS开发工程师',
    candidateId: 'c005',
    candidateName: '钱七',
    messages: [
      { id: 'm1', role: 'hr', content: '钱七您好！看到您有丰富的iOS开发经验，能介绍一下您在小米的工作吗？', timestamp: '2026-01-10 11:01' },
      { id: 'm2', role: 'candidate', content: '我在小米负责小米商城iOS端的开发，主要使用Swift和SwiftUI。最近完成了App的架构升级，改为MVVM+Combine的方式。', timestamp: '2026-01-10 11:02' },
      { id: 'm3', role: 'hr', content: 'SwiftUI和Combine是新趋势！您在性能优化方面有什么经验？', timestamp: '2026-01-10 11:03' },
      { id: 'm4', role: 'candidate', content: '我做过启动优化、卡顿治理和内存优化。启动时间从2.5秒优化到1.2秒，也建立了性能监控体系。', timestamp: '2026-01-10 11:04' }
    ],
    status: 'completed',
    startedAt: '2026-01-10 11:01',
    updatedAt: '2026-01-10 11:04',
    roundsCompleted: 2,
    aiAssessment: 'iOS开发能力强，有大型App经验和性能优化能力。已发offer。'
  },
  // 更多对话记录...
  {
    id: 'conv011',
    applicationId: 'app033',
    jobId: 19,
    jobTitle: 'Android开发工程师',
    candidateId: 'c011',
    candidateName: '李小红',
    messages: [
      { id: 'm1', role: 'hr', content: '李小红您好！您在OPPO的Android开发经验很丰富，能介绍一下您的工作吗？', timestamp: '2026-01-13 10:01' },
      { id: 'm2', role: 'candidate', content: '我在OPPO负责系统应用开发，对Android Framework比较熟悉。最近在做Jetpack Compose的迁移工作。', timestamp: '2026-01-13 10:02' }
    ],
    status: 'active',
    startedAt: '2026-01-13 10:01',
    updatedAt: '2026-01-13 10:02',
    roundsCompleted: 1
  },
  {
    id: 'conv012',
    applicationId: 'app036',
    jobId: 22,
    jobTitle: '安全工程师',
    candidateId: 'c013',
    candidateName: '刘小强',
    messages: [
      { id: 'm1', role: 'hr', content: '刘小强您好！安全领域需要很强的技术能力，能介绍一下您的经验吗？', timestamp: '2026-01-12 09:01' },
      { id: 'm2', role: 'candidate', content: '我在奇安信做安全服务和研究，熟悉渗透测试、代码审计和逆向分析。也给多个SRC提交过漏洞。', timestamp: '2026-01-12 09:02' },
      { id: 'm3', role: 'hr', content: 'SRC漏洞提交很能说明能力！您对Web安全和系统安全哪个更擅长？', timestamp: '2026-01-12 09:03' },
      { id: 'm4', role: 'candidate', content: '我两方面都有涉猎，但更擅长Web安全，特别是在SQL注入、XSS、CSRF等方面有深入研究。', timestamp: '2026-01-12 09:04' }
    ],
    status: 'completed',
    startedAt: '2026-01-12 09:01',
    updatedAt: '2026-01-12 09:04',
    roundsCompleted: 2,
    aiAssessment: '安全工程师能力符合要求，建议进入面试。'
  },
  {
    id: 'conv013',
    applicationId: 'app039',
    jobId: 25,
    jobTitle: '自动驾驶感知工程师',
    candidateId: 'c029',
    candidateName: '赵小慧',
    messages: [
      { id: 'm1', role: 'hr', content: '赵小慧您好！自动驾驶是个前沿领域，能介绍一下您在小鹏的工作吗？', timestamp: '2026-01-11 10:01' },
      { id: 'm2', role: 'candidate', content: '我在小鹏XNGP项目负责BEV感知系统的开发，主要做多传感器融合和3D目标检测。', timestamp: '2026-01-11 10:02' },
      { id: 'm3', role: 'hr', content: 'BEV感知是热门方向！您用的是哪种方案？', timestamp: '2026-01-11 10:03' },
      { id: 'm4', role: 'candidate', content: '我们基于BEVFormer做了改进，加入了时序信息和深度估计。在nuScenes上达到了业界领先水平。', timestamp: '2026-01-11 10:04' }
    ],
    status: 'completed',
    startedAt: '2026-01-11 10:01',
    updatedAt: '2026-01-11 10:04',
    roundsCompleted: 2,
    aiAssessment: '自动驾驶感知专家，BEV技术能力强。建议进入面试。'
  },
  {
    id: 'conv014',
    applicationId: 'app041',
    jobId: 26,
    jobTitle: '区块链开发工程师',
    candidateId: 'c020',
    candidateName: '吴小梅',
    messages: [
      { id: 'm1', role: 'hr', content: '吴小梅您好！区块链开发需要很强的底层能力，能介绍一下您的经验吗？', timestamp: '2026-01-09 11:01' },
      { id: 'm2', role: 'candidate', content: '我在趣链和蚂蚁链都工作过，熟悉联盟链底层开发。精通共识算法、智能合约和跨链技术。', timestamp: '2026-01-09 11:02' },
      { id: 'm3', role: 'hr', content: '两家头部区块链公司的经验！您对Web3有了解吗？', timestamp: '2026-01-09 11:03' },
      { id: 'm4', role: 'candidate', content: '有的，我也研究过以太坊生态，熟悉Solidity开发和DeFi协议。可以兼顾联盟链和公链的需求。', timestamp: '2026-01-09 11:04' }
    ],
    status: 'completed',
    startedAt: '2026-01-09 11:01',
    updatedAt: '2026-01-09 11:04',
    roundsCompleted: 2,
    aiAssessment: '区块链开发专家，联盟链和公链都有经验。已发offer。'
  },
  {
    id: 'conv015',
    applicationId: 'app043',
    jobId: 28,
    jobTitle: '量化开发工程师',
    candidateId: 'c030',
    candidateName: '孙小康',
    messages: [
      { id: 'm1', role: 'hr', content: '孙博士您好！量化开发是个高门槛领域，能介绍一下您的背景吗？', timestamp: '2026-01-10 09:31' },
      { id: 'm2', role: 'candidate', content: '我是北大金融数学博士，在幻方和九坤都做过量化研究。主要研究高频策略和机器学习因子。', timestamp: '2026-01-10 09:32' },
      { id: 'm3', role: 'hr', content: '顶级量化私募经验！您在策略开发方面有什么成果？', timestamp: '2026-01-10 09:33' },
      { id: 'm4', role: 'candidate', content: '我开发的高频策略在实盘中夏普比达到3.0以上，年化收益超过50%。也研究了一些基于深度学习的因子挖掘方法。', timestamp: '2026-01-10 09:34' }
    ],
    status: 'completed',
    startedAt: '2026-01-10 09:31',
    updatedAt: '2026-01-10 09:34',
    roundsCompleted: 2,
    aiAssessment: '顶级量化候选人，有实盘验证的策略。建议重点跟进。'
  },
  // 继续添加更多对话...
  {
    id: 'conv016',
    applicationId: 'app017',
    jobId: 4,
    jobTitle: 'AIGC算法专家（Diffusion/生成式AI）',
    candidateId: 'c026',
    candidateName: '陈小平',
    messages: [
      { id: 'm1', role: 'hr', content: '陈小平您好！AIGC是当下最热门的方向，能介绍一下您的经验吗？', timestamp: '2026-01-15 10:31' },
      { id: 'm2', role: 'candidate', content: '我在Midjourney中国团队负责AI绘画算法，熟悉Stable Diffusion、ControlNet等技术。之前在美图也做过图像处理算法。', timestamp: '2026-01-15 10:32' }
    ],
    status: 'active',
    startedAt: '2026-01-15 10:31',
    updatedAt: '2026-01-15 10:32',
    roundsCompleted: 1
  },
  {
    id: 'conv017',
    applicationId: 'app018',
    jobId: 3,
    jobTitle: 'AI Agent架构师',
    candidateId: 'c028',
    candidateName: '黄小英',
    messages: [
      { id: 'm1', role: 'hr', content: '黄小英您好！AI Agent是个很有前景的方向，能介绍一下您的工作吗？', timestamp: '2026-01-17 11:01' },
      { id: 'm2', role: 'candidate', content: '我在月之暗面负责Kimi的Agent功能开发，熟悉LangChain和各种Agent框架。也研究过AutoGPT和MetaGPT。', timestamp: '2026-01-17 11:02' }
    ],
    status: 'active',
    startedAt: '2026-01-17 11:01',
    updatedAt: '2026-01-17 11:02',
    roundsCompleted: 1
  },
  {
    id: 'conv018',
    applicationId: 'app019',
    jobId: 2,
    jobTitle: 'Embodied AI研究员（具身智能）',
    candidateId: 'c018',
    candidateName: '孙小林',
    messages: [
      { id: 'm1', role: 'hr', content: '孙博士您好！具身智能是个前沿方向，能介绍一下您的研究吗？', timestamp: '2026-01-14 15:31' },
      { id: 'm2', role: 'candidate', content: '我的研究方向是强化学习在机器人上的应用。在腾讯AI Lab做过机械臂控制和导航任务，有Sim2Real的经验。', timestamp: '2026-01-14 15:32' }
    ],
    status: 'active',
    startedAt: '2026-01-14 15:31',
    updatedAt: '2026-01-14 15:32',
    roundsCompleted: 1
  },
  {
    id: 'conv019',
    applicationId: 'app025',
    jobId: 12,
    jobTitle: '推荐系统架构师',
    candidateId: 'c023',
    candidateName: '李小刚',
    messages: [
      { id: 'm1', role: 'hr', content: '李小刚您好！推荐系统是个很有技术深度的方向，能介绍一下您的经验吗？', timestamp: '2026-01-15 11:01' },
      { id: 'm2', role: 'candidate', content: '我在快手负责短视频推荐，主要做召回和排序模型的优化。我们的模型服务DAU过亿用户。', timestamp: '2026-01-15 11:02' }
    ],
    status: 'active',
    startedAt: '2026-01-15 11:01',
    updatedAt: '2026-01-15 11:02',
    roundsCompleted: 1
  },
  {
    id: 'conv020',
    applicationId: 'app026',
    jobId: 13,
    jobTitle: '搜索算法工程师',
    candidateId: 'c024',
    candidateName: '张小燕',
    messages: [
      { id: 'm1', role: 'hr', content: '张小燕您好！搜索算法是个基础但很重要的方向，能介绍一下您的工作吗？', timestamp: '2026-01-12 14:01' },
      { id: 'm2', role: 'candidate', content: '我在百度搜索团队做相关性优化，熟悉传统检索和语义搜索。最近在探索大模型在搜索中的应用。', timestamp: '2026-01-12 14:02' },
      { id: 'm3', role: 'hr', content: '大模型+搜索是个热点！您是怎么结合的？', timestamp: '2026-01-12 14:03' },
      { id: 'm4', role: 'candidate', content: '主要是用大模型做Query理解和重写，以及结果的语义排序。也在尝试用大模型生成搜索摘要。', timestamp: '2026-01-12 14:04' }
    ],
    status: 'completed',
    startedAt: '2026-01-12 14:01',
    updatedAt: '2026-01-12 14:04',
    roundsCompleted: 2,
    aiAssessment: '搜索算法专家，有大模型结合经验。建议进入面试。'
  },
  // 更多对话...
  {
    id: 'conv021',
    applicationId: 'app044',
    jobId: 29,
    jobTitle: '多模态算法工程师',
    candidateId: 'c027',
    candidateName: '杨小峰',
    messages: [
      { id: 'm1', role: 'hr', content: '杨小峰您好！多模态大模型是前沿方向，能介绍一下您的研究吗？', timestamp: '2026-01-14 10:01' },
      { id: 'm2', role: 'candidate', content: '我在智谱AI负责GLM多模态版本的研发，熟悉CLIP、BLIP、LLaVA等模型架构。博士期间也发表过相关论文。', timestamp: '2026-01-14 10:02' }
    ],
    status: 'active',
    startedAt: '2026-01-14 10:01',
    updatedAt: '2026-01-14 10:02',
    roundsCompleted: 1
  },
  {
    id: 'conv022',
    applicationId: 'app028',
    jobId: 16,
    jobTitle: 'Java高级开发工程师',
    candidateId: 'c006',
    candidateName: '孙八',
    messages: [
      { id: 'm1', role: 'hr', content: '孙八您好！华为的Java开发经验很有价值，能介绍一下您的工作吗？', timestamp: '2026-01-16 10:01' },
      { id: 'm2', role: 'candidate', content: '我在华为云服务部门做核心系统开发，主要用Java+Spring Boot。负责的系统支撑了数百万企业用户。', timestamp: '2026-01-16 10:02' }
    ],
    status: 'active',
    startedAt: '2026-01-16 10:01',
    updatedAt: '2026-01-16 10:02',
    roundsCompleted: 1
  },
  {
    id: 'conv023',
    applicationId: 'app034',
    jobId: 20,
    jobTitle: 'DevOps工程师',
    candidateId: 'c008',
    candidateName: '吴十',
    messages: [
      { id: 'm1', role: 'hr', content: '吴十您好！阿里云的DevOps经验很吸引我们，能介绍一下您的工作吗？', timestamp: '2026-01-15 15:01' },
      { id: 'm2', role: 'candidate', content: '我在阿里云做云原生平台建设，熟悉Docker、Kubernetes、服务网格等技术。搭建过支撑数万容器的集群。', timestamp: '2026-01-15 15:02' }
    ],
    status: 'active',
    startedAt: '2026-01-15 15:01',
    updatedAt: '2026-01-15 15:02',
    roundsCompleted: 1
  },
  {
    id: 'conv024',
    applicationId: 'app037',
    jobId: 23,
    jobTitle: '测试开发工程师',
    candidateId: 'c015',
    candidateName: '杨小军',
    messages: [
      { id: 'm1', role: 'hr', content: '杨小军您好！测试开发是保证质量的关键，能介绍一下您的经验吗？', timestamp: '2026-01-14 16:01' },
      { id: 'm2', role: 'candidate', content: '我在腾讯负责测试工具平台开发，搭建了自动化测试框架和持续集成流水线。之前在百度也做过App端的自动化测试。', timestamp: '2026-01-14 16:02' }
    ],
    status: 'active',
    startedAt: '2026-01-14 16:01',
    updatedAt: '2026-01-14 16:02',
    roundsCompleted: 1
  },
  {
    id: 'conv025',
    applicationId: 'app042',
    jobId: 27,
    jobTitle: '嵌入式开发工程师',
    candidateId: 'c021',
    candidateName: '郑小伟',
    messages: [
      { id: 'm1', role: 'hr', content: '郑小伟您好！大疆的嵌入式开发经验很有价值，能介绍一下您的工作吗？', timestamp: '2026-01-13 15:31' },
      { id: 'm2', role: 'candidate', content: '我在大疆负责无人机飞控系统开发，精通C/C++和RTOS。也做过电机控制和传感器融合的工作。', timestamp: '2026-01-13 15:32' }
    ],
    status: 'active',
    startedAt: '2026-01-13 15:31',
    updatedAt: '2026-01-13 15:32',
    roundsCompleted: 1
  },
  {
    id: 'conv026',
    applicationId: 'app013',
    jobId: 6,
    jobTitle: '计算机视觉算法工程师',
    candidateId: 'c022',
    candidateName: '王小芳',
    messages: [
      { id: 'm1', role: 'hr', content: '王小芳您好！3D视觉和CV都很相关，能介绍一下您的经验吗？', timestamp: '2026-01-12 09:31' },
      { id: 'm2', role: 'candidate', content: '我在极智嘉做仓储机器人视觉，主要是SLAM和点云处理。之前在图森做过自动驾驶感知，对CV有全面了解。', timestamp: '2026-01-12 09:32' }
    ],
    status: 'active',
    startedAt: '2026-01-12 09:31',
    updatedAt: '2026-01-12 09:32',
    roundsCompleted: 1
  },
  {
    id: 'conv027',
    applicationId: 'app002',
    jobId: 9,
    jobTitle: '高级前端工程师',
    candidateId: 'c011',
    candidateName: '李小红',
    messages: [
      { id: 'm1', role: 'hr', content: '李小红您好！虽然您主要是Android开发，但看到您也有跨平台经验，能介绍一下吗？', timestamp: '2026-01-16 14:21' },
      { id: 'm2', role: 'candidate', content: '是的，我除了Android原生开发，也用Flutter做过跨平台项目。对前端技术有一定了解，正在学习React。', timestamp: '2026-01-16 14:22' }
    ],
    status: 'active',
    startedAt: '2026-01-16 14:21',
    updatedAt: '2026-01-16 14:22',
    roundsCompleted: 1
  },
  {
    id: 'conv028',
    applicationId: 'app008',
    jobId: 1,
    jobTitle: '大模型算法工程师（LLM方向）',
    candidateId: 'c010',
    candidateName: '王小明',
    messages: [
      { id: 'm1', role: 'hr', content: '王小明您好！您的NLP背景很扎实，大模型方面有什么经验吗？', timestamp: '2026-01-16 10:31' },
      { id: 'm2', role: 'candidate', content: '我在百度参与了文心一言的应用开发，主要做RAG和Prompt工程。对大模型的使用和优化有一定经验。', timestamp: '2026-01-16 10:32' }
    ],
    status: 'active',
    startedAt: '2026-01-16 10:31',
    updatedAt: '2026-01-16 10:32',
    roundsCompleted: 1
  },
  {
    id: 'conv029',
    applicationId: 'app047',
    jobId: 3,
    jobTitle: 'AI Agent架构师',
    candidateId: 'c003',
    candidateName: '王五',
    messages: [
      { id: 'm1', role: 'hr', content: '王五博士您好！您的大模型经验很强，对Agent方向有了解吗？', timestamp: '2026-01-16 11:01' },
      { id: 'm2', role: 'candidate', content: '有的，我最近在研究大模型如何与工具调用结合。Agent是大模型落地的重要方向，我很感兴趣。', timestamp: '2026-01-16 11:02' }
    ],
    status: 'active',
    startedAt: '2026-01-16 11:01',
    updatedAt: '2026-01-16 11:02',
    roundsCompleted: 1
  },
  {
    id: 'conv030',
    applicationId: 'app060',
    jobId: 29,
    jobTitle: '多模态算法工程师',
    candidateId: 'c003',
    candidateName: '王五',
    messages: [
      { id: 'm1', role: 'hr', content: '王五博士您好！除了LLM，您对多模态也有研究吗？', timestamp: '2026-01-16 09:01' },
      { id: 'm2', role: 'candidate', content: '是的，多模态是我下一步想深入的方向。我认为视觉-语言模型是通向AGI的关键路径。', timestamp: '2026-01-16 09:02' }
    ],
    status: 'active',
    startedAt: '2026-01-16 09:01',
    updatedAt: '2026-01-16 09:02',
    roundsCompleted: 1
  }
]

// 获取对话统计
export function getConversationStats() {
  return {
    total: mockConversations.length,
    active: mockConversations.filter(c => c.status === 'active').length,
    completed: mockConversations.filter(c => c.status === 'completed').length,
    paused: mockConversations.filter(c => c.status === 'paused').length
  }
}

// 按职位ID获取对话
export function getConversationsByJobId(jobId: number): Conversation[] {
  return mockConversations.filter(c => c.jobId === jobId)
}

// 按候选人ID获取对话
export function getConversationsByCandidateId(candidateId: string): Conversation[] {
  return mockConversations.filter(c => c.candidateId === candidateId)
}

// 按申请ID获取对话
export function getConversationByApplicationId(applicationId: string): Conversation | undefined {
  return mockConversations.find(c => c.applicationId === applicationId)
}

// 获取最近的对话
export function getRecentConversations(limit: number = 10): Conversation[] {
  return [...mockConversations]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

// 获取单个对话
export function getConversationById(id: string): Conversation | undefined {
  return mockConversations.find(c => c.id === id)
}
