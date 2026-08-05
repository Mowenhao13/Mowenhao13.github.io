---
layout: page
title: 多语言注意力头（Multilingual Attention Heads）
---

# 多语言注意力头（Multilingual Attention Heads）

## 主题概览

本子主题研究多语言 LLM 中注意力头的**语言特异性**问题：是否存在可辨识的语言特定注意力头（Language-Specific Attention Heads）和语言通用注意力头（Language-General Attention Heads），它们如何支撑跨语言迁移和语言特异性处理，以及如何通过轻量级干预（剪枝、掩蔽、操控）实现模型多语言行为的可解释控制。

## 核心问题
1. 多语言 LLM 中是否存在可辨识的**语言特异性注意力头**？
2. 语言通用头与语言特异头如何在模型中**分布**？
3. 能否通过**轻量级干预**（pruning / masking / steering）控制多语言行为？
4. 不同注意力头机制的**内部工作原理**是什么？

## 论文分类

### 📂 语言注意力头发现（Language Attention Head Discovery）
| 论文 | 年份 | 核心贡献 |
|------|------|---------|
| [Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs](Focusing_on_Language_Revealing_and_Exploiting_Language_Attention_Heads_in_Multilingual_LLMs.md) | 2025 | **LAHIS 方法**：首次系统识别语言注意力头（LAH），建立识别→分析→操控完整范式 |
| [Do_Multilingual_LLMs_have_specialized_language_heads](Do_Multilingual_LLMs_have_specialized_language_heads.md) | 2026 | 独立验证多语言 LLM 中存在语言特异性注意力头，提出三分法分类 |
| [Do_Multilingual_NMT_Models_Contain_Language_Pair_Specific_Attention_Heads](Do_Multilingual_NMT_Models_Contain_Language_Pair_Specific_Attention_Heads.md) | 2021 | **最早**研究 NMT 中语言对特异性注意力头的工作 |
| [Its_All_in_the_Heads_Using_Attention_Heads_for_Cross_Lingual_Transfer](Its_All_in_the_Heads_Using_Attention_Heads_for_Cross_Lingual_Transfer.md) | 2021 | 仅用注意力头实现零样本跨语言常识推理，验证跨语言迁移能力 |

### 📂 注意力头剪枝与干扰分析（Head Pruning & Interference）
| 论文 | 年份 | 核心贡献 |
|------|------|---------|
| [Shapley_Head_Pruning_Identifying_and_Removing_Interference_in_Multilingual_Transformers](Shapley_Head_Pruning_Identifying_and_Removing_Interference_in_Multilingual_Transformers.md) | 2022 | ⭐ **Shapley Head Pruning**：博弈论量化注意力头贡献，识别干扰头 |
| [On_the_Prunability_of_Attention_Heads_in_Multilingual_BERT](On_the_Prunability_of_Attention_Heads_in_Multilingual_BERT.md) | 2021 | 系统分析 mBERT 注意力头的可剪枝性和层重要性 |
| [Pay_Better_Attention_to_Attention_Head_Selection_in_Multilingual_Sequence_Modeling](Pay_Better_Attention_to_Attention_Head_Selection_in_Multilingual_Sequence_Modeling.md) | 2021 | 注意力头选择策略，最大化正迁移、最小化负迁移 |

### 📂 检索头与转换头（Retrieval & Transition Heads）
| 论文 | 年份 | 核心贡献 |
|------|------|---------|
| [Retrieval_Head_Mechanistically_Explains_Long_Context_Factuality](Retrieval_Head_Mechanistically_Explains_Long_Context_Factuality.md) | 2024 | 首次定义检索头（Retrieval Heads）概念 |
| [Bridging_Latent_Reasoning_and_Target_Language_Generation_via_Retrieval_Transition_Heads](Bridging_Latent_Reasoning_and_Target_Language_Generation_via_Retrieval_Transition_Heads.md) | 2026 | 发现检索-转换头（RTH），拓展检索头至多语言环境 ⚠️已撤回 |

