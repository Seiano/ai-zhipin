/**
 * 简单的JSON文件数据库（模拟持久化存储）
 * 实际生产环境应该使用真实数据库（MongoDB、PostgreSQL等）
 */

import fs from 'fs';
import path from 'path';

export interface DBConversation {
  id: string;
  jobSeekerId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  messages: any[];
  status: string;
  satisfactionScores: {
    hrScore: number;
    seekerScore: number;
  };
  keyPoints: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 简单的JSON数据库类
 */
export class SimpleDB {
  private dbPath: string;
  private data: {
    conversations: DBConversation[];
    resumes: any[];
    users: any[];
  };

  constructor(dbPath: string = './data/db.json') {
    this.dbPath = path.resolve(process.cwd(), dbPath);
    this.ensureDBExists();
    this.data = this.loadData();
  }

  /**
   * 确保数据库文件存在
   */
  private ensureDBExists() {
    const dir = path.dirname(this.dbPath);
    
    // 创建data目录
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 创建数据库文件
    if (!fs.existsSync(this.dbPath)) {
      const initialData = {
        conversations: [],
        resumes: [],
        users: []
      };
      fs.writeFileSync(this.dbPath, JSON.stringify(initialData, null, 2));
    }
  }

  /**
   * 加载数据
   */
  private loadData() {
    try {
      const content = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('加载数据库失败:', error);
      return {
        conversations: [],
        resumes: [],
        users: []
      };
    }
  }

  /**
   * 保存数据
   */
  private saveData() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('保存数据库失败:', error);
    }
  }

  // ==================== 对话相关操作 ====================

  /**
   * 保存对话
   */
  saveConversation(conversation: DBConversation) {
    const index = this.data.conversations.findIndex(c => c.id === conversation.id);
    
    if (index >= 0) {
      this.data.conversations[index] = conversation;
    } else {
      this.data.conversations.push(conversation);
    }
    
    this.saveData();
  }

  /**
   * 获取对话
   */
  getConversation(conversationId: string): DBConversation | null {
    return this.data.conversations.find(c => c.id === conversationId) || null;
  }

  /**
   * 获取用户的所有对话
   */
  getConversationsByUser(userId: string): DBConversation[] {
    return this.data.conversations.filter(c => c.jobSeekerId === userId);
  }

  /**
   * 获取职位的所有对话
   */
  getConversationsByJob(jobId: string): DBConversation[] {
    return this.data.conversations.filter(c => c.jobId === jobId);
  }

  /**
   * 删除对话
   */
  deleteConversation(conversationId: string) {
    this.data.conversations = this.data.conversations.filter(c => c.id !== conversationId);
    this.saveData();
  }

  /**
   * 获取所有对话
   */
  getAllConversations(): DBConversation[] {
    return this.data.conversations;
  }

  // ==================== 简历相关操作 ====================

  /**
   * 保存简历
   */
  saveResume(resume: any) {
    const index = this.data.resumes.findIndex(r => r.userId === resume.userId);
    
    if (index >= 0) {
      this.data.resumes[index] = resume;
    } else {
      this.data.resumes.push(resume);
    }
    
    this.saveData();
  }

  /**
   * 获取简历
   */
  getResume(userId: string) {
    return this.data.resumes.find(r => r.userId === userId) || null;
  }

  // ==================== 用户相关操作 ====================

  /**
   * 保存用户
   */
  saveUser(user: any) {
    const index = this.data.users.findIndex(u => u.userId === user.userId);
    
    if (index >= 0) {
      this.data.users[index] = user;
    } else {
      this.data.users.push(user);
    }
    
    this.saveData();
  }

  /**
   * 获取用户
   */
  getUser(userId: string) {
    return this.data.users.find(u => u.userId === userId) || null;
  }

  // ==================== 统计相关 ====================

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      totalConversations: this.data.conversations.length,
      activeConversations: this.data.conversations.filter(c => c.status === 'ongoing').length,
      completedConversations: this.data.conversations.filter(c => c.status === 'completed').length,
      hrNotifiedConversations: this.data.conversations.filter(c => c.status === 'hr_notified').length,
      totalResumes: this.data.resumes.length,
      totalUsers: this.data.users.length
    };
  }

  /**
   * 清空所有数据（慎用）
   */
  clearAll() {
    this.data = {
      conversations: [],
      resumes: [],
      users: []
    };
    this.saveData();
  }
}

// 创建单例实例
let dbInstance: SimpleDB | null = null;

/**
 * 获取数据库实例
 */
export function getDB(): SimpleDB {
  if (!dbInstance) {
    dbInstance = new SimpleDB();
  }
  return dbInstance;
}

/**
 * 在服务器端使用示例：
 * 
 * import { getDB } from '@/lib/simpleDB';
 * 
 * const db = getDB();
 * 
 * // 保存对话
 * db.saveConversation({
 *   id: 'conv_001',
 *   jobSeekerId: 'user_001',
 *   jobId: 'job_001',
 *   messages: [],
 *   // ...
 * });
 * 
 * // 获取对话
 * const conv = db.getConversation('conv_001');
 * 
 * // 获取用户的所有对话
 * const userConvs = db.getConversationsByUser('user_001');
 */
