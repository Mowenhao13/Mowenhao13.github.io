---
layout: page
---


## 基本信息

- **标题**: Logical Closed Loop: Uncovering Object Hallucinations in Large Vision-Language Models
- **作者**: Junfei Wu, Qiang Liu, Ding Wang, Jinghao Zhang, Shu Wu, Liang Wang, Tieniu Tan
- **年份**: 2024
- **arXiv ID**: 2402.11622
- **论文类型**: 检测方法 - 逻辑一致性探测

## 核心贡献

LogicCheckGPT 首次提出利用**逻辑闭环（Logical Closed Loop）**概念来探测和缓解 LVLM 中的物体幻觉。其核心洞察在于：LVLM 对真实存在的物体倾向于产生逻辑一致的响应，而对幻觉物体则表现出逻辑不一致性。基于这一观察，该框架通过构建"物体→属性→物体"的逻辑问题链来检测幻觉。主要贡献：

1. 首次将逻辑闭环概念应用于 LVLM 物体幻觉缓解。
2. 训练无关的即插即用框架，仅需语言交互，无需外部检测模型或内部参数访问。
3. 自然语言问答过程增强了可解释性。

## 方法

### 核心公式

对于第 $i$ 个待检测物体，逻辑闭环率定义为：

$$S(i) = \frac{1}{N} \sum_{j=1}^{N} x_j^{(i)}$$

其中 $N$ 为属性→物体问答对的总数，$x_j^{(i)} \in \{0, 1\}$ 表示第 $j$ 个回答是否覆盖了待检测物体（1 表示覆盖）。

通过阈值 $\lambda$ 判断：若 $S(i) < \lambda$，则判定该物体为幻觉。

### 五阶段框架

#### 1. 物体提取（Object Extraction）
通过 LLM（GPT-3.5-turbo）从 LVLM 响应中提取候选物体列表。

#### 2. 物体到属性询问（Object-to-Attribute Inquiring）
对每个提取的物体，使用开放式问题（如 "Could you please describe the {object} in the image?"）获取详细属性描述。

#### 3. 属性到物体询问（Attribute-to-Object Inquiring）
- **属性提取**: 从物体描述中提取属性声明（如 "the object is red"）
- **问题构造**: 将属性转化为全面覆盖式问题，格式为 "Could you tell me all the objects that {attribute} in the image?"

设计这个全面覆盖式问题格式（而非 "What is {attribute}?"）是为了避免模型仅回答最明显的物体而遗漏其他符合条件的真实物体。

#### 4. 逻辑闭环检查（Logical Closed Loop Checking）
对每个属性→物体问题的回答，使用 LLM 判断是否涉及原始待检测物体，输出 "Yes" 或 "No"，映射为分数 $x_j^{(i)}$。

#### 5. 幻觉检测与缓解（Hallucination Detection and Mitigation）
将逻辑闭环率低于阈值 $\lambda$ 的物体标记为幻觉，引导 LLM 从原始响应中删除与幻觉物体相关的内容。

## 数据集/模型/实验方法

**评估基准**:
- **POPE**（随机、流行、对抗三种采样设置）: 准确率和 F1 分数
- **MME**（存在性子集）: 准确率和准确率+
- **GPT-4V 辅助评估**: 对 COCO 2014 验证集 50 张图像进行准确率和相关性评分

**LVLM 主干**:
- mPLUG-Owl (7B), MiniGPT-4 (13B), LLaVA-1.5 (7B), QWEN-VL-Chat (7B)

**对比基线**:
- LRV-Instruction, SelfCheckGPT, LURE

**实验结果**:
- POPE 上 mPLUG-Owl 准确率提升超过 30%（对抗设置从 50.67% 到 82.00%）
- MME 存在性子集上 mPLUG-Owl 准确率+提升 58.33%（从 35.00% 到 93.33%）
- GPT-4V 辅助评估中所有模型准确率均有显著提升，相关性保持或提高
- 消融实验验证了"全面覆盖式提问"（w/o AOP）和"逻辑闭环率计算"（w/o LCL）各自的有效性

**阈值分析**:
- 阈值 $\lambda$ 在 0.0-0.9 范围内搜索，不同模型最优阈值不同（如 mPLUG-Owl 在 $\lambda=0.3$ 最优，LLaVA 在 $\lambda=0.5$ 最优）

## 连接上下文

LogicCheckGPT 属于**检测方法**中基于"逻辑一致性探测"的子方向，与 UNIHD（工具增强的统一检测）不同，完全不依赖外部工具或模型，仅利用 LVLM 自身的语言交互能力。这与 Woodpecker 和 UNIHD 的工具增强范式形成了鲜明对比。该方法与 SelfCheckGPT 在理念上有相似之处（都利用模型响应的一致性），但 LogicCheckGPT 通过构造逻辑相关的问答链（而非对同一问题的多次响应）来挖掘更深层的模型不确定性。与 DAMRO（注意力机制分析）不同，LogicCheckGPT 从模型行为的逻辑一致性而非内部注意力分布入手。该方法的局限性在于仅处理物体幻觉，不覆盖属性、关系等其他幻觉类型。

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
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
