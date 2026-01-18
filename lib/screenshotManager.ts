/**
 * 截图管理器
 * 负责生成、存储、编码和清理截图
 */

import { ViewportSize } from './coordinateMapper';

// 截图配置
export interface ScreenshotConfig {
  width: number;
  height: number;
  quality: number;      // 0-100，仅对JPEG有效
  format: 'png' | 'jpeg' | 'webp';
  fullPage: boolean;
}

// 截图结果
export interface ScreenshotResult {
  base64: string;       // Base64编码的图片数据
  dataUrl: string;      // 完整的data URL
  width: number;
  height: number;
  format: string;
  timestamp: number;
}

// 默认截图配置
const DEFAULT_CONFIG: ScreenshotConfig = {
  width: 1280,
  height: 720,
  quality: 80,
  format: 'png',
  fullPage: false
};

/**
 * 截图管理器类
 */
export class ScreenshotManager {
  private config: ScreenshotConfig;
  private cache: Map<string, ScreenshotResult>;
  private maxCacheSize: number;

  constructor(config?: Partial<ScreenshotConfig>, maxCacheSize: number = 10) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = new Map();
    this.maxCacheSize = maxCacheSize;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<ScreenshotConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取当前配置
   */
  getConfig(): ScreenshotConfig {
    return { ...this.config };
  }

  /**
   * 获取视口尺寸
   */
  getViewportSize(): ViewportSize {
    return {
      width: this.config.width,
      height: this.config.height
    };
  }

  /**
   * 将Buffer或ArrayBuffer转换为Base64
   */
  bufferToBase64(buffer: Buffer | ArrayBuffer | Uint8Array): string {
    if (buffer instanceof Buffer) {
      return buffer.toString('base64');
    }
    if (buffer instanceof ArrayBuffer) {
      return Buffer.from(buffer).toString('base64');
    }
    if (buffer instanceof Uint8Array) {
      return Buffer.from(buffer).toString('base64');
    }
    throw new Error('不支持的buffer类型');
  }

  /**
   * 将Base64转换为Data URL
   */
  base64ToDataUrl(base64: string, format?: string): string {
    const mimeType = this.getMimeType(format || this.config.format);
    return `data:${mimeType};base64,${base64}`;
  }

  /**
   * 获取MIME类型
   */
  private getMimeType(format: string): string {
    switch (format.toLowerCase()) {
      case 'png':
        return 'image/png';
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/png';
    }
  }

  /**
   * 从Playwright页面截图（需要传入page对象）
   * 这个方法需要在服务端使用
   */
  async captureFromPlaywright(page: any): Promise<ScreenshotResult> {
    const screenshotBuffer = await page.screenshot({
      type: this.config.format === 'jpeg' ? 'jpeg' : 'png',
      quality: this.config.format === 'jpeg' ? this.config.quality : undefined,
      fullPage: this.config.fullPage,
      clip: this.config.fullPage ? undefined : {
        x: 0,
        y: 0,
        width: this.config.width,
        height: this.config.height
      }
    });

    const base64 = this.bufferToBase64(screenshotBuffer);
    const result: ScreenshotResult = {
      base64,
      dataUrl: this.base64ToDataUrl(base64),
      width: this.config.width,
      height: this.config.height,
      format: this.config.format,
      timestamp: Date.now()
    };

    return result;
  }

  /**
   * 从Canvas元素截图（用于前端）
   */
  async captureFromCanvas(canvas: HTMLCanvasElement): Promise<ScreenshotResult> {
    const mimeType = this.getMimeType(this.config.format);
    const quality = this.config.format === 'jpeg' ? this.config.quality / 100 : undefined;
    
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const base64 = dataUrl.split(',')[1];

    return {
      base64,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      format: this.config.format,
      timestamp: Date.now()
    };
  }

  /**
   * 压缩截图（通过调整尺寸）
   */
  async compressScreenshot(
    screenshot: ScreenshotResult,
    targetWidth: number,
    targetHeight: number
  ): Promise<ScreenshotResult> {
    // 在服务端，可以使用sharp库来压缩
    // 这里提供一个简单的占位实现
    // 实际使用时需要安装sharp并实现真正的压缩逻辑
    
    console.warn('截图压缩功能需要sharp库支持');
    return screenshot;
  }

  /**
   * 缓存截图
   */
  cacheScreenshot(key: string, screenshot: ScreenshotResult): void {
    // 如果缓存已满，删除最旧的
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, screenshot);
  }

  /**
   * 获取缓存的截图
   */
  getCachedScreenshot(key: string): ScreenshotResult | undefined {
    return this.cache.get(key);
  }

  /**
   * 清除所有缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 清除过期缓存（超过指定时间的）
   */
  clearExpiredCache(maxAge: number = 60000): void {
    const now = Date.now();
    for (const [key, screenshot] of this.cache.entries()) {
      if (now - screenshot.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 估算截图大小（字节）
   */
  estimateSize(screenshot: ScreenshotResult): number {
    // Base64编码后的大小约为原始大小的4/3
    return Math.ceil(screenshot.base64.length * 0.75);
  }

  /**
   * 检查截图是否过大（超过指定大小）
   */
  isOversized(screenshot: ScreenshotResult, maxSize: number = 5 * 1024 * 1024): boolean {
    return this.estimateSize(screenshot) > maxSize;
  }
}

/**
 * 创建模拟截图（用于测试或演示）
 */
export function createMockScreenshot(
  width: number = 1280,
  height: number = 720
): ScreenshotResult {
  // 创建一个1x1像素的透明PNG作为占位符
  const minimalPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  return {
    base64: minimalPng,
    dataUrl: `data:image/png;base64,${minimalPng}`,
    width,
    height,
    format: 'png',
    timestamp: Date.now()
  };
}

/**
 * 创建默认的截图管理器
 */
export function createScreenshotManager(
  config?: Partial<ScreenshotConfig>
): ScreenshotManager {
  return new ScreenshotManager(config);
}
