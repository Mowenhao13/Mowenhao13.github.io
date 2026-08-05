---
layout: page
---


## 基本信息
- **标题**: Jailbreak Attacks and Defenses against Multimodal Generative Models: A Survey
- **作者**: Xuannan Liu, Xing Cui, Peipei Li, Zekun Li, Huaibo Huang, Shuhan Xia, Miaoxuan Zhang, Yueying Zou, Ran He
- **年份**: 2024
- **arXiv ID**: 2411.09259
- **论文类型**: 综述 - 攻防生命周期综述

## 核心贡献（新范式/新指标）
本文首次提出统一的多模态越狱**四层级生命周期框架**（Input-Encoder-Generator-Output），系统性地覆盖了多种模态组合（Any-to-Text、Any-to-Vision、Any-to-Any）下的攻击与防御方法。该框架泛化到文本、图像、音频、视频等多种模态的生成模型，是目前最全面的多模态越狱综述之一。

## 四层级生命周期框架

### 攻击分类

**1. Input级攻击（黑盒）**
- **提示工程**：词替换（手动构造、LLM生成、代理模型生成）、SASP提取系统提示、AutoJailbreak自动化优化、Arondight强化学习
- **图像工程**：文本排版攻击（FigStep）、扩散模型生成（MM-SafetyBench）、逻辑越狱（流程图）
- **角色扮演**：Visual-RolePlay（高风险角色图片）、Voice Jailbreak（虚构叙述）
- 音频攻击：AIAH（将有害词拆分为字母隐藏到音频中）

**2. Encoder级攻击（灰盒/白盒）**
- 基于梯度：优化编码器潜在空间中的对抗性图像（Jailbreak in Pieces、Redteaming Attack）
- 基于搜索：遗传算法（Ring-A-Bell）、随机搜索（RT-Attack）
- 目标函数：$\arg\max_{X_{adv}} \cos(E_M(X_{adv}), E_M(X_{mal}))$

**3. Generator级攻击（白盒）**
- 基于目标响应（IT2T）：Image Hijacks、VisualAdv、HADES、Agent Smith
  $$\arg\min_{X_{adv}} -\sum_{i=1}^m \log(p_\theta(Y_i|X_{adv}))$$
- 基于辅助生成模型（T2I）：P4D、UnlearnDiffAtk
  $$\arg\min_{X_{adv}} \|\epsilon_{\theta_U}(z_t|X_{mal}) - \epsilon_{\theta_V}(z_t|X_{adv})\|^2_2$$
- 基于辅助分类器（IT2I）：MMA-Diffusion

**4. Output级攻击（黑盒）**
- 基于估计：零阶优化（DiffZOO）
- 基于搜索：强化学习引导（SneakyPrompt）

### 防御分类

**判别式防御**（分类任务）：
- Input级：基于统计（Intra-Entropy Gap）、黑名单
- Encoder级：基于嵌入（CIDER、Latent Guard、GuardT2I）
- Generator级：基于嵌入（NEARSIDE）
- Output级：基于查询（JailGuard）、检测器（Espresso）

**变换式防御**（影响生成过程）：
- Input级：前缀防御（AdaShield、BlueSuffix、UNIGUARD）、精化器防御（POSI）
- Encoder级：微调（Sim-CLIP、AdvUnlearn、Safe-CLIP）、引导（Self-discovery）
- Generator级：微调（VLGuard、SafeVLM、BaThe）、概念擦除（Forget-Me-Not、ESD、SalUn、UCE、MACE）、RL安全奖励（ShieldDiff）、引导（InferAligner、SLD、SAFREE）、剪枝（P-ESD、ConceptPrune）
- Output级：精化器（MLLM-Protector、LMIVS）

## 评估

### 主要数据集
- **IT2T**：SafeBench(500)、AdvBench(500)、RedTeam-2K(2,000)、HarmBench(510)、HADES(750)、MM-SafetyBench(5,040)、JailBreakV-28K(28,000)、VLGuard(3,000)
- **T2I**：NSFW-200(200)、MMA(1,000)、VBCDE-100(100)、MPUP(1,200)、I2P(4,703)
- **T2V**：T2VSafetyBench(4,400)

### 评估指标
- ASR（攻击成功率）：$ASR = N_{success}/N_{total}$
- PPL（困惑度）：$PPL(W) = \exp(-\frac{1}{n}\sum_{i=1}^n \log p_\theta(w_i|w_{<i}))$
- FID（Fréchet Inception Distance）
- CLIP Score：$\text{CLIP Score} = \cos(E_{clip}(Y_{adv}), E_{clip}(X_{clean}))$

## 连接上下文
本文是当前最全面的多模态生成模型越狱综述，通过四层级生命周期框架为整个领域提供了**统一的分析范式**。该框架涵盖了论文集中所有论文涉及的防御方法：
- CMRM/ShiftDC/VLM-Guard/SafePTR → Generator级变换式防御（表征干预/引导）
- Immune → Generator级/Output级变换式防御（解码干预）
- MMJ-Bench → 评估框架（对应本文的评估方法论）

本文还指出了未来方向：视频/音频漏洞、交错多模态输入防御、多样化多模态输出攻击、多策略防御机制、防御成本与性能权衡等。

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
- 全面综述：[Safety of Multimodal Large Language Models on Images and Text](Safety of Multimodal Large Language Models on Images and Text.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
