---
layout: page
---

> **arXiv**: `2512.02711` | **年份**: 2025 | **Venue**: arXiv

## 核心贡献

CREST（Cross-lingual Efficient Safety Transfer）提出了一种参数高效的多语言安全分类模型，仅 0.5B 参数即可支持 100 种语言。核心贡献在于：(1) 基于 XLM-R 表示空间的聚类指导跨语言迁移——仅用 13 种高资源语言训练即可泛化到 100 种语言；(2) 系统分析了簇内和簇间从高资源到低资源语言的跨语言迁移效果；(3) 在 6 个安全基准上超越了同等规模的模型，并在部分基准上达到了与大模型（≥2.5B）竞争的性能。

## 方法

**语言聚类**：利用 XLM-RoBERTa 的多语言表示空间，将 100 种语言按其语义表征聚为 8 个簇。对每种语言，计算所有翻译句子的 mean pooling 嵌入作为语言级质心，使用 K-Means 聚类（$n_{cluster}=8$）。从每个簇中选择 1-2 种高资源语言作为训练语言。

**训练数据**：将 Aegis-AI-Content-Safety-Dataset-2.0 翻译到 13 种选定的高资源语言。翻译系统组合使用 GPT-4o、M2MBart-50、Helsinki-NLP Opus-MT 和 SarvamTranslate（用于印度语言）。

**模型架构**：基于 XLM-RoBERTa-Base（279M）和 XLM-RoBERTa-Large（560M）作为编码器，添加单层分类头进行二分类（safe/unsafe），全权重训练。

## 数据集与实验

**训练语言（13 种领域内语言）**：西班牙语、英语、德语、俄语、捷克语、芬兰语、印地语、泰米尔语、中文、越南语、阿拉伯语、斯瓦希里语、菲律宾语。

**评估语言（11 种领域外低资源语言）**：加利西亚语、冰岛语、南非荷兰语、斯洛文尼亚语、僧伽罗语、泰语、马拉地语、普什图语、爪哇语、豪萨语、格鲁吉亚语。

**评估基准**：Aegis-Content-Safety-2.0-Test、HarmBench、Redteam2k、JBB-Behaviors、JBB-Judge、StrongReject 的翻译版本。

**对比基线**：Aegis-Defensive (7B)、LlamaGuard3 (8B)、PG-Qwen (2.5B)、WalledGuard-C (0.5B)、DuoGuard-0.5B、PG-Qwen-Smol (0.5B)。

**主要结果**：
- CREST-Large (0.5B) 在多个基准上超越了 PG-Qwen-Smol (0.5B) 和 DuoGuard (0.5B)
- 在低资源语言上表现均衡，展现强大的零样本跨语言迁移能力
- 与 PG-Qwen (2.5B) 和 LlamaGuard3 (8B) 等大模型相比具有竞争力
- 参数仅 0.5B，适合边缘设备和离线部署

## 关键发现

CREST 证明通过聚类指导的跨语言迁移，只需在少量高资源语言上训练即可实现对 100 种语言的有效安全筛查。语言学相似性和表示空间接近性决定了跨语言迁移效果，低资源语言可以从同簇高资源语言中受益。轻量级 guardrail（0.5B）可以在保持性能的同时大幅降低部署成本，实现实时安全检测。

## 关联论文

[PolyGuard](PolyGuard.md)、[MrGuard](MrGuard.md)、[SEALGuard](SEALGuard.md)、[IndicGuard](IndicGuard.md)
