---
layout: page
---


## 基本信息

- **标题**: HIVE: Hierarchical Pre-Training of Vision Encoders with Large Language Models
- **作者**: Eugene Lee, Ting-Yu Chang, Jui-Huang Tsai, Jiajie Diao, Chen-Yi Lee
- **年份**: 2026
- **会议/期刊**: arXiv preprint
- **arXiv ID**: 2604.00086v1
- **论文类型**: 实验论文（新框架/新方法）

## 核心贡献（新范式/新指标）

本文提出 **HIVE (Hierarchical Pre-Training of Vision Encoders)**，一种新颖的视觉编码器预训练框架，通过引入**层级交叉注意力（Hierarchical Cross-Attention）**机制，将视觉编码器不同层级的特征直接注入大语言模型（LLM），突破了传统方法将扁平化图像嵌入直接输入 LLM 的浅层集成限制。

核心创新包括：
1. **层级交叉注意力**: 在视觉编码器与 LLM 之间建立多层级的交叉注意力链接，使 LLM 能在不同抽象层级处理视觉信息，保留边缘、纹理等低层结构信息的同时捕获高层语义概念。
2. **三阶段渐进式训练策略**: 逐步解锁投影器、LLM 和视觉编码器的训练，确保层级交叉注意力的稳定优化。
3. **推理效率提升**: 预训练时使用层级交叉注意力作为正则化目标，微调时回退到标准 token 拼接架构，在获得丰富视觉表示的同时避免推理时的计算开销。

## 方法

### 层级特征集成

给定输入图像 $I \in \mathbb{R}^{H \times W \times C}$，视觉编码器将其处理为视觉 token 序列 $T_v = [t_1, t_2, \ldots, t_N]$。编码器通过多层处理生成层级特征表示：

$$F_l = f_l(F_{l-1}), \quad l = 1, \ldots, L$$

其中 $F_0 = T_v$，$f_l$ 为编码器第 $l$ 层的变换函数。为平衡性能与效率，选择 $S \subset \{1, \ldots, L\}$（25% 均匀采样）作为链接层。轻量级投影器 $g_l$ 将选中的层级特征映射到与 LLM 兼容的维度：

$$T_{\text{LLM},l} = g_l(F_l), \quad l \in S$$

### 层级交叉注意力

投影后的视觉特征通过交叉注意力机制与 LLM 交互。对于对齐层 $l$：

$$H_l = \text{CrossAttention}(Q_l, K_l, V_l)$$

其中 $Q_l$ 来自 LLM 的中间隐藏状态，$K_l$ 和 $V_l$ 由对应层级的视觉编码器特征线性投影得到。注意力权重计算如下：

$$A_l = \text{Softmax}\left(\frac{Q_l K_l^T}{\sqrt{d}}\right)$$

### 训练损失与复杂度

模型使用下一 token 预测的交叉熵损失：

$$\mathcal{L} = -\sum_t p_t \log \hat{p}_t$$

**计算复杂度对比**: 传统自注意力机制的复杂度为：

$$O\left(L_l \frac{N^2 d}{2} + L_l N d^2\right)$$

其中 $N = N_v + N_t$ 为视觉和文本 token 总数。HIVE 的层级交叉注意力复杂度为：

$$O(L_l L_s d^2 + L_l N_t d^2)$$

其中 $L_s \ll N_v$ 为选中的视觉编码器层数，显著降低了计算开销。

### 三阶段训练

- **Stage 1**: 冻结视觉编码器和 LLM，仅训练投影器 $g_l$
- **Stage 2**: 冻结视觉编码器，联合训练投影器 $g_l$ 和 LLM
- **Stage 3**: 端到端训练所有组件（视觉编码器 $f_l$、投影器 $g_l$、LLM）

## 数据集/模型/实验方法

### 实验设置
- **视觉编码器**: CLIP ViT-L/14-336 和 SigLIP ViT-L/16-384
- **LLM 骨干**: MobileLLM-350M（预训练），Llama-3.2-1B-Instruct（VLM 微调）
- **硬件**: 单张 RTX 3090 GPU（24GB VRAM）

### 分类任务评估
- **数据集**: CIFAR-10/100, ImageNet-1K, Tiny-ImageNet, Food-101, Stanford Cars, Oxford-IIIT Pets, Caltech-256
- **结果**: HIVE 在细粒度分类基准（Food-101, Caltech-256, Pets）上取得最显著提升

### VLM 任务评估
- **数据集**: MME, GQA, OK-VQA, ScienceQA
- **结果**: HIVE 在 SigLIP 基础上 MME 1298(+2)、GQA 58.05(+0.31)、OK-VQA 51.01(+2.23)、ScienceQA 63.12(+0.78)

### 效率分析
- **训练速度提升**: 3.43x 加速（相比自注意力基线）
- **GPU 内存减少**: 59.3%（54.2GB -> 22.03GB）
- 在保持或提升性能的同时显著降低计算成本

## 连接上下文

本文属于视觉编码器与 LLM 集成方式的研究方向。不同于 BLIP-2（使用 Q-Former 提取固定数量视觉特征）和 Flamingo（使用门控交叉注意力）等方法主要优化 LLM 的视觉处理能力，HIVE 明确以预训练视觉编码器为目标，通过层级交叉注意力迫使视觉编码器保留密集的多尺度语义信息。论文的关键设计洞见是：层级交叉注意力在预训练阶段作为强正则化目标，一旦视觉编码器训练完成，其最终层表示已天然更丰富，微调时可直接使用标准 LLaVA 架构，无需承受多层交叉注意力的推理代价。这一 "预训练时复杂、推理时轻量" 的思路对高效多模态模型设计具有重要参考价值。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md)
- 冗余分析：[Investigating Redundancy in MLLMs with Multiple Vision Encoders](Investigating Redundancy in MLLMs with Multiple Vision Encoders.md)
- 解耦编码：[Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation](Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation.md)
- 文档专用编码器：[DAVE A VLM Vision Encoder for Document Understanding and Web Agents](DAVE A VLM Vision Encoder for Document Understanding and Web Agents.md)
- 层次结构涌现：[Emergent Visual-Semantic Hierarchies in Image-Text Representations](Emergent Visual-Semantic Hierarchies in Image-Text Representations.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)

### 幻觉缓解
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
