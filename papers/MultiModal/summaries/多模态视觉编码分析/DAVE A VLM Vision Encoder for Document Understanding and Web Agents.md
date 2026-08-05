---
layout: page
---


## 基本信息

- **标题**: DAVE: A VLM Vision Encoder for Document Understanding and Web Agents
- **作者**: Brandon Huang, Hang Hua, Zhuoran Yu, Trevor Darrell, Rogerio Feris, Roei Herzig
- **年份**: 2025
- **会议/期刊**: Preprint (Under Review)
- **arXiv ID**: 2512.17221v1
- **论文类型**: 实验论文（新模型/新框架）

## 核心贡献（新范式/新指标）

本文提出 **DAVE (Document and web Agents Vision Encoder)**，一个专门为 VLMs 设计的视觉编码器，专注于文档理解和 Web Agent 任务。核心创新包括：

1. **两阶段预训练框架**: 结合大规模无标注数据的自监督预训练（Stage 1）和有限高质量标注数据的监督自回归预训练（Stage 2），解决了文档和网页图像高质量标注数据稀缺的问题。
2. **权重空间合并（Weight-space Merging）**: 提出基于蒸馏的模型合并方案，通过学习一组系数将多个与不同文本解码器对齐的视觉编码器合并为一个解码器无关的编码器，解决了专用视觉编码器过拟合于单一解码器的问题。
3. **集成训练（Ensemble Training）**: 在预训练过程中融合冻结的通用编码器（如 SigLIP2）的高层语义特征与 DAVE 自身的文档/网页特定结构化特征，保留通用视觉知识。

## 方法

### Stage 1: 自监督预训练

采用 Masked Autoencoder (MAE) 架构。标准的 MAE 损失函数使用逐块归一化：

$$L_{\text{MAE}} = \frac{1}{|M|} \sum_{i \in M} \left\| f_\theta(\tilde{x})_i - \frac{x_i - \mu(x_i)}{\sqrt{\sigma^2(x_i) + \epsilon}} \right\|^2_2, \quad \epsilon = 10^{-6}$$

其中 $\tilde{x}$ 为带掩码的输入图像，$f_\theta(\tilde{x})_i$ 为重建输出，$x_i$ 为真实像素值，$\mu(x_i)$ 和 $\sigma^2(x_i)$ 为块内像素的均值和方差，$M$ 为被掩码块的集合。

然而，文档和网页图像具有低频的块间方差，导致标准 MAE 训练不稳定。因此 DAVE 改为直接重建原始像素值：

$$L_{\text{MAE-pixel}} = \frac{1}{|M|} \sum_{i \in M} \| f_\theta(\tilde{x})_i - x_i \|^2_2$$

这一改动使得训练可稳定扩展到 2000 万张图像。

### Stage 2: 监督多任务预训练

**权重空间合并**: 给定 $n$ 个预训练文本解码器 $\{\Theta_1, \ldots, \Theta_n\}$，训练 $n$ 个对应的视觉编码器实例 $\{\phi_1, \ldots, \phi_n\}$。将每个编码器 $\phi_i$ 视为一组 $m$ 个权重 $\{\theta_i^{(j)}\}_{j=1}^m$，合并后的权重为学习到的系数的加权和：

$$\theta_{\text{merge}}^{(j)} = \sum_{i=1}^{n} \alpha_i^{(j)} \theta_i^{(j)}, \quad \alpha_i^{(j)} \in [0, 1]$$

蒸馏损失函数最小化合并特征与每个教师编码器特征之间的均方误差：

$$L_{\text{distill}} = \frac{1}{n} \sum_{i=1}^{n} \| \hat{z}_i - z_i \|^2_2$$

其中 $z = \phi_{\text{merge}}(I)$ 为合并编码器的块级特征，$z_i = \phi_i(I)$ 为教师编码器的特征。

**集成训练**: 将通用编码器 $\phi_{\text{gen}}$ 与文档/网页专用编码器 $\phi_{\text{spec}}$ 的特征进行拼接：

$$\phi_{\text{DAVE}}(x) = \text{Concat}[\phi_{\text{gen}}(x), \phi_{\text{spec}}(x)]$$

## 数据集/模型/实验方法

### 模型架构
- **视觉编码器**: ViT-L-384，从零初始化训练
- **通用编码器**: 冻结的 SigLIP-2
- **文本解码器**: Qwen2.5-0.5B-Instruct, Phi-4-mini-Instruct, Granite-3.1-3B-Instruct
- **VLM 架构**: LLaVA-style（视觉编码器 + MLP 投影器 + LLM 解码器）

### 训练数据
- **Stage 1 (自监督)**: 2000 万张图像，包括 1000 万张 DocFM PDF 文档图像和 1000 万张 Common Screen 网页截图
- **Stage 2 (监督)**: 约 200 万样本，包括 ChartQA, PlotQA, FinTabNet, Datikz, PubTables, UGround 等
- **指令微调数据**: 约 250 万样本，包括 LLaVA-1.5-mix 665K, DocVQA, ChartQA, AI2D, Pixmo-Doc, MultiUI

### 评估基准
- **经典文档任务**: DocBank（文档元素识别）、DocLayNet（文档语义分割）、RICO-SCA（Web UI 分类）
- **文档与通用 VQA**: AI2D, OCRBench, DocVQA, InfoVQA, ChartQA, MMMU, RealWorldQA, TextVQA
- **Web 定位与 Agent**: Screenspot-V2, WebSRC, VisualWebBench, Mind2Web

### 主要实验结果
- 在 Llama-3.2-3B-Instruct 设置下，DAVE 在 8 个文档和 Web 基准上平均超越最强基线 SigLIP2 达 **10.5%**
- 在 Mind2Web Agent 基准上超越最强基线编码器 Dolphin 平均 **5%**
- 在 DocBank 和 DocLayNet 上超越所有专用和通用编码器
- 消融实验表明模型合并和集成训练均带来显著提升

## 连接上下文

本文属于视觉编码器专用化方向的研究。与现有的通用视觉编码器（CLIP, SigLIP, DINOv2）和文档专用编码器（Pix2Struct, Dolphin, DiT）不同，DAVE 通过两阶段预训练和特征融合策略，在保持通用 VQA 能力的同时大幅提升文档和 Web Agent 任务表现。该方法揭示了良好视觉表示对文档理解和 Agent 任务的关键作用，并为低资源领域（如医学影像）的视觉编码器设计提供了新范式。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md)
- 冗余分析：[Investigating Redundancy in MLLMs with Multiple Vision Encoders](Investigating Redundancy in MLLMs with Multiple Vision Encoders.md)
- 层级预训练：[HIVE Hierarchical Pre-Training of Vision Encoders with LLMs](HIVE Hierarchical Pre-Training of Vision Encoders with LLMs.md)
- 解耦编码：[Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation](Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation.md)
- 层次结构涌现：[Emergent Visual-Semantic Hierarchies in Image-Text Representations](Emergent Visual-Semantic Hierarchies in Image-Text Representations.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)

### 场景文字理解
- 统一框架：[OmniParser Unified Framework for Text Spotting KIE and Table Rec](OmniParser Unified Framework for Text Spotting KIE and Table Rec.md)
- 文档理解：[UniDoc Universal LMM for Text Detection Recognition and Understanding](UniDoc Universal LMM for Text Detection Recognition and Understanding.md)
