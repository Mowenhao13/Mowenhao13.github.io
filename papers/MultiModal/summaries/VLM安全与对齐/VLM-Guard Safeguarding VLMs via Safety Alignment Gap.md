---
layout: page
---


## 基本信息
- **标题**: VLM-Guard: Safeguarding VLMs via Fulfilling Safety Alignment Gap
- **作者**: Qin Liu, Fei Wang, Chaowei Xiao, Muhao Chen
- **年份**: 2025
- **arXiv ID**: 2502.10486
- **论文类型**: 防御方向 - 推理时干预

## 核心贡献（新范式/新指标）
本文提出VLM的安全挑战源于**模态间隙**（Modality Gap）——图像和文本在共享表征空间中的分离模糊了有害和无害查询之间的区分。基于此观察提出**VLM-Guard**，一种推理时干预策略，利用VLM中的LLM组件作为安全对齐的监督信号，将VLM的表征投影到与安全引导方向（SSD）正交的子空间中，从而弥合VLM与LLM之间的安全对齐差距。

## 方法

### 模态间隙分析
通过PCA可视化发现：空白图像（无语义信息）就能使LLaVA中原本可分的有害/无害查询表征变得混淆，验证了视觉模态引入本身即破坏安全对齐。

### 安全引导方向（SSD）提取
利用100对有害/无害的"How to"查询作为锚定数据集，计算各层最后一token的隐藏状态差异矩阵，通过SVD分解提取安全引导方向：

$$A^l = [h^l(q_1^-), ..., h^l(q_N^-)] - [h^l(q_1^+), ..., h^l(q_N^+)]$$

$$A = U\Sigma V^T$$

SSD $V_{m,l} \in \mathbb{R}^{m \times d}$ 由前m个右奇异向量构成。

### 正交子空间投影
将隐藏状态投影到与SSD正交的子空间中，消除视觉模态的影响：

$$h'^l(q) = h^l(q) - h^l(q)V_{m,l}^T V_{m,l}$$

### 推理时对齐
- 利用二值门控判断输入是否为有害意图（$h^l(q)V_{1,l} > 0$则激活干预）
- 对有害输入沿SSD方向移动隐藏状态以增加拒绝概率：

$$h^*_l(Q) = h_l(Q) + \alpha \cdot g_l \cdot h_l(q)V_{m,l}^T V_{m,l}$$

## 数据集/模型/实验方法
- **锚定数据集**：100对有害/无害"How to"查询（GPT-3.5-turbo生成+人工验证）
- **安全评估**：MaliciousInstruct（100条有害指令）、Jailbreak Instructions（5种越狱模板×20条指令）、MM-Harmful Bench（100条多模态有害指令）
- **评估指标**：Attack Success Rate (ASR)，由LlamaGuard-7b评判；Perplexity (PPL)用于评估响应质量
- **目标模型**：LLaVA-1.5-7B
- **基线**：Self-Reminder、Goal Priority
- **实验设置**：文本查询、文本+空白图像、MM-Bench三种设置

## 连接上下文
VLM-Guard与CMRM和ShiftDC同属推理时表征干预防御，但技术路线不同：
- CMRM关注"整体偏移"（多模态vs纯文本）
- ShiftDC关注"安全感知失真"并分解偏移
- VLM-Guard利用**正交子空间投影**消除视觉模态引入的安全干扰，更强调利用LLM组件的安全对齐能力"监督"VLM

三者共同特征：都利用LLM backbone的固有安全对齐能力，不需要重新训练模型。VLM-Guard的"模态间隙"概念与CMRM的"表征偏移"共存互补，为理解VLM安全退化提供了不同的理论视角。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md)
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md)
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md)
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md)
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md)

### 防御方向
- 表征偏移：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM) - 表征偏移
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC) - 分解偏移
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md) - 解码干预
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md) - token级干预

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md)
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
