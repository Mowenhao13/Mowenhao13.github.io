---
layout: page
---

## Phase 1 完成：Research Question Brief —— LLM 多语言注意力头

已完成研究问题精炼并写入本地 `phase1_scoping/research_question_brief.md`。

### 核心研究问题
> 在多语言 LLM 中，是否存在可辨识的语言特定注意力头和语言通用注意力头，它们如何通过不同的注意力模式分别支撑跨语言迁移和语言特异性处理，以及能否通过轻量级干预实现对模型多语言行为的可解释控制？

### 关键发现
- 2025-2026 年已有多篇高质量相关工作发表，包括 LAHIS、Retrieval-Transition Heads、Shapley Head Pruning、SAE Feature Steering 等
- 领域核心论文可从 arXiv 获取（已有 arXiv 链接），包括：
  - **Focusing on Language: Revealing and Exploiting Language Attention Heads in Multilingual LLMs** (arXiv:2511.07498)
  - **Do Multilingual LLMs have specialized language heads?** (arXiv:2602.08625)
  - **Bridging Latent Reasoning and Target-Language Generation via Retrieval-Transition Heads** (arXiv:2602.22453)
  - **Shapley Head Pruning: Identifying and Removing Interference in Multilingual Transformers** (EACL 2023, arXiv:2210.05709)
  - **The Same But Different: Structural Similarities and Differences in Multilingual Language Modeling** (arXiv:2410.09223)
  - **Causal Language Control in Multilingual Transformers via Sparse Feature Steering** (arXiv:2507.13410)
- 论文库已有的 **Attention** 主题覆盖了 attention head 功能分析和可解释性基础，**Latent_Space_Reasoning** 覆盖了跨语言推理，**Multilingual-safety** 覆盖了多语言安全性——本主题正好处于这三个已有主题的交叉点

### FINER 评分：4.8/5 ⭐

### 推荐的下一步（Phase 2 文献调研与下载）
建议按以下顺序推进：
1. 搜索并筛选约 12-15 篇核心论文（综合 arXiv + Semantic Scholar 结果）
2. 下载 PDF 和 LaTeX 源码
3. 生成论文摘要总结，按 `Attention/多语言注意力头` 分类归入论文库
4. 与已有相关论文打 wikilink 标签（特别是 Attention 主题的可解释性论文、Multilingual-safety 的多语言分析论文）