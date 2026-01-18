// AI智能通知系统
import { Job, UserProfile, Recommendation } from './aiRecommendation';

export interface Notification {
  id: string;
  userId: string;
  type: 'new_match' | 'high_match' | 'deadline_reminder' | 'application_status' | 'salary_insight';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  read: boolean;
  metadata?: {
    jobId?: string;
    matchScore?: number;
    company?: string;
    salary?: string;
    deadline?: Date;
  };
}

export interface MatchInsight {
  jobId: string;
  matchScore: number;
  improvementTips: string[];
  marketInsight: string;
}

/**
 * AI智能通知生成器
 */
export class AINotificationGenerator {
  /**
   * 生成匹配通知
   */
  static generateMatchNotifications(
    user: UserProfile,
    recommendations: Recommendation[],
    existingJobs: Job[]
  ): Notification[] {
    const notifications: Notification[] = [];

    // 高匹配度通知（>= 85分）
    const highMatchRecs = recommendations.filter(r => r.score >= 85);
    if (highMatchRecs.length > 0) {
      const topMatch = highMatchRecs[0];
      const job = existingJobs.find(j => j.id === topMatch.jobId);

      if (job) {
        notifications.push({
          id: `notification_${Date.now()}_high_match`,
          userId: 'user_placeholder', // 将在实际使用中被替换
          type: 'high_match',
          title: '🎉 高度匹配职位推荐',
          message: `我们为您找到了一个匹配度高达 ${topMatch.score} 分的职位：${job.title} @ ${job.company}。这个职位与您的技能和经验非常契合！`,
          priority: 'high',
          createdAt: new Date(),
          read: false,
          metadata: {
            jobId: job.id,
            matchScore: topMatch.score,
            company: job.company,
            salary: job.salary
          }
        });
      }
    }

    // 新匹配通知（过去24小时内的新职位）
    const recentJobs = existingJobs.filter(job => {
      const postedDate = new Date(job.postedDate);
      const timeDiff = new Date().getTime() - postedDate.getTime();
      return timeDiff <= 24 * 60 * 60 * 1000; // 24小时内
    });

    const newMatches = recentJobs
      .map(job => {
        const rec = recommendations.find(r => r.jobId === job.id);
        return rec ? { job, rec } : null;
      })
      .filter(Boolean) as Array<{ job: Job; rec: Recommendation }>;

    if (newMatches.length > 0) {
      notifications.push({
        id: `notification_${Date.now()}_new_match`,
        userId: 'user_placeholder',
        type: 'new_match',
        title: `发现了 ${newMatches.length} 个新匹配职位`,
        message: `在过去24小时内发布了 ${newMatches.length} 个与您高度相关的职位，匹配度从 ${Math.max(...newMatches.map(m => m.rec.score))} 分到 ${Math.min(...newMatches.map(m => m.rec.score))} 分不等。`,
        priority: 'medium',
        createdAt: new Date(),
        read: false,
        metadata: {
          jobId: newMatches[0].job.id
        }
      });
    }

    return notifications;
  }

