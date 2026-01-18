/**
 * 坐标转换工具
 * 处理GUI-Owl返回的相对坐标与实际屏幕坐标之间的转换
 */

// 视口尺寸
export interface ViewportSize {
  width: number;
  height: number;
}

// 坐标点
export interface Point {
  x: number;
  y: number;
}

// GUI-Owl使用的相对坐标范围 (0-1000)
const GUI_OWL_COORDINATE_RANGE = 1000;

/**
 * 将GUI-Owl的相对坐标 (0-1000) 转换为实际像素坐标
 */
export function relativeToAbsolute(
  relativePoint: Point,
  viewport: ViewportSize
): Point {
  return {
    x: Math.round((relativePoint.x / GUI_OWL_COORDINATE_RANGE) * viewport.width),
    y: Math.round((relativePoint.y / GUI_OWL_COORDINATE_RANGE) * viewport.height)
  };
}

/**
 * 将实际像素坐标转换为GUI-Owl的相对坐标 (0-1000)
 */
export function absoluteToRelative(
  absolutePoint: Point,
  viewport: ViewportSize
): Point {
  return {
    x: Math.round((absolutePoint.x / viewport.width) * GUI_OWL_COORDINATE_RANGE),
    y: Math.round((absolutePoint.y / viewport.height) * GUI_OWL_COORDINATE_RANGE)
  };
}

/**
 * 确保坐标在视口范围内
 */
export function clampToViewport(
  point: Point,
  viewport: ViewportSize,
  margin: number = 10
): Point {
  return {
    x: Math.max(margin, Math.min(viewport.width - margin, point.x)),
    y: Math.max(margin, Math.min(viewport.height - margin, point.y))
  };
}

/**
 * 验证坐标是否在有效范围内
 */
export function isValidCoordinate(
  point: Point,
  viewport: ViewportSize
): boolean {
  return (
    point.x >= 0 &&
    point.x <= viewport.width &&
    point.y >= 0 &&
    point.y <= viewport.height
  );
}

/**
 * 计算两点之间的距离
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * 在两点之间生成平滑移动路径（用于模拟真人鼠标移动）
 */
export function generateSmoothPath(
  from: Point,
  to: Point,
  steps: number = 20
): Point[] {
  const path: Point[] = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // 使用缓动函数 (easeInOutCubic)
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    // 添加轻微的随机抖动，模拟真人
    const jitterX = (Math.random() - 0.5) * 2;
    const jitterY = (Math.random() - 0.5) * 2;
    
    path.push({
      x: from.x + (to.x - from.x) * eased + jitterX,
      y: from.y + (to.y - from.y) * eased + jitterY
    });
  }
  
  return path;
}

/**
 * 根据滚动方向和数量计算滚动目标位置
 */
export function calculateScrollTarget(
  currentScroll: Point,
  direction: 'up' | 'down' | 'left' | 'right',
  amount: number = 300
): Point {
  switch (direction) {
    case 'up':
      return { x: currentScroll.x, y: Math.max(0, currentScroll.y - amount) };
    case 'down':
      return { x: currentScroll.x, y: currentScroll.y + amount };
    case 'left':
      return { x: Math.max(0, currentScroll.x - amount), y: currentScroll.y };
    case 'right':
      return { x: currentScroll.x + amount, y: currentScroll.y };
    default:
      return currentScroll;
  }
}

/**
 * 坐标映射器类 - 提供完整的坐标转换功能
 */
export class CoordinateMapper {
  private viewport: ViewportSize;
  private screenshotSize: ViewportSize;

  constructor(viewport: ViewportSize, screenshotSize?: ViewportSize) {
    this.viewport = viewport;
    this.screenshotSize = screenshotSize || viewport;
  }

  /**
   * 更新视口尺寸
   */
  updateViewport(viewport: ViewportSize): void {
    this.viewport = viewport;
  }

  /**
   * 更新截图尺寸
   */
  updateScreenshotSize(size: ViewportSize): void {
    this.screenshotSize = size;
  }

  /**
   * 将GUI-Owl坐标转换为实际点击坐标
   */
  mapGuiOwlToClick(guiOwlX: number, guiOwlY: number): Point {
    // GUI-Owl坐标是基于截图的，需要先映射到截图坐标，再映射到视口坐标
    const screenshotPoint = relativeToAbsolute(
      { x: guiOwlX, y: guiOwlY },
      this.screenshotSize
    );

    // 如果截图尺寸和视口尺寸不同，需要缩放
    if (this.screenshotSize.width !== this.viewport.width ||
        this.screenshotSize.height !== this.viewport.height) {
      return {
        x: Math.round(screenshotPoint.x * (this.viewport.width / this.screenshotSize.width)),
        y: Math.round(screenshotPoint.y * (this.viewport.height / this.screenshotSize.height))
      };
    }

    return screenshotPoint;
  }

  /**
   * 将点击坐标转换为GUI-Owl坐标（用于记录历史）
   */
  mapClickToGuiOwl(clickX: number, clickY: number): Point {
    // 先映射到截图坐标
    let screenshotPoint: Point = { x: clickX, y: clickY };
    
    if (this.screenshotSize.width !== this.viewport.width ||
        this.screenshotSize.height !== this.viewport.height) {
      screenshotPoint = {
        x: Math.round(clickX * (this.screenshotSize.width / this.viewport.width)),
        y: Math.round(clickY * (this.screenshotSize.height / this.viewport.height))
      };
    }

    return absoluteToRelative(screenshotPoint, this.screenshotSize);
  }

  /**
   * 获取视口中心点
   */
  getViewportCenter(): Point {
    return {
      x: Math.round(this.viewport.width / 2),
      y: Math.round(this.viewport.height / 2)
    };
  }

  /**
   * 检查坐标是否在视口内
   */
  isInViewport(point: Point): boolean {
    return isValidCoordinate(point, this.viewport);
  }

  /**
   * 获取当前视口尺寸
   */
  getViewport(): ViewportSize {
    return { ...this.viewport };
  }

  /**
   * 获取截图尺寸
   */
  getScreenshotSize(): ViewportSize {
    return { ...this.screenshotSize };
  }
}

/**
 * 创建默认的坐标映射器
 */
export function createCoordinateMapper(
  viewport?: ViewportSize
): CoordinateMapper {
  const defaultViewport: ViewportSize = viewport || {
    width: 1280,
    height: 720
  };
  return new CoordinateMapper(defaultViewport);
}
