---
layout: page
title: Cross-Layer Transcoding (CLT) — 论文索引
---

# Cross-Layer Transcoding (CLT) — 论文索引

> 最后更新：2026-07-21
> 总计：5 篇论文（均为 2025-2026 最新工作）

> **方向说明**：Cross-Layer Transcoders（CLT）作为新兴的可解释性工具，旨在替代/补充 SAE，通过跨层特征分解实现更有效的 Transformer 解释。

| 论文 | 年份 | Venue | arXiv ID | 核心贡献 | 总结 |
|------|------|-------|----------|---------|------|
| [Intrinsically Interpretable Attention via Sparse Post-Training](Intrinsically Interpretable Attention via Sparse Post-Training.md) | 2025 | - | 2512.05865 | 后训练稀疏化使 attention 可解释（仅保留 0.4% 边），利用 CLT 简化归因 | [📄](Intrinsically_Interpretable_Attention_via_Sparse_Post_Training_summary.md) |
| [Can Cross-Layer Transcoders Replace Vision Transformer Activations?](Can Cross-Layer Transcoders Replace Vision Transformer Activations?.md) | 2026 | - | 2604.13304 | 研究 CLT 作为替代 SAE 的更有效 ViT 可解释性工具 | [📄](Can_Cross-Layer_Transcoders_Replace_Vision_Transformer_Activations_summary.md) |
| [CLT-Forge: A Scalable Library for Cross-Layer Transcoders and Attribution Graphs](CLT-Forge: A Scalable Library for Cross-Layer Transcoders and Attribution Graphs.md) | 2026 | - | 2603.21014 | CLT-Forge 工具库，支持大规模跨层 transcoder 训练和归因图构建 | [📄](CLT-Forge_A_Scalable_Library_for_Cross-Layer_Transcoders_and_Attribution_Graphs_summary.md) |
| [Transcoders Trace Visual Grounding and Hallucinations in Vision-Language Models](Transcoders Trace Visual Grounding and Hallucinations in Vision-Language Models.md) | 2026 | - | 2605.22902 | 将 transcoder 应用于 VLM，追踪视觉接地和幻觉的电路 | [📄](Transcoders_Trace_Visual_Grounding_and_Hallucinations_in_Vision-Language_Models_summary.md) |
| [Prune, Interpret, Evaluate: A CLT-Native Framework for Efficient Circuit Discovery](Prune, Interpret, Evaluate: A CLT-Native Framework for Efficient Circuit Discovery.md) | 2026 | - | 2604.16889 | CLT 原生框架，将特征归因与 CLT 结合实现高效电路发现 | [📄](Prune_Interpret_Evaluate_A_CLT-Native_Framework_for_Efficient_Circuit_Discovery_summary.md) |

**研究方向聚类**：
- **CLT 基础**：Intrinsically Interpretable Attention → Can CLT Replace ViT
- **工具框架**：CLT-Forge → Prune, Interpret, Evaluate
- **应用拓展**：Transcoders Trace Visual Grounding（VLM 应用）

**关联**：← [返回 可解释性](../INDEX.md) | → [SAE 应用](../SAE应用/INDEX.md.md)（CLT 与 SAE 的技术路线竞争/补充）