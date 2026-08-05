---
layout: page
---

### 研究问题与动机

核心问题：多语言大模型（MLLMs）处理语码转换（Code-Switching, CS）输入时，为什么会相对于源语言或目标语言的单语输入出现性能下降？这种性能下降背后是否存在可量化的表征层面的规律？能否利用这一规律设计出推理时的干预方法来提升CS场景下的推理质量？

动机：
- 现实世界中多语用户自然混合使用两种或多种语言进行交流（语码转换），但MLLM在这一场景下性能显著退化
- 现有工作多集中在"探测"层面（probing-based），缺乏从几何表征角度对CS向量与源语/目标语向量间关系的因果性理解
- 若能揭示CS表征在隐藏空间中的"锚定"方向和规律，则有可能在不重新训练模型的前提下设计推理时干预策略
- 与[Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary](Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary.md)从激活修补视角研究语言与概念的可分离性互补，本文从几何锚定角度切入，提出了可操作的推理时干预方案

### 方法与创新

**新范式：Anchor Bias**

本文提出一个名为 **Anchor Bias** 的几何测度，用以量化CS隐藏状态相对于其源语言和目标语言对应表示的锚定方向。Anchor Bias 的定义依赖于给定某层 $l$ 的CS隐藏状态 $h_{CS}^l$、源语言单语隐藏状态 $h_{src}^l$ 和目标语言单语隐藏状态 $h_{tgt}^l$：

$$
\text{Anchor Bias}^l(h_{CS}^l, h_{src}^l, h_{tgt}^l) = \frac{\|h_{CS}^l - h_{tgt}^l\|_2 - \|h_{CS}^l - h_{src}^l\|_2}{\|h_{src}^l - h_{tgt}^l\|_2 + \epsilon}
$$

取值在 $[-1, 1]$ 之间：正偏向源语言锚定，负偏向目标语言锚定。$\epsilon$ 为防止除零的极小常数。

**新范式：Grammar-Frame Effect（语法框架效应）**

作者设计了受控的语法强制CS数据集（语法结构按照某一种语言的语法框架，但词汇从另一种语言替换），发现：
- 源语言框架（source-framed）的CS：Anchor Bias始终为正，即CS表征锚定在源语言一侧
- 目标语言框架（target-framed）的CS：Anchor Bias偏向目标语言，且伴随更大的QA精度下降

这种"语法框架效应"在不同语言对和不同MLLM中一致出现，表明CS退化的根源在于表征空间中源/目标语言的锚定冲突。

**核心方法创新：CANVAS（Contextual Anchor-based Neural Vector Alignment Steering）**

这是一种推理时（inference-time）干预方法，无需微调或重训练。其核心步骤：

1. **提取画布（Canvas）**：从输入中提取源语言侧的上下文表征作为"画布"，即构建仅含源语言版本输入的隐藏状态序列
2. **软性导向（Soft Steering）**：在Prefill阶段，将目标语言部分的隐藏状态往源语言锚点方向做线性插值引导：

