---
layout: page
---


## 基本信息
- **标题**: Immune: Improving Safety Against Jailbreaks in Multi-modal LLMs via Inference-Time Alignment
- **作者**: Soumya Suvra Ghosal, Souradip Chakraborty, Vaibhav Singh, Tianrui Guan, Mengdi Wang, Alvaro Velasquez, Ahmad Beirami, Furong Huang, Dinesh Manocha, Amrit Singh Bedi
- **年份**: 2024
- **arXiv ID**: 2411.18688
- **论文类型**: 防御方向 - 推理时防御

## 核心贡献（新范式/新指标）
本文首次从理论角度证明仅靠训练时安全对齐无法防御越狱攻击——将越狱问题重新形式化为**逆对齐问题**（Inverse Alignment），证明对于任意安全对齐模型始终存在一个对抗性提示分布。在此基础上提出**Immune**，一个具有**可证明保证**的推理时防御框架，通过安全奖励模型指导解码过程来防御越狱攻击。

## 方法

### 理论框架：越狱作为逆对齐
将越狱攻击形式化为最大化不安全奖励的逆对齐问题：

$$p_{adv} := \arg\max_p \mathbb{E}_{q\sim p(\cdot|x_{input})}[R_{unsafe}(x_{input}, q)] - \beta KL(p(\cdot|x_{input})||p_0(\cdot|x_{input}))$$

其闭式解为：

$$p_{adv}(q|x) = \frac{p_0(q|x)}{Z(x)}\exp\left(\frac{R_{unsafe}(x,q)}{\beta}\right)$$

### Immune推理时对齐
在解码阶段求解KL正则化的安全对齐问题：

$$\pi_{safe-dec}^*(\cdot|s_t) := \arg\max_\pi \mathbb{E}_{z\sim\pi(\cdot|s_t)}[Q_{safe}(s_t, z)] - \alpha KL(\pi(\cdot|s_t)||\pi_{safe}(\cdot|s_t))$$

闭式解：

$$\pi_{safe-dec}^*(z|s_t) = \frac{\pi_{safe}(z|s_t)}{Y}\exp\left(\frac{Q_{safe}(s_t, z)}{\alpha}\right)$$

### 次优性上界（Theorem 1）
$$\Delta_{sub-gap}(x_{input}) \leq R_{max}\sqrt{KL(p_0(\cdot|x_{input})||p_{adv}(\cdot|x_{input}))} + \alpha KL(\rho^*(\cdot|x_{input})||\rho_{safe}(\cdot|x_{input}))$$

### 算法流程
1. 使用基础MLLM采样top-k token
2. 对每个候选token评估Q_safe（通过安全奖励模型）
3. 计算解码分数并采样下一token

## 数据集/模型/实验方法
- **越狱数据集**：MM-SafetyBench（13个禁止场景）、FigStep（10个禁止主题）、Visual Adversarial Attacks（对抗性图像）、JailbreakV-28K（文本驱动越狱）
- **模型**：LLaVA-1.5-7B、LLaVA-1.6-7B、MiniGPT-4-7B/13B、Qwen-VL-Chat-7B
- **基线**：FigStep（静态安全提示）、AdaShield（自适应提示）、CoCA（宪法校准）
- **评估指标**：Attack Success Rate (ASR)，使用Llama-Guard-3和GPT-4作为评判
- **安全奖励模型**：URM-LLaMa-3.1-8B
- **关键实验**：超参数k（采样子token数）和α（对齐参数）的消融研究

## 连接上下文
Immune与其他防御方法（CMRM、ShiftDC、VLM-Guard、SafePTR）的核心差异在于：
- CMRM/ShiftDC/VLM-Guard均为**表征干预**方法，通过修改隐藏状态来恢复安全对齐
- Immune为**解码干预**方法，通过在解码阶段引入安全奖励模型指导token生成
- SafePTR为**token级干预**方法，精确定位和剪枝有害tokens
- Immune提供了唯一的**理论可证明保证**，其他方法主要为启发式/实验验证

Immune的主要局限：需要额外的前向传播计算安全奖励，推理延迟增加，且依赖外部奖励模型的质量。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md)
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md)
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md)
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md)
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md)

### 防御方向
- 表征偏移：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM) - 同属推理时防御
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC) - 表征干预
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md) - 表征干预
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md) - 更细粒度

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md)
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md)
- 标准化基准：[MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs](MMJ-Bench Comprehensive Study on Jailbreak Attacks and Defenses for MLLMs.md)
