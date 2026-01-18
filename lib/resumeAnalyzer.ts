/**
 * 简历分析与职位匹配算法
 */

import { type ResumeInfo } from './storage/resumeStorage'

// 职位数据类型（从mockData导入）
export interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  experience: string
  education: string
  type: string
  category: string
  level: string
  tags: string[]
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  postedDate: string
  isHot?: boolean
  isUrgent?: boolean
}

// 匹配结果
export interface MatchResult {
  job: Job
  score: number
  breakdown: {
    skillMatch: number      // 技能匹配度 (0-100)
    experienceMatch: number // 经验匹配度 (0-100)
    educationMatch: number  // 学历匹配度 (0-100)
    locationMatch: number   // 地点匹配度 (0-100)
    salaryMatch: number     // 薪资匹配度 (0-100)
  }
  matchedSkills: string[]
  missingSkills: string[]
  recommendation: 'strong' | 'medium' | 'weak'
}

// 搜索条件
export interface SearchCriteria {
  keywords: string[]
  categories: string[]
  locations: string[]
  minExperience: number
  maxExperience: number
  education: string[]
}

/**
 * 从简历中提取搜索关键词
 */
export function extractKeywordsFromResume(resume: ResumeInfo): string[] {
  const keywords = new Set<string>()
  
  // 1. 从技能中提取
  resume.skills.forEach(skill => {
    keywords.add(skill.toLowerCase())
  })
  
  // 2. 从期望职位中提取
  resume.desiredPositions?.forEach(pos => {
    // 分词提取
    const words = pos.split(/[\s,，、/]/g).filter(w => w.length > 1)
    words.forEach(w => keywords.add(w.toLowerCase()))
  })
  
  // 3. AI相关热门关键词映射（增强版 - 按领域细分）
  const skillKeywordMap: Record<string, string[]> = {
    // 计算机视觉相关
    'opencv': ['opencv', '计算机视觉', 'cv', '图像处理'],
    'yolo': ['yolo', '目标检测', '计算机视觉', 'cv', '实时检测'],
    'mask r-cnn': ['mask r-cnn', '实例分割', '计算机视觉', 'cv'],
    'resnet': ['resnet', '图像分类', 'cnn', '计算机视觉'],
    'slam': ['slam', '视觉slam', '3d视觉', '定位建图', '机器人'],
    'nerf': ['nerf', '3d重建', '神经渲染', '计算机视觉'],
    '3d视觉': ['3d视觉', '深度估计', '立体视觉', '点云', '计算机视觉'],
    '目标检测': ['目标检测', 'yolo', 'faster r-cnn', '计算机视觉'],
    '目标跟踪': ['目标跟踪', 'deepsort', 'bytetrack', '多目标跟踪'],
    '图像分割': ['图像分割', '语义分割', '实例分割', 'unet'],
    '姿态估计': ['姿态估计', 'openpose', 'hrnet', '人体关键点'],
    'tensorrt': ['tensorrt', '模型部署', '推理优化', '模型加速'],
    'cuda': ['cuda', 'gpu编程', '并行计算', '性能优化'],
    
    // NLP相关
    'python': ['python', '机器学习', 'ML'],
    'pytorch': ['pytorch', '深度学习', 'DL'],
    'tensorflow': ['tensorflow', '深度学习'],
    'nlp': ['nlp', '自然语言处理', '文本分类', 'bert', 'gpt'],
    'bert': ['bert', 'nlp', '预训练', '文本理解'],
    'transformer': ['transformer', '大模型', 'attention', '自注意力'],
    
    // 大模型相关
    'llm': ['llm', '大模型', 'gpt', 'transformer'],
    'gpt': ['gpt', '大语言模型', 'llm', '生成式ai'],
    'llama': ['llama', '大模型', 'llm', '开源大模型'],
    'rlhf': ['rlhf', '强化学习', '人类反馈', '对齐'],
    'lora': ['lora', '微调', '参数高效', 'peft'],
    'rag': ['rag', '检索增强', '知识库', 'langchain'],
    
    // 通用
    '深度学习': ['深度学习', 'deep learning', '神经网络'],
    '机器学习': ['机器学习', 'ml', 'sklearn'],
  }
  
  // 扩展关键词
  resume.skills.forEach(skill => {
    const lowerSkill = skill.toLowerCase()
    Object.entries(skillKeywordMap).forEach(([key, values]) => {
      if (lowerSkill.includes(key) || key.includes(lowerSkill)) {
        values.forEach(v => keywords.add(v.toLowerCase()))
      }
    })
  })
  
  return Array.from(keywords).slice(0, 10) // 限制最多10个关键词
}

