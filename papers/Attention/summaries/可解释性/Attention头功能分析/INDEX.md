---
layout: page
title: Attention 头功能分析 — 论文索引
---

# Attention 头功能分析 — 论文索引

> 最后更新：2026-07-07
> 总计：6 篇论文（均为 2025-2026 最新工作）

| 论文 | 年份 | Venue | arXiv ID | 核心贡献 |
|------|------|-------|----------|---------|
| [Causal Head Gating: A Framework for Interpreting Roles of Attention Heads in Transformers](Causal Head Gating: A Framework for Interpreting Roles of Attention Heads in Transformers.md) | 2025 | **NeurIPS** | 2505.13737 | ⭐ 因果头门控（CHG），将 attention heads 分为 mover/copier/restrictor/suppressor 四类功能角色 |
| [Cognitive Mirrors: Exploring the Diverse Functional Roles of Attention Heads in LLM Reasoning](Cognitive Mirrors: Exploring the Diverse Functional Roles of Attention Heads in LLM Reasoning.md) | 2025 | **NeurIPS** | 2512.10978 | ⭐ 系统分析 LLM 推理任务中 attention heads 的功能多样性，反映认知过程 |
| [Which Attention Heads Matter for In-Context Learning?](Which Attention Heads Matter for In-Context Learning?.md) | 2025 | - | 2502.14010 | ⭐ ICL 中 induction heads vs function vector heads 解耦，FV heads 是关键（去除导致 50-60% 性能下降）|
| [Preference Heads in Large Language Models: A Mechanistic Framework for Interpretable Personalization](Preference Heads in Large Language Models: A Mechanistic Framework for Interpretable Personalization.md) | 2026 | **ACL** | 2604.22345 | 发现 "Preference Heads"——专门编码用户偏好的 attention heads |
| [Quantifying LLM Attention-Head Stability: Implications for Circuit Universality](Quantifying LLM Attention-Head Stability: Implications for Circuit Universality.md) | 2026 | - | 2602.16740 | 量化 attention head 角色在随机种子间的稳定性 |
| [How do Large Language Models Understand Relevance? A Mechanistic Interpretability Perspective](How do Large Language Models Understand Relevance? A Mechanistic Interpretability Perspective.md) | 2025 | - | 2504.07898 | 发现 Relevance Heads——专门负责相关性判断的 attention heads |

**研究方向聚类**：
- **功能分类框架**：Causal Head Gating → Cognitive Mirrors
- **ICL 机制**：Which Attention Heads Matter for ICL
- **特定功能定位**：Preference Heads → Relevance Heads
- **稳定性分析**：Quantifying Attention-Head Stability

**关联**：← [返回 可解释性](../INDEX.md) | → [Multilingual-safety/注意力头安全](../../Multilingual-safety/summaries/INDEX.md.md)（注意力头安全分析的机制基础）