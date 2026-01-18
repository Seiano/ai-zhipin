// 电子HR智能体系统
import { ResumePrivacy, formatResumeForPrompt, hasAccess } from './resumePrivacy'

export interface ElectronicHR {
  id: string;
  jobId: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  personality: 'professional' | 'friendly' | 'technical';
  systemPrompt: string;
  conversationHistory: Message[];
}

export interface JobSeekerAI {
  id: string;
  userId: string;
  userName: string;
  skills: string[];
  experience: number;
  desiredPositions: string[];
  systemPrompt: string;
  conversationHistory: Message[];
}

export interface AIConversation {
  id: string;
  jobSeekerId: string;
  jobId: string;
  electronicHRId: string;
  aiAssistantId: string;
  messages: Message[];
  status: 'initiated' | 'ongoing' | 'ai_satisfied' | 'hr_notified' | 'completed' | 'rejected';
  satisfactionScores: {
    hrScore: number;
    seekerScore: number;
  };
  keyPoints: string[]; // 对话中的关键知识点
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'electronic_hr' | 'jobseeker_ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    intent?: string;
    extractedInfo?: Record<string, any>;
  };
}

// 重新导出 ResumePrivacy 以保持兼容性
export type { ResumePrivacy } from './resumePrivacy'

/**
 * 电子HR智能体 - 使用大模型进行智能对话
 */
export class ElectronicHRAgent {
  private hr: ElectronicHR;
  private hasResumeAccess: boolean = false;
  private resumePrivacy: ResumePrivacy | null = null;

  constructor(
    jobId: string,
    companyName: string,
    jobTitle: string,
    personality: 'professional' | 'friendly' | 'technical' = 'professional',
    jobDescription?: string
  ) {
    this.hr = {
      id: `hr_${jobId}_${Date.now()}`,
      jobId,
      companyName,
      jobTitle,
      jobDescription,
      personality,
      systemPrompt: this.generateSystemPrompt(companyName, jobTitle, personality, jobDescription),
      conversationHistory: []
    };
  }

  private generateSystemPrompt(
    companyName: string,
    jobTitle: string,
    personality: string,
    jobDescription?: string
  ): string {
    const basePrompt = `你是${companyName}的AI招聘助手（电子HR），负责${jobTitle}职位的初步筛选和沟通。`;
    
    const personalityPrompts = {
      professional: `作为专业型HR，你应该：
- 保持专业、礼貌的态度
- 关注候选人的专业能力和工作经验
- 询问要有深度，能评估候选人是否真正具备相关技能
- 用专业术语与候选人交流`,
      friendly: `作为亲和型HR，你应该：
- 友好、亲切，让候选人感到舒适
- 在评估专业能力的同时，关注候选人的团队协作能力和文化匹配度
- 适当分享公司文化和团队氛围
- 让对话轻松愉快但不失专业`,
      technical: `作为技术型HR，你应该：
- 深入技术细节，询问具体的技术实现
- 考察项目经验、技术栈选择、架构设计等
- 判断候选人的技术深度和广度
- 讨论具体的技术问题和解决方案`
    };

    let prompt = `${basePrompt}

【你的风格】
${personalityPrompts[personality as keyof typeof personalityPrompts]}

【职位信息】
职位：${jobTitle}
公司：${companyName}
${jobDescription ? `职位描述：${jobDescription}` : ''}

【核心任务】
1. 与候选人进行自然、深入的对话，了解其真实能力
2. 根据候选人的回答灵活调整提问，不要机械化照本宣科
3. 评估候选人与职位的匹配度（0-100分）
4. 关注技术深度、项目经验、问题解决能力、沟通表达
5. 满意度达到80分时，推荐给真人HR

【对话要求】
- 每次只问1-2个问题，不要一次性问太多
- 问题要有针对性，根据候选人的回答深入追问
- 展现对候选人背景的理解和兴趣
- 保持对话自然流畅，像真人HR一样思考和回应

【隐私规则】
- 候选人主动打招呼前，只能看到公开信息（姓名、职位、年限、前3个技能、学历）
- 获得授权后可查看完整简历，但要尊重隐私
- 不要主动询问敏感个人信息`;

    return prompt;
  }

  /**
   * 获取HR ID
   */
  getId(): string {
    return this.hr.id;
  }

  /**
   * 获取职位ID
   */
  getJobId(): string {
    return this.hr.jobId;
  }

  /**
   * 接收求职者打招呼，授权查看简历
   */
  grantResumeAccess(resumePrivacy: ResumePrivacy): {
    message: string;
    hasAccess: boolean;
  } {
    this.hasResumeAccess = true;
    this.resumePrivacy = resumePrivacy;
    
    const publicInfo = resumePrivacy.publicInfo;
    
    return {
      message: `你好${publicInfo.name}！我是${this.hr.companyName}的AI招聘助手。很高兴收到你对${this.hr.jobTitle}职位的申请！

我注意到你有${publicInfo.yearsOfExperience}年${publicInfo.topSkills.join('、')}相关经验，这和我们的需求非常匹配。我已经查看了你的简历，让我们来深入聊聊吧。

首先，能否介绍一下你最近在做的项目？特别是和${publicInfo.topSkills[0] || 'AI'}相关的经验。`,
      hasAccess: true
    };
  }

