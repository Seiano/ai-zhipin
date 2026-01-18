/**
 * 简历数据本地存储管理
 * 使用localStorage存储用户简历信息
 */

// 简历数据结构
export interface ResumeInfo {
  name: string
  email?: string
  phone?: string
  skills: string[]
  experience: number // 工作年限
  education: string // '本科' | '硕士' | '博士' | '大专'
  desiredPositions: string[]
  location: string
  salaryExpectation?: number // 期望月薪（K）
  summary?: string
  workExperience?: string
  detailedProjects?: Array<{
    name: string
    techStack: string[]
    achievements: string[]
  }>
  certifications?: string
  updatedAt?: number
}

// localStorage key
const RESUME_STORAGE_KEY = 'user_resume'

/**
 * 保存简历到localStorage
 */
export function saveResume(resume: ResumeInfo): void {
  if (typeof window === 'undefined') return
  
  const dataToSave = {
    ...resume,
    updatedAt: Date.now()
  }
  
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (error) {
    console.error('保存简历失败:', error)
  }
}

/**
 * 从localStorage加载简历
 */
export function loadResume(): ResumeInfo | null {
  if (typeof window === 'undefined') return null
  
  try {
    const data = localStorage.getItem(RESUME_STORAGE_KEY)
    if (!data) return null
    return JSON.parse(data) as ResumeInfo
  } catch (error) {
    console.error('加载简历失败:', error)
    return null
  }
}

/**
 * 检查是否已有简历
 */
export function hasResume(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(RESUME_STORAGE_KEY) !== null
}

/**
 * 删除简历
 */
export function clearResume(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(RESUME_STORAGE_KEY)
}

/**
 * 从表单数据转换为ResumeInfo格式
 */
