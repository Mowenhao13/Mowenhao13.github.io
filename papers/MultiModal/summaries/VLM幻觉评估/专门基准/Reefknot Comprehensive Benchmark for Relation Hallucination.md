---
layout: page
---


## 基本信息

- **标题**: Reefknot: A Comprehensive Benchmark for Relation Hallucination Evaluation, Analysis and Mitigation in Multimodal Large Language Models
- **作者**: Kening Zheng, Junkai Chen, Yibo Yan, Xin Zou, Xuming Hu (香港科技大学（广州）)
- **年份**: 2024
- **arXiv ID**: 2408.09429
- **论文类型**: 评估方法 - 关系幻觉

## 核心贡献

Reefknot是首个专门针对**关系幻觉**（relation hallucination）的综合基准，涵盖超过20,000个样本。关系幻觉相比物体级和属性级幻觉更复杂，涉及至少两个对象同时出现在图像中。论文将关系幻觉分为两类：

1. **感知关系（Perceptive）**: 涉及位置介词的具体关系，如"on"、"behind"、"in"
2. **认知关系（Cognitive）**: 涉及动作短语的抽象关系，如"eating"、"watching"、"blowing"

核心发现：关系幻觉比物体幻觉更严重（见图2对比POPE和Reefknot），且感知关系幻觉发生率比认知关系高约10%。

## 方法

### 数据构建流程

四个阶段：
1. **三元组识别、过滤与提取**: 从Visual Genome场景图数据集中提取 $\langle subject, relation, object \rangle$ 语义三元组
2. **关系分类**: 利用ChatGPT将关系分为感知和认知两类
3. **问题构建**: 构建三种任务的问题集
4. **多轮人工验证**: 每轮至少三轮由四位领域专家审核

### 评估任务

三种评估任务：
- **Yes/No (Y/N)**: 对抗性方式引入负样本
- **多项选择 (MCQ)**: 一个正确答案+三个随机选项
- **视觉问答 (VQA)**: 开放域生成任务

### 评估指标

综合评分 $R_{score}$:

$$
R_{score} = \text{Avg}\left[\sum_{i=1}^3 (1 - \text{Halr}_i)\right]
$$

其中 $\text{Halr}_i$ 为各任务的幻觉率。

## 缓解方法：Detect-then-Calibrate

基于观察：当关系幻觉发生时，模型响应概率显著下降（接近50%，正常情况下近90%）。

**检测**: 利用熵值 $E(X)$ 检测幻觉：

$$
E(X) = -\sum_{i=1}^n p(x_i) \log p(x_i)
$$

设定熵阈值 $\gamma$，若 $E(X) > \gamma$ 则判定为幻觉。

**校准**: 利用中间层的隐藏状态校准最终输出：

$$
r = \begin{cases}
\arg\max \log \frac{(1+\alpha) \cdot \text{softmax}(\phi(h_n))}{\alpha \cdot \text{softmax}(\phi(h_{n-\lambda}))}, & \text{if } E_t > \gamma \\
\arg\max \text{softmax}(\phi(h_n)), & \text{otherwise}
\end{cases}
$$

其中 $\lambda$ 是中间层超参数。

## 数据集/模型/实验方法

- **数据集**: 基于Visual Genome的11,084张图像，21,880个问题（感知13,260 + 认知8,600）
- **评估的MLLMs**: Phi-3, Yi-VL, LLaVA-7B/13B, MiniGPT4-v2, MiniCPM, Qwen-VL, Deepseek-VL, GLM4V, CogVLM, GPT-4o
- **缓解方法对比**: 与VCD、DoLa、OPERA等训练自由方法比较
- **结果**: 在三个关系幻觉数据集上平均降低9.75%的幻觉率

## 连接上下文

Reefknot填补了关系幻觉评估的空白——此前POPE、AMBER等主要关注物体级幻觉，而R-Bench和MMRel虽有关系评估但缺乏VQA生成任务和缓解方法。Reefknot利用场景图三元组的天然真值避免了后处理偏差，与THRONE（自由生成物体幻觉）和ROPE（多对象探测）形成互补，从关系层面推进了对MLLM幻觉的全面理解。检测-校准方法与DoLa（对比层解码）思想类似但仅在检测到高熵时才激活。

## 相关论文

### 评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md)
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md)
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md) - 关系维度
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md)
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md)
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md)
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md)
- 多对象探测：[ROPE Multi-Object Hallucination in Vision-Language Models](ROPE Multi-Object Hallucination in Vision-Language Models.md)
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
