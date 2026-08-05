---
layout: page
tags: [arXiv_2026, survey, mechanistic_interpretability, activation_patching, model_steering]
---

> **核心贡献**: 提出"Locate, Steer, Improve"三阶段可操作 MI 框架，系统梳理 200+ 篇论文，将 MI 从被动观察科学转化为主动干预方法论。

## 领域研究摘要

机械可解释性（Mechanistic Interpretability, MI）旨在通过逆向工程揭示 LLM 内部决策机制。然而，此前综述多将 MI 视为"观察科学"——总结分析性洞见，缺乏可操作的干预框架。本文填补了这一空白，提出了一个完整的可操作 MI 流水线。

## 论文框架

### 1. 核心可解释对象（Core Interpretable Objects）
定义了 LLM 中可被解释和操作的五个核心对象：
- **Token Embedding**：输入的连续向量表示
- **Transformer Block & Residual Stream**：残差流作为信息传播主干道
- **Multi-Head Attention (MHA)**：QK 单元（控制关注位置）和 OV 单元（控制传递信息）
- **Feed-Forward Network (FFN)**：Neuron 作为原子单元，每条 neuron 对应一个 key-value 对
- **Sparse AutoEncoder (SAE) Feature**：通过 SAE 将多语义（polysemantic）表示解耦为单语义（monosemantic）特征

### 2. 定位方法（Localizing Methods）
| 方法                    | 描述                | 适用对象                                           |
| --------------------- | ----------------- | ---------------------------------------------- |
| Magnitude Analysis    | 基于激活值大小或权重范数排序    | Neurons, SAE features, Attention Heads, Layers |
| Causal Attribution    | 通过因果干预测量组件对输出的影响  | Layers, Neurons, Representations               |
| Gradient Detection    | 使用梯度/积分梯度定位关键组件   | Neurons, Layers, Parameters                    |
| Probing               | 训练线性分类器探测表示中编码的信息 | Representations, Residual Stream               |
| Vocabulary Projection | 将内部表示投影到词汇空间进行解读  | Residual Stream, Logits                        |
| Circuit Discovery     | 自动发现负责特定行为的完整子网络  | Multi-component circuits                       |

### 3. 干预方法（Steering Methods）
| 方法 | 描述 | 典型应用 |
|------|------|---------|
| Amplitude Manipulation | 放大或抑制特定组件的激活值 | 安全/偏见控制 |
| Targeted Optimization | 对特定组件进行针对性优化更新 | 知识编辑、模型合并 |
| Vector Arithmetic | 沿特定方向添加/减去表示向量 | 行为引导、概念编辑 |

### 4. 应用场景（Applications）
- **Improve Alignment**：安全与可靠性、公平性与偏见、角色与人格
- **Improve Capability**：多语言能力、知识管理、逻辑推理
- **Improve Efficiency**：高效训练、高效推理

## 方法论特色

1. **每个方法都有完整的数学形式化定义**，包括形式化表述、适用对象和适用范围
2. **提供具体的应用范式**（MI Application Paradigm），而非仅罗列论文
3. **系统标签化**：200+ 论文按定位/干预方法分类标注，便于研究者检索

## 未来方向

- 自动化电路发现
- 跨模型迁移的可解释性方法
- 多模态 MI 扩展
- 实时/在线可解释性干预
- 与强化学习/对齐训练的深度结合

## 关联论文

- [A Mathematical Framework for Transformer Circuits](A Mathematical Framework for Transformer Circuits.md)——Transformer 电路分析的数学基础
- [What Does BERT Look At? An Analysis of BERT's Attention](What Does BERT Look At? An Analysis of BERT's Attention.md)——注意力分析先驱
- [Does Localization Inform Editing](Does Localization Inform Editing.md)——定位与编辑关系的实证研究，本文的"Locate"阶段涉及此问题
- [Transformer Circuits](Transformer Circuits.md)——Transformer 内部机制研究