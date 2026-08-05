---
layout: page
---


## 基本信息
- **标题**: Unraveling and Mitigating Safety Alignment Degradation of Vision-Language Models
- **作者**: Qin Liu, Chao Shang, Ling Liu, Nikolaos Pappas, Jie Ma, Neha Anna John, Srikanth Doss, Lluis Marquez, Miguel Ballesteros, Yassine Benajiba
- **年份**: 2024
- **arXiv ID**: 2410.09047
- **论文类型**: 防御方向 - 核心理论分析+防御

## 核心贡献（新范式/新指标）
本文首次从**表征偏移**（Representation Shift）的角度系统分析了VLM的安全对齐退化现象（Safety Alignment Degradation）。核心发现：当引入视觉模态时，多模态输入的表征会偏离LLM backbone原本优化的分布，使得LLM backbone固有的安全对齐能力无法成功转移到新的多模态表征空间。基于此发现提出**CMRM**（Cross-Modality Representation Manipulation），一种推理时的表征干预方法，无需额外训练即可显著恢复VLMs的安全对齐能力，LLaVA-7B的unsafe rate从61.53%降至3.15%。

## 方法

### 表征空间分析
通过PCA对5种输入变体（原始、空白图像、高斯噪声、图文描述、纯文本）的隐藏状态进行可视化，发现纯文本输入与多模态输入的表征在潜在空间中显著分离。

### 表征偏移形式化
将VLM的隐藏状态表示为理想表征受视觉模态影响发生偏移：

$$h(x, img) = h^*(x, img) + \alpha[h(x, img') - h(x)]$$

其中 $img'$ 是无意义图像，$\alpha$ 是混合系数。校准项为：

$$\Delta = \alpha(h_t - h_c)$$

得到最优干预：

$$h^* = h_o + \alpha(h_t - h_c)$$

### CMRM方法
1. **偏移向量提取**（两种方式）：
   - 数据集级别：对全体样本的差值进行PCA降维，取第一主成分
   $$v_{data}^l = PCA(\{h_t^{l(i)} - h_c^{l(i)}\}_{i=1}^N)_{\text{first component}}$$
   - 样本级别：逐个样本计算差值
   $$v_{sample}^{l(i)} = h_t^{l(i)} - h_c^{l(i)}$$

2. **表征操纵**：在每一层将隐藏状态减去提取的偏移向量：
   $$h_{aligned}^{l(i)} = h_o^{l(i)} - v^l$$

## 数据集/模型/实验方法
- **安全评估**：VLSafe（1110对恶意查询+良性图像）、JailbreakLLMs（330个越狱提示+COCO图像）
- **效用评估**：LLaVA-Bench-Coco、ScienceQA
- **模型**：LLaVA-1.5-7B、LLaVA-1.5-13B、ShareGPT4V
- **基线**：VLGuard（训练时防御方法，包括post-hoc和mixed两种设置）
- **评价指标**：Unsafe Rate（由Llama-3.1-8B-Instruct评判）
- **关键实验**：alpha值敏感性分析（最优值1.0）、操纵层级分析（需操纵所有层）、锚定数据集迁移性分析

## 连接上下文
本文与VLM-Guard、ShiftDC同属于"推理时表征干预"类防御方法。区别在于：CMRM的出发点是**表征偏移**（multi-modal vs. text-only之间的整体偏移），通过将多模态表征"拉回"到LLM backbone分布来恢复安全对齐。ShiftDC则进一步将偏移分解为安全相关和安全无关两部分。VLM-Guard利用正交子空间投影。三篇论文共同构成了VLM推理时安全对齐干预的理论支柱。本文的"表征偏移"理论框架为理解VLM安全退化的底层机制提供了关键洞察。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md)
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md)
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md)
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md)
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md)

### 防御方向
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC) - 一脉相承
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md) - 正交子空间投影
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md) - 解码干预
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md) - token级干预

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md)
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
