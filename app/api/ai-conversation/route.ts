import { NextRequest } from 'next/server';
import { ElectronicHRAgent, JobSeekerAIAssistant } from '@/lib/aiAgents';
import { createLLMClient } from '@/lib/alicloudLLM';

// 存储活跃的对话（实际应用中应该用数据库）
const activeConversations = new Map();
const electronicHRAgents = new Map();
const jobSeekerAssistants = new Map();

// 创建 LLM 客户端实例
const llmClient = createLLMClient('qwen-turbo');
const useLLM = llmClient && llmClient.isConfigured(); // 检查是否配置了API密钥

if (useLLM) {
  console.log('✅ 阿里云大模型已启用，AI对话将更加智能！');
} else {
  console.log('⚠️ 未配置API密钥，使用模拟对话模式');
}

/**
 * 初始化电子HR与求职者AI的对话
 */
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'initiate_greeting':
        return handleInitiateGreeting(data);
      
      case 'hr_response':
        return handleHRResponse(data);
      
      case 'seeker_response':
        return handleSeekerResponse(data);
      
      case 'get_conversation':
        return handleGetConversation(data);
      
      case 'auto_search_jobs':
        return handleAutoSearchJobs(data);
      
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI对话错误:', error);
    return Response.json({ error: 'AI对话处理失败' }, { status: 500 });
  }
}

/**
 * 求职者AI主动打招呼
 */
