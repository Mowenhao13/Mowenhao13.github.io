---
layout: page
title: Getting More from Less: Large Language Models are Good Spontaneous Multilingual Learners
tags:
  - multilingual
  - alignment
  - representation
  - spontaneous-learning
  - 2024
---

# Getting More from Less: Large Language Models are Good Spontaneous Multilingual Learners

**作者**: Shimao Zhang, Changjiang Gao, Wenhao Zhu, Jiajun Chen, Xin Huang  
**年份**: 2024  
**来源**: arXiv:2405.13816

## 核心贡献

本文发现并研究了 LLM 的**自发多语言对齐（spontaneous multilingual alignment）** 现象——LLM 在没有翻译平行数据的情况下，仍然会在中间层自发产生跨语言表示对齐。

### 提出新范式
- **自发多语言对齐**：LLM 通过共享的语义表示空间自发对齐不同语言的表示，即使没有显式的跨语言训练信号
- **对齐量化指标**：度量不同语言在模型隐空间中的表示相似度和对齐程度
- **语言对齐的涌现特性**：多语言对齐不是显式训练的产物，而是模型的涌现特性

## 实验方法

### 使用的模型

| 模型 | 类型 | 参数量 | 说明 |
|------|------|--------|------|
| **Mistral-7B-v0.1** | 英语中心型（English-centric） | 7B | 主流开源 LLM，预训练数据以英语为主 |
| **Qwen1.5-1.8B** | 非英语中心型（Non-English-centric） | 1.8B | 通义千问增强版，中英双语预训练 |
| **Qwen1.5-4B** | 非英语中心型 | 4B | 同上 |
| **Qwen1.5-14B** | 非英语中心型 | 14B | 同上，用于主要实验结果 |

### 使用的数据集与任务

| 任务类型 | 数据集 | 类别数 | 说明 |
|---------|--------|--------|------|
| **情感分类（Emotion Classification）** | Amazon Reviews Polarity | 2（positive/negative） | 经典情感分类基准 |
| **自然语言推理（NLI）** | SNLI（Stanford Natural Language Inference） | 3（entailment/neutral/contradiction） | 判断前提与假设的关系 |
| **释义识别（Paraphrase Identification）** | PAWS（Paraphrase Adversaries from Word Scrambling） | 2（paraphrase/not） | 判断两个句子是否语义等价 |

### 实验语言（共 20 种）

**高资源语言（10 种）**：英语（en）、德语（de）、法语（fr）、瑞典语（sv）、中文（zh）、西班牙语（es）、俄语（ru）、荷兰语（nl）、意大利语（it）、日语（ja）

**低资源语言（10 种）**：斯洛文尼亚语（sl）、波兰语（pl）、保加利亚语（bg）、挪威语（no）、马来语（ms）、冰岛语（is）、印地语（hi）、泰语（th）、斯瓦希里语（sw）、孟加拉语（bn）

### 实验设置

- **训练方式**：使用 LoRA（rank=8, α=16）对预训练模型进行指令微调
- **训练数据**：仅使用问题翻译平行数据（不含标注答案），每种语言对 10K 条
- **测试方式**：上下文学习（In-Context Learning），约束解码（Constrained Decoding）
- **训练配置**：3 epochs（PAWS 为 1 epoch 防过拟合），batch_size=16，lr=5e-5，cosine 调度，cutoff_len=2048
- **硬件**：单张 NVIDIA RTX A6000 48GB 或 Tesla V100 SXM2 32GB，训练时间 4-10+ 小时

### 三种分析方法的详细解释

#### 1. 表示分析（Representation Analysis）

本文使用两类核心表示分析技术来观察 LLM 内部状态：

**（a）Logit Lens（对数透镜）**
- **原理**：利用模型最后一层的 LM Head（语言模型头），将中间层的隐状态直接投影到词汇空间
- **作用**：观察模型在每一层"正在思考什么 token"，揭示模型在推理过程中的中间语言表示
- **关键发现**：
  - 所有模型在输出目标语言答案之前，都会先生成潜在的英语输出（Latent English Output）
  - 微调后模型的正确答案概率在所有可能答案中的占比显著提升
  - 潜在英语输出区域扩大，表明模型在英语中进行了更有效的潜在推理
  - 注意：Logit Lens 对非英语中心模型（如 Qwen1.5）效果有限，因为其中间层没有明显的英语潜在输出

