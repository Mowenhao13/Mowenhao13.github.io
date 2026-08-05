---
layout: page
---


## 基本信息

- **论文标题**: Object Hallucination in Image Captioning
- **作者**: Anna Rohrbach, Lisa Anne Hendricks, Kaylee Burns, Trevor Darrell, Kate Saenko
- **机构**: UC Berkeley, Boston University
- **年份**: 2018
- **arXiv ID**: 1809.02156
- **论文类型**: 评估方法 - 奠基性

## 核心贡献

本文首次系统性地定义了图像描述（Image Captioning）任务中的**目标幻觉（Object Hallucination）**问题，并提出了经典的评估指标**CHAIR**（Caption Hallucination Assessment with Image Relevance）。CHAIR是VLM幻觉评估领域的**奠基性工作**，后续绝大多数幻觉评估方法（POPE、AMBER、FaithScore等）均以此为参照或改进基础。

CHAIR指标包含两个变体：

- **CHAIRi**（实例级）：衡量生成的所有目标实例中被幻觉的比例。
- **CHAIRs**（句子级）：衡量所有生成句子中包含幻觉目标的比例。

公式如下：

$$
\text{CHAIR}_i = \frac{|\{\text{hallucinated objects}\}|}{|\{\text{all objects mentioned}\}|}
$$

$$
\text{CHAIR}_s = \frac{|\{\text{sentences with hallucinated object}\}|}{|\{\text{all sentences}\}|}
$$

核心创新在于利用**MSCOCO的Ground-truth目标分割标注**作为图像的真实目标集合，通过比对生成描述中提到的目标与图像实际存在的目标来计算幻觉率。

## 方法

本文通过分析揭示了目标幻觉产生的两大原因：

1. **视觉误分类（Visual Misclassification）**：模型对图像内容识别错误。
2. **语言先验过度依赖（Language Priors）**：模型过度依赖语言模型中词与词之间的共现模式，而非图像内容。

为量化这两种因素，作者提出了**图像一致性（Image Consistency）**和**语言一致性（Language Consistency）**指标：

- **图像一致性**：训练一个多标签分类模型 $P(w|I)$，评估生成的错误词是否与图像模型一致。
- **语言一致性**：训练一个LSTM语言模型，评估生成的错误词是否与语言模型一致，定义为 $1/R(w_t)$，其中 $R(w_t)$ 是预测词在语言模型中的排序。

## 数据集/模型/实验方法

- **数据集**: MSCOCO（使用Karpathy Split和Robust Split，仅考虑80个MSCOCO分割挑战目标）
- **评估模型**: 涵盖了多种架构和训练目标——LRCN、FC（无注意力的基线）、Att2In、TopDown（自顶向下注意力）、TopDown-BB（基于目标检测框的注意力）、Neural Baby Talk（NBT）、GAN-based模型
- **训练损失**: 交叉熵（CE）和自关键损失（Self-Critical, SC，直接优化CIDEr）
- **TopDown解构实验**: 通过逐步移除模型组件（去除注意力、去除卷积特征、改用单层LSTM等）分析各组件对幻觉的影响
- **人类评估**: 通过Amazon Mechanical Turk对500张图片进行5分制评分

## 关键发现

1. 在MSCOCO上，7.4%到17.7%的生成句子包含幻觉目标。
2. **注意力机制降低幻觉**，但主要收益来自对空间卷积特征的访问，而非注意力机制本身。
3. **自关键损失（SC Loss）在提高CIDEr的同时增加了幻觉率**，说明CIDEr未充分惩罚目标幻觉。
4. **GAN训练降低幻觉**，因为人类标注不喜欢幻觉，而判别器会惩罚生成不真实的描述。
5. 模型幻觉更多出现在句子末尾（平均第6个词，句子长度约9），且与语言先验高度一致。
6. 传统指标（CIDEr、METEOR、SPICE）无法充分捕获幻觉，**CHAIR与这些指标互补**，联合使用能更好地与人类评分对齐。

## 连接上下文

CHAIR作为**VLM幻觉评估的奠基性工作**，为后续研究奠定了方法论基础。后续工作在三个方向上扩展了CHAIR：（1）**POPE**将CHAIR从生成式描述评估扩展为判别式轮询探测；（2）**AMBER**扩展了CHAIR的评估维度，覆盖属性幻觉和关系幻觉；（3）**FaithScore**将CHAIR的目标级评估细化为原子事实级评估。CHAIR的局限性在于仅覆盖80个MSCOCO目标类别，且依赖规则匹配进行词到目标的映射。

## 相关论文

### 后续评估基准
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - 判别式Yes/No问答
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md) - 属性/关系幻觉
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md) - 细粒度验证
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md) - GPT-4裁判
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md) - Type I幻觉
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md) - 归因分析

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
