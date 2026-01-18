/**
 * AI自动化操作动画系统
 * 模拟真人操作：鼠标移动、点击、输入、滚动等
 */

export interface Position {
  x: number;
  y: number;
}

export interface AutomationStep {
  type: 'move' | 'click' | 'type' | 'scroll' | 'wait' | 'highlight';
  target?: string; // CSS选择器
  position?: Position;
  text?: string;
  duration?: number;
  description?: string;
}

/**
 * AI自动化控制器
 */
export class AIAutomationController {
  private cursor: HTMLDivElement | null = null;
  private isRunning: boolean = false;
  private currentStep: number = 0;
  private onStepCallback?: (step: number, description: string) => void;
  private onCompleteCallback?: () => void;

  constructor() {
    this.createCursor();
  }

  /**
   * 创建虚拟鼠标光标
   */
  private createCursor() {
    if (typeof window === 'undefined') return;

    // 检查是否已存在，避免重复创建
    if (document.getElementById('ai-virtual-cursor')) {
      this.cursor = document.getElementById('ai-virtual-cursor') as HTMLDivElement;
      return;
    }

    this.cursor = document.createElement('div');
    this.cursor.id = 'ai-virtual-cursor';
    this.cursor.style.cssText = `
      position: fixed;
      left: 50vw;
      top: 50vh;
      width: 24px;
      height: 24px;
      background: #6366f1;
      border: 3px solid white;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999999;
      transition: transform 0.1s, opacity 0.3s;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
      display: none;
      opacity: 0;
    `;

    // 添加鼠标指针箭头
    const arrow = document.createElement('div');
    arrow.style.cssText = `
      position: absolute;
      top: -6px;
      left: -6px;
      width: 0;
      height: 0;
      border-left: 12px solid #6366f1;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      transform: rotate(-45deg);
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));
    `;
    this.cursor.appendChild(arrow);

    document.body.appendChild(this.cursor);
  }

  private showCursor() {
    if (this.cursor) {
      this.cursor.style.display = 'block';
      // 强制重绘
      this.cursor.offsetHeight;
      this.cursor.style.opacity = '1';
    }
  }

  /**
   * 隐藏光标
   */
  private hideCursor() {
    if (this.cursor) {
      this.cursor.style.display = 'none';
    }
  }

