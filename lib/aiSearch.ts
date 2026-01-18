// AI智能搜索系统
import { Job } from './aiRecommendation';

export interface SearchQuery {
  keywords?: string;
  category?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceMin?: number;
  experienceMax?: number;
  jobLevel?: string;
  companyType?: string;
  workType?: 'remote' | 'hybrid' | 'onsite';
  sort?: 'relevance' | 'newest' | 'salary' | 'company_rating';
}

export interface SemanticSearchResult {
  job: Job;
  relevanceScore: number;
  matchReasons: string[];
}

/**
 * 语义化搜索算法 - 基于关键词和语义理解
 */
export function semanticSearch(query: SearchQuery, jobs: Job[]): SemanticSearchResult[] {
  return jobs.map(job => {
    let relevanceScore = 0;
    const matchReasons: string[] = [];

    // 关键词匹配
    if (query.keywords) {
      const lowerKeywords = query.keywords.toLowerCase();
      let keywordMatchScore = 0;

      // 检查标题
      if (job.title.toLowerCase().includes(lowerKeywords)) {
        keywordMatchScore += 25;
        matchReasons.push(`职位标题匹配: "${query.keywords}"`);
      }

      // 检查公司
      if (job.company.toLowerCase().includes(lowerKeywords)) {
        keywordMatchScore += 15;
        matchReasons.push(`公司名称匹配: "${query.keywords}"`);
      }

      // 检查技能标签
      job.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerKeywords)) {
          keywordMatchScore += 20;
          matchReasons.push(`技能标签匹配: "${tag}"`);
        }
      });

      // 检查职位描述
      if (job.description.toLowerCase().includes(lowerKeywords)) {
        keywordMatchScore += 10;
        matchReasons.push(`职位描述匹配: "${query.keywords}"`);
      }

      // 检查要求
      job.requirements.forEach(req => {
        if (req.toLowerCase().includes(lowerKeywords)) {
          keywordMatchScore += 5;
          matchReasons.push(`职位要求匹配: "${req.substring(0, 30)}..."`);
        }
      });

      relevanceScore += keywordMatchScore;
    }

    // 分类匹配
    if (query.category && job.category === query.category) {
      relevanceScore += 20;
      matchReasons.push(`领域分类匹配: "${query.category}"`);
    }

    // 地点匹配
    if (query.location) {
      if (job.location.includes(query.location)) {
        relevanceScore += 15;
        matchReasons.push(`地点匹配: "${query.location}"`);
      }
    }

    // 薪资范围匹配
    if (query.salaryMin || query.salaryMax) {
      const jobSalaryRange = parseJobSalary(job.salary);
      if (query.salaryMin && jobSalaryRange.max >= query.salaryMin) {
        relevanceScore += 10;
        matchReasons.push(`薪资下限匹配: ≥${query.salaryMin}K`);
      }
      if (query.salaryMax && jobSalaryRange.min <= query.salaryMax) {
        relevanceScore += 10;
        matchReasons.push(`薪资上限匹配: ≤${query.salaryMax}K`);
      }
    }

    // 经验要求匹配
    if (query.experienceMin || query.experienceMax) {
      const jobExpRange = parseJobExperience(job.experience);
      if (query.experienceMin && jobExpRange.max >= query.experienceMin) {
        relevanceScore += 8;
        matchReasons.push(`经验下限匹配: ≥${query.experienceMin}年`);
      }
      if (query.experienceMax && jobExpRange.min <= query.experienceMax) {
        relevanceScore += 8;
        matchReasons.push(`经验上限匹配: ≤${query.experienceMax}年`);
      }
    }

    // 职位级别匹配
    if (query.jobLevel && job.level.toLowerCase().includes(query.jobLevel.toLowerCase())) {
      relevanceScore += 12;
      matchReasons.push(`职位级别匹配: "${query.jobLevel}"`);
    }

    // 工作类型匹配
    if (query.workType) {
      const isRemote = job.tags.some(tag => 
        tag.toLowerCase().includes('remote') || 
        tag.toLowerCase().includes('居家')
      );
      
      if ((query.workType === 'remote' && isRemote) ||
          (query.workType === 'onsite' && !isRemote)) {
        relevanceScore += 15;
        matchReasons.push(`工作类型匹配: ${query.workType}`);
      }
    }

    // 热门职位加分
    if (job.isHot) {
      relevanceScore += 5;
    }

    if (job.isUrgent) {
      relevanceScore += 3;
    }

    return {
      job,
      relevanceScore,
      matchReasons
    };
  })
  .filter(result => result.relevanceScore > 0) // 过滤掉完全不匹配的结果
  .sort((a, b) => b.relevanceScore - a.relevanceScore); // 按相关性排序
}

