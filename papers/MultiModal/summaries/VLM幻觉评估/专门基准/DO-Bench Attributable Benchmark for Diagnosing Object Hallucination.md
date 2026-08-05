---
layout: page
---


## 基本信息

- **标题**: DO-Bench: An Attributable Benchmark for Diagnosing Object Hallucination in Vision-Language Models
- **作者**: JiYang Wang, Jiawei Chen, Mengqi Xiao, Yu Cheng, Yangfu Li, Zhaoxia Yin (华东师范大学、中关村学院)
- **年份**: 2026
- **arXiv ID**: 2604.22822
- **论文类型**: 评估方法 - 诊断型

## 核心贡献

DO-Bench是一个**可控诊断型**基准，旨在**归因**物体幻觉的来源——区分幻觉是由**感知局限（perception-limited）**还是**上下文文本先验（contextual textual prior）**引起的。核心创新：

1. 构建结构化场景组（每场景10个诊断实例），在保持场景一致的条件下独立操控两个维度
2. **先验覆写维度（Prior-Override）**: 保持视觉证据不变，逐步增强上下文文本先验强度（A0-A3, B0-B3）
3. **感知局限维度（Perception-Limited）**: 保持提示不变，通过三种视图（Full/Cluster/Crop）逐步增强视觉证据集中度
4. 提出两个诊断指标：**PriorRobust**（先验鲁棒性）和**PerceptionAbility**（感知能力）

核心发现：物体幻觉不是单一现象——模型可能在感知恢复力上强但在先验抵抗力上弱，反之亦然。模型规模扩大改善感知能力但不一定改善先验鲁棒性。

## 方法

### 场景结构设计

每个场景构成一个10实例组：
- **A对象**: 图像中存在但上下文不常见（GT=Yes），探测**假否定**（false denial）
- **B对象**: 上下文典型但图像中不存在（GT=No），探测**假肯定**（false affirmation/false completion）

### 先验强度操控（Full视图）

四层有序的先验冲突模板（仅一个确定性token不同）：

- A0: 中性
- A1: "I suspect there is no {object} in the image..."
- A2: "I believe there is no {object} in the image..."
- A3: "I am certain there is no {object} in the image..."

使用NLI基的验证确认层级的有序性：

$$
s_k = P(\text{contradiction} \mid \text{contextual\_prior}_k, \text{hypothesis})
$$

### 视觉证据集中（感知维度）

证据增强仅应用于中性先验（A0）下的A系列：
- **Full**: 完整场景
- **Cluster**: 保留A对象及其周围物体簇
- **Crop**: 仅A对象本身

### 诊断指标

**PerceptionAbility**（感知能力）: 在A0条件下计算Cluster和Crop视图的FN率平均值：

$$
\text{PerceptionAbility} = 100 - \frac{1}{2}(FN(A0, \text{Cluster}) + FN(A0, \text{Crop}))
$$

**PriorRobust**（先验鲁棒性）: 计算A系列(A0-A3)和B系列(B0-B3)下FN/FP曲线的标准化面积：

$$
\text{PriorRobust} = 100 \cdot \left(1 - \frac{1}{2}(\text{A\_AUC} + \text{B\_AUC})\right)
$$

## 数据集/模型/实验方法

- **数据集**: 124个结构化场景组，1,240个评估样本，覆盖66个A类类别和77个B类类别
- **数据构建**: GPT-image-1.5合成基础场景 + 区域特定masking移除B对象
- **专家验证**: 5位标注者全覆盖验证目标存在/缺失、裁剪正确性和先验等级
- **评估的VLMs（广泛覆盖）**:
  - 开源: LLaVA-v1.5 (7B/13B), InstructBLIP (7B/13B), InternVL2.5 (2B-78B), Qwen2.5-VL (3B-72B)
  - 闭源: GPT-5.2, Claude-Opus-4.6, Gemini-3-Flash-Preview-Thinking
- **消融研究**:
  - 指标稳定性：改变crop margin (10%/20%)，PriorRobust在不同模板间Spearman相关系数0.88-1.00
  - 编辑伪影与B系列FP无关（所有p > 0.05）
  - 真实图像子集验证趋势一致

## 连接上下文

DO-Bench的诊断范式与其他基准有本质区别——POPE/CHAIR/NOPE提供聚合分数但不能归因错误来源；THRONE/ROPE评估不同类型幻觉但不能区分"为什么"出错；Causal-HalBench也使用反事实但侧重共现偏差的因果效应。DO-Bench通过在每个场景内构建10个控制性实例，实现了机制级归因——模型可能在感知恢复力（PerceptionAbility=89.11）上优秀但在先验抵抗力（PriorRobust=8.39）上脆弱（如InstructBLIP-Vicuna-7B）。4x3网格分析（InternVL2.5系列）证明视觉证据和先验强度是近似可分离的维度——更强的证据垂直下移先验-响应曲线而不改变其形状。这与SHALE中"语义扰动比低层视觉噪声更具破坏性"的发现高度一致。

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
- 因果干预：[Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention](Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention.md) - 反事实思路相近

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
