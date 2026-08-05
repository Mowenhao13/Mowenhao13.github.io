---
layout: page
---


## 基本信息

- **标题**: Multi-Object Hallucination in Vision-Language Models
- **作者**: Xuweiyi Chen, Ziqiao Ma, Xuejun Zhang, Sihan Xu, Shengyi Qian, Jianing Yang, David F. Fouhey, Joyce Chai (University of Michigan, University of Virginia, New York University)
- **年份**: 2024
- **arXiv ID**: 2407.06192
- **论文类型**: 评估方法 - 多对象探测

## 核心贡献

ROPE（Recognition-based Object Probing Evaluation）系统性地研究**多对象幻觉**——当LVLM被要求同时关注多个物体时，模型如何产生幻觉。核心发现：

1. LVLM在同时处理多个物体时比处理单个物体产生更多幻觉
2. 测试对象类别分布影响幻觉行为——模型可能利用捷径和虚假相关性
3. 幻觉行为受数据特有因素、显著性和频率、模型内在行为影响

关键创新：利用**视觉提示（visual prompts）**（即标记的边界框）唯一地指向物体，避免文本描述中的指代歧义，并在同一图像内变化对象类别分布（同质/异质）。

## 方法

### 任务设置

每个ROPE样本由四元组构成 $\{I, L, \langle p_1, \cdots, p_n \rangle, \langle o_1, \cdots, o_n \rangle\}$：
- $I$: 包含至少n个物体的图像
- $L$: 指定识别任务的自然语言指令（含N个候选类别 $c_1, \cdots, c_N$）
- $p_1, \cdots, p_n$: n个视觉提示，每个查询一个物体
- $o_1, \cdots, o_n$: n个物体类别作为答案

本文设置 $N=50$，$n=5$。

### 查询类型

根据对象类别分布，ROPE分为4个子集：
- **Homogeneous**: 5个测试对象均属同一类别（如AAAAA）
- **Heterogeneous**: 5个测试对象均属不同类别（如ABCDE）
- **Adversarial**: 前4个同类别，最后一个为不同类别（如AAAAB）
- **In-the-Wild**: 随机选择和排序

### 指令设置

设计了三种多对象查询类型：
- **Default**: 单轮提示中同时查询5个对象
- **Student-Forcing**: 强制模型只解码对象token，分离指令跟随错误
- **Teacher-Forcing**: 用真实标签替换已生成的对象token，消除累积误差

以及单对象查询（Single-Object）：一次只查询一个物体，重复5次。

### 幻觉分析因素

论文从多维度分析幻觉行为：

**数据特有因素**:
- 输入顺序（Input Order）
- 查询同质性（Query Homogeneity）
- 对象token位置（Object Token Position）
- 对象同质性（Object Homogeneity）
- 对象中心性（Object Centrality）

**显著性和频率**:
- 对象显著性（Object Salience）: 对象像素占比
- 语义显著性（Semantic Salience）: 同类所有实例像素占比
- 训练显著性（Training Salience）: MSCOCO中类别频率的对数

**模型行为**:
- 对象token熵（Object Token Entropy）:
  $$H(s) = -\sum_i s_i \log(s_i)$$
  其中 $s$ 为生成词第一个token的softmax logits
- 视觉模态贡献（Visual Modality Contribution, VMC）:
  $$\text{VMC} = \frac{\sum_{i \in V} \alpha_{ij}}{\sum_{i \in V} \alpha_{ij} + \sum_{k \in T} \alpha_{kj}}$$
  其中 $\alpha_{ij}$ 是视觉token $i$ 在head $j$ 上的注意力权重

## 数据集/模型/实验方法

- **数据集**: MSCOCO Panoptic、ADE20K，分为Seen和Unseen子集
- **评估的LVLMs**: LLaVA-7B/13B/34B, Yi-VL-6B/34B, QwenVL-Base/Chat, CogVLM-Base/Chat/Grounding, GLaMM, GroundHOG, IDEFICS, MiniCPM-V, GPT-4V, GPT-4O
- **实验设置**: 分别测评Default、Student-Forcing、Teacher-Forcing和Single-Object四种条件下的准确率
- **对抗性实验**: 通过AAAAB序列（4个A类+1个B类）揭示模型利用文本捷径——当最后一个是B类时准确率骤降至接近0%

## 连接上下文

ROPE超越POPE（仅单对象Yes/No）和CHAIR（短描述文本匹配），引入视觉提示和类别分布控制来揭示多对象幻觉的复杂性。论文发现Teacher-Forcing在Homogeneous条件下异常高准确率（>90%）主要是文本捷径的假象（adversarial split揭示真相）。机械接地型LVLMs在单对象中表现好但在多对象中仍有差距，说明多对象指令数据的重要性。该工作与THRONE形成互补——THRONE关注自由形式描述中的物体存在性，而ROPE关注多对象同时识别时的交互效应。

## 相关论文

### 评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md)
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - 单对象Yes/No
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md)
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md)
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md)
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md) - Type I（互补）
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md) - NegP数据
- 关系幻觉：[Reefknot Comprehensive Benchmark for Relation Hallucination](Reefknot Comprehensive Benchmark for Relation Hallucination.md)
- 细粒度评估：[SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation](SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation.md)
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md)
- 因果干预：[Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention](Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention.md)

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
