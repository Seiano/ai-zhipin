/**
 * AI求职助手 SSE流式API
 * 处理完整的求职流程：分析简历 → 搜索职位 → 匹配筛选 → 查看详情 → 发起对话
 */

import { NextRequest } from 'next/server'
import { mockJobs } from '@/lib/mockData'
import { type ResumeInfo } from '@/lib/storage/resumeStorage'
import { 
  extractKeywordsFromResume, 
  generateSearchCriteria,
  calculateMatchScore,
  rankJobs,
  type MatchResult 
} from '@/lib/resumeAnalyzer'
import { generateConversation, type ConversationMessage } from '@/lib/conversationGenerator'

// SSE事件类型
type EventType = 
  | 'screenshot' 
  | 'cursor' 
  | 'thought' 
  | 'action' 
  | 'status'
  | 'phase_change'
  | 'resume_analyzed'
  | 'job_found'
  | 'match_score'
  | 'conversation_start'
  | 'conversation_message'
  | 'error'
  | 'complete'

// 模拟截图（纯色占位）
function generatePlaceholderScreenshot(color: string = '#1a1a2e'): string {
  // 返回一个1x1像素的base64图片作为占位
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`
}

// 发送SSE事件
function createSSEEvent(type: EventType, data: any): string {
  return `data: ${JSON.stringify({ type, data, timestamp: Date.now() })}\n\n`
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 模拟光标移动路径
function* generateCursorPath(fromX: number, fromY: number, toX: number, toY: number, steps: number = 10) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // 使用贝塞尔曲线使移动更自然
    const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    yield {
      x: Math.round(fromX + (toX - fromX) * easeT + (Math.random() - 0.5) * 5),
      y: Math.round(fromY + (toY - fromY) * easeT + (Math.random() - 0.5) * 5)
    }
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // 解析参数
  let resume: ResumeInfo
  try {
    resume = JSON.parse(searchParams.get('resume') || '{}')
    if (!resume.name || !resume.skills) {
      throw new Error('简历数据不完整')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: '无效的简历数据' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  const threshold = parseInt(searchParams.get('threshold') || '85')

  // 创建SSE流
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: EventType, data: any) => {
        controller.enqueue(encoder.encode(createSSEEvent(type, data)))
      }

      try {
        // 当前状态
        let cursorX = 640, cursorY = 360
        let currentPhase = 'analyze'
        
        // ========== Phase 1: 分析简历 ==========
        send('phase_change', { phase: 'analyze' })
        send('status', { status: '分析简历', message: '正在分析您的简历...' })
        send('screenshot', { image: generatePlaceholderScreenshot('#1a1a2e'), url: 'localhost:3001/profile' })
        
        await delay(500)
        send('thought', { content: `开始分析简历: ${resume.name}` })
        
        await delay(800)
        const keywords = extractKeywordsFromResume(resume)
        // 显示期望职位，而不是技能关键词
        const desiredPositions = resume.desiredPositions?.slice(0, 3).join('、') || '视觉算法工程师'
        send('thought', { content: `期望职位: ${desiredPositions}` })
        
        await delay(600)
        const searchCriteria = generateSearchCriteria(resume)
        // 显示分析出的核心领域，而不是搜索关键词
        const primaryCategoryForDisplay = searchCriteria.categories[0] || 'cv'
        const categoryDisplayNames: Record<string, string> = {
          'cv': '计算机视觉',
          'nlp': '自然语言处理',
          'llm': '大模型/AGI',
          'ml': '机器学习',
          'robotics': '机器人/自动驾驶',
          'aigc': 'AIGC',
          'aiops': 'AI工程化',
          'speech': '语音识别',
          'aiagent': 'AI Agent',
          'hardware': 'AI芯片'
        }
        send('thought', { content: `分析结果: 您属于【${categoryDisplayNames[primaryCategoryForDisplay] || '计算机视觉'}】领域，将搜索该领域的职位` })
        
        await delay(500)
        send('resume_analyzed', { 
          keywords: searchCriteria.keywords,
          categories: searchCriteria.categories,
          experience: resume.experience
        })
        send('phase_change', { phase: 'search', completed: 'analyze' })
        
        // ========== Phase 2: 搜索职位 ==========
        send('status', { status: '搜索职位', message: '正在搜索匹配的职位...' })
        
        // 模拟导航动画
        await delay(300)
        
        // 根据简历分析结果，确定核心领域
        const primaryCategory = searchCriteria.categories[0] || 'cv'
        const categoryNames: Record<string, string> = {
          'cv': '计算机视觉',
          'nlp': '自然语言处理',
          'llm': '大模型/AGI',
          'ml': '机器学习',
          'robotics': '机器人/自动驾驶',
          'aigc': 'AIGC',
          'aiops': 'AI工程化',
          'speech': '语音识别',
          'aiagent': 'AI Agent',
          'hardware': 'AI芯片'
        }
        const categoryName = categoryNames[primaryCategory] || '计算机视觉'
        
        // 根据期望职位搜索，而不是技能关键词
        const searchPosition = resume.desiredPositions?.[0] || `${categoryName}工程师`
        send('thought', { content: `搜索职位: "${searchPosition}"` })
        await delay(400)
        
        // 直接跳转到对应类别的职位页面
        send('screenshot', { image: generatePlaceholderScreenshot('#0f172a'), url: `localhost:3001/jobs?category=${primaryCategory}&search=${encodeURIComponent(searchPosition)}` })
        send('thought', { content: `在【${categoryName}】领域中搜索与"${searchPosition}"相关的职位` })
        
        await delay(500)
        
        // 模拟在搜索框输入职位名称
        for (const pos of generateCursorPath(cursorX, cursorY, 400, 80, 8)) {
          send('cursor', { x: pos.x, y: pos.y, clicking: false })
          await delay(50)
        }
        cursorX = 400; cursorY = 80
        
        send('action', { action: 'TYPE', parameters: { text: searchPosition, target: '职位搜索框' } })
        send('cursor', { x: cursorX, y: cursorY, clicking: true })
        await delay(200)
        send('cursor', { x: cursorX, y: cursorY, clicking: false })
        
        await delay(300)
        send('thought', { content: `搜索完成，正在筛选匹配度高的职位...` })
        
        await delay(800)
        send('phase_change', { phase: 'filter', completed: 'search' })
        
        // ========== Phase 3: 筛选匹配 ==========
        send('status', { status: '筛选匹配', message: '正在计算职位匹配度...' })
        
        // 先筛选出该领域的职位
        const categoryJobs = mockJobs.filter(job => job.category === primaryCategory)
        send('thought', { content: `在${categoryName}领域找到 ${categoryJobs.length} 个职位` })
        await delay(400)
        
        // 计算所有职位的匹配度（优先该领域）
        const rankedJobs = rankJobs(categoryJobs.length > 0 ? categoryJobs : mockJobs, resume)
        const highMatchJobs = rankedJobs.filter(r => r.score >= threshold)
        const mediumMatchJobs = rankedJobs.filter(r => r.score >= 70 && r.score < threshold)
        
        send('thought', { content: `根据您的技能进行匹配度评估...` })
        await delay(500)
        
        // 模拟滚动浏览职位列表
        for (let i = 0; i < Math.min(5, rankedJobs.length); i++) {
          const result = rankedJobs[i]
          
          // 移动光标到职位卡片
          const targetY = 250 + i * 100
          for (const pos of generateCursorPath(cursorX, cursorY, 500, targetY, 5)) {
            send('cursor', { x: pos.x, y: pos.y, clicking: false })
            await delay(30)
          }
          cursorX = 500; cursorY = targetY
          
          await delay(200)
          send('job_found', {
            title: result.job.title,
            company: result.job.company,
            matchScore: result.score
          })
          
          // 详细说明匹配原因
          const matchReason = result.matchedSkills.length > 0 
            ? `技能匹配: ${result.matchedSkills.slice(0, 3).join('、')}`
            : '领域方向匹配'
          
          send('match_score', {
            jobId: result.job.id,
            jobTitle: result.job.title,
            company: result.job.company,
            score: result.score,
            breakdown: result.breakdown,
            matchedSkills: result.matchedSkills,
            recommendation: result.recommendation,
            reason: matchReason
          })
          
          // 输出为什么推荐这个职位
          if (result.score >= 80) {
            send('thought', { content: `【高度匹配】${result.job.title} - ${matchReason}，匹配度${result.score}%` })
          } else if (result.score >= 70) {
            send('thought', { content: `【中度匹配】${result.job.title} - ${matchReason}，匹配度${result.score}%` })
          }
          
          await delay(400)
        }
        
        send('thought', { 
          content: `筛选完成! 高匹配(≥${threshold}%): ${highMatchJobs.length}个, 中等匹配: ${mediumMatchJobs.length}个` 
        })
        
        if (highMatchJobs.length === 0 && mediumMatchJobs.length === 0) {
          send('thought', { content: '未找到高匹配度职位，建议调整搜索条件或完善简历' })
          send('complete', { 
            viewed: rankedJobs.length,
            matched: 0,
            contacted: 0,
            message: '未找到高匹配度职位'
          })
          controller.close()
          return
        }
        
        send('phase_change', { phase: 'view', completed: 'filter' })
        
        // ========== Phase 4: 查看详情 ==========
        const topJob = highMatchJobs[0] || mediumMatchJobs[0]
        send('status', { status: '查看详情', message: `正在查看: ${topJob.job.title}` })
        
        // 点击进入详情页
        send('cursor', { x: cursorX, y: cursorY, clicking: true })
        await delay(200)
        send('action', { action: 'CLICK', parameters: { target: topJob.job.title } })
        send('cursor', { x: cursorX, y: cursorY, clicking: false })
        
        await delay(600)
        send('screenshot', { 
          image: generatePlaceholderScreenshot('#1e1b4b'), 
          url: `localhost:3001/jobs/${topJob.job.id}` 
        })
        send('thought', { content: `进入职位详情: ${topJob.job.company} - ${topJob.job.title}` })
        
        // 模拟滚动查看详情
        await delay(400)
        send('action', { action: 'SCROLL', parameters: { direction: 'down', amount: 300 } })
        send('thought', { content: `职位要求: ${topJob.job.tags.slice(0, 5).join(', ')}` })
        
        await delay(500)
        send('thought', { 
          content: `匹配度详情 - 技能: ${topJob.breakdown.skillMatch}%, 经验: ${topJob.breakdown.experienceMatch}%, 学历: ${topJob.breakdown.educationMatch}%` 
        })
        
        // 检查是否满足对话条件
        if (topJob.score < threshold) {
          send('thought', { content: `匹配度 ${topJob.score}% 未达到自动对话阈值 ${threshold}%，跳过对话` })
          send('complete', {
            viewed: Math.min(5, rankedJobs.length),
            matched: highMatchJobs.length + mediumMatchJobs.length,
            contacted: 0,
            message: '未找到足够匹配的职位进行自动对话'
          })
          controller.close()
          return
        }
        
        send('phase_change', { phase: 'contact', completed: 'view' })
        
        // ========== Phase 5: 发起对话 ==========
        send('status', { status: '发起对话', message: `正在与 ${topJob.job.company} 的电子HR对话...` })
        send('conversation_start', {
          jobId: topJob.job.id,
          jobTitle: topJob.job.title,
          company: topJob.job.company,
          matchScore: topJob.score
        })
        
        // 移动光标到对话按钮
        for (const pos of generateCursorPath(cursorX, cursorY, 800, 500, 8)) {
          send('cursor', { x: pos.x, y: pos.y, clicking: false })
          await delay(40)
        }
        cursorX = 800; cursorY = 500
        
        send('action', { action: 'CLICK', parameters: { target: '发起对话' } })
        send('cursor', { x: cursorX, y: cursorY, clicking: true })
        await delay(200)
        send('cursor', { x: cursorX, y: cursorY, clicking: false })
        
        await delay(500)
        
        // 生成对话
        let messageCount = 0
        for await (const message of generateConversation(topJob.job, resume, topJob)) {
          send('conversation_message', {
            id: message.id,
            role: message.role,
            content: message.content,
            timestamp: message.timestamp
          })
          messageCount++
          
          // 在对话过程中显示打字状态
          if (message.role === 'jobseeker_ai') {
            send('thought', { content: `🤖 AI助手: ${message.content.substring(0, 50)}...` })
          } else {
            send('thought', { content: `👔 电子HR: ${message.content.substring(0, 50)}...` })
          }
        }
        
        send('thought', { content: `对话完成，共 ${messageCount} 轮` })
        
        // ========== 完成 ==========
        send('status', { status: '已完成', message: '任务执行完毕' })
        send('complete', {
          viewed: Math.min(5, rankedJobs.length),
          matched: highMatchJobs.length + mediumMatchJobs.length,
          contacted: 1,
          topMatch: {
            jobId: topJob.job.id,
            jobTitle: topJob.job.title,
            company: topJob.job.company,
            score: topJob.score
          },
          message: '成功完成求职任务'
        })
        
      } catch (error) {
        console.error('AI求职助手执行错误:', error)
        send('error', { 
          message: error instanceof Error ? error.message : '执行过程中发生错误' 
        })
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
