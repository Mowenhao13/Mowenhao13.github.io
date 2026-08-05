---
layout: page
---

arXiv:2505.16782, Published: 2025-05-22 (v1), Revised: 2025-11-01 (v2)

### 研究问题与动机

本文是一篇关于**潜在思维链推理（Latent Chain-of-Thought, Latent CoT）** 领域的系统性综述。核心研究问题是：如何将LLM的多步推理过程完全迁移到模型的连续隐藏状态空间中执行，从而突破传统显式CoT依赖自然语言离散token带来的表达带宽和语义瓶颈？

**动机**：
- 传统显式CoT存在两大根本局限：(1) **表达冗余**——"so"、"the"等填充token大量消耗计算资源而不提升推理质量；(2) **语义瓶颈**——将连续推理过程强制压缩为离散自然语言词汇导致信息损失，每个token约15比特
- LLM的计算开销实际上主要发生在潜在空间中，强制使用自然语言约束了推理的表达能力
- 潜在推理有望实现更丰富认知表征、更快推理速度、以及并行探索多推理轨迹的能力
- 该方法与当前最强推理模型（DeepSeek-R1、Qwen3、GPT-4/o1等）的内部机制紧密相关

**输入级别**: C（基于arXiv页面摘要、部分HTML正文和完整结构化章节标题，无完整PDF。论文本身为综述，无新实验。）

### 方法与创新

本文构建了**双轴分类体系**：**Token-wise Horizontal（按token水平方向）** vs **Layer-wise Vertical（按层垂直方向）**，提供了统一数学化描述框架。

**1. 统一表征框架**

定义时间步 $t$、层 $l$ 处的激活 $x^{l}_{t} \in \mathbb{R}^d$，以及捕获历史的隐藏状态 $S^{l}_{t}$：

显式CoT：$$y_{t+1} = \text{Decode}(\text{Transform}(x_t, S_t))$$

潜在CoT（消除解码步骤）：$$z_{t+1} = \text{Transform}(z_t, S_t) $$

**Token-wise Horizontal（第3节）**——沿序列维度生成潜在思维：

- **表征初始化**：使用隐藏状态（如Coconut、CODI、LatentSeek、System-1.5）、加权嵌入（如Soft Thinking、MoT-G、CoLaR）、或特殊向量（如Token Assorted、LightThinker、CoCoMix）
- **模型优化**：分为预训练阶段（如Pythia Arch、CoCoMix）和后训练阶段（SFT间接/直接监督、RL方法）
- **推理探索**：顺序缩放（LatentSeek、System-1.5）和并行缩放（PCCoT、KaVa、LTA-Thinker）

**Layer-wise Vertical（第4节）**——沿层深度方向迭代计算：

- **Encoder类**：RELAY、HRM等
- **Decoder类**：CoTFormer、Huginn、LTO、ITT、Pondering LM、MoR等，进一步分为自适应深度循环和潜在语义监督两类

**5. 内部分析方法**

该文还系统综述了理解潜在推理机制的方法：
- **外部行为分析**：任务准确率、缩放曲线、推理轨迹研究
- **内部机制分析**：
  - 理论分析：潜在CoT与显式CoT计算容量的形式化比较（Zhu et al.、Gozeten et al.等）
  - 经验分析：通过logit lens等工具探测隐藏状态（Lindsey et al.、Hou et al.等），发现混合结论——部分研究表明模型确实在潜在空间中进行抽象推理，另一些研究则质疑隐藏状态是否真正包含超越显式token的推理内容

**6. 应用场景**
- 文本推理（数学、代码、常识推理）
- 多模态推理与生成（视觉：Heima、SSR、LVR；语音：XS-CoT；统一多模态：LatentLM）
- 信息检索与推荐系统（Debater、ReaRec、LARES等）

### 实验设置（数据集/模型/指标/结果表格）

本文为**综述论文，不包含新实验**。论文明确指出无独立的实证对比。以下为被引论文中提及的关键数据集和方法：