export function formDataToResumeInfo(formData: {
  name: string
  email: string
  phone: string
  location: string
  title: string
  experience: string
  education: string
  skills: string
  summary: string
  workExperience: string
  projects: string
  certifications: string
}): ResumeInfo {
  // 解析技能字符串为数组
  const skillsArray = formData.skills
    .split(/[,，、\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  // 解析经验年限
  const expMatch = formData.experience.match(/(\d+)/)
  const experienceYears = expMatch ? parseInt(expMatch[1]) : 0

  // 解析教育背景
  let education = '本科'
  if (formData.education.includes('博士')) education = '博士'
  else if (formData.education.includes('硕士')) education = '硕士'
  else if (formData.education.includes('大专')) education = '大专'

  // 解析期望职位
  const desiredPositions = formData.title
    .split(/[,，、\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  // 解析项目经验
  const projects = formData.projects
    .split(/\n\n/)
    .filter(p => p.trim())
    .map(p => {
      const lines = p.split('\n')
      return {
        name: lines[0] || '项目',
        techStack: skillsArray.slice(0, 5),
        achievements: lines.slice(1).filter(l => l.trim())
      }
    })

  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    skills: skillsArray,
    experience: experienceYears,
    education,
    desiredPositions,
    location: formData.location,
    summary: formData.summary,
    workExperience: formData.workExperience,
    detailedProjects: projects.length > 0 ? projects : undefined,
    certifications: formData.certifications || undefined
  }
}

/**
 * 获取演示简历数据（当用户未填写时使用）
 * 默认返回张三 - 5年计算机视觉专家
 * 参考专业简历格式，包含完整的工作经历和项目经验
 */
export function getDemoResume(): ResumeInfo {
  return {
    name: '张三',
    email: 'zhangsan_cv@example.com',
    phone: '135-1234-6666',
    skills: [
      // 模型算法
      'YOLOv3', 'YOLOv5', 'YOLOv8', 'Faster R-CNN', 'Mask R-CNN',
      'U-Net', 'DeepLab', 'DeepSORT', 'ByteTrack', 'FairMOT', 'HRNet',
      // 图像处理
      'OpenCV', '高斯滤波', '卡尔曼滤波', 'CLAHE', '图像增强',
      // 3D视觉
      'RAFT-Stereo', 'PSMNet', '双目视觉', '深度估计',
      'ORB-SLAM', 'VINS', '视觉SLAM', 'NeRF', '点云处理', 'PCL',
      // 工程部署
      'TensorRT', 'ONNX', 'CUDA', 'GPU加速', '模型量化', '边缘部署',
      // 开发语言和框架
      'Python', 'C++', 'PyTorch', 'TensorFlow', 'ROS',
      // 业务能力
      '目标检测', '目标跟踪', '图像分割', '姿态估计', 'ReID', '缺陷检测'
    ],
    experience: 5,
    education: '硕士',
    desiredPositions: [
      '视觉算法工程师',
      '计算机视觉技术专家',
      '3D视觉算法工程师',
      '自动驾驶感知算法工程师'
    ],
    location: '深圳',
    salaryExpectation: 55,
    summary: `五年深耕计算机视觉技术领域，主导8个跨行业视觉项目从0到1落地，覆盖无人机感知、智慧城市、工业质检、机器人定位等多元场景。

核心优势：
1. 视觉技术深耕五载：精通目标检测、多目标跟踪、3D视觉、SLAM等核心技术，兼具算法研发深度与场景化落地能力
2. 算法与工程双驱：深耕YOLO系列、Faster R-CNN等主流模型，擅长TensorRT量化加速、CUDA优化、边缘计算部署
3. 3D视觉与多模态融合：具备双目立体视觉、视觉SLAM、多传感器融合经验
4. 全链路交付能力：从需求分析、算法设计到硬件部署，已交付多个千万级视觉项目`,
    workExperience: `2022.03 - 至今  深圳市大疆创新科技有限公司  资深计算机视觉算法工程师
• 主导无人机视觉感知系统核心算法研发，负责目标检测、多目标跟踪、视觉避障等模块
• 攻克高速运动场景下的目标跟踪难题，设计自适应特征融合策略，跟踪成功率从78%提升至94%
• 优化视觉算法在嵌入式平台部署，推理速度提升3倍，功耗降低40%

2019.07 - 2022.02  北京商汤科技开发有限公司  计算机视觉算法工程师
• 负责智慧城市视频分析平台核心算法研发，包括行人检测、车辆识别、人脸属性分析
• 主导千路视频实时分析系统架构设计，单GPU支持200路视频并发处理
• 参与多个政府智慧城市项目交付，累计服务10+城市，处理视频数据100PB+`,
    detailedProjects: [
      {
        name: '无人机智能跟踪系统（2023.01-2023.12）',
        techStack: ['YOLOv8', 'CBAM', 'BiFPN', 'DeepSORT', 'ByteTrack', 'TensorRT', 'CUDA', 'ROS'],
        achievements: [
          '项目背景：解决消费级无人机在复杂场景下目标跟踪丢失问题，实现高速运动、遮挡、光照变化等场景下的鲁棒跟踪',
          '角色：技术负责人、核心算法开发',
          '设计改进的YOLOv8检测网络，引入CBAM注意力模块和BiFPN特征融合，小目标检测mAP提升8%',
          '开发自适应多目标跟踪算法，融合外观特征和运动预测，支持同时稳定跟踪50+目标',
          '实现基于TensorRT的端到端部署，在Jetson Orin平台达到60fps实时处理',
          '成果：检测精度mAP达94.5%，跟踪成功率94%，ID切换率降低70%，已部署到3款商业无人机产品，获2项发明专利'
        ]
      },
      {
        name: '双目立体视觉测距系统（2022.06-2023.06）',
        techStack: ['RAFT-Stereo', 'PSMNet', 'OpenCV', 'PCL', 'CUDA', 'C++'],
        achievements: [
          '项目背景：为无人机避障系统提供高精度深度感知能力，支持户外强光、弱光、无纹理等复杂环境',
          '角色：核心开发者',
          '基于RAFT-Stereo框架优化立体匹配网络，针对无纹理区域引入边缘引导损失函数',
          '设计多尺度特征融合策略，提升远距离（>10m）场景的深度估计精度',
          '实现CUDA加速的视差计算和点云生成，单帧处理时间<30ms',
          '成果：10米范围内深度估计误差<1%，支持0.1lux低光照到100klux强光环境，获2项发明专利'
        ]
      },
      {
        name: '智慧城市行人分析平台（2020.03-2021.12）',
        techStack: ['YOLOv5', 'FairMOT', 'ReID', 'TensorRT', 'Kafka', 'Redis'],
        achievements: [
          '项目背景：为智慧城市提供大规模视频分析能力，支持千路视频实时处理',
          '角色：算法负责人',
          '设计轻量化行人检测网络，基于YOLOv5进行通道剪枝和知识蒸馏，模型体积减小60%',
          '开发高性能ReID特征提取模块，支持跨摄像头行人重识别',
          '设计分布式视频处理架构，通过Kafka消息队列和GPU集群实现弹性扩展',
          '成果：行人检测准确率99.2%，ReID Top-1准确率95%，单GPU支持200路视频，日处理10TB+数据'
        ]
      },
      {
        name: '工业产线视觉缺陷检测系统（2021.06-2022.02）',
        techStack: ['Mask R-CNN', 'FPN', 'AutoEncoder', 'OpenCV', 'PyTorch', 'C++'],
        achievements: [
          '项目背景：解决PCB板生产线人工质检效率低、漏检率高的问题',
          '角色：项目负责人',
          '搭建高精度视觉采集系统，选用500万像素工业相机配合远心镜头，实现10μm分辨率成像',
          '开发改进的Mask R-CNN缺陷检测网络，引入FPN多尺度特征融合，提升小缺陷检出率',
          '设计异常检测辅助模块，基于自编码器检测训练集未覆盖的新型缺陷',
          '成果：缺陷检出率99.8%，误检率<0.5%，效率较人工提升10倍，已在3家电子厂部署'
        ]
      },
      {
        name: '视觉SLAM定位建图系统（2022.08-2023.03）',
        techStack: ['ORB-SLAM3', 'VINS-Mono', 'g2o', 'OpenCV', 'ROS', 'C++'],
        achievements: [
          '项目背景：为室内机器人和AGV提供高精度定位能力，在GPS失效环境实现厘米级定位',
          '角色：核心开发者',
          '基于ORB-SLAM3框架进行二次开发，优化特征提取和匹配策略',
          '融合IMU数据实现视觉惯性里程计，提升快速运动场景的鲁棒性',
          '开发回环检测和全局优化模块，消除累积漂移误差',
          '成果：定位精度<2cm（室内100m²范围），支持30fps实时定位，已应用于2款AGV产品'
        ]
      }
    ]
  }
}
