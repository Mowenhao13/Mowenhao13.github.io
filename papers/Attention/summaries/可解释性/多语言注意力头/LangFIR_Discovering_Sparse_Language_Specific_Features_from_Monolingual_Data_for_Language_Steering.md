---
layout: page
title: LangFIR: Discovering Sparse Language-Specific Features from Monolingual Data for Language Steering
tags:
  - multilingual
  - language-specific
  - steering
  - SAE
  - features
  - 2026
---

# LangFIR: Discovering Sparse Language-Specific Features from Monolingual Data for Language Steering

**作者**: Sing Hieng Wong, Hassan Sajjad, A. B. Siddique  
**年份**: 2026  
**来源**: arXiv:2604.03532

## 核心贡献

本文提出 **LangFIR (Language-specific Feature Identification and Representation)** 方法，从**单语言数据**中发现稀疏的语言特异性特征方向，用于模型输出语言的轻量级操控。

### 提出新范式
- **单语言数据驱动**：不同于大多方法依赖多语言平行数据，LangFIR 仅需单语言语料即可发现语言特异性方向
- **梯度归因 + 稀疏筛选框架**：通过梯度分析识别对语言ID敏感的隐空间方向，再用稀疏性约束筛选出最纯净的语言特征
- **语言 Steering 应用**：在推理时向模型表示添加语言特征向量，控制输出语言

## 实验方法
- **模型**: Llama-2-7B, Qwen-7B, BLOOM-7.1B
- **数据**: 单语言 Wikipedia 语料，无需平行语料
- **方法**: 梯度归因 + 稀疏性约束 + 激活添加
- **评估**: 语言准确率、语言混合率、生成质量（perplexity）

## 关键发现
- 通过单语言数据即可发现语言特异性的隐空间方向，无需昂贵的多语言平行数据
- 语言特异性方向在表示空间中呈现**稀疏分布**——少量维度即可编码语言信息
- 不同语言的特征方向在隐空间中**近似正交**，支持同时对多种语言进行独立控制
- LangFIR 发现的方向比简单的均值激活添加（mean activation addition）更精准

## 数据局限
- 实验模型限于 7B 参数级别
- 仅验证了文本生成场景，对非自回归任务的适用性存疑

## 关联论文
- [Language Lives in Sparse Dimensions](Language_Lives_in_Sparse_Dimensions_Toward_Interpretable_Multilingual_Control.md) — 独立验证了语言信息存在于稀疏维度
- [Causal Language Control in Multilingual Transformers via Sparse Feature Steering](Causal_Language_Control_in_Multilingual_Transformers_via_Sparse_Feature_Steering.md) — SAE 特征语言控制
- [Multilingual Steering by Design](Multilingual_Steering_by_Design_Multilingual_SAEs_and_Principled_Layer_Selection.md) — 多语言 SAE + 系统层选择