---
layout: page
title: Alignment 子主题索引
---

# Alignment 子主题索引

> 最后更新：2026-07-07
> 总计：7 篇论文

> **主题说明**：跨语言安全对齐，涵盖奖励建模、权重编辑、知识蒸馏三类技术路线。

---

## 论文时间线

### 2026

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [Align Once, Benefit Multilingually](Align Once, Benefit Multilingually.md) | **ICLR** | 多语言一致性损失 MLC，即插即用无需额外对齐训练 |
| [Bridging the Multilingual Safety Divide](Bridging the Multilingual Safety Divide.md) | **AAAI** | Global South 语言安全对齐综述/立场论文 |
| [Multilingual Safety Alignment via Self-Distillation](Multilingual Safety Alignment via Self-Distillation.md) | - | 无需响应数据的跨语言安全知识迁移 |
| [Multilingual Safety Alignment via Sparse Weight Editing](Multilingual Safety Alignment via Sparse Weight Editing.md) | - | 稀疏安全神经元定位与免训练对齐 |

### 2025

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [MPO Reward Gap Optimization](MPO Reward Gap Optimization.md) | **ACL** | 奖励差距优化实现跨语言对齐 |

### 2024

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [Cross-lingual Transfer of Reward Models](Cross-lingual Transfer of Reward Models.md) | - | 英语 RM 跨语言迁移强于本地 RM |
| [Homer Simpson Task Arithmetic](Homer Simpson Task Arithmetic.md) | **ACL** | 任务算术实现安全再对齐 |

---

## 研究方向聚类

### 奖励建模（2 篇）
- Cross-lingual Transfer of Reward Models — 英语 RM 有效迁移
- MPO — 奖励差距优化

### 权重编辑（2 篇）
- Sparse Weight Editing — 稀疏安全神经元
- Homer Simpson Task Arithmetic — 任务算术安全再对齐

### 知识迁移（2 篇）
- Self-Distillation — 无响应数据的跨语言迁移
- Align Once, Benefit Multilingually — MLC 一致性损失

### 立场综述（1 篇）
- Bridging the Multilingual Safety Divide — 关注 Global South 语言

---

## 关联主题

- [../Guardrails](../Guardrails.md) → 对齐提供训练时保护，Guardrails 提供推理时保护
- [../Collaborative_Transfer](../Collaborative_Transfer.md) → 安全迁移与协作防御并行
- [MultiModal/VLM安全与对齐](../../MultiModal/summaries/VLM安全与对齐/INDEX.md.md) → 跨语言与跨模态对齐的互补视角