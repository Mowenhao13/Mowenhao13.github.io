---
layout: page
---


## 基本信息
- **标题**: SafePTR: Token-Level Jailbreak Defense in Multimodal LLMs via Prune-then-Restore Mechanism
- **作者**: Beitao Chen, Xinyu Lyu, Jingkuan Song, Lianli Gao, Heng Tao Shen
- **年份**: 2025
- **arXiv ID**: 2507.01513
- **论文类型**: 防御方向 - token级防御

## 核心贡献（新范式/新指标）
本文首次在**token级别**精确分析了多模态越狱的触发机制，揭示了三个关键发现：（1）仅极少（不到1%）的早期-中间层tokens负责诱导不安全行为；（2）与安全对齐表征的语义偏离越大，越容易触发越狱；（3）这些有害tokens稀疏分布在视觉和文本tokens中。基于此提出**SafePTR**（Safe Prune-then-Restore），一种无需训练的token级防御框架，在易受攻击层剪枝有害tokens，在随后的安全层恢复良性特征。

## 方法

### 有害Token传播分析
1. **Where**（位置分析）：通过逐层消融实验（Layer-wise Intervention Analysis），发现仅需剪枝2-4个连续早期-中间层的有害tokens就能显著降低ASR
2. **How**（机制分析）：越狱样本与安全对齐指令的表征语义距离显著大于安全样本
3. **Which**（token定位）：计算每个token与安全对齐指令表征的语义距离，距离超过阈值的标记为有害token

语义距离计算：
$$S^l = 1 - \cos(V^l, R^l)$$

### Harmful Token Pruning (HTP)
在易受攻击层 $[n, n+\Delta_n)$ 中，计算视觉/指令tokens与安全指令的余弦相似度，选择Top-K最偏离的tokens进行剪枝：

$$\sum_{y \notin I_p} \cos(v_y, s_M) > \sum_{x \in I_p} \cos(v_x, s_M)$$

### Benign Features Restoration (BFR)
在后续安全层中，从并行分支中恢复被剪枝的良性tokens：

$$BFR(\hat{H}_{img}^{n+\Delta_n-1}, H_{img}^{n+\Delta_n-1}) = \{(h_i, i)|h_i = \begin{cases} \hat{v}_i, & i \in I_p \\ v_i, & i \in \hat{I}_p \end{cases}\}$$

## 数据集/模型/实验方法
- **安全评估**：JailbreakV-28K（文本驱动越狱）、MM-SafetyBench（图像驱动越狱，6个禁止类别）、FigStep（排版攻击，10个类别）
- **效用评估**：MME（13个视觉推理任务）、MM-Vet（7个能力类别）
- **模型**：LLaVA-1.5-7B、MiniGPT-4-7B、DeepSeek-VL2-Tiny
- **基线**：FigStep、CoCA、ECSO、AdaShield、Immune
- **评估指标**：Attack Success Rate (ASR)、训练数据量(K)、推理延迟(sec/sample)
- **超参数**：Top-K比例=10%（经验最优值），不同模型易受攻击层范围不同（LLaVA: [7,9)、DeepSeek-VL2: [4,6)、MiniGPT-4: [7,9)）

## 连接上下文
SafePTR与其他防御方法的本质区别在于**粒度**：
- CMRM/ShiftDC/VLM-Guard为**层级别表征干预**（对所有tokens统一操作）
- Immune为**解码级别干预**（修改token生成概率）
- SafePTR为**token级别干预**（精确定位和剪枝特定有害tokens）

SafePTR的关键创新在于揭示"不到1%的有害tokens即可触发越狱"，这与注意力沉溺现象（attention sinks）相关。Prune-then-Restore的设计通过保存良性tokens避免了其他方法常见的安全-效用权衡问题。局限：需要访问中间隐藏状态，不适用于黑盒模型。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md)
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md)
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md)
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md)
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md)

### 防御方向
- 表征偏移：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM) - 层级别
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC) - 层级别
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md) - 层级别
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md) - 解码级别

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md)
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
