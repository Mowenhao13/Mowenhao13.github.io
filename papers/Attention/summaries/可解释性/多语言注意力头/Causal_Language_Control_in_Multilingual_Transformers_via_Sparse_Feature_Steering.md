---
layout: page
title: Causal Language Control in Multilingual Transformers via Sparse Feature Steering
tags:
  - mechanistic-interpretability
  - multilingual
  - SAE
  - feature-steering
  - language-control
  - 2025
---

# Causal Language Control in Multilingual Transformers via Sparse Feature Steering

**作者**: Cheng-Ting Chou, George Liu, Jessica Sun, Cole Blondin, Kevin Zhu  
**年份**: 2025  
**来源**: arXiv:2507.13410

## 核心贡献

本文利用**稀疏自编码器（SAE）** 从多语言 Transformer 的隐藏状态中提取可解释特征，并通过特征方向操控实现对 LLM 输出语言的因果控制。

### 提出新范式/新指标
- **SAE 特征语言控制**：首次系统性地将 SAE 特征用于零样本语言控制（无需语言提示或微调）
- **语言相关特征发现**：利用 SAE 自动发现与特定语言相关的隐空间特征方向
- **因果干预框架**：通过调整 SAE 特征的激活强度，实现对输出语言的定向引导

## 实验方法
- **模型**: Gemma-2B, Llama-3-8B, Qwen-2.5-7B
- **SAE 训练**: 在模型中间层隐藏状态上训练稀疏自编码器，提取单语义特征
- **数据**: 多语言平行语料（英/中/法/德/西/阿等）
- **评估**: 语言准确率（输出是否为目标语言）、语言混合率、BLEU/n-gram 语言识别
- **基线**: 语言提示（language prompt）、激活添加（activation addition）

## 关键发现
- SAE 能有效发现与语言相关的特征方向，这些方向集中在模型的**中间层和深层**
- 通过调整 SAE 特征的激活方向，可以**因果性地控制**模型输出语言，在零样本设置下有效
- SAE 特征控制优于简单的激活添加方法，能更精确地导向目标语言
- 不同语言对应的 SAE 特征在隐空间中呈现**可分离结构**
- 语言控制特征与语义特征在隐空间中是**正交的**，可以独立操控

## 数据局限
- 实验规模有限（最大 8B 参数模型）
- SAE 训练的计算成本较高
- 某些语言（尤其是低资源语言）的特征发现不够稳定

## 关联论文
- [Sparse Autoencoders Can Capture Language-Specific Concepts Across Diverse Languages](Sparse_Autoencoders_Can_Capture_Language_Specific_Concepts_Across_Diverse_Languages.md) — 验证 SAE 能捕获语言特有概念
- [Multilingual Steering by Design: Multilingual SAEs and Principled Layer Selection](Multilingual_Steering_by_Design_Multilingual_SAEs_and_Principled_Layer_Selection.md) — 更系统的多语言 SAE + 层选择方法
- [Language Lives in Sparse Dimensions](Language_Lives_in_Sparse_Dimensions_Toward_Interpretable_Multilingual_Control.md) — 通过稀疏维度实现多语言控制