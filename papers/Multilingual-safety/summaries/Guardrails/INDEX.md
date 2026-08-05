---
layout: page
title: Guardrails 子主题索引
---

# Guardrails 子主题索引

> 最后更新：2026-07-07
> 总计：9 篇论文

> **主题说明**：多语言安全护栏（Guardrails）模型，覆盖中文、印度语言、东南亚语言等低/中资源语言，从检测模型向推理型、模块化实时方向发展。

---

## 论文时间线

### 2026

| 论文 | 核心贡献 |
|------|---------|
| [CHILLGuard](CHILLGuard.md) | 中文 LLM 安全护栏，31 小类细粒度安全分类体系 |
| [IndicGuard](IndicGuard.md) | 10 种印度语言安全护栏 |
| [ML-Bench and Guard](ML-Bench and Guard.md) | 基于区域法规的多语言安全基准，连接法规与安全评估 |

### 2025

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [CREST](CREST.md) | - | 0.5B 参数支持 100 种语言的跨语言安全护栏 |
| [MrGuard](MrGuard.md) | - | 首个推理型多语言安全护栏，具备推理能力 |
| [PolyGuard](PolyGuard.md) | **COLM** | 17 种语言的安全检测模型 |
| [SEALGuard](SEALGuard.md) | - | 东南亚语言安全护栏 |
| [SentraGuard](SentraGuard.md) | - | 模块化实时多语言防御系统 |

### 2024

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [SelfDefend](SelfDefend.md) | - | Shadow LLM 并行检测防御框架 |

---

## 研究方向聚类

### 按语言覆盖
- **中文**：CHILLGuard
- **印度语言**：IndicGuard（10 种）
- **东南亚语言**：SEALGuard
- **100+ 语言**：CREST
- **17 种语言**：PolyGuard
- **多区域法规**：ML-Bench and Guard

### 按技术路线
- **检测模型**：PolyGuard, CHILLGuard, IndicGuard, SEALGuard, CREST
- **推理型**：MrGuard（引入推理能力）
- **模块化架构**：SentraGuard（实时、模块化）
- **并行防御**：SelfDefend（Shadow LLM）

---

## 关联主题

- [../Alignment](../Alignment.md) → 安全对齐提供训练基础，Guardrails 提供推理时保护
- [../Jailbreak_Detection](../Jailbreak_Detection.md) → 越狱检测与安全护栏互补（检测 vs 预防）
- [交叉主题](../INDEX.md.md#交叉主题-21-篇) → CoT 安全与注意力头安全可增强护栏