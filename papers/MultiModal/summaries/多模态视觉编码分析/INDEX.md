---
layout: page
title: 多模态视觉编码分析 子主题索引
---

# 多模态视觉编码分析 子主题索引

> 最后更新：2026-07-07
> 总计：11 篇论文

> **主题说明**：多模态大模型中的视觉编码器分析，涵盖编码器冗余性研究、语义层级、感知能力、视觉-文本交互及专用编码器设计（如文档理解、生成统一编码等）。

---

## 论文时间线

### 2026

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md) | - | 发现 VLM 视觉编码弱于文本元素定位 |
| [HIVE Hierarchical Pre-Training of Vision Encoders with LLMs](HIVE Hierarchical Pre-Training of Vision Encoders with LLMs.md) | - | 层级交叉注意力预训练视觉编码器 |
| [Revealing Impact of Visual Text Style on LVLM Descriptions](Revealing Impact of Visual Text Style on LVLM Descriptions.md) | ICMR | 视觉文本样式对 LVLM 结构化描述的影响 |
| [Investigating Redundancy in MLLMs with Multiple Vision Encoders](Investigating Redundancy in MLLMs with Multiple Vision Encoders.md) | ICML | 多编码器冗余系统性研究 |

### 2025

| 论文 | Venue | 核心贡献 |
|------|-------|---------|
| [DAVE A VLM Vision Encoder for Document Understanding and Web Agents](DAVE A VLM Vision Encoder for Document Understanding and Web Agents.md) | - | 文档理解专用视觉编码器 |
| [Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md) | - | 视觉 token 语义引导生成 |
| [Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs](Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs.md) | - | 长文本渲染 token 效率优势分析 |
| [Emergent Visual-Semantic Hierarchies in Image-Text Representations](Emergent Visual-Semantic Hierarchies in Image-Text Representations.md) | - | 图像-文本表征中涌现的视觉-语义层级 |
| [Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation](Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation.md) | - | 解耦视觉编码实现统一理解和生成 |
| [Text Encoders Bottleneck Compositionality in Contrastive VLMs](Text Encoders Bottleneck Compositionality in Contrastive VLMs.md) | - | 文本编码器成为对比 VLM 组合性的瓶颈 |

### 2024 及更早

| 论文 | 年份 | 核心贡献 |
|------|------|---------|
| [Text as Images Can MLLMs Follow Printed Instructions in Pixels](Text as Images Can MLLMs Follow Printed Instructions in Pixels.md) | - | 将文本以像素形式输入 MLLM 的有效性研究 |

---

## 研究方向聚类

### 视觉编码器设计（4 篇）

HIVE → DAVE → Janus → Text as Images

### 冗余与效率（2 篇）

Investigating Redundancy → Text or Pixels

### 感知能力分析（3 篇）

Can VLM See Squares → Revisit What You See → Revealing Impact of Visual Text Style

### 表征分析（2 篇）

Emergent Visual-Semantic Hierarchies → Text Encoders Bottleneck

---

## 关联主题

- [../场景文字理解](../场景文字理解.md) → 文档/文字编码器设计（DAVE、Text or Pixels）
- [../视觉编码器可解释性](../视觉编码器可解释性.md) → 视觉 Transformer 内部机制分析
- [../VLM幻觉评估](../VLM幻觉评估.md) → 视觉编码质量直接影响幻觉水平