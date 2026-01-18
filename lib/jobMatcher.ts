/**
 * 智能职位匹配算法
 * 根据用户简历内容针对性搜索和推荐职位
 */

import { Job, mockJobs } from './mockData';
import { ResumePrivacy } from './resumePrivacy';

export interface MatchResult {
  job: Job;
  matchScore: number;  // 0-100
  matchReasons: string[];
  skillMatches: string[];
  categoryMatch: boolean;
}

/**
 * 技能到职位类别的映射
 */
const skillToCategoryMap: Record<string, string[]> = {
  // 计算机视觉相关
  'OpenCV': ['cv'],
  'YOLO': ['cv'],
  'Mask R-CNN': ['cv'],
  'ResNet': ['cv'],
  'VGG': ['cv'],
  'ViT': ['cv', 'llm'],
  'CLIP': ['cv', 'llm'],
  'SAM': ['cv'],
  'NeRF': ['cv'],
  '目标检测': ['cv'],
  '目标跟踪': ['cv'],
  '图像分割': ['cv'],
  '姿态估计': ['cv'],
  'SLAM': ['cv', 'robotics'],
  '3D视觉': ['cv'],
  'OCR': ['cv'],
  '深度估计': ['cv'],
  '光流估计': ['cv'],
  '视觉SLAM': ['cv', 'robotics'],
  
  // NLP相关
  'BERT': ['nlp', 'llm'],
  'GPT': ['llm', 'nlp'],
  'Transformer': ['llm', 'nlp', 'cv'],
  'NER': ['nlp'],
  '文本分类': ['nlp'],
  '情感分析': ['nlp'],
  '机器翻译': ['nlp'],
  
  // 大模型相关
  'LLaMA': ['llm'],
  'RLHF': ['llm', 'rl'],
  'LoRA': ['llm'],
  'Prompt': ['llm', 'aiagent'],
  'RAG': ['llm', 'aiagent'],
  'Fine-tuning': ['llm'],
  
  // 强化学习
  'PPO': ['rl'],
  'DQN': ['rl'],
  'A3C': ['rl'],
  
  // 机器人/具身智能
  '机器人': ['robotics'],
  'ROS': ['robotics'],
  'MuJoCo': ['robotics'],
  'Isaac Sim': ['robotics'],
  
  // AIGC
  'Stable Diffusion': ['aigc'],
  'GAN': ['aigc'],
  'VAE': ['aigc'],
  'Diffusion': ['aigc'],
  
  // MLOps/工程化
  'TensorRT': ['aiops', 'cv'],
  'ONNX': ['aiops'],
  'Docker': ['aiops'],
  'Kubernetes': ['aiops'],
  'Kubeflow': ['aiops'],
  'MLflow': ['aiops'],
  
  // 硬件相关
  'CUDA': ['hardware', 'cv', 'aiops'],
  'FPGA': ['hardware'],
  'LLVM': ['hardware'],
  'TVM': ['hardware'],
  
  // 数据相关
  'Spark': ['data'],
  'Flink': ['data'],
  'Kafka': ['data'],
  '特征工程': ['data'],
  
  // 通用框架
  'PyTorch': ['llm', 'cv', 'nlp', 'rl'],
  'TensorFlow': ['llm', 'cv', 'nlp'],
  'Python': ['llm', 'cv', 'nlp', 'data', 'aiops'],
  'C++': ['cv', 'hardware', 'robotics'],
};

/**
 * 从简历中提取技能列表
 */
export function extractSkillsFromResume(resume: ResumePrivacy): string[] {
  const skills: Set<string> = new Set();
  
  // 从公开信息提取
  resume.publicInfo.topSkills.forEach(skill => skills.add(skill));
  
  // 从私密信息提取（如果有权限访问）
  if (resume.privateInfo.fullResume?.skills) {
    resume.privateInfo.fullResume.skills.forEach(skill => skills.add(skill));
  }
  
  // 从项目经历提取技术栈
  if (resume.privateInfo.detailedProjects) {
    resume.privateInfo.detailedProjects.forEach(project => {
      project.techStack.forEach(tech => skills.add(tech));
    });
  }
  
  return Array.from(skills);
}

/**
 * 根据技能推断候选人最匹配的职位类别
 */
export function inferJobCategories(skills: string[]): string[] {
  const categoryScores: Record<string, number> = {};
  
  skills.forEach(skill => {
    const normalizedSkill = skill.trim();
    const categories = skillToCategoryMap[normalizedSkill];
    
    if (categories) {
      categories.forEach(cat => {
        categoryScores[cat] = (categoryScores[cat] || 0) + 1;
      });
    }
    
    // 模糊匹配
    Object.entries(skillToCategoryMap).forEach(([key, cats]) => {
      if (normalizedSkill.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(normalizedSkill.toLowerCase())) {
        cats.forEach(cat => {
          categoryScores[cat] = (categoryScores[cat] || 0) + 0.5;
        });
      }
    });
  });
  
  // 按分数排序返回类别
  return Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);
}

/**
 * 计算技能匹配度
 */
