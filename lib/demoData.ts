/**
 * 演示数据 - 用于测试双向AI智能体系统
 */

import { ResumePrivacy } from './aiAgents';

// 导出详细简历数据（用于PDF展示页面）
export { zhangsanResume, getFullResumeByUserId, type FullResumeData } from './resumeData/zhangsan';

/**
 * 演示用的求职者简历数据
 */
// 当前登录用户（默认张三）
export const currentUserId = 'user_zhangsan';

/**
 * 简历数据格式说明：
 * - publicInfo: 公开展示的基础信息（简单展示用）
 * - privateInfo: 授权后可见的详细信息
 * - 完整PDF简历: 访问 /resume/zhangsan 页面查看
 */
export const demoResumes: ResumePrivacy[] = [
  // 张三 - 5年计算机视觉专家（默认登录用户）
  // 基础信息用于快速展示，详细PDF简历见 /resume/zhangsan
  {
    userId: 'user_zhangsan',
    publicInfo: {
      name: '张三',
      currentTitle: '资深计算机视觉算法工程师',
      yearsOfExperience: 5,
      topSkills: ['YOLO', '目标检测', 'TensorRT', '3D视觉', 'SLAM'],
      education: '硕士',
      location: '深圳'
    },
    privateInfo: {
      fullResume: {
        name: '张三',
        phone: '135****6666',
        email: 'zhangsan_cv@example.com',
        education: [
          { degree: '硕士', school: '华中科技大学', major: '模式识别与智能系统', graduationYear: 2019 },
          { degree: '学士', school: '武汉大学', major: '电子信息工程', graduationYear: 2017 }
        ],
        workExperience: [
          {
            company: '深圳市大疆创新科技有限公司',
            position: '资深计算机视觉算法工程师',
            duration: '2022.03 - 至今',
            responsibilities: ['主导无人机视觉感知系统', '跟踪成功率78%→94%', '推理速度提升3倍']
          },
          {
            company: '北京商汤科技开发有限公司',
            position: '计算机视觉算法工程师',
            duration: '2019.07 - 2022.02',
            responsibilities: ['智慧城市视频分析平台', '单GPU支持200路视频', '服务10+城市']
          }
        ],
        skills: [
          'YOLOv8', 'Faster R-CNN', 'Mask R-CNN', 'DeepSORT', 'ByteTrack',
          'TensorRT', 'CUDA', 'ONNX', 'ORB-SLAM', 'VINS',
          'OpenCV', 'PyTorch', 'C++', 'ROS',
          '目标检测', '目标跟踪', '3D视觉', 'SLAM'
        ]
      },
      detailedProjects: [
        {
          name: '无人机智能跟踪系统',
          description: '高速运动场景下的鲁棒目标跟踪',
          techStack: ['YOLOv8', 'DeepSORT', 'TensorRT', 'CUDA'],
          achievements: ['mAP 94.5%', '60fps实时', '3款产品部署', '2项专利'],
          role: '技术负责人',
          teamSize: 4
        },
        {
          name: '双目立体视觉测距系统',
          description: '高精度深度感知，支持复杂光照环境',
          techStack: ['RAFT-Stereo', 'OpenCV', 'CUDA', 'C++'],
          achievements: ['误差<1%', '30fps', '3项专利'],
          role: '核心开发者',
          teamSize: 3
        },
        {
          name: '智慧城市行人分析平台',
          description: '千路视频实时分析系统',
          techStack: ['YOLOv5', 'FairMOT', 'ReID', 'TensorRT'],
          achievements: ['准确率99.2%', '1000路并发', '服务10+城市'],
          role: '算法负责人',
          teamSize: 6
        },
        {
          name: '工业缺陷检测系统',
          description: 'PCB板微米级缺陷自动检测',
          techStack: ['Mask R-CNN', 'AutoEncoder', 'PyTorch'],
          achievements: ['检出率99.8%', '效率提升10倍', '3家工厂部署'],
          role: '项目负责人',
          teamSize: 3
        },
        {
          name: '视觉SLAM定位建图系统',
          description: '室内厘米级定位和实时建图',
          techStack: ['ORB-SLAM3', 'VINS', 'ROS', 'C++'],
          achievements: ['精度<2cm', '30fps实时', '2款AGV应用'],
          role: '核心开发者',
          teamSize: 4
        }
      ],
      contactInfo: {
        phone: '13512346666',
        email: 'zhangsan_cv@example.com',
        wechat: 'zhangsan_cv'
      },
      salaryExpectation: 55000,
      // 详细PDF简历页面链接
      fullResumeUrl: '/resume/zhangsan'
    },
    accessGranted: []
  },
  {
    userId: 'user_demo_001',
    publicInfo: {
      name: '张伟',
      currentTitle: 'NLP算法工程师',
      yearsOfExperience: 4,
      topSkills: ['Python', 'PyTorch', 'Transformer'],
      education: '硕士',
      location: '北京'
    },
    privateInfo: {
      fullResume: {
        name: '张伟',
        phone: '138****8888',
        email: 'zhangwei@example.com',
        education: [
          {
            degree: '硕士',
            school: '清华大学',
            major: '计算机科学与技术',
            graduationYear: 2020
          },
          {
            degree: '学士',
            school: '浙江大学',
            major: '软件工程',
            graduationYear: 2018
          }
        ],
        workExperience: [
          {
            company: '字节跳动',
            position: 'NLP算法工程师',
            duration: '2020.07 - 至今',
            responsibilities: [
              '负责推荐系统中的文本理解模块，使用BERT和GPT模型优化内容理解效果',
              '设计并实现了多任务学习框架，将模型训练效率提升40%',
              '主导了大规模语料预训练项目，训练了10B参数的预训练模型'
            ]
          }
        ],
        skills: ['Python', 'PyTorch', 'Transformer', 'BERT', 'GPT', 'Distributed Training', 'Docker', 'Kubernetes']
      },
      detailedProjects: [
        {
          name: '智能推荐内容理解系统',
          description: '基于大模型的内容理解和推荐系统',
          techStack: ['PyTorch', 'BERT', 'Transformer', 'Redis', 'Kafka'],
          achievements: [
            '将内容理解准确率从78%提升到92%',
            '推理延迟从200ms降低到50ms',
            '支持日均10亿次推理请求'
          ],
          role: '核心算法工程师',
          teamSize: 8
        },
        {
          name: '多语言预训练模型',
          description: '支持中英文等多语言的大规模预训练模型',
          techStack: ['PyTorch', 'DeepSpeed', 'Megatron-LM', 'SLURM'],
          achievements: [
            '训练了10B参数的多语言模型',
            '在多个NLP任务上达到SOTA水平',
            '模型已在公司多个业务线部署使用'
          ],
          role: '项目负责人',
          teamSize: 5
        }
      ],
      contactInfo: {
        phone: '13812345678',
        email: 'zhangwei@example.com',
        wechat: 'zhangwei_ai'
      },
      salaryExpectation: 60000 // 月薪期望（元）
    },
    accessGranted: [] // 已授权查看的职位ID
  },
  {
    userId: 'user_demo_002',
    publicInfo: {
      name: '李娜',
      currentTitle: '计算机视觉工程师',
      yearsOfExperience: 3,
      topSkills: ['Python', 'TensorFlow', 'YOLO'],
      education: '硕士',
      location: '上海'
    },
    privateInfo: {
      fullResume: {
        name: '李娜',
        phone: '139****9999',
        email: 'lina@example.com',
        education: [
          {
            degree: '硕士',
            school: '上海交通大学',
            major: '人工智能',
            graduationYear: 2021
          }
        ],
        workExperience: [
          {
            company: '商汤科技',
            position: '计算机视觉算法工程师',
            duration: '2021.07 - 至今',
            responsibilities: [
              '负责目标检测和图像分割算法研发',
              '优化模型性能，在保持精度的前提下将推理速度提升3倍',
              '参与自动驾驶感知系统的开发'
            ]
          }
        ],
        skills: ['Python', 'TensorFlow', 'PyTorch', 'YOLO', 'Mask R-CNN', 'SegFormer', 'CUDA', 'TensorRT']
      },
      detailedProjects: [
        {
          name: '自动驾驶多目标检测系统',
          description: '实时多目标检测和跟踪系统',
          techStack: ['YOLOv8', 'DeepSORT', 'TensorRT', 'CUDA'],
          achievements: [
            '检测精度达到mAP 95%',
            '实现30fps实时检测',
            '在复杂场景下的鲁棒性大幅提升'
          ],
          role: '算法负责人',
          teamSize: 6
        }
      ],
      contactInfo: {
        phone: '13987654321',
        email: 'lina@example.com',
        wechat: 'lina_cv'
      },
      salaryExpectation: 50000
    },
    accessGranted: []
  },
  {
    userId: 'user_demo_003',
    publicInfo: {
      name: '王强',
      currentTitle: '大模型工程师',
      yearsOfExperience: 5,
      topSkills: ['Python', 'PyTorch', 'LLaMA'],
      education: '博士',
      location: '深圳'
    },
    privateInfo: {
      fullResume: {
        name: '王强',
        phone: '138****7777',
        email: 'wangqiang@example.com',
        education: [
          {
            degree: '博士',
            school: '中国科学院',
            major: '人工智能',
            graduationYear: 2019
          }
        ],
        workExperience: [
          {
            company: '腾讯AI Lab',
            position: '大模型研究员',
            duration: '2019.09 - 至今',
            responsibilities: [
              '主导大语言模型预训练和微调工作',
              '研究RLHF、LoRA等高效训练方法',
              '发表多篇顶会论文（NeurIPS, ICML, ACL）'
            ]
          }
        ],
        skills: ['Python', 'PyTorch', 'LLaMA', 'GPT', 'RLHF', 'LoRA', 'DeepSpeed', 'Megatron-LM', 'Distributed Training']
      },
      detailedProjects: [
        {
          name: '千亿参数大语言模型',
          description: '自研千亿参数中文大语言模型',
          techStack: ['PyTorch', 'DeepSpeed', 'Megatron-LM', 'FlashAttention'],
          achievements: [
            '训练了100B参数的中文大模型',
            '在C-Eval等中文评测榜单上取得优异成绩',
            '已应用于公司多个产品线'
          ],
          role: '技术负责人',
          teamSize: 15
        }
      ],
      contactInfo: {
        phone: '13811112222',
        email: 'wangqiang@example.com',
        wechat: 'wangqiang_llm'
      },
      salaryExpectation: 80000
    },
    accessGranted: []
  }
];

