/**
 * 张三完整简历数据
 * 5年计算机视觉专家
 * 用于生成PDF简历和详细展示
 */

export interface FullResumeData {
  basicInfo: {
    name: string;
    targetPosition: string;
    phone: string;
    email: string;
    location: string;
  };
  coreAdvantages: Array<{
    title: string;
    description: string;
  }>;
  education: {
    degree: string;
    school: string;
    major: string;
    duration: string;
    undergraduate?: {
      degree: string;
      school: string;
      major: string;
      duration: string;
    };
  };
  coreSkills: {
    visionCore: {
      title: string;
      skills: Array<{
        category: string;
        items: string;
      }>;
    };
    supplementary: {
      title: string;
      skills: Array<{
        category: string;
        items: string;
      }>;
    };
  };
  workExperience: Array<{
    duration: string;
    company: string;
    department: string;
    position: string;
    responsibilities: string[];
  }>;
  keyProjects: Array<{
    name: string;
    duration: string;
    background: string;
    role: string;
    coreWork: string[];
    results: string[];
    techStack: string[];
  }>;
  summary: string;
}

/**
 * 张三的完整简历数据
 */
export const zhangsanResume: FullResumeData = {
  // 基本信息
  basicInfo: {
    name: '张三',
    targetPosition: '视觉算法工程师 / 计算机视觉技术专家 / AI视觉应用负责人',
    phone: '135-1234-6666',
    email: 'zhangsan_cv@example.com',
    location: '深圳'
  },

  // 核心优势
  coreAdvantages: [
    {
      title: '视觉技术深耕五载，多行业落地经验',
      description: '专注计算机视觉领域5年+，主导制造、安防、无人机、智慧城市等多行业8个视觉项目从0到1落地，精通目标检测、图像预处理、多目标跟踪、3D视觉等核心技术，兼具算法研发深度与场景化落地能力，攻克复杂环境下视觉识别难题。'
    },
    {
      title: '算法与工程双驱，性能极致优化',
      description: '深耕YOLO系列、Faster R-CNN、Mask R-CNN等主流视觉模型，擅长针对反光、高温、遮挡、低光照、高速运动等复杂场景优化算法，结合TensorRT量化加速、CUDA并行优化、边缘计算部署等工程化技术，实现识别准确率与处理效率双重突破。'
    },
    {
      title: '3D视觉与多模态融合，技术栈全面',
      description: '以2D视觉技术为核心，拓展双目立体视觉、SLAM定位建图、NeRF三维重建等3D视觉能力，具备多传感器融合（视觉+IMU+激光雷达）经验，可构建完整的视觉感知系统解决方案。'
    },
    {
      title: '工程落地能力强，全链路交付',
      description: '具备从需求分析、算法设计、模型训练、工程优化到硬件部署的全链路能力，熟悉海康威视/大华工业相机选型、GPU服务器/边缘设备部署方案，已交付多个千万级视觉项目。'
    }
  ],

  // 教育背景
  education: {
    degree: '硕士',
    school: '华中科技大学',
    major: '模式识别与智能系统',
    duration: '2017-2019',
    undergraduate: {
      degree: '学士',
      school: '武汉大学',
      major: '电子信息工程',
      duration: '2013-2017'
    }
  },

  // 核心技能
  coreSkills: {
    visionCore: {
      title: '视觉核心技术',
      skills: [
        {
          category: '模型算法',
          items: '精通YOLOv3/v5/v8/v11、Faster R-CNN、Mask R-CNN等目标检测模型，掌握U-Net/DeepLab语义分割、DeepSORT/ByteTrack多目标跟踪、HRNet姿态估计技术'
        },
        {
          category: '图像处理',
          items: '熟练运用高斯滤波、卡尔曼滤波、CLAHE对比度增强、反光抑制、去雾增强等预处理技术，解决高温、高噪、遮挡、低光照、运动模糊等复杂环境下图像质量问题'
        },
        {
          category: '3D视觉',
          items: '具备双目立体匹配（RAFT-Stereo、PSMNet）、单目深度估计、视觉SLAM（ORB-SLAM、VINS）、NeRF三维重建能力，擅长多传感器融合（视觉+IMU+LiDAR）'
        },
        {
          category: '工程落地',
          items: '熟悉海康威视、大华等工业相机选型与触发同步方案，掌握GPU加速、TensorRT/ONNX量化、边缘计算/NPU部署，支持60fps高帧率实时处理'
        }
      ]
    },
    supplementary: {
      title: '补充技能',
      skills: [
        {
          category: '深度学习框架',
          items: '精通Python及PyTorch、TensorFlow深度学习框架，熟悉模型训练调优、分布式训练、混合精度训练'
        },
        {
          category: '开发工具',
          items: '熟练使用OpenCV、PCL点云库、ROS机器人操作系统，掌握C++/CUDA高性能开发'
        },
        {
          category: '大模型融合',
          items: '了解多模态大模型（CLIP、BLIP）在视觉任务中的应用，具备视觉+语言跨模态理解能力'
        }
      ]
    }
  },

  // 工作经历
  workExperience: [
    {
      duration: '2022.03 - 至今',
      company: '深圳市大疆创新科技有限公司',
      department: '感知算法部',
      position: '资深计算机视觉算法工程师',
      responsibilities: [
        '主导无人机视觉感知系统核心算法研发，负责目标检测、多目标跟踪、视觉避障等模块，支撑消费级和行业级无人机产品线',
        '攻克高速运动场景下的目标跟踪难题，设计自适应特征融合策略，将跟踪成功率从78%提升至94%',
        '优化视觉算法在嵌入式平台的部署，通过TensorRT量化和算子融合，推理速度提升3倍，功耗降低40%'
      ]
    },
    {
      duration: '2019.07 - 2022.02',
      company: '北京商汤科技开发有限公司',
      department: '智慧城市事业群',
      position: '计算机视觉算法工程师',
      responsibilities: [
        '负责智慧城市视频分析平台核心算法研发，包括行人检测、车辆识别、人脸属性分析等模块',
        '主导千路视频实时分析系统架构设计，通过模型轻量化和流水线优化，单GPU支持200路视频并发处理',
        '参与多个政府智慧城市项目交付，累计服务10+城市，处理视频数据100PB+'
      ]
    }
  ],

  // 重点项目经验
  keyProjects: [
    {
      name: '无人机智能跟踪系统',
      duration: '2023.01 - 2023.12',
      background: '解决消费级无人机在复杂场景下目标跟踪丢失、跟踪不稳定的问题，需实现高速运动、遮挡、光照变化等场景下的鲁棒跟踪',
      role: '技术负责人、核心算法开发',
      coreWork: [
        '设计改进的YOLOv8检测网络，引入CBAM注意力模块和BiFPN特征融合，小目标检测mAP提升8%',
        '开发自适应多目标跟踪算法，融合外观特征和运动预测，支持同时稳定跟踪50+目标',
        '实现基于TensorRT的端到端部署，在Jetson Orin平台达到60fps实时处理',
        '构建2万张标注数据集，涵盖运动模糊、遮挡、尺度变化等困难样本'
      ],
      results: [
        '检测精度mAP达到94.5%，跟踪成功率94%，ID切换率降低70%',
        '系统已部署到3款商业无人机产品，服务百万级用户',
        '获得2项发明专利授权'
      ],
      techStack: ['YOLOv8', 'CBAM', 'BiFPN', 'DeepSORT', 'ByteTrack', 'TensorRT', 'CUDA', 'ROS']
    },
    {
      name: '双目立体视觉测距系统',
      duration: '2022.06 - 2023.06',
      background: '为无人机避障系统提供高精度深度感知能力，需在户外强光、弱光、无纹理等复杂环境下实现亚厘米级测距精度',
      role: '核心开发者',
      coreWork: [
        '基于RAFT-Stereo框架优化立体匹配网络，针对无纹理区域引入边缘引导损失函数',
        '设计多尺度特征融合策略，提升远距离（>10m）场景的深度估计精度',
        '实现CUDA加速的视差计算和点云生成，单帧处理时间<30ms',
        '开发自适应曝光控制算法，解决逆光和低光照场景的图像质量问题'
      ],
      results: [
        '10米范围内深度估计误差<1%，30米范围内误差<3%',
        '支持0.1lux低光照到100klux强光环境',
        '获得2项发明专利授权，1项实用新型专利'
      ],
      techStack: ['RAFT-Stereo', 'PSMNet', 'OpenCV', 'PCL', 'CUDA', 'C++']
    },
    {
      name: '智慧城市行人分析平台',
      duration: '2020.03 - 2021.12',
      background: '为智慧城市提供大规模视频分析能力，需支持千路视频实时处理，实现行人检测、跟踪、属性识别、轨迹分析等功能',
      role: '算法负责人',
      coreWork: [
        '设计轻量化行人检测网络，基于YOLOv5进行通道剪枝和知识蒸馏，模型体积减小60%',
        '开发高性能ReID特征提取模块，支持跨摄像头行人重识别',
        '构建FairMOT多目标跟踪系统，实现检测和ReID特征的联合学习',
        '设计分布式视频处理架构，通过Kafka消息队列和GPU集群实现弹性扩展'
      ],
      results: [
        '行人检测准确率99.2%，ReID Top-1准确率95%',
        '单GPU支持200路视频实时分析，集群支持1000+路并发',
        '日处理视频数据量10TB+，累计服务10+城市项目'
      ],
      techStack: ['YOLOv5', 'FairMOT', 'ReID', 'TensorRT', 'Kafka', 'Redis']
    },
    {
      name: '工业产线视觉缺陷检测系统',
      duration: '2021.06 - 2022.02',
      background: '解决PCB板生产线人工质检效率低、漏检率高的问题，需实现微米级缺陷的自动检测和分类',
      role: '项目负责人',
      coreWork: [
        '搭建高精度视觉采集系统，选用500万像素工业相机配合远心镜头，实现10μm分辨率成像',
        '开发改进的Mask R-CNN缺陷检测网络，引入FPN多尺度特征融合，提升小缺陷检出率',
        '设计异常检测辅助模块，基于自编码器检测训练集未覆盖的新型缺陷',
        '实现缺陷分类和定位可视化，支持12种缺陷类型的自动分类'
      ],
      results: [
        '缺陷检出率99.8%，误检率<0.5%，漏检率<0.1%',
        '单板检测时间<200ms，效率较人工提升10倍',
        '已在3家电子厂部署使用，累计检测PCB板500万+片'
      ],
      techStack: ['Mask R-CNN', 'FPN', 'AutoEncoder', 'OpenCV', 'PyTorch', 'C++']
    },
    {
      name: '视觉SLAM定位建图系统',
      duration: '2022.08 - 2023.03',
      background: '为室内机器人和AGV提供高精度定位能力，需在GPS失效的室内环境实现厘米级定位和实时建图',
      role: '核心开发者',
      coreWork: [
        '基于ORB-SLAM3框架进行二次开发，优化特征提取和匹配策略',
        '融合IMU数据实现视觉惯性里程计，提升快速运动场景的鲁棒性',
        '开发回环检测和全局优化模块，消除累积漂移误差',
        '实现稠密点云建图和网格重建，支持导航避障'
      ],
      results: [
        '定位精度<2cm（室内100m²范围），建图精度<1%',
        '支持30fps实时定位，CPU占用<30%',
        '已应用于2款AGV产品'
      ],
      techStack: ['ORB-SLAM3', 'VINS-Mono', 'g2o', 'OpenCV', 'ROS', 'C++']
    }
  ],

  // 工作总结
  summary: '五年深耕计算机视觉技术领域，主导8个跨行业视觉项目从0到1落地，覆盖无人机感知、智慧城市、工业质检、机器人定位等多元场景。以目标检测、多目标跟踪、3D视觉为核心技术栈，构建了"算法研发-工程优化-场景落地"的全链路能力。所有项目均实现识别准确率、处理效率等核心指标显著提升，创造了实际商业价值。具备视觉系统架构设计和团队协作经验，可快速适配各类视觉相关岗位，通过技术创新推动业务智能化升级。'
};

/**
 * 获取用户简历数据
 */
export function getFullResumeByUserId(userId: string): FullResumeData | null {
  if (userId === 'user_zhangsan') {
    return zhangsanResume;
  }
  return null;
}
