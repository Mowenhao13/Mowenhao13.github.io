---
layout: page
---


## 基本信息

- **论文标题**: FaithScore: Evaluating Hallucinations in Large Vision-Language Models
- **作者**: Liqiang Jing, Ruosen Li, Yunmo Chen, Mengzhao Jia, Xinya Du
- **机构**: University of Texas at Dallas, Johns Hopkins University, University of Notre Dame
- **年份**: 2023
- **arXiv ID**: 2311.01477
- **论文类型**: 评估方法 - 原子事实级

## 核心贡献

本文提出了**FaithScore（Faithfulness to Atomic Image Facts Score）**，这是首个**无需参考答案**、能**细粒度评估开放式回答**中各种类型幻觉的自动评估指标。FaithScore将VLM的回答分解为**原子事实（Atomic Facts）**，逐条验证每个原子事实是否忠实于图像。

与之前的方法（CHAIR仅覆盖80个MSCOCO目标、POPE仅评估目标存在性）不同，FaithScore支持评估**实体（Entity）、计数（Count）、颜色（Color）、关系（Relation）和其他属性（Other Attributes）**五类原子事实。

### 评估框架三步骤

**步骤1：描述性子句识别（Descriptive Sub-sentence Identification）**

通过LLM（使用In-Context Learning）识别VLM回答中哪些子句是**描述性内容**（需要与图像验证），哪些是**分析性内容**（如常识推理，无需验证）。这一步骤至关重要，因为分析性内容约占总子句的近一半。

$$
\hat{A} = \text{LLM}(A, P)
$$

其中 $A$ 为回答，$P$ 为包含任务指令和示例的提示，$\hat{A}$ 为识别结果。

**步骤2：原子事实生成（Atomic Fact Generation）**

将描述性子句分解为不可再分的原子事实，按五类划分：

$$
E_i = \text{LLM}(A', P'), \quad i \in [1, C]
$$

其中 $A'$ 为描述性子句，$E_i = \{e_1^i, \cdots, e_{n_i}^i\}$ 为第 $i$ 类的所有原子事实，$C=5$ 为类别总数。

**步骤3：事实验证（Fact Verification）**

使用**视觉蕴涵模型（Visual Entailment Model, VEM）**验证每个原子事实是否被图像支持：

$$
\hat{f} = \frac{\sum_{i=1}^{C} \sum_{j=1}^{n_i} w_i^j \cdot s(e_i^j, I)}{\sum_{i=1}^{C} \sum_{j=1}^{n_i} 1}
$$

其中 $s(e_i^j, I)$ 是验证函数（VEM判断图像是否语义蕴涵文本），$w_i^j$ 是权重因子（本工作中均设为1）。

句子级FaithScore也相应定义：

$$
\hat{f}_s = 1 - \frac{C_h}{C}
$$

其中 $C$ 为描述性子句总数，$C_h$ 为包含幻觉的描述性子句数。

## 数据集/模型/实验方法

- **评估数据集**:
  - **LLaVA-1k**: 从COCO验证集中选1000张图像，每张生成3种类型问答（详细描述、对话、复杂问题）
  - **MSCOCO-Cap**: 1000张COCO验证集图像，prompt为"Generate a concise caption for the given image"
- **评估模型**: MiniGPT-4, LLaVA, InstructBLIP, Multimodal-GPT, mPLUG-Owl, LLaVA-1.5
- **人类评估**:
  - 3名标注员通过Amazon Mechanical Turk对180个测试样本进行标注
  - 子句识别的Fleiss' Kappa = 75.97%（高度一致），最终FaithScore的Fleiss' Kappa = 60.0%
  - 采用Likert 5分制评分
- **VEM比较**: 测试了OFA-EM, OFA, mPLUG, BLIP-2-flant5xl/xxl, LLaVA, LLaVA-1.5，最终选用LLaVA-1.5（准确率最高85.07%）

## 关键发现

1. **FaithScore与人类判断高度相关**：Pearson r=48.17%，远优于CHAIR(16.8%)、CLIP-Score(19.8%)、METEOR(-12.2%)等基线指标。
2. **传统指标（BLEU/ROUGE/METEOR）与人类判断呈负相关**，说明在开放式问答中基于参考答案的指标完全不可靠。
3. **LLaVA-1.5在所有模型中对齐效果最佳**（LLaVA-1k Overall FaithScore=0.8566）。
4. **长答案更容易产生幻觉**：随着回答中实体数量的增加，FaithScore显著下降。
5. **关系（Relation）和多目标场景最易产生幻觉**，颜色和计数相对较好。
6. **GPT-4V仍有幻觉**：在定性测试中发现GPT-4V在关系描述上存在错误（如将"站在地上的人"误述为"站在倒置滑板上的人"）。

## 连接上下文

FaithScore代表了VLM幻觉评估从**粗粒度目标检测走向细粒度原子事实验证**的演进方向。它对CHAIR和POPE的改进在于：（1）**无需参考答案**（Reference-free），适用于开放式问答；（2）**支持任意目标类别**，不局限于MSCOCO的80个类别；（3）**覆盖多种幻觉类型**（实体、计数、颜色、关系等）；（4）引入**描述性vs分析性内容区分**，避免对合理分析的误判。FaithScore的设计理念源自文本领域的**FactScore**（Min et al., 2023），将其推广至多模态场景。该方法依赖LLM（如ChatGPT）进行子句识别和原子事实分解，以及VEM进行视觉验证，存在一定计算成本和模型偏差风险。

## 相关论文

### 前序评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md) - 首个系统性幻觉评估
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - Yes/No问答评估
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md) - 无需LLM
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md) - GPT-4裁判

### 后续评估基准
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
