---
layout: page
---


## 基本信息

- **论文标题**: HallusionBench: You See What You Think? Or You Think What You See? — An Image-Context Reasoning Benchmark Challenging for GPT-4V(ision), LLaVA-1.5, and Other Multi-modality Models
- **作者**: Fuxiao Liu, Tianrui Guan, Zongxia Li, Lichang Chen, Yaser Yacoob, Dinesh Manocha, Tianyi Zhou
- **机构**: University of Maryland, College Park
- **年份**: 2023
- **arXiv ID**: 2310.14566
- **论文类型**: 评估方法 - 控制组诊断

## 核心贡献

本文提出了**HallusionBench**，这是首个专门区分和诊断VLM中**语言幻觉（Language Hallucination）**和**视觉错觉（Visual Illusion）**两类错误的基准测试。Benchmark名称"Hallusion"由"Hallucination"（幻觉）和"Illusion"（错觉）组合而成。

### 核心框架

HallusionBench将视觉问答分为两大类：

1. **视觉依赖型（Visual Dependent）**：没有图像输入就无法确定答案的问题（如"右边的橙色圆与左边的橙色圆大小相同吗？"）。
   - 控制组设计：对原图和经过小幅度编辑的图提出相同问题。

2. **视觉补充型（Visual Supplement）**：即使没有图像也可凭常识回答的问题（如"德州和新墨西哥州哪个大？"）。
   - 控制组设计：**有/无图像**两种条件下提问相同问题，图像内容可能与常识矛盾。

### 两种失败类型

1. **语言幻觉（Language Hallucination）**：模型过度依赖先验知识（参数记忆）而忽略视觉上下文，即使图像已被修改。
2. **视觉错觉（Visual Illusion）**：模型的视觉模块对图像内容的错误感知或误解，导致LLM基于错误视觉信息做出自信的错误回答。

## 方法

HallusionBench包含约200个VQA对，约半数由人类专家手工构建。图像类型包括：

- **未经修改的图像**：视觉错觉图、幻觉图等
- **经手工编辑或构建的图像**：数字修改、遮挡、翻转等
- 图表（Chart）、地图（Map）、海报、视频帧序列等

主题覆盖：数学、计数、文化、卡通、体育、地理等。

### 控制组实验设计

- **Visual Dependent控制组**：对原图和经过小幅编辑的图（Hard Negative Examples）提出相同问题，仅修改少量内容但改变答案含义。
- **Visual Supplement控制组**：在有/无图像的条件下提出相同问题，图像作为补充信息（可能与常识矛盾）。

## 数据集/模型/实验方法

- **评估模型**: GPT-4V(ision), LLaVA-1.5
- **测试场景**: 光学错觉（大小错觉、长度错觉、颜色错觉）、几何/数学、OCR字符识别、人物/品牌识别、视频帧序列时序推理、图表阅读、地图理解等
- **人工编辑操作**: 图像翻转、序列反转、遮挡、字符编辑、目标编辑、颜色编辑

## 关键发现

1. **GPT-4V严重依赖先验知识**：即使在图像被编辑（答案应改变）的情况下，GPT-4V仍依据参数记忆回答，在超过90%的分析案例中给出错误答案。
2. **LLaVA-1.5知识和视觉能力均有限**：在视觉感知和常识知识上均不及GPT-4V，有时存在基础常识错误。
3. **时序推理能力缺失**：GPT-4V无法区分正向和反向的图像序列（如"消失"vs"出现"、"停车"vs"离开"），且会给出完全相反的时序描述。
4. **简单图像编辑即可欺骗SOTA模型**：图像翻转、字符编辑、目标编辑等简单操作即可误导GPT-4V和LLaVA-1.5。
5. **图表推理能力有限**：给定图表后，GPT-4V和LLaVA-1.5仍偏向依赖语言先验而非图表中的实际数据。

## 连接上下文

HallusionBench开创性地将VLM幻觉研究从**单一的目标幻觉**扩展到**语言幻觉与视觉错觉的区分**。这一"控制组诊断"范式（通过有/无图像或原图/编辑图的对比来定位错误来源）为后续工作提供了方法论参考。HallusionBench揭示了GPT-4V等当时最强模型在处理需要严格依赖视觉上下文的任务时的根本局限，强调了**参数记忆与视觉推理之间的权衡**问题。该基准的局限在于规模较小（约200个问题），且部分案例高度依赖于特定文化/领域知识（如中国文学、品牌Logo等）。

## 相关论文

### 目标幻觉评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md) - 首个系统性幻觉评估
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - Yes/No问答评估
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md) - 无需LLM
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md) - GPT-4裁判
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md) - 细粒度验证

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
