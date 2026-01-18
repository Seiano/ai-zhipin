/**
 * AI任务编排引擎
 * 协调GUI-Owl、通义千问、Playwright等多个AI服务
 * 管理求职任务的完整生命周期
 */

import { 
  GuiOwlClient, 
  GuiOwlResponse, 
  GuiOwlRequestConfig,
  GuiOwlHistoryItem,
  describeAction 
} from './guiOwlClient';
import { CoordinateMapper, Point, ViewportSize } from './coordinateMapper';
import { ScreenshotManager, ScreenshotResult } from './screenshotManager';

// 任务状态枚举
export type TaskState = 
  | 'IDLE'                // 空闲状态
  | 'INITIALIZING'        // 初始化中
  | 'ANALYZING_RESUME'    // 分析简历
  | 'NAVIGATING'          // 页面导航中
  | 'SEARCHING_JOBS'      // 搜索职位
  | 'FILTERING_JOBS'      // 筛选职位
  | 'VIEWING_DETAILS'     // 查看职位详情
  | 'INITIATING_CHAT'     // 发起对话
  | 'CONVERSING'          // 对话中
  | 'WAITING_RESPONSE'    // 等待响应
  | 'COMPLETED'           // 任务完成
  | 'FAILED'              // 任务失败
  | 'PAUSED';             // 暂停中

// 任务上下文
export interface TaskContext {
  // 简历信息
  resume?: {
    name: string;
    skills: string[];
    experience: number;
    education: string;
    targetPosition?: string;
    salaryExpectation?: string;
  };
  
  // 搜索条件
  searchCriteria?: {
    keywords: string[];
    location?: string;
    category?: string;
    salaryRange?: string;
  };
  
  // 当前职位信息
  currentJob?: {
    id: string;
    title: string;
    company: string;
    matchScore?: number;
  };
  
  // 对话历史
  conversationHistory?: {
    jobId: string;
    messages: Array<{
      role: 'hr' | 'seeker';
      content: string;
      timestamp: number;
    }>;
  };
  
  // 已申请的职位
  appliedJobs: string[];
  
  // 任务开始时间
  startTime: number;
  
  // 最大运行时间（毫秒）
  maxRunTime: number;
}

// 任务事件
export interface TaskEvent {
  type: 'screenshot' | 'thought' | 'action' | 'status' | 'message' | 'error' | 'complete';
  data: any;
  timestamp: number;
}

// 任务事件监听器
export type TaskEventListener = (event: TaskEvent) => void;

// 编排器配置
export interface OrchestratorConfig {
  // GUI-Owl配置
  guiOwlApiKey?: string;
  guiOwlEndpoint?: string;
  
  // 截图配置
  screenshotWidth: number;
  screenshotHeight: number;
  
  // 任务配置
  maxSteps: number;           // 最大执行步数
  maxRunTime: number;         // 最大运行时间（毫秒）
  stepDelay: number;          // 步骤间延迟（毫秒）
  
  // 网站配置
  baseUrl: string;            // 招聘网站基础URL
}

// 默认配置
const DEFAULT_CONFIG: OrchestratorConfig = {
  screenshotWidth: 1280,
  screenshotHeight: 720,
  maxSteps: 100,
  maxRunTime: 5 * 60 * 1000,  // 5分钟
  stepDelay: 1000,            // 1秒
  baseUrl: 'http://localhost:3001'
};

/**
 * AI任务编排引擎
 */
export class AIOrchestrator {
  private config: OrchestratorConfig;
  private guiOwlClient: GuiOwlClient;
  private coordinateMapper: CoordinateMapper;
  private screenshotManager: ScreenshotManager;
  
  private state: TaskState = 'IDLE';
  private context: TaskContext;
  private history: GuiOwlHistoryItem[] = [];
  private stepCount: number = 0;
  private isRunning: boolean = false;
  
  private eventListeners: TaskEventListener[] = [];

