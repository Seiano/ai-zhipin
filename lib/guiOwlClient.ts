/**
 * GUI-Owl API客户端
 * 封装阿里GUI-Owl（gui-plus模型）的所有交互逻辑
 */

// GUI-Owl支持的操作类型
export type GuiOwlActionType = 'CLICK' | 'TYPE' | 'SCROLL' | 'KEY_PRESS' | 'FINISH' | 'FAIL';

// GUI-Owl操作参数
export interface GuiOwlParameters {
  x?: number;           // CLICK坐标X (0-1000相对坐标)
  y?: number;           // CLICK坐标Y (0-1000相对坐标)
  text?: string;        // TYPE输入文本
  needs_enter?: boolean; // TYPE后是否按回车
  direction?: 'up' | 'down' | 'left' | 'right'; // SCROLL方向
  amount?: number;      // SCROLL滚动量
  key?: string;         // KEY_PRESS按键
}

// GUI-Owl API响应
export interface GuiOwlResponse {
  thought: string;              // AI思考过程
  action: GuiOwlActionType;     // 操作类型
  parameters: GuiOwlParameters; // 操作参数
  success: boolean;             // 是否成功
  error?: string;               // 错误信息
}

// GUI-Owl API请求配置
export interface GuiOwlRequestConfig {
  screenshot: string;    // Base64编码的截图或URL
  instruction: string;   // 自然语言任务指令
  sessionId?: string;    // 会话ID（用于多步任务）
  history?: GuiOwlHistoryItem[]; // 历史操作记录
  deviceType?: 'pc' | 'mobile';  // 设备类型
}

// 历史操作记录
export interface GuiOwlHistoryItem {
  action: GuiOwlActionType;
  parameters: GuiOwlParameters;
  thought?: string;
}

// 重试配置
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

/**
 * GUI-Owl API客户端类
 */
export class GuiOwlClient {
  private apiKey: string;
  private endpoint: string;
  private retryConfig: RetryConfig;

  constructor(options?: {
    apiKey?: string;
    endpoint?: string;
    retryConfig?: Partial<RetryConfig>;
  }) {
    this.apiKey = options?.apiKey || process.env.GUI_OWL_API_KEY || process.env.DASHSCOPE_API_KEY || '';
    this.endpoint = options?.endpoint || process.env.GUI_OWL_ENDPOINT || 
      'https://dashscope.aliyuncs.com/api/v2/apps/gui-owl/gui_agent_server';
    
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      ...options?.retryConfig
    };

