---
layout: page
title: "Shapley Head Pruning: Identifying and Removing Interference in Multilingual Transformers"
tags:
  - attention-heads
  - pruning
  - multilingual
  - interference
  - Shapley
  - 2022
---

# Shapley Head Pruning: Identifying and Removing Interference in Multilingual Transformers

**作者**: William Held, Diyi Yang  
**年份**: 2022  
**来源**: EACL 2023 (arXiv:2210.05709)

## 核心贡献

本文提出 **Shapley Head Pruning（SHP）** 方法，利用博弈论中的 Shapley 值量化每个注意力头对模型预测的贡献，精确识别导致多语言干扰（interference）的注意力头并通过剪枝移除。

### 提出新范式/新指标
- **基于 Shapley 值的注意力头归因方法**：将每个注意力头视为合作博弈中的玩家，计算其对特定语言任务的边际贡献
- **干扰注意力头（Interference Heads）概念**：对某些语言有益但对其他语言有害的注意力头
- **选择性剪枝框架**：在保持目标语言性能的同时，剪除对其他语言产生干扰的注意力头

## 实验方法
- **模型**: mBERT, XLM-T (XLM-R 的多语言变体)
- **数据集**: XNLI (自然语言推理), NER 标注数据集, 情感分析等多语言任务
- **基线方法**: 随机剪枝, 基于注意力权重大小剪枝, L1 正则化剪枝
- **评估指标**: 剪枝后各语言任务性能、干扰程度量化

## 关键发现
- 多语言模型中存在明确的"干扰头"——对某些语言有益但对其他语言有害的注意力头
- Shapley 值能有效识别对跨语言迁移有益（正贡献）和有害（负贡献）的注意力头
- 通过剪除干扰头，可以在**不损失目标语言性能**的情况下减少语言间的干扰
- 低资源语言受干扰头的影响更大，剪枝对低资源语言的性能提升更显著
- 不同语言对的干扰模式不同：语言相似度高时干扰较少，语言差异大时干扰较多

## 数据局限
- 实验限于 encoder-only 模型（mBERT/XLM-R），decoder-only LLM 中的干扰模式有待研究
- Shapley 值计算复杂度高，大规模模型中的高效计算是挑战

## 关联论文
- [Do Multilingual NMT Models Contain Language Pair Specific Attention Heads?](Do_Multilingual_NMT_Models_Contain_Language_Pair_Specific_Attention_Heads.md) — 早期探索语言对特异性注意力头的工作
- [On the Prunability of Attention Heads in Multilingual BERT](On_the_Prunability_of_Attention_Heads_in_Multilingual_BERT.md) — 并行工作中分析了 mBERT 注意力头的可剪枝性
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — 通过 steering 而非剪枝操控注意力头