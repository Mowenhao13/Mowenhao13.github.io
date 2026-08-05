---
layout: page
title: Transformer 电路发现 — 论文索引
---

# Transformer 电路发现 — 论文索引

> 最后更新：2026-07-21
> 总计：6 篇论文（均为 2025-2026 最新工作，含 6 篇精读摘要）

| 论文 | 年份 | Venue | arXiv ID | 核心贡献 |
|------|------|-------|----------|---------|
| [Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework](Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework.md) | 2025 | NeurIPS MechInterp Workshop | 2510.03282 | 结合梯度归因与迭代剪枝的混合电路发现框架 |
| [Weight-sparse transformers have interpretable circuits](Weight-sparse transformers have interpretable circuits.md) | 2025 | - | 2511.13653 | 将大部分权重约束为零训练，电路自然更易于理解 |
| [An explainable transformer circuit for compositional generalization](An explainable transformer circuit for compositional generalization.md) | 2025 | - | 2502.15801 | 发现组合泛化的可解释电路：binding heads + structure heads |
| [Mechanistic Unveiling of Transformer Circuits: Self-Influence as a Key to Model Reasoning](Mechanistic Unveiling of Transformer Circuits: Self-Influence as a Key to Model Reasoning.md) | 2025 | - | 2502.09022 | 利用自影响（self-influence）揭示推理电路机制 |
| [Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models](Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models.md) | 2026 | - | 2601.12879 | 层次化归因图分解（HAGD），从十亿参数模型中提取稀疏电路 |
| [A circuit for predicting hierarchical structure in-context in Large Language Models](A circuit for predicting hierarchical structure in-context in Large Language Models.md) | 2025 | - | 2509.21534 | 发现 LLM 中预测上下文层级结构的专用电路 |

**研究方向聚类**：
- **发现框架**：Discovering Transformer Circuits → Hierarchical Sparse Circuit Extraction
- **稀疏诱导**：Weight-sparse transformers
- **特定电路**：compositional generalization → hierarchical structure → self-influence

**关联**：← [返回 可解释性](../INDEX.md) | → [SAE 应用](../SAE应用/INDEX.md.md)（电路发现与 SAE 互补）