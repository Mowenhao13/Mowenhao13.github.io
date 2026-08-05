---
layout: page
title: "Indic-TunedLens: Interpreting Multilingual Models in Indian Languages"
tags:
  - multilingual
  - interpretability
  - indic-languages
  - tuned-lens
  - 2026
---

# Indic-TunedLens: Interpreting Multilingual Models in Indian Languages

**作者**: Mihir Panchal, Deeksha Varshney, Mamta, Asif Ekbal  
**年份**: 2026  
**来源**: arXiv:2602.15038

## 核心贡献

本文提出了 **Indic-TunedLens** 框架，专门为印地语、泰米尔语等印度语言定制的多语言 LLM 可解释性工具，扩展了 TunedLens 方法的语言覆盖范围。

### 提出新范式
- **面向非英语语言的可解释性框架**：大多数解释性工具面向英语，Indic-TunedLens 填补了印度语言的可解释性空白
- **跨语言理解透镜**：分析 LLM 如何在英语中心表示空间中处理印度语言
- **层间表示语言归因**：使用 TunedLens 方法分析各层表示的跨语言对齐程度

## 实验方法
- **模型**: Llama-3-8B, Gemma-7B（多语言版本）
- **方法**: TunedLens（训练探针层将隐藏状态映射回词汇空间）
- **数据**: 印度语言数据集（印地语、泰米尔语、泰卢固语、孟加拉语等）
- **评估**: 层间语言预测准确率、表示对齐度

## 关键发现
- 多语言 LLM 在处理印度语言时存在英语中心表征空间，中间层的表示对齐到英语
- 不同印度语言的表示对齐程度不同——与英语相近的语言更容易对齐
- 存在语言通用的表示层和语言特化的表示层
- Indic-TunedLens 可以有效揭示各层的语言处理模式

## 数据局限
- 仅覆盖 6 种印度语言
- TunedLens 方法的解释准确性受限于探针质量

## 关联论文
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — 语言注意力头的识别
- [RomanLens: The Role of Latent Romanization in Multilinguality in LLMs](RomanLens_The_Role_of_Latent_Romanization_in_Multilinguality_in_LLMs.md) — 隐式拉丁化的跨语言桥梁作用
- [The Same But Different: Structural Similarities and Differences in Multilingual Language Modeling](The_Same_But_Different_Structural_Similarities_in_Multilingual_Language_Modeling.md) — 跨语言电路相似性