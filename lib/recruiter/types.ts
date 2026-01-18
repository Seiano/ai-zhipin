// 招聘者端类型定义

// 候选人/简历信息
export interface Candidate {
  id: string
  name: string
  avatar?: string
  email: string
  phone: string
  currentPosition: string
  currentCompany: string
  experience: string // 工作年限
  education: string
  school: string
  skills: string[]
  expectedSalary: string
  location: string
  summary: string
  workHistory: WorkExperience[]
  createdAt: string
}

export interface WorkExperience {
  company: string
  position: string
  duration: string
  description: string
}

// 申请状态
export type ApplicationStatus = 
  | 'pending'      // 待处理
  | 'reviewing'    // 筛选中
  | 'interview'    // 已约面试
  | 'offer'        // 已发offer
  | 'hired'        // 已入职
  | 'rejected'     // 已拒绝

// 职位申请
export interface Application {
  id: string
  jobId: number
  jobTitle: string
  candidateId: string
  candidateName: string
  matchScore: number // AI匹配度
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  notes?: string // 招聘官备注
  interviewTime?: string // 面试时间
}

// AI对话消息
export interface ConversationMessage {
  id: string
  role: 'hr' | 'candidate' | 'system'
  content: string
  timestamp: string
}

// AI对话记录
export interface Conversation {
  id: string
  applicationId: string
  jobId: number
  jobTitle: string
  candidateId: string
  candidateName: string
  messages: ConversationMessage[]
  status: 'active' | 'completed' | 'paused'
  startedAt: string
  updatedAt: string
  roundsCompleted: number
  aiAssessment?: string // AI评估结果
}

// 招聘者发布的职位
export interface RecruiterJob {
  id: number
  title: string
  department: string
  status: 'active' | 'paused' | 'closed'
  applicationsCount: number
  viewsCount: number
  salary: string
  location: string
  createdAt: string
  updatedAt: string
}

// 仪表盘统计
export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  newApplications: number
  totalConversations: number
  pendingReview: number
  interviewScheduled: number
  hired: number
}
