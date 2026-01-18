import { Candidate } from './types'

// 模拟候选人数据 - 30个候选人
export const mockCandidates: Candidate[] = [
  {
    id: 'c001',
    name: '张三',
    email: 'zhangsan@email.com',
    phone: '138****1234',
    currentPosition: '高级前端工程师',
    currentCompany: '腾讯科技',
    experience: '5年',
    education: '本科',
    school: '浙江大学',
    skills: ['React', 'Vue', 'TypeScript', 'Node.js', 'WebGL', '性能优化'],
    expectedSalary: '40-50K',
    location: '北京',
    summary: '5年前端开发经验，精通React/Vue生态，有大型项目架构经验，对性能优化有深入研究。',
    workHistory: [
      { company: '腾讯科技', position: '高级前端工程师', duration: '2022-至今', description: '负责微信小程序框架开发' },
      { company: '字节跳动', position: '前端工程师', duration: '2019-2022', description: '负责抖音Web端开发' }
    ],
    createdAt: '2026-01-15'
  },
  {
    id: 'c002',
    name: '李四',
    email: 'lisi@email.com',
    phone: '139****5678',
    currentPosition: 'Python后端开发',
    currentCompany: '阿里巴巴',
    experience: '4年',
    education: '硕士',
    school: '清华大学',
    skills: ['Python', 'Django', 'FastAPI', 'MySQL', 'Redis', 'Kubernetes'],
    expectedSalary: '35-45K',
    location: '杭州',
    summary: '4年Python后端经验，熟悉微服务架构，有高并发系统设计经验。',
    workHistory: [
      { company: '阿里巴巴', position: 'Python后端开发', duration: '2022-至今', description: '负责淘宝商品系统' },
      { company: '美团', position: '后端工程师', duration: '2020-2022', description: '负责订单系统开发' }
    ],
    createdAt: '2026-01-14'
  },
  {
    id: 'c003',
    name: '王五',
    email: 'wangwu@email.com',
    phone: '137****9012',
    currentPosition: 'AI算法工程师',
    currentCompany: '商汤科技',
    experience: '3年',
    education: '博士',
    school: '北京大学',
    skills: ['PyTorch', 'TensorFlow', 'Transformer', 'LLM', 'CUDA', '分布式训练'],
    expectedSalary: '60-80K',
    location: '上海',
    summary: '3年AI算法经验，专注大模型和NLP方向，有顶会论文发表。',
    workHistory: [
      { company: '商汤科技', position: 'AI算法工程师', duration: '2023-至今', description: '负责大模型研发' },
      { company: '百度', position: '算法实习生', duration: '2021-2023', description: 'NLP方向研究' }
    ],
    createdAt: '2026-01-13'
  },
  {
    id: 'c004',
    name: '赵六',
    email: 'zhaoliu@email.com',
    phone: '136****3456',
    currentPosition: '产品经理',
    currentCompany: '京东',
    experience: '6年',
    education: '本科',
    school: '复旦大学',
    skills: ['产品设计', '数据分析', 'SQL', 'Axure', '用户研究', 'A/B测试'],
    expectedSalary: '45-55K',
    location: '北京',
    summary: '6年产品经验，主导过多款千万级用户产品，擅长数据驱动增长。',
    workHistory: [
      { company: '京东', position: '高级产品经理', duration: '2021-至今', description: '负责京东购物车产品线' },
      { company: '网易', position: '产品经理', duration: '2018-2021', description: '负责有道词典产品' }
    ],
    createdAt: '2026-01-12'
  },
  {
    id: 'c005',
    name: '钱七',
    email: 'qianqi@email.com',
    phone: '135****7890',
    currentPosition: 'iOS开发工程师',
    currentCompany: '小米',
    experience: '4年',
    education: '本科',
    school: '华中科技大学',
    skills: ['Swift', 'Objective-C', 'iOS SDK', 'Core Animation', 'ARKit', 'SwiftUI'],
    expectedSalary: '35-45K',
    location: '北京',
    summary: '4年iOS开发经验，精通Swift和iOS生态，有App Store热门应用开发经验。',
    workHistory: [
      { company: '小米', position: 'iOS开发工程师', duration: '2022-至今', description: '负责小米商城iOS端' },
      { company: '快手', position: 'iOS开发', duration: '2020-2022', description: '快手App功能开发' }
    ],
    createdAt: '2026-01-11'
  },
  {
    id: 'c006',
    name: '孙八',
    email: 'sunba@email.com',
    phone: '134****2345',
    currentPosition: 'Java开发工程师',
    currentCompany: '华为',
    experience: '5年',
    education: '硕士',
    school: '上海交通大学',
    skills: ['Java', 'Spring Boot', 'Dubbo', 'MySQL', 'Kafka', '分布式系统'],
    expectedSalary: '40-50K',
    location: '深圳',
    summary: '5年Java开发经验，熟悉分布式系统设计，有大规模系统架构经验。',
    workHistory: [
      { company: '华为', position: 'Java开发工程师', duration: '2021-至今', description: '云服务核心系统' },
      { company: '网易', position: 'Java开发', duration: '2019-2021', description: '游戏后台服务' }
    ],
    createdAt: '2026-01-10'
  },
  {
    id: 'c007',
    name: '周九',
    email: 'zhoujiu@email.com',
    phone: '133****6789',
    currentPosition: '数据工程师',
    currentCompany: '字节跳动',
    experience: '3年',
    education: '硕士',
    school: '中国科学技术大学',
    skills: ['Spark', 'Flink', 'Hive', 'Kafka', 'Airflow', 'Python'],
    expectedSalary: '35-45K',
    location: '北京',
    summary: '3年大数据开发经验，精通实时和离线数据处理，有PB级数据处理经验。',
    workHistory: [
      { company: '字节跳动', position: '数据工程师', duration: '2023-至今', description: '推荐系统数据平台' },
      { company: '快手', position: '数据开发', duration: '2021-2023', description: '数据仓库建设' }
    ],
    createdAt: '2026-01-09'
  },
  {
    id: 'c008',
    name: '吴十',
    email: 'wushi@email.com',
    phone: '132****0123',
    currentPosition: 'DevOps工程师',
    currentCompany: '阿里云',
    experience: '4年',
    education: '本科',
    school: '南京大学',
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS', 'Linux'],
    expectedSalary: '35-45K',
    location: '杭州',
    summary: '4年DevOps经验，精通容器化和CI/CD，有大规模集群运维经验。',
    workHistory: [
      { company: '阿里云', position: 'DevOps工程师', duration: '2022-至今', description: '云原生平台建设' },
      { company: '滴滴', position: '运维工程师', duration: '2020-2022', description: '基础架构运维' }
    ],
    createdAt: '2026-01-08'
  },
  {
    id: 'c009',
    name: '郑十一',
    email: 'zheng11@email.com',
    phone: '131****4567',
    currentPosition: '计算机视觉工程师',
    currentCompany: '旷视科技',
    experience: '3年',
    education: '博士',
    school: '中国科学院',
    skills: ['OpenCV', 'YOLO', 'Mask R-CNN', 'PyTorch', '目标检测', '图像分割'],
    expectedSalary: '50-70K',
    location: '北京',
    summary: '3年CV经验，专注目标检测和图像分割，有CVPR论文发表。',
    workHistory: [
      { company: '旷视科技', position: 'CV工程师', duration: '2023-至今', description: '安防视觉算法' },
      { company: '商汤科技', position: '算法实习生', duration: '2021-2023', description: '人脸识别研究' }
    ],
    createdAt: '2026-01-07'
  },
  {
    id: 'c010',
    name: '王小明',
    email: 'wangxm@email.com',
    phone: '130****8901',
    currentPosition: 'NLP算法工程师',
    currentCompany: '百度',
    experience: '4年',
    education: '硕士',
    school: '哈尔滨工业大学',
    skills: ['BERT', 'GPT', 'LangChain', 'RAG', '文本分类', '信息抽取'],
    expectedSalary: '45-60K',
    location: '北京',
    summary: '4年NLP经验，专注文本理解和生成，有大模型应用落地经验。',
    workHistory: [
      { company: '百度', position: 'NLP工程师', duration: '2022-至今', description: '文心一言应用开发' },
      { company: '搜狗', position: 'NLP开发', duration: '2020-2022', description: '搜索NLP优化' }
    ],
    createdAt: '2026-01-06'
  },
  {
    id: 'c011',
    name: '李小红',
    email: 'lixh@email.com',
    phone: '189****2234',
    currentPosition: 'Android开发工程师',
    currentCompany: 'OPPO',
    experience: '5年',
    education: '本科',
    school: '西安电子科技大学',
    skills: ['Kotlin', 'Java', 'Jetpack', 'NDK', 'Flutter', 'Gradle'],
    expectedSalary: '35-45K',
    location: '深圳',
    summary: '5年Android开发经验，熟悉系统底层和性能优化，有亿级用户App开发经验。',
    workHistory: [
      { company: 'OPPO', position: 'Android开发', duration: '2021-至今', description: '系统应用开发' },
      { company: 'vivo', position: 'Android开发', duration: '2019-2021', description: '应用商店开发' }
    ],
    createdAt: '2026-01-05'
  },
  {
    id: 'c012',
    name: '张小华',
    email: 'zhangxh@email.com',
    phone: '188****3345',
    currentPosition: 'Go后端开发',
    currentCompany: '蚂蚁集团',
    experience: '4年',
    education: '硕士',
    school: '武汉大学',
    skills: ['Go', 'gRPC', 'etcd', 'MongoDB', '微服务', '分布式事务'],
    expectedSalary: '40-55K',
    location: '杭州',
    summary: '4年Go开发经验，精通微服务架构，有金融级系统开发经验。',
    workHistory: [
      { company: '蚂蚁集团', position: 'Go开发', duration: '2022-至今', description: '支付核心系统' },
      { company: '七牛云', position: '后端开发', duration: '2020-2022', description: '存储服务开发' }
    ],
    createdAt: '2026-01-04'
  },
  {
    id: 'c013',
    name: '刘小强',
    email: 'liuxq@email.com',
    phone: '187****4456',
    currentPosition: '安全工程师',
    currentCompany: '奇安信',
    experience: '4年',
    education: '本科',
    school: '电子科技大学',
    skills: ['渗透测试', '代码审计', 'Web安全', '逆向分析', 'Python', 'Linux'],
    expectedSalary: '35-50K',
    location: '北京',
    summary: '4年安全经验，精通Web安全和渗透测试，有SRC漏洞提交经历。',
    workHistory: [
      { company: '奇安信', position: '安全工程师', duration: '2022-至今', description: '安全服务与研究' },
      { company: '360', position: '安全研究员', duration: '2020-2022', description: '漏洞研究' }
    ],
    createdAt: '2026-01-03'
  },
  {
    id: 'c014',
    name: '陈小美',
    email: 'chenxm@email.com',
    phone: '186****5567',
    currentPosition: 'UI/UX设计师',
    currentCompany: '美团',
    experience: '5年',
    education: '本科',
    school: '中央美术学院',
    skills: ['Figma', 'Sketch', 'After Effects', '用户研究', '交互设计', '设计系统'],
    expectedSalary: '30-40K',
    location: '北京',
    summary: '5年UI/UX设计经验，有大型App设计经验，擅长设计系统搭建。',
    workHistory: [
      { company: '美团', position: 'UI/UX设计师', duration: '2021-至今', description: '美团App设计' },
      { company: '滴滴', position: '视觉设计师', duration: '2019-2021', description: '出行产品设计' }
    ],
    createdAt: '2026-01-02'
  },
  {
    id: 'c015',
    name: '杨小军',
    email: 'yangxj@email.com',
    phone: '185****6678',
    currentPosition: '测试开发工程师',
    currentCompany: '腾讯',
    experience: '4年',
    education: '本科',
    school: '北京邮电大学',
    skills: ['自动化测试', 'Selenium', 'Pytest', '性能测试', 'CI/CD', 'Python'],
    expectedSalary: '30-40K',
    location: '深圳',
    summary: '4年测试开发经验，精通自动化测试框架，有测试平台开发经验。',
    workHistory: [
      { company: '腾讯', position: '测试开发', duration: '2022-至今', description: '测试工具平台开发' },
      { company: '百度', position: '测试工程师', duration: '2020-2022', description: 'App自动化测试' }
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'c016',
    name: '黄小龙',
    email: 'huangxl@email.com',
    phone: '184****7789',
    currentPosition: 'MLOps工程师',
    currentCompany: '华为云',
    experience: '3年',
    education: '硕士',
    school: '同济大学',
    skills: ['MLflow', 'Kubeflow', 'Docker', 'Kubernetes', 'Python', 'TensorFlow Serving'],
    expectedSalary: '40-55K',
    location: '上海',
    summary: '3年MLOps经验，专注机器学习工程化，有大规模模型部署经验。',
    workHistory: [
      { company: '华为云', position: 'MLOps工程师', duration: '2023-至今', description: 'ModelArts平台开发' },
      { company: '第四范式', position: 'ML工程师', duration: '2021-2023', description: 'AutoML平台' }
    ],
    createdAt: '2025-12-31'
  },
  {
    id: 'c017',
    name: '赵小雪',
    email: 'zhaoxue@email.com',
    phone: '183****8890',
    currentPosition: '语音算法工程师',
    currentCompany: '科大讯飞',
    experience: '3年',
    education: '博士',
    school: '中国科学技术大学',
    skills: ['ASR', 'TTS', 'Kaldi', 'Whisper', 'VITS', '声纹识别'],
    expectedSalary: '45-60K',
    location: '合肥',
    summary: '3年语音算法经验，专注语音识别和合成，有产品级语音系统经验。',
    workHistory: [
      { company: '科大讯飞', position: '语音算法', duration: '2023-至今', description: '语音识别优化' },
      { company: '出门问问', position: '算法实习', duration: '2021-2023', description: 'TTS研究' }
    ],
    createdAt: '2025-12-30'
  },
  {
    id: 'c018',
    name: '孙小林',
    email: 'sunxl@email.com',
    phone: '182****9901',
    currentPosition: '强化学习工程师',
    currentCompany: '腾讯AI Lab',
    experience: '3年',
    education: '博士',
    school: '南京大学',
    skills: ['RL', 'DQN', 'PPO', 'A3C', 'Unity ML-Agents', 'OpenAI Gym'],
    expectedSalary: '50-70K',
    location: '深圳',
    summary: '3年强化学习经验，专注游戏AI和决策优化，有顶会论文发表。',
    workHistory: [
      { company: '腾讯AI Lab', position: 'RL工程师', duration: '2023-至今', description: '游戏AI研发' },
      { company: '网易伏羲', position: '算法研究', duration: '2021-2023', description: 'RL研究' }
    ],
    createdAt: '2025-12-29'
  },
  {
    id: 'c019',
    name: '周小凤',
    email: 'zhouxf@email.com',
    phone: '181****0012',
    currentPosition: 'Rust开发工程师',
    currentCompany: '蚂蚁集团',
    experience: '3年',
    education: '本科',
    school: '浙江大学',
    skills: ['Rust', 'WebAssembly', '系统编程', '并发编程', 'Tokio', 'Linux内核'],
    expectedSalary: '40-55K',
    location: '杭州',
    summary: '3年Rust开发经验，精通系统级编程，有高性能服务开发经验。',
    workHistory: [
      { company: '蚂蚁集团', position: 'Rust开发', duration: '2023-至今', description: '区块链底层开发' },
      { company: 'PingCAP', position: 'Rust开发', duration: '2021-2023', description: 'TiKV开发' }
    ],
    createdAt: '2025-12-28'
  },
  {
    id: 'c020',
    name: '吴小梅',
    email: 'wuxm@email.com',
    phone: '180****1123',
    currentPosition: '区块链开发',
    currentCompany: '趣链科技',
    experience: '4年',
    education: '硕士',
    school: '浙江大学',
    skills: ['Solidity', 'Go', '智能合约', '共识算法', 'Hyperledger', 'Web3'],
    expectedSalary: '40-55K',
    location: '杭州',
    summary: '4年区块链开发经验，精通智能合约和共识算法，有企业级区块链平台经验。',
    workHistory: [
      { company: '趣链科技', position: '区块链开发', duration: '2022-至今', description: '联盟链开发' },
      { company: '蚂蚁链', position: '区块链开发', duration: '2020-2022', description: '蚂蚁链底层' }
    ],
    createdAt: '2025-12-27'
  },
  {
    id: 'c021',
    name: '郑小伟',
    email: 'zhengxw@email.com',
    phone: '179****2234',
    currentPosition: '嵌入式开发',
    currentCompany: 'DJI大疆',
    experience: '5年',
    education: '本科',
    school: '哈尔滨工业大学',
    skills: ['C/C++', 'RTOS', 'ARM', '电机控制', 'ROS', '传感器融合'],
    expectedSalary: '35-50K',
    location: '深圳',
    summary: '5年嵌入式开发经验，精通无人机飞控系统，有硬件协同开发经验。',
    workHistory: [
      { company: 'DJI大疆', position: '嵌入式开发', duration: '2021-至今', description: '飞控系统开发' },
      { company: '华为', position: '嵌入式开发', duration: '2019-2021', description: '通信设备固件' }
    ],
    createdAt: '2025-12-26'
  },
  {
    id: 'c022',
    name: '王小芳',
    email: 'wangxf@email.com',
    phone: '178****3345',
    currentPosition: '3D视觉工程师',
    currentCompany: '极智嘉',
    experience: '3年',
    education: '硕士',
    school: '清华大学',
    skills: ['SLAM', '点云处理', 'PCL', 'ROS2', '三维重建', '深度相机'],
    expectedSalary: '40-55K',
    location: '北京',
    summary: '3年3D视觉经验，专注SLAM和点云处理，有机器人视觉系统经验。',
    workHistory: [
      { company: '极智嘉', position: '3D视觉', duration: '2023-至今', description: '仓储机器人视觉' },
      { company: '图森未来', position: '感知工程师', duration: '2021-2023', description: '自动驾驶感知' }
    ],
    createdAt: '2025-12-25'
  },
  {
    id: 'c023',
    name: '李小刚',
    email: 'lixg@email.com',
    phone: '177****4456',
    currentPosition: '推荐系统工程师',
    currentCompany: '快手',
    experience: '4年',
    education: '硕士',
    school: '北京大学',
    skills: ['推荐算法', 'Embedding', '召回排序', 'CTR预估', 'Spark', 'TensorFlow'],
    expectedSalary: '45-60K',
    location: '北京',
    summary: '4年推荐系统经验，专注召回和排序算法，有亿级DAU产品经验。',
    workHistory: [
      { company: '快手', position: '推荐工程师', duration: '2022-至今', description: '短视频推荐' },
      { company: '头条', position: '推荐开发', duration: '2020-2022', description: '信息流推荐' }
    ],
    createdAt: '2025-12-24'
  },
  {
    id: 'c024',
    name: '张小燕',
    email: 'zhangxy@email.com',
    phone: '176****5567',
    currentPosition: '搜索算法工程师',
    currentCompany: '百度',
    experience: '4年',
    education: '硕士',
    school: '上海交通大学',
    skills: ['Elasticsearch', 'Lucene', '向量检索', 'Query理解', 'NLP', '排序学习'],
    expectedSalary: '40-55K',
    location: '北京',
    summary: '4年搜索算法经验，精通全文检索和语义搜索，有大规模搜索系统经验。',
    workHistory: [
      { company: '百度', position: '搜索算法', duration: '2022-至今', description: '搜索相关性优化' },
      { company: '阿里', position: '搜索开发', duration: '2020-2022', description: '电商搜索' }
    ],
    createdAt: '2025-12-23'
  },
  {
    id: 'c025',
    name: '刘小敏',
    email: 'liuxm@email.com',
    phone: '175****6678',
    currentPosition: '知识图谱工程师',
    currentCompany: '美团',
    experience: '3年',
    education: '硕士',
    school: '复旦大学',
    skills: ['Neo4j', '图数据库', '实体识别', '关系抽取', '知识推理', 'SPARQL'],
    expectedSalary: '35-50K',
    location: '北京',
    summary: '3年知识图谱经验，专注知识构建和推理，有大规模图谱应用经验。',
    workHistory: [
      { company: '美团', position: '知识图谱', duration: '2023-至今', description: '美食知识图谱' },
      { company: '阿里', position: '图谱开发', duration: '2021-2023', description: '电商知识图谱' }
    ],
    createdAt: '2025-12-22'
  },
  {
    id: 'c026',
    name: '陈小平',
    email: 'chenxp@email.com',
    phone: '174****7789',
    currentPosition: 'AIGC算法工程师',
    currentCompany: 'Midjourney中国',
    experience: '2年',
    education: '硕士',
    school: '北京航空航天大学',
    skills: ['Stable Diffusion', 'ControlNet', 'LoRA', 'ComfyUI', 'PyTorch', 'Diffusers'],
    expectedSalary: '45-65K',
    location: '北京',
    summary: '2年AIGC经验，专注图像生成和控制，有商业级AIGC产品经验。',
    workHistory: [
      { company: 'Midjourney中国', position: 'AIGC算法', duration: '2024-至今', description: 'AI绘画算法' },
      { company: '美图', position: '算法工程师', duration: '2022-2024', description: '图像美化算法' }
    ],
    createdAt: '2025-12-21'
  },
  {
    id: 'c027',
    name: '杨小峰',
    email: 'yangxf@email.com',
    phone: '173****8890',
    currentPosition: '多模态算法工程师',
    currentCompany: '智谱AI',
    experience: '2年',
    education: '博士在读',
    school: '清华大学',
    skills: ['CLIP', 'BLIP', 'LLaVA', 'Vision-Language', 'PyTorch', 'Transformers'],
    expectedSalary: '50-70K',
    location: '北京',
    summary: '2年多模态经验，专注视觉语言模型，有多模态大模型研发经验。',
    workHistory: [
      { company: '智谱AI', position: '多模态算法', duration: '2024-至今', description: 'GLM多模态' },
      { company: '百度', position: '算法实习', duration: '2022-2024', description: '文心一言多模态' }
    ],
    createdAt: '2025-12-20'
  },
  {
    id: 'c028',
    name: '黄小英',
    email: 'huangxy@email.com',
    phone: '172****9901',
    currentPosition: 'AI Agent工程师',
    currentCompany: '月之暗面',
    experience: '2年',
    education: '硕士',
    school: '北京大学',
    skills: ['LangChain', 'AutoGPT', 'Function Calling', 'RAG', 'Agent', 'Prompt Engineering'],
    expectedSalary: '45-65K',
    location: '北京',
    summary: '2年AI Agent经验，专注Agent架构和应用，有大规模Agent系统经验。',
    workHistory: [
      { company: '月之暗面', position: 'Agent工程师', duration: '2024-至今', description: 'Kimi Agent开发' },
      { company: '阿里', position: 'AI开发', duration: '2022-2024', description: '通义千问应用' }
    ],
    createdAt: '2025-12-19'
  },
  {
    id: 'c029',
    name: '赵小慧',
    email: 'zhaoxh@email.com',
    phone: '171****0012',
    currentPosition: '自动驾驶感知工程师',
    currentCompany: '小鹏汽车',
    experience: '4年',
    education: '硕士',
    school: '浙江大学',
    skills: ['BEVFormer', 'OccNet', '点云处理', 'ROS', 'C++', '传感器融合'],
    expectedSalary: '50-70K',
    location: '广州',
    summary: '4年自动驾驶感知经验，专注BEV感知和多传感器融合，有L4级系统经验。',
    workHistory: [
      { company: '小鹏汽车', position: '感知工程师', duration: '2022-至今', description: 'XNGP感知系统' },
      { company: '百度Apollo', position: '感知开发', duration: '2020-2022', description: '障碍物检测' }
    ],
    createdAt: '2025-12-18'
  },
  {
    id: 'c030',
    name: '孙小康',
    email: 'sunxk@email.com',
    phone: '170****1123',
    currentPosition: '量化开发工程师',
    currentCompany: '幻方量化',
    experience: '3年',
    education: '博士',
    school: '北京大学',
    skills: ['Python', 'C++', '量化策略', '机器学习', '高频交易', '风险建模'],
    expectedSalary: '60-100K',
    location: '杭州',
    summary: '3年量化开发经验，专注高频策略和机器学习因子，有头部量化私募经验。',
    workHistory: [
      { company: '幻方量化', position: '量化开发', duration: '2023-至今', description: '高频策略开发' },
      { company: '九坤投资', position: '量化研究', duration: '2021-2023', description: '因子研究' }
    ],
    createdAt: '2025-12-17'
  }
]

export function getCandidateById(id: string): Candidate | undefined {
  return mockCandidates.find(c => c.id === id)
}

export function getCandidatesByIds(ids: string[]): Candidate[] {
  return mockCandidates.filter(c => ids.includes(c.id))
}
