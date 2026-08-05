---
layout: page
---


## 基本信息

- **论文标题**: AMBER: An LLM-free Multi-dimensional Benchmark for MLLMs Hallucination Evaluation
- **作者**: Junyang Wang, Yuhang Wang, Guohai Xu, Jing Zhang, Yukai Gu, Haitao Jia, Ming Yan, Ji Zhang, Jitao Sang
- **机构**: Beijing Jiaotong University, Alibaba Group, Peng Cheng Lab
- **年份**: 2023
- **arXiv ID**: 2311.07397
- **论文类型**: 评估方法 - 无需LLM

## 核心贡献

本文提出了**AMBER（An LLM-free Multi-dimensional Benchmark for MLLMs Hallucination Evaluation）**，这是首个**不依赖任何外部LLM**、同时覆盖**生成式任务**和**判别式任务**、涵盖**存在性幻觉、属性幻觉、关系幻觉**三种类型的多维度幻觉评估基准。

AMBER的核心创新在于**LLM-free评估管线**：完全通过标注的目标列表、规则匹配和分类指标进行评估，无需ChatGPT或GPT-4参与评分，大幅降低了评估成本。

### 评估维度覆盖

| 维度 | 类型 | 生成式评估 | 判别式评估 |
|------|------|-----------|-----------|
| 存在性（Existence） | 目标是否存在 | CHAIR | POPE式Yes/No |
| 属性（Attribute） | 状态/数量/动作 | -（待扩展） | 分类判定 |
| 关系（Relation） | 目标间接触关系 | -（待扩展） | 分类判定 |

## 方法

### 数据集构建

1. **图像收集**：从无标注数据集和互联网重新获取1004张图像（避免MLLMs训练数据泄露导致性能膨胀）。
2. **精细标注**：每张图像标注4类内容——存在目标（337个目标类别，是COCO 80类的4倍以上）、属性（状态/数量/动作，含正确和错误标注以构建反事实提示）、关系（目标间是否有直接接触）、幻觉目标（明确不存在但模型可能想象的目标）。
3. **多组标注+人工核查**确保数据质量。

### 评估指标

**生成式任务指标**：

CHAIR公式：

$$
\text{CHAIR}(R) = 1 - \frac{|R'_{\text{obj}} \cap A_{\text{obj}}|}{|R'_{\text{obj}}|}
$$

覆盖度（Cover）：

$$
\text{Cover}(R) = \frac{|R'_{\text{obj}} \cap A_{\text{obj}}|}{|A_{\text{obj}}|}
$$

幻觉率（Hal）：

$$
\text{Hal}(R) = \begin{cases} 1 & \text{if } \text{CHAIR}(R) \neq 0 \\ 0 & \text{if } \text{CHAIR}(R) = 0 \end{cases}
$$

认知一致性（Cog）：

$$
\text{Cog}(R) = \frac{|R'_{\text{obj}} \cap H_{\text{obj}}|}{|R'_{\text{obj}}|}
$$

**判别式任务指标**：Accuracy、Precision、Recall、F1 Score。

**综合指标**（AMBER Score）：

$$
\text{AMBER Score} = \text{Avg}(1 - \text{CHAIR}, \text{F1})
$$

### 提示模板（判别式）

- 状态属性：`"Is the {object} {state} in this image?"`
- 数量属性：`"Is/Are there {number} {object} in this image?"`
- 动作属性：`"Does the {object} {action} in this image?"`
- 关系：`"Is there a direct contact between the {object1} and {object2}?"`
- 反事实（幻觉目标）：`"Is there a {hal_object} in this image?"`

## 数据集/模型/实验方法

- **评估数据集**: AMBER（1004张图像，337个目标类别）
- **评估模型**: LLaVA, MiniGPT-4, mPLUG-Owl, InstructBLIP, LLaVA-1.5, CogVLM, mPLUG-Owl2, GPT-4V(ision)
- **响应处理**: NLTK提取名词 $\rightarrow$ 与AMBER标注目标列表取交集过滤非目标词
- **生成式提示**: 统一使用`"Describe this image"`

## 关键发现

1. **所有MLLMs均存在幻觉问题**：即使最佳模型GPT-4V仍存在约4.3%的CHAIR值（生成任务）和约10.4%的判定错误（判别任务）。
2. **属性幻觉和关系幻觉最为严重**：即使是性能最好的模型，在属性和关系维度F1 Score也仅约0.7。
3. **MLLMs普遍倾向回答"Yes"**（存在性判别任务Precision近1但Recall低），说明模型易被提示中的幻觉内容误导。
4. **GPT-4V在属性幻觉的状态和数量维度优势显著**，但在动作维度落后于部分开源模型（如InstructBLIP）。
5. **CogVLM在生成式任务上表现突出**（低CHAIR、低Hal、低Cog），可能归因于其40亿参数的强大视觉编码器。
6. **InstructBLIP在判别式任务上仅次于GPT-4V**，说明其问答式指令微调框架对判别能力提升有效。

## 连接上下文

AMBER是本任务的第5篇论文，代表了对前序工作的**整合与扩展**：（1）继承CHAIR的生成式评估框架；（2）借鉴POPE的判别式探测范式；（3）**扩展了评估维度**至属性幻觉和关系幻觉；（4）**首创LLM-free评估**，避免了GPT-4裁判的高成本和潜在偏差。AMBER的局限在于：属性/关系评估限于判别式任务（无法在生成式回答中准确解析），NLTK名词提取可能出错（如"orange"作为颜色被误认为目标），幻觉目标的覆盖仍然有限。

## 相关论文

### 前序评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md) - 首个系统性幻觉评估
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - Yes/No问答评估
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factally Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factally Augmented RLHF.md) - GPT-4裁判

### 后续评估基准
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md) - 细粒度验证
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md) - Type I幻觉
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md) - NegP数据
- 多对象探测：[ROPE Multi-Object Hallucination in Vision-Language Models](ROPE Multi-Object Hallucination in Vision-Language Models.md) - 视觉提示
- 关系幻觉：[Reefknot Comprehensive Benchmark for Relation Hallucination](Reefknot Comprehensive Benchmark for Relation Hallucination.md) - 关系层面
- 细粒度评估：[SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation](SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation.md) - 12维度
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md) - 归因分析
- 因果干预：[Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention](Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention.md) - 共现偏差

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
