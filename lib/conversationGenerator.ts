/**
 * AI对话内容生成器
 * 生成求职者AI与电子HR之间的对话
 */

import { type ResumeInfo } from './storage/resumeStorage'
import { type Job, type MatchResult } from './resumeAnalyzer'

// 对话消息
export interface ConversationMessage {
  id: string
  role: 'jobseeker_ai' | 'electronic_hr' | 'system'
  content: string
  timestamp: number
}

// 对话上下文
export interface ConversationContext {
  job: Job
  resume: ResumeInfo
  matchResult: MatchResult
  messages: ConversationMessage[]
  round: number
}

/**
 * 生成求职者AI的开场白
 */
export function generateGreeting(resume: ResumeInfo, job: Job, matchResult: MatchResult): string {
  const templates = [
    `您好！我是${resume.name}，看到贵公司${job.company}的${job.title}职位非常感兴趣。我有${resume.experience}年${resume.desiredPositions?.[0] || 'AI'}相关经验，擅长${resume.skills.slice(0, 3).join('、')}等技术。希望能进一步了解这个机会。`,
    
    `您好！我对${job.company}的${job.title}岗位很感兴趣。我是${resume.name}，${resume.experience}年工作经验，主要技术栈包括${resume.skills.slice(0, 4).join('、')}。我注意到这个职位与我的背景非常匹配，期待与您交流。`,
    
    `您好！我叫${resume.name}，是一名有${resume.experience}年经验的${resume.desiredPositions?.[0] || 'AI工程师'}。看到${job.title}这个职位的要求，我觉得与我的技能非常契合。我在${resume.skills.slice(0, 2).join('和')}方面有丰富的实战经验，希望能有机会详细介绍。`
  ]
  
  return templates[Math.floor(Math.random() * templates.length)]
}

/**
 * 生成电子HR的回复
 */
