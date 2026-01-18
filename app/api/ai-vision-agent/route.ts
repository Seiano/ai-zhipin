/**
 * AI视觉智能体SSE流式API
 * 整合Playwright浏览器控制 + GUI-Owl视觉理解
 * 通过Server-Sent Events实时推送操作过程
 */

import { NextRequest } from 'next/server';
import { 
  GuiOwlClient, 
  GuiOwlResponse, 
  GuiOwlRequestConfig,
  GuiOwlHistoryItem,
  describeAction 
} from '@/lib/guiOwlClient';
import { CoordinateMapper, Point } from '@/lib/coordinateMapper';
import { STATE_DESCRIPTIONS, TaskState } from '@/lib/aiOrchestrator';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5分钟超时

// SSE事件类型
interface SSEEvent {
  type: 'screenshot' | 'thought' | 'action' | 'status' | 'message' | 'error' | 'complete' | 'cursor';
  data: any;
  timestamp: number;
}

// 简历信息
interface ResumeInfo {
  name: string;
  skills: string[];
  experience: number;
  education: string;
  targetPosition?: string;
}

// 任务配置
interface TaskConfig {
  resume?: ResumeInfo;
  searchKeywords?: string[];
  maxSteps?: number;
  baseUrl?: string;
}

/**
 * 模拟浏览器操作的简化版本
 * 由于Playwright需要在服务端特殊环境运行，这里提供一个模拟实现
 * 实际部署时可以替换为真实的Playwright操作
 */
class SimulatedBrowser {
  private currentUrl: string;
  private viewport: { width: number; height: number };
  private cursorPosition: Point;

  constructor(baseUrl: string) {
    this.currentUrl = baseUrl;
    this.viewport = { width: 1280, height: 720 };
    this.cursorPosition = { x: 640, y: 360 };
  }

  async goto(url: string): Promise<void> {
    this.currentUrl = url;
    await this.sleep(500);
  }

  async screenshot(): Promise<string> {
    // 返回一个模拟的截图Base64
    // 实际实现中这里会调用Playwright的screenshot方法
    return this.generateMockScreenshot();
  }

  async click(x: number, y: number): Promise<void> {
    this.cursorPosition = { x, y };
    await this.sleep(200);
  }

  async type(text: string): Promise<void> {
    await this.sleep(text.length * 50);
  }

  async scroll(direction: 'up' | 'down', amount: number): Promise<void> {
    await this.sleep(300);
  }

  async keyPress(key: string): Promise<void> {
    await this.sleep(100);
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }

  getCursorPosition(): Point {
    return { ...this.cursorPosition };
  }

  getViewport(): { width: number; height: number } {
    return { ...this.viewport };
  }

