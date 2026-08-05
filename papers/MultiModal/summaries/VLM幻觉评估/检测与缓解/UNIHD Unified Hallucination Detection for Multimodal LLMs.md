---
layout: page
---


## 基本信息

- **标题**: Unified Hallucination Detection for Multimodal Large Language Models
- **作者**: Xiang Chen, Chenxi Wang, Yida Xue, Ningyu Zhang, Xiaoyan Yang, Qiang Li, Yue Shen, Jinjie Gu, Huajun Chen
- **年份**: 2024
- **arXiv ID**: 2402.03190
- **论文类型**: 检测方法 - 统一检测

## 核心贡献

UNIHD 提出了首个**统一的、任务无关的、工具增强的多模态幻觉检测框架**。与以往仅关注单一任务（如图像描述）和有限幻觉类别（如物体级）的工作不同，UNIHD 将幻觉检测扩展到涵盖图像到文本（IC、VQA）和文本到图像（T2I）生成两类任务。主要贡献包括：

1. **统一的幻觉分类视角**：将幻觉分为模态冲突幻觉（Modality-Conflicting）和事实冲突幻觉（Fact-Conflicting）两大类，涵盖物体、属性、场景文本和事实四种细粒度类型。
2. **MHaluBench 基准**: 构建了多模态幻觉检测元评估基准，包含 600 个样本（IC 200、VQA 200、T2I 200），提供篇章-段落-声明三级细粒度标注。
3. **工具增强框架**: 设计四阶段流水线，通过自主工具选择和并行工具执行收集证据，实现可靠的幻觉验证。

## 方法

### 统一幻觉分类

- **模态冲突幻觉（Modality-Conflicting Hallucination）**: 输出与输入模态内容冲突，包括错误的物体、属性或场景文本。
- **事实冲突幻觉（Fact-Conflicting Hallucination）**: 输出与已知事实知识矛盾。

### 框架四阶段

#### 1. 核心声明提取（Essential Claim Extraction）
利用 GPT-4V/Gemini 的指令遵循能力，从生成文本中提取可验证的原子声明。

#### 2. 自主工具选择（Autonomous Tool Selection for Claims）
对每个声明，MLLM 自主生成相关查询，确定需要使用的工具类型（物体、属性、场景文本、事实），并提供工具输入。

#### 3. 并行工具执行（Parallel Tool Execution）
四种专用工具并行运行:
- **物体导向工具**: Grounding DINO 进行开放集目标检测
- **属性导向工具**: 底层 MLLM（GPT-4V/Gemini）自反思回答属性问题
- **场景文本导向工具**: MAERec 进行场景文本检测与识别
- **事实导向工具**: Google Search API 进行互联网搜索

#### 4. 含理由的幻觉验证（Hallucination Verification with Rationales）
综合所有证据，MLLM 对每个声明做出二分类判断（幻觉/非幻觉），并给出解释理由。

## 数据集/模型/实验方法

**MHaluBench 构建**:
- 图像到文本: 从 MS-COCO 2014 和 TextVQA 采样，使用 mPLUG-Owl、LLaVA、MiniGPT-4 生成响应
- 文本到图像: 从 DrawBench 和 T2I-CompBench 获取描述，使用 DALL-E 3 生成图像
- 三位研究生级别标注者，Fleiss Kappa = 0.855，一致性高

**评估设置**:
- 基线: Self-Check (0-shot) 和 Self-Check (2-shot) 基于 CoT
- 底层 MLLM: GPT-4V (gpt-4-vision-preview) 和 Gemini
- 评估粒度: 声明级（claim-level）和段落级（segment-level）
- 指标: Micro-F1, Macro-F1, Precision, Recall

**主要发现**:
- MHaluBench 具有挑战性，所有检测器 Macro-F1 在 70%-80% 之间
- UNIHD 在图像到文本和文本到图像任务上均显著优于 Self-Check 基线
- GPT-4V 作为检测器底座优于 Gemini
- UNIHD 在场景文本和事实幻觉检测上提升最大，在属性幻觉上提升有限
- 文本到图像中的幻觉比图像到文本中的幻觉更容易检测

**失败分析**:
- 工具提供正确证据但 MLLM 坚持初始偏见（模型固执）
- 工具产生错误证据或未提供有用信息（工具缺陷）

## 连接上下文

UNIHD 代表**检测方法**中的"统一检测"子方向，与 LogicCheckGPT（逻辑一致性探测）不同，后者侧重于利用模型自身的一致性来检测幻觉。UNIHD 的工具增强思路与 Woodpecker 的外部知识验证方法一脉相承，但 UNIHD 将其扩展为更通用的检测框架，覆盖更多任务和幻觉类型。MHaluBench 的构建方法借鉴了 POPE 和 AMBER 等基准，但在细粒度标注（声明级）和多任务覆盖上实现了突破。该工作与 Hal-Eval（评估框架）在幻觉分类上有互补性——UNIHD 涵盖场景文本和事实幻觉，而 Hal-Eval 引入事件幻觉类别。

## 相关论文

### 评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md)
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md)
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md)
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md)
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md)
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md)
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md)
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
