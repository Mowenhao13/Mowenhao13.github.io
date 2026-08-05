---
layout: page
---


## 基本信息

- **标题**: Visual Adversarial Examples Jailbreak Aligned Large Language Models
- **作者**: Xiangyu Qi, Kaixuan Huang, Ashwinee Panda, Mengdi Wang, Prateek Mittal (Princeton University)
- **年份**: 2023
- **arXiv ID**: 2306.13213
- **论文类型**: 攻击方向 - 奠基性工作

## 核心贡献

### 新范式/新发现
- **开创性揭示视觉对抗样本可越狱对齐LLM**: 首次系统性地证明，将视觉模态引入LLM会**不可避免地扩大攻击面**，视觉输入的连续高维特性天然适合对抗攻击。
- **单张对抗图像即可通用越狱**: 在MiniGPT-4上仅用$\epsilon=16/255$的小扰动预算，优化出一张通用对抗图像，能**普遍性地破坏模型的安全机制**，使模型遵循多种有害指令。
- **攻击泛化超越优化语料**: 对抗图像仅在针对特定少数群体的64句贬损语料上优化，却能泛化到其他未被优化的群体（如宗教群体）、产生虚假信息、指导暴力犯罪等，展现了**惊人的跨类别泛化能力**。
- **视觉攻击 > 文本攻击**: 系统比较显示，视觉对抗攻击远比文本对抗攻击更容易实现且效果更强；相同计算量下文本离散优化效果远不如视觉连续优化。

### 新指标
- 提出了针对VLM越狱攻击的**人工评估协议**：对40条有害指令采样10次输出，人工判断是否产生有害内容。
- 使用**RealToxicityPrompts基准**结合Perspective API和Detoxify分类器进行自动化评估，覆盖6类毒性属性。

## 方法

### 攻击目标与威胁模型
攻击者旨在构建一个**通用视觉对抗样本** $x'_{img}$，使其与任意有害文本指令 $x_{text}$ 配对时，均能绕过模型安全机制。

### 公式化攻击

给定毒害语料 $Y := \{y_i\}_{i=1}^m$ 和良性锚点图像 $x_{img}$，对抗样本通过最大化生成毒害内容的概率得到：

$$x'_{img} := \arg\min_{\hat{x}_{img}: \|\hat{x}_{img}-x_{img}\|_\infty \leq \epsilon} \sum_{i=1}^m -\log p\left(y_i \mid [\hat{x}_{img}, \emptyset]\right)$$

其中 $\emptyset$ 表示文本输入为空，$\epsilon$ 为扰动预算。

### 优化算法
- 使用**投影梯度下降（PGD）** 算法优化
- 5000次迭代，batch size为8
- 采用$\ell_\infty$范数约束
- 白盒攻击（假定攻击者可完全访问模型参数）

### 防御分析
提出使用**DiffPure**（基于扩散模型的对抗净化）作为防御手段：
$$x_t = \sqrt{\alpha_t} x_0 + \sqrt{1-\alpha_t} \eta, \quad \eta \sim \mathcal{N}(0, I)$$

通过向图像添加噪声后用Stable Diffusion重建干净图像，可有效降低攻击成功率。

## 数据集/模型/实验方法

### 模型
- **MiniGPT-4 (13B版本)**：结合BLIP-2 ViT视觉编码器和Vicuna LLM
- 文本比较基线：使用HotFlip离散优化生成对抗文本

### 数据集
- **人工构建毒害语料**: 64句针对性别、种族和人类的贬损内容
- **40条手工有害指令**: 覆盖身份攻击、虚假信息/假新闻、暴力/犯罪、X-风险（对人类恶意行为）
- **RealToxicityPrompts挑战性子集**: 1225条文本提示

### 评估方法
- **人工评估**: 对每条指令采样10次输出，计算平均成功率
- **自动评估**: Perspective API和Detoxify分类器评估6类毒性属性

### 实验结果
| 场景 | 基线 | $\epsilon=16/255$ | $\epsilon=32/255$ | 无约束 |
|------|------|----------|----------|----------|
| 身份攻击 | 26.2% | 61.5% | 70.0% | 78.5% |
| 虚假信息 | 48.9% | 58.9% | 74.4% | 91.1% |
| 暴力/犯罪 | 50.1% | 80.0% | 87.3% | 84.0% |
| X-风险 | 20.0% | 50.0% | 73.3% | 63.3% |

## 连接上下文

- 本文是**VLM安全越狱攻击的开创性工作**，后续几乎所有多模态越狱攻击研究（如UMK、MM-SafetyBench、B2T、IDEATOR等）均引用本文。
- 提出的"单图像通用越狱"范式被广泛继承：**UMK**扩展了其思路加入文本后缀联合优化；**MM-SafetyBench**采用非对抗的查询相关图像越狱思路；**B2T**批判其Toxic-Continuation设置并提出更强大的Benign-to-Toxic范式。
- 本文揭示的核心洞见——"图像模态引入安全漏洞"成为VLM安全领域的**基本认知**，**The VLLM Safety Paradox**进一步证实了"图像输入破坏了LLM的安全护栏"这一结论。

## 相关论文

### 攻击方向
- 被批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md) - B2T批判了本文的Toxic-Continuation设置
- 整合升级：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md) - 将视觉和文本对抗统一到多模态交互框架
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md) - 用VLM自动生成越狱提示
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md) - 查询相关图像越狱

### 防御方向
- 表征偏移理论：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM) - 验证了"图像输入破坏安全护栏"
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC) - 进一步分析表征偏移方向
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md) - 利用正交子空间投影防御
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md) - 解码阶段干预
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md) - 精确定位有害tokens

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md) - 证实本文核心洞见
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md) - 四层级框架
- 全面综述：[Safety of Multimodal Large Language Models on Images and Text](Safety of Multimodal Large Language Models on Images and Text.md) - 奠基性综述
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md) - 统一评估
