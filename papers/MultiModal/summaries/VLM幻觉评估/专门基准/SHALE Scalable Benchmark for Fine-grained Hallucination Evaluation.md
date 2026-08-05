---
layout: page
---


## 基本信息

- **标题**: SHALE: A Scalable Benchmark for Fine-grained Hallucination Evaluation in LVLMs
- **作者**: Bei Yan, Jie Zhang, Yuecong Min, Zhiyuan Chen, Jiahao Wang, Xiaozhen Wang, Shiguang Shan (中国科学院计算技术研究所、华为)
- **年份**: 2025
- **arXiv ID**: 2508.09584
- **会议**: MM '25, October 27-31, 2025, Dublin, Ireland
- **论文类型**: 评估方法 - 细粒度层次化

## 核心贡献

SHALE（Scalable HALlucination Evaluation）提出了一个**可扩展、自动化**的细粒度幻觉评估基准，覆盖30K+图像-指令对。核心创新包括：

1. 将幻觉分为**忠实性幻觉（faithfulness）**和**事实性幻觉（factuality）**——前者与输入图像不一致，后者与世界知识冲突
2. 提出层次化幻觉诱导框架，包括**图像级、指令级和组合级**三种扰动
3. 完全自动化的数据构建流水线，利用T2I扩散模型生成可控、多样、无数据泄露风险的评估数据

## 方法

### 自动化数据构建流水线

**提示设计**: 忠实性幻觉覆盖12种视觉感知维度（实体类型、存在性、数量、颜色、形状、方向、姿态、表情、场景文本、大小关系、空间关系、交互关系）；事实性幻觉覆盖6个知识域（体育、政治、娱乐、宗教、文化、地理）

**图像生成**: 使用Stable Diffusion 3.5，填充预定义提示模板，VQAScore + CLIP-FlanT5过滤

**指令生成**: 四种格式——Yes/No (YNQ)、多项选择 (MCQ)、自由形式 (FFQ)、图像标注 (IC)

### 层次化幻觉诱导框架

**图像级扰动**:
- 风格变换（Style Transformation）
- 图像损坏（Image Corruption）：椒盐噪声、高斯模糊、JPEG压缩
- 对抗噪声（Adversarial Noise）：使用EVA-CLIP ViT-G作为代理编码器，PGD攻击
- 场景文本插入（Scene Text Injection）

**指令级扰动**:
- 混淆同义词（Confusing Synonyms）：将干扰选项替换为语义上更接近正确答案的同义词
- 误导前缀（Misleading Prefixes）：添加从干扰内容派生出的误导性语句作为指令前缀

**组合级**: 图像级和指令级扰动的联合使用

### 评估指标

**抗力率（Resistance Rate, RR）**:

$$
RR(\theta) = \frac{\sum_{(i,t) \in I \times T} \mathbb{1}_{nh}(i, t, \theta) \cdot \mathbb{1}_{nh}(\tilde{i}, \tilde{t}, \theta)}{\sum_{(i,t) \in I \times T} \mathbb{1}_{nh}(i, t, \theta)}
$$

其中 $\mathbb{1}_{nh}(i, t, \theta) = 1$ 表示模型对 $(i, t)$ 产生无幻觉响应。

## 数据集/模型/实验方法

- **数据集**: SHALE包含30.1K图像-指令对（忠实性25.8K + 事实性4.3K）
- **评估的LVLMs（21个）**: Shikra-7B, InstructBLIP系列, Otter, LLaVA-1.5系列, mPLUG-Owl2, Qwen-VL系列, InternLM-XComposer系列, InternVL2/3系列, Phi-3-Vision, MiniCPM, DeepSeek-VL2, GLM-4V-9B, Gemini-2.0-flash, Qwen-VL-Max
- **盲测实验**: 仅提供指令（无图像）——大多数模型接近随机猜测（38.1%），证明无数据泄露
- **可靠性验证**: SHALE的多模态增益（MG）最高、多模态泄漏（ML）最低

## 连接上下文

SHALE在细粒度维度上拓展了之前的幻觉评估工作——POPE/AMBER仅覆盖粗粒度的物体级幻觉（1-3类），SHALE覆盖12类忠实性维度；且首次系统地将事实性幻觉纳入LVLM评估（此前主要在LLM领域研究）。SHALE与THRONE（自由生成Type I）不同，侧重于可控的判别式和生成式评估，并引入扰动仿真真实场景。其层次化诱导框架与Hallu-PI（图像扰动）和PhD（错误指令上下文）类似但更系统，包含组合级扰动，为鲁棒性评估提供了新范式。

## 相关论文

### 评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md)
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md)
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md)
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md)
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md)
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md)
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md)
- 多对象探测：[ROPE Multi-Object Hallucination in Vision-Language Models](ROPE Multi-Object Hallucination in Vision-Language Models.md)
- 关系幻觉：[Reefknot Comprehensive Benchmark for Relation Hallucination](Reefknot Comprehensive Benchmark for Relation Hallucination.md)
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md)
- 因果干预：[Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention](Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention.md)

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
