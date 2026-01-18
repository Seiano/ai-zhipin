// 职位数据类型定义
export interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  experience: string
  education: string
  type: string
  category: string // 职位类别
  level: string // 职级
  tags: string[]
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  postedDate: string
  isHot?: boolean // 是否热门
  isUrgent?: boolean // 是否紧急
}

// 职位类别
export const jobCategories = [
  // 核心技术方向
  { id: 'llm', name: '大模型/LLM', icon: '🧠', color: 'from-pink-500 to-rose-500' },
  { id: 'aigc', name: 'AIGC/生成式AI', icon: '🎨', color: 'from-fuchsia-500 to-pink-500' },
  { id: 'aiagent', name: 'AI Agent/智能体', icon: '✨', color: 'from-violet-500 to-purple-500' },
  { id: 'multimodal', name: '多模态大模型', icon: '🔮', color: 'from-indigo-500 to-blue-500' },
  { id: 'cv', name: '计算机视觉', icon: '👁️', color: 'from-purple-500 to-pink-500' },
  { id: 'nlp', name: '自然语言处理', icon: '💬', color: 'from-green-500 to-emerald-500' },
  { id: 'ml', name: '机器学习/深度学习', icon: '🤖', color: 'from-blue-500 to-cyan-500' },
  { id: 'recommend', name: '推荐算法/搜索', icon: '🔍', color: 'from-amber-500 to-orange-500' },
  { id: 'robotics', name: '具身智能/机器人', icon: '🦾', color: 'from-cyan-500 to-blue-500' },
  { id: 'autodrive', name: '自动驾驶/智驾', icon: '🚗', color: 'from-sky-500 to-blue-500' },
  { id: 'speech', name: '语音识别/TTS', icon: '🎤', color: 'from-yellow-500 to-orange-500' },
  { id: 'rl', name: '强化学习', icon: '🎮', color: 'from-orange-500 to-red-500' },
  { id: 'kg', name: '知识图谱/图计算', icon: '🕸️', color: 'from-teal-500 to-green-500' },
  // 工程与基建
  { id: 'aiops', name: 'MLOps/AI工程化', icon: '⚙️', color: 'from-indigo-500 to-purple-500' },
  { id: 'data', name: '数据科学/分析', icon: '📊', color: 'from-teal-500 to-cyan-500' },
  { id: 'hardware', name: 'AI芯片/硬件', icon: '💻', color: 'from-slate-500 to-gray-600' },
  { id: 'aisecurity', name: 'AI安全/隐私计算', icon: '🔒', color: 'from-red-500 to-rose-500' },
  // 产品与运营
  { id: 'aiproduct', name: 'AI产品经理', icon: '💼', color: 'from-amber-500 to-yellow-500' },
  { id: 'prompt', name: 'Prompt工程/AI训练', icon: '📝', color: 'from-lime-500 to-green-500' },
  { id: 'aiops_func', name: 'AI运营/增长', icon: '📈', color: 'from-rose-500 to-pink-500' },
  { id: 'aimarket', name: 'AI市场/品牌', icon: '📣', color: 'from-orange-500 to-amber-500' },
  { id: 'aisales', name: 'AI销售/商务', icon: '🤝', color: 'from-emerald-500 to-green-500' },
  // 垂直行业
  { id: 'medical', name: 'AI医疗/生物', icon: '🏥', color: 'from-emerald-500 to-teal-500' },
  { id: 'fintech', name: 'AI金融/风控', icon: '💰', color: 'from-yellow-500 to-amber-500' },
  { id: 'eduai', name: 'AI教育', icon: '📚', color: 'from-blue-500 to-indigo-500' },
  // 管理岗位
  { id: 'aimanager', name: 'AI技术管理', icon: '👔', color: 'from-gray-600 to-slate-700' },
  { id: 'aiexec', name: 'AI高管/VP', icon: '👑', color: 'from-amber-600 to-yellow-600' },
  // HR与人才
  { id: 'aihr', name: 'AI行业HR/招聘', icon: '🧑‍💼', color: 'from-pink-500 to-rose-400' },
]

