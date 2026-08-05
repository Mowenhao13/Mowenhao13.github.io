---
layout: page
title: Retrieval Head Mechanistically Explains Long-Context Factuality
tags:
  - retrieval-heads
  - long-context
  - factuality
  - mechanistic-interpretability
  - 2024
---

# Retrieval Head Mechanistically Explains Long-Context Factuality

**作者**: Wenhao Wu, Yizhong Wang, Guangxuan Xiao, Hao Peng, Yao Fu  
**年份**: 2024  
**来源**: arXiv:2404.15574

## 核心贡献

本文首次从机制可解释性角度解释了 Transformer 如何在长上下文中实现事实性检索，发现了专门负责检索的**检索头（Retrieval Heads）**。

### 提出新范式
- **检索头（Retrieval Heads）概念**：一类特殊的注意力头，负责从上下文的任意位置检索相关信息
- **检索头识别方法**：基于信息流分析的归因方法，检测注意力头是否从上下文中"提取"信息
- **检索头 → 事实性解释链条**：建立从注意力机制到长上下文事实性的因果解释

## 实验方法
- **模型**: Llama-2-7B/13B, Llama-3-8B, Mistral-7B, Phi-3 等多种模型家族
- **方法**: 激活 patching、注意力模式分析、head ablation
- **数据**: LongBench、Needle-in-a-Haystack、自构造长上下文 QA
- **评估**: 检索准确率、ablation 后的事实性下降

## 关键发现
- 几乎所有现代 Transformer LLM 中都存在检索头
- 检索头具有**跨任务和跨领域**的通用性——不同任务中使用相同的检索头集合
- 检索头主要分布在模型的**中间层**（约 30-60% 深度）
- 检索头的工作机制是：从上下文 token 位置检索信息 → 将信息传递给后续层做推理
- 消除这些检索头会显著降低长上下文事实性，验证了其因果作用

## 数据局限
- 主要分析英文，多语言场景下检索头的分布尚不清楚
- 检索头的精确定义和识别标准在不同工作中尚未统一

## 关联论文
- [Bridging Latent Reasoning and Target-Language Generation via Retrieval-Transition Heads](Bridging_Latent_Reasoning_and_Target_Language_Generation_via_Retrieval_Transition_Heads.md) — 将检索头概念扩展至多语言环境，发现 RTH
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — 语言注意力头的发现与利用