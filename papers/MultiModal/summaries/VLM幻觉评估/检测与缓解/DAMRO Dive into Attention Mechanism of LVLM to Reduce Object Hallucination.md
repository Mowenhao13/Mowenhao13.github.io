---
layout: page
---


## 基本信息

- **标题**: DAMRO: Dive into the Attention Mechanism of LVLM to Reduce Object Hallucination
- **作者**: Xuan Gong, Tianshi Ming, Xinpeng Wang, Zhihua Wei
- **年份**: 2024
- **arXiv ID**: 2410.04514
- **论文类型**: 缓解方法 - 注意力矫正

## 核心贡献

DAMRO 深入分析了 LVLM 中视觉编码器（ViT）和 LLM 解码器的注意力图，揭示了**异常标记（outlier tokens）**在幻觉产生中的作用机制。核心发现包括：

1. **注意力一致性**: 视觉编码器和 LLM 解码器的注意力分布高度一致，两者都倾向于关注背景中的高范数异常标记，而非所指物体。
2. **异常标记导致幻觉**: 这些异常标记包含全局冗余视觉信息，LLM 对这些标记的过度关注与物体幻觉的发生密切相关。
3. **训练无关的矫正方法**: 利用 ViT 的 [CLS] token 过滤高注意力异常标记，通过对比解码消除其影响。

## 方法

### 注意力一致性分析
定义重叠率指标 $H_i$ 来衡量视觉编码器与 LLM 解码器注意力分布的一致性：

$$H_i = \frac{|S_v(i) \cap S_l(i)|}{i}$$

其中 $S_v(i)$ 和 $S_l(i)$ 分别为视觉编码器和 LLM 解码器中注意力值前 $i$ 大的 token 集合。

定义影响度指标 $F$ 来衡量视觉编码器异常标记对 LLM 解码的影响：

$$F = \frac{\sum_{j=1}^{3} ATT(L_v(j))}{\sum_{i=0}^{n-1} ATT(i)}$$

其中 $L_v(j)$ 为视觉编码器注意力值第 $j$ 高的 token 位置，$ATT(i)$ 为 LLM 解码器在位置 $i$ 的注意力值。

### 异常标记选择
在 ViT 最后一层自注意力中，使用 [CLS] token 作为查询向量计算与其他视觉 token 的注意力：

$$A_{cls} = \text{softmax}\left(\frac{Q_{cls}K^T}{\sqrt{d}}\right)$$

选择前 $k$ 个高注意力值的 token 作为异常标记（负 token）:

$$token_{outlier} = \arg\max_{token_i}(A_{cls}(token_i))$$

### 对比解码
使用对比解码减轻异常标记对后续文本生成的影响：

$$p_t = \text{softmax}\left((1+\alpha)\log\text{its}_\theta(y_t|y_{<t}, v, x) - \alpha\log\text{its}_\theta(y_t|y_{<t}, v_{cls}, x)\right)$$

其中 $v_{cls}$ 是经过 [CLS] token 过滤后的视觉信息。引入自适应似然约束（adaptive plausibility constraint）：

$$V_{head}(y_{<t}) = \{y_t \in V: p_\theta(y_t|v, x, y_{<t}) \geq \beta \max_w p_\theta(w|v, x, y_{<t})\}$$

## 数据集/模型/实验方法

**评估基准**:
- **POPE**: 随机、流行、对抗三种设置
- **CHAIR**: CHAIR$_S$（句子级）和 CHAIR$_I$（物体级）
- **MME**: 存在性、计数、位置、颜色四个子集
- **GPT-4V 辅助评估**: 准确度和详细度评分

**LVLM 模型**:
- LLaVA-1.5-7B, LLaVA-NeXT-7B, InstructBLIP-7B

**对比基线**:
- VCD（高斯模糊生成负样本）
- M3ID（纯文本生成负样本）

**超参数**:
- LLaVA 系列: $\alpha=0.5$（CHAIR）/ $\alpha=2$（其他基准），top-$k=10$
- InstructBLIP: $\alpha=1.5$（CHAIR）/ $\alpha=0.5$（其他基准），top-$k=4$

**实验结果**:
- POPE: LLaVA-1.5 准确率从 82.08% 提升至 85.31%，LLaVA-NeXT 从 84.57% 提升至 87.87%
- CHAIR: LLaVA-1.5 的 CHAIR$_S$ 从 12.4 降至 6.0，CHAIR$_I$ 从 7.2 降至 3.6
- MME: 各模型在大多数子集上获得提升
- 消融实验显示少量异常标记已包含大量信息但准确率低

## 连接上下文

DAMRO 属于**注意力矫正**类幻觉缓解方法，与 HALC（解码时干预）和 VCD（对比解码）在技术上密切相关，都使用对比解码策略。DAMRO 的独特之处在于其深入分析了 ViT 编码器与 LLM 解码器之间的注意力一致性，为幻觉产生机制提供了新的结构层面解释。这与 CausalMM 从因果角度分析模态先验的思路不同，DAMRO 从注意力分布的实际模式出发。与 Woodpecker（事后纠正）相比，DAMRO 在解码过程中主动干预，而 Woodpecker 则事后修正。该方法与 InstructBLIP 的 Q-Former 结构存在一定的兼容性问题，提示了不同投影模块对幻觉矫正效果的差异。

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
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