async function handleInitiateGreeting(data: {
  userId: string;
  userName: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  userProfile: any;
  resumePrivacy: any;
}) {
  // 创建或获取求职者AI助手
  const assistantId = `seeker_${data.userId}`;
  let assistant = jobSeekerAssistants.get(assistantId);
  
  if (!assistant) {
    assistant = new JobSeekerAIAssistant(
      data.userId,
      data.userName,
      data.userProfile
    );
    jobSeekerAssistants.set(assistantId, assistant);
  }

  // 创建或获取电子HR
  const hrId = `hr_${data.jobId}`;
  let hr = electronicHRAgents.get(hrId);
  
  if (!hr) {
    hr = new ElectronicHRAgent(
      data.jobId,
      data.companyName,
      data.jobTitle,
      'professional'
    );
    electronicHRAgents.set(hrId, hr);
  }

  // 生成打招呼消息
  const greetingMessage = assistant.generateGreeting(data.jobTitle, data.companyName);
  
  // 授权电子HR查看简历
  const hrAccess = hr.grantResumeAccess(data.resumePrivacy);

  // 创建对话
  const conversationId = `conv_${data.userId}_${data.jobId}_${Date.now()}`;
  const conversation = {
    id: conversationId,
    jobSeekerId: data.userId,
    jobId: data.jobId,
    electronicHRId: hrId,
    aiAssistantId: assistantId,
    messages: [
      {
        id: `msg_${Date.now()}_1`,
        role: 'jobseeker_ai',
        content: greetingMessage,
        timestamp: new Date(),
        metadata: { isGreeting: true }
      },
      {
        id: `msg_${Date.now()}_2`,
        role: 'electronic_hr',
        content: hrAccess.message,
        timestamp: new Date(),
        metadata: { hasResumeAccess: true }
      }
    ],
    status: 'initiated',
    satisfactionScores: {
      hrScore: 20,
      seekerScore: 20
    },
    keyPoints: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  activeConversations.set(conversationId, conversation);

  return Response.json({
    success: true,
    conversationId,
    conversation,
    message: '对话已启动，AI助手代表你开始与电子HR交流'
  });
}

/**
 * 电子HR生成回复
 */
async function handleHRResponse(data: {
  conversationId: string;
  resumePrivacy: any;
}) {
  const conversation = activeConversations.get(data.conversationId);
  if (!conversation) {
    return Response.json({ error: '对话不存在' }, { status: 404 });
  }

  const hr = electronicHRAgents.get(conversation.electronicHRId);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  let response;
  
  // 如果配置了API密钥，使用真实的大模型
  if (useLLM && llmClient) {
    try {
      console.log('🤖 使用阿里云大模型生成HR回复...');
      
      // 构建对话历史
      const conversationHistory = conversation.messages.map((msg: any) => ({
        role: msg.role === 'electronic_hr' ? 'assistant' : 'user',
        content: msg.content
      }));

      // 调用大模型生成回复
      const llmResponse = await llmClient.generateHRResponse(
        hr.getSystemPrompt(),
        conversationHistory,
        lastMessage.content,
        data.resumePrivacy
      );

      response = {
        response: llmResponse.response,
        intent: llmResponse.intent,
        satisfactionScore: Math.min(100, (conversation.messages.length + 1) * 15),
        extractedInfo: {},
        shouldNotifyHR: conversation.messages.length >= 4
      };

      console.log('✅ 大模型回复生成成功');
    } catch (error) {
      console.error('❌ 大模型调用失败，使用模拟回复:', error);
      // 如果大模型调用失败，降级为模拟模式
      response = await hr.generateResponse(
        lastMessage.content,
        data.resumePrivacy,
        conversation.messages
      );
    }
  } else {
    // 没有API密钥，使用模拟回复
    response = await hr.generateResponse(
      lastMessage.content,
      data.resumePrivacy,
      conversation.messages
    );
  }

  // 添加HR的回复到对话
  const hrMessage = {
    id: `msg_${Date.now()}`,
    role: 'electronic_hr',
    content: response.response,
    timestamp: new Date(),
    metadata: {
      intent: response.intent,
      confidence: response.satisfactionScore / 100,
      extractedInfo: response.extractedInfo,
      usedLLM: useLLM // 标记是否使用了大模型
    }
  };

  conversation.messages.push(hrMessage);
  conversation.satisfactionScores.hrScore = response.satisfactionScore;
  conversation.updatedAt = new Date();

  // 如果HR满意度达到阈值，通知真人HR
  if (response.shouldNotifyHR) {
    conversation.status = 'hr_notified';
    
    // 这里会触发通知真人HR的逻辑
    await notifyRealHR(conversation);
  } else {
    conversation.status = 'ongoing';
  }

  activeConversations.set(data.conversationId, conversation);

  return Response.json({
    success: true,
    message: hrMessage,
    conversation,
    hrSatisfied: response.shouldNotifyHR,
    satisfactionScore: response.satisfactionScore,
    usedLLM: useLLM // 返回是否使用了真实大模型
  });
}

/**
 * 求职者AI生成回复
 */
async function handleSeekerResponse(data: {
  conversationId: string;
  resumeData: any;
}) {
  const conversation = activeConversations.get(data.conversationId);
  if (!conversation) {
    return Response.json({ error: '对话不存在' }, { status: 404 });
  }

  const assistant = jobSeekerAssistants.get(conversation.aiAssistantId);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  // 求职者AI生成智能回复
  const response = await assistant.generateResponse(
    lastMessage.content,
    data.resumeData,
    conversation.messages
  );

  // 添加求职者AI的回复到对话
  const seekerMessage = {
    id: `msg_${Date.now()}`,
    role: 'jobseeker_ai',
    content: response.response,
    timestamp: new Date(),
    metadata: {
      confidence: response.confidence,
      keyPointsForUser: response.keyPointsForUser
    }
  };

  conversation.messages.push(seekerMessage);
  conversation.keyPoints.push(...response.keyPointsForUser);
  conversation.updatedAt = new Date();

  activeConversations.set(data.conversationId, conversation);

  return Response.json({
    success: true,
    message: seekerMessage,
    conversation,
    keyPointsForUser: response.keyPointsForUser,
    userNotification: response.keyPointsForUser.length > 0 ? 
      `⚠️ 请注意：${response.keyPointsForUser.join('；')}` : null
  });
}

/**
 * 获取对话记录
 */
async function handleGetConversation(data: { conversationId: string }) {
  const conversation = activeConversations.get(data.conversationId);
  
  if (!conversation) {
    return Response.json({ error: '对话不存在' }, { status: 404 });
  }

  return Response.json({
    success: true,
    conversation
  });
}

/**
 * 自动搜索匹配职位并发起对话
 */
async function handleAutoSearchJobs(data: {
  userId: string;
  userName: string;
  userProfile: any;
  resumePrivacy: any;
  jobs: any[];
}) {
  const assistant = new JobSeekerAIAssistant(
    data.userId,
    data.userName,
    data.userProfile
  );

  // 智能匹配职位
  const matchedJobs = data.jobs
    .map(job => {
      // 计算匹配度
      const skillMatch = job.tags.filter((tag: string) => 
        data.userProfile.skills.some((skill: string) => 
          tag.toLowerCase().includes(skill.toLowerCase())
        )
      ).length;
      
      const matchScore = (skillMatch / job.tags.length) * 100;
      
      return { job, matchScore };
    })
    .filter(item => item.matchScore >= 60) // 只选择匹配度>=60%的职位
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5); // 最多发起5个对话

  // 为每个匹配的职位发起对话
  const conversations = [];
  
  for (const { job, matchScore } of matchedJobs) {
    const result = await handleInitiateGreeting({
      userId: data.userId,
      userName: data.userName,
      jobId: job.id.toString(),
      jobTitle: job.title,
      companyName: job.company,
      userProfile: data.userProfile,
      resumePrivacy: data.resumePrivacy
    });

    const resultData = await result.json();
    
    if (resultData.success) {
      conversations.push({
        ...resultData.conversation,
        matchScore
      });
    }
  }

  return Response.json({
    success: true,
    message: `AI助手已为你发起 ${conversations.length} 个职位的对话`,
    conversations,
    totalMatched: matchedJobs.length
  });
}

/**
 * 通知真人HR
 */
async function notifyRealHR(conversation: any) {
  // 实际应用中会发送邮件、站内信等通知
  console.log(`
    🔔 通知真人HR
    职位ID: ${conversation.jobId}
    候选人: ${conversation.jobSeekerId}
    匹配度: ${conversation.satisfactionScores.hrScore}分
    对话记录: ${conversation.messages.length}条消息
    关键点: ${conversation.keyPoints.join(', ')}
  `);
  
  // 这里可以调用邮件服务、消息队列等
  // await sendEmail(...)
  // await sendInAppNotification(...)
  
  return {
    success: true,
    message: '已通知真人HR'
  };
}