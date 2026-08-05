---
layout: page
title: Toward Robust Multilingual Adaptation of LLMs for Low-Resource Languages_summary
---

# Toward Robust Multilingual Adaptation of LLMs for Low-Resource Languages_summary

## 论文基本信息
- **标题**: Toward Robust Multilingual Adaptation of LLMs for Low-Resource Languages
- **作者**: Haolin Li, Haipeng Zhang, Mang Li, Yaohua Wang, Lijie Wen, Yu Zhang, Biqing Huang
- **机构**: 清华大学、阿里巴巴集团
- **发表时间**: 2026年1月30日（Preprint）
- **论文链接**: 预印本

## 研究背景与问题

### 核心挑战
大型语言模型（LLMs）在低资源语言上表现不佳，主要原因包括：
1. **长尾预训练分布**: 训练数据主要集中在英语等高资源语言
2. **有限或噪声的平行数据**: 低资源语言的翻译数据稀缺且质量不稳定
3. **不稳定的跨语言对齐**: 表示空间在不同语言间存在漂移

### 现有方法的局限
- **基于机器翻译（MT）的流水线**: 容易出现错误传播和语义漂移
- **多语言编码器**: 难以继承LLMs强大的英语推理能力
- **现有系统（如MindMerger、Lusifer）**: 依赖平行翻译数据或缺乏低资源语言信息

## 方法介绍：LiRA框架

### 框架概述
LiRA（Linguistic Robust Anchoring for LLMs）是一个即插即用的框架，仅需轻量级微调即可增强跨语言表示。

### 核心组件

#### 1. Arca（Anchored Representation Composition Architecture）
**目标**: 减少锚定误差 $$\epsilon_1$$ 和翻译失真 $$\epsilon_2$$

**三个子模块**:
- **Translation Critic**: 使用LLM评估器对翻译候选进行三维评分（语义保真度、情感一致性、语用风格）
- **Embedding Critic**: 通过回归损失对齐多语言路径和英语路径
- **Actor**: 使用策略梯度训练，融合两个评估器的信号

**关键损失函数**:
- 锚定损失: $$\mathcal{L}_{anchor} = 1 - \cos(E_{lr}, E_{en})$$
- 强化学习损失: $$\mathcal{L}_{RL} = -\log \pi_\phi(a|\mathbf{c}_{1:K}) \cdot R_a$$
- 组合奖励: $$R_k = 0.1 \cdot (\alpha s_k + \beta e_k + \gamma p_k) + \delta \sin_k$$

#### 2. LaSR（Language-coupled Semantic Reasoner）
**目标**: 融合多语言和英语表示，支持检索、排序和推理

**关键特性**:
- 双编码器架构：多语言编码器 + 英语编码器
- 轻量级Transformer融合
- 两个FIFO缓冲区：
  - **CorrQueue**: 用于排序任务的相关性目标
  - **DocQueue**: 用于检索任务的列表式nDCG目标

**训练目标**:
- 排序损失: $$\mathcal{L}_{CorrQ} = \alpha(1 - Pearson) + (1-\alpha)(1 - SoftSpearman)$$
- 检索损失: $$\mathcal{L}_{retr} = \mathcal{L}_{ndcg} + \lambda_h \mathcal{L}_{hinge} + \lambda_r \mathcal{L}_{mv}$$

## 理论基础

### 核心定理

**定理（表示偏差界）**: 在假设1-2和定义1-2下，有
$$
\|\mathbf{z} - \mathbf{z}^*\|_2 \leq \epsilon_1 + C\sqrt{2\epsilon_2}
$$
其中 $$C > 0$$ 是核有界常数。

**推论（下游稳定性）**: 对于局部Lipschitz的 $$f_{LLM}$$，有
$$
\|f_{LLM}(\mathbf{z}) - f_{LLM}(\mathbf{z}^*)\|_2 \leq L^{loc}(y; \delta)(\epsilon_1 + C\sqrt{2\epsilon_2})
$$