// 模拟职位数据 - 更专业的AI岗位
export const mockJobs: Job[] = [
  {
    id: 1,
    title: '大模型算法工程师（LLM方向）',
    company: '字节跳动',
    location: '北京',
    salary: '50-100K',
    experience: '3-5年',
    education: '硕士及以上',
    type: '全职',
    category: 'llm',
    level: 'P6-P7',
    tags: ['GPT', 'LLaMA', 'Transformer', 'RLHF', 'PyTorch', 'Distributed Training'],
    description: '负责大语言模型的预训练、微调、对齐等核心技术研发，推动AGI在业务场景的落地应用。',
    requirements: [
      '计算机、AI相关专业硕士及以上学历，博士优先',
      '3年以上大模型或NLP相关经验',
      '深入理解Transformer架构、RLHF、Prompt Engineering',
      '熟悉分布式训练框架（DeepSpeed、Megatron等）',
      '有百亿参数以上模型训练经验者优先',
      '在NeurIPS、ICML、ACL等顶会发表论文者优先'
    ],
    responsibilities: [
      '负责大模型的预训练、SFT、RLHF等技术研发',
      '优化模型性能、降低推理成本',
      '探索多模态大模型技术方向',
      '将大模型技术应用到实际业务场景',
      '跟踪前沿技术，输出技术方案和专利'
    ],
    benefits: ['六险一金', '股票期权', '免费三餐', '顶级GPU资源', '论文奖励', '技术会议支持'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 2,
    title: 'Embodied AI研究员（具身智能）',
    company: '商汤科技',
    location: '上海',
    salary: '60-120K',
    experience: '3-5年',
    education: '博士',
    type: '全职',
    category: 'robotics',
    level: '专家',
    tags: ['Embodied AI', '机器人学习', 'RL', 'Sim2Real', 'Isaac Sim', 'MuJoCo'],
    description: '从事具身智能前沿研究，探索AI在物理世界的感知、决策和执行能力，推动人形机器人和自主系统发展。',
    requirements: [
      '计算机、机器人学、控制论博士学历',
      '在CVPR、ICCV、CoRL、RSS等顶会发表过论文',
      '深入理解强化学习、模仿学习、Sim2Real技术',
      '熟悉机器人仿真环境（Isaac Sim、Habitat、MuJoCo）',
      '有真实机器人系统部署经验者优先',
      '了解VLA（Vision-Language-Action）模型'
    ],
    responsibilities: [
      '研究具身智能核心算法（感知、规划、控制）',
      '构建大规模机器人学习数据集和仿真环境',
      '探索世界模型在具身智能中的应用',
      '将研究成果落地到人形机器人产品',
      '发表高质量学术论文，申请技术专利'
    ],
    benefits: ['七险二金', '科研奖金', '机器人实验室', '论文奖励', '国际会议', '期权激励'],
    postedDate: '2026-01-14',
    isHot: true
  },
  {
    id: 3,
    title: 'AI Agent架构师',
    company: '阿里巴巴',
    location: '杭州',
    salary: '70-140K',
    experience: '5-8年',
    education: '硕士及以上',
    type: '全职',
    category: 'aiagent',
    level: 'P8-P9',
    tags: ['Agent', 'LangChain', 'Function Calling', 'RAG', 'Tool Learning', 'CoT'],
    description: '负责AI Agent系统架构设计，构建具有自主推理、规划和工具使用能力的智能代理系统。',
    requirements: [
      '计算机、AI相关专业硕士及以上学历',
      '5年以上AI系统架构经验',
      '深入理解Agent架构（ReAct、AutoGPT、MetaGPT等）',
      '熟悉RAG、Function Calling、Tool Learning技术',
      '有大规模Agent系统落地经验',
      '精通提示工程（Prompt Engineering）和CoT'
    ],
    responsibilities: [
      '设计并实现企业级AI Agent架构',
      '研发多Agent协作和任务规划系统',
      '优化Agent的推理链和决策质量',
      '构建Agent工具生态和插件系统',
      '指导团队技术方向和难点攻关'
    ],
    benefits: ['六险二金', 'P8+期权', '技术委员会席位', '团队管理', '技术影响力奖'],
    postedDate: '2026-01-13',
    isUrgent: true
  },
  {
    id: 4,
    title: 'AIGC算法专家（Diffusion/生成式AI）',
    company: '华为',
    location: '深圳',
    salary: '55-110K',
    experience: '3-5年',
    education: '博士优先',
    type: '全职',
    category: 'aigc',
    level: '资深专家',
    tags: ['Stable Diffusion', 'ControlNet', 'LoRA', 'GAN', 'VAE', 'Sora'],
    description: '负责AIGC领域前沿技术研发，包括文生图、文生视频、3D生成等方向，打造下一代内容创作平台。',
    requirements: [
      'AI、计算机图形学相关专业博士学历优先',
      '深入理解Diffusion Models、GAN、VAE等生成模型',
      '熟悉Stable Diffusion、ControlNet、IP-Adapter等技术',
      '了解Sora、Pika等视频生成技术原理',
      '在CVPR、ICCV、SIGGRAPH等顶会发表论文者优先',
      '有AIGC产品落地经验'
    ],
    responsibilities: [
      '研发图像、视频、3D生成核心算法',
      '优化生成质量、速度和可控性',
      '探索多模态生成技术（文本、图像、视频融合）',
      '构建AIGC训练数据集和评估体系',
      '将技术应用到实际产品场景'
    ],
    benefits: ['七险二金', '科研基金', '顶级GPU集群', '论文奖励', '专利奖金', '海外访问'],
    postedDate: '2026-01-11',
    isHot: true
  },
  {
    id: 5,
    title: 'MLOps平台架构师',
    company: '腾讯',
    location: '深圳',
    salary: '60-120K',
    experience: '5-8年',
    education: '本科及以上',
    type: '全职',
    category: 'aiops',
    level: 'T3-1/T3-2',
    tags: ['MLOps', 'Kubernetes', 'Kubeflow', 'Ray', 'Model Serving', 'Monitoring'],
    description: '构建企业级机器学习平台，支撑大规模模型训练、部署、监控全生命周期管理。',
    requirements: [
      '计算机相关专业本科及以上学历',
      '5年以上机器学习工程化经验',
      '精通Kubernetes、Docker、微服务架构',
      '熟悉Kubeflow、Ray、MLflow等MLOps工具',
      '有大规模分布式系统设计经验',
      '了解模型优化（量化、剪枝、蒸馏）和推理加速'
    ],
    responsibilities: [
      '设计并实现MLOps平台架构',
      '支持千卡级分布式训练任务调度',
      '构建模型部署、版本管理、A/B测试系统',
      '优化模型推理性能（TensorRT、ONNX）',
      '建设模型监控、数据漂移检测体系'
    ],
    benefits: ['六险一金', '技术专家通道', '云资源配额', '技术分享奖励', '期权激励'],
    postedDate: '2026-01-14',
    isUrgent: true
  },
  {
    id: 6,
    title: '多模态大模型研究员',
    company: '百度',
    location: '北京',
    salary: '65-130K',
    experience: '3-5年',
    education: '博士',
    category: 'llm',
    level: 'T7-T8',
    type: '全职',
    tags: ['多模态', 'Vision-Language', 'CLIP', 'Flamingo', 'Unified Model', 'Cross-Modal'],
    description: '研发统一的多模态大模型，实现图像、文本、音频等多种模态的联合理解和生成。',
    requirements: [
      'AI、计算机视觉或NLP专业博士学历',
      '在多模态方向有深入研究，发表过顶会论文',
      '熟悉CLIP、BLIP、Flamingo、GPT-4V等模型',
      '理解视觉-语言对齐、跨模态检索技术',
      '有大规模多模态数据处理经验',
      '熟悉PyTorch、分布式训练'
    ],
    responsibilities: [
      '研发统一多模态大模型架构',
      '探索视觉-语言-音频的联合预训练',
      '优化跨模态理解和生成能力',
      '将多模态能力集成到文心一言等产品',
      '发表高水平学术论文'
    ],
    benefits: ['七险二金', '百万级科研经费', 'A100集群', '顶会差旅', '论文奖励', '期权'],
    postedDate: '2026-01-09',
    isHot: true
  },
  // 更多算法岗位
  {
    id: 7,
    title: '强化学习算法专家（RL/RLHF）',
    company: 'OpenAI中国',
    location: '上海',
    salary: '80-160K',
    experience: '5-8年',
    education: '博士',
    category: 'rl',
    level: 'Staff/Principal',
    type: '全职',
    tags: ['PPO', 'DPO', 'RLHF', 'Multi-Agent', 'Offline RL', 'Reward Modeling'],
    description: '负责RLHF核心算法研发，提升大模型对齐能力，探索强化学习在AGI中的应用。',
    requirements: [
      '计算机、控制论、运筹学博士学历',
      '深入理解PPO、DPO、RLHF等算法原理',
      '在NeurIPS、ICML、ICLR等顶会发表过RL论文',
      '有大模型RLHF实践经验',
      '熟悉Reward Modeling、Constitutional AI',
      '了解Multi-Agent、Game Theory者优先'
    ],
    responsibilities: [
      '研发RLHF核心算法，提升模型对齐效果',
      '优化Reward Model的泛化能力',
      '探索Self-Play、Constitutional AI等技术',
      '将RL应用到Agent、Robotics等场景',
      '输出顶级论文和技术专利'
    ],
    benefits: ['顶级薪酬', 'RSU股权', '无限GPU资源', '自由研究方向', '顶会一作机会'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  // 数据领域岗位
  {
    id: 8,
    title: '数据科学家（因果推断方向）',
    company: '京东',
    location: '北京',
    salary: '45-90K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'data',
    level: '高级/资深',
    type: '全职',
    tags: ['因果推断', 'A/B测试', 'Uplift Model', 'DML', 'Causal Forest', '实验设计'],
    description: '运用因果推断方法解决业务问题，设计科学实验评估策略效果。',
    requirements: [
      '统计学、数学、经济学、计算机硕士及以上学历',
      '3年以上因果推断或实验设计经验',
      '精通A/B测试、DID、PSM、IV等方法',
      '熟悉Uplift Modeling、Causal ML',
      '有电商/广告/推荐场景因果分析经验',
      '精通Python、R，熟悉EconML、DoWhy等工具'
    ],
    responsibilities: [
      '构建因果推断框架，评估业务策略效果',
      '设计并执行大规模A/B测试',
      '开发Uplift Model提升营销ROI',
      '建立实验平台和因果分析工具',
      '支持决策层进行数据驱动决策'
    ],
    benefits: ['六险一金', '年终奖', '实验平台', '学术会议', '内部培训'],
    postedDate: '2026-01-12',
    isHot: true
  },
  {
    id: 9,
    title: '大数据平台架构师',
    company: '字节跳动',
    location: '北京',
    salary: '60-120K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'data',
    level: 'P7-P8',
    type: '全职',
    tags: ['Flink', 'Spark', 'ClickHouse', 'Kafka', '实时数仓', '湖仓一体'],
    description: '构建支撑亿级用户的大数据处理平台，提供实时和离线数据能力。',
    requirements: [
      '计算机相关专业本科及以上学历',
      '5年以上大数据平台架构经验',
      '精通Flink、Spark、Hadoop生态',
      '熟悉ClickHouse、Doris等OLAP引擎',
      '有PB级数据处理和实时数仓经验',
      '了解湖仓一体、数据湖（Iceberg/Hudi）'
    ],
    responsibilities: [
      '设计大数据平台整体架构',
      '构建实时/离线数据处理链路',
      '优化数据存储和查询性能',
      '建设数据治理和质量体系',
      '支撑AI训练的大规模数据处理'
    ],
    benefits: ['六险一金', '股票期权', '数据中心', '技术大会', '团队建设'],
    postedDate: '2026-01-13',
    isUrgent: true
  },
  {
    id: 10,
    title: '数据标注平台负责人',
    company: '商汤科技',
    location: '上海',
    salary: '50-100K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'data',
    level: '资深',
    type: '全职',
    tags: ['数据标注', '主动学习', '质量控制', 'RLHF数据', '众包平台', '标注工具'],
    description: '负责AI数据标注平台和团队，支撑大模型和CV项目的数据需求。',
    requirements: [
      '计算机或相关专业本科及以上学历',
      '5年以上数据标注或数据平台经验',
      '熟悉CV、NLP、RLHF等不同任务的标注需求',
      '了解主动学习、弱监督学习',
      '有大规模标注团队管理经验（100+人）',
      '熟悉Label Studio、CVAT等标注工具'
    ],
    responsibilities: [
      '规划数据标注平台和工具体系',
      '管理标注团队，保证数据质量',
      '建立标注规范和质检体系',
      '探索主动学习降低标注成本',
      '支撑大模型RLHF数据生产'
    ],
    benefits: ['六险一金', '期权激励', '标注平台', '团队管理奖', '职业发展'],
    postedDate: '2026-01-10'
  },
  {
    id: 11,
    title: '特征工程专家',
    company: '蚂蚁集团',
    location: '杭州',
    salary: '50-100K',
    experience: '5-8年',
    education: '硕士及以上',
    category: 'data',
    level: '专家',
    type: '全职',
    tags: ['特征工程', 'Feature Store', 'AutoML', '特征选择', '时序特征', '风控'],
    description: '构建企业级特征平台，提升AI模型效果和开发效率。',
    requirements: [
      '计算机、统计学硕士及以上学历',
      '5年以上特征工程和ML平台经验',
      '精通特征提取、选择、编码技术',
      '熟悉Feature Store架构（Feast、Tecton）',
      '有金融风控或推荐系统特征经验',
      '了解AutoFE、时序特征工程'
    ],
    responsibilities: [
      '设计企业级Feature Store',
      '建设特征计算和服务平台',
      '开发AutoML特征工程能力',
      '优化实时特征计算性能',
      '支撑风控、反欺诈等业务'
    ],
    benefits: ['七险二金', '期权', '技术委员会', '论文发表', '内部创新'],
    postedDate: '2026-01-11'
  },
  // AI硬件岗位
  {
    id: 12,
    title: 'AI芯片架构师',
    company: '华为海思',
    location: '深圳',
    salary: '70-150K',
    experience: '8-10年',
    education: '硕士及以上',
    category: 'hardware',
    level: '首席架构师',
    type: '全职',
    tags: ['芯片设计', 'NPU', 'Tensor Core', '互连架构', '存储层次', 'RISC-V'],
    description: '负责AI芯片架构设计，打造下一代高性能AI处理器。',
    requirements: [
      '计算机体系结构、微电子硕士及以上学历',
      '8年以上芯片架构设计经验',
      '精通AI加速器架构（TPU、NPU、GPU）',
      '熟悉Tensor运算单元、片上互连设计',
      '了解Transformer、CNN等模型的硬件需求',
      '有流片经验，熟悉芯片验证流程'
    ],
    responsibilities: [
      '设计AI芯片微架构',
      '优化算力、带宽、功耗平衡',
      '定义指令集和编程模型',
      '与软件团队协同优化',
      '推动芯片从设计到量产'
    ],
    benefits: ['七险二金', '股权激励', '流片奖金', 'Tape-out奖励', '技术专家通道'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 13,
    title: 'GPU编译器开发工程师',
    company: '壁仞科技',
    location: '上海',
    salary: '50-100K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'hardware',
    level: '高级',
    type: '全职',
    tags: ['LLVM', 'MLIR', 'TVM', '编译优化', '代码生成', 'IR设计'],
    description: '开发AI编译器，自动优化模型在GPU上的执行效率。',
    requirements: [
      '计算机相关专业硕士及以上学历',
      '3年以上编译器开发经验',
      '精通LLVM、MLIR编译器框架',
      '熟悉TVM、XLA等AI编译器',
      '了解GPU架构和CUDA编程',
      '有算子融合、内存优化经验'
    ],
    responsibilities: [
      '开发AI模型编译器后端',
      '实现算子融合和优化Pass',
      '生成高性能GPU代码',
      '优化编译时间和运行性能',
      '支持新算子和模型架构'
    ],
    benefits: ['六险一金', 'GPU期权', '技术论坛', 'LLVM社区', '创新奖励'],
    postedDate: '2026-01-12'
  },
  {
    id: 14,
    title: 'CUDA性能优化专家',
    company: '百度',
    location: '北京',
    salary: '45-90K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'hardware',
    level: '资深',
    type: '全职',
    tags: ['CUDA', 'Tensor Core', '内核优化', 'CUTLASS', 'FlashAttention', '性能分析'],
    description: '优化深度学习算子在GPU上的性能，压榨硬件极限。',
    requirements: [
      '计算机相关专业本科及以上学历',
      '5年以上CUDA开发和优化经验',
      '精通GPU架构和并行计算原理',
      '熟悉CUTLASS、cuBLAS、cuDNN',
      '了解FlashAttention、PagedAttention优化',
      '有Transformer、Diffusion算子优化经验'
    ],
    responsibilities: [
      '优化关键算子性能（GEMM、Attention）',
      '开发高性能CUDA kernel',
      '利用Tensor Core加速计算',
      '优化显存带宽和利用率',
      '支撑大模型训练和推理'
    ],
    benefits: ['六险一金', 'A100/H100集群', '性能优化奖', '技术分享', '论文支持'],
    postedDate: '2026-01-13',
    isHot: true
  },
  {
    id: 15,
    title: 'FPGA加速工程师',
    company: '阿里云',
    location: '杭州',
    salary: '40-80K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'hardware',
    level: '高级',
    type: '全职',
    tags: ['FPGA', 'Verilog', 'HLS', '硬件加速', 'PCIe', '推理优化'],
    description: '使用FPGA实现AI模型硬件加速，提供低延迟推理服务。',
    requirements: [
      '电子工程、计算机相关专业本科及以上学历',
      '3年以上FPGA开发经验',
      '精通Verilog/VHDL、HLS（Vivado/Vitis）',
      '熟悉Xilinx/Intel FPGA',
      '了解CNN、Transformer硬件实现',
      '有PCIe、网络传输优化经验'
    ],
    responsibilities: [
      '设计AI推理加速器IP',
      '优化数据流和计算流水线',
      '实现模型量化和压缩',
      '集成FPGA到云平台',
      '提供低延迟推理服务'
    ],
    benefits: ['六险一金', 'FPGA开发板', '阿里云资源', '技术培训', '专利奖励'],
    postedDate: '2026-01-10'
  },
  {
    id: 16,
    title: 'AI芯片验证工程师',
    company: '寒武纪',
    location: '北京',
    salary: '35-70K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'hardware',
    level: '高级',
    type: '全职',
    tags: ['芯片验证', 'SystemVerilog', 'UVM', '覆盖率', '形式验证', 'Emulation'],
    description: '负责AI芯片功能验证，确保芯片设计正确性和质量。',
    requirements: [
      '微电子、计算机相关专业本科及以上学历',
      '3年以上芯片验证经验',
      '精通SystemVerilog、UVM方法学',
      '熟悉验证流程和覆盖率分析',
      '了解AI算子和模型执行',
      '有SOC验证或形式验证经验优先'
    ],
    responsibilities: [
      '制定AI芯片验证方案',
      '开发验证环境和测试用例',
      '执行功能验证和回归测试',
      '分析覆盖率，闭合验证',
      '支持芯片流片前验证'
    ],
    benefits: ['六险一金', '流片奖金', '验证平台', 'EDA工具', '职业发展'],
    postedDate: '2026-01-11'
  },
  {
    id: 17,
    title: '边缘AI硬件工程师',
    company: '地平线',
    location: '北京',
    salary: '40-80K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'hardware',
    level: '高级',
    type: '全职',
    tags: ['边缘计算', 'ARM', '模型部署', '功耗优化', 'INT8', '嵌入式'],
    description: '将AI模型部署到边缘设备，优化功耗和性能。',
    requirements: [
      '计算机、电子工程相关专业本科及以上学历',
      '3年以上嵌入式或边缘AI经验',
      '熟悉ARM架构、NEON指令',
      '了解模型量化、剪枝、蒸馏',
      '有ONNX Runtime、TFLite、NCNN部署经验',
      '熟悉Linux、实时系统'
    ],
    responsibilities: [
      '优化模型在边缘设备的推理性能',
      '实现INT8/FP16量化部署',
      '降低功耗和延迟',
      '适配车载、IoT等场景',
      '构建边缘AI开发工具链'
    ],
    benefits: ['六险一金', '期权', '车载测试', '开发板', '行业大会'],
    postedDate: '2026-01-14'
  },
  // 计算机视觉专属岗位
  {
    id: 18,
    title: '计算机视觉算法工程师（目标检测）',
    company: '旷视科技',
    location: '北京',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'cv',
    level: '高级工程师',
    type: '全职',
    tags: ['YOLO', 'Faster R-CNN', 'RetinaNet', '目标检测', 'Anchor-Free', 'NMS'],
    description: '负责目标检测算法研发，应用于智慧城市、安防等场景。',
    requirements: [
      '计算机视觉、模式识别相关专业硕士学历',
      '3年以上目标检测算法经验',
      '精通YOLO系列、RCNN系列算法',
      '熟悉Anchor-Free、Transformer检测器',
      '有实际项目落地经验',
      '熟悉TensorRT、ONNX模型优化'
    ],
    responsibilities: [
      '研发目标检测核心算法',
      '优化检测精度和速度',
      '适配不同业务场景需求',
      '模型压缩和部署优化',
      '输出技术文档和专利'
    ],
    benefits: ['六险一金', '期权', '技术津贴', 'GPU资源', '论文支持'],
    postedDate: '2026-01-14',
    isHot: true
  },
  {
    id: 19,
    title: '3D视觉算法专家',
    company: 'Momenta',
    location: '苏州',
    salary: '50-100K',
    experience: '5-8年',
    education: '博士优先',
    category: 'cv',
    level: '专家',
    type: '全职',
    tags: ['3D重建', 'NeRF', 'SLAM', 'SfM', 'MVS', 'Point Cloud'],
    description: '研发3D视觉技术，应用于自动驾驶感知系统。',
    requirements: [
      '计算机视觉博士学历优先',
      '深入理解3D重建、SLAM、NeRF',
      '熟悉多视角几何、点云处理',
      '在CVPR、ICCV发表过3D视觉论文',
      '有自动驾驶或机器人经验优先',
      '精通C++、CUDA编程'
    ],
    responsibilities: [
      '研发3D感知和重建算法',
      '优化SLAM和建图精度',
      '探索NeRF在自动驾驶中的应用',
      '多传感器融合定位',
      '发表顶会论文'
    ],
    benefits: ['七险二金', '期权', '自动驾驶测试车', '顶会支持', '科研基金'],
    postedDate: '2026-01-13',
    isHot: true
  },
  {
    id: 20,
    title: 'OCR算法工程师',
    company: '合合信息',
    location: '上海',
    salary: '35-70K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'cv',
    level: '高级',
    type: '全职',
    tags: ['OCR', '文本检测', '文本识别', 'CRNN', 'Transformer OCR', '版面分析'],
    description: '研发OCR核心算法，支撑智能文档处理业务。',
    requirements: [
      '计算机相关专业本科及以上',
      '3年以上OCR或文本识别经验',
      '熟悉CTPN、EAST、DB等文本检测算法',
      '了解CRNN、Attention OCR、TrOCR',
      '有版面分析、表格识别经验',
      '熟悉PaddleOCR、mmocr等框架'
    ],
    responsibilities: [
      '优化文本检测和识别精度',
      '研发端到端OCR系统',
      '支持多语言、手写体识别',
      '版面分析和表格还原',
      '模型压缩和移动端部署'
    ],
    benefits: ['六险一金', '餐补', '交通补贴', '年度体检', '技术培训'],
    postedDate: '2026-01-12'
  },
  // 自然语言处理专属岗位
  {
    id: 21,
    title: 'NLP算法工程师（文本分类/情感分析）',
    company: '快手',
    location: '北京',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'nlp',
    level: '高级',
    type: '全职',
    tags: ['BERT', 'RoBERTa', '文本分类', '情感分析', '意图识别', 'Few-Shot'],
    description: '负责内容理解和分类算法，提升推荐和审核效果。',
    requirements: [
      'NLP、计算机相关专业硕士学历',
      '3年以上文本分类或情感分析经验',
      '精通BERT、RoBERTa等预训练模型',
      '熟悉Few-Shot Learning、Prompt Tuning',
      '有大规模文本分类项目经验',
      '熟悉Transformers、PyTorch'
    ],
    responsibilities: [
      '研发文本分类和情感分析算法',
      '优化内容理解和标签体系',
      '支撑推荐和内容审核',
      '探索大模型在分类任务的应用',
      '提升模型效率和准确率'
    ],
    benefits: ['六险一金', '期权', '免费三餐', '健身房', '团建'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 22,
    title: '命名实体识别(NER)算法专家',
    company: '阿里达摩院',
    location: '杭州',
    salary: '50-100K',
    experience: '5-8年',
    education: '博士优先',
    category: 'nlp',
    level: '专家',
    type: '全职',
    tags: ['NER', '实体链接', '知识图谱', 'Span抽取', 'BiLSTM-CRF', 'UIE'],
    description: '研发实体识别和知识抽取算法，构建行业知识图谱。',
    requirements: [
      'NLP或AI相关专业博士优先',
      '深入理解NER、实体链接技术',
      '熟悉CRF、Span-based、UIE等方法',
      '有知识图谱构建经验',
      '在ACL、EMNLP等发表过论文',
      '熟悉远程监督、少样本学习'
    ],
    responsibilities: [
      '研发命名实体识别核心算法',
      '构建电商领域知识图谱',
      '优化实体链接和消歧',
      '探索大模型信息抽取',
      '输出高质量论文和专利'
    ],
    benefits: ['七险二金', 'P8+期权', '科研经费', '顶会支持', '导师制'],
    postedDate: '2026-01-13',
    isHot: true
  },
  {
    id: 23,
    title: '机器翻译算法工程师',
    company: '网易有道',
    location: '北京',
    salary: '45-90K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'nlp',
    level: '资深',
    type: '全职',
    tags: ['神经机器翻译', 'Transformer', '多语言', 'Back-Translation', 'BLEU', '低资源语言'],
    description: '研发神经机器翻译技术，支撑有道翻译产品。',
    requirements: [
      'NLP、计算机语言学硕士学历',
      '3年以上机器翻译经验',
      '深入理解Transformer、LSTM翻译模型',
      '熟悉多语言翻译、低资源语言',
      '了解Back-Translation、Knowledge Distillation',
      '熟悉fairseq、OpenNMT等框架'
    ],
    responsibilities: [
      '优化神经机器翻译模型',
      '支持多语言翻译（100+语言对）',
      '研发专业领域翻译',
      '提升翻译流畅度和准确性',
      '探索大模型翻译能力'
    ],
    benefits: ['六险一金', '期权', '翻译产品', '学术会议', '内部培训'],
    postedDate: '2026-01-11'
  },
  // 新增职位 - 大模型方向
  {
    id: 24,
    title: 'Prompt工程师',
    company: 'Moonshot AI',
    location: '北京',
    salary: '35-70K',
    experience: '1-3年',
    education: '本科及以上',
    category: 'llm',
    level: '中级',
    type: '全职',
    tags: ['Prompt Engineering', 'CoT', 'Few-Shot', 'LLM', '提示词优化', '应用开发'],
    description: '负责大模型提示词工程，优化模型输出效果，支撑产品落地。',
    requirements: [
      '计算机或相关专业本科及以上',
      '1年以上LLM应用开发经验',
      '熟悉Prompt Engineering技巧（CoT、Few-Shot等）',
      '了解GPT、Claude、Kimi等大模型API',
      '有较强的文本理解和逻辑思维能力',
      '熟悉Python编程'
    ],
    responsibilities: [
      '设计和优化Prompt模板',
      '构建Prompt评测体系',
      '支撑产品功能的LLM集成',
      '输出Prompt最佳实践文档',
      '探索提升输出质量的技术手段'
    ],
    benefits: ['六险一金', '期权', 'Kimi Pro会员', 'AI工具补贴', '弹性工作'],
    postedDate: '2026-01-16',
    isHot: true
  },
  {
    id: 25,
    title: '大模型推理优化工程师',
    company: '智谱AI',
    location: '北京',
    salary: '50-100K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'llm',
    level: '高级',
    type: '全职',
    tags: ['模型推理', 'vLLM', 'TensorRT-LLM', 'KV Cache', 'PagedAttention', '量化'],
    description: '负责大模型推理性能优化，降低推理成本，提升服务吞吐量。',
    requirements: [
      '计算机相关专业硕士学历',
      '3年以上深度学习推理优化经验',
      '精通vLLM、TensorRT-LLM等推理框架',
      '熟悉KV Cache、PagedAttention优化',
      '了解模型量化（GPTQ、AWQ、SmoothQuant）',
      '有大规模LLM服务部署经验'
    ],
    responsibilities: [
      '优化大模型推理延迟和吞吐',
      '实现高效的Batch调度策略',
      '部署和优化模型量化方案',
      '构建LLM推理服务架构',
      '降低推理成本，提升GPU利用率'
    ],
    benefits: ['六险一金', '期权', 'H100集群', '技术分享奖', '论文支持'],
    postedDate: '2026-01-15',
    isUrgent: true
  },
  {
    id: 26,
    title: 'RAG系统工程师',
    company: '零一万物',
    location: '北京',
    salary: '40-80K',
    experience: '2-4年',
    education: '本科及以上',
    category: 'llm',
    level: '高级',
    type: '全职',
    tags: ['RAG', 'Vector DB', 'LangChain', 'Embedding', 'Retrieval', '知识库'],
    description: '构建企业级RAG系统，提升大模型知识问答能力。',
    requirements: [
      '计算机相关专业本科及以上',
      '2年以上RAG或搜索系统经验',
      '熟悉向量数据库（Milvus、Pinecone、Weaviate）',
      '了解Embedding模型和检索优化',
      '熟悉LangChain、LlamaIndex等框架',
      '有企业知识库搭建经验优先'
    ],
    responsibilities: [
      '设计和实现RAG系统架构',
      '优化检索召回率和精度',
      '构建文档解析和向量化流水线',
      '支撑企业知识问答产品',
      '持续优化RAG效果和性能'
    ],
    benefits: ['六险一金', '期权', 'Yi API额度', '技术培训', '零食下午茶'],
    postedDate: '2026-01-14',
    isHot: true
  },
  // 新增职位 - 计算机视觉方向
  {
    id: 27,
    title: '图像分割算法工程师',
    company: '海康威视',
    location: '杭州',
    salary: '35-70K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'cv',
    level: '高级',
    type: '全职',
    tags: ['语义分割', 'SAM', 'Mask2Former', 'U-Net', '实例分割', '全景分割'],
    description: '研发图像分割算法，应用于安防监控和智能交通。',
    requirements: [
      '计算机视觉相关专业硕士学历',
      '3年以上图像分割算法经验',
      '精通U-Net、DeepLab、Mask2Former等模型',
      '熟悉SAM及其微调方法',
      '有实时分割部署经验',
      '熟悉OpenCV、PyTorch'
    ],
    responsibilities: [
      '研发语义/实例/全景分割算法',
      '优化分割精度和推理速度',
      '适配安防和交通业务场景',
      '模型压缩和边缘部署',
      '输出技术专利'
    ],
    benefits: ['六险一金', '年终奖', '住房补贴', '班车', '食堂'],
    postedDate: '2026-01-13'
  },
  {
    id: 28,
    title: '人脸识别算法专家',
    company: '商汤科技',
    location: '深圳',
    salary: '45-90K',
    experience: '5-8年',
    education: '硕士及以上',
    category: 'cv',
    level: '专家',
    type: '全职',
    tags: ['人脸识别', 'ArcFace', '活体检测', '人脸属性', '1:N检索', '人脸质量'],
    description: '负责人脸识别技术研发，支撑身份认证和安防产品。',
    requirements: [
      '计算机视觉硕士及以上学历',
      '5年以上人脸识别算法经验',
      '精通ArcFace、CosFace等损失函数',
      '熟悉活体检测、人脸属性分析',
      '有亿级人脸库检索经验',
      '在FG/CVPR发表过论文者优先'
    ],
    responsibilities: [
      '研发人脸识别核心算法',
      '优化在各种光照、角度下的识别率',
      '研发活体检测和防攻击技术',
      '构建人脸识别评测体系',
      '支撑金融、安防产品'
    ],
    benefits: ['七险二金', '期权', 'GPU集群', '论文奖励', '国际会议'],
    postedDate: '2026-01-12',
    isHot: true
  },
  {
    id: 29,
    title: '视频理解算法工程师',
    company: '快手',
    location: '北京',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'cv',
    level: '高级',
    type: '全职',
    tags: ['视频分类', 'VideoMAE', 'Action Recognition', '时序建模', '多模态视频', 'Video-LLM'],
    description: '研发视频理解算法，支撑短视频推荐和内容审核。',
    requirements: [
      '计算机视觉相关专业硕士学历',
      '3年以上视频理解算法经验',
      '熟悉VideoMAE、TimeSformer等模型',
      '了解动作识别、视频分类技术',
      '有多模态视频理解经验',
      '熟悉大规模视频处理'
    ],
    responsibilities: [
      '研发视频理解和分类算法',
      '优化视频内容审核效果',
      '探索Video-LLM技术',
      '支撑短视频推荐业务',
      '提升视频标签体系'
    ],
    benefits: ['六险一金', '期权', '免费三餐', '健身房', '下午茶'],
    postedDate: '2026-01-15',
    isUrgent: true
  },
  // 新增职位 - 语音方向
  {
    id: 30,
    title: '语音识别(ASR)算法工程师',
    company: '科大讯飞',
    location: '合肥',
    salary: '35-70K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'speech',
    level: '高级',
    type: '全职',
    tags: ['ASR', 'Whisper', 'Conformer', 'CTC', 'RNN-T', '端到端语音'],
    description: '研发语音识别核心算法，提升识别准确率。',
    requirements: [
      '语音信号处理或AI相关专业硕士学历',
      '3年以上ASR算法开发经验',
      '精通Conformer、Transformer ASR模型',
      '熟悉CTC、RNN-T、Attention解码',
      '了解Whisper、Paraformer等开源模型',
      '熟悉Kaldi、ESPnet、WeNet等框架'
    ],
    responsibilities: [
      '研发语音识别核心算法',
      '优化在噪声环境下的识别率',
      '支持多语言、多方言识别',
      '模型压缩和实时部署',
      '输出技术专利和论文'
    ],
    benefits: ['六险一金', '住房补贴', '讯飞产品', '学术会议', '培训'],
    postedDate: '2026-01-14',
    isHot: true
  },
  {
    id: 31,
    title: '语音合成(TTS)研究员',
    company: '字节跳动',
    location: '北京',
    salary: '50-100K',
    experience: '3-5年',
    education: '博士优先',
    category: 'speech',
    level: '资深',
    type: '全职',
    tags: ['TTS', 'VITS', 'NaturalSpeech', 'Zero-Shot TTS', '情感合成', '声音克隆'],
    description: '研发前沿语音合成技术，支撑抖音和剪映产品。',
    requirements: [
      '语音合成或AI专业博士优先',
      '深入理解VITS、NaturalSpeech等模型',
      '熟悉Zero-Shot TTS、声音克隆技术',
      '在ICASSP、Interspeech发表过论文',
      '有情感合成、风格迁移经验',
      '熟悉声学特征和声码器'
    ],
    responsibilities: [
      '研发高自然度语音合成算法',
      '探索Zero-Shot声音克隆',
      '优化合成语音的韵律和情感',
      '支撑配音、有声书等产品',
      '发表顶级论文'
    ],
    benefits: ['六险一金', '期权', '免费三餐', '论文奖励', '顶会差旅'],
    postedDate: '2026-01-13',
    isHot: true
  },
  // 新增职位 - AI Agent方向
  {
    id: 32,
    title: 'AI Agent开发工程师',
    company: '面壁智能',
    location: '北京',
    salary: '35-70K',
    experience: '1-3年',
    education: '本科及以上',
    category: 'aiagent',
    level: '中高级',
    type: '全职',
    tags: ['Agent', 'LangChain', 'Tool Use', 'Function Calling', 'ReAct', '工作流'],
    description: '开发AI Agent应用，实现智能助手和自动化工作流。',
    requirements: [
      '计算机相关专业本科及以上',
      '1年以上LLM应用开发经验',
      '熟悉LangChain、AutoGPT等Agent框架',
      '了解Function Calling、Tool Use',
      '有API集成和工作流开发经验',
      '熟悉Python、FastAPI'
    ],
    responsibilities: [
      '开发AI Agent核心功能',
      '集成外部工具和API',
      '构建Agent任务规划能力',
      '优化Agent的稳定性和准确性',
      '支撑智能助手产品'
    ],
    benefits: ['六险一金', '期权', 'ChatGLM API', '弹性工作', '技术书籍'],
    postedDate: '2026-01-16',
    isHot: true
  },
  {
    id: 33,
    title: '多Agent系统研究员',
    company: '清华智能产业研究院',
    location: '北京',
    salary: '45-90K',
    experience: '3-5年',
    education: '博士',
    category: 'aiagent',
    level: '研究员',
    type: '全职',
    tags: ['Multi-Agent', 'Agent协作', '博弈论', 'MARL', 'MetaGPT', '社会模拟'],
    description: '研究多Agent协作与竞争机制，探索集体智能涌现。',
    requirements: [
      '计算机或AI相关专业博士学历',
      '深入理解Multi-Agent系统',
      '熟悉MARL、博弈论基础',
      '了解MetaGPT、CAMEL等多Agent框架',
      '在顶会发表过Agent相关论文',
      '有社会模拟或复杂系统背景优先'
    ],
    responsibilities: [
      '研究多Agent协作机制',
      '探索Agent之间的通信协议',
      '构建大规模Agent模拟环境',
      '研究集体智能和涌现行为',
      '发表高质量论文'
    ],
    benefits: ['七险二金', '科研经费', '学术自由', '访问学者机会', '顶会支持'],
    postedDate: '2026-01-12'
  },
  // 新增职位 - AIGC方向
  {
    id: 34,
    title: '文生图算法工程师',
    company: '美图',
    location: '厦门',
    salary: '35-70K',
    experience: '2-4年',
    education: '硕士及以上',
    category: 'aigc',
    level: '高级',
    type: '全职',
    tags: ['Stable Diffusion', 'SDXL', 'ControlNet', 'IP-Adapter', 'LoRA', '图像生成'],
    description: '研发文生图算法，支撑美图AI绘画产品。',
    requirements: [
      '计算机视觉相关专业硕士学历',
      '2年以上图像生成算法经验',
      '精通Stable Diffusion、SDXL',
      '熟悉ControlNet、IP-Adapter等控制技术',
      '了解LoRA微调和风格迁移',
      '有产品落地经验优先'
    ],
    responsibilities: [
      '研发文生图核心算法',
      '优化生成质量和可控性',
      '开发特色风格和IP',
      '模型优化和移动端部署',
      '支撑美图秀秀AI功能'
    ],
    benefits: ['六险一金', '美图会员', 'GPU资源', '下午茶', '健身房'],
    postedDate: '2026-01-15'
  },
  {
    id: 35,
    title: '视频生成算法专家',
    company: '快手',
    location: '北京',
    salary: '55-110K',
    experience: '3-5年',
    education: '博士优先',
    category: 'aigc',
    level: '专家',
    type: '全职',
    tags: ['视频生成', 'Sora', 'SVD', 'DiT', 'Video Diffusion', '运动控制'],
    description: '研发视频生成前沿技术，打造下一代内容创作工具。',
    requirements: [
      '计算机视觉或AI专业博士优先',
      '深入理解视频Diffusion模型',
      '熟悉SVD、AnimateDiff、Sora原理',
      '了解DiT、3D UNet等架构',
      '在CVPR、ICCV发表过相关论文',
      '有大规模视频生成训练经验'
    ],
    responsibilities: [
      '研发视频生成核心算法',
      '优化视频一致性和运动自然度',
      '探索长视频和可控生成',
      '构建视频生成训练管线',
      '发表顶级论文'
    ],
    benefits: ['六险一金', '期权', 'H100集群', '论文奖励', '顶会差旅'],
    postedDate: '2026-01-14',
    isHot: true,
    isUrgent: true
  },
  {
    id: 36,
    title: '3D生成算法工程师',
    company: '网易伏羲',
    location: '广州',
    salary: '45-90K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'aigc',
    level: '高级',
    type: '全职',
    tags: ['3D生成', 'NeRF', '3D Gaussian', 'Text-to-3D', '数字人', 'PBR材质'],
    description: '研发3D内容生成技术，支撑游戏和数字人业务。',
    requirements: [
      '计算机图形学或视觉相关专业硕士学历',
      '3年以上3D视觉或生成算法经验',
      '熟悉NeRF、3D Gaussian Splatting',
      '了解Text-to-3D（DreamFusion等）',
      '有数字人或游戏资产生成经验',
      '熟悉Blender、Unity或UE'
    ],
    responsibilities: [
      '研发3D内容生成算法',
      '优化3D重建质量和速度',
      '探索文本到3D生成',
      '支撑数字人和游戏资产生成',
      '与艺术团队协作'
    ],
    benefits: ['六险一金', '游戏内购', '网易云音乐会员', '食堂', '班车'],
    postedDate: '2026-01-13'
  },
  // 新增职位 - 具身智能/机器人方向
  {
    id: 37,
    title: '机器人感知算法工程师',
    company: '宇树科技',
    location: '杭州',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'robotics',
    level: '高级',
    type: '全职',
    tags: ['机器人感知', 'SLAM', '深度估计', '避障', '传感器融合', 'ROS'],
    description: '研发四足机器人感知算法，实现自主导航和避障。',
    requirements: [
      '机器人学或计算机视觉硕士学历',
      '3年以上机器人感知算法经验',
      '精通SLAM、视觉里程计',
      '熟悉深度估计、语义SLAM',
      '了解多传感器融合（激光雷达、IMU、相机）',
      '熟悉ROS/ROS2开发'
    ],
    responsibilities: [
      '研发机器人视觉感知算法',
      '优化SLAM和定位精度',
      '实现实时避障和路径规划',
      '多传感器融合感知',
      '部署到实际机器人产品'
    ],
    benefits: ['六险一金', '期权', '机器人测试', '技术培训', '行业大会'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 38,
    title: '机器人运动控制工程师',
    company: '小米机器人',
    location: '北京',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'robotics',
    level: '高级',
    type: '全职',
    tags: ['运动控制', 'MPC', '步态规划', '动力学', 'Isaac Sim', '仿真'],
    description: '研发人形机器人运动控制算法，实现稳定行走和复杂动作。',
    requirements: [
      '机器人学或控制论相关专业硕士学历',
      '3年以上机器人控制算法经验',
      '精通MPC、最优控制理论',
      '熟悉步态规划和动力学建模',
      '有Isaac Sim、MuJoCo仿真经验',
      '了解强化学习控制方法'
    ],
    responsibilities: [
      '研发运动控制核心算法',
      '优化人形机器人步态',
      '实现复杂动作（上下楼、跨越障碍）',
      '仿真到真机迁移',
      '支撑CyberOne等产品'
    ],
    benefits: ['六险一金', '期权', '机器人实验室', '专利奖金', '小米产品'],
    postedDate: '2026-01-14',
    isUrgent: true
  },
  {
    id: 39,
    title: '机械臂操作学习研究员',
    company: '非夕科技',
    location: '上海',
    salary: '50-100K',
    experience: '3-5年',
    education: '博士优先',
    category: 'robotics',
    level: '研究员',
    type: '全职',
    tags: ['操作学习', 'Imitation Learning', 'Manipulation', 'Tactile', 'VLA', 'Dexterous'],
    description: '研究机械臂灵巧操作，实现复杂装配和精细操作任务。',
    requirements: [
      '机器人学或AI相关专业博士优先',
      '深入理解模仿学习、强化学习',
      '熟悉机械臂运动规划和控制',
      '了解触觉传感和力控',
      '有VLA模型或RT系列经验',
      '在RSS、CoRL发表过论文'
    ],
    responsibilities: [
      '研发灵巧操作核心算法',
      '探索VLA在操作中的应用',
      '构建操作数据采集系统',
      '实现工业装配任务自动化',
      '发表高质量论文'
    ],
    benefits: ['七险二金', '期权', '机器人实验室', '顶会支持', '访问学者'],
    postedDate: '2026-01-12',
    isHot: true
  },
  // 新增职位 - MLOps/工程化方向
  {
    id: 40,
    title: '模型部署工程师',
    company: '美团',
    location: '北京',
    salary: '35-70K',
    experience: '2-4年',
    education: '本科及以上',
    category: 'aiops',
    level: '高级',
    type: '全职',
    tags: ['模型部署', 'ONNX', 'TensorRT', 'Triton', 'Docker', 'K8s'],
    description: '负责AI模型的工程化部署，支撑美团业务的AI能力。',
    requirements: [
      '计算机相关专业本科及以上',
      '2年以上模型部署经验',
      '熟悉ONNX、TensorRT、OpenVINO',
      '了解Triton Inference Server',
      '精通Docker、Kubernetes',
      '有高并发服务经验'
    ],
    responsibilities: [
      '负责模型从训练到部署的工程化',
      '优化模型推理性能',
      '构建模型服务化平台',
      '支撑推荐、搜索、配送等业务',
      '建设模型监控和告警'
    ],
    benefits: ['六险一金', '股票', '三餐', '班车', '弹性工作'],
    postedDate: '2026-01-13'
  },
  {
    id: 41,
    title: 'AI平台产品经理',
    company: '阿里云',
    location: '杭州',
    salary: '40-80K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aiproduct',
    level: 'P6-P7',
    type: '全职',
    tags: ['AI平台', 'PAI', 'MLOps', '产品设计', '用户体验', 'B端'],
    description: '负责阿里云AI平台产品规划和设计，服务企业客户。',
    requirements: [
      '计算机或产品相关专业本科及以上',
      '3年以上AI或云产品经理经验',
      '了解机器学习开发流程和MLOps',
      '熟悉B端产品设计方法论',
      '有数据分析和用户研究能力',
      '了解竞品（SageMaker、Vertex AI）'
    ],
    responsibilities: [
      '负责PAI平台产品规划',
      '设计模型开发、训练、部署产品',
      '收集客户需求，推动功能迭代',
      '撰写产品文档和用户手册',
      '协调技术和运营团队'
    ],
    benefits: ['六险二金', '期权', '阿里云资源', '技术大会', '团建'],
    postedDate: '2026-01-11'
  },
  // 新增职位 - 数据方向
  {
    id: 42,
    title: 'AI数据工程师',
    company: 'Scale AI中国',
    location: '上海',
    salary: '35-70K',
    experience: '2-4年',
    education: '本科及以上',
    category: 'data',
    level: '高级',
    type: '全职',
    tags: ['数据工程', 'ETL', '数据质量', '多模态数据', 'Spark', 'Airflow'],
    description: '构建AI训练数据管线，支撑大模型和自动驾驶数据需求。',
    requirements: [
      '计算机或数据相关专业本科及以上',
      '2年以上数据工程经验',
      '精通Python、SQL、Spark',
      '熟悉ETL和数据管道（Airflow）',
      '了解图像、文本、音视频数据处理',
      '有大规模数据处理经验'
    ],
    responsibilities: [
      '构建AI数据采集和处理管线',
      '保证数据质量和一致性',
      '支撑多模态数据生产',
      '优化数据处理效率',
      '与标注团队协作'
    ],
    benefits: ['六险一金', '期权', '美式管理', '弹性工作', '零食饮料'],
    postedDate: '2026-01-14'
  },
  {
    id: 43,
    title: '知识图谱工程师',
    company: '华为',
    location: '深圳',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'data',
    level: '高级',
    type: '全职',
    tags: ['知识图谱', 'Neo4j', '图数据库', '实体抽取', '关系抽取', '图推理'],
    description: '构建企业知识图谱，支撑智能问答和决策系统。',
    requirements: [
      '计算机或NLP相关专业硕士学历',
      '3年以上知识图谱经验',
      '精通Neo4j、Nebula等图数据库',
      '熟悉实体识别、关系抽取技术',
      '了解图神经网络和图推理',
      '有行业知识图谱经验优先'
    ],
    responsibilities: [
      '设计知识图谱Schema',
      '构建实体和关系抽取管线',
      '开发图谱查询和推理服务',
      '支撑智能问答和推荐',
      '图谱质量评估和维护'
    ],
    benefits: ['七险二金', '华为云资源', '技术培训', '食堂班车', '年度体检'],
    postedDate: '2026-01-12'
  },
  // 推荐算法岗位
  {
    id: 44,
    title: '推荐算法工程师',
    company: '字节跳动',
    location: '北京',
    salary: '45-90K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'recommend',
    level: '高级',
    type: '全职',
    tags: ['推荐系统', '召回', '排序', 'DNN', 'Wide&Deep', '多目标优化'],
    description: '负责抖音/今日头条推荐系统核心算法研发。',
    requirements: [
      '计算机相关专业硕士学历',
      '3年以上推荐算法经验',
      '精通召回、粗排、精排全链路',
      '熟悉DeepFM、DIN、DIEN等模型',
      '有大规模推荐系统经验优先',
      '熟悉TensorFlow/PyTorch'
    ],
    responsibilities: [
      '优化推荐系统效果指标',
      '探索新的推荐算法',
      '多目标学习和实时更新',
      'A/B实验设计和分析',
      '特征工程和召回策略'
    ],
    benefits: ['六险一金', '期权', '免费三餐', '租房补贴', '技术会议'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 45,
    title: '搜索算法工程师',
    company: '百度',
    location: '北京',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'recommend',
    level: '高级',
    type: '全职',
    tags: ['搜索引擎', 'Query理解', '相关性', 'BERT', '语义匹配', 'Learning to Rank'],
    description: '负责搜索引擎核心算法优化。',
    requirements: [
      'NLP或信息检索相关硕士学历',
      '3年以上搜索算法经验',
      '精通Query改写、意图识别',
      '熟悉相关性排序和LTR',
      '了解向量检索和语义搜索',
      '有搜索或问答系统经验'
    ],
    responsibilities: [
      '优化搜索相关性和满意度',
      '研发Query理解模块',
      '语义检索和向量召回',
      '搜索质量评估体系',
      '探索大模型在搜索中的应用'
    ],
    benefits: ['六险一金', '期权', '百度大厦食堂', '弹性工作'],
    postedDate: '2026-01-14',
    isHot: true
  },
  // 自动驾驶岗位
  {
    id: 46,
    title: '自动驾驶感知算法工程师',
    company: '小鹏汽车',
    location: '广州',
    salary: '50-100K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'autodrive',
    level: '高级',
    type: '全职',
    tags: ['感知', 'BEV', '3D检测', 'Transformer', '传感器融合', '目标跟踪'],
    description: '负责自动驾驶感知系统算法研发。',
    requirements: [
      '计算机视觉或自动驾驶相关硕士',
      '3年以上感知算法经验',
      '精通BEV感知、3D目标检测',
      '熟悉多传感器融合算法',
      '了解目标跟踪和预测',
      '有量产项目经验优先'
    ],
    responsibilities: [
      '研发3D感知核心算法',
      'BEV感知方案优化',
      '多传感器融合策略',
      '感知模块量产落地',
      '跟踪学术前沿'
    ],
    benefits: ['六险一金', '购车优惠', '股票期权', '测试车资源'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 47,
    title: '自动驾驶规划控制工程师',
    company: '蔚来汽车',
    location: '上海',
    salary: '50-100K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'autodrive',
    level: '高级',
    type: '全职',
    tags: ['规划', '控制', 'MPC', '运动规划', '行为决策', '轨迹优化'],
    description: '负责自动驾驶规划控制算法研发。',
    requirements: [
      '自动化或机器人相关硕士',
      '3年以上规控算法经验',
      '精通MPC、路径规划算法',
      '熟悉车辆动力学建模',
      '了解强化学习应用',
      '有量产经验优先'
    ],
    responsibilities: [
      '研发行为决策算法',
      '轨迹规划和优化',
      '车辆控制策略',
      '仿真测试和实车调试',
      '量产功能开发'
    ],
    benefits: ['六险一金', '购车优惠', '期权', '充电免费'],
    postedDate: '2026-01-14',
    isHot: true
  },
  // AI产品经理岗位
  {
    id: 48,
    title: 'AI产品经理（大模型方向）',
    company: '阿里巴巴',
    location: '杭州',
    salary: '40-80K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aiproduct',
    level: '高级',
    type: '全职',
    tags: ['AI产品', '大模型', '产品设计', '需求分析', '用户研究', 'Prompt设计'],
    description: '负责通义系列大模型产品规划和设计。',
    requirements: [
      '3年以上产品经理经验',
      '1年以上AI产品经验',
      '了解大模型能力和局限',
      '优秀的需求分析能力',
      '有技术背景优先',
      '熟悉Prompt Engineering'
    ],
    responsibilities: [
      '大模型产品功能规划',
      '用户需求调研分析',
      '产品原型设计',
      '协调研发资源推进',
      '产品数据分析迭代'
    ],
    benefits: ['六险一金', '期权', '阿里食堂', '弹性工作'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 49,
    title: 'AIGC产品经理',
    company: '美图',
    location: '厦门',
    salary: '35-70K',
    experience: '2-4年',
    education: '本科及以上',
    category: 'aiproduct',
    level: '中级',
    type: '全职',
    tags: ['AIGC', '图像生成', '产品运营', 'Stable Diffusion', '创意工具'],
    description: '负责AI图像生成产品的规划和运营。',
    requirements: [
      '2年以上产品经验',
      '了解AIGC图像生成技术',
      '有创意工具产品经验',
      '良好的审美和设计感',
      '数据驱动的产品思维',
      '了解Stable Diffusion等模型'
    ],
    responsibilities: [
      'AIGC功能需求设计',
      '用户画像和场景分析',
      '产品效果评估',
      '竞品分析和调研',
      '与算法团队协作'
    ],
    benefits: ['六险一金', '美图产品体验', '海滨城市', '扁平管理'],
    postedDate: '2026-01-13'
  },
  // Prompt工程/AI训练岗位
  {
    id: 50,
    title: 'Prompt工程师',
    company: '月之暗面',
    location: '北京',
    salary: '30-60K',
    experience: '1-3年',
    education: '本科及以上',
    category: 'prompt',
    level: '中级',
    type: '全职',
    tags: ['Prompt Engineering', 'LLM', '对话设计', 'Few-shot', 'Chain of Thought'],
    description: '设计和优化大模型的Prompt策略。',
    requirements: [
      '1年以上大模型应用经验',
      '精通Prompt设计技巧',
      '了解各类大模型特点',
      '优秀的文字表达能力',
      '逻辑思维清晰',
      '有AI对话产品经验优先'
    ],
    responsibilities: [
      '设计Prompt模板和策略',
      '优化模型输出质量',
      '建立Prompt评估体系',
      '探索新的Prompt技巧',
      '沉淀最佳实践文档'
    ],
    benefits: ['六险一金', '期权', '扁平管理', 'GPU资源'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 51,
    title: 'AI数据标注专家',
    company: '智谱AI',
    location: '北京',
    salary: '25-50K',
    experience: '2-4年',
    education: '本科及以上',
    category: 'prompt',
    level: '中级',
    type: '全职',
    tags: ['数据标注', 'RLHF', '标注规范', '质量控制', '数据管理'],
    description: '负责大模型训练数据的标注和质量管理。',
    requirements: [
      '2年以上数据标注管理经验',
      '了解大模型训练流程',
      '熟悉RLHF数据标注',
      '优秀的质量控制能力',
      '良好的团队管理经验',
      '有NLP背景优先'
    ],
    responsibilities: [
      '制定数据标注规范',
      '管理标注团队',
      '数据质量审核',
      'RLHF数据准备',
      '优化标注效率'
    ],
    benefits: ['六险一金', '期权', '前沿技术', '学术合作'],
    postedDate: '2026-01-14'
  },
  // AI安全岗位
  {
    id: 52,
    title: 'AI安全工程师',
    company: '蚂蚁集团',
    location: '杭州',
    salary: '45-90K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'aisecurity',
    level: '高级',
    type: '全职',
    tags: ['AI安全', '对抗样本', '模型鲁棒性', '隐私保护', '联邦学习'],
    description: '负责AI模型的安全研究和防护。',
    requirements: [
      '安全或AI相关硕士学历',
      '3年以上AI安全经验',
      '了解对抗样本攻防',
      '熟悉模型窃取和后门攻击',
      '有安全顶会论文优先',
      '了解联邦学习和隐私计算'
    ],
    responsibilities: [
      '模型安全评估',
      '对抗攻击检测和防御',
      '隐私保护方案设计',
      '安全合规支持',
      '前沿安全技术研究'
    ],
    benefits: ['六险一金', '期权', '杭州总部', '安全团队'],
    postedDate: '2026-01-14'
  },
  // AI医疗岗位
  {
    id: 53,
    title: '医学AI算法工程师',
    company: '联影智能',
    location: '上海',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'medical',
    level: '高级',
    type: '全职',
    tags: ['医学影像', 'CT', 'MRI', '病灶检测', '图像分割', 'FDA认证'],
    description: '研发医学影像AI诊断算法。',
    requirements: [
      '计算机或生物医学工程硕士',
      '3年以上医学影像AI经验',
      '熟悉CT、MRI图像分析',
      '了解医学影像标准',
      '有FDA/NMPA认证经验优先',
      '发表过医学AI论文优先'
    ],
    responsibilities: [
      '研发影像诊断算法',
      '病灶检测和分割',
      '模型临床验证',
      '医疗器械注册支持',
      '与临床医生协作'
    ],
    benefits: ['六险一金', '医疗资源', '科研支持', '期权'],
    postedDate: '2026-01-13'
  },
  {
    id: 54,
    title: 'AI制药算法研究员',
    company: '晶泰科技',
    location: '深圳',
    salary: '50-100K',
    experience: '3-5年',
    education: '博士优先',
    category: 'medical',
    level: '研究员',
    type: '全职',
    tags: ['AI制药', '分子生成', '蛋白质预测', 'AlphaFold', 'GNN', '药物筛选'],
    description: '研发AI驱动的药物发现算法。',
    requirements: [
      '计算化学或AI相关博士',
      '了解药物发现流程',
      '熟悉分子表示学习',
      '了解AlphaFold等结构预测',
      '有GNN或生成模型经验',
      '发表过相关论文优先'
    ],
    responsibilities: [
      '分子生成模型研发',
      '蛋白质结构预测',
      '虚拟筛选算法',
      '与药化团队协作',
      '发表学术论文'
    ],
    benefits: ['六险一金', '期权', '科研经费', '顶会支持'],
    postedDate: '2026-01-12',
    isHot: true
  },
  // 知识图谱岗位
  {
    id: 55,
    title: '知识图谱工程师',
    company: '美团',
    location: '北京',
    salary: '40-80K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'kg',
    level: '高级',
    type: '全职',
    tags: ['知识图谱', 'NER', '关系抽取', '实体链接', '图神经网络', '知识推理'],
    description: '构建本地生活领域知识图谱。',
    requirements: [
      'NLP或知识图谱相关硕士',
      '3年以上知识图谱经验',
      '精通实体抽取和关系抽取',
      '熟悉图数据库和图计算',
      '了解GNN和知识推理',
      '有行业图谱经验优先'
    ],
    responsibilities: [
      '构建美食、商户知识图谱',
      '实体识别和链接',
      '图谱质量和更新',
      '支撑搜索和推荐',
      '知识问答应用'
    ],
    benefits: ['六险一金', '期权', '美团餐补', '弹性工作'],
    postedDate: '2026-01-14'
  },
  // ============ AI运营/增长岗位 ============
  {
    id: 56,
    title: 'AI产品运营经理',
    company: '字节跳动',
    location: '北京',
    salary: '30-60K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aiops_func',
    level: '高级',
    type: '全职',
    tags: ['产品运营', '用户增长', '数据分析', 'AB测试', 'AIGC产品', '用户研究'],
    description: '负责豆包等AI产品的运营策略和用户增长。',
    requirements: [
      '3年以上互联网产品运营经验',
      '1年以上AI产品运营经验',
      '优秀的数据分析能力',
      '熟悉用户增长方法论',
      '了解AI产品特点',
      '良好的跨部门协作能力'
    ],
    responsibilities: [
      '制定AI产品运营策略',
      '用户增长和留存分析',
      '活动策划和执行',
      '竞品分析和市场调研',
      '与产品、技术团队协作'
    ],
    benefits: ['六险一金', '期权', '免费三餐', '租房补贴'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 57,
    title: 'AIGC内容运营',
    company: '小红书',
    location: '上海',
    salary: '25-50K',
    experience: '2-4年',
    education: '本科及以上',
    category: 'aiops_func',
    level: '中级',
    type: '全职',
    tags: ['内容运营', 'AIGC', 'UGC', '社区运营', '创作者运营'],
    description: '负责AI生成内容的运营和创作者生态建设。',
    requirements: [
      '2年以上内容运营经验',
      '了解AIGC工具和应用',
      '优秀的内容审美',
      '熟悉小红书等内容平台',
      '有创作者运营经验优先'
    ],
    responsibilities: [
      'AIGC内容策划和审核',
      'AI创作者运营',
      '内容趋势分析',
      'AIGC工具推广',
      '社区氛围建设'
    ],
    benefits: ['六险一金', '期权', '弹性工作', '健身房'],
    postedDate: '2026-01-14'
  },
  // ============ AI市场/品牌岗位 ============
  {
    id: 58,
    title: 'AI市场总监',
    company: '百川智能',
    location: '北京',
    salary: '60-100K',
    experience: '8-10年',
    education: '本科及以上',
    category: 'aimarket',
    level: '总监',
    type: '全职',
    tags: ['市场营销', '品牌策略', 'To B营销', 'AI行业', '公关传播'],
    description: '负责公司整体市场策略和品牌建设。',
    requirements: [
      '8年以上市场营销经验',
      '3年以上AI/科技行业经验',
      '有完整的品牌建设经验',
      '优秀的团队管理能力',
      '丰富的媒体和行业资源'
    ],
    responsibilities: [
      '制定市场整体策略',
      '品牌定位和传播',
      '市场团队管理',
      '预算规划和ROI管理',
      '行业活动和公关'
    ],
    benefits: ['六险一金', '期权', '弹性工作', '带薪年假'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 59,
    title: 'AI行业解决方案营销',
    company: '阿里云',
    location: '杭州',
    salary: '35-70K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aimarket',
    level: '高级',
    type: '全职',
    tags: ['解决方案', 'To B营销', '行业营销', '内容营销', '活动策划'],
    description: '负责AI行业解决方案的市场推广。',
    requirements: [
      '3年以上To B市场经验',
      '了解AI技术和应用场景',
      '优秀的内容策划能力',
      '有行业活动经验',
      '良好的沟通表达能力'
    ],
    responsibilities: [
      '行业解决方案包装',
      '客户案例沉淀',
      '行业活动策划',
      '内容营销执行',
      '销售赋能支持'
    ],
    benefits: ['六险一金', '期权', '阿里福利', '弹性工作'],
    postedDate: '2026-01-14'
  },
  // ============ AI销售/商务岗位 ============
  {
    id: 60,
    title: 'AI解决方案销售总监',
    company: '商汤科技',
    location: '上海',
    salary: '80-150K',
    experience: '8-10年',
    education: '本科及以上',
    category: 'aisales',
    level: '总监',
    type: '全职',
    tags: ['解决方案销售', 'To B销售', '大客户', 'AI行业', '团队管理'],
    description: '负责AI解决方案的销售团队和大客户开拓。',
    requirements: [
      '8年以上To B销售经验',
      '3年以上AI/科技行业经验',
      '有大客户销售成功经验',
      '优秀的团队管理能力',
      '良好的行业人脉资源'
    ],
    responsibilities: [
      '制定销售策略和目标',
      '大客户开拓和维护',
      '销售团队管理',
      '商务谈判和合同签订',
      '客户关系管理'
    ],
    benefits: ['六险一金', '期权', '高额提成', '商务用车'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 61,
    title: 'AI商务拓展经理',
    company: '科大讯飞',
    location: '合肥',
    salary: '30-60K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aisales',
    level: '高级',
    type: '全职',
    tags: ['商务拓展', 'BD', '合作伙伴', 'AI生态', '渠道管理'],
    description: '负责AI生态合作伙伴的拓展和管理。',
    requirements: [
      '3年以上商务拓展经验',
      '了解AI行业生态',
      '优秀的商务谈判能力',
      '有渠道管理经验',
      '良好的沟通协调能力'
    ],
    responsibilities: [
      '合作伙伴开拓',
      '生态合作方案设计',
      '渠道管理和赋能',
      '商务条款谈判',
      '合作项目落地'
    ],
    benefits: ['六险一金', '期权', '出差补贴', '绩效奖金'],
    postedDate: '2026-01-14'
  },
  {
    id: 62,
    title: 'AI售前解决方案专家',
    company: '华为云',
    location: '深圳',
    salary: '40-80K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'aisales',
    level: '专家',
    type: '全职',
    tags: ['售前', '解决方案', '技术方案', 'AI应用', '客户沟通'],
    description: '负责AI解决方案的售前支持和方案设计。',
    requirements: [
      '5年以上售前或解决方案经验',
      '深入了解AI技术和应用',
      '优秀的方案设计能力',
      '良好的客户沟通能力',
      '有行业解决方案经验'
    ],
    responsibilities: [
      '客户需求调研分析',
      '解决方案设计',
      '技术方案演示',
      '投标文件编写',
      '售前技术支持'
    ],
    benefits: ['七险二金', '华为福利', '出差补贴', '培训机会'],
    postedDate: '2026-01-14'
  },
  // ============ AI金融/风控岗位 ============
  {
    id: 63,
    title: 'AI风控算法工程师',
    company: '蚂蚁集团',
    location: '杭州',
    salary: '50-100K',
    experience: '3-5年',
    education: '硕士及以上',
    category: 'fintech',
    level: '高级',
    type: '全职',
    tags: ['风控', '反欺诈', '机器学习', '金融科技', '图神经网络'],
    description: '负责支付宝风控系统的算法研发。',
    requirements: [
      '3年以上风控算法经验',
      '熟悉反欺诈、信用评估模型',
      '了解图神经网络在风控的应用',
      '有金融行业经验优先',
      '熟悉Python、Spark'
    ],
    responsibilities: [
      '风控模型研发和优化',
      '反欺诈策略设计',
      '实时风控系统优化',
      '特征工程和模型迭代',
      '风控效果评估'
    ],
    benefits: ['六险一金', '期权', '杭州总部', '弹性工作'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 64,
    title: '量化AI研究员',
    company: '九坤投资',
    location: '北京',
    salary: '80-200K',
    experience: '3-5年',
    education: '博士优先',
    category: 'fintech',
    level: '研究员',
    type: '全职',
    tags: ['量化交易', '深度学习', '时间序列', 'Alpha研究', '高频交易'],
    description: '将AI技术应用于量化投资策略研发。',
    requirements: [
      '数学/物理/CS博士优先',
      '深入理解深度学习',
      '熟悉金融市场和量化策略',
      '优秀的编程能力',
      '有量化研究经验优先'
    ],
    responsibilities: [
      'AI量化策略研发',
      '深度学习模型设计',
      'Alpha因子挖掘',
      '策略回测和优化',
      '研究报告撰写'
    ],
    benefits: ['六险一金', '高额奖金', '顶级资源', '学术氛围'],
    postedDate: '2026-01-14',
    isHot: true
  },
  // ============ AI教育岗位 ============
  {
    id: 65,
    title: 'AI教育产品经理',
    company: '好未来',
    location: '北京',
    salary: '35-70K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'eduai',
    level: '高级',
    type: '全职',
    tags: ['教育产品', 'AI教育', '智能辅导', '自适应学习', '产品设计'],
    description: '负责AI智能教育产品的规划和设计。',
    requirements: [
      '3年以上教育产品经验',
      '了解AI在教育的应用',
      '优秀的产品设计能力',
      '了解教育行业和用户需求',
      '有AI产品经验优先'
    ],
    responsibilities: [
      'AI教育产品规划',
      '智能辅导功能设计',
      '用户需求调研',
      '产品迭代和优化',
      '与算法团队协作'
    ],
    benefits: ['六险一金', '期权', '教育资源', '弹性工作'],
    postedDate: '2026-01-14'
  },
  // ============ AI技术管理岗位 ============
  {
    id: 66,
    title: 'AI算法团队负责人',
    company: '腾讯',
    location: '深圳',
    salary: '80-150K',
    experience: '8-10年',
    education: '硕士及以上',
    category: 'aimanager',
    level: '经理',
    type: '全职',
    tags: ['团队管理', '算法研发', '技术规划', '项目管理', 'AI战略'],
    description: '负责AI算法团队的管理和技术方向规划。',
    requirements: [
      '8年以上算法研发经验',
      '3年以上团队管理经验',
      '在顶会发表过论文',
      '优秀的技术视野',
      '良好的跨团队协作能力'
    ],
    responsibilities: [
      '算法团队建设和管理',
      '技术方向规划',
      '核心算法攻关',
      '人才培养和梯队建设',
      '跨团队技术协作'
    ],
    benefits: ['六险一金', '股票', '腾讯福利', '技术会议'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 67,
    title: '大模型技术总监',
    company: '百度',
    location: '北京',
    salary: '100-180K',
    experience: '10年以上',
    education: '博士优先',
    category: 'aimanager',
    level: '总监',
    type: '全职',
    tags: ['技术总监', '大模型', '团队管理', '技术战略', '文心一言'],
    description: '负责大模型技术团队的整体管理和战略规划。',
    requirements: [
      '10年以上AI研发经验',
      '5年以上团队管理经验',
      '深入理解大模型技术体系',
      '在顶会发表多篇论文',
      '有大型项目落地经验'
    ],
    responsibilities: [
      '大模型技术战略规划',
      '技术团队管理和建设',
      '核心技术攻关和决策',
      '对外技术合作和交流',
      '人才引进和培养'
    ],
    benefits: ['六险一金', '期权', '百度福利', '顶级资源'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 68,
    title: 'AI工程技术经理',
    company: '美团',
    location: '北京',
    salary: '60-100K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'aimanager',
    level: '经理',
    type: '全职',
    tags: ['工程管理', 'AI平台', '技术管理', '项目交付', 'MLOps'],
    description: '负责AI工程团队的管理和平台建设。',
    requirements: [
      '5年以上AI工程经验',
      '2年以上团队管理经验',
      '熟悉AI平台和MLOps',
      '优秀的项目管理能力',
      '良好的沟通协调能力'
    ],
    responsibilities: [
      'AI工程团队管理',
      'AI平台架构设计',
      '工程效率提升',
      '项目交付和质量管控',
      '团队建设和培养'
    ],
    benefits: ['六险一金', '期权', '美团餐补', '弹性工作'],
    postedDate: '2026-01-14'
  },
  // ============ AI高管/VP岗位 ============
  {
    id: 69,
    title: 'AI业务VP',
    company: 'AI创业公司',
    location: '北京',
    salary: '150-300K',
    experience: '15年以上',
    education: '硕士及以上',
    category: 'aiexec',
    level: 'VP',
    type: '全职',
    tags: ['VP', '业务负责人', 'AI战略', '商业化', '团队管理'],
    description: '负责AI业务的整体运营和商业化。',
    requirements: [
      '15年以上相关行业经验',
      '8年以上高管经验',
      '成功的商业化落地经验',
      '优秀的战略规划能力',
      '丰富的行业资源'
    ],
    responsibilities: [
      'AI业务战略规划',
      '商业化路径设计',
      '核心团队组建',
      '重大客户和合作伙伴',
      '对外融资和合作'
    ],
    benefits: ['六险一金', '股权', '期权', '高端福利'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 70,
    title: 'CTO/技术VP（AI方向）',
    company: 'AIGC创业公司',
    location: '上海',
    salary: '200-400K',
    experience: '15年以上',
    education: '博士优先',
    category: 'aiexec',
    level: 'CTO',
    type: '全职',
    tags: ['CTO', '技术VP', '技术战略', 'AI架构', '团队建设'],
    description: '负责公司整体技术战略和AI技术体系建设。',
    requirements: [
      '15年以上技术经验',
      '10年以上AI相关经验',
      '有CTO/技术VP经验',
      '深厚的技术积累',
      '优秀的战略视野和领导力'
    ],
    responsibilities: [
      '公司技术战略制定',
      'AI技术体系建设',
      '技术团队组建和管理',
      '核心技术决策',
      '技术品牌建设'
    ],
    benefits: ['六险一金', '股权', '期权', '高端福利', '配车'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 71,
    title: 'AI研究院院长',
    company: '头部互联网公司',
    location: '北京',
    salary: '面议',
    experience: '15年以上',
    education: '博士',
    category: 'aiexec',
    level: '院长',
    type: '全职',
    tags: ['研究院', '学术领军', 'AI研究', '产学研', '顶级科学家'],
    description: '负责AI研究院的整体运营和前沿研究。',
    requirements: [
      '国际顶级AI专家',
      '在顶会发表多篇有影响力论文',
      '有研究院或实验室管理经验',
      '优秀的学术影响力',
      '产学研结合经验'
    ],
    responsibilities: [
      '研究院战略规划',
      '前沿技术研究',
      '顶级人才引进',
      '产学研合作',
      '技术品牌建设'
    ],
    benefits: ['顶级薪酬', '股权激励', '科研经费', '行政支持'],
    postedDate: '2026-01-14',
    isHot: true,
    isUrgent: true
  },
  // ============ AI行业HR/招聘岗位 ============
  {
    id: 72,
    title: 'AI行业资深猎头顾问',
    company: '科锐国际',
    location: '北京',
    salary: '30-80K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aihr',
    level: '高级',
    type: '全职',
    tags: ['猎头', 'AI人才', '高端招聘', '人才mapping', '候选人沟通'],
    description: '专注AI领域高端人才猎聘服务。',
    requirements: [
      '3年以上猎头经验',
      '1年以上AI/科技行业经验',
      '了解AI技术岗位和人才市场',
      '优秀的沟通和谈判能力',
      '有AI大厂人脉资源优先'
    ],
    responsibilities: [
      'AI高端人才寻访',
      '候选人面试评估',
      '客户需求对接',
      '人才市场分析',
      '长期人才关系维护'
    ],
    benefits: ['六险一金', '高额提成', '弹性工作', '培训机会'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 73,
    title: 'AI技术招聘专家',
    company: '字节跳动',
    location: '北京',
    salary: '25-50K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aihr',
    level: '高级',
    type: '全职',
    tags: ['技术招聘', 'AI人才', '校招', '社招', '雇主品牌'],
    description: '负责AI技术团队的人才招聘工作。',
    requirements: [
      '3年以上技术招聘经验',
      '了解AI/算法岗位技术栈',
      '熟悉各类招聘渠道',
      '优秀的候选人沟通能力',
      '有大厂招聘经验优先'
    ],
    responsibilities: [
      'AI岗位需求分析',
      '简历筛选和初面',
      '招聘渠道拓展',
      '校招活动策划',
      '招聘数据分析'
    ],
    benefits: ['六险一金', '期权', '免费三餐', '租房补贴'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 74,
    title: 'HRBP（AI研发团队）',
    company: '阿里巴巴',
    location: '杭州',
    salary: '35-70K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'aihr',
    level: '高级',
    type: '全职',
    tags: ['HRBP', '组织发展', '人才发展', '绩效管理', '团队文化'],
    description: '支持AI研发团队的人力资源工作。',
    requirements: [
      '5年以上HRBP经验',
      '有技术团队支持经验',
      '熟悉组织发展和人才管理',
      '优秀的业务理解能力',
      '良好的沟通协调能力'
    ],
    responsibilities: [
      '业务团队人力资源支持',
      '组织诊断和发展',
      '人才盘点和梯队建设',
      '绩效管理和激励',
      '团队文化建设'
    ],
    benefits: ['六险一金', '期权', '阿里福利', '弹性工作'],
    postedDate: '2026-01-14'
  },
  {
    id: 75,
    title: 'AI人才发展经理',
    company: '华为',
    location: '深圳',
    salary: '40-80K',
    experience: '5-8年',
    education: '硕士及以上',
    category: 'aihr',
    level: '经理',
    type: '全职',
    tags: ['人才发展', '培训体系', '领导力', '任职资格', '职业通道'],
    description: '负责AI人才培养体系建设和人才发展。',
    requirements: [
      '5年以上人才发展经验',
      '有技术人才培养经验',
      '熟悉任职资格和职业通道',
      '优秀的项目管理能力',
      '有咨询或大厂背景优先'
    ],
    responsibilities: [
      'AI人才培养体系设计',
      '技术专家发展通道',
      '领导力发展项目',
      '培训课程开发',
      '人才发展效果评估'
    ],
    benefits: ['七险二金', '华为福利', '培训资源', '职业发展'],
    postedDate: '2026-01-14'
  },
  {
    id: 76,
    title: '招聘总监（AI业务线）',
    company: '商汤科技',
    location: '上海',
    salary: '60-100K',
    experience: '8-10年',
    education: '本科及以上',
    category: 'aihr',
    level: '总监',
    type: '全职',
    tags: ['招聘管理', '团队管理', '招聘策略', 'AI人才', '雇主品牌'],
    description: '负责AI业务线的整体招聘管理。',
    requirements: [
      '8年以上招聘经验',
      '3年以上团队管理经验',
      '深入了解AI人才市场',
      '优秀的团队管理能力',
      '有AI公司招聘管理经验'
    ],
    responsibilities: [
      '招聘策略制定',
      '招聘团队管理',
      '重点岗位招聘',
      '招聘渠道建设',
      '雇主品牌建设'
    ],
    benefits: ['六险一金', '期权', '商汤福利', '弹性工作'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 77,
    title: '薪酬绩效经理（AI团队）',
    company: '百度',
    location: '北京',
    salary: '35-70K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'aihr',
    level: '经理',
    type: '全职',
    tags: ['薪酬设计', '绩效管理', 'OKR', '股权激励', '薪酬调研'],
    description: '负责AI技术团队的薪酬绩效体系设计和管理。',
    requirements: [
      '5年以上薪酬绩效经验',
      '有科技公司C&B经验',
      '熟悉技术岗位薪酬市场',
      '了解股权激励设计',
      '数据分析能力强'
    ],
    responsibilities: [
      'AI岗位薪酬体系设计',
      '绩效考核方案制定',
      '年度调薪和奖金方案',
      '股权激励方案设计',
      '薪酬市场调研分析'
    ],
    benefits: ['六险一金', '期权', '百度福利', '弹性工作'],
    postedDate: '2026-01-14'
  },
  {
    id: 78,
    title: '组织发展专家（OD）',
    company: '腾讯',
    location: '深圳',
    salary: '40-80K',
    experience: '5-8年',
    education: '硕士及以上',
    category: 'aihr',
    level: '专家',
    type: '全职',
    tags: ['组织发展', 'OD', '组织诊断', '变革管理', '组织效能'],
    description: '负责AI事业群的组织发展和变革管理。',
    requirements: [
      '5年以上OD经验',
      '有大型科技公司经验',
      '熟悉组织诊断方法论',
      '优秀的咨询和引导能力',
      '有组织变革项目经验'
    ],
    responsibilities: [
      '组织诊断和效能分析',
      '组织架构设计优化',
      '变革管理和落地',
      '团队文化建设',
      '组织健康度评估'
    ],
    benefits: ['六险一金', '股票', '腾讯福利', '弹性工作'],
    postedDate: '2026-01-14'
  },
  {
    id: 79,
    title: '员工关系专家',
    company: '美团',
    location: '北京',
    salary: '25-50K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aihr',
    level: '高级',
    type: '全职',
    tags: ['员工关系', '劳动法', '离职管理', '员工沟通', '风险防控'],
    description: '负责AI团队的员工关系管理和风险防控。',
    requirements: [
      '3年以上员工关系经验',
      '熟悉劳动法律法规',
      '良好的沟通协调能力',
      '有互联网公司经验',
      '抗压能力强'
    ],
    responsibilities: [
      '员工关系问题处理',
      '劳动风险防控',
      '离职面谈和分析',
      '员工满意度调研',
      'HR政策咨询'
    ],
    benefits: ['六险一金', '期权', '美团餐补', '弹性工作'],
    postedDate: '2026-01-13'
  },
  {
    id: 80,
    title: 'HR数据分析师',
    company: '字节跳动',
    location: '北京',
    salary: '30-60K',
    experience: '2-4年',
    education: '本科及以上',
    category: 'aihr',
    level: '中级',
    type: '全职',
    tags: ['HR数据', '数据分析', 'Python', 'BI', '人效分析'],
    description: '负责HR数据分析和人力资源数字化。',
    requirements: [
      '2年以上数据分析经验',
      '熟悉HR各模块数据',
      '精通Excel、SQL、Python',
      '有BI工具使用经验',
      '逻辑思维和表达能力强'
    ],
    responsibilities: [
      'HR数据报表开发',
      '人效分析和预警',
      '招聘漏斗分析',
      '离职预测模型',
      'HR数字化项目支持'
    ],
    benefits: ['六险一金', '期权', '免费三餐', '租房补贴'],
    postedDate: '2026-01-15',
    isHot: true
  },
  {
    id: 81,
    title: '校园招聘经理',
    company: '小米',
    location: '北京',
    salary: '30-55K',
    experience: '3-5年',
    education: '本科及以上',
    category: 'aihr',
    level: '经理',
    type: '全职',
    tags: ['校园招聘', '雇主品牌', '校企合作', '实习生管理', '人才储备'],
    description: '负责AI方向的校园招聘和人才储备。',
    requirements: [
      '3年以上校招经验',
      '熟悉AI相关专业和院校',
      '有校企合作资源',
      '优秀的活动策划能力',
      '有大厂校招经验优先'
    ],
    responsibilities: [
      '校园招聘策略制定',
      '校园宣讲和活动',
      '实习生项目管理',
      '校企合作关系维护',
      '雇主品牌校园推广'
    ],
    benefits: ['六险一金', '期权', '小米福利', '弹性工作'],
    postedDate: '2026-01-14'
  },
  {
    id: 82,
    title: 'HRD/人力资源总监',
    company: 'AI独角兽企业',
    location: '上海',
    salary: '80-150K',
    experience: '10年以上',
    education: '本科及以上',
    category: 'aihr',
    level: '总监',
    type: '全职',
    tags: ['HRD', '人力资源管理', '战略HR', '组织建设', '文化建设'],
    description: '全面负责公司人力资源管理工作。',
    requirements: [
      '10年以上HR经验',
      '5年以上HRD经验',
      '有AI/科技公司背景',
      '优秀的战略思维',
      '出色的领导力和影响力'
    ],
    responsibilities: [
      'HR战略规划和执行',
      '组织和人才建设',
      'HR团队管理',
      '企业文化建设',
      '核心人才引进和保留'
    ],
    benefits: ['六险一金', '股权', '高管福利', '弹性工作'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
  {
    id: 83,
    title: 'AI行业研究员（HR方向）',
    company: '猎聘',
    location: '北京',
    salary: '25-50K',
    experience: '2-4年',
    education: '硕士及以上',
    category: 'aihr',
    level: '中级',
    type: '全职',
    tags: ['行业研究', '人才洞察', '薪酬报告', '趋势分析', '白皮书'],
    description: '研究AI行业人才市场趋势和薪酬数据。',
    requirements: [
      '2年以上行业研究经验',
      '了解AI行业和人才市场',
      '优秀的数据分析能力',
      '良好的报告撰写能力',
      '有咨询或研究背景优先'
    ],
    responsibilities: [
      'AI人才市场研究',
      '薪酬数据分析',
      '行业趋势报告撰写',
      '客户定制研究',
      '行业白皮书发布'
    ],
    benefits: ['六险一金', '弹性工作', '研究资源', '行业活动'],
    postedDate: '2026-01-13'
  },
  {
    id: 84,
    title: '海外HR专家（AI团队）',
    company: '华为',
    location: '深圳',
    salary: '40-80K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'aihr',
    level: '专家',
    type: '全职',
    tags: ['海外HR', '全球招聘', '跨文化', '海外派遣', '国际化'],
    description: '负责AI团队的海外人才招聘和管理。',
    requirements: [
      '5年以上HR经验',
      '有海外招聘或派遣经验',
      '英语流利',
      '了解海外劳动法规',
      '有跨文化沟通能力'
    ],
    responsibilities: [
      '海外AI人才招聘',
      '海外派遣管理',
      '跨国团队HR支持',
      '海外薪酬福利设计',
      '全球HR政策对接'
    ],
    benefits: ['七险二金', '华为福利', '海外机会', '语言培训'],
    postedDate: '2026-01-14'
  },
  {
    id: 85,
    title: '培训讲师（AI技术方向）',
    company: '得到',
    location: '北京',
    salary: '30-60K',
    experience: '5-8年',
    education: '本科及以上',
    category: 'aihr',
    level: '高级',
    type: '全职',
    tags: ['企业培训', 'AI培训', '课程开发', '内训师', '知识管理'],
    description: '开发和交付AI相关的企业培训课程。',
    requirements: [
      '5年以上培训经验',
      '了解AI技术和应用',
      '优秀的课程开发能力',
      '出色的演讲和表达',
      '有AI行业背景优先'
    ],
    responsibilities: [
      'AI培训课程开发',
      '企业内训交付',
      '培训效果评估',
      '知识体系搭建',
      '内训师培养'
    ],
    benefits: ['六险一金', '知识付费', '出版机会', '行业资源'],
    postedDate: '2026-01-13'
  },
  {
    id: 86,
    title: 'SSC运营专员',
    company: '阿里巴巴',
    location: '杭州',
    salary: '15-30K',
    experience: '1-3年',
    education: '本科及以上',
    category: 'aihr',
    level: '初级',
    type: '全职',
    tags: ['SSC', 'HR共享服务', '入离职', '社保公积金', '员工服务'],
    description: '负责HR共享服务中心的日常运营。',
    requirements: [
      '1年以上HR运营经验',
      '熟悉入离职流程',
      '了解社保公积金政策',
      '细心耐心服务意识强',
      '有SSC经验优先'
    ],
    responsibilities: [
      '入离职手续办理',
      '社保公积金管理',
      '员工档案管理',
      '员工咨询服务',
      'HR系统数据维护'
    ],
    benefits: ['六险一金', '期权', '阿里福利', '晋升通道'],
    postedDate: '2026-01-12'
  },
  {
    id: 87,
    title: '招聘运营专员',
    company: 'BOSS直聘',
    location: '北京',
    salary: '15-30K',
    experience: '1-3年',
    education: '本科及以上',
    category: 'aihr',
    level: '初级',
    type: '全职',
    tags: ['招聘运营', '简历筛选', '面试安排', '招聘系统', '数据统计'],
    description: '支持AI企业客户的招聘运营工作。',
    requirements: [
      '1年以上招聘相关经验',
      '熟悉招聘流程',
      '熟练使用招聘系统',
      '良好的沟通协调能力',
      '细心负责'
    ],
    responsibilities: [
      '简历筛选和推荐',
      '面试安排和跟进',
      '招聘数据统计',
      '招聘系统维护',
      '候选人关系维护'
    ],
    benefits: ['六险一金', '弹性工作', '免费体检', '团建活动'],
    postedDate: '2026-01-12'
  },
  {
    id: 88,
    title: 'CHO/首席人力官',
    company: '大模型创业公司',
    location: '北京',
    salary: '150-300K',
    experience: '15年以上',
    education: '硕士及以上',
    category: 'aihr',
    level: 'CHO',
    type: '全职',
    tags: ['CHO', '首席人力官', 'HR战略', '组织变革', '高管团队'],
    description: '作为创始团队成员，全面负责公司人力资源战略。',
    requirements: [
      '15年以上HR经验',
      '8年以上HRD/CHO经验',
      '有科技公司高管背景',
      '优秀的战略思维和商业洞察',
      '卓越的领导力和影响力'
    ],
    responsibilities: [
      '人力资源战略制定',
      '核心团队搭建',
      '组织文化塑造',
      '高管团队赋能',
      '投资人关系支持'
    ],
    benefits: ['六险一金', '联合创始人待遇', '股权', '高管福利'],
    postedDate: '2026-01-15',
    isHot: true,
    isUrgent: true
  },
]
