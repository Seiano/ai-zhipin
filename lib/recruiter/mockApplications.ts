import { Application, ApplicationStatus } from './types'

// 模拟申请数据 - 60条申请记录
export const mockApplications: Application[] = [
  // 高级前端工程师 (jobId: 9) 的申请
  { id: 'app001', jobId: 9, jobTitle: '高级前端工程师', candidateId: 'c001', candidateName: '张三', matchScore: 92, status: 'pending', appliedAt: '2026-01-17 10:30', updatedAt: '2026-01-17 10:30' },
  { id: 'app002', jobId: 9, jobTitle: '高级前端工程师', candidateId: 'c011', candidateName: '李小红', matchScore: 78, status: 'reviewing', appliedAt: '2026-01-16 14:20', updatedAt: '2026-01-16 15:00' },
  { id: 'app003', jobId: 9, jobTitle: '高级前端工程师', candidateId: 'c019', candidateName: '周小凤', matchScore: 65, status: 'rejected', appliedAt: '2026-01-15 09:00', updatedAt: '2026-01-15 16:00', notes: '技术栈不太匹配' },
  
  // Python后端开发 (jobId: 10) 的申请
  { id: 'app004', jobId: 10, jobTitle: 'Python后端开发', candidateId: 'c002', candidateName: '李四', matchScore: 88, status: 'reviewing', appliedAt: '2026-01-17 08:45', updatedAt: '2026-01-17 09:30' },
  { id: 'app005', jobId: 10, jobTitle: 'Python后端开发', candidateId: 'c007', candidateName: '周九', matchScore: 75, status: 'pending', appliedAt: '2026-01-16 16:30', updatedAt: '2026-01-16 16:30' },
  { id: 'app006', jobId: 10, jobTitle: 'Python后端开发', candidateId: 'c008', candidateName: '吴十', matchScore: 70, status: 'interview', appliedAt: '2026-01-14 11:00', updatedAt: '2026-01-16 10:00', interviewTime: '2026-01-18 14:00' },
  
  // AI算法工程师 (jobId: 1) 的申请
  { id: 'app007', jobId: 1, jobTitle: '大模型算法工程师（LLM方向）', candidateId: 'c003', candidateName: '王五', matchScore: 95, status: 'interview', appliedAt: '2026-01-17 09:00', updatedAt: '2026-01-17 11:00', interviewTime: '2026-01-19 10:00' },
  { id: 'app008', jobId: 1, jobTitle: '大模型算法工程师（LLM方向）', candidateId: 'c010', candidateName: '王小明', matchScore: 85, status: 'reviewing', appliedAt: '2026-01-16 10:30', updatedAt: '2026-01-16 14:00' },
  { id: 'app009', jobId: 1, jobTitle: '大模型算法工程师（LLM方向）', candidateId: 'c027', candidateName: '杨小峰', matchScore: 90, status: 'pending', appliedAt: '2026-01-17 14:00', updatedAt: '2026-01-17 14:00' },
  { id: 'app010', jobId: 1, jobTitle: '大模型算法工程师（LLM方向）', candidateId: 'c028', candidateName: '黄小英', matchScore: 82, status: 'pending', appliedAt: '2026-01-17 15:30', updatedAt: '2026-01-17 15:30' },
  
  // 产品经理 (jobId: 15) 的申请
  { id: 'app011', jobId: 15, jobTitle: 'AI产品经理', candidateId: 'c004', candidateName: '赵六', matchScore: 78, status: 'rejected', appliedAt: '2026-01-15 13:00', updatedAt: '2026-01-16 09:00', notes: '缺乏AI产品经验' },
  
  // 计算机视觉工程师 (jobId: 6) 的申请
  { id: 'app012', jobId: 6, jobTitle: '计算机视觉算法工程师', candidateId: 'c009', candidateName: '郑十一', matchScore: 91, status: 'offer', appliedAt: '2026-01-10 10:00', updatedAt: '2026-01-16 16:00', notes: '表现优秀，已发offer' },
  { id: 'app013', jobId: 6, jobTitle: '计算机视觉算法工程师', candidateId: 'c022', candidateName: '王小芳', matchScore: 85, status: 'interview', appliedAt: '2026-01-12 09:30', updatedAt: '2026-01-15 11:00', interviewTime: '2026-01-18 10:00' },
  { id: 'app014', jobId: 6, jobTitle: '计算机视觉算法工程师', candidateId: 'c029', candidateName: '赵小慧', matchScore: 80, status: 'reviewing', appliedAt: '2026-01-14 14:00', updatedAt: '2026-01-15 10:00' },
  
  // NLP算法工程师的申请
  { id: 'app015', jobId: 8, jobTitle: 'NLP算法研究员', candidateId: 'c010', candidateName: '王小明', matchScore: 93, status: 'interview', appliedAt: '2026-01-11 11:00', updatedAt: '2026-01-14 16:00', interviewTime: '2026-01-18 15:00' },
  { id: 'app016', jobId: 8, jobTitle: 'NLP算法研究员', candidateId: 'c025', candidateName: '刘小敏', matchScore: 75, status: 'pending', appliedAt: '2026-01-16 13:00', updatedAt: '2026-01-16 13:00' },
  
  // AIGC算法专家的申请
  { id: 'app017', jobId: 4, jobTitle: 'AIGC算法专家（Diffusion/生成式AI）', candidateId: 'c026', candidateName: '陈小平', matchScore: 89, status: 'reviewing', appliedAt: '2026-01-15 10:30', updatedAt: '2026-01-16 09:00' },
  
  // AI Agent架构师的申请
  { id: 'app018', jobId: 3, jobTitle: 'AI Agent架构师', candidateId: 'c028', candidateName: '黄小英', matchScore: 87, status: 'pending', appliedAt: '2026-01-17 11:00', updatedAt: '2026-01-17 11:00' },
  
  // Embodied AI研究员的申请
  { id: 'app019', jobId: 2, jobTitle: 'Embodied AI研究员（具身智能）', candidateId: 'c018', candidateName: '孙小林', matchScore: 82, status: 'reviewing', appliedAt: '2026-01-14 15:30', updatedAt: '2026-01-15 10:00' },
  { id: 'app020', jobId: 2, jobTitle: 'Embodied AI研究员（具身智能）', candidateId: 'c021', candidateName: '郑小伟', matchScore: 78, status: 'pending', appliedAt: '2026-01-16 09:00', updatedAt: '2026-01-16 09:00' },
  
  // 更多申请记录
  { id: 'app021', jobId: 5, jobTitle: 'MLOps平台工程师', candidateId: 'c016', candidateName: '黄小龙', matchScore: 94, status: 'hired', appliedAt: '2026-01-05 10:00', updatedAt: '2026-01-15 14:00', notes: '优秀候选人，已入职' },
  { id: 'app022', jobId: 5, jobTitle: 'MLOps平台工程师', candidateId: 'c008', candidateName: '吴十', matchScore: 80, status: 'rejected', appliedAt: '2026-01-06 14:30', updatedAt: '2026-01-10 16:00', notes: 'ML经验不足' },
  
  { id: 'app023', jobId: 7, jobTitle: '强化学习研究员', candidateId: 'c018', candidateName: '孙小林', matchScore: 96, status: 'offer', appliedAt: '2026-01-08 09:00', updatedAt: '2026-01-14 11:00', notes: 'RL专家，已发offer' },
  
  { id: 'app024', jobId: 11, jobTitle: '语音算法工程师', candidateId: 'c017', candidateName: '赵小雪', matchScore: 95, status: 'interview', appliedAt: '2026-01-13 10:30', updatedAt: '2026-01-16 09:00', interviewTime: '2026-01-19 14:00' },
  
  { id: 'app025', jobId: 12, jobTitle: '推荐系统架构师', candidateId: 'c023', candidateName: '李小刚', matchScore: 88, status: 'reviewing', appliedAt: '2026-01-15 11:00', updatedAt: '2026-01-16 10:30' },
  
  { id: 'app026', jobId: 13, jobTitle: '搜索算法工程师', candidateId: 'c024', candidateName: '张小燕', matchScore: 91, status: 'interview', appliedAt: '2026-01-12 14:00', updatedAt: '2026-01-15 15:00', interviewTime: '2026-01-18 11:00' },
  
  { id: 'app027', jobId: 14, jobTitle: '知识图谱工程师', candidateId: 'c025', candidateName: '刘小敏', matchScore: 89, status: 'pending', appliedAt: '2026-01-17 09:30', updatedAt: '2026-01-17 09:30' },
  
  // Java开发相关申请
  { id: 'app028', jobId: 16, jobTitle: 'Java高级开发工程师', candidateId: 'c006', candidateName: '孙八', matchScore: 90, status: 'reviewing', appliedAt: '2026-01-16 10:00', updatedAt: '2026-01-16 14:30' },
  { id: 'app029', jobId: 16, jobTitle: 'Java高级开发工程师', candidateId: 'c012', candidateName: '张小华', matchScore: 75, status: 'pending', appliedAt: '2026-01-17 08:00', updatedAt: '2026-01-17 08:00' },
  
  // Go开发相关申请
  { id: 'app030', jobId: 17, jobTitle: 'Go后端开发工程师', candidateId: 'c012', candidateName: '张小华', matchScore: 92, status: 'interview', appliedAt: '2026-01-14 09:00', updatedAt: '2026-01-16 11:00', interviewTime: '2026-01-19 09:00' },
  { id: 'app031', jobId: 17, jobTitle: 'Go后端开发工程师', candidateId: 'c019', candidateName: '周小凤', matchScore: 85, status: 'reviewing', appliedAt: '2026-01-15 14:30', updatedAt: '2026-01-16 09:30' },
  
  // iOS开发申请
  { id: 'app032', jobId: 18, jobTitle: 'iOS开发工程师', candidateId: 'c005', candidateName: '钱七', matchScore: 94, status: 'offer', appliedAt: '2026-01-10 11:00', updatedAt: '2026-01-15 16:30', notes: '技术能力强，沟通好' },
  
  // Android开发申请
  { id: 'app033', jobId: 19, jobTitle: 'Android开发工程师', candidateId: 'c011', candidateName: '李小红', matchScore: 93, status: 'interview', appliedAt: '2026-01-13 10:00', updatedAt: '2026-01-15 14:00', interviewTime: '2026-01-18 09:30' },
  
  // DevOps申请
  { id: 'app034', jobId: 20, jobTitle: 'DevOps工程师', candidateId: 'c008', candidateName: '吴十', matchScore: 91, status: 'reviewing', appliedAt: '2026-01-15 15:00', updatedAt: '2026-01-16 10:00' },
  
  // 数据工程师申请
  { id: 'app035', jobId: 21, jobTitle: '大数据开发工程师', candidateId: 'c007', candidateName: '周九', matchScore: 89, status: 'pending', appliedAt: '2026-01-17 10:00', updatedAt: '2026-01-17 10:00' },
  
  // 安全工程师申请
  { id: 'app036', jobId: 22, jobTitle: '安全工程师', candidateId: 'c013', candidateName: '刘小强', matchScore: 88, status: 'interview', appliedAt: '2026-01-12 09:00', updatedAt: '2026-01-15 11:30', interviewTime: '2026-01-18 14:30' },
  
  // 测试开发申请
  { id: 'app037', jobId: 23, jobTitle: '测试开发工程师', candidateId: 'c015', candidateName: '杨小军', matchScore: 90, status: 'reviewing', appliedAt: '2026-01-14 16:00', updatedAt: '2026-01-16 09:00' },
  
  // UI/UX设计师申请
  { id: 'app038', jobId: 24, jobTitle: 'UI/UX设计师', candidateId: 'c014', candidateName: '陈小美', matchScore: 87, status: 'pending', appliedAt: '2026-01-17 11:30', updatedAt: '2026-01-17 11:30' },
  
  // 自动驾驶申请
  { id: 'app039', jobId: 25, jobTitle: '自动驾驶感知工程师', candidateId: 'c029', candidateName: '赵小慧', matchScore: 94, status: 'interview', appliedAt: '2026-01-11 10:00', updatedAt: '2026-01-14 15:00', interviewTime: '2026-01-18 10:30' },
  { id: 'app040', jobId: 25, jobTitle: '自动驾驶感知工程师', candidateId: 'c022', candidateName: '王小芳', matchScore: 82, status: 'pending', appliedAt: '2026-01-16 14:00', updatedAt: '2026-01-16 14:00' },
  
  // 区块链开发申请
  { id: 'app041', jobId: 26, jobTitle: '区块链开发工程师', candidateId: 'c020', candidateName: '吴小梅', matchScore: 92, status: 'offer', appliedAt: '2026-01-09 11:00', updatedAt: '2026-01-14 16:00', notes: '区块链专家，已发offer' },
  
  // 嵌入式开发申请
  { id: 'app042', jobId: 27, jobTitle: '嵌入式开发工程师', candidateId: 'c021', candidateName: '郑小伟', matchScore: 88, status: 'reviewing', appliedAt: '2026-01-13 15:30', updatedAt: '2026-01-15 10:00' },
  
  // 量化开发申请
  { id: 'app043', jobId: 28, jobTitle: '量化开发工程师', candidateId: 'c030', candidateName: '孙小康', matchScore: 96, status: 'interview', appliedAt: '2026-01-10 09:30', updatedAt: '2026-01-13 14:00', interviewTime: '2026-01-17 15:00' },
  
  // 多模态申请
  { id: 'app044', jobId: 29, jobTitle: '多模态算法工程师', candidateId: 'c027', candidateName: '杨小峰', matchScore: 93, status: 'reviewing', appliedAt: '2026-01-14 10:00', updatedAt: '2026-01-15 16:00' },
  
  // 更多补充申请
  { id: 'app045', jobId: 1, jobTitle: '大模型算法工程师（LLM方向）', candidateId: 'c017', candidateName: '赵小雪', matchScore: 70, status: 'rejected', appliedAt: '2026-01-12 09:00', updatedAt: '2026-01-13 10:00', notes: '方向不匹配' },
  { id: 'app046', jobId: 1, jobTitle: '大模型算法工程师（LLM方向）', candidateId: 'c018', candidateName: '孙小林', matchScore: 75, status: 'pending', appliedAt: '2026-01-17 16:00', updatedAt: '2026-01-17 16:00' },
  
  { id: 'app047', jobId: 3, jobTitle: 'AI Agent架构师', candidateId: 'c003', candidateName: '王五', matchScore: 80, status: 'reviewing', appliedAt: '2026-01-16 11:00', updatedAt: '2026-01-16 15:00' },
  
  { id: 'app048', jobId: 9, jobTitle: '高级前端工程师', candidateId: 'c015', candidateName: '杨小军', matchScore: 55, status: 'rejected', appliedAt: '2026-01-14 10:00', updatedAt: '2026-01-14 16:00', notes: '前端经验不足' },
  
  { id: 'app049', jobId: 10, jobTitle: 'Python后端开发', candidateId: 'c016', candidateName: '黄小龙', matchScore: 72, status: 'pending', appliedAt: '2026-01-17 13:00', updatedAt: '2026-01-17 13:00' },
  
  { id: 'app050', jobId: 4, jobTitle: 'AIGC算法专家（Diffusion/生成式AI）', candidateId: 'c009', candidateName: '郑十一', matchScore: 68, status: 'rejected', appliedAt: '2026-01-13 14:00', updatedAt: '2026-01-14 09:00', notes: 'CV方向，AIGC经验少' },
  
  { id: 'app051', jobId: 6, jobTitle: '计算机视觉算法工程师', candidateId: 'c003', candidateName: '王五', matchScore: 72, status: 'pending', appliedAt: '2026-01-17 09:00', updatedAt: '2026-01-17 09:00' },
  
  { id: 'app052', jobId: 8, jobTitle: 'NLP算法研究员', candidateId: 'c003', candidateName: '王五', matchScore: 88, status: 'interview', appliedAt: '2026-01-09 10:00', updatedAt: '2026-01-12 14:00', interviewTime: '2026-01-17 10:00' },
  
  { id: 'app053', jobId: 12, jobTitle: '推荐系统架构师', candidateId: 'c010', candidateName: '王小明', matchScore: 75, status: 'pending', appliedAt: '2026-01-16 16:00', updatedAt: '2026-01-16 16:00' },
  
  { id: 'app054', jobId: 14, jobTitle: '知识图谱工程师', candidateId: 'c010', candidateName: '王小明', matchScore: 82, status: 'reviewing', appliedAt: '2026-01-15 09:00', updatedAt: '2026-01-16 11:00' },
  
  { id: 'app055', jobId: 7, jobTitle: '强化学习研究员', candidateId: 'c003', candidateName: '王五', matchScore: 70, status: 'rejected', appliedAt: '2026-01-11 11:00', updatedAt: '2026-01-12 10:00', notes: 'RL经验较少' },
  
  { id: 'app056', jobId: 11, jobTitle: '语音算法工程师', candidateId: 'c010', candidateName: '王小明', matchScore: 65, status: 'rejected', appliedAt: '2026-01-14 14:00', updatedAt: '2026-01-15 09:00', notes: '语音领域经验不足' },
  
  { id: 'app057', jobId: 2, jobTitle: 'Embodied AI研究员（具身智能）', candidateId: 'c003', candidateName: '王五', matchScore: 75, status: 'reviewing', appliedAt: '2026-01-15 16:00', updatedAt: '2026-01-16 10:00' },
  
  { id: 'app058', jobId: 5, jobTitle: 'MLOps平台工程师', candidateId: 'c007', candidateName: '周九', matchScore: 78, status: 'pending', appliedAt: '2026-01-17 14:30', updatedAt: '2026-01-17 14:30' },
  
  { id: 'app059', jobId: 29, jobTitle: '多模态算法工程师', candidateId: 'c009', candidateName: '郑十一', matchScore: 80, status: 'pending', appliedAt: '2026-01-17 08:30', updatedAt: '2026-01-17 08:30' },
  
  { id: 'app060', jobId: 29, jobTitle: '多模态算法工程师', candidateId: 'c003', candidateName: '王五', matchScore: 85, status: 'reviewing', appliedAt: '2026-01-16 09:00', updatedAt: '2026-01-16 15:30' }
]