/**
 * 智能搜索建议 - 基于用户输入提供搜索提示
 */
export function getSearchSuggestions(input: string, jobs: Job[]): string[] {
  const suggestions: string[] = [];
  const lowerInput = input.toLowerCase();

  // 基于标签的建议
  const allTags = jobs.flatMap(job => job.tags);
  const matchingTags = Array.from(new Set(allTags))
    .filter(tag => tag.toLowerCase().includes(lowerInput))
    .slice(0, 3);
  suggestions.push(...matchingTags);

  // 基于公司的建议
  const uniqueCompanies = Array.from(new Set(jobs.map(job => job.company)));
  const matchingCompanies = uniqueCompanies
    .filter(company => company.toLowerCase().includes(lowerInput))
    .slice(0, 2);
  suggestions.push(...matchingCompanies);

  // 基于职位名称的建议
  const uniqueTitles = Array.from(new Set(jobs.map(job => job.title)));
  const matchingTitles = uniqueTitles
    .filter(title => title.toLowerCase().includes(lowerInput))
    .slice(0, 3);
  suggestions.push(...matchingTitles);

  // 基于地点的建议
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
  const matchingLocations = uniqueLocations
    .filter(location => location.toLowerCase().includes(lowerInput))
    .slice(0, 2);
  suggestions.push(...matchingLocations);

  return Array.from(new Set(suggestions)); // 去重
}

/**
 * 解析职位薪资
 */
function parseJobSalary(salary: string): { min: number; max: number } {
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

/**
 * 解析职位经验要求
 */
function parseJobExperience(experience: string): { min: number; max: number } {
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

/**
 * 智能搜索 - 结合语义搜索和个性化推荐
 */
export function intelligentSearch(
  query: SearchQuery, 
  jobs: Job[], 
  userId?: string
): SemanticSearchResult[] {
  // 执行语义搜索
  let results = semanticSearch(query, jobs);
  
  // 如果有用户ID，应用个性化排序
  if (userId) {
    results = applyPersonalization(results, userId);
  }
  
  // 应用排序
  switch (query.sort) {
    case 'newest':
      results.sort((a, b) => 
        new Date(b.job.postedDate).getTime() - new Date(a.job.postedDate).getTime()
      );
      break;
    case 'salary':
      results.sort((a, b) => {
        const aSal = parseJobSalary(a.job.salary).max;
        const bSal = parseJobSalary(b.job.salary).max;
        return bSal - aSal; // 按薪资降序
      });
      break;
    case 'company_rating':
      // 模拟公司评级排序（在实际应用中会有一个公司评级系统）
      results.sort((a, b) => {
        // 这里可以根据公司规模、知名度等因素进行排序
        const aRating = getCompanyRating(a.job.company);
        const bRating = getCompanyRating(b.job.company);
        return bRating - aRating;
      });
      break;
    case 'relevance':
    default:
      // 保持相关性排序
      break;
  }
  
  return results;
}

/**
 * 应用个性化排序
 */
function applyPersonalization(results: SemanticSearchResult[], userId: string): SemanticSearchResult[] {
  // 这里可以基于用户的历史行为、偏好等进行个性化排序
  // 模拟：对于某些用户，稍微调整热门职位的权重
  const userSpecificFactor = Math.abs(userId.hashCode ? userId.hashCode() : 0) % 100;
  
  return results.map(result => {
    // 基于用户ID的随机因素调整，模拟个性化
    const personalizationBoost = result.job.isHot ? 
      (userSpecificFactor % 10) / 100 : // 热门职位的个性化调整
      0;
    
    return {
      ...result,
      relevanceScore: result.relevanceScore * (1 + personalizationBoost)
    };
  })
  .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * 获取公司评级（模拟）
 */
function getCompanyRating(companyName: string): number {
  // 模拟公司评级，实际应用中会从数据库获取
  const ratings: Record<string, number> = {
    '字节跳动': 95,
    '腾讯': 92,
    '阿里巴巴': 90,
    '百度': 85,
    '商汤科技': 80,
    '旷视科技': 78,
    '小鹏汽车': 75,
    '理想汽车': 72,
    '华为': 98,
    '大疆': 88,
    '快手': 82,
    '美团': 86,
    '网易有道': 75,
    'OpenAI中国': 90,
    '京东': 85,
    '蚂蚁集团': 88,
    '合合信息': 70,
    'Momenta': 76
  };
  
  return ratings[companyName] || 50; // 默认评级50
}

// 为字符串添加hashCode方法
declare global {
  interface String {
    hashCode?(): number;
  }
}

if (!String.prototype.hashCode) {
  String.prototype.hashCode = function(): number {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      const char = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
}