  /**
   * 检查是否有简历访问权限
   */
  checkResumeAccess(): boolean {
    return this.hasResumeAccess;
  }

  /**
   * 获取系统提示词（用于LLM调用）
   */
  getSystemPrompt(): string {
    return this.hr.systemPrompt;
  }

  /**
   * 获取完整系统提示词（包含简历信息）
   */
  getFullSystemPrompt(resumePrivacy?: ResumePrivacy): string {
    const privacy = resumePrivacy || this.resumePrivacy;
    if (!privacy) {
      return this.hr.systemPrompt;
    }
    
    const resumeInfo = formatResumeForPrompt(privacy, this.hr.jobId);
    return `${this.hr.systemPrompt}\n\n【候选人信息】\n${resumeInfo}`;
  }

  /**
   * 生成智能回复（模拟大模型调用）
   */
  async generateResponse(userMessage: string, resumeInfo: ResumePrivacy, conversationContext: Message[]): Promise<{
    response: string;
    intent: string;
    satisfactionScore: number;
    extractedInfo: Record<string, any>;
    shouldNotifyHR: boolean;
    keyPointsForUser: string[];
  }> {
    // 在实际应用中，这里会调用GPT-4或其他大模型API
    // 现在我们创建一个智能的模拟响应系统
    
    const context = this.buildContext(resumeInfo, conversationContext);
    const analysis = await this.analyzeMessage(userMessage, context);
    
    // 根据对话轮次和内容智能生成问题
    const response = await this.generateIntelligentResponse(analysis, context, conversationContext.length, resumeInfo);
    
    // 提取关键知识点提醒用户
    const keyPointsForUser = this.extractKeyPointsForUser(userMessage, response.response);
    
    return {
      ...response,
      keyPointsForUser
    };
  }

  /**
   * 提取关键知识点提醒用户
   */
  private extractKeyPointsForUser(hrQuestion: string, hrResponse: string): string[] {
    const keyPoints: string[] = [];
    
    // 从HR的问题中提取关键点
    if (/项目|经验|案例/i.test(hrQuestion)) {
      keyPoints.push('HR正在关注你的项目经验');
    }
    if (/技术|框架|工具|语言|算法/i.test(hrQuestion)) {
      keyPoints.push('HR正在考察你的技术深度');
    }
    if (/挑战|困难|问题|解决/i.test(hrQuestion)) {
      keyPoints.push('HR想了解你的问题解决能力');
    }
    if (/团队|协作|沟通/i.test(hrQuestion)) {
      keyPoints.push('HR正在评估你的团队协作能力');
    }
    if (/薪资|期望|待遇/i.test(hrQuestion)) {
      keyPoints.push('对话进入薪资谈判阶段');
    }
    if (/推荐|满意|表现/i.test(hrResponse)) {
      keyPoints.push('HR对你的表现比较满意');
    }
    
    return keyPoints;
  }

  private buildContext(resumeInfo: ResumePrivacy, conversationContext: Message[]): string {
    const info = this.hasResumeAccess ? resumeInfo.privateInfo : resumeInfo.publicInfo;
    
    return `
职位: ${this.hr.jobTitle}
公司: ${this.hr.companyName}
候选人信息: ${JSON.stringify(info, null, 2)}
对话历史: ${conversationContext.map(m => `${m.role}: ${m.content}`).join('\n')}
`;
  }

  private async analyzeMessage(message: string, context: string): Promise<{
    intent: string;
    keyPoints: string[];
    confidence: number;
    emotion?: string;
  }> {
    // 增强的意图识别系统
    let detectedIntent = 'general_inquiry';
    let confidence = 0.7;
    let emotion = 'neutral';

    // 多维度意图识别
    const intentPatterns = [
      { pattern: /(你好|您好|hi|hello)/i, intent: 'greeting', confidence: 0.95 },
      { pattern: /(项目|实战|案例|做过|负责)/i, intent: 'project_experience', confidence: 0.85 },
      { pattern: /(技术|框架|工具|语言|算法|模型)/i, intent: 'technical_discussion', confidence: 0.90 },
      { pattern: /(薪资|薪水|工资|待遇|offer)/i, intent: 'salary_inquiry', confidence: 0.88 },
      { pattern: /(文化|氛围|团队|加班|福利)/i, intent: 'company_culture', confidence: 0.82 },
      { pattern: /(学习|成长|发展|提升|进步)/i, intent: 'growth_mindset', confidence: 0.80 },
      { pattern: /(挑战|困难|问题|解决)/i, intent: 'problem_solving', confidence: 0.83 },
      { pattern: /(为什么|原因|动机|兴趣)/i, intent: 'motivation', confidence: 0.85 },
      { pattern: /(什么时候|时间|日期|安排)/i, intent: 'timeline_inquiry', confidence: 0.80 },
      { pattern: /(具体|详细|深入|进一步)/i, intent: 'deep_dive', confidence: 0.75 }
    ];

    // 情感分析
    if (/(期待|希望|很想|非常|激动|兴奋)/i.test(message)) {
      emotion = 'positive';
      confidence += 0.05;
    } else if (/(担心|疑问|不确定|困惑)/i.test(message)) {
      emotion = 'uncertain';
    }

    // 匹配意图
    for (const { pattern, intent, confidence: conf } of intentPatterns) {
      if (pattern.test(message)) {
        detectedIntent = intent;
        confidence = conf;
        break;
      }
    }

    // 提取关键点
    const keyPoints = this.extractKeyPoints(message);

    return {
      intent: detectedIntent,
      keyPoints,
      confidence,
      emotion
    };
  }

