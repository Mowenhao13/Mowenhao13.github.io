---
layout: page
title: Do Multilingual Neural Machine Translation Models Contain Language Pair Specific Attention Heads?
tags:
  - NMT
  - attention-heads
  - language-pair
  - multilingual
  - 2021
---

# Do Multilingual Neural Machine Translation Models Contain Language Pair Specific Attention Heads?

**作者**: Zae Myung Kim, Laurent Besacier, Vassilina Nikoulina, Didier Schwab  
**年份**: 2021  
**来源**: arXiv:2105.14940

## 核心贡献

本文是**最早**系统性地研究多语言 NMT 模型中是否存在语言对特异性（language-pair specific）注意力头的工作之一，为后续语言特异性注意力头的系列研究奠定了基础。

### 提出新范式
- **语言对特异性注意力头**概念：区分语言无关表示与语言特定表示
- **注意力头语言分配分析框架**：通过分析注意力头在不同语言对下的激活模式，判断其语言特异性程度
- **两种假设检验**：多语言模型是否将权重分配给不同语言（语言分区）vs 是否产生语言无关表示

## 实验方法
- **模型**: 多语言 NMT Transformer（基于 Transformer-base）
- **方法**: 注意力头激活模式聚类、head 归因分析、head 剪枝
- **数据集**: IWSLT、WMT 等多语言翻译基准
- **语言对**: 覆盖英-德、英-法、英-罗、英-阿等

## 关键发现
- 多语言 NMT 模型中确实存在语言对特异性注意力头
- 部分注意力头在所有语言下都活跃（**语言通用头**），部分仅对特定语言对响应（**语言对特异性头**）
- 语言对特异性头主要分布在**解码器**的深层
- 语言相似的对（如英-德、英-法）共享更多的注意力头
- 语言差异大的对（如英-阿）拥有更多语言对特异性头

## 数据局限
- 针对 NMT 模型而非通用 LLM，注意力头的功能可能有所不同
- 实验规模较小，模型参数量有限

## 关联论文
- [Do Multilingual LLMs have specialized language heads?](Do_Multilingual_LLMs_have_specialized_language_heads.md) — 将语言特异性注意力头的研究从 NMT 扩展到通用 LLM
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — LAHIS 方法
- [Shapley Head Pruning](Shapley_Head_Pruning_Identifying_and_Removing_Interference_in_Multilingual_Transformers.md) — 通过剪枝研究注意力头的语言贡献