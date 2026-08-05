---
layout: page
---


## 基本信息

- **标题**: Woodpecker: Hallucination Correction for Multimodal Large Language Models
- **作者**: Shukang Yin, Chaoyou Fu, Sirui Zhao, Tong Xu, Hao Wang, Dianbo Sui, Yunhang Shen, Ke Li, Xing Sun, Enhong Chen
- **年份**: 2023
- **arXiv ID**: 2310.16045
- **论文类型**: 缓解方法 - 训练无关纠正

## 核心贡献

Woodpecker 是首个提出**基于纠正（correction-based）范式**来缓解多模态大语言模型（MLLM）幻觉的训练无关框架。与现有依赖指令微调（instruction tuning）的方法不同，Woodpecker 作为一种**后修复（post-remedy）**手段，可在不重新训练模型的情况下直接纠正已生成的文本中的幻觉。其关键创新在于：

1. 首次将纠正范式引入视觉幻觉问题，实现训练自由的幻觉修正。
2. 框架每个步骤清晰透明，具有良好的**可解释性（interpretability）**。
3. 可作为即插即用模块集成到多种 MLLM 中。
4. 在修正文本同时提供目标检测边界框作为证据，增强可信度。

## 方法

Woodpecker 包含五个阶段：

### 阶段一：关键概念提取（Key Concept Extraction）
通过 LLM（GPT-3.5-turbo）从 MLLM 生成的句子中提取主要实体/物体，作为后续诊断的核心。

### 阶段二：问题制定（Question Formulation）
围绕提取的关键概念，生成两类问题：
- **物体级问题**: 询问物体的存在性和数量，如 "Is there any {object} in the image?"
- **属性级问题**: 询问物体的颜色、位置、动作等属性，如 "What color is the {object}?"

### 阶段三：视觉知识验证（Visual Knowledge Validation）
利用外部专家模型回答问题：
- **开放集目标检测器**（Grounding DINO）: 解决物体存在性和计数问题
- **预训练 VQA 模型**（BLIP-2-FlanT5XXL）: 回答属性相关问题

### 阶段四：视觉声明生成（Visual Claim Generation）
将问答对转化为结构化的视觉知识库，包含：
- 物体级声明: 物体存在性及计数信息
- 属性级声明: 各物体的位置、颜色、动作等属性
- 全局信息: 涉及多物体关系或前后景交互的声明

### 阶段五：幻觉纠正（Hallucination Correction）
LLM 在视觉知识库指导下对原始响应进行修正，并附上边界框坐标作为证据支撑。修正原则为最小化修改原始句子。

## 数据集/模型/实验方法

**评估数据集**:
- **POPE**: 评估物体存在性幻觉（随机、流行、对抗三种采样设置）
- **MME**: 涵盖物体级（存在性、计数）和属性级（位置、颜色）幻觉评估
- **LLaVA-QA90**: 开放式的描述性任务评估

**基线模型**:
- mPLUG-Owl, LLaVA, MiniGPT-4, Otter

**关键组件**:
- LLM: GPT-3.5-turbo（用于概念提取、问题制定、幻觉纠正）
- 目标检测: Grounding DINO
- VQA: BLIP-2-FlanT5XXL
- 评估: GPT-4V 辅助评估

**实验结果**:
- POPE 基准上，MiniGPT-4 准确率从 54.67% 提升至 85.33%（提升 30.66%），mPLUG-Owl 从 62% 提升至 86.33%（提升 24.33%）
- MME 基准上，物体级和属性级幻觉均获得一致且显著的提升
- GPT-4V 辅助评估显示准确率和详细度均有提升

## 连接上下文

Woodpecker 是幻觉纠正范式的开创性工作，属于**训练无关的后处理方法**。与后续的 HALC（解码时干预）和 DAMRO（注意力矫正）不同，Woodpecker 不修改模型内部的解码过程，而是直接对生成结果进行修正。其模块化的五阶段设计启发了后续的 UNIHD 等工作中的工具集成思路。与 LogicCheckGPT 类似，都利用了外部 LLM（GPT-3.5）来辅助推理，但 Woodpecker 侧重于纠正而非检测。该工作在 VLM 幻觉评估领域树立了"纠正范式"的标杆，后续许多工作（如 HALC 的对比实验中）将其作为重要的基线方法。

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
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
