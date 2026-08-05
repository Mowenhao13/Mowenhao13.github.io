---
layout: page
---


## 基本信息

- **标题**: Revisit What You See: Disclose Language Prior in Vision Tokens for Efficient Guided Decoding of LVLMs (ReVisiT)
- **作者**: Beomsik Cho, Jaehyung Kim
- **年份**: 2025
- **会议/期刊**: Preprint (Under Review)
- **arXiv ID**: 2506.09522v1
- **论文类型**: 实验论文（新方法/新解码策略）

## 核心贡献（新范式/新指标）

本文提出 **ReVisiT (Referencing Vision Tokens to Guide Text Generation)**，一种简单而高效的 LVLM 解码方法，通过显式利用视觉 token 中蕴含的语义信息来引导文本生成过程，减轻目标幻觉（object hallucination）。

核心创新包括：
1. **自适应词汇约束**: 动态构建上下文相关的候选词汇子集，排除无关 token，使视觉信号集成更加精确。
2. **视觉 token 投影与选择**: 将视觉 token 的隐藏状态投影到文本 token 分布空间，并通过约束散度最小化选择与当前解码语境最相关的视觉 token。
3. **免训练的推理时干预**: 无需额外训练、外部模型或多步推理流程，在解码阶段以极低计算开销（仅增加 1-3% 推理时间）显著增强视觉接地能力。

## 方法

### 自适应上下文相关词汇子集构建

在每个解码时间步 $t$，基于当前输出分布自适应地选择候选词汇子集：

$$V_{\text{cons}}^t = \left\{ w \in V : p(w|h_{T+t-1}^L, V) \geq \alpha \cdot \max_{w'} p(w'|h_{T+t-1}^L, V) \right\}$$

其中 $\alpha \in (0, 1)$ 控制候选词汇的稀疏度。

### 视觉 token 投影与选择

将视觉 token $h_i^j$（$i$ 为视觉 token 索引，$j$ 为候选层）投影到约束词汇空间：

$$p(h_i^j, V_{\text{cons}}^t)$$

通过最小化 Jensen-Shannon Divergence (JSD) 选择最相关的视觉 token：

$$(i^*, j^*) = \arg\min_{i,j} \text{JSD}\left( p(h_{T+t-1}^L, V_{\text{cons}}^t) \parallel p(h_i^j, V_{\text{cons}}^t) \right)$$

### 输出分布修正

通过逐元素相乘融合原始分布与选定视觉 token 分布：

$$p_{\text{fin}}(y_t) \propto \begin{cases}
p_{y_t}(h_{T+t-1}^L, V_{\text{cons}}^t) \times p_{y_t}(h_{i^*}^{j^*}, V_{\text{cons}}^t), & \text{if } y_t \in V_{\text{cons}}^t \\
0, & \text{otherwise}
\end{cases}$$

### 高效实现

视觉 token 在整个词汇空间上的投影在解码开始前一次性预计算并缓存。在每个时间步，只需根据约束子集进行切片和掩码操作，无需额外前向计算。

## 数据集/模型/实验方法

### 评估模型
- **LLaVA-1.5-7B**（广泛使用的基线 LVLM）
- **Qwen2.5-VL-7B**（代表性 SOTA LVLM）
- **DeepSeekVL2-27B**（MoE 架构，验证方法普适性）

### 评估基准与指标
- **CHAIR**: 在 MS COCO 上评估图像描述中的幻觉率（CHAIR$_S$, CHAIR$_I$, Recall）
- **POPE**: 在 MS COCO、A-OKVQA、GQA 上评估二值物体存在判断（Accuracy, Precision, F1）
- **AMBER**: 细粒度幻觉评估（CHAIR, Cover, Hal, Cog）
- **LLaVA-Bench-In-the-Wild**: 开放域定性评估

### 基线方法
- Greedy Decoding, DoLa（对比层解码）, VCD（视觉对比解码）, M3ID（多模态幻觉控制）, SID（自省解码）

### 主要结果

| 方法 | LLaVA-1.5 CHAIR$_S$$\downarrow$ | LLaVA-1.5 CHAIR$_I$$\downarrow$ | Qwen2.5-VL CHAIR$_S$$\downarrow$ | Qwen2.5-VL CHAIR$_I$$\downarrow$ |
|------|------|------|------|------|
| Greedy | 53.8 | 14.66 | 32.2 | 8.51 |
| ReVisiT | **50.6** | **13.43** | **31.6** | **7.56** |

- ReVisiT 在 CHAIR 上使 LLaVA-1.5 的 CHAIR$_S$ 降低 5.95%，CHAIR$_I$ 降低 8.39%
- 在 POPE 上平均准确率 81.80%（LLaVA-1.5）和 84.77%（Qwen2.5-VL），超越所有基线
- 推理速度接近贪婪解码（仅增 2.3-3.5%），而基线方法通常增加 100% 计算量

### 消融实验
- 词汇子集约束至关重要：没有约束时 Recall 从 70.83% 骤降至 0.83%
- Qwen2.5-VL 上使用所有层的视觉 token 优于仅用最后一层
- $\alpha$ 控制候选词汇大小，需根据任务平衡精度与召回

## 连接上下文

本文属于 LVLM 推理时幻觉缓解方向，与 VCD、M3ID、SID 等 "帧内对齐（intra-alignment）" 方法属于同一范畴。不同于这些方法需要额外前向传播（输入扰动、注意力校正等）引入近 2x 计算开销，ReVisiT 的核心洞见是：视觉 token 的中间隐藏状态本身已经包含丰富的语义信息，通过合适的方法提取并利用这些内部的视觉信号，可以在几乎不增加计算开销的情况下增强视觉接地。该工作建立了视觉 token 内部表示与解码质量之间的直接联系，为 LVLM 的高效幻觉缓解提供了新思路。

## 相关论文

### 视觉编码器分析
- 冗余分析：[Investigating Redundancy in MLLMs with Multiple Vision Encoders](Investigating Redundancy in MLLMs with Multiple Vision Encoders.md) - 多编码器冗余
- 层级预训练：[HIVE Hierarchical Pre-Training of Vision Encoders with LLMs](HIVE Hierarchical Pre-Training of Vision Encoders with LLMs.md) - 层级交叉注意力
- 解耦编码：[Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation](Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation.md) - 理解/生成解耦
- 文档专用编码器：[DAVE A VLM Vision Encoder for Document Understanding and Web Agents](DAVE A VLM Vision Encoder for Document Understanding and Web Agents.md)
- 层次结构涌现：[Emergent Visual-Semantic Hierarchies in Image-Text Representations](Emergent Visual-Semantic Hierarchies in Image-Text Representations.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)

### 幻觉缓解
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