function calculateSkillMatch(candidateSkills: string[], jobTags: string[]): {
  score: number;
  matchedSkills: string[];
} {
  const matchedSkills: string[] = [];
  let matchScore = 0;
  
  const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase());
  const normalizedJobTags = jobTags.map(t => t.toLowerCase());
  
  jobTags.forEach(tag => {
    const tagLower = tag.toLowerCase();
    
    // 精确匹配
    if (normalizedCandidateSkills.includes(tagLower)) {
      matchedSkills.push(tag);
      matchScore += 10;
      return;
    }
    
    // 部分匹配
    for (const skill of candidateSkills) {
      const skillLower = skill.toLowerCase();
      if (tagLower.includes(skillLower) || skillLower.includes(tagLower)) {
        matchedSkills.push(tag);
        matchScore += 5;
        return;
      }
    }
  });
  
  // 归一化分数（满分100）
  const maxScore = jobTags.length * 10;
  const normalizedScore = maxScore > 0 ? Math.min(100, (matchScore / maxScore) * 100) : 0;
  
  return {
    score: normalizedScore,
    matchedSkills: [...new Set(matchedSkills)]
  };
}

/**
 * 计算经验匹配度
 */
function calculateExperienceMatch(candidateYears: number, jobExperience: string): number {
  // 解析职位要求的年限
  const match = jobExperience.match(/(\d+)-?(\d+)?年?/);
  if (!match) return 50; // 无法解析时给中等分数
  
  const minYears = parseInt(match[1]);
  const maxYears = match[2] ? parseInt(match[2]) : minYears + 3;
  
  if (candidateYears >= minYears && candidateYears <= maxYears) {
    return 100; // 完美匹配
  } else if (candidateYears >= minYears - 1 && candidateYears <= maxYears + 2) {
    return 80; // 接近匹配
  } else if (candidateYears >= minYears - 2) {
    return 60; // 勉强匹配
  }
  return 30; // 不太匹配
}

/**
 * 智能职位搜索 - 根据简历内容匹配职位
 */
export function searchJobsByResume(resume: ResumePrivacy, limit: number = 10): MatchResult[] {
  const skills = extractSkillsFromResume(resume);
  const preferredCategories = inferJobCategories(skills);
  const candidateYears = resume.publicInfo.yearsOfExperience;
  
  const results: MatchResult[] = [];
  
  mockJobs.forEach(job => {
    const skillMatch = calculateSkillMatch(skills, job.tags);
    const experienceScore = calculateExperienceMatch(candidateYears, job.experience);
    const categoryMatch = preferredCategories.includes(job.category);
    
    // 综合匹配分数
    let totalScore = 0;
    totalScore += skillMatch.score * 0.5; // 技能占50%
    totalScore += experienceScore * 0.2; // 经验占20%
    totalScore += categoryMatch ? 30 : 0; // 类别匹配占30%
    
    // 生成匹配原因
    const reasons: string[] = [];
    if (skillMatch.matchedSkills.length > 0) {
      reasons.push(`技能匹配: ${skillMatch.matchedSkills.slice(0, 3).join('、')}`);
    }
    if (categoryMatch) {
      reasons.push(`职位方向匹配你的专业领域`);
    }
    if (experienceScore >= 80) {
      reasons.push(`${candidateYears}年经验符合要求`);
    }
    
    results.push({
      job,
      matchScore: Math.round(totalScore),
      matchReasons: reasons,
      skillMatches: skillMatch.matchedSkills,
      categoryMatch
    });
  });
  
  // 按匹配度排序
  results.sort((a, b) => b.matchScore - a.matchScore);
  
  return results.slice(0, limit);
}

/**
 * 获取针对简历的职位推荐描述
 */
export function getJobRecommendationDescription(resume: ResumePrivacy): {
  summary: string;
  topCategories: string[];
  searchKeywords: string[];
} {
  const skills = extractSkillsFromResume(resume);
  const categories = inferJobCategories(skills);
  
  const categoryNames: Record<string, string> = {
    cv: '计算机视觉',
    nlp: '自然语言处理',
    llm: '大模型/AGI',
    rl: '强化学习',
    robotics: '机器人/具身智能',
    aigc: 'AIGC/生成式AI',
    aiops: 'AI工程化/MLOps',
    hardware: 'AI芯片/硬件',
    data: '数据科学/工程',
    aiagent: 'AI Agent',
  };
  
  const topCategoryNames = categories.slice(0, 3).map(c => categoryNames[c] || c);
  
  return {
    summary: `根据您${resume.publicInfo.yearsOfExperience}年${resume.publicInfo.topSkills.slice(0, 2).join('、')}经验，推荐${topCategoryNames[0]}方向的职位`,
    topCategories: categories.slice(0, 3),
    searchKeywords: skills.slice(0, 5)
  };
}

/**
 * 为AI助手生成职位搜索报告
 */
export function generateJobSearchReport(resume: ResumePrivacy): string {
  const recommendation = getJobRecommendationDescription(resume);
  const matchedJobs = searchJobsByResume(resume, 5);
  
  let report = `## 智能职位匹配报告\n\n`;
  report += `**候选人**: ${resume.publicInfo.name}\n`;
  report += `**专业方向**: ${recommendation.topCategories.join('、')}\n`;
  report += `**核心技能**: ${recommendation.searchKeywords.join('、')}\n\n`;
  report += `### 推荐职位 (按匹配度排序)\n\n`;
  
  matchedJobs.forEach((result, index) => {
    report += `${index + 1}. **${result.job.title}** - ${result.job.company}\n`;
    report += `   匹配度: ${result.matchScore}% | 薪资: ${result.job.salary}\n`;
    report += `   匹配原因: ${result.matchReasons.join('；')}\n\n`;
  });
  
  return report;
}
