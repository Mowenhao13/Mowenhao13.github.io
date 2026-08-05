---
layout: page
---


## 基本信息

- **标题**: Causal-HalBench: Uncovering LVLMs Object Hallucinations Through Causal Intervention
- **作者**: Zhe Xu, Zhicai Wang, Junkang Wu, Jinda Lu, Xiang Wang (中国科学技术大学)
- **年份**: 2025
- **arXiv ID**: 2511.10268
- **会议**: AAAI 2026
- **论文类型**: 评估方法 - 因果干预

## 核心贡献

Causal-HalBench首次将**因果分析**引入LVLM物体幻觉研究，通过结构因果模型（SCM）形式化定义**虚假相关性（spurious correlations）**——模型因训练数据中高频共现模式而产生的不正确关联。核心创新：

1. 利用SCM建模物体幻觉中的共现偏差（Co-occurrence Bias）作为混杂变量
2. 提出**视觉内容干预（Visual Content Intervention, VCI）**——用反事实图像替换高频共现对象，打破虚假相关性
3. 提出基于因果的量化指标（CAC、AAC、CHR）评估虚假相关性的影响

## 方法

### 结构因果模型（SCM）

在SCM中：
- $X$: 输入图像
- $Q$: 问题（如"Is there {object} in this image?"）
- $Y$: LVLM输出
- $C$: 共现偏差（Confounder）

理想情况下，LVLM应仅通过 $X \to Y$ 进行预测。但由于 $C$ 作为混杂变量打开后门路径 $X \leftarrow C \to Y$，模型可能利用共现捷径而非视觉信息。

### 视觉内容干预（VCI）

通过构建反事实图像 $X_{cf}$ 来干预 $X$，阻断 $C$ 的影响：

$$
y_{cf} = Y(do(X = x_{cf}))
$$

**平均因果效应（Average Causal Effect, ACE）**:

$$
ACE = \mathbb{E}[Y | do(X = X_{cf}), Q] - \mathbb{E}[Y | X, Q]
$$

**直接因果强度（Direct Causal Strength, DCS）**:

$$
DCS = \mathbb{E}[Y | do(X = x_{cf}), Q]
$$

### 评估指标

基于ACE和DCS设计三个指标：

1. **CAC（Contextual object Accuracy Change）**: 上下文物体在原始图像和反事实图像之间的准确率变化
   $$CAC = Acc(X, Q_c) - Acc(X_{cf}, Q_c)$$
   越高表示模型受共现偏差影响越大

2. **AAC（Absent object Accuracy Change）**: 不存在的物体在反事实图像上的准确率提升
   $$AAC = Acc(X_{cf}, Q_a) - Acc(X, Q_a)$$
   越高表示模型虚假相关导致更多幻觉

3. **CHR（Counterfactual object Hallucination Rate）**: 对反事实物体的幻觉率
   $$CHR = 1 - Acc(X_{cf}, Q_{cf})$$
   越低表示模型视觉感知越强

### 数据构建流水线

三个步骤：
1. **干预对象选择**: 利用共现矩阵选择与上下文物体共现频率最低的对象替换目标对象，Gemini选择视觉最合适的对象
2. **反事实描述生成**: Gemini根据原始标注和替换信息生成准确的反事实描述
3. **反事实修复（Inpainting）**: SAM提取精确掩码，FLUX-controlnet修复，生成高质量反事实图像

## 数据集/模型/实验方法

- **数据集**: 757张原始图像（MSCOCO验证集） → 1387张反事实图像，9709个QA对
- **评估的LVLMs（9个）**: LLaVA-NEXT-8B, LLaVA-onevision-7B, Kimi-VL-A3B, MiniCPM-o-2.6, InternVL2.5-8B, mPLUG-Owl3-7B, Qwen2.5-VL-7B, GPT-4o, Gemini1.5-pro
- **对比基准**: POPE（区分性）和CHAIR（生成性）
- **数据质量验证**: CLIP Score验证合成区域正确表示反事实对象（22.4→27.5），弱化原始目标信号（26.5→22.4）
- **共现模式可视化**: 热图显示修改后数据集的共现模式更平衡

## 连接上下文

Causal-HalBench超越了POPE（仅检测幻觉）和BEAF（观察对象移除前后变化），首次用因果语言形式化了VLM中普遍存在但此前仅定性讨论的"共现偏差"问题。其反事实样本构建思路与DO-Bench（控制性干预分离先验和感知）类似但侧重不同因果效应。关键发现：更新的模型（如Qwen2.5-VL）在通用基准上表现更好，但对虚假相关性更敏感——模型越大、训练数据越多，可能学到更多虚假关联。这一发现与THRONE中"Type I和Type II改善正交"的观察呼应，说明LVLM幻觉缓解需要针对性的因果去偏。

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
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md) - 反事实思路相近

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md) - 因果推理思路
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
