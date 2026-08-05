---
layout: page
---

> **arXiv**: `2604.25716` | **年份**: 2026

## 核心贡献

本文提出一种**无需训练的跨语言越狱检测框架**，基于固定英语语义码本（semantic codebook）与多语言句子嵌入进行相似度比对，作为黑盒LLM的外部护栏。系统揭示了基于语义相似度的跨语言检测存在**两种截然不同的行为模式**：在规范越狱模板基准上表现优异（AUC高达0.99），但在分布偏移下的异构非安全内容基准上性能急剧下降（AUC约0.60-0.70）。

## 方法

**检测框架**：
1. **码本构建**：从jayavibhav/prompt-injection-safety数据集构建13,811条独特英语越狱提示的固定码本，经Prompt-Guard-86M和Qwen3Guard-Gen-4B双重校验
2. **嵌入与检测**：使用多语言句子嵌入（BGE-M3为主）将查询编码为L2归一化向量，计算与码本的最大余弦相似度
3. **判定规则**：若$s(x) = \max_{c \in C} f(x)^\top c \geq \tau$，则判定为非安全

**评估配置**：
- 4种语言：英语、俄语、中文、阿拉伯语
- 2种翻译流水线：Google Translate、M2M100
- 4种安全基准：jayavibhav/prompt-injection-safety（基准1）、xTRam1/safe-guard-prompt-injection（基准2）、JailbreakBench/JBB-Behaviors（基准3）、nvidia/Aegis-AI-Content-Safety-Dataset-2.0（基准4）
- 3种嵌入模型：BGE-M3、multilingual-e5-large、jina-embeddings-v3
- 3种目标LLM：Qwen3-4B、Llama-3.2-3B-Instruct、GPT-3.5-turbo

## 数据集与实验

**基准特点**：
- 基准1-2：规范越狱模板，同质攻击模式
- 基准3-4：行为多样化，异构非安全类别，分布偏移更显著

**关键结果**：

| 指标 | 基准1-2（规范模板） | 基准3-4（异构非安全） |
|------|-------------------|-------------------|
| AUC | 0.829-0.993 | 0.593-0.703 |
| TPR@FPR≤1%（BGE-M3） | 78.5%-91.9% | 3.3%-23.0% |
| 平均攻击减少率 | 50.0%-96.2% | 18.6%-43.7% |

**端到端缓解效果**：在规范基准上，语义过滤器移除大部分成功攻击（基准1减少96.2%）；在异构基准上，缓解效果大幅减弱（基准4仅减少18.6%）。

## 关键发现

1. **两种行为模式**：基于语义相似度的检测在规范越狱模板上跨语言泛化能力强，但在多样化和异构非安全内容上性能崩溃

2. **低FPR限制**：在安全关键的低误报率（FPR≤1%）约束下，异构基准的召回率降至个位数（3.3%-6.4%），表明单纯基于相似度的过滤不足以提供全面防护

3. **嵌入模型选择关键**：BGE-M3在低FPR区间显著优于其他嵌入模型（如中文M2M上TPR 21.6% vs 4.8%），但在最难基准上所有嵌入模型均崩溃

4. **码本大小权衡**：更大码本提升TPR但显著增加FPR，存在覆盖与误报之间的实际权衡

## 关联论文

- [JBShield_Summary](JBShield_Summary.md)：通过概念激活分析检测越狱，互补的检测思路
- [Proactive_Safety_Reasoning_Summary](Proactive_Safety_Reasoning_Summary.md)：基于推理的防御策略
- [defense_papers_summary](defense_papers_summary.md)：LLM安全防御方法综述
- [LLM_Jailbreak_Papers_Index](LLM_Jailbreak_Papers_Index.md)：越狱攻击与防御论文索引
