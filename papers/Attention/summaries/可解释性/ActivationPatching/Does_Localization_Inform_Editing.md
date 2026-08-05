---
layout: page
tags: [NeurIPS_2023, mechanistic_interpretability, activation_patching, model_editing, causal_tracing]
---

> **核心发现**: 因果追踪（Causal Tracing）定位的事实存储位置与模型编辑（Editing）的成功率几乎无关，这一发现颠覆了 ROME/MEMIT 等主流编辑方法的核心假设——即"应该编辑事实存储的位置"。

## 研究背景与问题

此前研究（如 ROME、MEMIT）通过 Causal Tracing 定位事实在 MLP 层中的存储位置，并在这些位置上编辑权重以修改模型知识。本文系统地检验了这一假设：**定位结果是否真的能指导编辑？**

## 方法

### 因果追踪（Causal Tracing）
通过噪声注入破坏 subject token 的嵌入表示，然后逐层恢复 MLP 表示，测量恢复后的概率提升：
$$
\text{Tracing Effect} = p_\theta(o_{\text{true}} | s_{\text{noise}}, r, v_{(t,\ell)}) - p_\theta(o_{\text{true}} | s_{\text{noise}}, r)
$$

### 编辑方法
- **ROME**: 单层 MLP 编辑（rank-one update）
- **MEMIT**: 多层 MLP 编辑
- **Constrained Finetuning**: 带 $\ell_\infty$ 约束的 Adam 优化

### 编辑问题变体
1. **Error Injection**（标准编辑）：注入新的事实 $(s,r,o_{\text{false}})$
2. **Tracing Reversal**: 将输出改为噪声输入对应的输出
3. **Fact Erasure**: 擦除已知事实 $(s,r,o_{\text{true}})$
4. **Fact Amplification**: 增强已知事实
5. **Fact Forcing**: 在噪声输入上强制输出正确事实（与 Causal Tracing 最接近）

## 实验设置

- **模型**: GPT-J（6B，主要实验）、GPT2-XL（鲁棒性验证）
- **数据集**: CounterFact（652 个事实）、ZSRE（鲁棒性验证）
- **编辑度量**: Rewrite Score、Paraphrase Score、Neighborhood Score、Overall Score
- **窗口大小**: Causal Tracing 窗口大小为 5（默认）

## 核心结果

### 1. 定位与编辑无关
- Causal Tracing 结果与编辑成功率之间的相关性近乎为零（$\rho = -0.13$ 在 layer 6）
- 编辑层选择解释 $R^2 = 94.7\%$ 的方差，而追踪效应仅贡献 $0.1\%$
- 该结论在多种编辑方法、模型、数据集和度量标准下均成立

### 2. 编辑问题变体分析
- 五种编辑问题变体中，**Fact Forcing** 显示出最强的定位-编辑关联
- 即使如此，追踪效应也仅能解释额外 $3.2\%$ 的方差
- 编辑层选择始终是更重要的预测因子

### 3. 鲁棒性验证
- 使用 Representation Zeroing 代替 Causal Tracing → 相同结论
- 使用 GPT2-XL 代替 GPT-J → 相同结论
- 使用 ZSRE 数据集代替 CounterFact → 相同结论
- 不同窗口大小（5 vs 10）、不同度量标准 → 相同结论

## 结论与启示

1. **Causal Tracing 回答了一个不同于编辑的问题**：它回答"信息在何处"，而编辑回答"何处干预最有效"
2. **编辑验证定位分析存在局限性**：如果定位和编辑回答不同的问题，那么编辑实验不能为定位结论提供额外证据
3. **信息在 Transformer 中逐步累积**，编辑可以在存储位置之外的其他层"覆盖"信息

## 关联论文

- [A Mathematical Framework for Transformer Circuits](A Mathematical Framework for Transformer Circuits.md)——Transformer 内部机制的数学框架
- [What Does BERT Look At? An Analysis of BERT's Attention](What Does BERT Look At? An Analysis of BERT's Attention.md)——注意力分析先驱
- 本文方法直接继承自 ROME (Meng et al., 2022) 和 MEMIT (Meng et al., 2023)