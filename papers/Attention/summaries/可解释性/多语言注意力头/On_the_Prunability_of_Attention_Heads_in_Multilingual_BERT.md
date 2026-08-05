---
layout: page
title: On the Prunability of Attention Heads in Multilingual BERT
tags:
  - multilingual
  - BERT
  - pruning
  - attention-heads
  - robustness
  - 2021
---

# On the Prunability of Attention Heads in Multilingual BERT

**作者**: Aakriti Budhraja, Madhura Pande, Pratyush Kumar, Mitesh M. Khapra  
**年份**: 2021  
**来源**: arXiv:2109.12683

## 核心贡献

本文利用结构化剪枝（pruning）系统性地分析了 mBERT 中注意力头的鲁棒性和逐层重要性，并将 mBERT 与单语 BERT 的剪枝行为进行了对比。

### 提出新范式/新指标
- **跨模型剪枝对比方法**：直接将 mBERT 与 BERT 在相同剪枝策略下的性能退化模式进行对比
- **逐层注意力头重要性分析**：分析不同层级的注意力头在跨语言任务中的相对重要性
- **鲁棒性度量**：通过剪枝后的性能退化程度衡量注意力头对跨语言任务的重要性

## 实验方法
- **模型**: mBERT-base, BERT-base（作为对比）
- **任务**: GLUE（英文）, XNLI（多语言）
- **方法**: 注意力头剪枝（移除指定层中一定比例的注意力头）
- **评估**: 剪枝后的准确率下降、各层的相对重要性

## 关键发现
- mBERT 在 GLUE 任务上剪枝导致的准确率下降模式和 BERT **几乎相同** —— 说明多语言模型的注意力容量减少并不影响鲁棒性
- 不同层的注意力头对不同任务的重要性不同：
  - **浅层头**对语法相关的任务更重要（如 CoLA）
  - **深层头**对语义相关的任务更重要（如 MNLI, QQP）
- mBERT 中跨语言任务（XNLI）比单语言任务对剪枝**更鲁棒**
- 这表明 mBERT 的跨语言表示存在**冗余性** —— 部分注意力头可能是语言特异的，其他头可以补偿

## 数据局限
- 仅分析 mBERT，不包含更大或更新的多语言模型
- 剪枝是结构化的（固定剪枝比例），未考虑任务级剪枝

## 关联论文
- [Shapley Head Pruning](Shapley_Head_Pruning_Identifying_and_Removing_Interference_in_Multilingual_Transformers.md) — 更精细的 Shapley 值剪枝方法
- [Pay Better Attention to Attention: Head Selection in Multilingual Sequence Modeling](Pay_Better_Attention_to_Attention_Head_Selection_in_Multilingual_Sequence_Modeling.md) — 注意力头选择方法
- [Do Multilingual NMT Models Contain Language Pair Specific Attention Heads?](Do_Multilingual_NMT_Models_Contain_Language_Pair_Specific_Attention_Heads.md) — 语言对特异性注意力头