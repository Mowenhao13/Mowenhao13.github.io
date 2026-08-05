---
layout: page
title: 交叉主题 子主题索引
---

# 交叉主题 子主题索引

> 最后更新：2026-07-07
> 总计：21 篇论文/报告 > 5 个子方向

> **主题说明**：跨越多语言安全与更广泛 LLM 安全研究的交叉主题，包括 CoT 推理链安全、注意力头安全机制、线性表示假说、认知驱动防御、攻击方法等方向。

---

## 子方向一览

| 子方向 | 论文数 | 涵盖内容 |
|--------|--------|---------|
| [CoT 安全](./交叉主题/CoT安全.md) | 7 | CoT 推理过程中的攻击、防御、评估与监控 |
| [注意力头安全](./交叉主题/注意力头安全.md) | 3 | 注意力头在 LLM 安全中的角色与机制 |
| [线性表示与安全](./交叉主题/线性表示与安全.md) | 4 | 线性表示假说视角下的安全机制分析 |
| [防御框架](./交叉主题/防御框架.md) | 3 | JBShield、Precise Shield 等通用防御系统 |
| [攻击方法](./交叉主题/攻击方法.md) | 1 | JULI 对数概率越狱 |
| [综述索引](./交叉主题/综述索引.md) | 2 | 防御与攻防论文汇总索引 |
| [多语言适应](./交叉主题/多语言适应.md) | 1 | 低资源语言的多语言鲁棒适应 |

> 注意：这些文件位于 `summaries/` 根目录，尚未整理到子目录中。上述链接指向 `交叉主题/` 目录下的文件（需手动创建）。当前直接查阅 `summaries/` 根目录下的对应 .md 文件。

---

## 论文一览

### CoT 安全（7 篇）

| 文件/论文 | 核心贡献 |
|----------|---------|
| [CoT_safety.md](CoT_safety.md.md) | CoT 与 AI Safety 交叉论文汇总 |
| [CoT_eval.md](CoT_eval.md.md) | 推理模型 CoT 安全性评估范式 |
| [CoT Not the chain](CoT Not the chain.md) | 约 80% 推理链隐藏安全风险 |
| [CoT_Monitorability_Summary](CoT_Monitorability_Summary.md) | 推理模型 CoT 可监控性 |
| [Proactive_Safety_Reasoning_Summary](Proactive_Safety_Reasoning_Summary.md) | 主动安全推理防御 |
| [SCoT_Linear_CoT_Summary](SCoT_Linear_CoT_Summary.md) | 安全思维链线性映射分析 |
| [Cognitive_Driven_Defense_Summary](Cognitive_Driven_Defense_Summary.md) | 元操作分析认知防御 → 相关 |

### 注意力头安全（3 篇）

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [Attention_Heads_Safety_Summary](Attention_Heads_Safety_Summary.md) | **ICLR** | 发现安全注意力头，开创 attention-level 安全分析 |
| [Safety Alignment Should Be Made More Than Just A Few Attention Heads_summary](Safety Alignment Should Be Made More Than Just A Few Attention Heads_summary.md) | - | RDSHA 识别安全注意力头并证明其局限性 |
| [Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary](Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary.md) | **AAAI** | 识别多语言 LLM 中的语言注意力头 |

### 线性表示与安全（4 篇）

| 文件 | 核心贡献 |
|------|---------|
| [Linear_Mappings_CoT_Safety_Summary](Linear_Mappings_CoT_Safety_Summary.md) | 等效线性映射理论对 CoT 安全的启发 |
| [CDD_Linear_CoT_Summary](CDD_Linear_CoT_Summary.md) | 认知驱动防御的线性结构基础 |
| [JBShield_Linear_CoT_Summary](JBShield_Linear_CoT_Summary.md) | 线性表示假说的 JBShield 分析 |
| [SCoT_Linear_CoT_Summary](SCoT_Linear_CoT_Summary.md) | 安全思维链线性映射（同时归入 CoT 安全） |

### 防御框架（3 篇）

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [JBShield_Summary](JBShield_Summary.md) | **USENIX Security** | 概念分析与操纵的防御框架 |
| [Precise Shield_ Explaining and Aligning VLLM Safety via Neuron-Level Guidance_experiments](Precise Shield_ Explaining and Aligning VLLM Safety via Neuron-Level Guidance_experiments.md) | - | VLLM 神经元级安全指导 |
| [Precise Shield_ Explaining and Aligning VLLM Safety via Neuron-Level Guidance_related_work](Precise Shield_ Explaining and Aligning VLLM Safety via Neuron-Level Guidance_related_work.md) | - | 多语言多模态安全相关工作 |

### 攻击方法（1 篇）

| 论文 | 核心贡献 |
|------|---------|
| [JULI_Jailbreak_LLMs_Summary](JULI_Jailbreak_LLMs_Summary.md) | BiasNet 对数概率越狱攻击 |

### 综述索引（2 篇）

| 文件 | 核心贡献 |
|------|---------|
| [defense_papers_summary](defense_papers_summary.md) | 下载的越狱防御论文总览 |
| [LLM_Jailbreak_Papers_Index](LLM_Jailbreak_Papers_Index.md) | 越狱攻防论文总结索引 |

### 其他（1 篇）

| 论文 | 核心贡献 |
|------|---------|
| [LLM_Reasoning_as_Trajectories_Step-Specific_Representation_Geometry_and_Correctness_Signals_summary](LLM_Reasoning_as_Trajectories_Step-Specific_Representation_Geometry_and_Correctness_Signals_summary.md) | ACL 2026，推理轨迹步骤特定表征几何 |
| [Toward_Robust_Multilingual_Adaptation_of_LLMs_for_Low-Resource_Languages_summary](Toward_Robust_Multilingual_Adaptation_of_LLMs_for_Low-Resource_Languages_summary.md) | 低资源语言鲁棒多语言适应 |

---

## 关联主题

- [../Alignment](../Alignment.md) → 安全对齐与注意力头机制交叉
- [../Guardrails](../Guardrails.md) → 护栏系统与防御框架互补
- [Attention](../../Attention/INDEX.md.md) → 注意力头安全分析的机制基础
- [MultiModal/VLM安全与对齐](../../MultiModal/summaries/VLM安全与对齐/INDEX.md.md) → 多模态安全对齐的补充