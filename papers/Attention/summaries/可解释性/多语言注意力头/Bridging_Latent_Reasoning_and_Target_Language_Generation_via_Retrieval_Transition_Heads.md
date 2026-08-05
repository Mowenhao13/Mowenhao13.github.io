---
layout: page
title: Bridging Latent Reasoning and Target-Language Generation via Retrieval-Transition Heads
tags:
  - retrieval-heads
  - cross-lingual
  - multilingual
  - chain-of-thought
  - 2026
---

# Bridging Latent Reasoning and Target-Language Generation via Retrieval-Transition Heads

**作者**: Shaswat Patel, Vishvesh Trivedi, Yue Han, Yihuai Hong, Eunsol Choi  
**年份**: 2026  
**来源**: arXiv:2602.22453  

⚠️ **请注意**：该论文已被作者 Yihuai Hong 撤回，原因是"许多陈述尚不清晰且缺乏充分论证"。以下摘要仅供了解研究方向参考。

## 核心贡献

本文在多语言 Transformer 中识别出一类新的注意力头——**检索-转换头（Retrieval-Transition Heads, RTH）**，负责从潜在推理空间向目标语言输出的转换过程。

### 提出新范式
- **RTH 概念**：区别于标准检索头（从上下文中检索信息），RTH 控制向特定目标语言输出的"转换"过程
- **注意力头功能三分法**：通用检索头（跨语言共享）+ 检索-转换头（目标语言输出门控）+ 其他功能性注意力头

## 实验方法
- **模型**: Qwen-2.5, Llama-3.1
- **数据集**: MMLU-ProX, MGSM, MLQA, XQuAD
- **方法**: masking RTH vs masking 标准检索头（RH），比较性能下降程度

## 关键发现
- 多语言模型中，检索头通常在**多种语言间共享**
- RTH 与标准检索头**功能不同**，对跨语言推理更关键
- 遮蔽 RTH 导致的性能下降**大于**遮蔽标准检索头
- RTH 对 Chain-of-Thought 推理的跨语言能力尤为重要

## 局限性
- 论文已被作者撤回，结论需谨慎参考
- 无可用 PDF/LaTeX

## 关联论文
- [Retrieval Head Mechanistically Explains Long-Context Factuality](Retrieval_Head_Mechanistically_Explains_Long_Context_Factuality.md) — 首次定义检索头概念
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — 语言注意力头的识别与操控
- [The Same But Different: Structural Similarities and Differences in Multilingual Language Modeling](The_Same_But_Different_Structural_Similarities_in_Multilingual_Language_Modeling.md) — 跨语言机制的相似性与差异性