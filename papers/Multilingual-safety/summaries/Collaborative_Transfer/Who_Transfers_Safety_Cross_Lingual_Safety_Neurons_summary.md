---
layout: page
---

> **arXiv**: `2602.01283` | **年份**: 2026 | **Venue**: Preprint

## 核心贡献

提出**跨语言共享安全神经元（Cross-Lingual Shared Safety Neurons, SS-Neurons）** 的概念，从神经元层面揭示了多语言LLM安全对齐的底层机制。核心发现：

1. **单语安全神经元（MS-Neurons）**：在单一语言中驱动安全拒绝行为的稀疏神经元子集（< 0.3%）
2. **跨语言共享安全神经元（SS-Neurons）**：高资源语言（如英语）与低资源语言之间共享的MS-Neurons交集，构成跨语言安全能力迁移的"神经桥"
3. **SS-Neuron扩展策略**：通过手术级（surgical）的神经干预，仅微调英语MS-Neurons（< 0.6%参数），即可显著提升低资源语言的安全性

关键洞见：低资源语言缺乏自主防御机制，严格依赖与英语对齐的SS-Neuron骨干来触发安全拒绝。

## 方法

### 第一阶段：安全神经元识别（Section 3）

#### MS-Neurons识别
通过对比激活分析，对比越狱上下文（$O_{\text{jail}}$）和正常上下文（$O_{\text{norm}}$）下的神经元激活模式：

$$MS_\ell = S_\ell(D_{\text{jail}}) \setminus S_\ell(D_{\text{norm}})$$

其中 $S_\ell(D)$ 为在数据集 $D$ 上层 $\ell$ 的top-p%重要性神经元集合。设置 $p=3\%$ 以平衡敏感性和特异性。

重要性分数定义：
$$\Delta\text{LLM}(x, N) = \|\text{LLM}(x) - \text{LLM}_N(x)\|_2$$
$$I(N, D) = \mathbb{E}_{x \in D}[\Delta\text{LLM}(x, N)]$$

#### SS-Neurons识别
定义为HR（英语）与NHR语言的MS-Neurons交集：
$$SS_\ell = MS_\ell \cap MS_{\text{English}}, \quad \forall \ell \in \text{NHR}$$

因果验证发现：选择性抑制SS-Neurons会导致NHR语言安全性急剧下降（与MS-Neurons抑制效果相当），证明NHR安全严重依赖该共享英语对齐的神经元子空间。

### 第二阶段：SS-Neuron扩展策略（Section 4）

**训练目标**：构建平行安全数据集 $D_{\text{parallel}} = \{(x_{\text{en}}, y_{\text{en}}), (x_{\text{nhr}}, y_{\text{nhr}}), \ldots\}$，通过翻译建立跨语言语义锚点。

使用二进制梯度掩码限制参数更新：
$$\theta_{t+1} = \theta_t - \eta \cdot (M_{\text{mask}} \odot \nabla_\theta \mathcal{L}(D_{\text{parallel}}))$$

其中 $M_{\text{mask}}$ 为仅标识英语MS-Neurons的二进制掩码。更新参数 < 0.6%。

## 数据集与实验

### 模型
- **Qwen3-8B**、**Llama3.1-8B-it**、**Gemma2-9B-it**

### 语言
- HR: 英语（EN）
- NHR: 中文（ZH）、韩语（KO）、泰语（TH）、孟加拉语（BN）、南非语（AF）、尼泊尔语（NE）

### 数据集
- **AdvBench-x**：多语言有害指令数据集
- **MultiJail**：多语言越狱基准数据集（3,150样本）

### 基线方法
- 通用偏好优化：DPO, KTO, ORPO, R-DPO, SimPO
- 推理时防御：SmoothLLM, Self Defense
- 多语言对齐：MPO

### 评估指标
攻击成功率（ASR），使用 GPT-4o 作为自动判官

## 关键发现

1. **神经元稀疏性**：MS-Neurons仅占全部神经元的 < 0.3%，但对其抑制导致ASR剧增25.85%（Qwen3-8B）
2. **SS-Neurons作为安全瓶颈**：NHR语言的SS-Neurons数量与ASR呈强负相关，证明该神经元交集决定跨语言安全性
3. **SOTA性能**：SS-Neuron扩展在Gemma2-9B-it上将MultiJail ASR降至2.78%（MPO: 7.22%），在Llama3.1-8B-it上降至3.41%（MPO: 5.08%）
4. **参数效率**：仅更新0.51-0.57%参数即超越全参数微调和LoRA，且不损失通用能力（MMLU、MGSM保持甚至提升）
5. **零样本迁移**：留一法（leave-one-out）实验证明，即使未在目标语言上训练，安全能力仍能跨语言迁移到未见过的低资源语言
6. **表示对齐**：SS-Neuron扩展后，安全表示从稀疏局部变为密集分布，形成更鲁棒的跨语言"安全桥"

## 关联论文

- [Multilingual_Collaborative_Defense_for_LLMs_summary](Multilingual_Collaborative_Defense_for_LLMs_summary.md)：多语言协作防御框架
- [Evaluating_Mitigating_Linguistic_Discrimination_LDFighter_summary](Evaluating_Mitigating_Linguistic_Discrimination_LDFighter_summary.md)：多语言语言歧视评估与LDFighter缓解方法
- [Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary](Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary.md)：多语言LLM中语言注意力头的机制分析
- [Safety Alignment Should Be Made More Than Just A Few Attention Heads_summary](Safety Alignment Should Be Made More Than Just A Few Attention Heads_summary.md)：安全对齐与注意力头的关系
- [Toward_Robust_Multilingual_Adaptation_of_LLMs_for_Low-Resource_Languages_summary](Toward_Robust_Multilingual_Adaptation_of_LLMs_for_Low-Resource_Languages_summary.md)：低资源语言的多语言鲁棒适配
