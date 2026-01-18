import { NextRequest } from 'next/server';
import { sseManager, createSSEStream } from '@/lib/sseManager';

/**
 * SSE 实时推送端点
 * 用于客户端订阅AI对话的实时更新
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const conversationId = searchParams.get('conversationId');

  if (!userId) {
    return new Response('Missing userId parameter', { status: 400 });
  }

  // 创建SSE流
  const { stream, clientId } = createSSEStream(userId, conversationId || undefined);

  console.log(`[SSE] 新连接建立: userId=${userId}, conversationId=${conversationId}, clientId=${clientId}`);

  // 返回SSE响应
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // 禁用Nginx缓冲
      'Access-Control-Allow-Origin': '*',
      'X-Client-Id': clientId
    }
  });
}

/**
 * 更新客户端订阅的对话
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId, conversationId, action } = await request.json();

    if (!clientId) {
      return Response.json({ error: 'Missing clientId' }, { status: 400 });
    }

    switch (action) {
      case 'subscribe':
        // 订阅特定对话
        if (!conversationId) {
          return Response.json({ error: 'Missing conversationId for subscribe action' }, { status: 400 });
        }
        const subscribeResult = sseManager.updateClientConversation(clientId, conversationId);
        return Response.json({ 
          success: subscribeResult,
          message: subscribeResult ? `已订阅对话: ${conversationId}` : '客户端不存在'
        });

      case 'unsubscribe':
        // 取消订阅
        const unsubscribeResult = sseManager.updateClientConversation(clientId, '');
        return Response.json({ 
          success: unsubscribeResult,
          message: '已取消订阅'
        });

      case 'status':
        // 获取连接状态
        return Response.json({
          success: true,
          clientCount: sseManager.getClientCount(),
          clients: sseManager.getClientsStatus()
        });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[SSE] POST错误:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * 手动发送事件（用于测试或外部触发）
 */
export async function PUT(request: NextRequest) {
  try {
    const { target, event } = await request.json();

    if (!target || !event) {
      return Response.json({ error: 'Missing target or event' }, { status: 400 });
    }

    let sentCount = 0;

    switch (target.type) {
      case 'user':
        sentCount = sseManager.sendToUser(target.userId, {
          type: event.type,
          data: event.data,
          timestamp: new Date()
        });
        break;

      case 'conversation':
        sentCount = sseManager.sendToConversation(target.conversationId, {
          type: event.type,
          data: event.data,
          timestamp: new Date()
        });
        break;

      case 'broadcast':
        sentCount = sseManager.broadcast({
          type: event.type,
          data: event.data,
          timestamp: new Date()
        });
        break;

      default:
        return Response.json({ error: 'Invalid target type' }, { status: 400 });
    }

    return Response.json({
      success: true,
      sentCount,
      message: `事件已发送给 ${sentCount} 个客户端`
    });
  } catch (error) {
    console.error('[SSE] PUT错误:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
