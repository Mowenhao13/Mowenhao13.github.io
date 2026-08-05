---
layout: page
title: Sparse Autoencoders Can Capture Language-Specific Concepts Across Diverse Languages
tags:
  - multilingual
  - SAE
  - language-specific
  - concepts
  - 2025
---

# Sparse Autoencoders Can Capture Language-Specific Concepts Across Diverse Languages

**作者**: Lyzander Marciano Andrylie, Inaya Rahmanisa, Mahardika Krisna Ihsani, Alfan Farizki Wicaksono, Haryo Akbarianto Wibowo  
**年份**: 2025  
**来源**: arXiv:2507.11230

## 核心贡献

本文系统性地验证了**稀疏自编码器（SAE）** 能够在跨语言的模型表示中捕获语言特有的概念，为多语言 LLM 的可解释性提供了新的工具。

### 提出新范式
- **语言特有概念发现**：使用 SAE 从多语言 LLM 的表示中发现与特定语言相关的语义概念
- **跨语言特征对齐分析**：比较 SAE 在不同语言中激活的特征，分析特征的语言特异性分布

## 实验方法
- **模型**: Llama-3-8B (多语言版本)
- **SAE 训练**: 在多种语言（英/中/日/印尼/阿拉伯等）的语料上分别训练 SAE
- **分析方法**: 特征激活分析、特征消融实验、跨语言特征重叠度计算
- **数据集**: 多语言 Wikipedia 语料, Flores-101 平行语料

## 关键发现
- SAE 特征在不同语言间存在**显著差异**：部分特征在特定语言中高激活，在其它语言中几乎不激活
- 语言特有特征是**粒度更细**的语言信号，超越了简单的"语言 ID"表征
- 存在**跨语言共享特征**（如数学推理、语法结构），也存在**语言特有特征**（如特定语言的语用模式）
- 特征的语言特异性与模型**层深度相关**：浅层特征更跨语言，深层特征更语言特定
- SAE 特征可以用于**语言检测**——根据激活的特征分布判断输入语言

## 数据局限
- SAE 质量依赖于训练数据的覆盖度，低资源语言的 SAE 可能不够精确
- 主要分析 Llama-3-8B，模型规模变化时结论是否稳健有待验证

## 关联论文
- [Causal Language Control in Multilingual Transformers via Sparse Feature Steering](Causal_Language_Control_in_Multilingual_Transformers_via_Sparse_Feature_Steering.md) — 利用 SAE 特征控制语言输出
- [Multilingual Steering by Design: Multilingual SAEs and Principled Layer Selection](Multilingual_Steering_by_Design_Multilingual_SAEs_and_Principled_Layer_Selection.md) — 多语言 SAE + 层选择的系统方法
- [LangFIR: Discovering Sparse Language-Specific Features from Monolingual Data](LangFIR_Discovering_Sparse_Language_Specific_Features_from_Monolingual_Data_for_Language_Steering.md) — 从单语言数据发现语言特异特征