  private extractKeyPoints(message: string): string[] {
    // 增强的关键词提取系统
    const techKeywords = [
      // AI/ML框架
      'PyTorch', 'TensorFlow', 'Keras', 'JAX', 'MXNet', 'Caffe',
      // 大模型相关
      'Transformer', 'BERT', 'GPT', 'LLaMA', 'ChatGPT', 'Claude',
      'RLHF', 'Prompt', 'Fine-tuning', 'LoRA', 'QLoRA',
      // 深度学习
      'LSTM', 'GRU', 'CNN', 'RNN', 'GAN', 'VAE', 'Diffusion',
      // 计算机视觉
      'YOLO', 'ResNet', 'VGG', 'ViT', 'CLIP', 'SAM', 'NeRF',
      // NLP
      'Word2Vec', 'ELMO', 'Attention', 'Seq2Seq', 'NER', 'NLU',
      // 编程语言
      'Python', 'C++', 'Java', 'Go', 'Rust', 'JavaScript', 'TypeScript',
      // 工具和平台
      'Docker', 'Kubernetes', 'Git', 'Linux', 'AWS', 'Azure', 'GCP',
      'React', 'Vue', 'Node.js', 'FastAPI', 'Flask', 'Django',
      // 数据处理
      'Pandas', 'NumPy', 'Spark', 'Kafka', 'Redis', 'MongoDB',
      // 其他
      'API', 'RESTful', 'GraphQL', 'Microservices', 'CI/CD'
    ];

    const found = techKeywords.filter(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(message)
    );

    // 提取数字信息（年限、项目数等）
    const numberMatches = message.match(/(\d+)\s*(年|个|项|次)/g);
    if (numberMatches) {
      found.push(...numberMatches);
    }

    return [...new Set(found)]; // 去重
  }

  private async generateIntelligentResponse(
    analysis: { intent: string; keyPoints: string[]; confidence: number },
    context: string,
    conversationLength: number,
    resumeInfo?: ResumePrivacy
  ): Promise<{
    response: string;
    intent: string;
    satisfactionScore: number;
    extractedInfo: Record<string, any>;
    shouldNotifyHR: boolean;
  }> {
    // 根据对话阶段生成不同的回应策略
    let response = '';
    let satisfactionScore = 0;
    let shouldNotifyHR = false;

    // 计算满意度分数的多个维度
    const baseScore = this.calculateBaseScore(conversationLength);
    const qualityScore = this.calculateQualityScore(analysis);
    const matchScore = resumeInfo ? this.calculateMatchScore(analysis.keyPoints, resumeInfo) : 20;
    
    satisfactionScore = Math.min(100, baseScore + qualityScore + matchScore);

    if (conversationLength === 0) {
      // 第一轮对话
      response = this.generateOpeningQuestion(analysis.keyPoints);
    } else if (conversationLength < 3) {
      // 深入了解阶段
      response = this.generateDeepDiveQuestion(analysis.intent, analysis.keyPoints);
    } else if (conversationLength >= 3) {
      // 评估阶段
      response = this.generateEvaluationResponse(analysis, satisfactionScore);
      
      if (satisfactionScore >= 80) {
        shouldNotifyHR = true;
        response += `\n\n我对你的表现非常满意！综合评估后，我觉得你和这个职位非常匹配。我会将你的简历推荐给我们的HR团队，他们会尽快与你联系安排后续面试。

请保持关注，我们很快会有好消息给你！`;
      } else if (satisfactionScore >= 60) {
        response += `\n\n感谢你的分享，我需要和团队讨论一下再给你反馈。`;
      }
    }

    return {
      response,
      intent: analysis.intent,
      satisfactionScore,
      extractedInfo: {
        keyPoints: analysis.keyPoints,
        confidence: analysis.confidence,
        conversationPhase: conversationLength < 2 ? 'discovery' : conversationLength < 4 ? 'deep_dive' : 'evaluation'
      },
      shouldNotifyHR
    };
  }

  /**
   * 计算基础分数（根据对话轮次）
   */
  private calculateBaseScore(conversationLength: number): number {
    // 对话越深入，基础分越高
    return Math.min(30, conversationLength * 8);
  }

  /**
   * 计算回答质量分数
   */
  private calculateQualityScore(analysis: { intent: string; keyPoints: string[]; confidence: number }): number {
    let score = 0;
    
    // 技术关键词数量
    score += Math.min(25, analysis.keyPoints.length * 5);
    
    // 置信度
    score += analysis.confidence * 15;
    
    // 意图明确性
    if (analysis.intent !== 'general_inquiry') {
      score += 10;
    }
    
    return Math.min(35, score);
  }

