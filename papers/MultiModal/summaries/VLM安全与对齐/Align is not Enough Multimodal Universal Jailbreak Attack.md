---
layout: page
---


## 基本信息

- **标题**: Align is not Enough: Multimodal Universal Jailbreak Attack against Multimodal Large Language Models
- **作者**: Youze Wang, Wenbo Hu, Yinpeng Dong, Jing Liu, Hanwang Zhang, Richang Hong (合肥工业大学、清华大学、中国科学院自动化所、南洋理工大学)
- **年份**: 2025
- **arXiv ID**: 2506.01307
- **论文类型**: 攻击方向 - 跨模态攻击

## 核心贡献

### 新范式/新发现
- **首次系统研究跨模态交互的安全风险**: 现有工作单独攻击图像或文本模态，忽略了多模态交互中的**关键安全漏洞**。本文证明，攻击信息可在图像和文本之间传播，绕过针对单模态设计的防御机制。
- **提出迭代多模态交互越狱框架**: 通过交替使用一种模态作为监督信号来优化另一种模态，将越狱信息分布在对抗图像和后缀中，实现更强的攻击效果和迁移性。
- **方差调优迁移策略**: 借鉴分类任务中的对抗迁移方法，通过采样邻域梯度来稳定更新方向，避免过拟合替代模型，显著提升跨模型迁移能力。
- **多模态上下文越狱**: 首次研究了多模态上下文学习场景下的越狱攻击，发现上下文样本数量增加可提升ASR。

### 新指标
- 同时使用**ASR**（关键词匹配检测拒答）和**ASR-G**（GPT-4评估响应质量），指出ASR可能高估攻击成功率——模型虽未拒答但生成内容可能不满足恶意指令。

## 方法

### 攻击目标
寻找通用对抗后缀 $s'$ 和图像 $x'$，使得对任意有害用户提示 $q$，MLLM生成相关有害输出而不拒绝。

### 对抗损失
$$\mathcal{L}_{adv} = \frac{1}{l}\sum_{i=1}^l \log p\left(y_i \mid (x', C(q:s')), y_1, ..., y_{(i-1)}\right)$$

### 对抗图像优化
$$\max \sum_{i=0}^n \log(p(Y_i \mid (x', C(Q_i:s'))))$$
使用PGD优化，结合**方差调优**稳定梯度：
$$V(x') = \frac{1}{K}\sum_{j=1}^K \nabla_{x'} \mathcal{L}_{adv}((x'_j, C(Q:s'), Y)) - \nabla_{x'} \mathcal{L}_{adv}((x', C(Q:s'), Y))$$
其中 $x'_j = x' + r_j$, $r_j \sim U[-( \beta \cdot \epsilon)^d, (\beta \cdot \epsilon)^d]$

### 对抗后缀优化
采用GCG的贪心坐标梯度搜索，同样引入方差调优：
$$V(e_{s'}) = \frac{1}{M}\sum_{i=1}^M \nabla_{e_{s'}} \mathcal{L}_{adv}((x', C(Q:s'_i), Y)) - \nabla_{e_{s'}} \mathcal{L}_{adv}((x', C(Q:s'), Y))$$

### 迭代多模态联合优化（Algorithm 3）
1. 在对抗图像指导下优化后缀
2. 在对抗后缀指导下优化图像
3. 交替迭代，逐步将越狱信息分布在两种模态中

### 关键设置
- 对抗后缀长度：10个token（GCG为20个）
- 迭代次数：总50次，图像子迭代50次，后缀子迭代20次
- 邻域采样数：5
- 替代模型：LLaVA-7B和MiniGPT-v2-7B

## 数据集/模型/实验方法

### 数据集
- **AdvBench**: 520条有害指令，25条训练，100条测试

### 评估模型（17个MLLM）
**白盒**: LLaVA-7B (Vicuna), MiniGPT-v2-7B (Llama2)
**迁移目标**:
- 7B级别: LLaVA-7B, MiniGPT4-7B, InstructBLIP-7B, Yi-VL-6B, mPLUG-Owl2-7B, MiniCPM-v2.5-8B
- 13B级别: LLaVA-13B, InstructBLIP-13B, LLaVA-NeXT-13B
- 更大模型: Yi-VL-34B, LLaVA-34B, CogVLM-17B
- 闭源: GPT-4O
- 多图像: LLaVA-NeXT-7B, MiniCPM-v2.6-8B, Qwen2-VL-8B

### 实验结果

**白盒设置**:
| 方法 | LLaVA-7B ASR/ASR-G | MiniGPT-v2-7B ASR/ASR-G |
|-----|-------------------|------------------------|
| GCG | 92.0%/75.0% | 99.0%/50.0% |
| Visual-jailbreak | 56.0%/46.0% | 99.0%/45.0% |
| **Ours** | **88.0%/80.0%** | **100.0%/55.0%** |

**黑盒迁移（替代模型LLaVA-7B）**:
- 对MiniGPT4-7B: 88.0%/69.0%（GCG为70.0%/59.0%）
- 对InstructBLIP-7B: 100.0%/77.0%（GCG为99.0%/55.0%）
- 对LLaVA-13B: 68.0%/58.0%（GCG为70.0%/59.0%）
- **后缀仅10个token（GCG需20个），更不易被检测**

## 连接上下文

- 本文是对**Visual Adversarial Examples**（Qi et al.）和**GCG**（Zou et al.）的**多模态整合与升级**：将单模态的视觉对抗攻击和文本对抗攻击统一到一个框架中，并通过跨模态交互实现1+1>2的效果。
- 与**UMK**（Wang et al.）的目标类似（多模态通用越狱），但本文的创新在于**迭代交互优化**和**方差调优迁移策略**。
- 与**IDEATOR**的黑盒红队方法不同，本文是**白盒/灰盒梯度优化**方法，依赖替代模型的梯度信息。
- 本文提出的"Align is not Enough"主题与**The VLLM Safety Paradox**形成呼应——安全对齐本身不足以抵御精心设计的跨模态攻击。
- 评估了17个MLLM，是本文系列中**覆盖模型最广**的工作之一，对闭源模型（GPT-4O）的测试也具有重要意义。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md) - 视觉对抗样本越狱
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md) - B2T范式
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md) - 黑盒方法
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md) - 查询相关图像

### 防御方向
- 表征偏移：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM)
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC)
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md)
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md)
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md)

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md) - 呼应本文主题
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md)
- 全面综述：[Safety of Multimodal Large Language Models on Images and Text](Safety of Multimodal Large Language Models on Images and Text.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
