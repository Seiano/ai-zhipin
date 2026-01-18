// AI智能推荐系统
export interface UserProfile {
  skills: string[];
  experience: number;
  education: string;
  location: string;
  preferredIndustries: string[];
  preferredRoles: string[];
  salaryExpectation: number;
  workTypePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  education: string;
  category: string;
  level: string;
  type: string;
  tags: string[];
  description: string;
  requirements: string[];
  postedDate: string;
  isHot: boolean;
  isUrgent: boolean;
}

export interface Recommendation {
  jobId: string;
  score: number;
  reasons: string[];
  confidence: 'high' | 'medium' | 'low';
}

/**
 * 基于用户画像的职位推荐算法
 */
export function recommendJobsForUser(userProfile: UserProfile, jobs: Job[]): Recommendation[] {
  return jobs.map(job => {
    let score = 0;
    const reasons: string[] = [];

    // 技能匹配度
    const matchedSkills = userProfile.skills.filter(skill =>
      job.tags.some(tag => 
        tag.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(tag.toLowerCase())
      )
    );
    
    const skillMatchRatio = matchedSkills.length / Math.max(1, userProfile.skills.length);
    score += skillMatchRatio * 40; // 技能权重40%
    
    if (skillMatchRatio >= 0.8) {
      reasons.push(`技能高度匹配：${matchedSkills.slice(0, 3).join(', ')}`);
    } else if (skillMatchRatio >= 0.5) {
      reasons.push(`部分技能匹配：${matchedSkills.slice(0, 3).join(', ')}`);
    }

    // 经验匹配度
    const jobExpMatch = parseExperienceRange(job.experience);
    if (userProfile.experience >= jobExpMatch.min && userProfile.experience <= jobExpMatch.max) {
      score += 20; // 经验权重20%
      reasons.push(`经验匹配：您的${userProfile.experience}年经验符合要求`);
    } else if (userProfile.experience > jobExpMatch.max) {
      score += 15;
      reasons.push(`经验超出：您比要求更有经验`);
    } else {
      reasons.push(`经验差距：要求${job.experience}经验`);
    }

    // 地点匹配度
    if (job.location.includes(userProfile.location) || userProfile.location.includes(job.location)) {
      score += 15; // 地点权重15%
      reasons.push(`地点匹配：工作地点在${job.location}`);
    } else {
      reasons.push(`地点不符：工作地点在${job.location}`);
    }

    // 行业偏好匹配
    const industryMatch = userProfile.preferredIndustries.some(industry =>
      job.company.toLowerCase().includes(industry.toLowerCase()) ||
      job.description.toLowerCase().includes(industry.toLowerCase())
    );
    if (industryMatch) {
      score += 10; // 行业权重10%
      reasons.push(`行业偏好匹配`);
    }

    // 薪资匹配度
    const jobSalaryRange = parseSalaryRange(job.salary);
    if (userProfile.salaryExpectation <= jobSalaryRange.max && userProfile.salaryExpectation >= jobSalaryRange.min * 0.8) {
      score += 10; // 薪资权重10%
      reasons.push(`薪资匹配：${job.salary}符合预期`);
    } else if (userProfile.salaryExpectation > jobSalaryRange.max) {
      reasons.push(`薪资差距：期望高于岗位预算`);
    }

    // 工作类型匹配
    if (userProfile.workTypePreference !== 'any') {
      const isRemoteFriendly = job.tags.some(tag => 
        tag.toLowerCase().includes('remote') || 
        tag.toLowerCase().includes('居家')
      );
      
      if ((userProfile.workTypePreference === 'remote' && isRemoteFriendly) ||
          (userProfile.workTypePreference === 'onsite' && !isRemoteFriendly)) {
        score += 5; // 工作类型权重5%
      }
    }

    // 热招职位加分
    if (job.isHot) {
      score += 3; // 热门职位额外加分
      reasons.push(`🔥 热招职位`);
    }

    if (job.isUrgent) {
      score += 2; // 急聘职位额外加分
    }

    // 标准化分数到0-100
    score = Math.min(100, Math.max(0, Math.round(score)));

    // 确定置信度
    let confidence: 'high' | 'medium' | 'low';
    if (score >= 80) confidence = 'high';
    else if (score >= 60) confidence = 'medium';
    else confidence = 'low';

    return {
      jobId: job.id,
      score,
      reasons,
      confidence
    };
  })
  .sort((a, b) => b.score - a.score) // 按分数降序排列
  .slice(0, 20); // 返回前20个推荐
}

/**
 * 解析经验范围
 */
function parseExperienceRange(expStr: string): { min: number; max: number } {
  const nums = expStr.match(/\d+/g);
  if (!nums) return { min: 0, max: 10 }; // 默认0-10年
  
  if (nums.length === 1) {
    const num = parseInt(nums[0]);
    return { min: num, max: num + 2 }; // 如果只给一个数，假设是最低要求
  }
  
  return {
    min: parseInt(nums[0]),
    max: parseInt(nums[nums.length - 1])
  };
}

/**
 * 解析薪资范围
 */
function parseSalaryRange(salaryStr: string): { min: number; max: number } {
  const nums = salaryStr.replace(/[^\d-]/g, '').split('-');
  if (nums.length < 2) {
    // 如果只有一个数字，比如"50K"，我们假设是最低值
    const singleNum = parseInt(nums[0].replace('K', ''));
    return { min: singleNum, max: singleNum * 1.5 }; // 假设最高是1.5倍
  }
  
  return {
    min: parseInt(nums[0]),
    max: parseInt(nums[1])
  };
}

/**
 * 基于历史行为的个性化推荐
 */
export function getPersonalizedRecommendations(
  userProfile: UserProfile, 
  jobs: Job[], 
  viewedJobs: string[],
  appliedJobs: string[]
): Recommendation[] {
  const recommendations = recommendJobsForUser(userProfile, jobs);
  
  // 对已浏览/申请过的职位降权
  return recommendations.map(rec => {
    if (appliedJobs.includes(rec.jobId)) {
      // 已申请的职位降权60%
      return { ...rec, score: Math.max(0, rec.score - 60) };
    } else if (viewedJobs.includes(rec.jobId)) {
      // 已浏览但未申请的职位降权20%
      return { ...rec, score: Math.max(0, rec.score - 20) };
    }
    return rec;
  })
  .sort((a, b) => b.score - a.score);
}

/**
 * 生成职位相似度推荐
 */
export function getSimilarJobs(targetJob: Job, allJobs: Job[], limit: number = 5): Job[] {
  return allJobs
    .filter(job => job.id !== targetJob.id) // 排除目标职位本身
    .map(job => {
      let similarityScore = 0;
      
      // 标签匹配
      const commonTags = targetJob.tags.filter(tag => 
        job.tags.includes(tag)
      ).length;
      similarityScore += commonTags * 20;
      
      // 类别匹配
      if (job.category === targetJob.category) {
        similarityScore += 30;
      }
      
      // 技能匹配
      const commonRequirements = targetJob.requirements.filter(req => 
        job.requirements.some(jReq => 
          jReq.toLowerCase().includes(req.toLowerCase()) ||
          req.toLowerCase().includes(jReq.toLowerCase())
        )
      ).length;
      similarityScore += commonRequirements * 10;
      
      // 职位级别匹配
      if (job.level === targetJob.level) {
        similarityScore += 25;
      }
      
      return { job, similarityScore };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
    .map(item => item.job);
}