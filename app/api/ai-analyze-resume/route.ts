/**
 * AI 简历分析 API
 * 调用 Qwen 大模型分析简历，智能决定应该搜索什么职位
 */

import { NextRequest, NextResponse } from 'next/server'
import { type ResumeInfo } from '@/lib/storage/resumeStorage'

const API_KEY = process.env.DASHSCOPE_API_KEY || ''
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

export async function POST(request: NextRequest) {
  try {
    const { resume } = await request.json() as { resume: ResumeInfo }
    
    if (!resume) {
      return NextResponse.json({ error: '缺少简历数据' }, { status: 400 })
    }

    if (!API_KEY) {
      // 如果没有配置 API Key，返回一个基于简历的默认建议
      console.warn('未配置 DASHSCOPE_API_KEY，使用默认逻辑')
      return NextResponse.json({
        searchKeyword: resume.desiredPositions?.[0] || '算法工程师',
        reasoning: '基于简历期望职位',
        category: 'cv'
      })
    }

    // 构建 prompt，让 LLM 分析简历并决定搜索关键词
    const systemPrompt = `你是一个专业的AI求职助手。你的任务是分析用户的简历，然后决定应该搜索什么职位。

重要规则：
1. 你必须返回一个具体的职位名称作为搜索关键词，例如："视觉算法工程师"、"NLP工程师"、"大模型研发工程师"
2. 绝对不要返回技术栈或算法名称（如 YOLO、PyTorch、TensorFlow 等）
3. 职位名称要简洁，适合直接放入搜索框
4. 根据用户的技能和经验，选择最匹配的职位方向

请以 JSON 格式返回，格式如下：
{
  "searchKeyword": "具体职位名称",
  "reasoning": "为什么选择这个职位的简短说明",
  "category": "领域分类(cv/nlp/llm/ml/robotics/aigc/aiops/speech/aiagent/hardware)"
}`

    const userPrompt = `请分析以下简历，告诉我应该搜索什么职位：

姓名：${resume.name}
工作年限：${resume.experience}年
学历：${resume.education}
期望职位：${resume.desiredPositions?.join('、') || '未填写'}
技能：${resume.skills?.slice(0, 15).join('、') || '未填写'}
工作经历：${resume.workExperience || '未填写'}
个人总结：${resume.summary || '未填写'}

请根据这份简历，返回最适合搜索的职位名称。`

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        },
        parameters: {
          temperature: 0.3,  // 低温度确保稳定输出
          max_tokens: 200,
          result_format: 'message'
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('LLM API 错误:', errorData)
      // 失败时返回默认值
      return NextResponse.json({
        searchKeyword: resume.desiredPositions?.[0] || '算法工程师',
        reasoning: 'API调用失败，使用默认值',
        category: 'cv'
      })
    }

    const data = await response.json()
    const content = data.output?.choices?.[0]?.message?.content || ''
    
    // 尝试解析 JSON 响应
    try {
      // 提取 JSON 部分（LLM 可能返回额外文字）
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          searchKeyword: parsed.searchKeyword || resume.desiredPositions?.[0] || '算法工程师',
          reasoning: parsed.reasoning || '',
          category: parsed.category || 'cv'
        })
      }
    } catch (parseError) {
      console.error('解析 LLM 响应失败:', parseError)
    }

    // 解析失败时返回默认值
    return NextResponse.json({
      searchKeyword: resume.desiredPositions?.[0] || '算法工程师',
      reasoning: '解析失败，使用默认值',
      category: 'cv'
    })

  } catch (error) {
    console.error('AI 分析简历错误:', error)
    return NextResponse.json(
      { error: '分析失败', searchKeyword: '算法工程师' },
      { status: 500 }
    )
  }
}