export function generateHRResponse(context: ConversationContext): string {
  const { job, resume, matchResult, round } = context
  
  if (round === 1) {
    // 第一轮：欢迎并询问项目经验
    const templates = [
      `你好${resume.name}！我是${job.company}的AI招聘助手。很高兴收到你的申请！我已经查看了你的简历，让我们来聊聊${job.title}这个职位吧。我注意到你有${resume.skills.slice(0, 3).join('、')}相关的经验，能否详细介绍一下你在这些技术上最得意的项目？`,
      
      `${resume.name}你好！欢迎来到${job.company}！我是负责${job.title}岗位招聘的AI助手。你的背景看起来很不错！我们这个职位需要${job.tags.slice(0, 3).join('、')}方面的能力，能分享一下你最有成就感的项目经历吗？`,
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  if (round === 2) {
    // 第二轮：针对技术细节提问
    const templates = [
      `很有意思的项目！我想进一步了解一下技术细节。在你的项目中，你是如何处理${job.tags[0] || '核心算法'}相关的挑战的？有没有遇到什么性能瓶颈，你是怎么优化的？`,
      
      `听起来很棒！我们团队目前也在做类似的工作。能详细说说你在${matchResult.matchedSkills[0] || '模型优化'}方面的具体方案吗？比如你们的模型规模、训练数据量、以及达到的效果？`,
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  if (round === 3) {
    // 第三轮：询问期望和职业规划
    const templates = [
      `你的技术能力我很认可！接下来聊聊你的期望吧。关于薪资，你的期望范围是多少？还有，你对职业发展有什么规划？`,
      
      `非常好！你的经验很符合我们的需求。最后想了解一下，你期望的薪资是多少？最快什么时候可以入职？`,
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  // 第四轮及以后：总结并推荐
  if (matchResult.score >= 85) {
    return `太棒了！你的经验和技术栈与我们的要求非常匹配，匹配度达到${matchResult.score}%！我会把你的简历优先推荐给技术团队负责人，稍后会有HR与你联系安排下一步面试。祝你好运！`
  } else if (matchResult.score >= 70) {
    return `感谢你的分享！综合评估下来，你与这个岗位的匹配度是${matchResult.score}%。虽然有些方面需要进一步了解，但总体来说你的背景还是很有竞争力的。我会把你加入候选名单，后续有进展会通知你。`
  } else {
    return `感谢你对${job.company}的关注！根据我们的评估，这个岗位可能不是最适合你的选择，我建议你可以看看我们其他的岗位机会。祝你求职顺利！`
  }
}

/**
 * 生成求职者AI的回复
 */
export function generateSeekerResponse(context: ConversationContext, hrMessage: string): string {
  const { resume, round, matchResult } = context
  
  if (round === 1) {
    // 回答项目经验问题
    const project = resume.detailedProjects?.[0]
    if (project) {
      return `在我最近的项目"${project.name}"中，我主要负责${project.techStack.slice(0, 3).join('、')}相关的开发工作。这个项目让我${project.achievements[0] || '深入理解了从数据处理到模型部署的完整流程'}。我使用${resume.skills[0]}和${resume.skills[1]}技术栈，${project.achievements[1] || '成功地提升了系统性能'}。这个项目让我深刻理解了实际业务场景中的技术挑战。`
    }
    return `在我最近的项目中，我负责了端到端的${resume.desiredPositions?.[0] || 'AI'}解决方案。具体来说，我使用${resume.skills.slice(0, 3).join('、')}技术栈，成功地提升了系统性能30%以上。这个项目让我深刻理解了从数据处理到模型部署的完整流程，也锻炼了我的问题解决能力和团队协作能力。`
  }
  
  if (round === 2) {
    // 回答技术细节问题
    return `在技术实现上，我采用了${matchResult.matchedSkills.slice(0, 2).join('和')}的组合方案。针对性能优化，我主要从三个方面入手：首先是数据层面的优化，通过数据增强和采样策略提升训练效率；其次是模型层面，使用了知识蒸馏和量化技术降低推理延迟；最后是工程层面，实现了模型并行和批量推理。最终将延迟从500ms降低到50ms以内。`
  }
  
  if (round === 3) {
    // 回答期望问题
    const salary = resume.salaryExpectation 
      ? `我的期望薪资是${resume.salaryExpectation}K左右，当然具体可以根据岗位情况协商`
      : '关于薪资，我希望与市场行情和岗位职责匹配，可以进一步详谈'
    
    return `${salary}。关于入职时间，如果一切顺利，我可以在一个月内完成交接。职业发展方面，我希望能在${resume.desiredPositions?.[0] || 'AI'}领域深耕，短期目标是成为技术专家，长期希望能带领团队解决更有挑战性的问题。`
  }
  
  // 结束语
  return `非常感谢您的时间和认可！我对${context.job.company}的这个机会非常期待。期待后续的面试机会！`
}

/**
 * 检测对话是否应该结束
 */
export function shouldEndConversation(context: ConversationContext): boolean {
  const { round, messages, matchResult } = context
  
  // 达到最大轮数
  if (round >= 4) return true
  
  // HR明确表示推荐或拒绝
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'electronic_hr') {
    const content = lastMessage.content.toLowerCase()
    if (
      content.includes('推荐') ||
      content.includes('面试') ||
      content.includes('联系') ||
      content.includes('候选') ||
      content.includes('不是最适合')
    ) {
      return true
    }
  }
  
  return false
}

/**
 * 生成完整的对话流程
 */
export async function* generateConversation(
  job: Job,
  resume: ResumeInfo,
  matchResult: MatchResult
): AsyncGenerator<ConversationMessage> {
  const context: ConversationContext = {
    job,
    resume,
    matchResult,
    messages: [],
    round: 0
  }
  
  // 求职者开场白
  const greeting: ConversationMessage = {
    id: `msg-${Date.now()}-0`,
    role: 'jobseeker_ai',
    content: generateGreeting(resume, job, matchResult),
    timestamp: Date.now()
  }
  context.messages.push(greeting)
  yield greeting
  
  // 模拟延迟
  await delay(1000 + Math.random() * 1000)
  
  // 对话循环
  while (!shouldEndConversation(context)) {
    context.round++
    
    // HR回复
    const hrResponse: ConversationMessage = {
      id: `msg-${Date.now()}-hr-${context.round}`,
      role: 'electronic_hr',
      content: generateHRResponse(context),
      timestamp: Date.now()
    }
    context.messages.push(hrResponse)
    yield hrResponse
    
    if (shouldEndConversation(context)) break
    
    await delay(800 + Math.random() * 1000)
    
    // 求职者回复
    const seekerResponse: ConversationMessage = {
      id: `msg-${Date.now()}-seeker-${context.round}`,
      role: 'jobseeker_ai',
      content: generateSeekerResponse(context, hrResponse.content),
      timestamp: Date.now()
    }
    context.messages.push(seekerResponse)
    yield seekerResponse
    
    await delay(600 + Math.random() * 800)
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
