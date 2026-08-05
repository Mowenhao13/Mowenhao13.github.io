---
layout: page
---


## 基本信息
- **标题**: Understanding and Rectifying Safety Perception Distortion in VLMs
- **作者**: Xiaohan Zou, Jian Kang, George Kesidis, Lu Lin
- **年份**: 2025
- **arXiv ID**: 2502.13095
- **论文类型**: 防御方向 - 安全感知修复

## 核心贡献（新范式/新指标）
本文发现VLM的安全对齐退化源于**安全感知失真**（Safety Perception Distortion）：与传统认知不同，图像模态的引入实际上将激活向"更安全"的方向偏移，导致VLM系统性地高估有害输入的安全性。基于此发现提出**ShiftDC**（Activation Shift Disentanglement and Calibration），一种无需训练的方法，将模态引起的激活偏移分解为安全相关和安全无关两部分，仅移除安全相关分量，从而在恢复安全对齐的同时保留视觉推理能力。

## 方法

### 关键发现（四个观察）
1. VLM在处理多模态输入时无法区分安全和不安全指令（线性探针分类准确率仅约65%）
2. 图像模态引起激活偏移，使VLM倾向于将输入判断为"更安全"
3. 安全偏移与攻击成功率呈正相关——偏移越大，越易越狱
4. 空白图像也能引起安全感知偏移，表明偏移源自视觉模态本身而非语义内容

### ShiftDC方法
**步骤1：提取安全方向**

从纯文本数据集中通过均值差计算安全相关方向向量：

$$s_{D_{tt}^{unsafe} \rightarrow D_{tt}^{safe}}^\ell = \text{ActMean}^\ell(D_{tt}^{safe}) - \text{ActMean}^\ell(D_{tt}^{unsafe})$$

**步骤2：计算模态偏移**

对给定视觉-语言输入 $t_{vl} = [p, i]$ 和文本对照输入 $t_{tt} = [p, c]$（将图像替换为标题），计算模态引起的激活偏移：

$$m_{t_{tt} \rightarrow t_{vl}}^\ell = x^\ell(t_{vl}) - x^\ell(t_{tt})$$

**步骤3：投影分解安全相关分量**

将模态偏移投影到安全方向：

$$\text{proj}_{s^\ell}(m_{t_{tt} \rightarrow t_{vl}}^\ell) = \frac{m_{t_{tt} \rightarrow t_{vl}}^\ell \cdot s^\ell}{\|s^\ell\|^2} s^\ell$$

**步骤4：校准激活**

从原始激活中减去安全相关分量，保留安全无关（视觉语义）分量：

$$\hat{x}^\ell(t_{vl}) = x^\ell(t_{vl}) - \text{proj}_{s^\ell}(m_{t_{tt} \rightarrow t_{vl}}^\ell)$$

## 数据集/模型/实验方法
- **安全评估**：MM-SafetyBench（5040个样本，13个场景）、FigStep（520个样本）
- **效用评估**：MME（感知+认知，2374题）、MM-Vet（6个核心能力）
- **模型**：LLaVA-1.5-7B、LLaVA-1.6-34B、MiniGPT-4-7B、ShareGPT4V-7B、Qwen-VL-7B
- **基线**：ECSO（图像转文本）、AdaShield（防御提示）
- **评估指标**：Attack Success Rate (ASR)，基于拒绝关键词匹配

## 连接上下文
本文与CMRM一脉相承，均从表征空间角度分析VLM安全退化机制。关键差异在于：
- CMRM认为图像引入导致表征"偏移出LLM分布"，通过拉回LLM分布恢复安全
- ShiftDC则认为图像将表征推向"更安全"方向（而非更危险），导致VLM误判安全
- ShiftDC进一步将偏移分解为安全相关和安全无关，实现更精细的干预

这一"安全感知失真"的理论纠正了此前文献中关于表征偏移方向的认知，为更精细的安全对齐干预提供了理论基础。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md)
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md)
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md)
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md)
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md)

### 防御方向
- 表征偏移：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM) - 一脉相承
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md) - 正交子空间投影
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md) - 解码干预
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md) - token级干预

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md)
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
