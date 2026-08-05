---
layout: page
title: Pay Better Attention to Attention: Head Selection in Multilingual and Multi-Domain Sequence Modeling
tags:
  - multilingual
  - multi-domain
  - sequence-modeling
  - head-selection
  - 2021
---

# Pay Better Attention to Attention: Head Selection in Multilingual and Multi-Domain Sequence Modeling

**作者**: Hongyu Gong, Yun Tang, Juan Pino, Xian Li  
**年份**: 2021  
**来源**: arXiv:2106.10840

## 核心贡献

本文发现并量化了多语言/多领域序列建模中注意力头的重要性差异，提出了**注意力头剪枝/选择策略**以最大化正迁移（positive transfer）并最小化负迁移（negative transfer）。

### 提出新范式/新指标
- **注意力头重要性排名方法**：通过验证集性能变化为每层每头分配重要性分数
- **语言/领域自适应选择**：根据特定语言-领域组合选择或屏蔽注意力头
- **迁移效果量化**：将注意力头对正迁移和负迁移的贡献分别量化

## 实验方法
- **模型**: 多语言 Transformer 序列建模块（语音翻译）
- **任务**: 多语言语音翻译、多领域语音识别
- **方法**: 注意力头重要性评估 → 基于重要性的选择性剪枝
- **数据集**: CoVoST-2（多语言语音翻译）、LibriSpeech（英语领域适应）

## 关键发现
- 不同注意力头对不同语言和领域组合的**重要性差异显著**
- 移除对当前语言-领域组合不重要的注意力头可以**减少负迁移**，提升性能
- 注意力头的重要性在**相近语言**间高度相关，在差异大的语言间相关性低
- 选择性剪枝优于全局剪枝：针对特定语言-领域组合选择不同头集合
- 模型容量固定时，语言数越多，每个语言的"有效注意力头"越少——解释了多语言干扰现象

## 数据局限
- 聚焦于编码器-解码器语音模型，文本 LLM 中的适用性有待验证
- 重要性评估需要验证集，不完全是零成本的剪枝策略

## 关联论文
- [Shapley Head Pruning](Shapley_Head_Pruning_Identifying_and_Removing_Interference_in_Multilingual_Transformers.md) — 更通用的 Shapley 值注意力头重要性评估
- [On the Prunability of Attention Heads in Multilingual BERT](On_the_Prunability_of_Attention_Heads_in_Multilingual_BERT.md) — mBERT 注意力头可剪枝性分析
- [Do Multilingual NMT Models Contain Language Pair Specific Attention Heads?](Do_Multilingual_NMT_Models_Contain_Language_Pair_Specific_Attention_Heads.md) — NMT 中的语言对特异性注意力头