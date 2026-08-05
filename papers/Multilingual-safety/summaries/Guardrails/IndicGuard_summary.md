---
layout: page
---

> **arXiv**: `2606.22841` | **年份**: 2026 | **Venue**: arXiv

## 核心贡献

IndicGuard 专门针对印度语言（Indic Languages）的安全对齐问题，构建了涵盖 10 种主要印度语言的文化敏感安全数据集和多语言 guardrail 模型。核心贡献包括：(1) 发布大规模文化适应性安全数据集 IndicGuard，覆盖 Generic Unsafe Content、Culture-Adaptive、Jailbreaking 三个领域；(2) 基于 Gemma-3-4B-IT 微调的 4B 参数多语言安全 guardrail，支持实时内容审核；(3) 系统性消融实验量化每种数据类型（通用、文化适配、越狱）对整体性能的边际贡献；(4) 首次在印度语言上验证对安全但敏感输入的 0.00% 过度拒绝率（XSTest 基准）。

## 方法

**数据集构建**：
基于 Nemotron-Safety-Guard-Dataset-v3，提取 Culture-adaptive、Jailbreaking 和 Generic Unsafe 三类数据。通过 Google Translate API 将英文/印地语源数据翻译为 10 种印度语言，结合指数退避重试机制和并行处理。每个样本包含 prompt、response、prompt_label、response_label、violated_categories、tag（来源域）、language 等字段。

**模型训练**：
基于 Gemma-3-4B-IT 进行 4-bit NF4 量化 + LoRA 参数高效微调（$r=16, \alpha=32$），目标模块包括 attention 和 MLP 层。模型输出结构化 JSON：User Safety (safe/unsafe)、Response Safety (safe/unsafe)、Safety Categories（违规类别列表）。

**三种训练配置**：
1. Generic——仅使用通用安全数据
2. Gen+CA——通用 + 文化适应性数据
3. Gen+CA+JB——通用 + 文化适应性 + 越狱数据

## 数据集与实验

**语言覆盖**：10 种印度语言——印地语、孟加拉语、古吉拉特语、马拉地语、旁遮普语、泰米尔语、泰卢固语、卡纳达语、马拉雅拉姆语、乌尔都语（+ 英语）。

**数据规模**：每种语言约 33,416 条（训练 25,007 + 验证 1,245 + 测试 1,964）。

**零样本评估语言**：多格里语、孔卡尼语、梵语等 6 种低资源印度语言。

**对比基线**：CultureGuard（SOTA 多语言 guard 模型）。

**主要结果**：
- IndicGuard Gen+CA+JB 在所有评估语言上一致超越 CultureGuard
- 零样本跨语言迁移对 Dogri、Konkani、Sanskrit 等低资源语言表现良好
- XSTest 上过度拒绝率为 0.00%（不抑制正常对话）
- 文化适应性数据和越狱数据分别贡献显著的边际改进

## 关键发现

IndicGuard 证明文化敏感的安全对齐对于印度语言场景至关重要。通用安全分类法无法覆盖印度特有的社会文化敏感性（如种姓相关讨论、宗教情绪、社区规范）。三种训练配置的消融实验量化验证了每种数据的贡献，文化适应数据对印度语言安全检测的提升最为关键。零样本跨语言迁移实验证明了框架的结构鲁棒性。

## 关联论文

[CREST](CREST.md)、[PolyGuard](PolyGuard.md)、[SEALGuard](SEALGuard.md)、[MrGuard](MrGuard.md)
