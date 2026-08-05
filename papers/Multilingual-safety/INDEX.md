---
layout: page
title: Multilingual-safety 论文索引
---

# Multilingual-safety 论文索引

> 最后更新：2026-07-18
> 总计：48 篇论文（26 篇分类整理 + 21 篇交叉主题 + 1 篇实验复现）
> 范围：多语言大模型安全对齐、守卫、越狱检测、协作防御、多语言推理特征分析、跨语言概念表示

---

## 子主题一览

| 子主题 | 论文数 | L3 索引 | 涵盖方向 |
|--------|--------|---------|---------|
| [Guardrails](Guardrails.md) | 9 | [查看](summaries/Guardrails/INDEX.md) | 多语言安全护栏/检测模型（CHILLGuard、CREST、PolyGuard 等） |
| [Alignment](Alignment.md) | 7 | [查看](summaries/Alignment/INDEX.md) | 跨语言安全对齐（奖励建模、权重编辑、知识蒸馏） |
| [Jailbreak_Detection](Jailbreak_Detection.md) | 4 | [查看](summaries/Jailbreak_Detection/INDEX.md) | 跨语言越狱检测（语义码本、多语言间接注入） |
| [Collaborative_Transfer](Collaborative_Transfer.md) | 3 | [查看](summaries/Collaborative_Transfer/INDEX.md) | 多语言协作防御与安全迁移 |
| [Detection_Moderation](Detection_Moderation.md) | 1 | [查看](summaries/Detection_Moderation/INDEX.md) | 多语言生成文本检测 |
| [Latent_Space_Reasoning](Latent_Space_Reasoning/) | 1 | [查看](summaries/Latent_Space_Reasoning/INDEX.md) | 多语言推理链分解与特征分析 |
| [Mechanistic_Interpretability](Mechanistic_Interpretability.md) | 1 | [实验](experiments/Separating_Tongue_from_Thought/) | 跨语言概念表示的激活 patching 分析 |
| [交叉主题](交叉主题.md)（顶层） | 21 | [查看](summaries/INDEX.md) | CoT 安全、注意力头安全、线性表示、认知防御等 |

另见 `report/` 目录下的 [2025-2026_Multilingual_Defense_Evolution](2025-2026_Multilingual_Defense_Evolution.md) 防御技术演变报告。

---

## 论文时间线

### 2026

| 论文 | 子主题 | Venue | 核心贡献 |
|------|--------|-------|---------|
| What Makes Good Multilingual Reasoning? | Latent_Space_Reasoning | - | 系统性定义16个可测量推理特征，分解多语言推理链并揭示英语特征跨语言迁移的局限性 |
| Align Once, Benefit Multilingually | Alignment | **ICLR** | 多语言一致性损失 MLC，即插即用 |
| Bridging the Multilingual Safety Divide | Alignment | **AAAI** | Global South 语言安全对齐综述/立场论文 |
| Multilingual Safety Alignment via Self-Distillation | Alignment | - | 无需响应数据的跨语言安全迁移 |
| Multilingual Safety Alignment via Sparse Weight Editing | Alignment | - | 稀疏安全神经元免训练对齐 |
| CHILLGuard | Guardrails | - | 中文 LLM 安全护栏，31 小类细粒度 |
| IndicGuard | Guardrails | - | 10 种 Indic 语言安全护栏 |
| ML-Bench and Guard | Guardrails | - | 基于区域法规的多语言安全基准 |
| Cross-Lingual Jailbreak Detection via Semantic Codebooks | Jailbreak_Detection | - | 无需训练的跨语言越狱检测 |
| MIPIAD | Jailbreak_Detection | - | 多语言间接提示注入攻击防御 |
| One Jailbreak, Many Tongues | Jailbreak_Detection | - | 学习语言无关的越狱意图表示 |
| Who Transfers Safety (SS-Neurons) | Collaborative_Transfer | - | 发现跨语言共享安全神经元 |
| DetectRL-X | Detection_Moderation | - | 最大规模多语言生成文本检测基准（346万样本） |
| CoT is Not the Chain of Truth | 交叉 | - | 约 80% 推理链隐藏安全风险 |
| Precise Shield | 交叉 | - | 神经元级 VLLM 安全指导框架 |
| Toward Robust Multilingual Adaptation | 交叉 | - | 低资源语言的多语言适应 |

