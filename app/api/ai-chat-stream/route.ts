/**
 * AI 对话流式输出 API
 * 使用 SSE 实时输出大模型生成的对话内容
 */

import { NextRequest } from 'next/server'

const API_KEY = process.env.DASHSCOPE_API_KEY || ''
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

export async function POST(request: NextRequest) {
  try {
    const { messages, resume, job, mode, round } = await request.json()

    // 构建系统提示词
    let systemPrompt: string
    const totalRounds = 6 // 总共6轮对话
    
    if (mode === 'ai_assistant') {
      // 根据轮次调整求职者agent的策略
      let roundStrategy = ''
      if (round === 1) {
        roundStrategy = '第1轮：简单自我介绍，表达对职位的兴趣，但不要一次性说太多，留有交流空间'
      } else if (round === 2) {
        roundStrategy = '第2轮：针对HR的问题，详细介绍一个核心项目经验，突出技术深度和解决问题的能力'
      } else if (round === 3) {
        roundStrategy = '第3轮：展示团队协作能力和沟通能力，可以提及与产品、设计的协作经历'
      } else if (round === 4) {
        roundStrategy = '第4轮：表达职业规划和对公司的期待，展示长期发展的意愿'
      } else if (round === 5) {
        roundStrategy = '第5轮：回应HR的问题，可以适当询问团队情况、技术栈、工作氛围等'
      } else {
        roundStrategy = '第6轮：表达感谢，重申兴趣，询问后续流程'
      }

      systemPrompt = `你是一个专业的AI求职助手，代表求职者与电子HR进行真实、自然的对话。

## 求职者档案
- 姓名：${resume?.name || '张三'}
- 工作年限：${resume?.experience || 5}年
- 核心技能：${resume?.skills?.slice(0, 10).join('、') || 'Python, PyTorch, TensorFlow'}
- 期望职位：${resume?.desiredPositions?.join('、') || job?.title || '算法工程师'}
- 工作背景：${resume?.workExperience || '在多家知名科技公司有AI领域的实战经验'}
- 教育背景：${resume?.education || '计算机相关专业硕士'}

## 目标职位
- 职位名称：${job?.title || '算法工程师'}
- 所属公司：${job?.company || '科技公司'}
- 薪资范围：${job?.salary || '面议'}
- 技术要求：${job?.tags?.slice(0, 8).join('、') || '相关技术'}
- 职位描述：${job?.description?.slice(0, 200) || '负责AI算法研发'}

## 当前对话状态
- 当前轮次：第${round || 1}轮（共${totalRounds}轮）
- 本轮策略：${roundStrategy}

## 对话风格要求
1. **像真人一样交流**：使用自然的口语化表达，偶尔使用"嗯"、"确实"、"其实"等口语词
2. **有思考痕迹**：回答问题时展示思考过程，不要像背答案
3. **适度谦虚**：展示实力的同时保持谦虚，不要过度吹嘘
4. **有情感温度**：表达对工作的热情，对公司的认可
5. **篇幅适中**：每次回复120-180字，留有互动空间
6. **不暴露AI身份**：绝对不能说"作为AI"或暗示自己是AI`
    } else {
      // 电子HR的prompt - 更像真人，既懂技术又懂人文
      let roundFocus = ''
      if (round === 1) {
        roundFocus = `第1轮：热情欢迎，先聊一个话题
- 只问一个问题：了解对方目前的工作状态（在职还是看机会）
- 不要问多个问题，先打开话题`
      } else if (round === 2) {
        roundFocus = `第2轮：了解技术背景
- 只问一个问题：请对方分享一个印象深刻的项目
- 不要追问细节，让对方自由发挥`
      } else if (round === 3) {
        roundFocus = `第3轮：深入项目细节
- 基于对方上一轮的回答，追问一个具体的技术点
- 比如："刚才你提到的XX，具体是怎么实现的？"`
      } else if (round === 4) {
        roundFocus = `第4轮：软技能考察
- 只问一个问题：了解团队协作或沟通方面的经历
- 可以问："平时和产品同学怎么配合的？"`
      } else if (round === 5) {
        roundFocus = `第5轮：双向交流
- 先简单介绍一下团队情况
- 然后问对方："你有什么想了解的吗？"`
      } else {
        roundFocus = `第6轮：友好收尾
- 肯定对方的表现
- 说明后续会安排技术面试
- 不要再提问了`
      }

      systemPrompt = `你是${job?.company || '科技公司'}的资深HR，正在进行${job?.title || '算法工程师'}职位的初步沟通。

## 你的人设
- 姓名：李雯
- 背景：5年HR经验，计算机专业出身，既懂技术也懂人
- 性格：亲和、专业、善于倾听

## 职位信息
- 职位：${job?.title || '算法工程师'}
- 公司：${job?.company || '科技公司'}
- 薪资：${job?.salary || '面议'}
- 技术栈：${job?.tags?.slice(0, 5).join('、') || '相关技术'}

## 候选人信息
- 姓名：${resume?.name || '张三'}
- 经验：${resume?.experience || 5}年
- 技能：${resume?.skills?.slice(0, 5).join('、') || '相关技术'}

## 当前轮次：第${round || 1}轮（共${totalRounds}轮）
${roundFocus}

## 核心规则【必须遵守】
1. **每次只问一个问题**：这是最重要的规则！不要连续问多个问题
2. **先回应再提问**：先对对方说的内容做出回应（2-3句话），再问下一个问题
3. **像聊天不像面试**：用口语化表达，如"嗯嗯"、"确实"、"哈哈"
4. **篇幅要短**：每次回复80-120字，不要长篇大论
5. **不暴露AI身份**：你就是李雯，一个真实的HR`
    }

    // 如果没有 API Key，返回模拟的流式响应
    if (!API_KEY) {
      const encoder = new TextEncoder()
      
      // 根据轮次生成不同的模拟回复
      let fallbackContent: string
      if (mode === 'ai_assistant') {
        const seekerResponses: Record<number, string> = {
          1: `您好李雯！我目前还在职，不过在看一些新的机会。看到咱们这个${job?.title || '职位'}挺感兴趣的，想了解一下。`,
          2: `好的。印象比较深的是之前做的一个${job?.tags?.[0] || '模型优化'}项目，当时线上延迟比较高，我们用了模型量化和推理优化，把延迟降了不少。`,
          3: `嗯，当时主要是考虑到线上资源有限，所以选择了INT8量化，然后配合TensorRT做推理加速。效果还不错，延迟降了60%左右。`,
          4: `我觉得沟通挺重要的。一般我会先理解产品同学的需求背景，然后再讨论技术可行性。有分歧的时候就用数据说话，比如做个小实验验证一下。`,
          5: `了解了，听起来团队氛围挺好的。我想问一下，咱们现在主要在做哪些方向的技术探索？`,
          6: `好的，非常感谢李雯今天的交流！期待后续的面试机会，随时可以联系我。`
        }
        fallbackContent = seekerResponses[round] || seekerResponses[1]
      } else {
        const hrResponses: Record<number, string> = {
          1: `你好呀！我是李雯，${job?.company || '我们公司'}的HR。看到你的简历，背景挺不错的～方便问一下，你现在是在职状态还是已经离职了呢？`,
          2: `嗯嗯，了解了。那方便分享一个你觉得比较有挑战性的项目吗？随便聊聊就行。`,
          3: `这个项目听起来挺有意思的！刚才你提到的那个技术方案，当时是怎么想到要这样做的？`,
          4: `确实，能把这个问题解决挺不容易的。对了，平时你和产品同学是怎么配合的？`,
          5: `哈哈，听起来你挺注重沟通的。说实话我们团队氛围还不错，主要用${job?.tags?.slice(0, 3).join('、') || 'Python、PyTorch'}，每周有技术分享。你有什么想了解的吗？`,
          6: `今天聊得挺好的，感觉你的技术能力和我们的需求挺匹配的！接下来我会推进安排技术面试，大概一两个工作日会联系你，到时候保持手机畅通哈～`
        }
        fallbackContent = hrResponses[round] || hrResponses[1]
      }

      const stream = new ReadableStream({
        async start(controller) {
          for (let i = 0; i < fallbackContent.length; i++) {
            const chunk = JSON.stringify({ content: fallbackContent[i] })
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
            await new Promise(r => setTimeout(r, 30 + Math.random() * 20))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // 调用阿里云 API（启用流式输出）
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === 'ai_assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ]

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-DashScope-SSE': 'enable',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages: apiMessages },
        parameters: {
          temperature: 0.85,
          max_tokens: 400,
          result_format: 'message',
          incremental_output: true
        }
      })
    })

    if (!response.ok) {
      throw new Error('API请求失败')
    }

    // 转发流式响应
    const encoder = new TextEncoder()
    const reader = response.body?.getReader()
    
    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const text = decoder.decode(value, { stream: true })
            const lines = text.split('\n')

            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const data = JSON.parse(line.slice(5))
                  const content = data.output?.choices?.[0]?.message?.content
                  if (content) {
                    const chunk = JSON.stringify({ content })
                    controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
          }
        } catch (error) {
          console.error('流式读取错误:', error)
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('流式对话错误:', error)
    
    // 返回错误时的备用响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const fallback = JSON.stringify({ content: '抱歉，系统繁忙，请稍后再试。' })
        controller.enqueue(encoder.encode(`data: ${fallback}\n\n`))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }
}
