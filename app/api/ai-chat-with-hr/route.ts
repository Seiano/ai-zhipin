/**
 * AI 与电子 HR 对话 API
 * 调用 Qwen 大模型来生成求职者 AI 的回复
 */

import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.DASHSCOPE_API_KEY || ''
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

interface ChatMessage {
  role: 'ai_assistant' | 'electronic_hr' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { 
      messages, 
      resume, 
      job,
      mode  // 'ai_assistant' 或 'electronic_hr'
    } = await request.json()
    
    if (!messages || !resume || !job) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    if (!API_KEY) {
      // 没有 API Key 时返回模拟回复
      console.warn('未配置 DASHSCOPE_API_KEY')
      return NextResponse.json({
        content: mode === 'ai_assistant' 
          ? `您好！我对贵公司的${job.title}职位非常感兴趣。我有丰富的相关经验，期待进一步交流。`
          : `感谢您的关注！您的背景很符合我们的要求，能详细介绍一下您的项目经验吗？`,
        error: null
      })
    }

    // 构建系统提示词
    let systemPrompt: string
    if (mode === 'ai_assistant') {
      systemPrompt = `你是一个专业的AI求职助手，代表求职者与电子HR对话。

求职者信息：
- 姓名：${resume.name}
- 工作经验：${resume.experience}年
- 技能：${resume.skills?.slice(0, 10).join('、')}
- 期望职位：${resume.desiredPositions?.join('、') || job.title}
- 工作经历：${resume.workExperience || '未提供'}
- 项目经验：${resume.detailedProjects ? resume.detailedProjects.map((p: any) => p.name).join('、') : '未提供'}

目标职位信息：
- 职位：${job.title}
- 公司：${job.company}
- 薪资：${job.salary}
- 要求技能：${job.tags?.slice(0, 5).join('、')}

你的任务：
1. 代表求职者进行专业、自信的对话
2. 充分展示求职者的技能和经验
3. 回答HR的问题时要具体、有数据支撑
4. 表现出对职位的热情和对公司的了解
5. 适当询问职位相关问题，展示专业性
6. 回复要简洁有力，每次100-150字左右`
    } else {
      systemPrompt = `你是${job.company}的电子HR，负责${job.title}职位的初步面试。

职位信息：
- 职位：${job.title}
- 薪资：${job.salary}
- 要求：${job.requirements?.slice(0, 3).join('；') || '具备相关经验'}
- 技能要求：${job.tags?.slice(0, 5).join('、')}
- 职责：${job.responsibilities?.slice(0, 2).join('；') || '负责核心技术研发'}

求职者信息：
- 姓名：${resume.name}
- 经验：${resume.experience}年
- 技能：${resume.skills?.slice(0, 5).join('、')}

你的任务：
1. 友好、专业地与求职者交流
2. 询问求职者的项目经验和技术细节
3. 评估求职者与职位的匹配度
4. 在3-4轮对话后给出初步评估结果
5. 回复要简洁，每次80-120字左右`
    }

    // 转换消息格式
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: ChatMessage) => ({
        role: m.role === 'ai_assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ]

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages: apiMessages },
        parameters: {
          temperature: 0.8,
          max_tokens: 300,
          result_format: 'message'
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('LLM API 错误:', errorData)
      return NextResponse.json({
        content: mode === 'ai_assistant'
          ? '非常感谢您的问题！基于我的经验，我相信能够胜任这个职位。'
          : '您的背景很不错！能详细说说您的项目经验吗？',
        error: 'API调用失败'
      })
    }

    const data = await response.json()
    const content = data.output?.choices?.[0]?.message?.content || ''

    return NextResponse.json({ content, error: null })

  } catch (error) {
    console.error('AI对话错误:', error)
    return NextResponse.json(
      { error: '对话生成失败', content: '抱歉，系统繁忙，请稍后再试。' },
      { status: 500 }
    )
  }
}
