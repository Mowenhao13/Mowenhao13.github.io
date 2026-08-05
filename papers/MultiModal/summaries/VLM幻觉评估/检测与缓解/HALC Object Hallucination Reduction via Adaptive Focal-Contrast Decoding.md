---
layout: page
---


## 基本信息

- **标题**: HALC: Object Hallucination Reduction via Adaptive Focal-Contrast Decoding
- **作者**: Zhaorun Chen, Zhuokai Zhao, Hongyin Luo, Huaxiu Yao, Bo Li, Jiawei Zhou
- **年份**: 2024
- **arXiv ID**: 2403.00425
- **论文类型**: 缓解方法 - 解码时干预

## 核心贡献

HALC 提出了一种新颖的**解码算法**，旨在减少大型视觉语言模型（LVLMs）中的物体幻觉（Object Hallucination, OH）。其核心洞察在于：自回归解码过程中，LVLM 对文本信息的依赖逐渐增强，而对视觉信息的依赖逐渐减弱，这种不平衡导致幻觉。HALC 的创新点包括：

1. **自适应焦点-对比解码（Adaptive Focal-Contrast Decoding）**: 在本地（token 级）识别并纠正可能存在幻觉的 token，通过采样不同的视觉上下文（视场，FOV）并对比其解码分布来逼近最优视觉上下文。
2. **基于匹配的束搜索（Matching-based Beam Search）**: 在全局（序列级）使用视觉匹配分数来平衡幻觉缓解与文本生成质量。
3. **即插即用**: 无需额外训练即可集成到任意开源 LVLM 中。
4. **理论保障**: 对 FOV 采样的鲁棒性提供了理论证明（Theorem 5.1）。

## 方法

### 问题定义
给定图像 $v$ 和文本查询 $x$，LVLM 自回归地生成文本 $y$。在时间步 $t$:

$$y_t \sim p_\theta(\cdot|v, x, y_{<t}) \propto \exp f_\theta(\cdot|v, x, y_{<t})$$

其中 $f_\theta$ 是 logit 分布。

### 框架流程

#### 1. 物体相关 Token 识别
对每个生成的 token 进行词性标注，将属于名词、形容词/副词/数词/动词/介词（分别对应存在性、属性、关系幻觉）的 token 标记为需处理对象。

#### 2. 视觉上下文检索
使用零样本检测器（如 Grounding DINO）定位当前 token 在图像中的视觉上下文窗口 $v_d = (w_d, h_d, p_d)$。

#### 3. 自适应焦点-对比定位
- **FOV 采样**: 基于初始检测 $v_d$ 采样 $n$ 个不同大小的视场，采用指数扩展函数：
  $$v_i = ((1+\lambda)^i w_d, (1+\lambda)^i h_d, p_d)$$
- **动态视觉上下文选择**: 对任意两个 FOV 候选计算 Jensen-Shannon 散度（JSD）来衡量解码概率分布的差异：
  $$d(v_i, v_j) = JSD(p_\theta(\cdot|v_i, x, y_{<t}) \parallel p_\theta(\cdot|v_j, x, y_{<t}))$$
  选择 JSD 最大的前 $m$ 对 FOV。
- **对比解码**: 对于选定 FOV 对 $(v_i, v_j)$，在 logit 空间进行双向对比：
  $$p_{v_i/v_j}(\cdot|v_i, v_j, x, y_{<t}) \propto \exp\left[(1+\alpha)f_\theta(\cdot|v_i, x, y_{<t}) - \alpha f_\theta(\cdot|v_j, x, y_{<t})\right]$$
  其中 $\alpha$ 为放大因子。

#### 4. 匹配束搜索
使用 BLIP 模型计算当前文本序列与原始图像的相似度，从 $2mk$ 个候选序列中选择最优的 $k$ 个。

### 理论分析
假设最优视觉上下文 $v^*$ 周围存在 $\epsilon$-邻域 $B(v^*, \epsilon)$，在该邻域内解码分布差异有界。对于 $n$ 个 FOV 样本，最小偏差满足：
- 正态分布采样: $h_{\pi_g}(v^*, n) \leq \delta + (1 - C_g(\epsilon, \eta; \sigma))^n$
- 指数扩展采样: $h_{\pi_e}(v^*, n) \leq \delta + (1 - C_e(\epsilon, v^*, v_d; \lambda))^n$

当 $n \to \infty$ 时，上界趋近于 $\delta$。

## 数据集/模型/实验方法

**评估基准**:
- **CHAIR**: MSCOCO 上的图像描述幻觉评估（CHAIR$_S$ 和 CHAIR$_I$）
- **POPE/OPOPE**: 物体探测评估（修改为离线版 OPOPE，使用 $F_\beta$ 指标）
- **MME**: 存在性、计数、位置、颜色四个子集
- **LLaVA-Bench**: 定性案例研究

**LVLM 主干**:
- MiniGPT-4, LLaVA-1.5, mPLUG-Owl2

**对比基线**:
- Greedy, Beam Search, DoLa, OPERA, VCD, Woodpecker, LURE

**关键实验发现**:
- CHAIR 评估中 HALC 在所有方法中一致性最优，且标准偏差最低
- 在长文本生成场景下，HALC 是唯一能保持幻觉数量不随生成词数增长的方法
- MME 上 HALC 大幅超越其他方法：存在性 +10.7%、位置 +18.3%、颜色 +19.4%、计数 +20.2%

## 连接上下文

HALC 属于**解码时干预**类幻觉缓解方法，与 VCD、OPERA 等工作同属一个子方向。与 Woodpecker（事后纠正）和 DAMRO（注意力矫正）不同，HALC 在解码过程中动态调整 token 概率分布。其核心贡献在于提出了自适应 FOV 采样和对比解码的框架，并通过理论分析保证了方法的鲁棒性。HALC 还开源了一个统一的 OH 缓解评估平台，集成了多个基线方法。该方法与后续的 CausalMM（因果推理）共享对"模态先验导致幻觉"这一洞察，但解决路径不同——HALC 通过视觉上下文的精细搜索，而 CausalMM 通过因果干预。

## 相关论文

### 幻觉评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md) - 首个系统性幻觉评估
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - Yes/No问答评估
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md) - 无需LLM
- 开放式评估：[MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF](MMHal-Bench Aligning Multimodal Models with Factually Augmented RLHF.md) - GPT-4裁判
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md) - Type I幻觉
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md) - NegP数据
- 多对象探测：[ROPE Multi-Object Hallucination in Vision-Language Models](ROPE Multi-Object Hallucination in Vision-Language Models.md) - 视觉提示
- 关系幻觉：[Reefknot Comprehensive Benchmark for Relation Hallucination](Reefknot Comprehensive Benchmark for Relation Hallucination.md) - 关系层面
- 细粒度评估：[SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation](SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation.md) - 12维度
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md) - 归因分析
- 因果干预：[Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention](Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention.md) - 共现偏差

### 幻觉缓解方法
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md) - 异常标记
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md) - 反事实推理
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md) - 纠正范式
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
