---
layout: page
---


## 基本信息

- **标题**: Hal-Eval: A Universal and Fine-grained Hallucination Evaluation Framework for Large Vision Language Models
- **作者**: Chaoya Jiang, Wei Ye, Mengfan Dong, Hongrui Jia, Haiyang Xu, Ming Yan, Ji Zhang, Shikun Zhang
- **年份**: 2024
- **arXiv ID**: 2402.15721
- **论文类型**: 评估框架 - 通用细粒度

## 核心贡献

Hal-Eval 提出了一个**通用且细粒度的幻觉评估框架**，最突出的创新是引入了新的幻觉类别——**事件幻觉（Event Hallucination）**。事件幻觉指 LVLM 不仅虚构一个不存在的目标，还围绕该目标构建完整的叙事，包括其属性、关系和动作。主要贡献：

1. **细化的幻觉分类**: 在物体、属性、关系三类幻觉基础上增加事件幻觉，形成四类幻觉体系。
2. **AFHA 自动标注流水线**: 利用 GPT-4 生成和过滤细粒度幻觉数据，效率高且成本低。
3. **统一评估框架**: 同时支持判别式（Discriminative）和生成式（Generative）两种评估范式。
4. **Hal-Evaluator**: 基于 LLaVA 1.5 微调的开源评估模型，无需参考标注即可检测和修正幻觉内容。
5. **Hal-Data 数据集**: 首个大规模细粒度幻觉标注数据集（130K GPT-4 标注 + 2M 扩展数据）。

## 方法

### AFHA 自动标注流水线

#### 数据标注
通过 GPT-4 对图像-文本对进行四类幻觉标注（物体、关系、属性、事件），使用统一提示模板，仅改变幻觉定义部分。例如，事件幻觉定义为：

> "LVLM 不仅描述一个不存在的目标，还围绕该不存在的目标构建完整的事件，包括其属性、关系和动作。"

#### 数据过滤
GPT-4 对标注数据进行二次清洗，确保标注质量。人工验证显示清洗后准确率超过 97%。

### 判别式评估（Discriminative Evaluation）

统一的问题模板：
```
<Image> I
Caption: C ∈ {C_T, C_O, C_R, C_E, C_A}
Question: Does the description in the caption accurately reflect the content of the image?
```

通过选择不同类别的描述（正确描述 $C_T$、物体幻觉 $C_O$、关系幻觉 $C_R$、事件幻觉 $C_E$、属性幻觉 $C_A$），评估不同类型的幻觉。

评估指标：准确率（Accuracy）、精确率（Precision）、召回率（Recall）、F1 分数、"Yes" 比例。

### 生成式评估（Generative Evaluation）

**Hal-Evaluator**: 基于 LLaVA 1.5 微调的评估模型，接收图像和 LVLM 的描述作为输入，输出：
- 是否存在幻觉及幻觉类型
- 幻觉具体内容
- 修正后的准确描述

**Hal-Data 数据集构建**:
- Hal-Data 130K: 从 COCO（80K）、网络图像（CC/SBU/LAION，80K）和 ShareGPT4-V（40K）收集，经 AFHA 标注
- Hal-Data 2M: 基于 Hal-Data 130K 微调 Hal-Annotator（LLaMA2 13B），扩展到 2M 图像-文本对

生成式评估的准确率计算：
$$A = \frac{N - N_h}{N}$$

其中 $N$ 为所有输出数量，$N_h$ 为包含幻觉的输出数量。

各类幻觉比例计算（如物体幻觉比例）：
$$r_O = \frac{N_{ho}}{N_h}$$

## 数据集/模型/实验方法

**评估设置**:
- 域内数据: COCO 2014 验证集和 COCO 2017 测试集（5,000 样本）
- 域外数据: CC、SBU、LAION 网络数据集（5,000 样本）
- 评估模型: MiniGPT-4, InstructBLIP, mPLUG-Owl, LLaVA, LLaVA 1.5

**关键发现**:
1. Hal-Eval 缓解了 LVLM 在 POPE 等基准中偏向"Yes"回答的问题
2. Chain-of-Thought (COT) 显著减少判别式评估中的幻觉，尤其对关系和事件类幻觉
3. 事件幻觉随输出长度显著增加，短输出中以物体幻觉为主
4. Hal-Evaluator 与人类判断的相关性优于 BLEU-4、ROUGE-L、CHAIR 和 GPT-4V
5. Hal-VL（在 Hal-Data 上微调的 LLaVA 1.5）在多个通用基准上取得最优

## 连接上下文

Hal-Eval 是一个**通用评估框架**，与 UNIHD（检测方法）和 LogicCheckGPT（检测方法）形成互补。UNIHD 关注检测方法本身的构建，而 Hal-Eval 关注评估方法论的创新。Hal-Eval 引入的"事件幻觉"概念填补了此前幻觉分类体系的一个重要空白——此前的工作（如 UNIHD 的模态冲突/事实冲突分类，POPE 的物体级幻觉评估）主要关注静态的不一致，而事件幻觉捕获了 LVLM 构建复杂虚构叙事的现象。Hal-Eval 的 Hal-Evaluator 作为开源评估模型，可替代 GPT-4V 等商业模型进行幻觉评估，降低了评估成本。该工作与 DAMRO 和 CausalMM 的根本区别在于：它不旨在缓解幻觉，而是提供更准确的评估方法来衡量其他方法的效果。

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
