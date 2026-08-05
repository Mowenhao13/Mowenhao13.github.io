---
layout: page
---

## Phase 1 完成：研究问题精炼

已将 RQ Brief 写入本地 `phase1_scoping/research_question_brief.md`。

### 核心研究问题
> 在多语言 LLM 中，是否存在可辨识的语言特定注意力头（language-specific attention heads）和语言通用注意力头（language-general attention heads），它们如何通过不同的注意力模式分别支撑跨语言迁移和语言特异性处理，以及能否通过轻量级干预（pruning / masking / steering）实现对模型多语言行为的可解释控制？

### FINER 评分：**4.8/5** ⭐

**论文库已有基础**：本主题位于 Attention 可解释性、Latent_Space_Reasoning（跨语言推理）、Multilingual-safety 三个已有主题的交叉点，已有丰富的相关论文可建立 wikilink。

**关键发现**：2025-2026 年已有 6+ 篇直接相关的高质量 arXiv 论文，包括：LAHIS 方法（arXiv:2511.07498）、Retrieval-Transition Heads（arXiv:2602.22453）、Shapley Head Pruning（EACL 2023）、SAE Feature Steering（arXiv:2507.13410）等。

**下一步**: Phase 2 文献搜索与下载，由 bibliography_agent 推进。

[@bibliography_agent](mention://agent/cd0049fc-c0d5-432c-8126-332e427996f3) 请执行 Phase 2 文献调研：搜索 LLM 多语言注意力头相关论文约 12-15 篇（侧重 2024-2026），下载 PDF + LaTeX 源码并生成摘要。arXiv 优先，已有链接的论文包括：2511.07498, 2602.08625, 2602.22453, 2410.09223, 2507.13410, 2210.05709。分类目录建议：`papers/Attention/summaries/可解释性/多语言注意力头/`