// 获取统计数据
export function getApplicationStats() {
  const stats = {
    totalApplications: mockApplications.length,
    newApplications: mockApplications.filter(a => a.status === 'pending').length,
    pendingReview: mockApplications.filter(a => a.status === 'pending' || a.status === 'reviewing').length,
    interviewScheduled: mockApplications.filter(a => a.status === 'interview').length,
    offerSent: mockApplications.filter(a => a.status === 'offer').length,
    hired: mockApplications.filter(a => a.status === 'hired').length,
    rejected: mockApplications.filter(a => a.status === 'rejected').length
  }
  return stats
}

// 按职位ID获取申请
export function getApplicationsByJobId(jobId: number): Application[] {
  return mockApplications.filter(a => a.jobId === jobId)
}

// 按候选人ID获取申请
export function getApplicationsByCandidateId(candidateId: string): Application[] {
  return mockApplications.filter(a => a.candidateId === candidateId)
}

// 按状态获取申请
export function getApplicationsByStatus(status: ApplicationStatus): Application[] {
  return mockApplications.filter(a => a.status === status)
}

// 获取最近的申请
export function getRecentApplications(limit: number = 10): Application[] {
  return [...mockApplications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, limit)
}

// 获取单个申请
export function getApplicationById(id: string): Application | undefined {
  return mockApplications.find(a => a.id === id)
}