### 关键假设
1. **语义锚定假设**: 锚定表示与英语编码的翻译之间的不匹配有界
2. **翻译保真度假设**: 翻译器在KL散度下保持语义

### 实证验证
- 估计的Lipschitz常数: $$L^{(0.95)} \approx 0.034$$
- 估计的RKHS界: $$C \approx 0.6867$$
- 表示偏差在训练过程中持续收缩

## 实验结果

### 数据集
- **LazRetrieval（新发布）**: 覆盖7种东南亚和南亚语言（越南语、泰语、印尼语、马来语、乌尔都语、孟加拉语、菲律宾语）
  - LazRetrieval: 每语言10k样本
  - LazRetrieval-mega: 每语言1,000k样本
- **公开基准**: MLQARetrieval、BelebeleRetrieval、STS22、MGSM、X-CSQA

### 主要结果

#### 检索任务（LazRetrieval）
- Qwen3-Embedding-8B + LiRA-Large: 平均分 72.86 vs 基线 68.05 (+4.81)
- 在低资源语言上提升显著：巴基斯坦语 +6.40，越南语 +4.30

#### 公开检索基准
- Qwen3-Embedding-8B + LiRA: 平均分 81.35 vs 基线 79.57 (+1.78)
- STS22提升最大: 75.00 vs 71.64 (+3.36)

#### 数学推理（MGSM）
- Qwen3-8B + LiRA-Large: 平均准确率 71.1 vs 基线 69.4 (+1.7)

#### 阅读理解（X-CSQA）
- Qwen3-8B + LiRA-Large: 平均准确率 65.5 vs 基线 62.9 (+2.6)
- 在15/16种语言上表现更好

### 消融实验
| 组件 | nDCG@10 | Pearson | 准确率 |
|------|---------|---------|--------|
| LiRA完整版 | 77.71 | 75.00 | 71.1 |
| 移除LLM Critic | 71.29 | 72.19 | 68.9 |
| 移除Embeds Critic | 65.77 | 61.78 | 67.3 |
| 移除翻译 | 75.48 | 74.39 | 70.5 |
| 移除多语言编码器 | 75.59 | 72.43 | 69.5 |
| 移除FIFO队列 | 64.29 | 69.82 | - |

### 跨骨干网络鲁棒性
LiRA在多个代表性编码器上均能带来一致提升：
- GTE-Large、BGE-EN-1.5、E5-Mistral、Qwen3-Embedding-8B

## 主要贡献

1. **提出LiRA框架**: 即插即用的跨语言框架，将LLMs的强大英语能力迁移到中低资源语言
2. **建立理论基础**: 提供LiRA完整性和稳定性的严格保证
3. **发布新数据集**: LazRetrieval覆盖7种东南亚和南亚语言的电商检索数据
4. **广泛实验验证**: 在排序、检索和推理任务上达到新的最先进性能

## 技术亮点

### 理论创新
- 基于RKHS的表示学习理论框架
- 局部Lipschitz常数分析
- 信息论视角的双路径表示优势证明

### 工程创新
- 双层评估器（LLM Critic + Embedding Critic）
- FIFO缓冲区设计
- 安全负采样策略
- 灵活的pass@k配置

### 实用性
- 预算灵活的训练流水线
- 翻译可离线准备
- 支持从轻量MT到大型LLM的多种翻译器配置

## 局限性与未来工作

1. **评估偏差**: ARCA在评估时可能存在对特定模型家族的偏好
2. **数据覆盖**: 当前数据集主要覆盖东南亚和南亚语言
3. **计算成本**: 大规模配置（LiRA-Max）需要较多计算资源

## 总结

LiRA通过锚定表示和批判器引导的对齐机制，有效解决了低资源语言在LLMs中的表示漂移问题。理论分析提供了严格的稳定性保证，实验结果证明了框架在检索、排序和推理任务上的有效性。新发布的LazRetrieval数据集为该领域的研究提供了重要资源。
