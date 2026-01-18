/**
 * 测试阿里云API的简单接口
 * 访问: http://localhost:3000/api/test-llm
 */

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.DASHSCOPE_API_KEY || 'sk-4c1874e61eaa436991ec81887fbf1ea6';
  const apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

  try {
    console.log('🧪 开始测试阿里云通义千问API...');
    console.log('📡 API Key:', apiKey.substring(0, 10) + '...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'system',
              content: '你是一个专业的AI招聘助手。'
            },
            {
              role: 'user',
              content: '你好！请用一句话简单介绍一下你自己。'
            }
          ]
        },
        parameters: {
          temperature: 0.8,
          max_tokens: 100,
          top_p: 0.9,
          result_format: 'message'
        }
      })
    });

    console.log(`📊 响应状态: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API调用失败:', errorData);
      
      return Response.json({
        success: false,
        error: errorData,
        message: 'API调用失败，请检查密钥是否正确'
      }, { status: response.status });
    }

    const data = await response.json();
    
    console.log('✅ API调用成功！');

    const aiMessage = data.output?.choices?.[0]?.message?.content || '无响应';
    const usage = data.usage;

    return Response.json({
      success: true,
      message: '✅ API密钥测试成功！',
      data: {
        aiResponse: aiMessage,
        usage: {
          inputTokens: usage?.input_tokens || 0,
          outputTokens: usage?.output_tokens || 0,
          totalTokens: usage?.total_tokens || 0
        },
        model: 'qwen-turbo',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ 测试失败:', error);
    
    return Response.json({
      success: false,
      error: error.message,
      message: '网络请求失败，请检查网络连接'
    }, { status: 500 });
  }
}