$$
h_{tgt}^{'(l)} = h_{tgt}^{(l)} + \alpha \cdot (h_{canvas}^{(l)} - h_{tgt}^{(l)})
$$

其中 $\alpha$ 是一个可调的插值系数，控制导向强度。$h_{canvas}^{(l)}$ 是源语言侧的"画布"表征。

**关键创新贡献**：
- **首次**提出几何级锚定偏差（Anchor Bias）作为CS表征的量化框架
- 发现语法框架效应揭示的语言锚定规律，在英语-韩语、英语-中文、英语-日语等多个语言对中一致
- CANVAS作为一个轻量级推理时干预方案，能一致恢复CS条件下的QA F1分数，且无需模型微调

### 实验设置

**模型**：
- Llama 3 8B（主要实验模型）
- 泛化验证：Llama 3 70B、Qwen 2.5 7B/72B、Aya 23 8B、Gemma 2 9B
- 覆盖英语-韩语、英语-中文、英语-日语等多种语言对

**数据集**：
- 自构建的受控语法强制CS QA数据集（基于英文单语QA数据集进行CS改造）
- 多种语法框架类型（源语言框架 vs 目标语言框架）
- 多样化的CS比率

**评测指标**：
- QA F1（精确匹配+部分匹配）
- Anchor Bias（衡量CS表征的锚定方向）
- 干预成功率（CANVAS对QA F1的恢复程度）

**主要实验结果表**（基于PDF阅读提取）：

| 实验条件 | 源语言单语 F1 | 目标语言单语 F1 | CS源框架 F1 | CS目标框架 F1 | CANVAS干预后 |
|---------|-------------|-------------|------------|------------|------------|
| En-Ko QA | ~92.0 | ~88.5 | ~88.9 | ~74.3 | ~86.2 |
| En-Zh QA | ~91.8 | ~87.2 | ~88.1 | ~71.5 | ~85.9 |
| En-Ja QA | ~90.5 | ~86.1 | ~87.2 | ~70.8 | ~84.6 |

（注：上表数字基于PDF中的主要实验结果图表的估计值，精确数值以原论文为准）

**关键结果**：
- 目标框架CS的退化幅度（约15-20点F1下降）远大于源框架CS（约2-4点F1下降），一致性支持语法框架效应
- CANVAS干预能将目标框架CS的F1恢复约8-10点，部分恢复至接近源框架CS水平
- Anchor Bias在深层（后1/3层）的预测性最强——即模型的顶层表征最能反映CS的锚定方向
- 不同模型规模的Anchor Bias趋势一致，说明锚定效应具有跨模型泛化性

### 优势与局限

**优势**：
- 提出新颖且简洁的几何框架（Anchor Bias），将CS表征研究从现象描述提升到可量化分析
- 发现的语法框架效应具有强跨模型一致性（覆盖8个模型、3个语言对），表明这是MLLM的固有特性而非偶然
- CANVAS作为推理时干预方法，实用性强（无需微调、无额外训练开销）
- 实验设计严谨，包含系统的对照实验：源框架 vs 目标框架、单语基线 vs CS变体

**局限**：
- 受控语法强制CS数据集可能不完全覆盖真实世界语码转换的多样性（后者可能是句级或段落级的混合而非受控语法框架）
- CANVAS的干预系数 $\alpha$ 是手工选择/网格搜索的，缺乏自适应调节机制
- 未深入探讨锚定偏差在更深层的成因（哪些注意力头/MLP负责锚定？）
- 仅评估了QA任务上的性能，未在更广泛的下游任务（如翻译、情感分析）上验证

### 复现难点

- 语法强制CS数据集的构建过程需要语言学专业知识（确保各语言对的语法框架正确），这部分数据构造代码和模板需作者公开
- Anchor Bias 的计算需要在模型每一层提取特定位置的隐藏状态（最后一个token），需要掌握hook机制（如transformers库的PyTorch hook或NNsight）
- CANVAS 的源语言"画布"提取需要动态构建仅含源语言版本的parallel prompt，需要确保提示模板对齐
- 论文提及27张表格和13张图，大量消融实验和超参数敏感性分析，部分细节可能在附录中

### 对当前研究的启发

1. **与机械可解释性结合**：Anchor Bias提供了一种新工具来分析多语言模型的内部表征结构，可结合激活修补（如[Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary](Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary.md)）进一步探究哪些具体注意力头或MLP神经元负责源/目标语言锚定
2. **与多语言推理差距研究对话**：CS场景下的锚定效应可解释多语言推理差距的一部分成因——模型在混合语言输入时表征不稳定。参见[Rethinking the Multilingual Reasoning Gap with Layer Swap_summary](Rethinking the Multilingual Reasoning Gap with Layer Swap_summary.md)讨论的层交换机制和[What Makes Good Multilingual Reasoning](What Makes Good Multilingual Reasoning.md)的推理特征分解
3. **CANVAS的泛化潜力**：推理时干预的思路可推广到更广泛的多语言设置（如低资源语言的翻译辅助推理）
4. **语法框架效应理论意义**：暗示MLLM的内部语言表征与句法结构高度耦合，对理解Transformer的语言表示形成机制有重要意义
5. **结合潜在空间推理视角**：结合[Reasoning Beyond Language_A Comprehensive Survey on Latent Chain-of-Thought Reasoning_deep_note](Reasoning Beyond Language_A Comprehensive Survey on Latent Chain-of-Thought Reasoning_deep_note.md)讨论的潜在空间推理范式，CS锚定效应为在潜在空间中定向操控表征提供了精确的干预目标

### 分类标签

- 主题：Latent_Space_Reasoning
- 关键词：Code-Switching 语码转换、Anchor Bias 锚定偏差、Grammar-Frame Effect 语法框架效应、Multilingual LLM 多语言大模型、Inference-time Intervention 推理时干预