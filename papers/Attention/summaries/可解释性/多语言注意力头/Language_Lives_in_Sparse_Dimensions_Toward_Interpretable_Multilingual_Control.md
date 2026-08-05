---
layout: page
title: "Language Lives in Sparse Dimensions: Toward Interpretable and Efficient Multilingual Control for Large Language Models"
tags:
  - multilingual
  - sparse-dimensions
  - steering
  - representation
  - 2025
---

# Language Lives in Sparse Dimensions: Toward Interpretable and Efficient Multilingual Control for Large Language Models

**作者**: Chengzhi Zhong, Fei Cheng, Qianying Liu, Yugo Murawaki, Chenhui Chu  
**年份**: 2025  
**来源**: arXiv:2510.07213

## 核心贡献

本文从一个关键观察出发——LLM 将多语言内容映射到英语对齐的表征空间再投射回目标语言——提出**语言信息存在于稀疏维度**的假设，并通过实验验证和稀疏化语言操控。

### 提出新范式/新指标
- **稀疏维度语言假说**：多语言 LLM 中语言信息仅占据隐空间的少部分维度（稀疏子空间），而非分散在整个表示空间
- **语言子空间识别与操控**：利用稀疏 PCA / 稀疏编码从模型表示中发现语言相关的稀疏维度方向
- **可解释多语言控制**：通过调整稀疏维度实现语言控制的精确操控，同时保持模型原有语义能力

## 实验方法
- **模型**: Llama-2-7B, Mistral-7B, Qwen-7B
- **方法**: 稀疏 PCA、L1 正则化方向发现、激活添加
- **数据**: 多语言平行语料（英/中/日/法/德/西等）
- **评估**: 语言准确率、perplexity、语义一致性

## 关键发现
- 语言信息确实集中在隐空间的**稀疏子空间**中——仅约 1-5% 的维度承载了语言信息
- 不同语言在该稀疏子空间中呈现**低秩结构**：可以用少量基向量表示
- 语言子空间主要在模型的**中间到深层**（约 40-80% 深度）占主导
- 基于稀疏方向的语言控制比全空间方向更精确：在相同语言准确率下语义保持度更好
- 稀疏语言方向与稀疏 SAE 特征方向存在对应关系，揭示了两种方法的互补性

## 数据局限
- 稀疏假设在超大模型（>70B）上是否成立尚未验证
- 实际应用中的维度选择仍需要一些人工调参

## 关联论文
- [Causal Language Control in Multilingual Transformers via Sparse Feature Steering](Causal_Language_Control_in_Multilingual_Transformers_via_Sparse_Feature_Steering.md) — SAE 特征语言控制
- [LangFIR: Discovering Sparse Language-Specific Features from Monolingual Data for Language Steering](LangFIR_Discovering_Sparse_Language_Specific_Features_from_Monolingual_Data_for_Language_Steering.md) — 稀疏语言特异性方向发现
- [Multilingual Steering by Design](Multilingual_Steering_by_Design_Multilingual_SAEs_and_Principled_Layer_Selection.md) — 多语言 SAE + 层选择