---
layout: page
title: The Same But Different: Structural Similarities and Differences in Multilingual Language Modeling
tags:
  - multilingual
  - mechanistic-interpretability
  - structural-similarity
  - morphosyntax
  - 2024
---

# The Same But Different: Structural Similarities and Differences in Multilingual Language Modeling

**作者**: Ruochen Zhang, Qinan Yu, Matianyu Zang, Carsten Eickhoff, Ellie Pavlick  
**年份**: 2024  
**来源**: arXiv:2410.09223

## 核心贡献

本文从**机制可解释性**视角系统性地研究了多语言 LLM 内部结构与语言结构之间的对应关系，特别关注当两种语言共享相同形态句法过程时，模型是否使用共享的内部电路。

### 提出新范式/新指标
- **跨语言电路比较框架**：利用因果中介分析（Causal Mediation Analysis）比较不同语言中相同语言现象的处理电路
- **电路相似度指标（Circuit Similarity Score）**：量化不同语言间处理同一语法现象时使用的注意力头/MLP 子电路的重叠程度
- **语言结构对应假设检验**：首次系统检验 LLM 内部结构是否反映所处理语言的形态句法结构

## 实验方法
- **模型**: Llama-2-7B, Llama-3-8B, Mistral-7B
- **方法**: 激活 patching、因果中介分析、电路发现
- **语言现象**: 主谓一致、时态标记、格标记、冠词选择等形态句法现象
- **数据**: 构造的句法最小对（syntactic minimal pairs），覆盖英/德/法/西/中/日等

## 关键发现
- 当两种语言使用**相同类型的形态句法过程**（如主谓一致）时，模型使用共享的内部电路来处理它们
- 当两种语言使用**不同的形态句法过程**（如英语用语序、日语用格标记表示同一语法关系）时，模型使用不同的电路
- 语言对的相似度反映在注意力头激活模式的相似度上——语言越相似，内部电路越重叠
- 跨语言共享电路主要位于**中低层**（0-50% 深度），语言特异性处理发生在**深层**
- 电路的共享程度与语言的结构相似性（而非基因学亲缘关系）更相关

## 数据局限
- 分析限于 6-8 种语言，覆盖的形态句法现象有限
- 因果中介分析的计算量大，难以扩展至更大模型

## 关联论文
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — 从注意力头角度研究语言特异性
- [Do Multilingual LLMs have specialized language heads?](Do_Multilingual_LLMs_have_specialized_language_heads.md) — 语言特异性注意力头的验证
- [Shapley Head Pruning](Shapley_Head_Pruning_Identifying_and_Removing_Interference_in_Multilingual_Transformers.md) — 剪枝方法分析注意力头的语言贡献