**提及的基准数据集**：
- 数学推理：GSM8K、MATH、AIME、SVAMP、MAWPS、ASDiv、MultiArith
- 问答推理：HotpotQA、StrategyQA、CommonsenseQA、GPQA
- 综合知识：MMLU、BIG-Bench Hard
- 代码能力：SWE-bench、LiveCodeBench

**提及的代表性模型/架构**：
- Coconut (Hao et al., 2025)、CODI (Shen et al., 2025b)
- CoCoMix (Tack et al., 2025)、CoTFormer (Mohtashami et al., 2025)
- Huginn (Geiping et al., 2025)、Pythia Arch (Zeng et al., 2025a)
- DeepSeek-R1、Qwen3、GPT-4/o1

**代表性定性结果**（来自被引论文，非本文实验）：
- CODI首次在GSM8K上以潜在方法达到显式CoT同等性能
- System-1.5在GSM8K上实现20倍以上推理加速，同时保持CoT准确率
- dKV-Cache实现2-10倍推理加速，dLLM-Cache达9.1倍加速

**实验表格**：无。本文没有任何实验数据表格。

### 优势与局限

**优势**：
1. 建立了该领域首个系统化的双轴分类体系（token-wise水平 vs layer-wise垂直），覆盖了从表征初始化到推理缩放的全链路方法
2. 统一了Transformer深度循环、线性注意力、TTT和扩散模型的理论视角，深入阐述了"深度来源于时间维度优化"的核心洞察
3. 对潜在推理的可解释性（内部机制分析与外部行为分析）给予了充分关注，指出现有机械可解释性结论存在矛盾
4. 广泛覆盖应用场景（文本/多模态/语音/推荐系统）

**局限**：
1. **无定量实验对比**——论文明确声明不提供直接性能比较，导致读者难以评估不同方法的相对优劣；作为综述，这是最大的遗憾
2. 对多语言场景下的潜在推理讨论较少（仅有零星提及），而该方向对跨语言安全对齐有重要意义
3. 对强化学习与潜在推理结合的讨论较浅
4. 部分内容因HTML截断未能获取完整细节（第5-8节内容部分不完整）

### 复现难点

本文为综述，不存在复现问题。综述引用的各主要方法的复现挑战包括：
- 多数方法需要从头预训练或大规模RL训练（计算资源要求极高）
- 自适应深度循环架构、Pre/Loop/Coda结构等需要定制化实现
- 训练稳定性问题（如Infini-attention压缩步数增加后性能下降）

### 对当前研究的启发

1. **潜在推理作为LLM推理核心范式**：DeepSeek-R1、Qwen3已内化CoT，但论文指出真正的latent reasoning可能提供更高的性能上限——这为未来多语言推理模型的设计提供了方向
2. **潜在空间作为多语言推理的桥梁**：潜在推理不受自然语言词汇表限制，天然支持跨语言推理路径，可跳过翻译步骤直接语义空间推理。与此相关，参见已存论文 [Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary](Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary.md) 和 [Rethinking the Multilingual Reasoning Gap with Layer Swap_summary](Rethinking the Multilingual Reasoning Gap with Layer Swap_summary.md)
3. **可解释性挑战**：潜在推理丧失了中间步的人脑可读性，需要发展新的机械可解释性工具——这与语言无关概念表征的因果验证一脉相承
4. **扩散模型作为空间推理新范式**：将扩散模型重新定义为"空间推理"，为结合AR自回归生成与扩散全局规划提供了理论依据
5. **TTT作为推理深度扩展器**："time for depth"统一视角为推理时计算扩展提供了新的scaling方向

### 分类标签

**主题**: Latent_Space_Reasoning

**关键词**: Latent Chain-of-Thought, Latent Reasoning, 潜在空间推理, 隐藏状态推理, Survey

**关联论文**: [Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary](Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary.md), [Rethinking the Multilingual Reasoning Gap with Layer Swap_summary](Rethinking the Multilingual Reasoning Gap with Layer Swap_summary.md), [A Survey on Latent Reasoning](A Survey on Latent Reasoning.md)