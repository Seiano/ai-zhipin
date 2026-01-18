/**
 * SSE (Server-Sent Events) 实时推送管理器
 * 用于AI对话的实时更新
 */

export interface SSEClient {
  id: string;
  userId: string;
  conversationId?: string;
  controller: ReadableStreamDefaultController;
  createdAt: Date;
  lastPing: Date;
}

export interface SSEEvent {
  type: 'message' | 'hr_satisfied' | 'key_point' | 'status_change' | 'ping' | 'conversation_update';
  data: any;
  timestamp: Date;
}

class SSEManager {
  private clients: Map<string, SSEClient> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 30000; // 30秒心跳
  private readonly CLIENT_TIMEOUT = 60000; // 60秒超时

  constructor() {
    this.startPingInterval();
  }

  /**
   * 注册新的SSE客户端
   */
  registerClient(
    userId: string,
    controller: ReadableStreamDefaultController,
    conversationId?: string
  ): string {
    const clientId = `client_${userId}_${Date.now()}`;
    
    const client: SSEClient = {
      id: clientId,
      userId,
      conversationId,
      controller,
      createdAt: new Date(),
      lastPing: new Date()
    };

    this.clients.set(clientId, client);
    console.log(`[SSE] 新客户端已连接: ${clientId}, 用户: ${userId}`);
    
    // 发送连接成功事件
    this.sendToClient(clientId, {
      type: 'status_change',
      data: { status: 'connected', clientId },
      timestamp: new Date()
    });

    return clientId;
  }

  /**
   * 移除客户端
   */
  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      try {
        client.controller.close();
      } catch (e) {
        // 忽略已关闭的控制器
      }
      this.clients.delete(clientId);
      console.log(`[SSE] 客户端已断开: ${clientId}`);
    }
  }

  /**
   * 发送事件给特定客户端
   */
  sendToClient(clientId: string, event: SSEEvent): boolean {
    const client = this.clients.get(clientId);
    if (!client) {
      return false;
    }

    try {
      const data = `data: ${JSON.stringify(event)}\n\n`;
      client.controller.enqueue(new TextEncoder().encode(data));
      client.lastPing = new Date();
      return true;
    } catch (error) {
      console.error(`[SSE] 发送消息失败: ${clientId}`, error);
      this.removeClient(clientId);
      return false;
    }
  }

  /**
   * 发送事件给特定用户的所有客户端
   */
  sendToUser(userId: string, event: SSEEvent): number {
    let sentCount = 0;
    
    for (const [clientId, client] of this.clients) {
      if (client.userId === userId) {
        if (this.sendToClient(clientId, event)) {
          sentCount++;
        }
      }
    }

    return sentCount;
  }

  /**
   * 发送事件给特定对话的所有订阅者
   */
  sendToConversation(conversationId: string, event: SSEEvent): number {
    let sentCount = 0;
    
    for (const [clientId, client] of this.clients) {
      if (client.conversationId === conversationId) {
        if (this.sendToClient(clientId, event)) {
          sentCount++;
        }
      }
    }

    return sentCount;
  }

  /**
   * 广播事件给所有客户端
   */
  broadcast(event: SSEEvent): number {
    let sentCount = 0;
    
    for (const clientId of this.clients.keys()) {
      if (this.sendToClient(clientId, event)) {
        sentCount++;
      }
    }

    return sentCount;
  }

  /**
   * 发送新消息通知
   */
  notifyNewMessage(
    conversationId: string,
    message: {
      id: string;
      role: string;
      content: string;
      timestamp: Date;
      metadata?: any;
    }
  ): void {
    this.sendToConversation(conversationId, {
      type: 'message',
      data: {
        conversationId,
        message
      },
      timestamp: new Date()
    });
  }

  /**
   * 发送HR满意度通知
   */
  notifyHRSatisfied(
    conversationId: string,
    satisfactionScore: number,
    userId: string
  ): void {
    // 发送给对话订阅者
    this.sendToConversation(conversationId, {
      type: 'hr_satisfied',
      data: {
        conversationId,
        satisfactionScore,
        message: '电子HR对你的表现非常满意！已推荐给真人HR'
      },
      timestamp: new Date()
    });

    // 同时发送给用户的所有客户端
    this.sendToUser(userId, {
      type: 'hr_satisfied',
      data: {
        conversationId,
        satisfactionScore,
        message: '恭喜！你的简历已被推荐给真人HR，请保持关注'
      },
      timestamp: new Date()
    });
  }

  /**
   * 发送关键知识点提醒
   */
  notifyKeyPoint(
    conversationId: string,
    keyPoints: string[],
    suggestedActions?: string[]
  ): void {
    this.sendToConversation(conversationId, {
      type: 'key_point',
      data: {
        conversationId,
        keyPoints,
        suggestedActions
      },
      timestamp: new Date()
    });
  }

  /**
   * 发送对话状态变更通知
   */
  notifyStatusChange(
    conversationId: string,
    status: string,
    additionalData?: any
  ): void {
    this.sendToConversation(conversationId, {
      type: 'status_change',
      data: {
        conversationId,
        status,
        ...additionalData
      },
      timestamp: new Date()
    });
  }

  /**
   * 发送对话完整更新
   */
  notifyConversationUpdate(
    conversationId: string,
    conversation: any
  ): void {
    this.sendToConversation(conversationId, {
      type: 'conversation_update',
      data: {
        conversationId,
        conversation
      },
      timestamp: new Date()
    });
  }

  /**
   * 开始心跳检测
   */
  private startPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      const now = new Date();
      
      for (const [clientId, client] of this.clients) {
        // 检查超时
        if (now.getTime() - client.lastPing.getTime() > this.CLIENT_TIMEOUT) {
          console.log(`[SSE] 客户端超时: ${clientId}`);
          this.removeClient(clientId);
          continue;
        }

        // 发送心跳
        this.sendToClient(clientId, {
          type: 'ping',
          data: { timestamp: now.toISOString() },
          timestamp: now
        });
      }
    }, this.PING_INTERVAL);
  }

  /**
   * 停止心跳检测
   */
  stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * 获取当前连接数
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * 获取特定用户的连接数
   */
  getUserClientCount(userId: string): number {
    let count = 0;
    for (const client of this.clients.values()) {
      if (client.userId === userId) {
        count++;
      }
    }
    return count;
  }

  /**
   * 获取所有客户端状态（用于调试）
   */
  getClientsStatus(): Array<{
    id: string;
    userId: string;
    conversationId?: string;
    connectedAt: string;
    lastPing: string;
  }> {
    return Array.from(this.clients.values()).map(client => ({
      id: client.id,
      userId: client.userId,
      conversationId: client.conversationId,
      connectedAt: client.createdAt.toISOString(),
      lastPing: client.lastPing.toISOString()
    }));
  }

  /**
   * 更新客户端订阅的对话
   */
  updateClientConversation(clientId: string, conversationId: string): boolean {
    const client = this.clients.get(clientId);
    if (client) {
      client.conversationId = conversationId;
      return true;
    }
    return false;
  }
}

// 单例模式导出
export const sseManager = new SSEManager();

// 辅助函数：创建SSE响应流
export function createSSEStream(
  userId: string,
  conversationId?: string
): { stream: ReadableStream; clientId: string } {
  let clientId: string;

  const stream = new ReadableStream({
    start(controller) {
      clientId = sseManager.registerClient(userId, controller, conversationId);
    },
    cancel() {
      if (clientId) {
        sseManager.removeClient(clientId);
      }
    }
  });

  return { stream, clientId: clientId! };
}
