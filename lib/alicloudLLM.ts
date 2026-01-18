/**
 * 阿里云通义千问 API 集成
 * 
 * 使用方法：
 * 1. 访问 https://bailian.console.aliyun.com/ 或 https://dashscope.aliyun.com/
 * 2. 登录阿里云账号
 * 3. 开通通义千问服务（有免费额度）
 * 4. 在"API-KEY管理"中创建API Key
 * 5. 将API Key设置到环境变量 DASHSCOPE_API_KEY 中
 * 
 * 环境变量设置方法：
 * - 创建 .env.local 文件（已在.gitignore中）
 * - 添加：DASHSCOPE_API_KEY=your_api_key_here
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  finishReason: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

/**
 * 阿里云通义千问 LLM 客户端
 */
export class AliCloudLLM {
  private apiKey: string;
  private baseURL: string = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
  private model: string;

  constructor(apiKey?: string, model: string = 'qwen-turbo') {
    // 优先使用传入的apiKey，否则从环境变量读取
    this.apiKey = apiKey || process.env.DASHSCOPE_API_KEY || '';
    this.model = model;
    
    if (!this.apiKey) {
      console.warn('⚠️ 未设置阿里云API密钥。请设置环境变量 DASHSCOPE_API_KEY');
    }
  }

  /**
   * 调用通义千问API生成回复
   */
  async chat(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  }): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error('API密钥未设置。请在环境变量中设置 DASHSCOPE_API_KEY');
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: {
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          },
          parameters: {
            temperature: options?.temperature ?? 0.8,
            max_tokens: options?.maxTokens ?? 2000,
            top_p: options?.topP ?? 0.9,
            result_format: 'message'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`阿里云API错误: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      // 处理通义千问的响应格式
      const output = data.output;
      const usage = data.usage;

      return {
        content: output.choices[0].message.content,
        finishReason: output.choices[0].finish_reason,
        usage: {
          inputTokens: usage.input_tokens,
          outputTokens: usage.output_tokens,
          totalTokens: usage.total_tokens
        }
      };
    } catch (error) {
      console.error('调用阿里云API失败:', error);
      throw error;
    }
  }

  /**
   * 生成电子HR的智能回复
   */
  async generateHRResponse(
    systemPrompt: string,
    conversationHistory: LLMMessage[],
    candidateMessage: string,
    resumeInfo: any
  ): Promise<{
    response: string;
    intent: string;
    confidence: number;
  }> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `${systemPrompt}

候选人信息：
${JSON.stringify(resumeInfo, null, 2)}

请根据候选人的消息，生成一个自然、专业的回复。注意：
1. 回复要有针对性，不要机械化
2. 要能体现对候选人背景的理解
3. 提出的问题要有深度
4. 保持友好和专业的平衡`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: candidateMessage
      }
    ];

    const response = await this.chat(messages, {
      temperature: 0.8,
      maxTokens: 500
    });

    // 简单的意图识别（后续可以用更复杂的prompt让LLM输出结构化数据）
    const intent = this.detectIntent(candidateMessage);
    const confidence = 0.85;

    return {
      response: response.content,
      intent,
      confidence
    };
  }

  /**
   * 生成求职者AI助手的智能回复
   */
  async generateSeekerResponse(
    systemPrompt: string,
    conversationHistory: LLMMessage[],
    hrMessage: string,
    resumeData: any
  ): Promise<{
    response: string;
    keyPoints: string[];
  }> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `${systemPrompt}

候选人完整信息：
${JSON.stringify(resumeData, null, 2)}

请根据HR的问题，代表候选人生成一个自信、专业的回复。注意：
1. 充分展示候选人的优势和经验
2. 回答要具体，有数据和案例支撑
3. 表现出对技术的深刻理解
4. 保持真诚，不夸大其词`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: hrMessage
      }
    ];

    const response = await this.chat(messages, {
      temperature: 0.7,
      maxTokens: 500
    });

    // 提取关键点
    const keyPoints = this.extractKeyPoints(hrMessage);

    return {
      response: response.content,
      keyPoints
    };
  }

  /**
   * 简单的意图识别
   */
  private detectIntent(message: string): string {
    const patterns = [
      { pattern: /项目|经验|案例/i, intent: 'project_experience' },
      { pattern: /技术|框架|工具/i, intent: 'technical_discussion' },
      { pattern: /薪资|待遇/i, intent: 'salary_inquiry' },
      { pattern: /文化|团队/i, intent: 'company_culture' },
      { pattern: /为什么|动机/i, intent: 'motivation' },
    ];

    for (const { pattern, intent } of patterns) {
      if (pattern.test(message)) {
        return intent;
      }
    }

    return 'general_inquiry';
  }

  /**
   * 提取关键点
   */
  private extractKeyPoints(message: string): string[] {
    const keywordPatterns = [
      '项目经验', '技术深度', '问题解决', '团队协作',
      '学习能力', '职业规划', '薪资期望', '工作方式'
    ];

    return keywordPatterns.filter(keyword => 
      message.includes(keyword.substring(0, 2))
    );
  }

  /**
   * 检查API密钥是否已设置
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * 获取支持的模型列表
   */
  static getSupportedModels(): string[] {
    return [
      'qwen-turbo',        // 通义千问-Turbo（快速、便宜）
      'qwen-plus',         // 通义千问-Plus（平衡性能和成本）
      'qwen-max',          // 通义千问-Max（最强性能）
      'qwen-max-longcontext', // 通义千问-Max长文本版
    ];
  }
}

/**
 * 创建默认的LLM客户端实例
 */
export function createLLMClient(model?: string): AliCloudLLM {
  return new AliCloudLLM(undefined, model || 'qwen-turbo');
}

/**
 * 使用示例：
 * 
 * const llm = createLLMClient('qwen-plus');
 * 
 * if (!llm.isConfigured()) {
 *   console.error('请设置 DASHSCOPE_API_KEY 环境变量');
 *   return;
 * }
 * 
 * const response = await llm.chat([
 *   { role: 'system', content: '你是一个专业的HR助手' },
 *   { role: 'user', content: '你好，我想了解这个职位' }
 * ]);
 * 
 * console.log(response.content);
 */