  private generateMockScreenshot(): string {
    // 1x1像素的透明PNG
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * AI视觉智能体执行器
 */
class AIVisionAgentExecutor {
  private guiOwlClient: GuiOwlClient;
  private coordinateMapper: CoordinateMapper;
  private browser: SimulatedBrowser;
  private history: GuiOwlHistoryItem[] = [];
  private stepCount: number = 0;
  private maxSteps: number;
  private state: TaskState = 'IDLE';
  private resume?: ResumeInfo;
  private searchKeywords: string[];
  private isRunning: boolean = true;

  constructor(config: TaskConfig) {
    this.guiOwlClient = new GuiOwlClient();
    this.coordinateMapper = new CoordinateMapper({ width: 1280, height: 720 });
    this.browser = new SimulatedBrowser(config.baseUrl || 'http://localhost:3001');
    this.maxSteps = config.maxSteps || 50;
    this.resume = config.resume;
    this.searchKeywords = config.searchKeywords || ['AI工程师', 'NLP', '深度学习'];
  }

  /**
   * 执行并生成SSE事件流
   */
  async *execute(): AsyncGenerator<SSEEvent> {
    this.state = 'INITIALIZING';
    yield this.createEvent('status', { state: this.state, message: 'AI视觉助手启动中...' });

    try {
      // 导航到首页
      yield this.createEvent('status', { state: 'NAVIGATING', message: '正在打开招聘平台...' });
      await this.browser.goto('http://localhost:3001');
      
      this.state = 'NAVIGATING';
      
      // 主循环
      while (this.isRunning && this.stepCount < this.maxSteps) {
        // 执行一步并生成事件
        for await (const event of this.executeStep()) {
          yield event;
        }
        
        this.stepCount++;
        
        // 检查是否完成
        if (this.state === 'COMPLETED' || this.state === 'FAILED') {
          break;
        }
        
        // 步骤间延迟
        await this.sleep(800);
      }
      
      // 完成
      yield this.createEvent('complete', {
        stepsExecuted: this.stepCount,
        finalState: this.state
      });
      
    } catch (error) {
      yield this.createEvent('error', { 
        message: (error as Error).message,
        stack: (error as Error).stack 
      });
    }
  }

  /**
   * 执行单步操作
   */
  private async *executeStep(): AsyncGenerator<SSEEvent> {
    // 1. 截图
    const screenshot = await this.browser.screenshot();
    yield this.createEvent('screenshot', { 
      dataUrl: `data:image/png;base64,${screenshot}`,
      url: this.browser.getCurrentUrl()
    });

    // 2. 生成指令
    const instruction = this.generateInstruction();

    // 3. 调用GUI-Owl
    const guiOwlConfig: GuiOwlRequestConfig = {
      screenshot,
      instruction,
      history: this.history.slice(-10)
    };

    const response = await this.guiOwlClient.sendRequest(guiOwlConfig);

    // 4. 发送思考过程
    yield this.createEvent('thought', {
      thought: response.thought,
      action: response.action,
      description: describeAction(response),
      step: this.stepCount + 1
    });

    // 5. 发送光标位置（如果是点击操作）
    if (response.action === 'CLICK' && response.parameters.x !== undefined) {
      const absolutePoint = this.coordinateMapper.mapGuiOwlToClick(
        response.parameters.x,
        response.parameters.y!
      );
      yield this.createEvent('cursor', {
        x: absolutePoint.x,
        y: absolutePoint.y,
        action: 'move'
      });
    }

    // 6. 执行操作
    await this.executeAction(response);

    // 7. 发送操作完成事件
    yield this.createEvent('action', {
      action: response.action,
      parameters: response.parameters,
      success: response.success
    });

    // 8. 记录历史
    this.history.push({
      action: response.action,
      parameters: response.parameters,
      thought: response.thought
    });

    // 9. 更新状态
    this.updateState(response);
    
    yield this.createEvent('status', { 
      state: this.state, 
      message: STATE_DESCRIPTIONS[this.state] || this.state 
    });
  }

  /**
   * 生成任务指令
   */
  private generateInstruction(): string {
    const skills = this.resume?.skills?.slice(0, 3).join('、') || this.searchKeywords.join('、');
    
    switch (this.state) {
      case 'INITIALIZING':
      case 'NAVIGATING':
        return `当前在AI招聘平台首页。请找到并点击导航栏中的"职位列表"链接，进入职位搜索页面。`;

      case 'SEARCHING_JOBS':
        return `请在页面上找到搜索框，输入关键词"${skills}"进行职位搜索。如果已有搜索结果，请浏览职位列表。`;

      case 'FILTERING_JOBS':
        return `请浏览当前的职位列表，找到一个与"${skills}"相关的职位，点击进入查看详情。优先选择标记为"热招"的职位。`;

      case 'VIEWING_DETAILS':
        return `当前在职位详情页。请查看职位要求，如果感兴趣请点击"立即申请"或"开始沟通"按钮。`;

      case 'INITIATING_CHAT':
        return `请在对话输入框中输入一条打招呼消息，例如："您好，我对这个职位很感兴趣，有${this.resume?.experience || 3}年${skills}相关经验，希望能进一步了解。"`;

      case 'CONVERSING':
        return `请查看HR的回复，并根据简历信息进行专业回复。重点介绍技术能力和项目经验。`;

      case 'WAITING_RESPONSE':
        return `等待HR回复中。如果有新消息，请进行回复。如果等待超过30秒没有回复，可以发送一条跟进消息。`;

      default:
        return `请分析当前页面状态，找到可交互的元素并执行最合适的操作。目标是找到合适的AI相关职位并发起沟通。`;
    }
  }

  /**
   * 执行操作
   */
  private async executeAction(response: GuiOwlResponse): Promise<void> {
    const { action, parameters } = response;

    switch (action) {
      case 'CLICK':
        if (parameters.x !== undefined && parameters.y !== undefined) {
          const point = this.coordinateMapper.mapGuiOwlToClick(parameters.x, parameters.y);
          await this.browser.click(point.x, point.y);
        }
        break;

      case 'TYPE':
        if (parameters.text) {
          await this.browser.type(parameters.text);
          if (parameters.needs_enter) {
            await this.browser.keyPress('Enter');
          }
        }
        break;

      case 'SCROLL':
        await this.browser.scroll(
          parameters.direction || 'down',
          parameters.amount || 300
        );
        break;

      case 'KEY_PRESS':
        if (parameters.key) {
          await this.browser.keyPress(parameters.key);
        }
        break;

      case 'FINISH':
        this.state = 'COMPLETED';
        break;

      case 'FAIL':
        // 尝试恢复而不是立即失败
        console.warn('GUI-Owl返回FAIL，尝试继续...');
        break;
    }
  }

  /**
   * 更新状态
   */
  private updateState(response: GuiOwlResponse): void {
    const thought = response.thought.toLowerCase();

    // 根据GUI-Owl的思考内容推断状态
    if (thought.includes('职位列表') || thought.includes('搜索')) {
      this.state = 'SEARCHING_JOBS';
    } else if (thought.includes('详情') || thought.includes('detail')) {
      this.state = 'VIEWING_DETAILS';
    } else if (thought.includes('对话') || thought.includes('消息') || thought.includes('chat')) {
      this.state = 'CONVERSING';
    } else if (thought.includes('完成') || thought.includes('finish')) {
      this.state = 'COMPLETED';
    } else if (response.action === 'FINISH') {
      this.state = 'COMPLETED';
    }

    // 如果执行了太多步还在同一状态，尝试推进
    if (this.stepCount > 10 && this.state === 'NAVIGATING') {
      this.state = 'SEARCHING_JOBS';
    } else if (this.stepCount > 20 && this.state === 'SEARCHING_JOBS') {
      this.state = 'FILTERING_JOBS';
    } else if (this.stepCount > 30 && this.state === 'FILTERING_JOBS') {
      this.state = 'VIEWING_DETAILS';
    } else if (this.stepCount > 40) {
      this.state = 'COMPLETED';
    }
  }

  /**
   * 停止执行
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * 创建SSE事件
   */
  private createEvent(type: SSEEvent['type'], data: any): SSEEvent {
    return {
      type,
      data,
      timestamp: Date.now()
    };
  }

  /**
   * 睡眠
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * GET请求处理 - SSE流式响应
 */
export async function GET(req: NextRequest): Promise<Response> {
  const encoder = new TextEncoder();
  
  // 解析查询参数
  const { searchParams } = new URL(req.url);
  const resumeParam = searchParams.get('resume');
  const keywordsParam = searchParams.get('keywords');
  
  // 解析配置
  const config: TaskConfig = {
    maxSteps: 50,
    baseUrl: 'http://localhost:3001'
  };
  
  if (resumeParam) {
    try {
      config.resume = JSON.parse(resumeParam);
    } catch (e) {
      console.warn('解析简历参数失败:', e);
    }
  }
  
  if (keywordsParam) {
    config.searchKeywords = keywordsParam.split(',');
  }

  // 创建执行器
  const executor = new AIVisionAgentExecutor(config);

  // 创建可读流
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 执行并发送事件
        for await (const event of executor.execute()) {
          const sseData = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(sseData));
        }
      } catch (error) {
        const errorEvent = {
          type: 'error',
          data: { message: (error as Error).message },
          timestamp: Date.now()
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
      } finally {
        controller.close();
      }
    },
    cancel() {
      executor.stop();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // 禁用nginx缓冲
    }
  });
}

/**
 * POST请求处理 - 单步执行
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { screenshot, instruction, history } = body;

    if (!screenshot || !instruction) {
      return Response.json(
        { error: '缺少必要参数: screenshot, instruction' },
        { status: 400 }
      );
    }

    const guiOwlClient = new GuiOwlClient();
    const response = await guiOwlClient.sendRequest({
      screenshot,
      instruction,
      history
    });

    return Response.json({
      success: true,
      response,
      description: describeAction(response)
    });

  } catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

