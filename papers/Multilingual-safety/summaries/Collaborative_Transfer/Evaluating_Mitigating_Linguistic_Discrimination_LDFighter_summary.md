---
layout: page
---

> **arXiv**: `2404.18534` | **年份**: 2025 | **Venue**: IJCAI 2025

## 核心贡献

提出 **LDFighter**（Linguistic Discrimination Fighter），一个轻量级、基于相似性投票（similarity-based voting）的多语言安全与质量增强框架。论文首次系统地评估了大语言模型在多语言场景下的**语言歧视**问题，从**安全公平性（Safety Equity）** 和**知识公平性（Knowledge Equity）** 两个维度分析：

- **安全公平性**：不同语言输入下LLM对有害查询的越狱成功率的差异
- **知识公平性**：不同语言输入下LLM对良性查询的响应质量的差异

核心洞察：LLM在不同语言上的表现存在严重不平衡，低资源语言面临更高越狱风险和更低回答质量，且这种歧视源自训练数据的分布不均而非模型的有意设计。

## 方法

### LDFighter 框架

LDFighter 的核心流程：

1. **多语言翻译**：将用户查询 $q$ 翻译为 $n$ 种目标语言 $\{q_1, q_2, ..., q_n\}$，使用机器翻译服务
2. **并行推理**：用LLM对每个翻译后的查询进行推理，得到响应 $\{r_1, r_2, ..., r_n\}$
3. **回译对齐**：将所有响应翻译回枢纽语言（pivot language，通常为英语），得到 $\{r'_1, r'_2, ..., r'_n\}$
4. **相似性投票**：计算所有响应间的成对余弦相似度矩阵：
   $$S_{ij} = \cos(\text{emb}(r'_i), \text{emb}(r'_j))$$
   选择与其他响应最一致的响应作为最终输出：
   $$r^* = \arg\max_{r'_i} \sum_{j \neq i} S_{ij}$$

关键设计思想：如果一个查询在多种语言下都无法越狱，则其有害性得到交叉验证；如果一个回答在多种语言下语义一致，则其质量和准确性更高。

## 数据集与实验

### 数据集
- **AdvBench**：520条有害指令，用于评估多语言越狱防御能力
- **Natural Questions (NQ)**：用于评估良性查询的响应质量

### 模型
- **Llama2-13b**、**Gemma-7b**、**GPT-3.5-turbo**、**Gemini-pro**

### 语言范围
- 安全评估：6种语言（英语、法语、俄语、西班牙语、孟加拉语、尼泊尔语等）
- 质量评估：扩展到更多低资源语言（格鲁吉亚语、迈蒂利语、卡纳达语等）

### 评估指标
- 越狱成功率（Attack Success Rate, ASR）
- F1分数（用于回答质量评估）

### 对比基线
- 原生模型（无防御）、PPL Filter、Self-Exam、SmoothLLM

## 关键发现

1. **严重的安全歧视**：高资源语言（英语、法语、俄语、西班牙语）的平均越狱成功率仅 **1.04%**，而低资源语言（孟加拉语、格鲁吉亚语、尼泊尔语、迈蒂利语）高达 **27.7%**，差距超过26倍
2. **显著的质量歧视**：高资源语言（英语、丹麦语、捷克语、斯洛文尼亚语）的平均F1分数为 **0.1494**，低资源语言（卡纳达语、南普什图语、塔吉克语、泰卢固语）仅为 **0.0341**，差距约4.4倍
3. **跨模型的普遍性**：所有测试模型（Llama2、Gemma、GPT-3.5、Gemini-pro）均表现出类似的语言歧视模式
4. **LDFighter效果**：显著降低低资源语言的越狱成功率，同时提升回答质量，且计算开销远低于模型微调或整体重训练

## 关联论文

- [Multilingual_Collaborative_Defense_for_LLMs_summary](Multilingual_Collaborative_Defense_for_LLMs_summary.md)：多语言协作防御框架，通过软提示优化提升多语言安全
- [Who_Transfers_Safety_Cross_Lingual_Safety_Neurons_summary](Who_Transfers_Safety_Cross_Lingual_Safety_Neurons_summary.md)：跨语言共享安全神经元的发现与扩展
- [Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary](Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary.md)：多语言LLM中语言注意力头的识别与利用
- [Toward_Robust_Multilingual_Adaptation_of_LLMs_for_Low-Resource_Languages_summary](Toward_Robust_Multilingual_Adaptation_of_LLMs_for_Low-Resource_Languages_summary.md)：面向低资源语言的多语言鲁棒适配
- [Safety Alignment Should Be Made More Than Just A Few Attention Heads_summary](Safety Alignment Should Be Made More Than Just A Few Attention Heads_summary.md)：安全对齐与注意力头机制的关系