/**
 * 演示用的用户Profile
 */
export const demoUserProfiles = [
  // 张三 - 当前登录用户（5年计算机视觉专家）
  {
    userId: 'user_zhangsan',
    userName: '张三',
    skills: [
      'YOLOv8', 'Faster R-CNN', 'Mask R-CNN', '目标检测', '目标跟踪',
      'DeepSORT', 'ByteTrack', 'FairMOT', 'ReID',
      'TensorRT', 'CUDA', 'ONNX', '模型量化', '边缘部署',
      '双目视觉', '深度估计', 'SLAM', 'ORB-SLAM', 'VINS',
      'OpenCV', 'PCL', 'PyTorch', 'C++', 'ROS'
    ],
    experience: 5,
    desiredPositions: [
      '视觉算法工程师',
      '计算机视觉技术专家',
      '3D视觉算法工程师',
      '自动驾驶感知算法工程师'
    ],
    education: '硕士',
    currentCompany: '深圳市大疆创新科技有限公司',
    location: '深圳'
  },
  {
    userId: 'user_demo_001',
    userName: '张伟',
    skills: ['Python', 'PyTorch', 'Transformer', 'BERT', 'NLP'],
    experience: 4,
    desiredPositions: ['NLP算法工程师', '大模型工程师', 'AI研究员'],
    education: '硕士',
    currentCompany: '字节跳动',
    location: '北京'
  },
  {
    userId: 'user_demo_002',
    userName: '李娜',
    skills: ['Python', 'TensorFlow', 'YOLO', 'CV', '目标检测'],
    experience: 3,
    desiredPositions: ['计算机视觉工程师', '自动驾驶算法工程师', '图像算法工程师'],
    education: '硕士',
    currentCompany: '商汤科技',
    location: '上海'
  },
  {
    userId: 'user_demo_003',
    userName: '王强',
    skills: ['Python', 'PyTorch', 'LLaMA', 'GPT', 'RLHF'],
    experience: 5,
    desiredPositions: ['大模型工程师', 'AI研究员', 'LLM工程师'],
    education: '博士',
    currentCompany: '腾讯AI Lab',
    location: '深圳'
  }
];

/**
 * 根据用户ID获取简历数据
 */
export function getResumeByUserId(userId: string): ResumePrivacy | null {
  return demoResumes.find(resume => resume.userId === userId) || null;
}

/**
 * 根据用户ID获取用户Profile
 */
export function getUserProfileById(userId: string) {
  return demoUserProfiles.find(profile => profile.userId === userId) || null;
}

/**
 * 获取默认演示用户（张三 - 5年计算机视觉专家）
 */
export function getDefaultDemoUser() {
  return {
    userId: 'user_zhangsan',
    profile: demoUserProfiles[0], // 张三的profile
    resume: demoResumes[0] // 张三的简历
  };
}