    if (!this.apiKey) {
      console.warn('GUI-Owl API Key未配置，将使用模拟模式');
    }
  }

  /**
   * 发送GUI-Owl API请求
   */
  async sendRequest(config: GuiOwlRequestConfig): Promise<GuiOwlResponse> {
    // 如果没有API Key，使用模拟模式
    if (!this.apiKey) {
      return this.simulateResponse(config);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await this.doRequest(config);
        return response;
      } catch (error) {
        lastError = error as Error;
        console.error(`GUI-Owl API请求失败 (尝试 ${attempt + 1}/${this.retryConfig.maxRetries}):`, error);

        // 如果不是最后一次尝试，等待后重试
        if (attempt < this.retryConfig.maxRetries - 1) {
          const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(2, attempt),
            this.retryConfig.maxDelay
          );
          await this.sleep(delay);
        }
      }
    }

    // 所有重试都失败，返回模拟响应作为降级
    console.warn('GUI-Owl API重试耗尽，降级到模拟模式');
    return this.simulateResponse(config);
  }

  /**
   * 执行实际的API请求
   */
  private async doRequest(config: GuiOwlRequestConfig): Promise<GuiOwlResponse> {
    const requestBody = {
      model: 'gui-plus',
      input: {
        image: config.screenshot,
        instruction: config.instruction,
        session_id: config.sessionId,
        history: config.history,
        device_type: config.deviceType || 'pc'
      },
      parameters: {
        vl_high_resolution_images: true
      }
    };

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GUI-Owl API错误 (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // 解析响应
    return this.parseResponse(data);
  }

  /**
   * 解析GUI-Owl API响应
   */
  private parseResponse(data: any): GuiOwlResponse {
    try {
      const output = data.output || data;
      
      return {
        thought: output.thought || '',
        action: this.parseAction(output.action),
        parameters: this.parseParameters(output.parameters || {}),
        success: true
      };
    } catch (error) {
      return {
        thought: '解析响应失败',
        action: 'FAIL',
        parameters: {},
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 解析操作类型
   */
  private parseAction(action: string): GuiOwlActionType {
    const validActions: GuiOwlActionType[] = ['CLICK', 'TYPE', 'SCROLL', 'KEY_PRESS', 'FINISH', 'FAIL'];
    const upperAction = (action || '').toUpperCase() as GuiOwlActionType;
    
    if (validActions.includes(upperAction)) {
      return upperAction;
    }
    
    return 'FAIL';
  }

  /**
   * 解析操作参数
   */
  private parseParameters(params: any): GuiOwlParameters {
    return {
      x: typeof params.x === 'number' ? params.x : undefined,
      y: typeof params.y === 'number' ? params.y : undefined,
      text: typeof params.text === 'string' ? params.text : undefined,
      needs_enter: typeof params.needs_enter === 'boolean' ? params.needs_enter : undefined,
      direction: params.direction,
      amount: typeof params.amount === 'number' ? params.amount : undefined,
      key: typeof params.key === 'string' ? params.key : undefined
    };
  }

  /**
   * 模拟响应（用于测试或API不可用时的降级）
   */
  private simulateResponse(config: GuiOwlRequestConfig): GuiOwlResponse {
    const instruction = config.instruction.toLowerCase();

    // 根据指令生成模拟响应
    if (instruction.includes('点击') || instruction.includes('click')) {
      return {
        thought: `[模拟] 分析指令"${config.instruction}"，准备执行点击操作`,
        action: 'CLICK',
        parameters: {
          x: 500 + Math.random() * 100,
          y: 300 + Math.random() * 100
        },
        success: true
      };
    }

    if (instruction.includes('输入') || instruction.includes('type') || instruction.includes('搜索')) {
      return {
        thought: `[模拟] 分析指令"${config.instruction}"，准备输入文本`,
        action: 'TYPE',
        parameters: {
          text: '模拟输入文本',
          needs_enter: true
        },
        success: true
      };
    }

    if (instruction.includes('滚动') || instruction.includes('scroll')) {
      return {
        thought: `[模拟] 分析指令"${config.instruction}"，准备滚动页面`,
        action: 'SCROLL',
        parameters: {
          direction: 'down',
          amount: 300
        },
        success: true
      };
    }

    if (instruction.includes('完成') || instruction.includes('finish')) {
      return {
        thought: `[模拟] 任务已完成`,
        action: 'FINISH',
        parameters: {},
        success: true
      };
    }

    // 默认返回点击操作
    return {
      thought: `[模拟] 分析页面内容，寻找可交互元素`,
      action: 'CLICK',
      parameters: {
        x: 500,
        y: 400
      },
      success: true
    };
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 验证API Key是否可用
   */
  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      // 发送一个简单的测试请求
      const testResponse = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gui-plus',
          input: {
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            instruction: 'test'
          }
        })
      });

      return testResponse.ok || testResponse.status === 400; // 400表示参数问题但API Key有效
    } catch (error) {
      console.error('API Key验证失败:', error);
      return false;
    }
  }

  /**
   * 获取API是否可用
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

/**
 * 创建默认的GUI-Owl客户端实例
 */
export function createGuiOwlClient(options?: {
  apiKey?: string;
  endpoint?: string;
}): GuiOwlClient {
  return new GuiOwlClient(options);
}

/**
 * 将GUI-Owl响应转换为人类可读的描述
 */
export function describeAction(response: GuiOwlResponse): string {
  const { action, parameters } = response;

  switch (action) {
    case 'CLICK':
      return `点击位置 (${parameters.x?.toFixed(0)}, ${parameters.y?.toFixed(0)})`;
    case 'TYPE':
      return `输入文本: "${parameters.text}"${parameters.needs_enter ? ' 并按回车' : ''}`;
    case 'SCROLL':
      return `向${parameters.direction === 'up' ? '上' : '下'}滚动 ${parameters.amount || 100} 像素`;
    case 'KEY_PRESS':
      return `按下按键: ${parameters.key}`;
    case 'FINISH':
      return '任务完成';
    case 'FAIL':
      return '任务失败';
    default:
      return `未知操作: ${action}`;
  }
}
