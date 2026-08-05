---
layout: page
---


## 基本信息
- **标题**: Safety of Multimodal Large Language Models on Images and Texts
- **作者**: Xin Liu, Yichen Zhu, Yunshi Lan, Chao Yang, Yu Qiao
- **年份**: 2024
- **arXiv ID**: 2402.00357
- **论文类型**: 综述 - 全面综述

## 核心贡献（新范式/新指标）
本文是首个系统性地针对MLLM在图像和文本上的安全性进行全面综述的工作。文章从评估（Evaluation）、攻击（Attack）和防御（Defense）三个维度系统梳理了当前研究进展，并总结了图像模态带来的三大安全风险：（1）对抗性扰动可以低成本获得令人满意的攻击效果；（2）MLLM利用OCR能力直接执行视觉指令中的恶意内容；（3）跨模态训练削弱了已对齐LLM的对齐能力。

## 方法

### 评估（Evaluation）
- **数据集分类**：隐私类PrivQA、模因类GOAT-Bench、毒性类ToViLaG；以及利用大模型构建的SafeBench、MM-SafetyBench、Auto-Bench、VLSafe、RTVLM等
- **评估指标**三类：
  - 人工评估：攻击成功率(ASR)、识别成功率(RSR)、防御成功率(DSR)
  - 基于规则评估：预定义目标字符串匹配、分类任务指标(Accuracy, F1)
  - 模型自动评估：Perspective API、Detoxify、GPT-4评判

### 攻击（Attack）
- **恶意图像构建**：
  - 对抗性攻击：PGD优化、端到端可微方法；第三方的注入攻击（不可感知扰动）；工具滥用攻击
  - 视觉提示注入：排印攻击（文字直接嵌入图像中，MLLM的OCR能力会执行）
- **恶意文本构建**：前缀注入、拒绝抑制、假设场景、情感诉求；离散优化

### 防御（Defense）
- **推理时对齐**：系统提示词工程（手动或自动）、Self-Moderation（自我检查与迭代修改）、安全引导向量
- **训练时对齐**：DRESS（利用GPT-4构建自然语言反馈进行强化学习）、MLLM-Protector（轻量级有害内容检测器+输出解毒器）

## 数据集/模型/实验方法
- **评估数据集比较**（7个代表性数据集）：PrivQA、GOAT-Bench、ToViLaG、SafeBench、MM-SafetyBench、Auto-Bench、VLSafe、RTVLM
- **攻击目标模型**：LLaVA、MiniGPT-4、LLaMA-Adapter V2、InstructBLIP、IDEFICS、GPT-4V、Bard等
- **数据来源**：KVQA、InfoSeek、COCO、NSFW数据集、GPT-4生成、Stable Diffusion生成等

## 连接上下文
作为VLM安全领域的奠基性综述，本文为后续的防御方法（如CMRM、ShiftDC、VLM-Guard、Immune、SafePTR等）提供了问题定义和研究框架。文章指出的三个主要风险——对抗性扰动、OCR攻击、跨模态训练导致对齐退化——直接推动了后续研究的方向。特别是"跨模态训练削弱安全对齐"的发现，是CMRM、ShiftDC等论文的理论出发点。文章还系统分析了未来研究方向：可靠安全评估、安全风险深入分析、对齐技术优化、安全与效用平衡。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md)
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md)
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md)
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md)
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md)

### 防御方向
- 表征偏移：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM)
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC)
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md)
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md)
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md)

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md)
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
