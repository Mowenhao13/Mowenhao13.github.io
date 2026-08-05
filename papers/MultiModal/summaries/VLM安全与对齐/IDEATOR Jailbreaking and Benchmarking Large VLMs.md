---
layout: page
---


## 基本信息

- **标题**: IDEATOR: Jailbreaking and Benchmarking Large VLMs Using Themselves
- **作者**: Ruofan Wang, Bo Wang, Xingjun Ma, Yu-Gang Jiang (复旦大学、华为技术有限公司)
- **年份**: 2024
- **arXiv ID**: 2411.00827
- **论文类型**: 攻击方向 - 自生成攻击

## 核心贡献

### 新范式/新发现
- **首次提出"用VLM攻击VLM"的红队范式**: IDEATOR是**首个VLM红队模型**，将VLM转变为自主生成多模态越狱提示的攻击代理，建立了一个全新的攻击范式。
- **训练无关的黑盒攻击**: 无需任何训练或优化，完全在推理阶段通过多轮对话机制实现越狱，且**不需要白盒访问目标模型参数**。
- **广度-深度探索策略**: 通过并行攻击流（广度）和迭代优化（深度）的组合，系统性地探索目标模型的安全漏洞，实现了理论与实验的统一——随着探索广度和深度的增加，ASR单调提升。

### 新方法
- **自动生成多样化多模态越狱数据**: 攻击VLM生成JSON格式的输出（包含分析、图像提示、文本提示），结合Stable Diffusion 3生成高质量越狱图像，实现多样化的攻击策略。
- **Chain-of-Thought推理**: 攻击VLM通过分析先前轮次的受害者响应，逐步优化攻击策略，展现了类似红队专家的迭代优化能力。

## 方法

### 形式化定义

设 $M_A$ 为攻击VLM，$M_V$ 为受害者VLM。

**第一轮攻击**:
$$O^{(1)}_{json} = M_A(\emptyset_I, G) = \{\emptyset_A, P^{(1)}_t, P^{(1)}_i\}$$
$$R_1 = M_V(I_1, P^{(1)}_t)$$

**后续轮次攻击**（第 $n$ 轮）:
$$O^{(n)}_{json} = M_A(I_{n-1}, R_{n-1}) = \{A_n, P^{(n)}_t, P^{(n)}_i\}$$

其中 $A_n$ 是对前一轮响应的分析，$P^{(n)}_t$ 和 $P^{(n)}_i$ 是新一轮的对抗文本提示和图像提示。

### 广度-深度探索算法
- **广度（$N_{breadth}$）**: 启动多个攻击流，探索不同的攻击策略（角色扮演、情感操控、排版攻击等）
- **深度（$N_{depth}$）**: 每个攻击流内部进行多轮迭代优化
- 默认设置：$N_{breadth}=7$，$N_{depth}=3$

### 理论分析
IDEATOR的理论攻击能力极限：
$$A_{IDEATOR} = \lim_{N_{breadth} \to \infty, N_{depth} \to \infty} A_{N_{breadth}, N_{depth}}$$

覆盖现有攻击方法：
$$A_{IDEATOR} \supseteq A_{query-rel+typo} \approx A_{MM-SB}$$
$$A_{IDEATOR} \supseteq \bigcup_i A_i$$

ASR累积效应：
$$ASR_{IDEATOR} = 1 - \prod_{i=1}^n (1 - ASR_i)$$

## 数据集/模型/实验方法

### 安全数据集
- **AdvBench有害行为子集**: 520个有害目标，随机选100个测试
- **VAJM评估集**: 40条有害指令，覆盖身份攻击、虚假信息、暴力/犯罪、X-风险4个类别

### 模型
- **攻击VLM**: MiniGPT-4 (Vicuna-13B版本)
- **受害者VLM**: MiniGPT-4, LLaVA (LLaMA-2-Chat), InstructBLIP (Vicuna)
- **图像生成**: Stable Diffusion 3 Medium

### 实验结果
| 攻击方法 | AdvBench ASR |
|---------|-------------|
| 无攻击 | 35.0% |
| GCG（文本白盒） | 50.0% |
| GCG-V（视觉白盒） | 85.0% |
| VAJM（视觉白盒） | 68.0% |
| UMK（多模态白盒） | 94.0% |
| MM-SafetyBench（黑盒） | 66.0% |
| **IDEATOR（黑盒）** | **94.0%** |

- 迁移攻击：IDEATOR在LLaVA上82.0%、在InstructBLIP上88.0%
- 消融实验：纯文本攻击ASR 86.0%（平均7.46轮），纯图像攻击ASR 85.0%（平均5.84轮），多模态联合攻击ASR 94.0%（平均5.34轮）

## 连接上下文

- IDEATOR将LLM领域的"红队模型"概念（如Chao et al.的PAIR）**首次扩展到VLM领域**，实现了多模态越狱提示的自动生成。
- 与**Visual Adversarial Examples**（Qi et al.）的白盒对抗攻击不同，IDEATOR是完全**黑盒**的训练无关方法；与**MM-SafetyBench**的人工设计流水线相比，IDEATOR实现了流程自动化。
- ADM更接近**B2T**中利用VLM生成越狱文本结合图像生成的思路，但IDEATOR更强调**多轮交互和策略迭代**。
- 与**Align is not Enough**的多模态通用攻击相比，IDEATOR虽然也是跨模态攻击，但采用红队模型策略而非梯度优化方法。
- 本文为VLM安全评估提供了一种**可扩展、自动化、多样化的红队测试框架**，未来工作方向包括构建统一基准数据集和通过强化学习微调专门的红队模型。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md) - 视觉对抗样本越狱
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md) - B2T范式
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md) - 跨模态交互攻击
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md) - 查询相关图像

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
