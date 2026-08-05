---
layout: page
---


## 基本信息

- **标题**: Mitigating Modality Prior-Induced Hallucinations in Multimodal Large Language Models via Deciphering Attention Causality
- **作者**: Guanyu Zhou, Yibo Yan, Xin Zou, Kun Wang, Aiwei Liu, Xuming Hu
- **年份**: 2024
- **arXiv ID**: 2410.04780
- **论文类型**: 缓解方法 - 因果推理

## 核心贡献

CausalMM 提出了一个**因果推理框架**，将结构因果模型（Structural Causal Model, SCM）应用于 MLLM，将**模态先验（modality priors）**视为注意力机制与模型输出之间的混杂因子（confounder）。该方法通过后门调整（backdoor adjustment）和反事实推理（counterfactual reasoning）来消除视觉先验和语言先验的负面影响。主要贡献：

1. 首个为 MLLM 构建完整因果图的工作，系统建模了视觉注意力、语言注意力、模态先验与输出之间的关系。
2. 在视觉和语言注意力两个层面应用反事实推理，使输出更符合多模态输入。
3. 即插即用，可与其他训练无关方法集成。
4. 在多个基准上取得显著提升，VLind-Bench 上最高提升 65.3%，MME 上提升 164 分。

## 方法

### 结构因果模型（SCM）

构建的因果图包含以下关系：
- $I \to A_i$: 图像输入影响视觉注意力层
- $I \to T_i$: 图像输入直接影响视觉 token 嵌入
- $P_v \to A_i$: 视觉先验影响视觉注意力
- $P_v \to T_i$: 视觉先验影响视觉 token 嵌入
- $A_i \to T_i$: 视觉注意力影响视觉 token 编码
- $T_i \to O$: 视觉 token 直接贡献于输出
- $T_t \to A_t$: 语言 token 嵌入影响 MLLM 注意力
- $T_t \to O$: 语言 token 嵌入直接影响输出
- $P_l \to A_t$: 语言先验影响注意力机制
- $P_l \to O$: 语言先验直接影响输出
- $A_t \to O$: LLM 注意力塑造最终输出

### 反事实注意力干预

对视觉和语言注意力执行 $do$ 操作，生成反事实状态：

**视觉注意力干预**:
- 随机注意力: $A'_i(h,w) = U(0,1) \cdot \sigma \cdot \alpha_v$
- 均匀注意力: $A'_i(h,w) = \frac{1}{H \times W}\sum_{h,w} A_i(h,w) + \epsilon$
- 反转注意力: $A'_i(h,w) = \max(A_i) - A_i(h,w) + \lambda$
- 打乱注意力: $A'_i(h,w) = A_i(\pi(h), \pi(w))$

**语言注意力干预**: 类似地定义随机、均匀、反转三种反事实状态。

### 反事实推理

基于后门准则，计算注意力的因果效应：

**视觉注意力的因果效应**:
$$P_{effect\_V} = E_{A_i \sim \tilde{A}_i}[P(O|A_i=A_i, I=I, P_v=P_v) - P(O|do(A_i=a_i), I=I, P_v=P_v)]$$

视觉-only 的下一 token 选择:
$$t_{next,v} = \arg\max_i \frac{e^{\max(\ell_i+\gamma(\ell_i-\ell_{cfv,i})-\log(\epsilon)-\max_j\ell_j, -\infty)}}{\sum_j e^{\max(\ell_j+\gamma(\ell_j-\ell_{cfv,j})-\log(\epsilon)-\max_k\ell_k, -\infty)}}$$

**语言注意力的因果效应**:
$$P_{effect\_L} = E_{A_t \sim \tilde{A}_t}[P(O|A_t=A_t, T_t=T_t, P_l=P_l) - P(O|do(A_t=a_t), T_t=T_t, P_l=P_l)]$$

**多模态协作的 token 选择**:
$$t_{next} = \arg\max_i \frac{e^{\max(\ell_i+\gamma((\ell_i-\ell_{cfv,i})+(\ell_i-\ell_{cfl,i}))-\log(\epsilon)-\max_j\ell_j, -\infty)}}{\sum_j e^{\max(\ell_j+\gamma((\ell_j-\ell_{cfv,j})+(\ell_j-\ell_{cfl,j}))-\log(\epsilon)-\max_k\ell_k, -\infty)}}$$

## 数据集/模型/实验方法

**评估基准**:
- **VLind-Bench**: 测量语言先验依赖，区分常识知识（CK）、视觉感知（VP）和常识偏差（CB）
- **POPE**: MSCOCO、A-OKVQA、GQA 三个数据集，随机/流行/对抗三种设置
- **MME**: 感知相关 10 子任务 + 认知相关 4 子任务

**基线 MLLM**:
- LLaVA-1.5, Qwen2-VL

**对比方法**:
- Regular（直接采样）、VCD、OPERA
- CausalMM 的三个变体: Vision-only、Language-only、Multimodal（多模态协作）

**主要实验结果**:
- VLind-Bench: LLaVA-1.5 上多模态协作设置实现显著性能飞跃，Qwen2-VL 上视觉先验已较好平衡
- POPE: 三种设置下 CausalMM 一致优于 VCD 和 OPERA，多模态协作变体取得最高准确率，平均提升 5.37%
- MME: 计数和颜色任务上有显著提升，位置任务相对稳定
- GPT-4o 辅助评估: 综合质量、对话、详细度和复杂度均优于基线

**消融实验**:
- 四种反事实注意力类型中，随机注意力效果最优
- LLM 中间层干预效果最佳，浅层和深层干预效果递减

## 连接上下文

CausalMM 属于**因果推理**类幻觉缓解方法，在方法论上具有独特性。与 HALC（解码时干预）和 VCD（对比解码）等基于统计相关性的方法不同，CausalMM 通过构建因果图并实施反事实推理来更根本地消除模态先验的混淆效应。这一思路与 DAMRO（注意力矫正）有形式上的相似之处——都操作注意力机制，但 DAMRO 基于经验观察（异常标记），而 CausalMM 有完整的因果理论框架。CausalMM 将模态先验划分为视觉先验（来自视觉编码器参数知识）和语言先验（来自 LLM 参数知识），分别进行处理，这比 Woodpecker（事后纠正）和 UNIHD（工具增强检测）更深入地触及了幻觉的根因。

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
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
