// 简历解析器 - 模拟解析PDF/Word简历内容
export interface ParsedResume {
  name: string;
  skills: string[];
  experience: number;
  education: string;
  projects: string[];
  location: string;
  salaryExpectation?: number;
}

/**
 * 模拟解析简历文件
 * 在实际应用中，这里会使用PDF.js或其他库来解析PDF/Word文件
 */
export async function parseResume(file: File): Promise<ParsedResume> {
  return new Promise((resolve) => {
    // 模拟解析过程
    setTimeout(() => {
      // 根据文件名或内容做一些简单的“解析”
      const fileName = file.name.toLowerCase();
      
      // 模拟不同类型的简历内容
      let parsedData: ParsedResume;
      
      if (fileName.includes('cv') || fileName.includes('resume')) {
        parsedData = {
          name: "张三",
          skills: ["Python", "PyTorch", "TensorFlow", "Transformer", "NLP", "Computer Vision"],
          experience: Math.floor(Math.random() * 6) + 2, // 2-7年经验
          education: fileName.includes('phd') || fileName.includes('博士') ? "Doctorate" : 
                    fileName.includes('master') || fileName.includes('硕士') ? "Master" : "Bachelor",
          projects: [
            "大模型微调与优化项目",
            "计算机视觉目标检测系统",
            "自然语言处理文本分类器",
            "多模态AI应用开发"
          ],
          location: ["北京", "上海", "深圳", "杭州"][Math.floor(Math.random() * 4)],
          salaryExpectation: Math.floor(Math.random() * 40) + 30 // 30-70K
        };
      } else {
        // 默认简历数据
        parsedData = {
          name: "候选人",
          skills: ["Python", "Machine Learning", "Deep Learning", "Data Analysis"],
          experience: 3,
          education: "Master",
          projects: ["数据分析项目", "机器学习模型开发"],
          location: "北京",
          salaryExpectation: 40
        };
      }
      
      resolve(parsedData);
    }, 1500); // 模拟异步解析过程
  });
}

/**
 * 从文本内容中提取技能关键词
 */
export function extractSkillsFromText(text: string): string[] {
  const skillPatterns = [
    // 编程语言
    /python/gi, /javascript/gi, /typescript/gi, /java/gi, /c\+\+/gi, /c#/gi, /go/gi, /rust/gi,
    // 框架和库
    /pytorch/gi, /tensorflow/gi, /keras/gi, /scikit-learn/gi, /pandas/gi, /numpy/gi,
    // AI/ML术语
    /machine learning/gi, /deep learning/gi, /nlp/gi, /computer vision/gi, /transformer/gi,
    /bert/gi, /gpt/gi, /llm/gi, /rl/gi, /reinforcement learning/gi, /cnn/gi, /rnn/gi,
    // 工具和平台
    /docker/gi, /kubernetes/gi, /aws/gi, /azure/gi, /gcp/gi, /spark/gi, /hadoop/gi
  ];
  
  const foundSkills = new Set<string>();
  
  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const skill = match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
        foundSkills.add(skill);
      });
    }
  });
  
  return Array.from(foundSkills).slice(0, 10); // 最多返回10个技能
}

/**
 * 估算工作经验年限
 */
export function estimateExperience(text: string): number {
  const expMatches = text.match(/\d+\s*(年|years?)\s*经验|\d+\s*(年|years?)\s*工作/gi);
  if (expMatches) {
    const years = expMatches.map(match => {
      const numMatch = match.match(/\d+/);
      return numMatch ? parseInt(numMatch[0]) : 0;
    }).filter(year => year > 0);
    
    if (years.length > 0) {
      return Math.max(...years); // 返回最大值
    }
  }
  
  // 如果没有明确提到经验，根据教育程度估算
  if (text.toLowerCase().includes('博士') || text.toLowerCase().includes('phd')) {
    return Math.floor(Math.random() * 3) + 2; // 博士毕业后2-4年
  } else if (text.toLowerCase().includes('硕士') || text.toLowerCase().includes('master')) {
    return Math.floor(Math.random() * 4) + 1; // 硕士毕业后1-4年
  } else {
    return Math.floor(Math.random() * 3); // 本科毕业后0-2年
  }
}

/**
 * 提取教育背景
 */
export function extractEducation(text: string): string {
  if (text.toLowerCase().includes('博士') || text.toLowerCase().includes('phd')) {
    return 'Doctorate';
  } else if (text.toLowerCase().includes('硕士') || text.toLowerCase().includes('master')) {
    return 'Master';
  } else if (text.toLowerCase().includes('本科') || text.toLowerCase().includes('学士') || text.toLowerCase().includes('bachelor')) {
    return 'Bachelor';
  }
  return 'Bachelor'; // 默认
}