/**
 * 生成搜索条件
 */
export function generateSearchCriteria(resume: ResumeInfo): SearchCriteria {
  const keywords = extractKeywordsFromResume(resume)
  
  // 根据技能推断可能的分类（增强版 - 更精确的CV识别）
  const categories: string[] = []
  const skillCategoryMap: Record<string, string[]> = {
    'nlp': ['nlp', 'bert', 'gpt', 'transformer', '文本', '语言模型', '自然语言', 'ner', '命名实体'],
    'cv': ['opencv', '图像', '视觉', 'yolo', '检测', '分割', '目标检测', '目标跟踪', 'slam', '3d视觉', 
           'mask r-cnn', 'resnet', 'vgg', 'cnn', '图像处理', '计算机视觉', 'nerf', '姿态估计',
           'ocr', '人脸识别', '图像分类', '语义分割', '实例分割', '深度估计', '光流', '立体视觉'],
    'llm': ['llm', '大模型', 'chatgpt', 'langchain', 'rag', 'llama', 'rlhf', 'lora', '微调'],
    'ml': ['sklearn', '机器学习', '特征工程', 'xgboost', 'lightgbm', '随机森林'],
    'aiagent': ['agent', 'autogpt', 'langchain', '多智能体', 'function calling'],
    'aigc': ['diffusion', 'stable diffusion', 'midjourney', '生成', 'gan', 'vae', '文生图'],
    'robotics': ['slam', '机器人', '自动驾驶', '感知', 'ros', '具身智能', '运动控制'],
    'speech': ['语音', 'asr', 'tts', '声纹', '语音识别', '语音合成'],
    'aiops': ['mlops', 'kubernetes', 'docker', '模型部署', 'tensorrt', 'onnx', '推理优化'],
    'hardware': ['cuda', 'fpga', 'npu', '芯片', '编译器', 'llvm', 'tvm'],
  }
  
  Object.entries(skillCategoryMap).forEach(([category, relatedSkills]) => {
    const hasRelated = resume.skills.some(skill => 
      relatedSkills.some(rs => skill.toLowerCase().includes(rs))
    )
    if (hasRelated && !categories.includes(category)) {
      categories.push(category)
    }
  })
  
  return {
    keywords,
    categories: categories.length > 0 ? categories : ['llm', 'nlp', 'ml'],
    locations: resume.location ? [resume.location] : [],
    minExperience: Math.max(0, resume.experience - 1),
    maxExperience: resume.experience + 2,
    education: [resume.education]
  }
}

/**
 * 计算技能匹配度
 */
function calculateSkillMatch(jobTags: string[], resumeSkills: string[]): { score: number; matched: string[]; missing: string[] } {
  const jobTagsLower = jobTags.map(t => t.toLowerCase())
  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase())
  
  const matched: string[] = []
  const missing: string[] = []
  
  jobTagsLower.forEach((tag, index) => {
    const isMatched = resumeSkillsLower.some(skill => 
      skill.includes(tag) || tag.includes(skill) || 
      // 模糊匹配
      levenshteinDistance(skill, tag) <= 2
    )
    if (isMatched) {
      matched.push(jobTags[index])
    } else {
      missing.push(jobTags[index])
    }
  })
  
  const score = jobTags.length > 0 ? (matched.length / jobTags.length) * 100 : 50
  return { score: Math.round(score), matched, missing }
}

/**
 * 计算经验匹配度
 */
function calculateExperienceMatch(jobExperience: string, resumeExperience: number): number {
  // 解析职位要求的经验
  const match = jobExperience.match(/(\d+)[-~]?(\d+)?/)
  if (!match) return 80 // 无法解析时给默认值
  
  const minExp = parseInt(match[1])
  const maxExp = match[2] ? parseInt(match[2]) : minExp + 3
  
  if (resumeExperience >= minExp && resumeExperience <= maxExp) {
    return 100
  } else if (resumeExperience >= minExp - 1 && resumeExperience <= maxExp + 1) {
    return 80
  } else if (resumeExperience < minExp) {
    return Math.max(30, 100 - (minExp - resumeExperience) * 20)
  } else {
    return 90 // 经验超出要求，仍然可以
  }
}

/**
 * 计算学历匹配度
 */
