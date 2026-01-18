/**
 * 简历隐私控制模块
 * 管理简历的公开/私密信息分离和授权访问
 */

import { ResumeInfo } from './storage/resumeStorage'

/**
 * 简历隐私数据结构
 */
export interface ResumePrivacy {
  userId: string
  publicInfo: {
    name: string
    currentTitle: string
    yearsOfExperience: number
    topSkills: string[] // 只显示前3个技能
    education: string   // 只显示学历层次
    location: string
  }
  privateInfo: {
    fullResume: ResumeInfo
    detailedProjects: Array<{
      name: string
      description?: string
      techStack: string[]
      achievements: string[]
      role?: string
      teamSize?: number
    }>
    contactInfo: {
      phone?: string
      email?: string
      wechat?: string
    }
    salaryExpectation: number
    workHistory?: string
  }
  accessGranted: string[] // 已授权查看的职位ID列表
  accessLog: Array<{
    jobId: string
    grantedAt: Date
    accessType: 'greeting' | 'manual'
  }>
}

/**
 * 从完整简历创建隐私控制对象
 */
export function createResumePrivacy(
  userId: string,
  resume: ResumeInfo,
  currentTitle?: string
): ResumePrivacy {
  return {
    userId,
    publicInfo: {
      name: resume.name,
      currentTitle: currentTitle || resume.desiredPositions?.[0] || 'AI工程师',
      yearsOfExperience: resume.experience,
      topSkills: resume.skills.slice(0, 3),
      education: resume.education,
      location: resume.location
    },
    privateInfo: {
      fullResume: resume,
      detailedProjects: resume.detailedProjects || [],
      contactInfo: {
        phone: resume.phone,
        email: resume.email
      },
      salaryExpectation: resume.salaryExpectation || 0,
      workHistory: resume.workExperience
    },
    accessGranted: [],
    accessLog: []
  }
}

/**
 * 授权某个职位查看完整简历
 */
export function grantAccess(
  privacy: ResumePrivacy,
  jobId: string,
  accessType: 'greeting' | 'manual' = 'greeting'
): ResumePrivacy {
  if (!privacy.accessGranted.includes(jobId)) {
    return {
      ...privacy,
      accessGranted: [...privacy.accessGranted, jobId],
      accessLog: [
        ...privacy.accessLog,
        {
          jobId,
          grantedAt: new Date(),
          accessType
        }
      ]
    }
  }
  return privacy
}

/**
 * 撤销某个职位的简历访问权限
 */
export function revokeAccess(
  privacy: ResumePrivacy,
  jobId: string
): ResumePrivacy {
  return {
    ...privacy,
    accessGranted: privacy.accessGranted.filter(id => id !== jobId)
  }
}

/**
 * 检查某个职位是否有权限查看完整简历
 */
export function hasAccess(
  privacy: ResumePrivacy,
  jobId: string
): boolean {
  return privacy.accessGranted.includes(jobId)
}

/**
 * 获取简历信息（根据权限返回不同内容）
 */
export function getResumeInfo(
  privacy: ResumePrivacy,
  jobId: string
): {
  hasFullAccess: boolean
  info: ResumePrivacy['publicInfo'] | ResumePrivacy['privateInfo']
} {
  const hasFullAccess = hasAccess(privacy, jobId)
  
  return {
    hasFullAccess,
    info: hasFullAccess ? privacy.privateInfo : privacy.publicInfo
  }
}

/**
 * 格式化简历信息为字符串（用于LLM提示词）
 */
export function formatResumeForPrompt(
  privacy: ResumePrivacy,
  jobId: string
): string {
  const { hasFullAccess, info } = getResumeInfo(privacy, jobId)
  
  if (hasFullAccess) {
    const privateInfo = info as ResumePrivacy['privateInfo']
    const resume = privateInfo.fullResume
    
    let prompt = `【完整简历 - 已授权查看】
姓名：${resume.name}
当前职位：${privacy.publicInfo.currentTitle}
工作年限：${resume.experience}年
学历：${resume.education}
地点：${resume.location}
技能：${resume.skills.join('、')}
`
    
    if (resume.summary) {
      prompt += `\n个人简介：${resume.summary}`
    }
    
    if (privateInfo.workHistory) {
      prompt += `\n\n工作经历：\n${privateInfo.workHistory}`
    }
    
    if (privateInfo.detailedProjects && privateInfo.detailedProjects.length > 0) {
      prompt += `\n\n项目经验：`
      privateInfo.detailedProjects.forEach((project, index) => {
        prompt += `\n${index + 1}. ${project.name}`
        if (project.description) {
          prompt += `\n   描述：${project.description}`
        }
        if (project.techStack && project.techStack.length > 0) {
          prompt += `\n   技术栈：${project.techStack.join('、')}`
        }
        if (project.achievements && project.achievements.length > 0) {
          prompt += `\n   成就：${project.achievements.join('；')}`
        }
        if (project.role) {
          prompt += `\n   角色：${project.role}`
        }
      })
    }
    
    if (privateInfo.salaryExpectation) {
      prompt += `\n\n期望薪资：${privateInfo.salaryExpectation}K/月`
    }
    
    return prompt
  } else {
    const publicInfo = info as ResumePrivacy['publicInfo']
    
    return `【公开简历信息 - 未授权查看完整简历】
姓名：${publicInfo.name}
当前职位：${publicInfo.currentTitle}
工作年限：${publicInfo.yearsOfExperience}年
主要技能：${publicInfo.topSkills.join('、')}
学历：${publicInfo.education}
地点：${publicInfo.location}

注意：候选人尚未主动打招呼，您只能看到公开信息。
等候选人发起对话后，您将获得查看完整简历的权限。`
  }
}

/**
 * 获取简历的简短公开描述（用于列表展示）
 */
export function getPublicSummary(privacy: ResumePrivacy): string {
  const { publicInfo } = privacy
  return `${publicInfo.name} | ${publicInfo.currentTitle} | ${publicInfo.yearsOfExperience}年经验 | ${publicInfo.topSkills.join('/')} | ${publicInfo.education} | ${publicInfo.location}`
}

/**
 * 检查简历是否与职位匹配（基础匹配，不需要授权）
 */
export function quickMatchCheck(
  privacy: ResumePrivacy,
  jobTags: string[],
  requiredExperience?: number
): {
  isMatch: boolean
  matchScore: number
  matchedSkills: string[]
} {
  const skills = privacy.publicInfo.topSkills
  const matchedSkills = skills.filter(skill =>
    jobTags.some(tag =>
      tag.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(tag.toLowerCase())
    )
  )
  
  const skillScore = (matchedSkills.length / Math.max(skills.length, 1)) * 100
  const experienceMatch = requiredExperience
    ? privacy.publicInfo.yearsOfExperience >= requiredExperience
    : true
  
  const matchScore = skillScore * (experienceMatch ? 1 : 0.7)
  
  return {
    isMatch: matchScore >= 40,
    matchScore: Math.round(matchScore),
    matchedSkills
  }
}
