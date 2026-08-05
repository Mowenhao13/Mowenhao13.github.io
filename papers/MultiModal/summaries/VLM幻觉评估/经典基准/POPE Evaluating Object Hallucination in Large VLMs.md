---
layout: page
---


## 基本信息

- **论文标题**: Evaluating Object Hallucination in Large Vision-Language Models
- **作者**: Yifan Li, Yifan Du, Kun Zhou, Jinpeng Wang, Wayne Xin Zhao, Ji-Rong Wen
- **机构**: Renmin University of China, Meituan Group
- **年份**: 2023
- **arXiv ID**: 2305.10355
- **论文类型**: 评估方法 - 轮询式探测

## 核心贡献

本文是**首个系统性地研究LVLM（Large Vision-Language Model）中目标幻觉问题**的工作，并提出了**POPE（Polling-based Object Probing Evaluation）**评估方法。

POPE的核心思想是将幻觉评估转化为**二分类任务**：通过对模型提出Yes/No问题（如"Is there a chair in the image?"），评估模型是否能正确判断图像中是否存在某个目标。这一设计相比CHAIR有以下优势：

1. **消除指令敏感性**：不再依赖开放式生成，避免了不同指令对评估结果的影响。
2. **无需复杂解析规则**：直接判断"Yes/No"输出，无需进行词到目标的规则匹配。
3. **更灵活可扩展**：可结合自动化分割模型（如SEEM）应用于无标注数据集。

POPE的形式化定义为一个三元组：

$$
\langle x, \{q(o_i), a_i\}_{i=1}^l \rangle
$$

其中 $x$ 为图像，$q(o_i)$ 是探测目标 $o_i$ 的问题，$a_i$ 是标准答案（Yes/No），$l$ 是每张图像的轮询问题数。正负样本比例设为1:1。

## 方法

### 三种负采样策略

POPE设计了三个难度递进的评估设置：

1. **Random设置**：随机采样图像中不存在的目标作为负样本。
2. **Popular设置**：选择MSCOCO中出现频率最高但图像中不存在的目标。
3. **Adversarial设置**：选择与图像中真实目标最常共现但不存在于图像中的目标。

### 量化指标

采用Accuracy、Precision、Recall和F1 Score，其中F1作为主要指标。同时报告模型回答"Yes"的比例，用于分析模型是否倾向于盲目确认。

### 数据分析方法

作者定义了**Hit Ratio（HR@k）**来量化目标频率与幻觉的相关性：

**HRF@k**（频率命中率）：

$$
\text{HRF@k} = \frac{1}{n} \sum_{i=1}^n \frac{\text{Hit@k}(i)}{\text{Hallucinated}(i)}
$$

**HRC@k**（共现命中率）：

$$
\text{HRC@k}(o) = \frac{1}{m} \sum_{i=1}^m \frac{\text{Hit@k}(i, o)}{\text{Hallucinated}(i)}
$$

## 数据集/模型/实验方法

- **基准评估数据集**: MSCOCO验证集（随机采样2000张图片）
- **扩展评估数据集**: A-OKVQA、GQA
- **评估模型**:
  - LVLMs: mPLUG-Owl, LLaVA, MultiModal-GPT, MiniGPT-4, InstructBLIP
  - 基准VLPMs: OSCAR, VinVL, BLIP, OFA（作为对比的小模型）
- **自动化分割工具**: SEEM（用于无标注数据集的目标提取）

## 关键发现

1. **LVLMs严重受幻觉困扰**：最差的LVLM比小模型多产生6倍幻觉目标、8倍幻觉描述。
2. **视觉指令数据中的高频/共现目标更容易被幻觉**：超过40%的幻觉目标是视觉指令数据集中的top-10高频目标。
3. **LVLMs存在"Yes"偏见**：LLaVA、MultiModal-GPT和mPLUG-Owl回答"Yes"的比例接近99%，说明模型过度自信。
4. **InstructBLIP幻觉最少**：可能因为其视觉指令来源于多样化的公开数据集（较短），且使用Q-Former作为视觉-语言对齐模块。
5. **POPE评估结果与CHAIR一致**但更稳定：不同指令模板下POPE的标准差很低（F1 Score波动仅3.69%）。

## 连接上下文

POPE是对CHAIR的重要改进和扩展。CHAIR依赖于开放式生成+规则匹配，而POPE通过**轮询式探测**（Polling-based Probing）将幻觉评估转化为更可控的二分类任务。这一范式影响了后续多个工作：（1）**AMBER**在POPE的判别式评估基础上扩展了属性和关系维度；（2）**MMHal-Bench**虽采用GPT-4裁判评估，但也借鉴了POPE的对抗性采样思路；（3）**NOPE**（Negative Object Presence Evaluation）直接基于POPE改进。POPE的局限在于仅评估目标存在性幻觉，不涉及属性、关系、计数等细粒度幻觉类型。

## 相关论文

### 幻觉评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md) - 首个系统性幻觉评估
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md) - 无需LLM
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md) - GPT-4裁判
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md) - Type I幻觉
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md) - 基于POPE改进
- 多对象探测：[ROPE Multi-Object Hallucination in Vision-Language Models](ROPE Multi-Object Hallucination in Vision-Language Models.md) - 视觉提示
- 关系幻觉：[Reefknot Comprehensive Benchmark for Relation Hallucination](Reefknot Comprehensive Benchmark for Relation Hallucination.md) - 关系层面
- 细粒度评估：[SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation](SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation.md) - 12维度
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md) - 归因分析
- 因果干预：[Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention](Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention.md) - 共现偏差

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md) - 自适应FOV
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md) - 异常标记
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md) - 反事实推理
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md) - 纠正范式
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
