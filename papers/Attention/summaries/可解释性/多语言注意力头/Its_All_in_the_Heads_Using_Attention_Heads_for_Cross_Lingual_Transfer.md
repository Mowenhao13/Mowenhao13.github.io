---
layout: page
title: It's All in the Heads: Using Attention Heads as a Baseline for Cross-Lingual Transfer in Commonsense Reasoning
tags:
  - attention-heads
  - cross-lingual
  - commonsense-reasoning
  - baseline
  - 2021
---

# It's All in the Heads: Using Attention Heads as a Baseline for Cross-Lingual Transfer in Commonsense Reasoning

**作者**: Alexey Tikhonov, Max Ryabinin  
**年份**: 2021  
**来源**: arXiv:2106.12066

## 核心贡献

本文提出了一种**极简的跨语言常识推理方法**——仅使用预训练跨语言模型的注意力头，无需任何微调即可在目标语言上实现零样本推理。

### 提出新范式
- **注意力头零样本推理**：证明预训练跨语言模型的注意力头本身即蕴含足够的跨语言推理能力
- **注意力头集成方法**：将多个注意力头的注意力权重聚合为推理信号，无需额外参数
- **注意力头作为跨语言迁移能力的上界基线**：证明简单的注意力头集成就能达到接近微调的性能

## 实验方法
- **模型**: XLM-RoBERTa, mBERT
- **任务**: 常识推理（Commonsense Reasoning）——COPA, Winograd Schema Challenge 等的跨语言版本
- **方法**: 注意力加权求和 → 聚合后的注意力模式作为推理信号
- **基线**: 随机基线、全模型微调、仅微调顶层

## 关键发现
- 预训练跨语言模型的注意力头已经包含有效的跨语言推理能力
- 仅使用注意力头（无需微调）即可在零样本跨语言推理中取得有竞争力的结果
- 不同语言中**注意力头的激活模式高度相似**，验证了语言无关表示的假设
- 浅层注意力头的跨语言迁移能力更强，深层头更任务特化
- 注意力头的性能可作为跨语言迁移能力的**下界基准**（无需额外训练）

## 数据局限
- 仅涵盖常识推理任务，其他 NLP 任务中的适用性需要验证
- 注意力聚合方法是手工设定的，非自适应

## 关联论文
- [Pay Better Attention to Attention: Head Selection in Multilingual Sequence Modeling](Pay_Better_Attention_to_Attention_Head_Selection_in_Multilingual_Sequence_Modeling.md) — 更系统的注意力头选择方法
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — 语言注意力头的发现与利用
- [Do Multilingual NMT Models Contain Language Pair Specific Attention Heads?](Do_Multilingual_NMT_Models_Contain_Language_Pair_Specific_Attention_Heads.md) — 语言对特异性注意力头的早期探索