function calculateEducationMatch(jobEducation: string, resumeEducation: string): number {
  const eduLevels: Record<string, number> = {
    '大专': 1,
    '本科': 2,
    '硕士': 3,
    '博士': 4
  }
  
  const jobLevel = Object.entries(eduLevels).find(([key]) => jobEducation.includes(key))?.[1] || 2
  const resumeLevel = eduLevels[resumeEducation] || 2
  
  if (resumeLevel >= jobLevel) return 100
  if (resumeLevel === jobLevel - 1) return 70
  return 40
}

/**
 * 计算地点匹配度
 */
function calculateLocationMatch(jobLocation: string, resumeLocation: string): number {
  if (!resumeLocation) return 80
  
  const jobLoc = jobLocation.toLowerCase()
  const resumeLoc = resumeLocation.toLowerCase()
  
  if (jobLoc.includes(resumeLoc) || resumeLoc.includes(jobLoc)) return 100
  
  // 同一城市群
  const cityGroups = [
    ['北京', '天津', '雄安'],
    ['上海', '苏州', '杭州', '南京'],
    ['深圳', '广州', '东莞', '佛山'],
  ]
  
  for (const group of cityGroups) {
    const jobInGroup = group.some(c => jobLoc.includes(c))
    const resumeInGroup = group.some(c => resumeLoc.includes(c))
    if (jobInGroup && resumeInGroup) return 80
  }
  
  return 50 // 不在同一区域
}

/**
 * 计算薪资匹配度
 */
function calculateSalaryMatch(jobSalary: string, resumeSalaryExpectation?: number): number {
  if (!resumeSalaryExpectation) return 80
  
  // 解析薪资范围，如 "50-100K" 或 "30-50K·14薪"
  const match = jobSalary.match(/(\d+)[-~](\d+)/)
  if (!match) return 80
  
  const minSalary = parseInt(match[1])
  const maxSalary = parseInt(match[2])
  
  if (resumeSalaryExpectation >= minSalary && resumeSalaryExpectation <= maxSalary) {
    return 100
  } else if (resumeSalaryExpectation < minSalary) {
    return 90 // 期望低于范围，对求职者有利
  } else {
    // 期望高于范围
    const diff = resumeSalaryExpectation - maxSalary
    return Math.max(30, 100 - diff * 5)
  }
}

/**
 * 计算综合匹配度
 */
export function calculateMatchScore(job: Job, resume: ResumeInfo): MatchResult {
  const skillResult = calculateSkillMatch(job.tags, resume.skills)
  const experienceMatch = calculateExperienceMatch(job.experience, resume.experience)
  const educationMatch = calculateEducationMatch(job.education, resume.education)
  const locationMatch = calculateLocationMatch(job.location, resume.location)
  const salaryMatch = calculateSalaryMatch(job.salary, resume.salaryExpectation)
  
  // 加权计算总分
  const weights = {
    skill: 0.40,
    experience: 0.20,
    education: 0.15,
    location: 0.10,
    salary: 0.15
  }
  
  const totalScore = Math.round(
    skillResult.score * weights.skill +
    experienceMatch * weights.experience +
    educationMatch * weights.education +
    locationMatch * weights.location +
    salaryMatch * weights.salary
  )
  
  // 确定推荐级别
  let recommendation: 'strong' | 'medium' | 'weak'
  if (totalScore >= 85) recommendation = 'strong'
  else if (totalScore >= 70) recommendation = 'medium'
  else recommendation = 'weak'
  
  return {
    job,
    score: totalScore,
    breakdown: {
      skillMatch: skillResult.score,
      experienceMatch,
      educationMatch,
      locationMatch,
      salaryMatch
    },
    matchedSkills: skillResult.matched,
    missingSkills: skillResult.missing,
    recommendation
  }
}

/**
 * 对职位列表进行匹配排序
 */
export function rankJobs(jobs: Job[], resume: ResumeInfo): MatchResult[] {
  const results = jobs.map(job => calculateMatchScore(job, resume))
  
  // 按匹配度降序排序
  results.sort((a, b) => b.score - a.score)
  
  return results
}

/**
 * 筛选高匹配度职位
 */
export function filterHighMatchJobs(jobs: Job[], resume: ResumeInfo, threshold: number = 70): MatchResult[] {
  const ranked = rankJobs(jobs, resume)
  return ranked.filter(result => result.score >= threshold)
}

/**
 * 计算Levenshtein距离（用于模糊匹配）
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}
