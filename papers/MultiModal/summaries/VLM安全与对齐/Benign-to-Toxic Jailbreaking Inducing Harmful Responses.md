---
layout: page
---


## 基本信息

- **标题**: Benign-to-Toxic Jailbreaking: Inducing Harmful Responses from Harmless Prompts
- **作者**: Hee-Seon Kim, Minbeom Kim, Wonjun Lee, Kihyun Kim, Changick Kim (KAIST)
- **年份**: 2025
- **arXiv ID**: 2505.21556
- **论文类型**: 攻击方向 - 新攻击范式

## 核心贡献

### 新范式/新发现
- **提出Benign-to-Toxic (B2T) 越狱新范式**: 首次指出广泛使用的**Toxic-Continuation**设置存在根本性缺陷——其优化的是"继续已有毒性的轨迹"而非"打破安全对齐"，因此当输入缺少显式毒性信号时效果骤降。
- **实验证明Toxic-Continuation的局限性**:
  1. 高毒性条件提示本身就能自然诱导模型生成有害续写（即使使用干净图像），说明对抗图像未必起到打破安全对齐的关键作用
  2. Toxic-Continuation方法在显式毒性较高的数据集（如RealToxicityPrompts，71.4%显式毒性）上表现尚可，但在更真实的隐式毒性基准（AdvBench 1.5%、HarmBench 1.5%）上效果急剧下降
- **B2T图像具有更强的鲁棒性**: 在JPEG压缩防御下，B2T图像的攻击效果远强于Toxic-Continuation图像。

### 新方法
- **B2T对抗训练**: 将良性条件（如"Humans need clean air..."）与毒性目标词配对，优化图像使其从安全输入强制生成有害输出。
- **与文本越狱协同**: 提出B2S-GCG（Benign-to-Sure），将B2T范式扩展到文本域，与GCG结合获得更优效果。
- **黑盒迁移性强**: B2T优化的对抗图像在不同LVLM之间具有良好的迁移性。

## 方法

### 公式化

**Toxic-Continuation损失（传统方法）**:
$$\mathcal{L}_{cont}(\delta) = \sum_{k=1}^{N} -\log P\left(t^{cont}_k \mid t^{cont}_0, ..., t^{cont}_{k-1}, T^{system}, T^{user}; I + \delta\right)$$

**Benign-to-Toxic损失（本文提出）**:
$$\mathcal{L}_{b2t}(\delta) = \sum_{k=1}^{N} -\log P\left(t^{toxic}_k \mid t^{benign}_0, ..., t^{benign}_{k-1}, T^{system}, T^{user}; I + \delta\right)$$

**联合优化目标**:
$$\mathcal{L}(\delta) = \begin{cases} \mathcal{L}_{b2t}(\delta), & \text{if } u < \tau \\ \mathcal{L}_{cont}(\delta), & \text{otherwise} \end{cases}, \quad \delta^* = \arg\min_{\|\delta\|_\infty \leq \epsilon} \mathcal{L}(\delta)$$

其中 $u \sim U(0,1)$，$\tau$ 是混合比例参数（实验中 $\tau \in [0.1, 0.2]$）。

### 优化细节
- PGD优化，step size = 1/255，$\epsilon = 32/255$
- 5000次迭代（LLaVA-1.5）或4000次（InstructBLIP）
- 66句毒性句子（Toxic-Continuation）+ 71个良性短语配对132个毒性词目标（B2T）
- 使用空字符串作为用户输入，确保输入提示无关性

## 数据集/模型/实验方法

### 评估基准（5个）
- **AdvBench**: 针对拒绝绕过攻击的标准恶意指令集
- **HarmBench**: 包括化学武器、网络犯罪等直接有害请求
- **JailbreakBench**: 配对良性-有害提示
- **StrongREJECT**: 来自多个数据集和人工红队测试的对抗性提示
- **RealToxicityPrompts**: 衡量模型产生毒性续写的倾向

### 评估模型（4个LVLM）
LLaVA-1.5 (CLIP-ViT/336 + Vicuna-13B), LLaVA (CLIP-ViT/224 + Llama 2-13B), InstructBLIP (EVA-CLIP + Vicuna-13B), MiniGPT-4 (EVA-CLIP + Vicuna-13B)

### 安全评估器
- Perspective API, Detoxify（6类毒性属性，阈值0.5）
- Llama Guard 3（二分类安全/不安全）
- GPT-4o（1-10综合评分，10分为明确违规）

### 主要结果
- B2T在所有基准和所有评估器上均优于Toxic-Continuation，平均提升10-40个百分点
- AdvBench上InstructBLIP的Perspective API ASR从1.2%（干净）和4.8%（Cont.）提升至43.5%（B2T）
- LLaVA-1.5上Llama Guard 3 ASR从16.9%（干净）和25.5%（Cont.）提升至58.6%（B2T）

## 连接上下文

- 本文直接批判并改进了**Visual Adversarial Examples**（Qi et al.）提出的Toxic-Continuation设置，揭示了该范式在隐式毒性输入下的根本缺陷。
- B2T范式是对现有视觉越狱攻击（VAE/UAF、UMK、HKVE、BAP、HADES等）的一次**范式升级**——从"延续毒性"转向"从良性打破对齐"。
- **MM-SafetyBench**使用的查询相关图像攻击可被视为一种非优化的B2T思路，但B2T通过梯度优化实现了更强和更可控的效果。
- B2T与文本越狱（GCG）的协同效果表明，**多模态安全对齐需要同时关注视觉和文本两个维度的"从良到毒"转换能力**。
- JPEG压缩鲁棒性实验表明，B2T图像捕捉到的是更深层的模型安全漏洞，而非表面扰动。

## 相关论文

### 攻击方向
- 批判对象：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md) - 批判其Toxic-Continuation设置
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md) - 跨模态交互攻击
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md) - 用VLM生成越狱提示
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md) - 查询相关图像思路

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
