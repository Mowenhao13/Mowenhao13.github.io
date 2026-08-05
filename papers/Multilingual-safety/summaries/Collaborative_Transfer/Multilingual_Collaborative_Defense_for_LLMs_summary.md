---
layout: page
---

> **arXiv**: `2505.11835` | **年份**: 2025 | **Venue**: EMNLP 2025 Findings

## 核心贡献

提出 **多语言协作防御（Multilingual Collaborative Defense, MCD）**，一种基于连续软提示（soft prompt）优化的多语言LLM安全防御新范式。核心创新在于提出**旋转中心语言训练策略（Rotational Center-Language Strategy）**，通过多语言协作信号实现跨语言安全一致性。

三个主要优势：
1. 有效提升多语言安全防御性能
2. 保持强泛化能力，同时降低误拒绝率（false refusal）
3. 缓解训练语料不平衡导致的安全错位（safety misalignment）

## 方法

### MCD 框架架构

MCD包含两大核心组件：

#### 1. 多语言协作训练（Multilingual Collaborative Training, MCT）

采用**旋转中心语言策略**：每个训练epoch选择一种语言作为"中心语言"，其他语言作为"辅助语言"，提供跨语言上下文支持。

给定中心语言输入 $x$，辅助语言协作形成：
$$F(x; L \setminus \{\text{lang}_i\}) \to \hat{y}_{\text{aux}}$$

其中 $F$ 为LLM，$\hat{y}_{\text{aux}}$ 为辅助预测，需与中心语言输出对齐。

#### 2. 多语言协作优化（Multilingual Collaborative Optimization）

基于提示微调（Prompt Tuning）设置，冻结LLM参数，仅训练安全提示嵌入 $\theta \in \mathbb{R}^{n \times L}$。优化包含三部分：

- **单语优化**：
  - 拒绝损失（Refusal Loss）：$L_r(\theta) = -l\log\sigma(f_r(x_\theta) - f_r(x_0)) - (1-l)\log(1 - \sigma(f_r(x_\theta) - f_r(x_0)))$
  - 有害性损失（Harmfulness Loss）：$L_h(\theta) = -l\log\sigma(f_h(x_\theta) - f_h(x_0)) - (1-l)\log(1 - \sigma(f_h(x_\theta) - f_h(x_0)))$

- **多语言优化**：对齐中心语言与辅助语言的表示
  $$L_m(\theta) = \sum_{i=1}^n d(x_\theta^i, \frac{\sum_{j=1, j\neq i}^n x_\theta^j}{n-1})$$

- **正则化**：防止过拟合
  $$L_U(\theta) = \|U^\top(x_\theta - x_0)\|^2 / n$$

**总损失**：
$$L_{\text{total}} = L_h(\theta) + L_r(\theta) + \alpha L_m(\theta) + \beta L_U(\theta)$$

## 数据集与实验

### 数据集
- **MaliciousInstruct**（多语言版）：100条有害查询，涵盖5种语言
- **AdvBench**（多语言版）：520条有害指令，取前100条评估
- **MultiJail**：3,150条样本，用于评估零样本语言迁移能力
- **AlpacaEval 2.0**：评估通用性能保持

### 语言
英语（EN）、丹麦语（DA）、韩语（KO）、希腊语（EL）、爱尔兰语（GA）——覆盖不同语系和形态
零样本迁移测试语种：意大利语、阿拉伯语

### 基线模型
- **White-box LLMs**: openchat-3.5-1106, mistral-inst-v0.1, Qwen-2.5-7B-inst, Llama3-8B-Instruct, Qwen-2.5-14B-inst

### 对比方法
None, Default, PerplexityFilter (PPL), DRO (Directed Representation Optimization), MCD_mixture, MCD_parallel

### 评估指标
攻击成功率（ASR），由 Llama-Guard-2-8B 作为判官模型

## 关键发现

1. **显著优于基线**：MCD在openchat-3.5-1106上将平均ASR降至7.6%（DRO: 24.6%, PPL: 57.2%），在Qwen-2.5-7B-inst上仅2.0%
2. **低方差**：MCD在MaliciousInstruct上方差仅18.64，远低于DRO的268.64，表明跨语言安全一致性显著提高
3. **强跨语言泛化**：在未训练的意大利语和阿拉伯语上，MCD的ASR分别为16和14，而DRO为38，展示出零样本迁移能力
4. **不牺牲通用能力**：AlpacaEval评估显示MCD保持甚至提升了LLM的通用指令遵循能力
5. **消融研究**：多语言损失（$L_m$）对跨语言防御最关键（移除后ASR从4%升至15.6%）

## 关联论文

- [Evaluating_Mitigating_Linguistic_Discrimination_LDFighter_summary](Evaluating_Mitigating_Linguistic_Discrimination_LDFighter_summary.md)：多语言场景下的语言歧视评估与缓解
- [Who_Transfers_Safety_Cross_Lingual_Safety_Neurons_summary](Who_Transfers_Safety_Cross_Lingual_Safety_Neurons_summary.md)：跨语言共享安全神经元的识别与扩展
- [Toward_Robust_Multilingual_Adaptation_of_LLMs_for_Low-Resource_Languages_summary](Toward_Robust_Multilingual_Adaptation_of_LLMs_for_Low-Resource_Languages_summary.md)：面向低资源语言的多语言鲁棒适配
- [defense_papers_summary](defense_papers_summary.md)：LLM安全防御方法综述
- [LLM_Jailbreak_Papers_Index](LLM_Jailbreak_Papers_Index.md)：越狱攻击与防御论文索引
