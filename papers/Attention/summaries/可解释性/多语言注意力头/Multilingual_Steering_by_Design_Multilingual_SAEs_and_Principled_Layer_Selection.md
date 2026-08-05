---
layout: page
title: Multilingual Steering by Design: Multilingual Sparse Autoencoders and Principled Layer Selection
tags:
  - multilingual
  - SAE
  - steering
  - layer-selection
  - mechanism
  - 2026
---

# Multilingual Steering by Design: Multilingual Sparse Autoencoders and Principled Layer Selection

**作者**: Yusser Al Ghussin, Daniil Gurgurov, Tanja Baeumel, Josef van Genabith, Patrick Schramowski  
**年份**: 2026  
**来源**: arXiv:2605.23036

## 核心贡献

本文系统性地解决了多语言 SAE 语言控制中的两大问题：**多语言 SAE 训练**和**原理性层选择**，提出了一个完整的多语言激活操控框架。

### 提出新范式/新指标
- **多语言 SAE 训练协议**：在多种语言的混合语料上联合训练 SAE，确保模型覆盖所有目标语言的特征空间
- **原理性层选择方法**：基于层间特征统计量（特征密度、分离度、因果效应）而非启发式经验选择操控层
- **多语言 Steering 评估指标**：语言准确率 + 语义保持度 + 语言混合降低率的联合评估

## 实验方法
- **模型**: Llama-3-8B, Gemma-2-9B
- **SAE**: 在多语言混合语料上训练，覆盖 10+ 语言
- **数据**: 多语言 Wikipedia, Flores-200
- **基线**: 单语言 SAE steering、激活添加、语言提示
- **评估**: 语言准确率、语义保持度（BLEU）、特征分离度

## 关键发现
- 多语言联合训练 SAE 优于单语言独立训练 SAE 的拼接
- 操控层的选择对 steering 效果**至关重要**：中间层（约 50-70% 深度）效果最优
- 原理性层选择方法显著优于随机层选择或人工经验选择
- 多语言 SAE 特征中存在清晰的语言分类结构——特征可以按语言聚类
- 语言控制与语义控制可以**解耦**：在语言控制维度上调整不影响语义内容

## 数据局限
- 联合 SAE 训练在语言数量增加时可能出现容量瓶颈
- 部分低资源语言在联合 SAE 中的特征质量仍然不足

## 关联论文
- [Causal Language Control in Multilingual Transformers via Sparse Feature Steering](Causal_Language_Control_in_Multilingual_Transformers_via_Sparse_Feature_Steering.md) — SAE 特征语言控制的前驱工作
- [Sparse Autoencoders Can Capture Language-Specific Concepts Across Diverse Languages](Sparse_Autoencoders_Can_Capture_Language_Specific_Concepts_Across_Diverse_Languages.md) — 验证 SAE 的语言特异概念捕获能力
- [LangFIR: Discovering Sparse Language-Specific Features from Monolingual Data](LangFIR_Discovering_Sparse_Language_Specific_Features_from_Monolingual_Data_for_Language_Steering.md) — 单语言数据驱动的方法