### 2025

| 论文 | 子主题 | Venue | 核心贡献 |
|------|--------|-------|---------|
| MPO Reward Gap Optimization | Alignment | **ACL** | 奖励差距优化实现跨语言对齐 |
| CREST | Guardrails | - | 0.5B 参数支持 100 种语言跨语言护栏 |
| MrGuard | Guardrails | - | 首个推理型多语言安全护栏 |
| PolyGuard | Guardrails | **COLM** | 17 种语言安全检测模型 |
| SEALGuard | Guardrails | - | 东南亚语言安全护栏 |
| SentraGuard | Guardrails | - | 模块化实时多语言防御 |
| LDFighter | Collaborative_Transfer | **IJCAI** | 基于相似性投票的轻量级安全与质量增强 |
| Multilingual Collaborative Defense | Collaborative_Transfer | **EMNLP** | 旋转中心语言策略协作防御 |
| Response-Based Knowledge Distillation | Jailbreak_Detection | NeurIPS Workshop | 知识蒸馏系统性降低安全对齐 |
| JBShield | 交叉 | **USENIX Security** | 概念分析与操纵防御 |
| SCoT (Proactive Safety Reasoning) | 交叉 | - | 安全思维链防御 |
| Cognitive-Driven Defense | 交叉 | - | 元操作分析认知防御 |
| Attention Heads Safety (Ships) | 交叉 | **ICLR** | 发现安全注意力头 |
| Safety Alignment Should Be More Than Just A Few Attention Heads | 交叉 | - | RDSHA 识别安全注意力头 |
| Linear Mappings CoT Safety | 交叉 | - | 等效线性映射理论 |
| JULI | 交叉 | - | BiasNet 对数概率越狱攻击 |
| Focusing on Language (LAHIS) | 交叉 | **AAAI** | 识别多语言注意力头 |

### 2024

| 论文 | 子主题 | Venue | 核心贡献 |
|------|--------|-------|---------|
| Separating Tongue from Thought | Mechanistic_Interpretability | ICML 2024 MI Workshop (Spotlight) | 激活 patching 揭示 LLaMA-2 浅层编码语言无关概念表示，深层映射到语言输出 |
| Cross-lingual Transfer of Reward Models | Alignment | - | 英语 RM 跨语言迁移强于本地 RM |
| SelfDefend | Guardrails | - | Shadow LLM 并行检测防御 |
| Homer Simpson Task Arithmetic | Alignment | **ACL** | 任务算术安全再对齐 |

---

## 子主题深度说明

### 📂 Guardrails（9 篇）
多语言安全护栏模型，覆盖中文（CHILLGuard）、东南亚语言（SEALGuard）、印度语言（IndicGuard）、100+ 语言（CREST）、17 种语言（PolyGuard）。从检测模型向推理型（MrGuard）、模块化实时（SentraGuard）方向发展。

### 📂 Alignment（7 篇）
跨语言安全对齐技术路线：
- **奖励建模**：Cross-lingual Transfer of Reward Models、MPO
- **权重编辑**：Sparse Weight Editing、Homer Simpson Task Arithmetic
- **知识迁移**：Self-Distillation、Align Once Benefit Multilingually

### 📂 交叉主题（21 篇）
涵盖 CoT 推理链安全、注意力头安全对齐机制、线性表示假说、认知驱动防御等方向。这些论文跨越了多语言安全和更广泛的 LLM 对齐研究。

---

## 关联主题

- [安全对齐](安全对齐.md) → 与 [MultiModal/VLM安全与对齐](MultiModal/VLM安全与对齐.md) 密切相关（视觉模态安全对齐的补充视角）
- [注意力头安全](注意力头安全.md) → 与 [Attention/What Does BERT Look At?](Attention/What Does BERT Look At?.md) 方法同源
- [CoT安全](CoT安全.md) → 独立的研究线，涉及推理过程的监控与防御