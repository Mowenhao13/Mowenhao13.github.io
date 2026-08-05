---
layout: page
title: MultiModal 论文索引
---

# MultiModal 论文索引

> 最后更新：2026-07-07
> 总计：74 篇论文，9 个子主题
> 范围：多模态大语言模型（VLM/MM-LLM）的安全、幻觉、推理、视觉编码分析等

---

## 子主题一览

| 子主题 | 论文数 | L3 索引 | 涵盖方向 |
|--------|--------|---------|---------|
| [VLM幻觉评估](VLM幻觉评估.md) | 20 | [查看](summaries/VLM幻觉评估/INDEX.md) | 包括专门基准(7)、检测与缓解(7)、经典基准(6) |
| [VLM安全与对齐](VLM安全与对齐.md) | 14 | [查看](summaries/VLM安全与对齐/INDEX.md) | 红队攻击、安全对齐、防御机制 |
| [场景文字理解](场景文字理解.md) | 12 | [查看](summaries/场景文字理解/INDEX.md) | 场景文字识别、文档理解、OmniParser 系列 |
| [多模态视觉编码分析](多模态视觉编码分析.md) | 11 | [查看](summaries/多模态视觉编码分析/INDEX.md) | 视觉编码器冗余、语义层次、VLM 感知能力 |
| [多模态综述](多模态综述.md) | 7 | [查看](summaries/综述/INDEX.md) | MLLM/安全/具身AI/智能体可信综述 |
| [多模态推理](多模态推理.md) | 4 | [查看](summaries/多模态推理/INDEX.md) | 视觉推理、多模态 Cold-start、Policy Optimization |
| [多模态安全](多模态安全.md) | 2 | [查看](summaries/多模态安全/INDEX.md) | 跨模态攻击、频域对抗对齐 |
| [LLM理解与分析](LLM理解与分析.md) | 2 | [查看](summaries/LLM理解与分析/INDEX.md) | 推理流追踪、语言先验分析 |
| [视觉编码器可解释性](视觉编码器可解释性.md) | 2 | [查看](summaries/视觉编码器可解释性/INDEX.md) | Query-Key 交互、Transformer 可解释性 |

---

## 论文时间线

### 2026

| 论文 | 子主题 | 核心贡献 |
|------|--------|---------|
| Causal-HalBench (AAAI) | 幻觉-专门基准 | 因果干预探测 LVLM 物体幻觉 |
| DO-Bench | 幻觉-专门基准 | 可控诊断区分感知 vs 文本先验幻觉 |
| Can Vision-Language Models See Squares | 视觉编码分析 | 发现 VLM 视觉编码弱于文本元素定位 |
| HIVE | 视觉编码分析 | 层级交叉注意力预训练 |
| How Does Reasoning Flow (ICML) | LLM理解与分析 | FlowTracer: attention DAG token 级信用分配 |
| Understanding Language Prior of LVLMs (ICLR) | LLM理解与分析 | Chain-of-Embedding 发现 VIP 概念 |
| From Narrow to Panoramic Vision (ICLR) | 多模态推理 | VAS 指标发现多模态 cold-start 不提升注意力 |
| PaLMR (CVPR) | 多模态推理 | 对齐推理过程本身 |
| Reliable Thinking with Images | 多模态推理 | 揭示 Noisy Thinking 现象 |
| Visually-Guided Policy Optimization (ACL) | 多模态推理 | RL 中强化 VLM 视觉关注度 |
| Frequency-Domain Regularized Adversarial Alignment | 多模态安全 | 频域正则化迁移攻击 |
| Revealing Impact of Visual Text Style (ICMR) | 视觉编码分析 | 视觉文本风格对 LVLM 的影响 |
| Investigating Redundancy in MLLMs (ICML) | 视觉编码分析 | 多编码器冗余系统性研究 |

### 2025

| 论文 | 子主题 | 核心贡献 |
|------|--------|---------|
| Align is not Enough | VLM安全与对齐 | 跨模态交互安全风险，迭代多模态越狱 |
| Benign-to-Toxic Jailbreaking | VLM安全与对齐 | B2T 越狱新范式 |
| SafePTR | VLM安全与对齐 | token 级多模态越狱触发机制 |
| Understanding Safety Perception Distortion | VLM安全与对齐 | 安全感知失真 + ShiftDC 修复 |
| VLM-Guard | VLM安全与对齐 | 模态间隙推理时干预 |
| Enhancing Visual Reliance | 多模态安全 | 贝叶斯视角缓解幻觉 |
| SHALE (MM) | 幻觉-检测与缓解 | 可扩展细粒度幻觉评估 |
| DAVE | 视觉编码分析 | 文档理解专用视觉编码器 |
| Revisit What You See | 视觉编码分析 | 视觉 token 语义引导生成 |
| Text or Pixels | 视觉编码分析 | 长文本渲染 token 效率优势 |
| Leopard (NeurIPS) | 场景文字理解 | 首个富文本多图像 VLM |
| OmniParser V2 (TPAMI) | 场景文字理解 | 结构化点思维提示，布局分析 |
| When Semantics Mislead Vision (NeurIPS) | 场景文字理解 | LMM 语义幻觉定义与缓解 |

### 2024 及更早

| 论文 | 年份 | 子主题 | 核心贡献 |
|------|------|--------|---------|
| Jailbreak Attacks and Defenses Survey | 2024 | VLM安全与对齐 | 📚 四层级生命周期综述 |
| Visual Adversarial Examples Jailbreak Aligned LLMs | 2023 | VLM安全与对齐 | 奠基性越狱工作 |
| MM-SafetyBench | 2023 | VLM安全与对齐 | 首个大规模 LMM 安全评估基准 |
| POPE | 2023 | 幻觉-经典基准 | ⭐ 奠基性 LVLM 物体幻觉探测 |
| CHAIR | 2018 | 幻觉-经典基准 | ⭐ 物体幻觉定义与经典指标 |
| HallusionBench | 2023 | 幻觉-经典基准 | 语言幻觉 vs 视觉错觉诊断 |
| A Survey on Multimodal Large Language Models | 2023 | 综述 | 📚 MLLM 领域奠基综述 |
| Transformer Interpretability Beyond Attention Vis (NeurIPS) | 2021 | 视觉编码可解释性 | 相关性传播 Transformer 可解释性 |

---

## 子主题深度说明

### 📂 VLM幻觉评估（20 篇）

三个分支方向：
- **专门基准**（7 篇）：Causal-HalBench、DO-Bench、NOPE、ROPE、Reefknot、SHALE、THRONE
- **检测与缓解**（7 篇）：CausalMM、DAMRO、HALC、Hal-Eval、LogicCheckGPT、UNIHD、Woodpecker
- **经典基准**（6 篇）：AMBER、CHAIR、FaithScore、HallusionBench、MMHal-Bench、POPE

### 📂 VLM安全与对齐（14 篇）

涵盖攻击方法（IDEATOR、Visual Adversarial Examples、Align is not Enough）、评估基准（MM-SafetyBench、MMJ-Bench）、防御机制（Immune、SafePTR、VLM-Guard、ShiftDC）及综述。

---

## 关联主题

- [多模态幻觉](多模态幻觉.md) → 与 [Attention Is All You Need](Attention Is All You Need.md) 相关（Transformer 架构基础）
- [多模态安全](多模态安全.md) → 与 [Multilingual-safety](Multilingual-safety/) 主题关联（安全对齐的跨语言视角）
- [视觉编码器可解释性](视觉编码器可解释性.md) → 与 Attention 主题的 [What Does BERT Look At?](What Does BERT Look At?.md) 方法类似