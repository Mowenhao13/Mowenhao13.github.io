---
layout: page
---


## 基本信息

- **标题**: UNIT: Unifying Image and Text Recognition in One Vision Encoder
- **作者**: Yi Zhu, Yanpeng Zhou, Chunwei Wang, Yang Cao, Jianhua Han, Lu Hou, Hang Xu
- **年份**: 2024
- **会议/期刊**: arXiv (Under review)
- **arXiv ID**: 2409.04095
- **论文类型**: 实验论文（新框架）
- **机构**: Huawei Noah's Ark Lab, HKUST

## 核心贡献（新范式/新指标）

1. **统一图像与文本识别的新范式**: 提出 UNIT 框架，首次在单一视觉编码器（ViT）中同时支持图像识别和文本识别，无需在推理时增加额外计算成本。不同于以往需要拼接多个专家模型的方法，UNIT 保持原始视觉编码器架构不变。

2. **双阶段多尺度训练策略**: 提出"尺度内预训练（Intra-scale Pretraining）+ 尺度间微调（Inter-scale Finetuning）"的两阶段训练范式，在常用分辨率下学习基础识别能力，再通过分辨率交换增强尺度鲁棒性。

3. **轻量级辅助解码器设计**: 引入轻量级语言解码器（OPT-125M）处理OCR任务，同时引入小型视觉解码器（两层MLP）进行特征重建，防止灾难性遗忘。

## 方法

### 总体架构

UNIT 基于 Vision Transformer (ViT) 架构，对于输入图像 $$I \in \mathbb{R}^{H \times W \times 3}$$，视觉编码器输出视觉 tokens:

$$
X = f_{\theta}(I) = \{x_i\}_{i=1}^{N}
$$

其中 $$N = N_s + N_c$$ 为空间 tokens 和 [CLS] tokens 的总数。

### 文本识别能力增强

**语言解码器**: 引入 OPT-125M 作为语言解码器，通过 Q-Former 将视觉特征投影到语言空间：

$$
\{z_1, ..., z_N\} = f_{\phi}(\{x_1, ..., x_N\}, \{q_1, ..., q_K\})
$$

自回归语言建模使用交叉熵损失：

$$
\mathcal{L}_{\text{lan}}(y, \hat{y}) = -\sum_{t=1}^{T} \log P(\hat{y}_t = y_t | y_{1:t-1}, z_t^L)
$$

### 图像识别能力保持

**视觉解码器**: 使用两层 MLP（含 GeLU 激活）进行逐 token 特征重建，防止灾难性遗忘：

$$
\mathcal{L}_{\text{vis}}(X, \hat{X}) = \sum_{i \in C} \mathcal{L}_{\text{cos}}(f_{\pi}(x_i), \hat{x}_i) + \mu \mathcal{L}_{l1}(f_{\pi}(x_i), \hat{x}_i)
$$

### 尺度内预训练

联合优化目标：

$$
\theta = \arg \min_{\theta} \mathcal{L}_{\text{lan}}(\mathcal{D}_{\times 1}^{I} \cup \mathcal{D}_{\times 4}^{T}) + \lambda \mathcal{L}_{\text{vis}}(\mathcal{D}_{\times 1}^{I})
$$

- 低分辨率（×1）自然图像：粗粒度标题标注（<30词）
- 高分辨率（×4）文档图像：稠密OCR数据（>500词）

### 尺度间微调

引入分辨率交换数据（高分辨率图像 + 低分辨率文档），增强尺度鲁棒性：

$$
\theta = \arg \min_{\theta} \mathcal{L}_{\text{lan}}(\cdot) + \lambda \mathcal{L}_{\text{vis}}(\cdot)
$$

## 数据集/模型/实验方法

### 预训练数据
- **自然图像**: Conceptual Caption（3M样本），ShareGPT4V（1M样本）
- **文档图像**: 合成英文PDF文档（2M样本 + 1M大字体文档）
- **Markdown数据**: 1M样本（按Nougat方式收集）

### 模型配置
- **视觉编码器**: OpenCLIP ViT-H（32层，1280维隐藏层）
- **语言解码器**: OPT-125M（768维隐藏层）
- **优化器**: AdamW，权重衰减0.01，学习率5e-5，余弦退火调度

### 评估基准

**文本识别**:
- 文档级OCR: FUNSD, SROIE, CORD (F1分数)
- 合成数据集: SYN-L-val, SYN-S-val, MD-val（markdown转换）

**图像识别**:
- Zero-shot分类: ImageNet-1K top-1准确率
- k-NN分类
- 语义分割: ADE20K mIoU

**下游任务**（集成到LLaVA-1.5 + Vicuna-7B）:
- VQA: VQAv2, GQA, OKVQA
- 文档理解: ChartQA, DocQA, InfoVQA

### 主要实验结果
- 文本识别显著优于Donut、Nougat、Vary、RADIO等文档专用模型
- 图像识别能力保持最佳（78.76% zero-shot分类准确率）
- 作为LVLM视觉编码器时，在文档分析任务上大幅超越CLIP-L、SigLIP等

## 连接上下文

UNIT 解决了视觉编码器在图像理解和文本识别之间的能力割裂问题。传统方法要么制作专门的OCR模型（丢弃图像编码能力），要么拼接多个专家模型（增加计算成本）。UNIT 的工作为后续统一视觉编码器提供了新思路——通过多尺度训练和辅助解码器设计，在不改变推理架构的前提下实现双能力融合。与 DeepSolo、OmniParser 等端到端场景文本方法不同，UNIT 专注于视觉编码器层面的统一，可即插即用地集成到各类LVLM中。