**（b）PCA（主成分分析）**
- **原理**：一种线性降维技术，将高维数据投影到低维空间，保留最大方差方向
- **作用**：将中间层潜在 logits 映射到 2D 空间，可视化不同语言表示在隐空间中的分布
- **关键发现**：
  - 不同语言在中间层（约 20-60% 深度）遵循相似的模式分布
  - 微调后不同语言的表示在隐空间中距离增大（区分度提高）
  - 低资源语言与高资源语言之间的相关性显著提升，表明对齐改善

#### 2. 层间表示相似度计算（Inter-layer Representation Similarity）

**计算方法**：**PCA + 皮尔逊相关系数（Pearson Correlation Coefficient）**

具体步骤：
1. 提取模型特定层（如 Mistral-7B 的 layer 20、25）的隐层 logits
2. 对每个语言的 logits 进行 PCA 降维至 1 维
3. 对两种语言（如英语-德语）的 1D PCA 结果计算**皮尔逊相关系数**
   $$r = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n}(x_i - \bar{x})^2}\sqrt{\sum_{i=1}^{n}(y_i - \bar{y})^2}}$$
4. 相关系数越接近 1，表示两种语言在该层的表示具有越强的线性相关性

**关键发现**：
- 中间层（如 Mistral-7B 的 layer 20）的语言对相关系数普遍在 0.95 以上，表明不同语言共享高度相似的潜在表示模式
- 微调后低资源语言（如 hi、th、sw、ms）与英语的相关系数显著提升（如 layer 25，en-sw 从 0.2316 提升至 0.8514）
- 浅层和深层表示的语言特异性更强，中间层表示的跨语言相似度最高

#### 3. 跨语言表示相似度评估

评估方法包括：
- **PCA 可视化**：将不同语言在相同层的隐层 logits 映射到 2D 空间，通过分布模式肉眼判断相似度
- **皮尔逊相关系数**：对 1D PCA 结果进行定量计算，提供跨语言表示相似度的数值指标
- **对比维度**：对比微调前后（Base vs Trained）的表示相似度变化，量化对齐改善程度

#### 4. 翻译数据质量与评估

本文**不直接评估翻译质量**，而是通过下游任务准确率间接评估跨语言对齐效果：
- 使用 Google Translate 将测试数据和 few-shot 示例从英语翻译成所有目标语言，以消除测试集本身的语言偏差
- 评估指标为各语言上的**任务准确率（Accuracy）**，对比基础模型与微调模型的表现
- 还进行了**交叉测试**（cross-task）：用 SNLI 数据训练的模型测试 Amazon Reviews，反之亦然，验证数据分布的影响

## 关键发现
- LLM 在**中间层**（约 20-60% 深度）自发对齐不同语言的表示
- 自发表面对齐**不需要**平行数据——即使在单语训练环境中也会出现
- 对齐模式与模型的**训练数据分布**相关——英语中心的对齐（英语作为对齐锚点）
- 浅层和深层表示的语言特异性更强，中间层表示更跨语言
- 多语言对齐能力与模型的语言数量正相关——模型掌握的语言越多，对齐越强
- 英语不是必需的——使用中文代替英语作为目标语言也能得到相同的结论
- 微调后低资源语言与高资源语言之间的表示相关性显著提升

## 数据局限
- 主要分析 7B-13B 参数级别的模型
- 自发对齐的机制解释还不够深入

## 关联论文
- [RomanLens: The Role of Latent Romanization in Multilinguality in LLMs](RomanLens_The_Role_of_Latent_Romanization_in_Multilinguality_in_LLMs.md) — 发现罗马化作为跨语言桥梁
- [The Same But Different: Structural Similarities and Differences in Multilingual Language Modeling](The_Same_But_Different_Structural_Similarities_in_Multilingual_Language_Modeling.md) — 跨语言电路的相似性
- [Language Lives in Sparse Dimensions](Language_Lives_in_Sparse_Dimensions_Toward_Interpretable_Multilingual_Control.md) — 语言信息存在于稀疏维度