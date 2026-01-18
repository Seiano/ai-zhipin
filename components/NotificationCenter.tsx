'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, X, CheckCircle, AlertCircle, MessageSquare, TrendingUp, Clock } from 'lucide-react'

export interface Notification {
  id: string
  type: 'hr_satisfied' | 'key_point' | 'message' | 'status_change' | 'info'
  title: string
  message: string
  conversationId?: string
  timestamp: Date
  read: boolean
  data?: any
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onClear: () => void
  onNotificationClick?: (notification: Notification) => void
}

export default function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClear,
  onNotificationClick
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'hr_satisfied':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'key_point':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />
      case 'status_change':
        return <TrendingUp className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getBgColor = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-gray-50'
    switch (type) {
      case 'hr_satisfied':
        return 'bg-green-50'
      case 'key_point':
        return 'bg-orange-50'
      case 'message':
        return 'bg-blue-50'
      case 'status_change':
        return 'bg-purple-50'
      default:
        return 'bg-gray-50'
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    onMarkRead(notification.id)
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 top-full mt-2 w-96 max-h-[70vh] bg-white rounded-lg shadow-xl border z-50 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold">通知中心</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {unreadCount} 条未读
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    全部已读
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition ${getBgColor(notification.type, notification.read)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>暂无通知</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50">
                <button
                  onClick={onClear}
                  className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
                >
                  清空所有通知
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`
  } else {
    return new Date(date).toLocaleDateString()
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 50))
    return newNotification.id
  }, [])

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return {
    notifications,
    addNotification,
    markRead,
    markAllRead,
    clearAll,
    removeNotification
  }
}

export const NotificationMessages = {
  hrSatisfied: (companyName: string, score: number) => ({
    type: 'hr_satisfied' as const,
    title: '恭喜！已推荐给HR',
    message: `${companyName} 的电子HR对你非常满意(${score}分)，已推荐给真人HR！`
  }),

  keyPoint: (points: string[]) => ({
    type: 'key_point' as const,
    title: '对话要点提醒',
    message: points.join('；')
  }),

  newMessage: (role: string, content: string) => ({
    type: 'message' as const,
    title: role === 'electronic_hr' ? '电子HR回复了' : 'AI助手发送了消息',
    message: content.length > 50 ? content.substring(0, 50) + '...' : content
  }),

  statusChange: (status: string, jobTitle: string) => ({
    type: 'status_change' as const,
    title: '对话状态更新',
    message: `${jobTitle} 的对话状态已更新为：${getStatusText(status)}`
  })
}

function getStatusText(status: string): string {
  switch (status) {
    case 'ongoing': return '对话进行中'
    case 'hr_notified': return '已推荐给HR'
    case 'completed': return '已完成'
    case 'rejected': return '不匹配'
    default: return status
  }
}