  constructor(config?: Partial<OrchestratorConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // 初始化子组件
    this.guiOwlClient = new GuiOwlClient({
      apiKey: this.config.guiOwlApiKey,
      endpoint: this.config.guiOwlEndpoint
    });
    
    this.coordinateMapper = new CoordinateMapper({
      width: this.config.screenshotWidth,
      height: this.config.screenshotHeight
    });
    
    this.screenshotManager = new ScreenshotManager({
      width: this.config.screenshotWidth,
      height: this.config.screenshotHeight
    });
    
    // 初始化上下文
    this.context = this.createInitialContext();
  }

  /**
   * 创建初始上下文
   */
  private createInitialContext(): TaskContext {
    return {
      appliedJobs: [],
      startTime: 0,
      maxRunTime: this.config.maxRunTime
    };
  }

  /**
   * 添加事件监听器
   */
  addEventListener(listener: TaskEventListener): void {
    this.eventListeners.push(listener);
  }

  /**
   * 移除事件监听器
   */
  removeEventListener(listener: TaskEventListener): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * 触发事件
   */
  private emit(type: TaskEvent['type'], data: any): void {
    const event: TaskEvent = {
      type,
      data,
      timestamp: Date.now()
    };
    
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('事件监听器错误:', error);
      }
    }
  }

  /**
   * 更新状态
   */
  private setState(newState: TaskState): void {
    const oldState = this.state;
    this.state = newState;
    this.emit('status', { oldState, newState, state: newState });
  }

  /**
   * 获取当前状态
   */
  getState(): TaskState {
    return this.state;
  }

  /**
   * 获取当前上下文
   */
  getContext(): TaskContext {
    return { ...this.context };
  }

  /**
   * 设置简历信息
   */
  setResume(resume: TaskContext['resume']): void {
    this.context.resume = resume;
  }

  /**
   * 设置搜索条件
   */
  setSearchCriteria(criteria: TaskContext['searchCriteria']): void {
    this.context.searchCriteria = criteria;
  }

  /**
   * 启动任务
   */
  async start(page: any): Promise<void> {
    if (this.isRunning) {
      throw new Error('任务已在运行中');
    }

    this.isRunning = true;
    this.stepCount = 0;
    this.history = [];
    this.context.startTime = Date.now();
    
    this.setState('INITIALIZING');
    this.emit('status', { message: 'AI助手启动中...' });

    try {
      await this.runMainLoop(page);
    } catch (error) {
      this.setState('FAILED');
      this.emit('error', { message: (error as Error).message });
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * 暂停任务
   */
  pause(): void {
    if (this.isRunning && this.state !== 'PAUSED') {
      this.setState('PAUSED');
      this.emit('status', { message: '任务已暂停' });
    }
  }

  /**
   * 恢复任务
   */
  resume(): void {
    if (this.state === 'PAUSED') {
      // 恢复到暂停前的状态，这里简化处理
      this.setState('NAVIGATING');
      this.emit('status', { message: '任务已恢复' });
    }
  }

  /**
   * 停止任务
   */
  stop(): void {
    this.isRunning = false;
    this.setState('IDLE');
    this.emit('status', { message: '任务已停止' });
  }

  /**
   * 主循环
   */
  private async runMainLoop(page: any): Promise<void> {
    while (this.isRunning && this.stepCount < this.config.maxSteps) {
      // 检查是否暂停
      if (this.state === 'PAUSED') {
        await this.sleep(500);
        continue;
      }

      // 检查是否超时
      if (Date.now() - this.context.startTime > this.config.maxRunTime) {
        this.emit('status', { message: '任务超时' });
        this.setState('FAILED');
        break;
      }

      // 检查是否完成
      if (this.state === 'COMPLETED' || this.state === 'FAILED') {
        break;
      }

      try {
        // 执行一步
        await this.executeStep(page);
        this.stepCount++;

        // 步骤间延迟
        await this.sleep(this.config.stepDelay);
      } catch (error) {
        console.error('执行步骤失败:', error);
        this.emit('error', { message: (error as Error).message });
        
        // 继续尝试，除非是严重错误
        if ((error as Error).message.includes('致命')) {
          this.setState('FAILED');
          break;
        }
      }
    }

    if (this.state !== 'COMPLETED' && this.state !== 'FAILED') {
      this.setState('COMPLETED');
      this.emit('complete', { 
        stepsExecuted: this.stepCount,
        appliedJobs: this.context.appliedJobs 
      });
    }
  }

  /**
   * 执行单步操作
   */
  private async executeStep(page: any): Promise<void> {
    // 1. 截取当前页面
    const screenshot = await this.captureScreenshot(page);
    this.emit('screenshot', { dataUrl: screenshot.dataUrl });

    // 2. 生成任务指令
    const instruction = this.generateInstruction();

    // 3. 调用GUI-Owl
    const guiOwlConfig: GuiOwlRequestConfig = {
      screenshot: screenshot.base64,
      instruction,
      history: this.history.slice(-10) // 保留最近10条历史
    };

    const response = await this.guiOwlClient.sendRequest(guiOwlConfig);

    // 4. 发送思考过程
    this.emit('thought', { 
      thought: response.thought,
      action: response.action,
      description: describeAction(response)
    });

    // 5. 执行操作
    await this.executeAction(page, response);

    // 6. 记录历史
    this.history.push({
      action: response.action,
      parameters: response.parameters,
      thought: response.thought
    });

    // 7. 更新状态
    this.updateStateBasedOnAction(response);
  }

  /**
   * 捕获截图
   */
  private async captureScreenshot(page: any): Promise<ScreenshotResult> {
    try {
      return await this.screenshotManager.captureFromPlaywright(page);
    } catch (error) {
      console.error('截图失败:', error);
      // 返回模拟截图
      return {
        base64: '',
        dataUrl: '',
        width: this.config.screenshotWidth,
        height: this.config.screenshotHeight,
        format: 'png',
        timestamp: Date.now()
      };
    }
  }

  /**
   * 生成任务指令
   */
  private generateInstruction(): string {
    const { resume, searchCriteria, currentJob } = this.context;

    switch (this.state) {
      case 'INITIALIZING':
      case 'NAVIGATING':
        return '请观察当前页面，找到并点击"职位列表"或"找工作"相关的导航链接';

      case 'SEARCHING_JOBS':
        const keywords = searchCriteria?.keywords?.join('、') || resume?.skills?.slice(0, 3).join('、') || 'AI工程师';
        return `请在搜索框中输入"${keywords}"并搜索职位`;

      case 'FILTERING_JOBS':
        return '请浏览职位列表，找到一个与我技能匹配的职位并点击查看详情';

      case 'VIEWING_DETAILS':
        return '请阅读职位详情，如果适合请点击"申请"或"立即沟通"按钮';

      case 'INITIATING_CHAT':
        return '请在对话框中发送一条专业的打招呼消息，介绍自己的技能和经验';

      case 'CONVERSING':
        return '请根据HR的问题，结合我的简历信息进行专业回复';

      case 'WAITING_RESPONSE':
        return '请等待HR回复，如果有新消息请进行回复';

      default:
        return '请分析当前页面状态，决定下一步操作';
    }
  }

  /**
   * 执行GUI-Owl返回的操作
   */
  private async executeAction(page: any, response: GuiOwlResponse): Promise<void> {
    const { action, parameters } = response;

    this.emit('action', { action, parameters, description: describeAction(response) });

    switch (action) {
      case 'CLICK':
        if (parameters.x !== undefined && parameters.y !== undefined) {
          const absolutePoint = this.coordinateMapper.mapGuiOwlToClick(
            parameters.x,
            parameters.y
          );
          await this.performClick(page, absolutePoint);
        }
        break;

      case 'TYPE':
        if (parameters.text) {
          await this.performType(page, parameters.text, parameters.needs_enter);
        }
        break;

      case 'SCROLL':
        await this.performScroll(page, parameters.direction || 'down', parameters.amount || 300);
        break;

      case 'KEY_PRESS':
        if (parameters.key) {
          await this.performKeyPress(page, parameters.key);
        }
        break;

      case 'FINISH':
        this.setState('COMPLETED');
        break;

      case 'FAIL':
        // 不立即失败，尝试恢复
        console.warn('GUI-Owl返回FAIL，尝试继续...');
        break;
    }
  }

  /**
   * 执行点击操作
   */
  private async performClick(page: any, point: Point): Promise<void> {
    try {
      // 先移动鼠标
      await page.mouse.move(point.x, point.y, { steps: 10 });
      await this.sleep(100);
      
      // 执行点击
      await page.mouse.click(point.x, point.y);
      
      // 等待页面响应
      await this.sleep(500);
    } catch (error) {
      console.error('点击操作失败:', error);
    }
  }

  /**
   * 执行输入操作
   */
  private async performType(page: any, text: string, pressEnter?: boolean): Promise<void> {
    try {
      // 逐字符输入，模拟真人
      for (const char of text) {
        await page.keyboard.type(char, { delay: 50 + Math.random() * 100 });
      }
      
      if (pressEnter) {
        await this.sleep(200);
        await page.keyboard.press('Enter');
      }
    } catch (error) {
      console.error('输入操作失败:', error);
    }
  }

  /**
   * 执行滚动操作
   */
  private async performScroll(
    page: any, 
    direction: 'up' | 'down' | 'left' | 'right', 
    amount: number
  ): Promise<void> {
    try {
      const deltaX = direction === 'left' ? -amount : (direction === 'right' ? amount : 0);
      const deltaY = direction === 'up' ? -amount : (direction === 'down' ? amount : 0);
      
      await page.mouse.wheel({ deltaX, deltaY });
      await this.sleep(300);
    } catch (error) {
      console.error('滚动操作失败:', error);
    }
  }

  /**
   * 执行按键操作
   */
  private async performKeyPress(page: any, key: string): Promise<void> {
    try {
      await page.keyboard.press(key);
    } catch (error) {
      console.error('按键操作失败:', error);
    }
  }

  /**
   * 根据操作更新状态
   */
  private updateStateBasedOnAction(response: GuiOwlResponse): void {
    const { action, thought } = response;
    const thoughtLower = thought.toLowerCase();

    // 根据思考内容推断状态变化
    if (thoughtLower.includes('职位列表') || thoughtLower.includes('job list')) {
      this.setState('SEARCHING_JOBS');
    } else if (thoughtLower.includes('职位详情') || thoughtLower.includes('job detail')) {
      this.setState('VIEWING_DETAILS');
    } else if (thoughtLower.includes('对话') || thoughtLower.includes('chat') || thoughtLower.includes('消息')) {
      this.setState('CONVERSING');
    } else if (thoughtLower.includes('申请成功') || thoughtLower.includes('投递成功')) {
      // 记录申请成功
      if (this.context.currentJob) {
        this.context.appliedJobs.push(this.context.currentJob.id);
      }
    }
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取执行统计
   */
  getStats(): {
    state: TaskState;
    stepCount: number;
    appliedJobs: string[];
    runTime: number;
  } {
    return {
      state: this.state,
      stepCount: this.stepCount,
      appliedJobs: this.context.appliedJobs,
      runTime: this.context.startTime > 0 ? Date.now() - this.context.startTime : 0
    };
  }
}

/**
 * 创建AI编排引擎实例
 */
export function createAIOrchestrator(config?: Partial<OrchestratorConfig>): AIOrchestrator {
  return new AIOrchestrator(config);
}

/**
 * 状态描述映射
 */
export const STATE_DESCRIPTIONS: Record<TaskState, string> = {
  IDLE: '空闲',
  INITIALIZING: '初始化中',
  ANALYZING_RESUME: '分析简历',
  NAVIGATING: '页面导航',
  SEARCHING_JOBS: '搜索职位',
  FILTERING_JOBS: '筛选职位',
  VIEWING_DETAILS: '查看详情',
  INITIATING_CHAT: '发起对话',
  CONVERSING: '智能对话',
  WAITING_RESPONSE: '等待回复',
  COMPLETED: '任务完成',
  FAILED: '任务失败',
  PAUSED: '已暂停'
};