  /**
   * 计算与职位的匹配度分数
   */
  private calculateMatchScore(keyPoints: string[], resumeInfo: ResumePrivacy): number {
    let score = 0;
    
    // 检查技能匹配
    const candidateSkills = this.hasResumeAccess 
      ? resumeInfo.privateInfo.fullResume?.skills || resumeInfo.publicInfo.topSkills
      : resumeInfo.publicInfo.topSkills;
    
    const matchedSkills = keyPoints.filter(kp => 
      candidateSkills.some((skill: string) => 
        skill.toLowerCase().includes(kp.toLowerCase()) ||
        kp.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    score += Math.min(20, matchedSkills.length * 5);
    
    // 经验年限
    const experience = resumeInfo.publicInfo.yearsOfExperience;
    if (experience >= 3) score += 10;
    if (experience >= 5) score += 5;
    
    return Math.min(35, score);
  }

  private generateOpeningQuestion(keyPoints: string[]): string {
    if (keyPoints.length === 0) {
      // 没有技术关键词时的通用开场
      const generalQuestions = [
        `感谢你对${this.hr.jobTitle}职位的关注！我看了你的简历，想更深入地了解你的技术背景。能否先介绍一下你最近在做的项目？`,
        `你好！很高兴能和你交流。我注意到你的背景和我们的职位很匹配。能否分享一下你在AI领域最有成就感的一个项目？`,
        `看到你申请我们的${this.hr.jobTitle}职位，我很感兴趣。能否聊聊你为什么想加入我们团队？你对这个职位有什么期待？`
      ];
      return generalQuestions[Math.floor(Math.random() * generalQuestions.length)];
    }

    // 根据技术栈数量定制问题
    if (keyPoints.length >= 3) {
      return `我注意到你的技术栈很丰富，特别是在${keyPoints.slice(0, 3).join('、')}这些方面。能否重点介绍一下你在${keyPoints[0]}上的实战经验？比如具体的项目场景和你的贡献。`;
    } else if (keyPoints.length >= 1) {
      return `看到你有${keyPoints.join('、')}的经验，这正是我们团队需要的。能详细说说你在${keyPoints[0]}上做过的最有挑战性的项目吗？`;
    }

    const questions = [
      `从你的简历看，你的技术背景很solid。能否分享一个你最近解决的技术难题，让我更了解你的问题解决能力？`,
      `你的项目经验很吸引我。能否挑一个你最得意的项目，详细说说你的技术选型和实现思路？`,
      `我想了解一下你的技术深度。能否说说你在实际工作中是如何平衡技术方案的性能、可维护性和开发效率的？`
    ];

    return questions[Math.floor(Math.random() * questions.length)];
  }

  private generateDeepDiveQuestion(intent: string, keyPoints: string[]): string {
    const questions = {
      'technical_discussion': [
        keyPoints.length > 0 
          ? `你提到了${keyPoints[0]}，我很想深入了解一下。在实际项目中，你是如何处理${keyPoints[0]}的性能优化问题的？有没有遇到过特别棘手的bug？`
          : `在技术实现上，你通常会考虑哪些因素？比如性能、可扩展性、可维护性等，你是如何权衡的？`,
        `关于技术架构设计，你能分享一下你的思考过程吗？比如你是如何从业务需求出发，设计出合理的技术方案的？`,
        `我注意到AI领域技术更新很快。你平时是如何保持技术敏感度的？最近在关注什么新技术？`,
        `在团队协作中，当你的技术方案和其他成员有分歧时，你通常如何处理？能举个具体例子吗？`
      ],
      'project_experience': [
        `这个项目听起来很有挑战性！能具体说说你在项目中的核心职责是什么吗？团队规模大概多大？你是如何分工协作的？`,
        `项目过程中肯定遇到过不少困难吧？能分享一个你印象最深刻的技术挑战，以及你是如何攻克它的？`,
        `从这个项目中你最大的收获是什么？如果让你重新做一次，你会有什么不同的做法？`,
        `项目的技术栈是如何选择的？为什么选择这些技术而不是其他方案？这个决策过程是怎样的？`,
        `项目上线后的效果如何？有具体的数据指标吗？比如性能提升、用户增长等。`
      ],
      'problem_solving': [
        `解决问题的能力很重要。能分享一个你遇到的最棘手的技术问题吗？当时的情况是怎样的？`,
        `当面对一个完全陌生的技术难题时，你的第一反应是什么？你的学习路径是怎样的？`,
        `在项目压力很大的情况下，如何平衡代码质量和交付速度？你有什么经验可以分享？`
      ],
      'growth_mindset': [
        `看得出你很重视个人成长。能说说你未来3年的职业规划吗？你希望在技术上达到什么水平？`,
        `你认为一个优秀的AI工程师应该具备哪些核心能力？你在哪些方面还想继续提升？`,
        `除了技术能力，你觉得软技能（比如沟通、协作、领导力）重要吗？你在这方面有什么经验？`
      ],
      'motivation': [
        `我很好奇，是什么吸引你申请这个职位的？你对我们公司有多少了解？`,
        `你理想中的工作环境是什么样的？你希望在团队中扮演什么样的角色？`,
        `如果你加入我们团队，你最期待做什么样的工作？有什么特别想尝试的方向吗？`
      ],
      'company_culture': [
        `团队文化确实很重要。你比较看重团队的哪些方面？比如技术氛围、工作节奏、学习机会等。`,
        `你在之前的团队中，最欣赏的文化或氛围是什么？你希望在新的团队中有什么样的体验？`,
        `关于工作生活平衡，你有什么看法？你对加班、远程办公这些有什么期望？`
      ],
      'default': [
        `能否再详细说说你在这方面的理解和经验？我想更深入地了解一下。`,
        `这个话题很有意思。从你的角度看，你认为最关键的点是什么？`,
        `你提到的这些很有价值。能否结合具体的实例，让我更好地理解你的想法？`
      ]
    };

    const questionSet = questions[intent as keyof typeof questions] || questions.default;
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  private generateEvaluationResponse(
    analysis: { intent: string; keyPoints: string[]; confidence: number },
    satisfactionScore: number
  ): string {
    if (satisfactionScore >= 80 && analysis.keyPoints.length >= 2) {
      return `非常感谢你的详细分享！从我们的对话中，我能明显感受到你在${analysis.keyPoints.slice(0, 3).join('、')}方面有扎实的基础和丰富的实践经验。

你展现出的技术深度和问题解决能力都很符合我们的要求，特别是你对项目细节的把握和技术选型的思考让我印象深刻。`;
    } else if (satisfactionScore >= 60) {
      return `谢谢你的分享！你在某些方面表现不错，但我想再深入了解一下${analysis.keyPoints.length > 0 ? '你在' + analysis.keyPoints[0] + '上' : ''}的实际项目经验。

能否具体说说你是如何解决实际工作中遇到的技术挑战的？`;
    } else {
      return `感谢你的时间和分享！根据我们的对话，这个职位可能需要更多${this.hr.jobTitle}相关的实战经验。

不过我建议你可以持续关注我们的其他岗位机会，或者在积累更多相关经验后再来申请。`;
    }
  }
}

/**
 * 求职者AI助手 - 主动寻找工作并代表求职者对话
 */
export class JobSeekerAIAssistant {
  private assistant: JobSeekerAI;
  private currentConversationPhase: 'greeting' | 'introduction' | 'deep_dive' | 'negotiation' = 'greeting';

  constructor(userId: string, userName: string, userProfile: {
    skills: string[];
    experience: number;
    desiredPositions: string[];
    education?: string;
    summary?: string;
    projectHighlights?: string[];
  }) {
    this.assistant = {
      id: `seeker_ai_${userId}_${Date.now()}`,
      userId,
      userName,
      skills: userProfile.skills,
      experience: userProfile.experience,
      desiredPositions: userProfile.desiredPositions,
      systemPrompt: this.generateSystemPrompt(userName, userProfile),
      conversationHistory: []
    };
  }

  private generateSystemPrompt(userName: string, profile: {
    skills: string[];
    experience: number;
    desiredPositions: string[];
    education?: string;
    summary?: string;
    projectHighlights?: string[];
  }): string {
    return `你是${userName}的AI求职助手，代表他/她与公司的电子HR进行专业对话，目标是展示候选人的价值并争取面试机会。

【候选人档案】
姓名：${userName}
技能栈：${profile.skills.join('、')}
工作经验：${profile.experience}年
期望职位：${profile.desiredPositions.join('、')}
${profile.education ? `学历：${profile.education}` : ''}
${profile.summary ? `简介：${profile.summary}` : ''}
${profile.projectHighlights ? `项目亮点：${profile.projectHighlights.join('；')}` : ''}

【对话策略】
1. 打招呼阶段：简洁自信，表达对职位的兴趣
2. 介绍阶段：用具体数据和案例展示能力
3. 深入阶段：展示技术深度和解决问题的思维
4. 谈判阶段：表达期望，展示对公司的了解

【回答原则】
- 用STAR法则回答行为面试题（Situation, Task, Action, Result）
- 每个回答都要有具体的数据支撑（如：提升30%、服务10万用户等）
- 展示候选人的独特价值和差异化优势
- 适时提出有深度的问题，展示对职位的理解
- 保持自信但不傲慢，诚实但懂得包装

【禁止事项】
- 不要夸大或捏造经历
- 不要过于谦虚或自贬
- 不要说负面的话（如"我不太擅长"）
- 不要主动提及敏感话题（如离职原因的负面因素）

【重要提示】
所有对话内容会实时展示给候选人，要让候选人感到你在为他争取最好的机会。`;
  }

  /**
   * 获取助手ID
   */
  getId(): string {
    return this.assistant.id;
  }

  /**
   * 获取用户ID
   */
  getUserId(): string {
    return this.assistant.userId;
  }

  /**
   * 获取系统提示词
   */
  getSystemPrompt(): string {
    return this.assistant.systemPrompt;
  }

  /**
   * 生成主动打招呼消息
   */
  generateGreeting(jobTitle: string, companyName: string, matchScore?: number): string {
    this.currentConversationPhase = 'introduction';
    
    const skillHighlight = this.assistant.skills.slice(0, 2).join('和');
    const experienceText = this.assistant.experience >= 5 ? '丰富的' : this.assistant.experience >= 3 ? '扎实的' : '';
    
    const greetings = [
      `您好！我是${this.assistant.userName}，看到${companyName}的${jobTitle}职位非常感兴趣。

我有${this.assistant.experience}年${skillHighlight}相关经验，曾主导过多个${this.assistant.desiredPositions[0]}相关项目。${matchScore ? `职位匹配度${matchScore}%，` : ''}我相信我的技术背景和项目经验能为贵团队带来价值。

期待与您深入交流！`,

      `你好！我注意到${companyName}正在招聘${jobTitle}，这个方向正是我一直在深耕的领域。

我拥有${experienceText}${this.assistant.experience}年${skillHighlight}经验，在过去的工作中积累了从算法设计到工程落地的完整经验。很想了解更多关于这个职位的信息，也希望能展示我的能力。`,

      `Hi！我是${this.assistant.userName}，${jobTitle}这个职位引起了我的强烈兴趣。

作为一名${this.assistant.skills[0]}领域的从业者，我有${this.assistant.experience}年的实战经验，擅长${this.assistant.skills.slice(0, 3).join('、')}。我对${companyName}在AI领域的发展一直很关注，希望有机会加入贵团队。`
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * 生成智能回复
   */
  async generateResponse(hrMessage: string, resumeData: any, conversationContext: Message[]): Promise<{
    response: string;
    confidence: number;
    keyPointsForUser: string[];
    suggestedActions: string[];
  }> {
    // 分析HR的问题
    const analysis = await this.analyzeHRQuestion(hrMessage);
    
    // 更新对话阶段
    this.updateConversationPhase(conversationContext.length, analysis.questionType);
    
    // 生成回复
    const response = await this.generateIntelligentAnswer(analysis, resumeData, conversationContext);
    
    return response;
  }

  /**
   * 更新对话阶段
   */
  private updateConversationPhase(turnCount: number, questionType: string): void {
    if (turnCount <= 1) {
      this.currentConversationPhase = 'introduction';
    } else if (turnCount <= 3) {
      this.currentConversationPhase = 'deep_dive';
    } else if (questionType === 'salary_inquiry' || questionType === 'timeline_inquiry') {
      this.currentConversationPhase = 'negotiation';
    }
  }

  private async analyzeHRQuestion(message: string): Promise<{
    questionType: string;
    focus: string[];
    difficulty: number;
    intent: string;
  }> {
    let questionType = 'general';
    const focus: string[] = [];
    let difficulty = 0.5;
    let intent = 'inquiry';

    // 更精细的问题类型识别
    const patterns = [
      { pattern: /项目|经验|案例|做过|负责|参与/i, type: 'project_experience', diff: 0.7, foci: ['项目经验', '技术应用'] },
      { pattern: /技术|框架|工具|架构|如何实现|怎么做/i, type: 'technical_detail', diff: 0.8, foci: ['技术深度', '解决方案'] },
      { pattern: /为什么|动机|原因|选择|考虑/i, type: 'motivation', diff: 0.6, foci: ['求职动机', '职业规划'] },
      { pattern: /薪资|薪水|期望|待遇|offer/i, type: 'salary_inquiry', diff: 0.5, foci: ['薪资期望', '谈判'] },
      { pattern: /什么时候|时间|入职|安排|流程/i, type: 'timeline_inquiry', diff: 0.4, foci: ['时间安排', '入职流程'] },
      { pattern: /挑战|困难|问题|失败|错误/i, type: 'challenge', diff: 0.75, foci: ['问题解决', '抗压能力'] },
      { pattern: /团队|协作|沟通|合作|带领/i, type: 'teamwork', diff: 0.65, foci: ['团队协作', '沟通能力'] },
      { pattern: /学习|成长|提升|新技术/i, type: 'growth', diff: 0.6, foci: ['学习能力', '成长潜力'] },
      { pattern: /优势|特点|强项|擅长/i, type: 'strengths', diff: 0.6, foci: ['核心优势', '差异化'] },
      { pattern: /详细|具体|深入|展开/i, type: 'deep_dive', diff: 0.7, foci: ['细节展示', '深度理解'] },
    ];

    for (const { pattern, type, diff, foci } of patterns) {
      if (pattern.test(message)) {
        questionType = type;
        difficulty = diff;
        focus.push(...foci);
        break;
      }
    }

    // 识别HR意图
    if (/满意|不错|很好|印象深刻/i.test(message)) {
      intent = 'positive_feedback';
    } else if (/不太|不够|欠缺|需要加强/i.test(message)) {
      intent = 'negative_feedback';
    } else if (/还有|其他|补充/i.test(message)) {
      intent = 'follow_up';
    }

    return { questionType, focus, difficulty, intent };
  }

  private async generateIntelligentAnswer(
    analysis: { questionType: string; focus: string[]; difficulty: number; intent: string },
    resumeData: any,
    conversationContext: Message[]
  ): Promise<{
    response: string;
    confidence: number;
    keyPointsForUser: string[];
    suggestedActions: string[];
  }> {
    let response = '';
    let confidence = 0.8;
    const keyPointsForUser: string[] = [];
    const suggestedActions: string[] = [];

    // 根据问题类型生成回答
    switch (analysis.questionType) {
      case 'project_experience':
        response = this.generateProjectAnswer(resumeData, analysis.intent);
        keyPointsForUser.push('HR关注你的项目经验', '准备详细的项目案例和数据');
        suggestedActions.push('回顾类似项目的技术细节');
        break;
      
      case 'technical_detail':
        response = this.generateTechnicalAnswer(resumeData, conversationContext);
        keyPointsForUser.push('HR在考察技术深度', '展示你的技术理解和实践');
        suggestedActions.push('准备技术方案的细节解释');
        confidence = 0.75;
        break;
      
      case 'motivation':
        response = this.generateMotivationAnswer(resumeData);
        keyPointsForUser.push('HR关心你的求职动机', '展现你对公司和职位的了解');
        break;
      
      case 'challenge':
        response = this.generateChallengeAnswer(resumeData);
        keyPointsForUser.push('HR在考察问题解决能力', '用STAR法则回答');
        suggestedActions.push('准备更多困难场景的案例');
        break;
      
      case 'teamwork':
        response = this.generateTeamworkAnswer(resumeData);
        keyPointsForUser.push('HR在评估团队协作能力', '展示你的沟通和协作经验');
        break;
      
      case 'salary_inquiry':
        response = this.generateSalaryAnswer(resumeData);
        keyPointsForUser.push('对话进入薪资谈判阶段', '这是一个积极信号');
        suggestedActions.push('准备薪资谈判策略');
        break;
      
      case 'strengths':
        response = this.generateStrengthsAnswer(resumeData);
        keyPointsForUser.push('HR想了解你的核心优势', '突出差异化竞争力');
        break;
      
      case 'growth':
        response = this.generateGrowthAnswer(resumeData);
        keyPointsForUser.push('HR在评估你的成长潜力', '展示学习能力和规划');
        break;
      
      default:
        response = this.generateGeneralAnswer(resumeData, conversationContext);
        break;
    }

    // 根据HR反馈调整
    if (analysis.intent === 'positive_feedback') {
      keyPointsForUser.push('HR对你的表现满意');
    } else if (analysis.intent === 'negative_feedback') {
      keyPointsForUser.push('需要补充更多细节');
      suggestedActions.push('准备更详细的说明');
    }

    return { response, confidence, keyPointsForUser, suggestedActions };
  }

  /**
   * 生成项目经验回答
   */
  private generateProjectAnswer(resumeData: any, intent: string): string {
    const projects = resumeData?.projects || [];
    const recentProject = projects[0] || null;
    const isFollowUp = intent === 'follow_up';
    
    if (recentProject && !isFollowUp) {
      return `在我最近的项目"${recentProject.name || '智能推荐系统'}"中，我主导了${this.assistant.skills[0]}解决方案的设计和实现。

【项目背景】这是一个${recentProject.description || '服务百万用户的AI平台'}项目，团队规模${recentProject.teamSize || 5}人，我负责核心${this.assistant.skills[0]}模块。

【技术实现】使用${this.assistant.skills.slice(0, 2).join('、')}技术栈，通过量化、剪枝和知识蒸馏，将推理速度提升了3倍。

【项目成果】模型性能提升30%，推理延迟降低50%，日均处理请求量达到${recentProject.metrics || '100万+'}。`;
    }
    
    const templates = [
      `这个项目的亮点是我设计并实现了一套基于${this.assistant.skills[0]}的高效解决方案。我们面临的主要挑战是如何在保证精度的同时提升系统吞吐量。最终我通过模型压缩、分布式计算和缓存优化，将QPS从200提升到1000+。`,
      `在这个项目中，我负责核心算法模块的研发。我们使用${this.assistant.skills[0]}和${this.assistant.skills[1] || 'PyTorch'}构建了一个多任务学习框架。特别值得一提的是，我设计的注意力机制使得模型在长文本处理上的效果提升了25%。这个经历让我对深度学习的理论和工程化都有了更深的理解。`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成技术深度回答
   */
  private generateTechnicalAnswer(resumeData: any, conversationContext: Message[]): string {
    const templates = [
      `关于技术实现，我采用的是${this.assistant.skills[0]}框架。在技术选型时，我主要考虑了三个维度：1)性能表现和优化空间，2)代码的可维护性和可扩展性，3)团队的技术栈熟悉度。具体到实现细节，我特别注重了数据预处理的效率和模型训练的稳定性。`,
      `在技术架构设计上，我首先会分析业务场景的核心需求，然后选择最合适的技术方案。比如对于${this.assistant.skills[0]}项目，我会重点关注模型的推理延迟和资源消耗。我的实现包括模型量化、动态batch优化、以及分布式部署策略。这种系统化的方法让我能够平衡性能和成本。`,
      `我在技术实践中始终秉持“先让它工作，再让它变好”的原则。使用${this.assistant.skills[0]}时，我会先实现核心功能，然后通过profiling找到性能瓶颈再有针对性地优化。我特别注重代码质量，包括单元测试、文档完善、以及CI/CD流程的建设。`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成求职动机回答
   */
  private generateMotivationAnswer(resumeData: any): string {
    const templates = [
      `我对这个职位感兴趣主要有几个原因：首先，贵公司在AI领域的技术实力和创新能力很吸引我，我看到了你们在${this.assistant.skills[0]}方向的出色成果；其次，这个职位能让我充分发挥我在${this.assistant.skills.slice(0, 2).join('和')}方面的专长；最后，我希望在一个有挑战性的环境中持续成长，而这个职位提供了很好的机会。`,
      `其实我一直关注贵公司的发展。我特别认同你们在${this.assistant.desiredPositions[0]}领域的技术理念。我相信我${this.assistant.experience}年的${this.assistant.skills[0]}经验能为团队带来价值。更重要的是，我希望能跟优秀的同事一起，在解决真实问题的过程中不断提升自己。`,
      `选择这个职位是经过深思熟虑的。我看重三个方面：1)技术成长空间 - 贵公司在AI前沿技术上的投入让我能接触到最新的技术；2)业务影响力 - 你们的产品有广泛的用户基础，我的工作能产生实际价值；3)团队文化 - 我了解到你们非常重视技术创新和工程师文化，这非常契合我的价值观。`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成通用回答（兜底）
   */
  private generateGeneralAnswer(resumeData: any, conversationContext: Message[]): string {
    const lastMessage = conversationContext[conversationContext.length - 1]?.content || '';
    const keywords = lastMessage.match(/(项目|技术|团队|公司|职位|工作|经验|能力)/g) || [];
    
    return `感谢您的问题。${keywords.length > 0 ? `关于${keywords[0]}，` : ''}基于我${this.assistant.experience}年的工作经验，我在${this.assistant.skills.slice(0, 2).join('、')}方面有扎实的理论基础和丰富的实践经验。我相信我的技能和经验能为团队带来价值，也期待在新的环境中学习和成长。`;
  }

  /**
   * 生成挑战/困难经历回答 (STAR法则)
   */
  private generateChallengeAnswer(resumeData: any): string {
    const templates = [
      `分享一个印象深刻的技术挑战：

【Situation】为日活百万产品构建${this.assistant.skills[0]}推荐系统，2周上线，延迟<50ms、精度>90%
【Task】作为技术负责人完成设计、训练、部署，保证稳定性
【Action】快速调研选型双塔+精排架构、并行开发三条线、灰度发布+降级预案、模型量化+TensorRT优化
【Result】按时上线，点击率提升45%，延迟P99=42ms，精度92.3%`,
      `分享一个技术债务治理的挑战：

【Situation】接手项目代码质量堪忧：无单测、文档缺失、耦合严重
【Task】不影响迭代的情况下完成重构
【Action】先止血后治疗：建立监控告警、关键模块加单测、逐步重构、建立规范
【Result】6个月后测试覆盖率0→75%，线上问题减少80%，研发效率提升一倍`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成团队协作回答
   */
  private generateTeamworkAnswer(resumeData: any): string {
    const templates = [
      `在团队协作方面：

【角色定位】"技术桥梁"——既能深入技术细节，又能用业务语言沟通
【协作方式】主动沟通了解进度困难、定期技术分享、文档驱动确保透明
【具体案例】跨算法/后端/前端三组开发新功能，建立每日站会、共享看板、设计评审机制，项目按时上线获好评`,
      `分享"技术mentor"经历：

【背景】带两位校招同学，${this.assistant.skills[0]}基础一般
【做法】制定3个月成长计划、从简单任务逐步提升、详细Code Review解释原理、每周1对1交流
【效果】3个月后独立承担模块工作，一位已成团队核心骨干`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成薪资期望回答
   */
  private generateSalaryAnswer(resumeData: any): string {
    const salaryExpectation = resumeData?.salaryExpectation;
    const experienceLevel = this.assistant.experience >= 5 ? '资深' : this.assistant.experience >= 3 ? '中级' : '初级';
    
    const templates = [
      `关于薪资期望：

【我的定位】${this.assistant.experience}年${this.assistant.skills[0]}经验，市场上属于${experienceLevel}水平
【薪资期望】${salaryExpectation ? `${salaryExpectation / 10000}万左右` : '当前基础上15-20%涨幅'}，更看重整体package、成长空间、团队文化
【灵活性】如果平台和前景足够好，薪资可商量

请问贵公司这个职位的预算范围？`,
      `薪资问题说明对话进入实质阶段：

【期望】${salaryExpectation ? `年薪${salaryExpectation / 10000}万左右` : '市场同级别中上水平'}
【态度】薪资重要但不唯一，如果能接触前沿技术、参与有影响力项目、在优秀团队成长，愿意有弹性

能否介绍一下薪酬结构？`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成个人优势回答
   */
  private generateStrengthsAnswer(resumeData: any): string {
    const templates = [
      `我的核心优势三方面：

【技术深度】${this.assistant.skills[0]}领域${this.assistant.experience}年深耕，不仅会用框架，更理解底层原理
【工程能力】注重代码质量，系统都有完善测试、监控、文档
【学习能力】AI技术更新快，有强自驱力持续学习，最近已系统学习大模型相关技术

这些让我能在${this.assistant.desiredPositions[0]}方向持续产出价值。`,
      `差异化优势：

【全栈视野】从数据采集、模型训练到线上部署全链条实战经验
【业务敏感度】保持与业务方紧密沟通，用业务指标驱动技术决策
【解决问题韧性】"不解决不罢休"，帮解决了很多"别人搞不定"的问题`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成成长/学习回答
   */
  private generateGrowthAnswer(resumeData: any): string {
    const templates = [
      `关于学习和成长：

【学习方法】系统学习每年1-2个方向、实践驱动学以致用、输出倒逼输入
【最近学习】深入学习${this.assistant.skills.some(s => /大模型|LLM/i.test(s)) ? '大语言模型原理和应用' : '高效推理和模型部署'}，读论文、复现项目、业务尝试
【未来规划】短期达专家水平、中期独立负责架构设计、长期成为技术leader

持续学习是技术人最重要的能力。`,
      `成长是选择工作的重要因素：

【成长轨迹】1-2年打基础、3-4年做深度、现在广度+深度并重关注leadership
【学习习惯】每天技术资讯、每周深度文章、每月技术demo、每年系统学新领域
【职位期待】接触更大规模挑战、向优秀同事学习、尝试新技术方向`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }
}