### 📂 SAE 特征与语言操控（SAE Features & Language Steering）
| 论文 | 年份 | 核心贡献 |
|------|------|---------|
| [Causal_Language_Control_in_Multilingual_Transformers_via_Sparse_Feature_Steering](Causal_Language_Control_in_Multilingual_Transformers_via_Sparse_Feature_Steering.md) | 2025 | SAE 特征实现语言因果控制 |
| [Sparse_Autoencoders_Can_Capture_Language_Specific_Concepts_Across_Diverse_Languages](Sparse_Autoencoders_Can_Capture_Language_Specific_Concepts_Across_Diverse_Languages.md) | 2025 | 验证 SAE 捕获语言特有概念的能力 |
| [LangFIR_Discovering_Sparse_Language_Specific_Features_from_Monolingual_Data_for_Language_Steering](LangFIR_Discovering_Sparse_Language_Specific_Features_from_Monolingual_Data_for_Language_Steering.md) | 2026 | 从**单语言数据**发现语言特异性方向 |
| [Multilingual_Steering_by_Design_Multilingual_SAEs_and_Principled_Layer_Selection](Multilingual_Steering_by_Design_Multilingual_SAEs_and_Principled_Layer_Selection.md) | 2026 | 多语言联合 SAE + 原理性层选择 |
| [Language_Lives_in_Sparse_Dimensions_Toward_Interpretable_Multilingual_Control](Language_Lives_in_Sparse_Dimensions_Toward_Interpretable_Multilingual_Control.md) | 2025 | 稀疏维度假说：语言信息仅占隐空间 1-5% 维度 |

### 📂 跨语言结构与表征（Cross-Lingual Structure & Representation）
| 论文 | 年份 | 核心贡献 |
|------|------|---------|
| [The_Same_But_Different_Structural_Similarities_in_Multilingual_Language_Modeling](The_Same_But_Different_Structural_Similarities_in_Multilingual_Language_Modeling.md) | 2024 | 机制可解释性研究跨语言电路相似性 |
| [RomanLens_The_Role_of_Latent_Romanization_in_Multilinguality_in_LLMs](RomanLens_The_Role_of_Latent_Romanization_in_Multilinguality_in_LLMs.md) | 2025 | 发现"隐式拉丁化"作为跨语言桥梁 |
| [Getting_More_from_Less_LLMs_are_Good_Spontaneous_Multilingual_Learners](Getting_More_from_Less_LLMs_are_Good_Spontaneous_Multilingual_Learners.md) | 2024 | 发现 LLM 的**自发多语言对齐**现象 |
| [Indic_TunedLens_Interpreting_Multilingual_Models_in_Indian_Languages](Indic_TunedLens_Interpreting_Multilingual_Models_in_Indian_Languages.md) | 2026 | 面向印度语言的多语言解释性工具 |
| [CLAIM_Mitigating_Multilingual_Hallucination_with_Cross_Lingual_Attention_Intervention](CLAIM_Mitigating_Multilingual_Hallucination_with_Cross_Lingual_Attention_Intervention.md) | 2025 | 跨语言注意力干预缓解多语言幻觉 |

## 论文时间线（按年份倒序）

| 年份 | 论文数 | 代表性工作 |
|------|--------|-----------|
| 2026 | 6 | [Do_Multilingual_LLMs_have_specialized_language_heads](Do_Multilingual_LLMs_have_specialized_language_heads.md), [LangFIR](LangFIR.md), [Multilingual Steering by Design](Multilingual Steering by Design.md) |
| 2025 | 6 | [Focusing_on_Language](Focusing_on_Language.md) (LAHIS), [Causal Language Control](Causal Language Control.md), [Language Lives in Sparse Dimensions](Language Lives in Sparse Dimensions.md) |
| 2024 | 3 | [The Same But Different](The Same But Different.md), [Retrieval Head](Retrieval Head.md), [Getting More from Less](Getting More from Less.md) |
| 2022 | 1 | [Shapley Head Pruning](Shapley Head Pruning.md) ⭐ |
| 2021 | 4 | [Do Multilingual NMT Models](Do Multilingual NMT Models.md), [It's All in the Heads](It's All in the Heads.md), [On the Prunability](On the Prunability.md), [Pay Better Attention](Pay Better Attention.md) |

## 交叉链接

- **Latent_Space_Reasoning**: [Bridging_Latent_Reasoning_and_Target_Language_Generation_via_Retrieval_Transition_Heads](Bridging_Latent_Reasoning_and_Target_Language_Generation_via_Retrieval_Transition_Heads.md) 探讨跨语言推理中的注意力头角色
- **Multilingual-safety**: [CLAIM_Mitigating_Multilingual_Hallucination_with_Cross_Lingual_Attention_Intervention](CLAIM_Mitigating_Multilingual_Hallucination_with_Cross_Lingual_Attention_Intervention.md) 涉及多语言幻觉与安全问题
- **SAE 应用**: [Causal Language Control](Causal Language Control.md), [Sparse Autoencoders Can Capture Language-Specific Concepts](Sparse Autoencoders Can Capture Language-Specific Concepts.md), [Multilingual Steering by Design](Multilingual Steering by Design.md) 与 SAE 可解释性方法相通
- **Transformer 电路发现**: [The Same But Different](The Same But Different.md), [Retrieval Head](Retrieval Head.md) 与 Transformer 电路分析方法论互通