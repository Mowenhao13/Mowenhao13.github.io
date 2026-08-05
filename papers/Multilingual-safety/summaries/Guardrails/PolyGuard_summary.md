---
layout: page
---

> **arXiv**: `2504.04377` | **年份**: 2025 | **Venue**: COLM 2025

## 核心贡献

PolyGuard 是面向 17 种语言的多语言安全检测模型，发布了目前最大的多语言安全训练语料库 PolyGuardMix（191 万个样本）和高质量多语言安全评估基准 PolyGuardPrompts（2.9 万个样本）。PolyGuard 支持多任务安全检测，可同时评估 prompt 有害性、response 有害性和 response 拒绝（refusal）三个维度，并支持 14 种风险类别的细粒度标注。

## 方法

**数据构建**：PolyGuardMix 结合两类数据源——(1) 对 WildGuardMix 使用 TowerInstruct-7B-v0.2 和 NLLB-3.3B 进行机器翻译的 147 万样本；(2) 来自 LMSys-Chat-1M 和 WildChat 的 43 万自然多语言对话样本。安全标注使用 Llama-Guard-3-8B 和 GPT-4o 作为判断器，由 Llama3.1-405B-Instruct 解决冲突。

**模型训练**：基于 Qwen2.5-7B-Instruct 和 Ministral-8B-Instruct-2410 进行 LoRA 微调，同时推出基于 Qwen2.5-0.5B 的轻量版本 PG Smol。模型采用统 one text-to-text 格式进行全面的安全评估。

**翻译验证**：人类评估者使用 DA+SQM 框架对翻译质量评分，平均得分为 81.15，翻译前后安全标签一致性达 Krippendorff's α = 0.94。

## 数据集与实验

**语言覆盖**：17 种语言——阿拉伯语、中文、捷克语、荷兰语、英语、法语、德语、印地语、泰语、意大利语、日语、韩语、波兰语、葡萄牙语、俄语、西班牙语、瑞典语。

**评估基准**：PolyGuardPrompts (ID)、RTP-LX、XSafety、MultiJail、OpenAI Moderation、Patronus AI 基准。

**对比基线**：Llama-Guard-2/3、Aegis 1.0 Defensive、MD Judge、DuoGuard、Perspective API、OpenAI Omni Moderation、Google Moderation。

**主要结果**：
- PG Qwen2.5 在 PolyGuardPrompts 上 Harmful Request F1 达 87.12，高于 Llama Guard 3 的 67.98
- 在多语言基准上平均 F1 领先所有基线 5.5%
- PG Smol（0.5B）在多语言安全任务上超越 DuoGuard（0.5B）
- 在代码切换（Code-Switching）数据上，PG Qwen2.5 的 F1 为 88.55/87.88，显著优于所有基线
- 结合自然数据（ITW）和翻译数据训练的模型更具鲁棒性

## 关键发现

PolyGuard 验证了多语言安全检测需要结合自然多语言数据和翻译数据的混合策略。机器翻译的数据规模大，而自然对话数据提供了更真实的分布。仅使用机器翻译数据可能让模型学习到翻译伪影，但去除低质量翻译并不必然提升性能。PolyGuard 在 Aya RedTeaming 人工数据集上表现良好，证明其并未过度拟合翻译文本的模式。

## 关联论文

[MrGuard](MrGuard.md)、[SelfDefend](SelfDefend.md)、[CREST](CREST.md)、[SEALGuard](SEALGuard.md)、[WildGuard](WildGuard.md)
