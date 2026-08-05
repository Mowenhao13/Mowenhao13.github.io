---
layout: page
title: VLM 安全与对齐 子主题索引
---

# VLM 安全与对齐 子主题索引

> 最后更新：2026-07-07
> 总计：14 篇论文

> **主题说明**：多模态大语言模型（VLM/MM-LLM）的安全与对齐研究，包括红队攻击方法、安全对齐防御机制、安全评估基准及综述。

---

## 论文时间线

### 2026

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| Unraveling Safety Alignment Degradation of VLLMs | - | 发现 VLLM 渐进式安全对齐退化 |
| The VLLM Safety Paradox | - | 揭示越狱攻击与防御的双重便利性不对称 |
| MMJ-Bench | - | 全面评估 VLM 越狱攻击与防御的基准 |

### 2025

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md) | - | 跨模态交互安全风险，迭代式多模态越狱 |
| [Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md) | - | B2T 越狱新范式，良性→有毒提示渐进转换 |
| [SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md) | - | Token 级多模态越狱触发机制与防御 |
| [Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) | - | 安全感知失真 + ShiftDC 修复方法 |
| [VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md) | - | 模态间隙推理时干预防御 |
| [IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md) | - | 红队测试框架与自动化越狱 |

### 2024 及更早

| 论文 | 年份 | Venue | 核心贡献 |
|------|------|-------|---------|
| [Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md) | 2023 | - | 奠基性视觉对抗越狱工作 |
| [MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md) | 2023 | - | 首个大规模 LMM 安全评估基准 |
| [Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md) | - | - | 多模态 LLM 越狱防御免疫机制 |

### 综述论文

| 论文 | 年份 | 核心贡献 |
|------|------|---------|
| [Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md) | 2024 | 四层级生命周期综述：攻击→评估→防御→缓解 |
| [Safety of Multimodal Large Language Models on Images and Text](Safety of Multimodal Large Language Models on Images and Text.md) | 2024 | MLLM 安全性全面综述，涵盖图像/文本双模态 |

---

## 研究方向聚类

### 攻击方法（5 篇）

Visual Adversarial Examples (2023) → IDEATOR → Align is not Enough → Benign-to-Toxic → MMJ-Bench

### 防御机制（5 篇）

SafePTR → VLM-Guard → ShiftDC → Immune → The VLLM Safety Paradox

### 评估基准（2 篇）

MM-SafetyBench → MMJ-Bench

---

## 关联主题

- [../多模态安全](../多模态安全.md) → 跨模态攻击与频域对抗对齐
- [Multilingual-safety](../../Multilingual-safety/INDEX.md.md) → 安全对齐的跨语言视角
- [../VLM幻觉评估](../VLM幻觉评估.md) → 安全与幻觉的高度相关性