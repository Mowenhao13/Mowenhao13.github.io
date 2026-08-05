---
layout: page
---


## 基本信息

- **标题**: Language Matters: A Weakly Supervised Pre-training Approach for Scene Text Detection and Spotting
- **作者**: Chuhui Xue, Yu Hao, Shijian Lu, Philip Torr, Song Bai
- **年份**: 2022
- **会议/期刊**: ECCV 2022
- **arXiv ID**: 2203.03911
- **论文类型**: 实验论文（新预训练方法）
- **机构**: ByteDance, Nanyang Technological University, University of Oxford

## 核心贡献（新范式/新指标）

1. **弱监督视觉-语言预训练新范式**: 提出首个能够在仅有部分文本标注（无文本边界框）的情况下进行场景文本检测和定位预训练的方法，极大降低数据标注成本。

2. **字符感知文本编码器（Character-Aware Text Encoder）**: 区别于传统VLP方法的句子级文本编码，该方法编码每个文本实例的字符序列，更好地捕捉文本实例内的字符关系，同时忽略不同实例间的无关关系。

3. **视觉-文本解码器（Visual-Textual Decoder）**: 建模输入图像与每个标注文本实例之间的交互，忽略未标注文本的影响，从而支持从部分标注数据中学习。

## 方法

### 总体框架

网络由三部分组成：图像编码器（ResNet-50 + 多头注意力）、字符感知文本编码器、视觉-文本解码器。

### 字符感知文本编码器

对于n个文本实例 $$T = \{t_0, t_1, ..., t_{n-1}\}$$，每个实例为字符序列 $$t_i = [c_{i0}, c_{i1}, ..., c_{i(k-1)}]$$，字符嵌入为：

$$
ce_{ij} = W_c \cdot c_{ij} + PE_j
$$

字符嵌入通过Transformer编码器生成文本实例嵌入 $$te_i$$。

### 视觉-文本解码器

文本实例嵌入作为查询（queries），图像嵌入作为键和值（keys and values），使每个文本实例独立关注图像的所有位置。

### 网络优化

**掩码字符预测损失**（分类问题）：

$$
\mathcal{L}_{cls} = \mathbb{E}_{(I,T) \sim D} H(y^{msk}, p^{msk}(I, T))
$$

**批级别对比损失**（受CLIP启发）：

$$
p^{i2t}_b(I) = \frac{\exp(I, T_b)}{\sum_{b=1}^{B} \exp(I, T_b)}, \quad p^{t2i}_b(T) = \frac{\exp(T, I_b)}{\sum_{b=1}^{B} \exp(T, I_b)}
$$

$$
\mathcal{L}_{bc} = \mathbb{E}_{(I,T) \sim D} [H(y^{i2t}(I), p^{i2t}(I)) + H(y^{t2i}(T), p^{t2i}(T))]
$$

**完整预训练目标**：

$$
\mathcal{L} = \mathcal{L}_{cls} + \mathcal{L}_{bc}
$$

## 数据集/模型/实验方法

### 预训练数据
- **SynthText**: 800K+合成场景文本图像（词级标注）
- **ICDAR2019-LSVT**: 450K图像，其中400K为弱标注（仅文本转写，无边界框），50K为全标注
- **SynthText弱标注实验**: 按比例（25%, 50%, 75%, 100%）采样文本实例

### 模型配置
- **图像编码器骨干**: ResNet-50
- **输入分辨率**: 512×512
- **优化器**: AdamW，初始学习率1e-4，余弦退火调度
- **训练**: 100 epochs，8块V100 GPU，batch size 640
- **文本实例最大长度**: 25字符

### 微调方法
- **检测器**: PSENet, DB, FCENet, TextBPN
- **定位器**: Mask TextSpotter-v3

### 主要实验结果

**ICDAR2019-LSVT弱监督预训练效果**:
- DB+Ours: F-score 75.8（提升+2.4%）
- PSENet+Ours: F-score 77.1（提升+2.5%）
- Mask TextSpotter-v3+Ours: 定位F-score 32.5（提升+4.8%）

**不同标注比例的SynthText预训练效果**（在Total-Text上微调PSENet）:
- 25%文本: 84.8%
- 50%文本: 85.2%
- 75%文本: 85.4%
- 100%文本: 85.5%

**与现有预训练方法比较**:
- 在Total-Text上F-score 85.5%（超越STKM 82.2%）
- 在CTW1500上F-score 82.8%（超越STKM 81.5%）

### 消融实验
- 完整模型（CAE + VTD + BCL）：F-score 85.5%
- 仅CAE：82.6%
- CAE + VTD：83.9%
- CAE + BCL：82.9%

## 连接上下文

Language Matters 是场景文本视觉-语言预训练领域的代表性工作。与 FastTCM（利用CLIP现成知识）不同，该方法通过设计字符级别的文本编码器和弱监督机制，从零开始学习视觉-文本对齐。其"弱监督"思路有效缓解了场景文本标注成本高的问题，后续被 UniDoc 等大模型方法借鉴用于构建多任务指令微调数据。与同期 STKM、VLPT 等预训练方法相比，Language Matters 首次展示了利用部分文本转写（无边界框）进行有效预训练的可行性。
