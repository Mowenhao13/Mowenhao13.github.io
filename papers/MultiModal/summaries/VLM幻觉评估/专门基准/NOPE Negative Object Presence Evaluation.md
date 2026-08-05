---
layout: page
---


## 基本信息

- **标题**: Negative Object Presence Evaluation (NOPE) to Measure Object Hallucination in Vision-Language Models
- **作者**: Holy Lovenia, Wenliang Dai, Samuel Cahyawijaya, Ziwei Ji, Pascale Fung (香港科技大学)
- **年份**: 2023
- **arXiv ID**: 2310.05338
- **论文类型**: 评估方法 - 否定对象

## 核心贡献

NOPE（Negative Object Presence Evaluation）通过**否定对象存在性**评估VL模型中的物体幻觉。核心创新在于区分了两个概念：

1. **物体幻觉（object hallucination）**: 模型回答包含不存在的物体，即GT答案为否定不定代词（NegP，如"none"、"nothing"、"nobody"、"nowhere"）时模型的错误回答
2. **错误（incorrectness）**: 模型未能准确回答其他非NegP问题

关键发现：所有评估的VL模型在NegP数据上的准确率均低于10%，说明没有任何VL模型能免于物体幻觉。

## 方法

### NegP数据生成

提出两种LLM提示方法生成高质量的否定问题数据：

**1. Generate-from-scratch**: 给定图像描述 $c_i$，直接让LLM生成以特定疑问词开头、答案属于NegP集合 $A_{NegP} = \{\text{"none"}, \text{"nothing"}, \text{"nowhere"}, \text{"zero"}, \text{"0"}, \text{"no one"}, \text{"nobody"}, \text{"neither"}\}$ 的问题。

**2. List-then-rewrite**（更好，92%有效性）: 分两步进行：
  - 第1步：给定图像描述 $c_i$ 和标注 $l_i$，让LLM列出与场景"密切相关"但未提及的m个物体 $o_i = \{o_{i,1}, \cdots, o_{i,m}\}$
  - 第2步：用预定义的人类问题模板库替换对象占位符，然后让LLM改写以增加词汇多样性

### 评估设置

构建平衡的NegP和Others数据集（各约15k/18k dev/test）。使用三个指标：
- **准确率（Accuracy）**
- **METEOR**（部分匹配）
- **NegP准确率**：判断生成答案是否属于 $A_{NegP}$

### 幻觉与影响因素分析

1. **词汇多样性与幻觉**: NegP性能与词汇多样性指标强负相关（Pearson $r = \{-0.8, -0.66, -0.65, -0.7\}$）
2. **问题类型与语言偏差**: 颜色/物体/位置类NegP问题幻觉率高，计数/人物类幻觉率低——因为后者的答案范围小
3. **物体-场景相关性**: 与场景密切相关的物体更易引发幻觉（VL模型对抗场景共现偏差的能力弱）

## 数据集/模型/实验方法

- **NegP数据源**: 基于OpenImages V7，使用ChatGPT生成29.5k个NegP问题
- **Others评估数据**: 来自AdVQA、R-VQA、TDIUC、TextVQA、Visual7W、VizWiz、VQA-Rephrasings、VQAv1 Abstract Scenes、VQAv2 Balanced Real
- **评估的VL模型（10个）**: 
  - Zero-shot: PromptCap, BLIP-2, OpenFlamingo
  - VQA微调: OFA, BLIP, BLIP-CapFilt, ALBEF, GIT, InstructBLIP
- **关键结果**: GIT（最小但预训练数据最多）表现最优，说明数据规模比模型规模更重要

## 连接上下文

NOPE是从区分性评估角度研究物体幻觉的代表性工作，与POPE（同样基于Yes/No问答）共享范式但更深入——POPE通过正负采样构造问题，NOPE则直接利用否定不定代词作为真实标签，更直接地评估模型是否"幻觉出不存在的对象"。与THRONE（自由生成Type I）、CHAIR（短描述匹配）形成互补：NOPE和POPE属于Type II评估方法，而THRONE和CHAIR属于Type I。NOPE揭示的"场景相关物体更易幻觉"与后续Reefknot（关系幻觉中的共现偏差）和Causal-HalBench（虚假相关性）方向一致。

## 相关论文

### 评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md)
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - 同类Type II评估
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md)
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md)
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md)
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md) - Type I（互补）
- 多对象探测：[ROPE Multi-Object Hallucination in Vision-Language Models](ROPE Multi-Object Hallucination in Vision-Language Models.md)
- 关系幻觉：[Reefknot Comprehensive Benchmark for Relation Hallucination](Reefknot Comprehensive Benchmark for Relation Hallucination.md)
- 细粒度评估：[SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation](SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation.md)
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md)
- 因果干预：[Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention](Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention.md)

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
