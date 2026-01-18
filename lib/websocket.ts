/**
 * WebSocket实时通信支持
 * 
 * 注意：Next.js的API Routes不直接支持WebSocket
 * 需要使用以下方案之一：
 * 1. 使用独立的WebSocket服务器（推荐）
 * 2. 使用第三方服务（如Pusher、Ably）
 * 3. 使用Server-Sent Events (SSE) 作为替代
 * 
 * 这里提供基础架构，实际部署时需要选择合适的方案
 */

/**
 * WebSocket消息类型
 */
export enum WSMessageType {
  // 连接相关
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // 对话相关
  NEW_MESSAGE = 'new_message',
  CONVERSATION_UPDATE = 'conversation_update',
  TYPING = 'typing',
  
  // 通知相关
  HR_SATISFIED = 'hr_satisfied',
  HR_NOTIFIED = 'hr_notified',
  NEW_MATCH = 'new_match',
  
  // 系统消息
  ERROR = 'error',
  PING = 'ping',
  PONG = 'pong'
}

/**
 * WebSocket消息接口
 */
export interface WSMessage {
  type: WSMessageType;
  payload: any;
  timestamp: number;
  userId?: string;
  conversationId?: string;
}

/**
 * WebSocket客户端类（用于前端）
 */
export class WSClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private handlers: Map<WSMessageType, Function[]> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 连接到WebSocket服务器
   */
  connect(userId: string) {
    try {
      this.ws = new WebSocket(`${this.url}?userId=${userId}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket连接成功');
        this.reconnectAttempts = 0;
        this.emit(WSMessageType.CONNECT, { userId });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('解析消息失败:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        this.emit(WSMessageType.ERROR, error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket连接关闭');
        this.emit(WSMessageType.DISCONNECT, {});
        this.reconnect(userId);
      };
    } catch (error) {
      console.error('WebSocket连接失败:', error);
    }
  }

  /**
   * 重新连接
   */
  private reconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(userId);
      }, this.reconnectInterval);
    } else {
      console.error('达到最大重连次数，停止重连');
    }
  }

  /**
   * 发送消息
   */
  send(type: WSMessageType, payload: any, conversationId?: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type,
        payload,
        timestamp: Date.now(),
        conversationId
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket未连接');
    }
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: WSMessage) {
    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message.payload));
    }
  }

  /**
   * 监听特定类型的消息
   */
  on(type: WSMessageType, handler: Function) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  /**
   * 移除监听器
   */
  off(type: WSMessageType, handler: Function) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(type: WSMessageType, payload: any) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

/**
 * Server-Sent Events (SSE) 客户端（作为WebSocket的替代方案）
 * SSE更容易在Next.js中实现，且对于单向实时推送很合适
 */
export class SSEClient {
  private eventSource: EventSource | null = null;
  private url: string;
  private handlers: Map<string, Function[]> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 连接到SSE服务器
   */
  connect(userId: string) {
    try {
      this.eventSource = new EventSource(`${this.url}?userId=${userId}`);

      this.eventSource.onopen = () => {
        console.log('SSE连接成功');
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        } catch (error) {
          console.error('解析SSE消息失败:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE错误:', error);
        this.emit('error', error);
      };

      // 监听自定义事件
      this.eventSource.addEventListener('conversation_update', (event: any) => {
        const data = JSON.parse(event.data);
        this.emit('conversation_update', data);
      });

      this.eventSource.addEventListener('hr_notified', (event: any) => {
        const data = JSON.parse(event.data);
        this.emit('hr_notified', data);
      });
    } catch (error) {
      console.error('SSE连接失败:', error);
    }
  }

  /**
   * 监听事件
   */
  on(event: string, handler: Function) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  /**
   * 触发事件
   */
  private emit(event: string, data: any) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

/**
 * 创建WebSocket客户端实例
 */
export function createWSClient(): WSClient | null {
  if (typeof window === 'undefined') {
    return null; // 服务器端不创建客户端
  }
  
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
  return new WSClient(wsUrl);
}

/**
 * 创建SSE客户端实例（推荐在Next.js中使用）
 */
export function createSSEClient(): SSEClient | null {
  if (typeof window === 'undefined') {
    return null; // 服务器端不创建客户端
  }
  
  const sseUrl = '/api/sse'; // 使用相对路径
  return new SSEClient(sseUrl);
}

/**
 * 使用示例（在React组件中）：
 * 
 * import { createSSEClient, SSEClient } from '@/lib/websocket';
 * 
 * function MyComponent() {
 *   const [sseClient, setSSEClient] = useState<SSEClient | null>(null);
 * 
 *   useEffect(() => {
 *     const client = createSSEClient();
 *     if (client) {
 *       client.connect('user_001');
 *       
 *       client.on('conversation_update', (data) => {
 *         console.log('对话更新:', data);
 *       });
 *       
 *       client.on('hr_notified', (data) => {
 *         console.log('HR已通知:', data);
 *       });
 *       
 *       setSSEClient(client);
 *     }
 *     
 *     return () => {
 *       client?.disconnect();
 *     };
 *   }, []);
 *   
 *   return <div>...</div>;
 * }
 */
