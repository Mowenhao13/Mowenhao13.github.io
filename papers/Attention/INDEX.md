---
layout: page
title: Attention 论文索引
---

# Attention 论文索引

> 最后更新：2026-07-19
> 总计：28 篇 PDF（已下载）+ 24 篇 2025-2026 可解释性论文（已检索，待下载）

> **完整 L3 子主题索引**：[summaries/](summaries/INDEX.md) — 12 个子索引覆盖所有子方向

---

## 子主题快速导航

| 子主题 | 论文数 | L3 索引 |
|--------|-------|---------|
| 经典奠基 | 4 | [查看](summaries/经典奠基/INDEX.md) |
| 综述 | 2 | [查看](summaries/综述/INDEX.md) |
| Attention 头功能分析 | 6 | [查看](summaries/可解释性/Attention头功能分析/INDEX.md) |
| Transformer 电路发现 | 6 | [查看](summaries/可解释性/Transformer电路发现/INDEX.md) |
| SAE 应用 | 4 | [查看](summaries/可解释性/SAE应用/INDEX.md) |
| Induction Heads | 3 | [查看](summaries/可解释性/InductionHeads/INDEX.md) |
| Cross-Layer Transcoding | 5 | [查看](summaries/可解释性/CrossLayerTranscoding/INDEX.md) |
| 多 Head 冗余分析 | 2 | [查看](summaries/可解释性/多Head冗余分析/INDEX.md) |
| 可视化方法 | 3 | [查看](summaries/可解释性/可视化方法/INDEX.md) |
| **Activation Patching** 🆕 | **2** | **[查看](summaries/可解释性/ActivationPatching/INDEX.md)** |
| **多语言注意力头** 🆕 | **18** | **[查看](summaries/可解释性/多语言注意力头/INDEX.md)** |

---

## 已下载论文

### 经典奠基（4 篇）

| # | 论文 | 年份 | Venue | 核心贡献 |
|---|------|------|-------|---------|
| 01 | [Attention Is All You Need](Attention Is All You Need.md) | 2017 | NeurIPS | ⭐ 提出 Transformer 架构，纯注意力机制取代 RNN/CNN |
| 02 | [Neural Machine Translation by Jointly Learning to Align and Translate](Neural Machine Translation by Jointly Learning to Align and Translate.md) | 2014 | ICLR 2015 (oral) | ⭐ 首次提出注意力机制用于 NMT，解决固定向量瓶颈 |
| 03 | [Effective Approaches to Attention-based Neural Machine Translation](Effective Approaches to Attention-based Neural Machine Translation.md) | 2015 | EMNLP | 提出 global/local 注意力及多种 score function |
| 04 | [BERT: Pre-training of Deep Bidirectional Transformers](BERT: Pre-training of Deep Bidirectional Transformers.md) | 2018 | NAACL | ⭐ 双向 Transformer 预训练模型，开创预训练-微调范式 |

### 综述论文（2 篇）

| # | 论文 | 年份 | Venue | 核心贡献 |
|---|------|------|-------|---------|
| 05 | [A Survey of Transformers](A Survey of Transformers.md) | 2021 | arXiv | 📚 最全面的 Transformer 变体综述，三维度分类 X-former |
| 06 | [Efficient Transformers: A Survey](Efficient Transformers: A Survey.md) | 2020 | ACM Computing Surveys | 📚 系统梳理稀疏注意力/低秩近似/核方法等效率优化方案 |

### 可解释性（22 篇）

| # | 论文 | 年份 | Venue | 核心贡献 |
|---|------|------|-------|---------|
| 07 | [What Does BERT Look At? An Analysis of BERT's Attention](What Does BERT Look At? An Analysis of BERT's Attention.md) | 2019 | BlackBoxNLP | 开创性地分析 BERT 注意力语法对应关系 |
| 08 | [A Mathematical Framework for Transformer Circuits](A Mathematical Framework for Transformer Circuits.md) | 2021 | Anthropic | 建立 Transformer 内部注意力回路的数学分析框架 |
| 09 | [Does Localization Inform Editing](Does Localization Inform Editing.md) | 2023 | NeurIPS (Spotlight) | 发现因果追踪定位与模型编辑成功率无关，挑战 ROME/MEMIT 核心假设 |
| 10 | [Locate, Steer, and Improve Survey](Locate, Steer, and Improve Survey.md) | 2026 | arXiv | 📚 提出"Locate, Steer, Improve"三阶段可操作 MI 框架，综述 200+ 论文 |
| — | **多语言注意力头 🆕** | 2021-2026 | — | **18 篇论文已入库**，详见下方链接 |

### 多语言注意力头 🆕（18 篇，2024-2026: 12 篇）

已系统入库 18 篇论文（PDF + LaTeX 源码 + 摘要总结），覆盖 5 个子方向：

| 方向 | 论文数 | 代表性工作 |
|------|--------|-----------|
| 语言注意力头发现 | 4 | [Focusing on Language](Focusing on Language.md) (LAHIS, 2025) ⭐, [Do Multilingual LLMs have specialized language heads](Do Multilingual LLMs have specialized language heads.md) (2026) |
| 注意力头剪枝与干扰 | 3 | [Shapley Head Pruning](Shapley Head Pruning.md) (2022) ⭐, [On the Prunability of Attention Heads](On the Prunability of Attention Heads.md) (2021) |
| 检索头与转换头 | 2 | [Retrieval Head](Retrieval Head.md) (2024), [Retrieval-Transition Heads](Retrieval-Transition Heads.md) (2026) |
| SAE 特征与语言操控 | 5 | [Causal Language Control](Causal Language Control.md) (2025), [Multilingual Steering by Design](Multilingual Steering by Design.md) (2026) |
| 跨语言结构与表征 | 4 | [The Same But Different](The Same But Different.md) (2024), [RomanLens](RomanLens.md) (2025) |

👉 **[完整 L3 索引 →](summaries/可解释性/多语言注意力头/INDEX.md)**

---