  /**
   * 移动光标到指定位置
   */
  private async moveCursor(to: Position, duration: number = 800): Promise<void> {
    if (!this.cursor) return;

    const from = {
      x: parseInt(this.cursor.style.left) || 0,
      y: parseInt(this.cursor.style.top) || 0
    };

    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数（easeInOutCubic）
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // 添加轻微的随机抖动，更像真人
        const jitterX = Math.sin(elapsed * 0.01) * 2;
        const jitterY = Math.cos(elapsed * 0.015) * 2;

        const x = from.x + (to.x - from.x) * eased + jitterX;
        const y = from.y + (to.y - from.y) * eased + jitterY;

        if (this.cursor) {
          this.cursor.style.left = `${x}px`;
          this.cursor.style.top = `${y}px`;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  /**
   * 点击动画
   */
  private async clickAnimation(): Promise<void> {
    if (!this.cursor) return;

    // 按下动画
    this.cursor.style.transform = 'scale(0.8)';
    await this.wait(100);

    // 创建涟漪效果
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${this.cursor.style.left};
      top: ${this.cursor.style.top};
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.3);
      pointer-events: none;
      z-index: 9999;
      animation: ripple 0.6s ease-out;
    `;

    // 添加涟漪动画CSS
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple {
          to {
            width: 60px;
            height: 60px;
            margin-left: -30px;
            margin-top: -30px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    await this.wait(100);
    
    // 松开动画
    this.cursor.style.transform = 'scale(1)';
    await this.wait(200);
  }

  /**
   * 打字动画
   */
  private async typeText(element: HTMLElement, text: string): Promise<void> {
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      // 随机打字速度，更像真人
      await this.wait(50 + Math.random() * 100);
    }
  }

  /**
   * 滚动动画
   */
  private async scrollTo(y: number, duration: number = 1000): Promise<void> {
    const startY = window.scrollY;
    const distance = y - startY;
    const startTime = Date.now();

    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 缓动函数
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        window.scrollTo(0, startY + distance * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  /**
   * 高亮元素
   */
  private highlightElement(element: HTMLElement) {
    const originalStyle = element.style.cssText;
    element.style.cssText += `
      outline: 3px solid rgba(99, 102, 241, 0.6);
      outline-offset: 4px;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
      transition: all 0.3s;
    `;

    setTimeout(() => {
      element.style.cssText = originalStyle;
    }, 1500);
  }

  /**
   * 等待
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取元素中心位置
   */
  private getElementCenter(element: HTMLElement): Position {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  /**
   * 执行自动化步骤
   */
  public async executeSteps(steps: AutomationStep[]): Promise<void> {
    this.isRunning = true;
    this.currentStep = 0;
    this.showCursor();

    for (let i = 0; i < steps.length && this.isRunning; i++) {
      const step = steps[i];
      this.currentStep = i;

      // 触发步骤回调
      if (this.onStepCallback && step.description) {
        this.onStepCallback(i, step.description);
      }

      try {
        await this.executeStep(step);
      } catch (error) {
        console.error('执行步骤失败:', error);
      }
    }

    this.hideCursor();
    this.isRunning = false;

    // 触发完成回调
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  /**
   * 执行单个步骤
   */
  private async executeStep(step: AutomationStep): Promise<void> {
    switch (step.type) {
      case 'move':
        if (step.target) {
          const element = document.querySelector(step.target) as HTMLElement;
          if (element) {
            const pos = this.getElementCenter(element);
            await this.moveCursor(pos, step.duration);
          }
        } else if (step.position) {
          await this.moveCursor(step.position, step.duration);
        }
        break;

      case 'click':
        await this.clickAnimation();
        if (step.target) {
          const element = document.querySelector(step.target) as HTMLElement;
          if (element) {
            element.click();
          }
        }
        break;

      case 'type':
        if (step.target && step.text) {
          const element = document.querySelector(step.target) as HTMLElement;
          if (element) {
            await this.typeText(element, step.text);
          }
        }
        break;

      case 'scroll':
        if (step.target) {
          const element = document.querySelector(step.target) as HTMLElement;
          if (element) {
            const rect = element.getBoundingClientRect();
            const scrollY = window.scrollY + rect.top - window.innerHeight / 2;
            await this.scrollTo(scrollY, step.duration);
          }
        }
        break;

      case 'highlight':
        if (step.target) {
          const element = document.querySelector(step.target) as HTMLElement;
          if (element) {
            this.highlightElement(element);
            await this.wait(step.duration || 500);
          }
        }
        break;

      case 'wait':
        await this.wait(step.duration || 1000);
        break;
    }
  }

  /**
   * 停止自动化
   */
  public stop() {
    this.isRunning = false;
    this.hideCursor();
  }

  /**
   * 设置步骤回调
   */
  public onStep(callback: (step: number, description: string) => void) {
    this.onStepCallback = callback;
  }

  /**
   * 设置完成回调
   */
  public onComplete(callback: () => void) {
    this.onCompleteCallback = callback;
  }

  /**
   * 清理
   */
  public destroy() {
    this.stop();
    if (this.cursor) {
      this.cursor.remove();
      this.cursor = null;
    }
  }
}

/**
 * 创建AI求职助手的自动化步骤序列
 */
export function createJobSearchSteps(): AutomationStep[] {
  return [
    {
      type: 'wait',
      duration: 500,
      description: '🤖 AI助手启动中...'
    },
    {
      type: 'move',
      position: { x: 100, y: 100 },
      duration: 500,
      description: '🔍 开始分析您的简历...'
    },
    {
      type: 'wait',
      duration: 1000,
      description: '✅ 简历分析完成：NLP工程师，4年经验，擅长Python、PyTorch'
    },
    {
      type: 'move',
      target: 'a[href="/jobs"]',
      duration: 800,
      description: '📋 正在浏览职位列表...'
    },
    {
      type: 'click',
      target: 'a[href="/jobs"]',
      description: '点击职位列表'
    },
    {
      type: 'wait',
      duration: 1500,
      description: '🔎 正在搜索匹配职位...'
    },
    {
      type: 'scroll',
      target: 'body',
      duration: 2000,
      description: '📜 浏览所有职位...'
    }
  ];
}

// ==================== GUI-Owl 动态驱动支持 ====================

/**
 * GUI-Owl操作类型
 */
export type GuiOwlActionType = 'CLICK' | 'TYPE' | 'SCROLL' | 'KEY_PRESS' | 'FINISH' | 'FAIL';

/**
 * GUI-Owl操作参数
 */
export interface GuiOwlAction {
  action: GuiOwlActionType;
  parameters: {
    x?: number;
    y?: number;
    text?: string;
    needs_enter?: boolean;
    direction?: 'up' | 'down' | 'left' | 'right';
    amount?: number;
    key?: string;
  };
  thought?: string;
}

/**
 * GUI-Owl动态驱动的自动化控制器
 * 扩展基础控制器，支持接收GUI-Owl返回的实时操作指令
 */
export class GuiOwlDrivenController extends AIAutomationController {
  private actionQueue: GuiOwlAction[] = [];
  private isProcessing: boolean = false;
  private onActionCallback?: (action: GuiOwlAction, description: string) => void;

  constructor() {
    super();
  }

  /**
   * 设置操作回调
   */
  public onAction(callback: (action: GuiOwlAction, description: string) => void): void {
    this.onActionCallback = callback;
  }

  /**
   * 将GUI-Owl操作转换为AutomationStep
   */
  private guiOwlToStep(action: GuiOwlAction, viewport: { width: number; height: number }): AutomationStep {
    const { action: actionType, parameters, thought } = action;
    
    switch (actionType) {
      case 'CLICK':
        // 将相对坐标 (0-1000) 转换为实际像素坐标
        const x = parameters.x !== undefined 
          ? Math.round((parameters.x / 1000) * viewport.width) 
          : viewport.width / 2;
        const y = parameters.y !== undefined 
          ? Math.round((parameters.y / 1000) * viewport.height) 
          : viewport.height / 2;
        return {
          type: 'click',
          position: { x, y },
          duration: 300,
          description: thought || `点击位置 (${x}, ${y})`
        };

      case 'TYPE':
        return {
          type: 'type',
          text: parameters.text || '',
          duration: (parameters.text?.length || 0) * 80,
          description: thought || `输入: "${parameters.text}"`
        };

      case 'SCROLL':
        return {
          type: 'scroll',
          duration: 500,
          description: thought || `向${parameters.direction === 'up' ? '上' : '下'}滚动 ${parameters.amount || 300}px`
        };

      case 'FINISH':
        return {
          type: 'wait',
          duration: 0,
          description: thought || '任务完成'
        };

      case 'FAIL':
        return {
          type: 'wait',
          duration: 0,
          description: thought || '操作失败'
        };

      default:
        return {
          type: 'wait',
          duration: 500,
          description: thought || '等待中...'
        };
    }
  }

  /**
   * 执行单个GUI-Owl操作
   */
  public async executeDynamicAction(
    action: GuiOwlAction, 
    viewport: { width: number; height: number } = { width: 1280, height: 720 }
  ): Promise<void> {
    const step = this.guiOwlToStep(action, viewport);
    
    // 触发回调
    if (this.onActionCallback) {
      this.onActionCallback(action, step.description || '');
    }
    
    // 执行步骤
    await this.executeSteps([step]);
  }

  /**
   * 添加操作到队列
   */
  public queueAction(action: GuiOwlAction): void {
    this.actionQueue.push(action);
    this.processQueue();
  }

  /**
   * 处理操作队列
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.actionQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.actionQueue.length > 0) {
      const action = this.actionQueue.shift();
      if (action) {
        await this.executeDynamicAction(action);
      }
    }

    this.isProcessing = false;
  }

  /**
   * 清空队列
   */
  public clearQueue(): void {
    this.actionQueue = [];
  }

  /**
   * 获取队列长度
   */
  public getQueueLength(): number {
    return this.actionQueue.length;
  }
}

/**
 * 创建GUI-Owl驱动的控制器实例
 */
export function createGuiOwlDrivenController(): GuiOwlDrivenController {
  return new GuiOwlDrivenController();
}

/**
 * 将GUI-Owl坐标转换为实际屏幕坐标
 */
export function mapGuiOwlCoordinate(
  relativeCoord: number,
  screenSize: number,
  range: number = 1000
): number {
  return Math.round((relativeCoord / range) * screenSize);
}

/**
 * 生成平滑的光标移动路径
 */
export function generateCursorPath(
  from: Position,
  to: Position,
  steps: number = 20
): Position[] {
  const path: Position[] = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // 使用贝塞尔曲线缓动
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    // 添加轻微的随机抖动
    const jitterX = (Math.random() - 0.5) * 2;
    const jitterY = (Math.random() - 0.5) * 2;
    
    path.push({
      x: from.x + (to.x - from.x) * eased + jitterX,
      y: from.y + (to.y - from.y) * eased + jitterY
    });
  }
  
  return path;
}

