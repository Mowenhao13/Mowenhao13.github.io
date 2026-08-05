---
layout: page
title: "RomanLens: The Role Of Latent Romanization In Multilinguality In LLMs"
tags:
  - romanization
  - multilingual
  - latent-representation
  - bridging
  - 2025
---

# RomanLens: The Role Of Latent Romanization In Multilinguality In LLMs

**作者**: Alan Saji, Jaavid Aktar Husain, Thanmay Jayakumar, Raj Dabre, Anoop Kunchukuttan  
**年份**: 2025  
**来源**: arXiv:2502.07424

## 核心贡献

本文提出 **RomanLens** 框架，研究了在多语言 LLM 中一个重要的中间表征现象——**隐式拉丁化（Latent Romanization）**，即模型在处理非拉丁文字语言时是否隐式地先转换为拉丁字符表示再执行语义理解。

### 提出新范式/新指标
- **隐式拉丁化假设**：非拉丁文字在 LLM 内部可能先被转换为类似罗马化拉丁字符的表示，再进入语义处理
- **隐式罗马化信号检测**：利用 probing 和激活分析检测模型中间层是否存在罗马化表征的证据
- **注意力头语言桥接功能分析**：分析注意力头如何在罗马化表示和目标语言表示之间桥接

## 实验方法
- **模型**: Llama-2-7B, Llama-3-8B, Gemma-7B, BLOOM-7B
- **语言**: 非拉丁文字语言——印地语、泰米尔语、泰语、中文、日文、韩文、俄文、阿拉伯文、希伯来文等
- **方法**: 线性 probing（对隐藏状态做语言 ID 预测）、激活 patching、注意力模式分析、token 分解分析
- **评估指标**: 罗马化检测准确率、注意力头对拉丁/非拉丁输入的差异分析

## 关键发现
- LLM 在处理非拉丁文字时，会在中间层**隐式编码类似罗马化**的表征
- 这种隐式罗马化主要由模型**浅层到中层**（0-40% 深度）的注意力头完成
- 存在专门的注意力头在处理非拉丁文字时高激活，处理拉丁文字时低激活
- 隐式罗马化是 LLM 多语言能力的一个关键**中间桥梁**机制
- 不同语言的隐式罗马化程度不同：书写系统差异越大，罗马化信号越强

## 数据局限
- 未覆盖所有非拉丁文字系统（如阿姆哈拉语、格鲁吉亚语等）
- 对罗马化是"原因"还是"结果"的因果关系论证还不够充分

## 关联论文
- [The Same But Different: Structural Similarities and Differences in Multilingual Language Modeling](The_Same_But_Different_Structural_Similarities_in_Multilingual_Language_Modeling.md) — 跨语言电路相似性分析
- [Do Multilingual LLMs have specialized language heads?](Do_Multilingual_LLMs_have_specialized_language_heads.md) — 语言特异性注意力头验证
- [Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) — 语言注意力头的识别