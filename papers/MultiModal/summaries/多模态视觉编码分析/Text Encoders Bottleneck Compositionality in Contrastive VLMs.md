---
layout: page
---


## 基本信息

- **标题**: Text Encoders are Performance Bottlenecks in Contrastive Vision-Language Models
- **作者**: Amita Kamath, Jack Hessel, Kai-Wei Chang
- **年份**: 2023
- **会议/期刊**: arXiv preprint
- **arXiv ID**: 2305.14897v1
- **论文类型**: 实验论文（分析诊断/新基准）

## 核心贡献（新范式/新指标）

本文揭示了对比视觉-语言模型（如 CLIP）中**文本编码器是组合性推理的性能瓶颈**。通过提出新的探测方法和评估基准，量化了单向量文本编码器在组合性描述上的信息损失，并验证了这种损失与多模态任务性能的直接关联。

核心贡献包括：
1. **CompPrompts**: 一个包含 18,100 条递增组合性图像描述的文本评估集，涵盖从单一物体到多物体+属性+关系的多层次组合。
2. **ControlledImCaps**: 一个包含 600 对图像+描述的评估基准，每对仅改变一个词以隔离特定语言属性的影响，用于验证文本编码器瓶颈在多模态场景中的表现。
3. **文本恢复探测方法**: 使用 T5-Large 作为生成式探针，通过训练探针从单向量文本表示中重建原始描述，无需图像输入即可评估文本编码器的信息保留能力。

## 方法

### 文本恢复探测

对于固定的文本编码器 $T: x \rightarrow y$（将描述 $x$ 映射为向量 $y \in \mathbb{R}^d$），训练生成式探针 $P$ 重建 $x$：

$$P(x|T(x))$$

使用 T5-Large 作为探针解码器，以 $T(x)$ 为条件进行文本生成。训练数据为 Conceptual Captions 3M（CC3M），采用 Exact Match (EM) 作为主要评估指标。

### 多模态验证

在 ControlledImCaps 上评估完整 VL 模型，使用 Winoground 风格的 text score（给定图像选择正确描述）和 image score（给定描述选择正确图像）：

$$\text{Text Score} = \frac{1}{N} \sum_{i=1}^N \mathbb{I}[\text{score}(I_i, c_i) > \text{score}(I_i, c_i')]$$

$$\text{Image Score} = \frac{1}{N} \sum_{i=1}^N \mathbb{I}[\text{score}(I_i, c_i) > \text{score}(I_i', c_i)]$$

### CompPrompts 结构

描述按递增组合性分层组织：
- 1 个物体无属性 → 1 个物体 + 1 属性（形容词/空间/时间/动词）→ 2 个物体 + 1 属性 → 2 个物体 + 2 属性
- 额外测试：复数（counting）和否定（negation）

## 数据集/模型/实验方法

### 评估的文本编码器
- **CLIP ViT-B/32**（512 维）和 **ViT-L/14**（768 维）
- **negCLIP ViT-B/32**（使用更难负样本微调，增强词序感知）
- **RoBERTa-CLIP ViT-B/32**（RoBERTa 文本编码器替换 CLIP 文本编码器）
- **SBERT**（all-mpnet-base-v2，纯语言句子编码器）
- **Proof-of-concepT5**（T5-Large 编码器，在 CC3M 上自编码训练得到单向量表示）

### 主要研究发现

**1. 文本编码器在关键语言属性上表现差**
- 空间关系平均 EM 仅 23.7%，两物体空间关系仅 13.8%
- 时间关系平均 EM 17.1%
- 否定 EM 平均 13.0%，复数 EM 平均 5.1%
- 词序敏感场景 EM 平均 15.8%（词序不敏感场景 34%）

**2. 不同文本编码器差异显著**
- SBERT 平均 EM 41.6%，远超 CLIP ViT-B/32 的 13.2%
- Proof-of-concepT5 达到 92.9%，证明信息保留在理论上是可行的
- RoBERTa-CLIP 在否定上提升明显（比 CLIP 高 29%）

**3. 文本恢复能力是多模态性能的必要但不充分条件**
- CLIP ViT-L/14 在空间关系上的 CompPrompts EM 很低（4.0%），在 ControlledImCaps 上的 text score 也很低（4.0%）
- 形容词的 CompPrompts EM 很高（81.8%），ControlledImCaps text score 达 65.0%
- 存在反例：某些模型的文本恢复能力强但多模态匹配能力不一定强

## 连接上下文

本文属于视觉-语言模型可组合性评估方向。与 Winoground、ARO 等基准不同，本文的独特之处在于：（1）不依赖图像的纯文本探测方法可以在更大范围内进行评估，包括创意性文本到图像查询；（2）从编码器瓶颈角度诊断模型缺陷，而非仅报告联合性能。研究揭示了对比 VL 模型的核心问题：单向量文本嵌入的池化操作丢失了结构化的组合性信息，即使扩大模型规模也无法可靠改善空间关系的编码。这一发现对多模态模型的设计（如使用更强大的文本编码器、改变池化策略）具有重要指导意义。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md)
- 层次结构涌现：[Emergent Visual-Semantic Hierarchies in Image-Text Representations](Emergent Visual-Semantic Hierarchies in Image-Text Representations.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)
- 文本即图像：[Text as Images Can MLLMs Follow Printed Instructions in Pixels](Text as Images Can MLLMs Follow Printed Instructions in Pixels.md)
- 文本或像素：[Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs](Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs.md)
- 视觉文本风格：[Revealing Impact of Visual Text Style on LVLM Descriptions](Revealing Impact of Visual Text Style on LVLM Descriptions.md)
