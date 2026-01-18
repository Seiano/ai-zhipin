import { NextRequest } from 'next/server'

interface ResumeData {
  name: string
  skills: string[]
  experience: number
  education: string
  projects: string[]
  location: string
  salaryExpectation: number
}

interface JobRequirement {
  requiredSkills: string[]
  minExperience: number
  educationLevel: string
  location: string
  salaryBudget: number
}

interface MatchResult {
  score: number
  strengths: string[]
  concerns: string[]
  recommendation: 'strong' | 'medium' | 'weak'
}

export async function POST(request: NextRequest) {
  try {
    const { resume, jobId }: { resume: ResumeData; jobId: string } = await request.json()

    // 模拟获取职位要求（实际应用中从数据库获取）
    const jobRequirements: JobRequirement = {
      requiredSkills: ['Python', 'PyTorch', 'Transformer', 'NLP'],
      minExperience: 3,
      educationLevel: 'Master',
      location: '北京',
      salaryBudget: 50000
    }

    // 计算匹配分数
    let score = 0
    const strengths: string[] = []
    const concerns: string[] = []

    // 技能匹配
    const matchedSkills = resume.skills.filter(skill => 
      jobRequirements.requiredSkills.some(req => 
        skill.toLowerCase().includes(req.toLowerCase())
      )
    )
    
    const skillMatchRatio = matchedSkills.length / jobRequirements.requiredSkills.length
    score += skillMatchRatio * 40 // 技能占40%

    if (skillMatchRatio >= 0.8) {
      strengths.push(`技能匹配度高：${matchedSkills.join(', ')}`)
    } else if (skillMatchRatio >= 0.5) {
      strengths.push(`部分技能匹配：${matchedSkills.join(', ')}`)
    } else {
      concerns.push(`技能匹配度较低，缺少：${jobRequirements.requiredSkills.filter(s => !matchedSkills.includes(s)).join(', ')}`)
    }

    // 经验匹配
    if (resume.experience >= jobRequirements.minExperience) {
      score += 20 // 经验占20%
      strengths.push(`工作经验(${resume.experience}年)满足要求(${jobRequirements.minExperience}年)`)
    } else {
      concerns.push(`工作经验(${resume.experience}年)低于要求(${jobRequirements.minExperience}年)`)
    }

    // 教育背景
    const educationWeights = {
      'Doctorate': 15,
      'Master': 12,
      'Bachelor': 8,
      'High School': 3
    }
    
    if (educationWeights[resume.education as keyof typeof educationWeights] >= 
        educationWeights[jobRequirements.educationLevel as keyof typeof educationWeights]) {
      score += 15 // 教育背景占15%
      strengths.push(`${resume.education}教育背景符合要求`)
    } else {
      concerns.push(`教育背景(${resume.education})低于要求(${jobRequirements.educationLevel})`)
    }

    // 地点匹配
    if (resume.location === jobRequirements.location) {
      score += 10 // 地点占10%
      strengths.push(`地点匹配：均在北京`)
    } else {
      concerns.push(`地点不匹配：求职者在${resume.location}，岗位在北京`)
    }

    // 薪资匹配
    if (resume.salaryExpectation <= jobRequirements.salaryBudget * 1.1) {
      score += 10 // 薪资占10%
      strengths.push(`薪资期望(${resume.salaryExpectation}K)在预算范围内`)
    } else {
      concerns.push(`薪资期望(${resume.salaryExpectation}K)超出预算(${jobRequirements.salaryBudget}K)`)
    }

    // 项目经验
    const relevantProjects = resume.projects.filter(project => 
      jobRequirements.requiredSkills.some(skill => 
        project.toLowerCase().includes(skill.toLowerCase())
      )
    )
    
    if (relevantProjects.length > 0) {
      score += 5 // 项目经验占5%
      strengths.push(`有相关项目经验：${relevantProjects.slice(0, 2).join(', ')}`)
    }

    // 限制分数在0-100之间
    score = Math.min(100, Math.max(0, Math.round(score)))

    // 生成推荐结果
    let recommendation: 'strong' | 'medium' | 'weak'
    if (score >= 80) {
      recommendation = 'strong'
    } else if (score >= 60) {
      recommendation = 'medium'
    } else {
      recommendation = 'weak'
    }

    const result: MatchResult = {
      score,
      strengths,
      concerns,
      recommendation
    }

    return Response.json(result)
  } catch (error) {
    console.error('AI匹配分析出错:', error)
    return Response.json(
      { error: 'AI匹配分析失败' }, 
      { status: 500 }
    )
  }
}