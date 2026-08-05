---
layout: page
---


## 基本信息

- **标题**: The VLLM Safety Paradox: Dual Ease in Jailbreak Attack and Defense
- **作者**: Yangyang Guo, Fangkai Jiao, Liqiang Nie, Mohan Kankanhalli (新加坡国立大学、南洋理工大学、哈尔滨工业大学(深圳))
- **年份**: 2024
- **arXiv ID**: 2411.08410
- **论文类型**: 攻击方向 - 攻防分析

## 核心贡献

### 新范式/新发现
- **揭示VLLM安全悖论**: 当前VLLM同时存在"攻击容易"和"防御容易"的矛盾现象——简单攻击即可获得高ASR，而简单防御（如安全微调、提示保护）也能将ASR降至接近0，这一悖论动摇了现有基准和防御的可信度。
- **反驳灾难性遗忘假说**: 此前研究认为VLLM易受攻击源于微调导致的安全对齐灾难性遗忘。本文通过T-SNE可视化和特征分析证明，真正的根源在于**图像输入破坏了基础LLM原有的安全护栏（guardrails）**——LLM Base能清晰区分安全/不安全输入，VLLM-Text基本保留此能力，但VLLM-MM（多模态）显著丧失。
- **发现防御过度谨慎问题**: 现有防御机制（如VLGuard、AdaShield）存在严重的**过度谨慎**问题——在良性输入上也倾向于拒绝回答，大幅损害模型的有用性。
- **揭示评估方法的不一致性**: 基于规则的评估（关键词匹配）和基于模型的评估（Llama-Guard）之间存在**仅凭偶然的一致率**（Cohen's kappa接近0），这意味着同一防御方法在不同评估指标下可能得出完全相反的结论。

### 新方法
- **Vision-free Evaluator（LLM-Pipeline）**: 提出利用现有LLM的安全护栏作为VLLM的前置检测器，先由LLM评估指令安全性，再交由VLLM生成响应。该方法在**安全性和有用性之间实现了更好的平衡**。

## 方法

### 攻击分析
- 评估6个最新VLLM在4个越狱数据集上的表现
- 可视化注意力权重分布：VLLM对有害图像的注意力高于无害图像
- T-SNE特征分析：多模态输入下安全/不安全指令的特征边界模糊

### 防御分析
- 研究两种代表性防御：VLGuard（安全微调）和AdaShield-A（提示保护）
- 测量在良性输入下的拒答率来量化过度谨慎程度
- 使用Cohen's kappa统计量衡量不同评估方法之间的一致性

### LLM-Pipeline方法
两步流程：
1. **安全检测**：由LLM（如Llama3.1）评估文本指令的潜在危害
2. **响应生成**：仅当指令通过安全检测后才交由VLLM生成响应

两种变体：
- **Naive方法**：直接使用原始文本指令
- **Scenario方法**：加入场景感知的系统安全提示

对于需要图像理解的任务，使用Qwen2-VL生成图像描述，将视觉信息转化为文本供LLM评估。

## 数据集/模型/实验方法

### 数据集（4个越狱数据集）
- **VLSafe**: 3,000条数据，图像来源MSCOCO
- **FigStep**: 500条数据，排版图像
- **MM-SafetyBench**: 5,040条数据，排版+SD图像
- **VLGuard**: 1,558条数据，排版+真实图像

### 评估模型
- 攻击侧：LLaVA-1.5-Vicuna (7B/13B), LLaVA-NeXT-Mistral-7B, LLaVA-NeXT-Llama3-8B, InternVL2-8B, Qwen2-VL-7B
- 防御侧：Mistral-7B, QWen2.5-14B, Llama3.1-8B, Llama3.1-70B

### 关键发现
- 所有6个VLLM在4个数据集上的ASR均较高（如VLGuard上69.8%-88.6%）
- VLGuard防御后FigStep ASR从90.40%降至0.00%
- 良性字幕提示下，防御模型的拒答率从基线0%飙升至近100%
- 规则评估与Llama-Guard在所有模型/数据集组合上的Cohen's kappa均为负值或接近0

## 连接上下文

- 本文是对整个VLLM安全领域**基准、评估、防御三者可信度的系统性反思**，提出了一系列深刻的问题。
- 与**Visual Adversarial Examples**（Qi et al.）的发现一致——"图像输入是关键漏洞"——但本文从特征分析和注意力机制层面提供了更深层的解释。
- 与**MM-SafetyBench**构建的基准数据集形成对话——本文质疑了在这些基准上"防御轻易成功"的结论是否真实反映了安全能力的提升。
- 对后续工作（如**IDEATOR**、**Align is not Enough**）而言，本文关于评估方法不一致的警示具有重要的方法论意义。
- 本文提出的**LLM-Pipeline**思路为VLLM安全部署提供了一条实用路径：不必为VLLM从零开发安全机制，而是复用LLM已有的强大安全护栏。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md) - 证实核心洞见
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md) - B2T范式
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md) - 呼应主题
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md)
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md) - 引用本文数据集

### 防御方向
- 表征偏移：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM)
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC)
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md)
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md)
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md)

### 分析方向
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md)
- 全面综述：[Safety of Multimodal Large Language Models on Images and Text](Safety of Multimodal Large Language Models on Images and Text.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
