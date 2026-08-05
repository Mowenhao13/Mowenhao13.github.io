---
layout: page
---


## 基本信息

- **标题**: Investigating Redundancy in Multimodal Large Language Models with Multiple Vision Encoders
- **作者**: Song Mao, Yang Chen, Pinglong Cai, Ding Wang, Guohang Yan, Zhi Yu, Botian Shi
- **年份**: 2025
- **会议/期刊**: ICML 2025 (Proceedings of the 42nd International Conference on Machine Learning)
- **arXiv ID**: 2507.03262v1
- **论文类型**: 实验论文（系统性分析/新指标）

## 核心贡献（新范式/新指标）

本文首次对多视觉编码器 MLLM 中的**编码器冗余问题**进行了系统性研究，提出了量化冗余的新的指标框架：

1. **编码器冗余现象定义**: 发现多编码器 MLLM 中增加视觉编码器带来的性能提升逐渐减小甚至导致性能下降，称之为"编码器冗余"。

2. **条件利用率（Conditional Utilization Rate, CUR）**: 量化单个编码器 $E_i$ 在全集 $E_n$ 中的边际贡献：

$$u(E_i) = \frac{\text{acc}(f_{E_n}) - \text{acc}(f_{E_n \setminus \{E_i\}})}{\text{acc}(f_{E_n})}$$

其中 $f_{E_n}$ 为完整模型，$f_{E_n \setminus \{E_i\}}$ 为去除编码器 $E_i$ 后的模型。$u(E_i)$ 越高表示编码器贡献越独特；接近零表示冗余；负值表示该编码器有害。

3. **信息差距（Information Gap, IG）**: 衡量编码器间利用率的不平衡程度：

$$\Delta_{\text{gap},n}(E_n) := \max_{i \in 1,\ldots,n} u(E_i) - \min_{j \in 1,\ldots,n} u(E_j)$$

大的 IG 值表示严重的编码器贡献不平衡，部分编码器起主导作用而其他编码器被浪费。

## 方法

### 问题形式化

给定包含 $n$ 个视觉编码器的 MLLM $E_n = \{E_1, \ldots, E_n\}$，模型响应表示为：

$$Y = f_{E_n}(I, T) = \text{LLM}(\text{proj}(\text{fuze}(E_1(I), \ldots, E_n(I)), T))$$

其中 $\text{fuze}$ 为特征融合策略（如拼接、注意力融合），$\text{proj}$ 为投影层。

编码器冗余形式化定义为：当移除一个或多个编码器后性能不下降甚至提升：

$$\text{acc}(f_{E_n}) \lesssim \max_{E \subsetneq E_n} \text{acc}(f_{E})$$

### 实验设计

对两个代表性多编码器 MLLM 进行系统性遮罩实验：
- **Eagle-X5-7B**: 5 个编码器（CLIP, ConvNeXt, SAM, EVA, Pix2Struct），使用通道拼接融合
- **Cambrian-1-8B**: 4 个编码器（CLIP, ConvNeXt, DINOv2, SigLIP），使用空间视觉聚合器（SVA）

对所有 $2^n$ 种编码器组合进行全面评估。

### 评估基准
按任务类别分组：通用 VQA、知识型 VQA、OCR & Chart、视觉中心任务，涵盖 GQA, MMBench, MME, SEED-Bench, AI2D, MathVista, SQA-I, MMMU, DocVQA, ChartQA, OCRBench, TextVQA, CV-Bench, MMVP, RealWorldQA。

## 数据集/模型/实验方法

### 主要发现

**发现 1: 多编码器 MLLM 存在显著冗余**
- Eagle-X5-7B 在去掉 3 个编码器后最优性能仅下降不到 4%
- Cambrian-1-8B 的最优性能出现在 3 个编码器的子集（而非全部 4 个）
- 模型对编码器去除表现出惊人的鲁棒性

**发现 2: 编码器贡献高度上下文相关**
- 某些编码器在特定组合下对性能有害（"视觉冲突"）
- EVA 编码器在视觉中心任务中加入后可能导致最高分降低

**发现 3: CUR 和 IG 有效量化编码器贡献不平衡**
- OCR & Chart 任务中 IG 极高：ConvNeXt 的 CUR 达 74.98-77.20%，而其他编码器贡献微小
- 通用 VQA 任务中 IG 较低，编码器间高度可互换
- Cambrian-1 的 SigLIP 在视觉中心任务中出现负 CUR（-16.16%）

### 冗余驱动因素分析

1. **融合策略**: 简单拼接（Eagle）比交叉注意力（Cambrian-1）更鲁棒，交叉注意力可能使模型关注不重要的细节
2. **编码器数量**: 双编码器是性能与效率的最佳平衡点
3. **编码器微调**: 微调可能导致表示不平衡，模型过度依赖主导编码器
4. **LLM 容量**: 更大的 LLM（13B vs 3B）表现出更显著的冗余，对编码器去除更鲁棒但也更低效

## 连接上下文

本文挑战了多视觉编码器 MLLM 领域 "越多越好" 的传统假设。与现有聚焦于开发复杂融合机制的工作不同，本文首次从诊断角度系统揭示编码器冗余问题。CUR 和 IG 指标可作为模型设计的诊断工具，指导自动编码器选择或动态加权策略。该工作为构建更精简高效的多编码器 MLLM 架构提供了理论基础和量化分析工具，对 Cambrian-1、Eagle 等多编码器架构的设计和改进具有直接指导意义。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md) - 视觉token内部语义
- 层级预训练：[HIVE Hierarchical Pre-Training of Vision Encoders with LLMs](HIVE Hierarchical Pre-Training of Vision Encoders with LLMs.md)
- 解耦编码：[Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation](Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation.md)
- 文档专用编码器：[DAVE A VLM Vision Encoder for Document Understanding and Web Agents](DAVE A VLM Vision Encoder for Document Understanding and Web Agents.md)
- 层次结构涌现：[Emergent Visual-Semantic Hierarchies in Image-Text Representations](Emergent Visual-Semantic Hierarchies in Image-Text Representations.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)

### 幻觉缓解
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
