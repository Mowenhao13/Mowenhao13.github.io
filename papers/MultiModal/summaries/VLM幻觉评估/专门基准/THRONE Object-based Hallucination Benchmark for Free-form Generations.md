---
layout: page
---


## 基本信息

- **标题**: THRONE: An Object-based Hallucination Benchmark for the Free-form Generations of Large Vision-Language Models
- **作者**: Prannay Kaul, Zhizhong Li, Hao Yang, Yonatan Dukler, Ashwin Swaminathan, C. J. Taylor, Stefano Soatto (University of Oxford, AWS AI Labs)
- **年份**: 2024
- **arXiv ID**: 2405.05256
- **论文类型**: 评估方法 - 自由生成

## 核心贡献

THRONE（Text-from-image Hallucination Recognition with Object-probes for open-eNded Evaluation）提出了一种专门评估LVLM在**自由形式（free-form）开放描述**中物体幻觉的基准方法。论文关键创新是将幻觉分为两类：

1. **Type I hallucinations**: 在开放性问题（如"Describe this image in detail."）中产生的幻觉，回答空间无限
2. **Type II hallucinations**: 在特定概念事实问题（如"Is there a traffic light?"）中产生的幻觉，回答空间受限

核心发现：Type I 和 Type II 幻觉之间存在反相关关系——在一类上的改善并不导致另一类的改善。THRONE专门针对Type I幻觉。

## 方法

### 评估框架

THRONE利用外部语言模型（LM）对LVLM的自由生成响应进行抽象式问答（AQA），判断每个物体类别是否在响应中被暗示存在于图像中。

对于标注数据集中的每张图像 $I$ 和类别集合 $C$，LVLM被要求生成描述。然后外部LM对每个类别进行AQA，得到预测标签矩阵：

$$
\mathbf{\hat{Y}} \in \{0,1\}^{|\mathcal{I}|\times |\mathcal{C}|}
$$

其中0/1表示LM对LVLM响应中物体存在性的否定/肯定判断。同时利用真实标注构建标签矩阵：

$$
\mathbf{Y} \in \{0,1\}^{|\mathcal{I}|\times |\mathcal{C}|}
$$

### 评估指标

基于两个矩阵计算四个指标：总体精度（P_ALL）、总体召回（R_ALL）、类别级精度（P_CLS）、类别级召回（R_CLS）。使用F-beta分数综合评估：

$$
F^\beta = (1 + \beta^2)\cdot \frac{P\cdot R}{(\beta^2 \cdot P) + R}
$$

选择 $\beta = 0.5$，即精度权重为召回的两倍，以重点衡量幻觉（false positive）。

### LM集成投票机制

为增强鲁棒性，集成N个LM和M个问题格式，产生NM个答案。使用一致投票机制（k=NM）：

$$
\hat{Y}_{i,j} = \begin{cases} 0, & \sum_{k=1}^{NM} \bar{Y}_{i,j,k} \leq (NM - k) \\ 1, & \sum_{k=1}^{NM} \bar{Y}_{i,j,k} \geq k \\ -1, & \text{otherwise} \end{cases}
$$

### 改进基线：对象枚举数据增强

在LLaVA视觉指令微调数据中，在生成详细描述前先执行对象枚举任务：
```
Instruction: <image> Give a list of objects and locations in the image.
Response: {class_name_1} [{location_1}/absent]
...
```

负样本采样偏向于训练数据中频繁共现的类别对，利用共现矩阵。

## 数据集/模型/实验方法

- **数据集**: COCO 2017验证集（5000张图像，80个类别）、Objects365
- **评估的LVLMs**（11个，均约7B参数）: Adapter-v2, InstructBLIP, Otter-Image, MiniGPT4, MiniGPT-v2, mPLUG-Owl, LRV-Instruction-v2, LLaVA-v1.3, LLaVA-v1.5, LLaVA-Mistral
- **外部LM**: FLAN-T5系列（Base 250M, Large 780M, XL 3B）
- **POPE-C**: 提出POPE-Complete版本，使用全部COCO类别和图像进行Type II评估，揭示POPE严重低估Type II幻觉
- **人类评估**: 验证THRONE的判断错误率（4.3%）远低于CHAIR（8.8%），false discovery rate降低超过50%

## 连接上下文

THRONE解决了CHAIR无法处理现代LVLM长文本、抽象概念的问题，并与POPE形成互补——前者测Type I，后者测Type II。THRONE与POPE的Spearman秩相关系数仅0.2，证明两类幻觉是正交的。该工作揭示了LVLM在自由描述中的幻觉程度远比此前基于限定问题格式的基准更为严重，且最先进的模型仍有约20%的类级精度损失。

## 相关论文

### 评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md) - Type I/II区分的源头
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - Type II（互补）
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md)
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md)
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md)
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md) - NegP数据
- 多对象探测：[ROPE Multi-Object Hallucination in Vision-Language Models](ROPE Multi-Object Hallucination in Vision-Language Models.md) - 视觉提示
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
