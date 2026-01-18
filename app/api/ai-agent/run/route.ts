import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const scriptPath = path.join(process.cwd(), 'ai_computer_use.py');

  const stream = new ReadableStream({
    start(controller) {
      // 启动 Python 进程
      const pythonProcess = spawn('python3', [scriptPath], {
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });

      pythonProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          if (line.trim()) {
            try {
              // 验证是否为 JSON
              JSON.parse(line);
              controller.enqueue(encoder.encode(`data: ${line}\n\n`));
            } catch (e) {
              // 非 JSON 输出作为 info 处理
              const info = JSON.stringify({ type: 'info', data: line.trim() });
              controller.enqueue(encoder.encode(`data: ${info}\n\n`));
            }
          }
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
        const error = JSON.stringify({ type: 'error', data: data.toString() });
        controller.enqueue(encoder.encode(`data: ${error}\n\n`));
      });

      pythonProcess.on('close', (code) => {
        const close = JSON.stringify({ type: 'close', data: `Process exited with code ${code}` });
        controller.enqueue(encoder.encode(`data: ${close}\n\n`));
        controller.close();
      });

      // 当客户端断开连接时，杀死进程
      req.signal.addEventListener('abort', () => {
        pythonProcess.kill();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
