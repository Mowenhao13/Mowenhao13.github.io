---
layout: page
title: "CLAIM: Mitigating Multilingual Object Hallucination in Large Vision-Language Models with Cross-Lingual Attention Intervention"
tags:
  - multilingual
  - LVLM
  - hallucination
  - attention-intervention
  - cross-lingual
  - 2025
---

# CLAIM: Mitigating Multilingual Object Hallucination in Large Vision-Language Models with Cross-Lingual Attention Intervention

**作者**: Zekai Ye, Qiming Li, Xiaocheng Feng, Libo Qin, Yichong Huang  
**年份**: 2025  
**来源**: arXiv:2506.11073

## 核心贡献

本文关注大型视觉语言模型（LVLM）中的**多语言物体幻觉**问题——非英语查询比英语查询更容易产生与视觉输入不符的回答。提出 **CLAIM（Cross-Lingual Attention Intervention Mechanism）** 通过跨语言注意力干预来缓解该问题。

### 提出新范式
- **跨语言注意力干预机制**：无需预训练或微调，在推理时通过调整注意力模式缓解多语言幻觉
- **多语言幻觉的注意力归因**：将幻觉归因于视觉-语言注意力分布的语言偏置
- **语言无关注意力校准**：通过跨语言注意力对齐校正偏置的注意力分布

## 实验方法
- **模型**: LLaVA-1.5, Qwen-VL 等多语言 LVLM
- **数据**: 构造的多语言物体幻觉测试集（英/中/日/德/法等）
- **方法**: 注意力分析 → 检测语言偏置 → 跨语言注意力干预
- **基线**: 直接推理、语言提示增强、微调基线

## 关键发现
- 非英语查询中物体幻觉率显著高于英语查询——存在系统性的语言偏置
- 幻觉与注意力头对**视觉信息的关注不足**相关——非英语查询的视觉注意力权重更低
- 通过跨语言注意力干预（调整跨语言注意力分布），可以有效降低非英语查询的幻觉率
- CLAIM 不需要额外训练，在推理时即可生效

## 数据局限
- 仅涵盖 LVLM，纯文本 LLM 的多语言幻觉问题可能不同
- 注意力干预的副作用（对非幻觉任务的影响）分析不够深入

## 关联论文
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — 通过注意力操控实现多语言行为控制
- [Causal Language Control in Multilingual Transformers via Sparse Feature Steering](Causal_Language_Control_in_Multilingual_Transformers_via_Sparse_Feature_Steering.md) — SAE 特征语言控制