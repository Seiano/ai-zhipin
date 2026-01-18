'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestLLMPage() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTest = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-llm')
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
        message: '请求失败'
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🧪 阿里云API密钥测试
          </h1>
          <p className="text-gray-600">
            测试您的阿里云通义千问API密钥是否可用
          </p>
        </div>

        {/* Test Button */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <button
              onClick={handleTest}
              disabled={testing}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? '🔄 测试中...' : '🚀 开始测试'}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              点击按钮测试API密钥
            </p>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl shadow-lg p-8 ${
            result.success 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            {result.success ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-2xl">
                    ✅
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-800">
                      测试成功！
                    </h2>
                    <p className="text-green-600">
                      API密钥可以正常使用
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-gray-700 mb-2">🤖 AI响应内容：</h3>
                    <p className="text-gray-800 leading-relaxed">
                      {result.data.aiResponse}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-gray-700 mb-3">📊 Token使用情况：</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {result.data.usage.inputTokens}
                        </div>
                        <div className="text-xs text-gray-600">输入Tokens</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.data.usage.outputTokens}
                        </div>
                        <div className="text-xs text-gray-600">输出Tokens</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {result.data.usage.totalTokens}
                        </div>
                        <div className="text-xs text-gray-600">总计Tokens</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-gray-700 mb-2">ℹ️ 其他信息：</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• 模型: {result.data.model}</p>
                      <p>• 时间: {new Date(result.data.timestamp).toLocaleString('zh-CN')}</p>
                      <p>• 免费额度: 约100万tokens（本次仅使用 {result.data.usage.totalTokens} tokens）</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">🎉 下一步：</h3>
                    <ul className="text-sm text-purple-700 space-y-2">
                      <li>✓ API密钥已验证成功</li>
                      <li>✓ 环境变量已配置 (.env.local)</li>
                      <li>✓ 现在可以使用真实大模型进行对话了！</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-2xl">
                    ❌
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-red-800">
                      测试失败
                    </h2>
                    <p className="text-red-600">
                      {result.message}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-gray-700 mb-2">错误详情：</h3>
                  <pre className="text-sm text-red-600 overflow-x-auto">
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mt-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 可能的原因：</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• API密钥不正确或已过期</li>
                    <li>• API额度已用完</li>
                    <li>• 网络连接问题</li>
                    <li>• 服务未开通或已关闭</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition shadow"
          >
            ← 返回首页
          </Link>
          {result?.success && (
            <Link 
              href="/ai-conversations"
              className="inline-block ml-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow"
            >
              体验AI对话 →
            </Link>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            API密钥配置位置: <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>
          </p>
        </div>
      </div>
    </div>
  )
}