  /**
   * 生成薪资洞察通知
   */
  static generateSalaryInsights(
    user: UserProfile,
    jobs: Job[],
    recommendations: Recommendation[]
  ): Notification[] {
    const notifications: Notification[] = [];

    // 分析用户技能对应的市场薪资
    const relevantJobs = jobs.filter(job => {
      return job.tags.some(tag => 
        user.skills.some(skill => 
          tag.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });

    if (relevantJobs.length > 0) {
      const avgSalary = calculateAverageSalary(relevantJobs);
      const userExpected = user.salaryExpectation;

      if (userExpected < avgSalary * 0.8) {
        notifications.push({
          id: `notification_${Date.now()}_salary_insight`,
          userId: 'user_placeholder',
          type: 'salary_insight',
          title: '💡 薪资洞察提醒',
          message: `根据您的技能和经验，市场上类似职位的平均薪资约为 ${(avgSalary).toFixed(0)}K。您当前的期望薪资 (${userExpected}K) 可能偏低，建议适当调整以获得更好的机会。`,
          priority: 'medium',
          createdAt: new Date(),
          read: false,
          metadata: {
            salary: `${avgSalary.toFixed(0)}K`
          }
        });
      } else if (userExpected > avgSalary * 1.2) {
        notifications.push({
          id: `notification_${Date.now()}_salary_insight_high`,
          userId: 'user_placeholder',
          type: 'salary_insight',
          title: '💡 薪资洞察提醒',
          message: `您设定的期望薪资 (${userExpected}K) 高于市场平均水平 (${avgSalary.toFixed(0)}K) 约20%以上。建议适当调整期望以增加匹配机会，或重点关注高端职位。`,
          priority: 'medium',
          createdAt: new Date(),
          read: false,
          metadata: {
            salary: `${avgSalary.toFixed(0)}K`
          }
        });
      }
    }

    return notifications;
  }

  /**
   * 生成申请状态通知
   */
  static generateApplicationStatusNotifications(
    userId: string,
    appliedJobs: Array<{ jobId: string; status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted' }>
  ): Notification[] {
    const notifications: Notification[] = [];

    appliedJobs.forEach(app => {
      if (app.status === 'interview') {
        notifications.push({
          id: `notification_${Date.now()}_interview_${app.jobId}`,
          userId,
          type: 'application_status',
          title: '🎉 面试邀请',
          message: `恭喜！您申请的职位已进入面试环节。请及时查看详细信息并准备面试。`,
          priority: 'high',
          createdAt: new Date(),
          read: false,
          metadata: {
            jobId: app.jobId,
            company: '待填充' // 实际应用中会从数据库获取
          }
        });
      } else if (app.status === 'rejected') {
        notifications.push({
          id: `notification_${Date.now()}_rejected_${app.jobId}`,
          userId,
          type: 'application_status',
          title: '申请结果通知',
          message: `关于您申请的职位，我们收到了回复。虽然这次未能成功，但我们为您推荐了其他更匹配的机会。`,
          priority: 'medium',
          createdAt: new Date(),
          read: false,
          metadata: {
            jobId: app.jobId
          }
        });
      } else if (app.status === 'accepted') {
        notifications.push({
          id: `notification_${Date.now()}_accepted_${app.jobId}`,
          userId,
          type: 'application_status',
          title: '🎉 恭喜！职位申请成功',
          message: `热烈祝贺！您已成功获得该职位。欢迎加入新团队！`,
          priority: 'critical',
          createdAt: new Date(),
          read: false,
          metadata: {
            jobId: app.jobId
          }
        });
      }
    });

    return notifications;
  }

  /**
   * 生成职位截止日期提醒
   */
  static generateDeadlineReminders(
    userId: string,
    appliedJobs: Array<{ jobId: string; deadline: Date }>
  ): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();

    appliedJobs.forEach(app => {
      const timeDiff = app.deadline.getTime() - now.getTime();
      const hoursUntilDeadline = timeDiff / (1000 * 60 * 60);

      if (hoursUntilDeadline <= 24 && hoursUntilDeadline > 0) {
        notifications.push({
          id: `notification_${Date.now()}_deadline_${app.jobId}`,
          userId,
          type: 'deadline_reminder',
          title: '⏰ 申请截止提醒',
          message: `您申请的职位将在 ${Math.ceil(hoursUntilDeadline)} 小时后截止。请尽快完成申请以确保被考虑。`,
          priority: 'high',
          createdAt: new Date(),
          read: false,
          metadata: {
            jobId: app.jobId,
            deadline: app.deadline
          }
        });
      }
    });

    return notifications;
  }
}

/**
 * AI匹配洞察分析器
 */
export class AIMatchAnalyzer {
  /**
   * 生成匹配洞察报告
   */
  static generateMatchInsights(
    user: UserProfile,
    job: Job,
    recommendation: Recommendation
  ): MatchInsight {
    const insights: MatchInsight = {
      jobId: job.id,
      matchScore: recommendation.score,
      improvementTips: [],
      marketInsight: ''
    };

    // 生成改进建议
    const missingSkills = job.tags.filter(tag => 
      !user.skills.some(skill => 
        skill.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(skill.toLowerCase())
      )
    );

    if (missingSkills.length > 0 && missingSkills.length <= 3) {
      insights.improvementTips.push(`技能提升建议：您可以考虑学习 ${missingSkills.join('、')} 等技能，这将显著提高您在此类职位上的竞争力。`);
    } else if (missingSkills.length > 3) {
      insights.improvementTips.push(`技能提升建议：此职位要求较多技能，建议您重点掌握 ${missingSkills.slice(0, 3).join('、')} 等核心技术。`);
    }

    // 经验差距分析
    const jobExpRange = parseExperienceRange(job.experience);
    if (user.experience < jobExpRange.min) {
      const diff = jobExpRange.min - user.experience;
      insights.improvementTips.push(`经验差距：职位要求 ${job.experience} 经验，您还需积累约 ${diff} 年相关经验。建议通过项目实践或实习来弥补差距。`);
    }

    // 教育背景分析
    if (!educationMatches(user.education, job.education)) {
      insights.improvementTips.push(`教育背景：职位要求 ${job.education} 学历，您可以通过在职进修或获得相关认证来增强竞争力。`);
    }

    // 生成市场洞察
    const similarJobs = getSimilarJobsInMarket(job);
    const avgSalary = calculateAverageSalary(similarJobs);
    const avgExp = calculateAverageExperience(similarJobs);

    insights.marketInsight = `基于市场数据分析：同类职位平均薪资为 ${avgSalary.toFixed(0)}K，平均要求经验为 ${avgExp.toFixed(1)} 年。此职位的薪资水平${job.salary.includes((avgSalary - 5).toString()) || job.salary.includes((avgSalary + 5).toString()) ? '接近' : job.salary.includes((avgSalary + 10).toString()) ? '高于' : '低于'}市场平均水平。`;

    return insights;
  }
}

/**
 * 辅助函数
 */
function calculateAverageSalary(jobs: Job[]): number {
  if (jobs.length === 0) return 0;
  
  const salaries = jobs.map(job => {
    const range = parseSalaryRange(job.salary);
    return (range.min + range.max) / 2;
  });
  
  return salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length;
}

function calculateAverageExperience(jobs: Job[]): number {
  if (jobs.length === 0) return 0;
  
  const experiences = jobs.map(job => {
    const range = parseExperienceRange(job.experience);
    return (range.min + range.max) / 2;
  });
  
  return experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length;
}

function parseSalaryRange(salary: string): { min: number; max: number } {
  const nums = salary.replace(/[^\d-]/g, '').split('-');
  if (nums.length < 2) {
    const singleNum = parseInt(nums[0] || '0');
    return { min: singleNum, max: singleNum * 1.5 };
  }
  
  return {
    min: parseInt(nums[0]),
    max: parseInt(nums[1])
  };
}

function parseExperienceRange(experience: string): { min: number; max: number } {
  const nums = experience.match(/\d+/g);
  if (!nums) return { min: 0, max: 10 };
  
  if (nums.length === 1) {
    const num = parseInt(nums[0]);
    return { min: num, max: num + 2 };
  }
  
  return {
    min: parseInt(nums[0]),
    max: parseInt(nums[nums.length - 1])
  };
}

function educationMatches(userEdu: string, jobEdu: string): boolean {
  const eduLevels: Record<string, number> = {
    '高中': 1,
    '专科': 2,
    '本科': 3,
    '硕士': 4,
    '博士': 5
  };

  const userLevel = eduLevels[userEdu] || 3; // 默认本科
  const jobLevel = eduLevels[jobEdu] || 3; // 默认本科

  return userLevel >= jobLevel;
}

function getSimilarJobsInMarket(job: Job): Job[] {
  // 模拟获取市场上的相似职位
  // 在实际应用中，这里会查询数据库
  return [
    { ...job, id: `${job.id}-sim-1`, salary: adjustSalary(job.salary, -2) },
    { ...job, id: `${job.id}-sim-2`, salary: adjustSalary(job.salary, 3) },
    { ...job, id: `${job.id}-sim-3`, salary: adjustSalary(job.salary, 0) }
  ];
}

function adjustSalary(salary: string, adjustment: number): string {
  const nums = salary.replace(/[^\d-]/g, '').split('-');
  if (nums.length < 2) {
    const singleNum = parseInt(nums[0] || '0');
    return `${singleNum + adjustment}K`;
  }
  
  const min = parseInt(nums[0]) + adjustment;
  const max = parseInt(nums[1]) + adjustment;
  return `${min}-${max}K`;
}