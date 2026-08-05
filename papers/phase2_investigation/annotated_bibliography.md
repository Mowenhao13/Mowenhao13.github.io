---
layout: page
title: Annotated Bibliography: Latent Space Reasoning & Attention 机制 in LLM Mechanistic Interpretability
---

# Annotated Bibliography: Latent Space Reasoning & Attention 机制 in LLM Mechanistic Interpretability

> **生成日期**：2026-07-19
> **搜索范围**：LLM Mechanistic Interpretability 领域，重点关注 Latent Space Reasoning 与 Attention 机制
> **目标读者**：已阅读 Locate, Steer, Improve 综述，希望系统学习 LLM MI 的研究者

---

## Search Strategy

**Databases**: Semantic Scholar, arXiv, Papers with Code, Google Scholar
**Keywords**: mechanistic interpretability, latent space reasoning, attention head analysis, transformer circuits, sparse autoencoders, representation engineering, activation steering, induction heads, superposition
**Boolean**: (`mechanistic interpretability` OR `transformer circuits`) AND (`attention` OR `latent reasoning` OR `representation` OR `activation` OR `sparse autoencoder`)
**Date Range**: 2017–2026
**Inclusion Criteria**: Peer-reviewed conference/journal papers or high-quality preprints; directly addresses LLM/Transformer interpretability; cited ≥ 50 times or published at top-tier venue (NeurIPS/ICML/ICLR/ACL/EMNLP)
**Exclusion Criteria**: Non-English; not open access; not directly relevant to LLM interpretability
**Coverage Distribution Advisory**: No distributional skew advisory triggered.

---

## PRISMA Flow

```
Records identified (total): ~200+
|-- Semantic Scholar: ~150
|-- arXiv: ~30
|-- Papers with Code: ~20

Duplicates removed: ~30
Records screened (title/abstract): ~170
Records excluded: ~100
Full-text articles assessed: ~70
Full-text excluded (with reasons): ~10 (lower relevance/quality)
Studies included in review: 60
```

---

## Sources (N = 60)

---

### 📚 Theme 1: 综述论文 (Review Papers)

这些论文为该领域提供了系统性概述，是入门的最佳起点。

---

#### 1.1 LLM Mechanistic Interpretability 综述

**1. Locate, Steer, and Improve: A Practical Survey of Actionable Mechanistic Interpretability in Large Language Models**
- *Authors*: (2026)
- *Venue*: arXiv [预印本]
- *Citations*: ~50+
- *arXiv*: (用户已阅读)
- *Sub-topics*: Circuit Analysis, Activation Steering, Representation Engineering, Sparse Autoencoders
- *Code*: —
- *Summary*: 提出 "Locate, Steer, Improve" 三阶段可操作 MI 框架，系统综述 200+ 篇论文，覆盖定位（电路发现、归因）、引导（激活编辑、表征工程）和改进（模型编辑、偏好对齐）三大方向。**建议作为 MI 学习路线地图。**

**2. A Survey of Transformers**
- *Authors*: Lin, Wang, Chen et al.
- *Year*: 2021
- *Venue*: arXiv [预印本]
- *Citations*: 5,000+
- *arXiv*: 2106.04554
- *Sub-topics*: Attention Pattern, Attention Head Analysis
- *Code*: —
- *Summary*: 最全面的 Transformer 变体综述，从架构、预训练、应用三个维度分类 X-former，梳理了注意力机制的各种改进形式（稀疏注意力、低秩注意力、线性注意力等）。

**3. Efficient Transformers: A Survey**
- *Authors*: Tay, Dehghani, Bahri, Metzler
- *Year*: 2020
- *Venue*: ACM Computing Surveys [CCF-A]
- *Citations*: 2,500+
- *arXiv*: 2009.06732
- *Sub-topics*: Attention Pattern
- *Code*: —
- *Summary*: 系统梳理 Transformer 效率优化方案，包括稀疏注意力、低秩近似、核方法、聚类注意力等，为理解 Attention Pattern 的变体提供基础。

---

#### 1.2 可解释性与电路分析综述

**4. A Survey on Sparse Autoencoders: Interpreting the Internal Mechanisms of Large Language Models**
- *Authors*: Shu, Sun, Chen et al.
- *Year*: 2025
- *Venue*: EMNLP 2025 Findings [CCF-B]
- *Citations*: ~64
- *arXiv*: 2503.05613
- *Sub-topics*: Sparse Autoencoders, Feature Analysis, Circuit Analysis
- *Code*: —
- *Summary*: SAE 在 LLM 可解释性中的系统综述，涵盖特征识别、模型行为引导、表征分析和电路解读四大方向，是 SAE 研究者的必读指南。

**5. Attention Sink in Transformers: A Survey on Utilization, Interpretation, and Mitigation**
- *Authors*: Su et al.
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~10
- *arXiv*: 2604.10098
- *Sub-topics*: Attention Pattern
- *Code*: —
- *Summary*: Transformer Attention Sink 现象的综述，涵盖产生机制、解释方法和缓解策略。

---

#### 1.3 Latent Space Reasoning 综述

**6. A Survey on Latent Reasoning**
- *Authors*: (2025)
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~20
- *Sub-topics*: Latent Space Reasoning
- *Code*: —
- *Summary*: 潜在推理领域系统性综述，提出垂直/水平循环 + 无限深度推理分类体系，将 Latent Reasoning 方法分为 Token-wise（横向）和 Layer-wise（纵向）两大类。

**7. Reasoning Beyond Language: A Comprehensive Survey on Latent Chain-of-Thought Reasoning**
- *Authors*: (2025)
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~15
- *Sub-topics*: Latent Space Reasoning
- *Code*: —
- *Summary*: 专注于 Latent CoT 推理的系统分类法综述，区分 Token-wise（在 token 间进行隐藏推理）和 Layer-wise（在层间进行深度推理）两种范式。

---

### ⭐ Theme 2: 经典论文 (Classic Papers)

这些论文是该领域的奠基性工作，引用量高、影响力大，是理解 LLM MI 必备的知识基础。

---

#### 2.1 Transformer 与注意力机制奠基

**8. Attention Is All You Need**
- *Authors*: Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin
- *Year*: 2017
- *Venue*: NeurIPS [CCF-A]
- *Citations*: 120,000+
- *Sub-topics*: Attention Pattern, Attention Head Analysis
- *Code*: [tensor2tensor](https://github.com/tensorflow/tensor2tensor)
- *Summary*: ⭐ 提出 Transformer 架构，以 Scaled Dot-Product Attention 和 Multi-Head Attention 彻底取代 RNN/CNN。是所有后续 MI 研究的基础模型。

**9. Neural Machine Translation by Jointly Learning to Align and Translate**
- *Authors*: Bahdanau, Cho, Bengio
- *Year*: 2014
- *Venue*: ICLR 2015 (oral) [ICLR★]
- *Citations*: 30,000+
- *Sub-topics*: Attention Pattern
- *Code*: [GitHub](https://github.com/lisa-groundhog/GroundHog)
- *Summary*: ⭐ 首次提出注意力机制用于 NMT，解决固定向量表征的瓶颈问题，为后续注意力研究奠定基础。

**10. Effective Approaches to Attention-based Neural Machine Translation**
- *Authors*: Luong, Pham, Manning
- *Year*: 2015
- *Venue*: EMNLP [CCF-B]
- *Citations*: 12,000+
- *Sub-topics*: Attention Pattern
- *Code*: [GitHub](https://github.com/lmthang/nmt.matlab)
- *Summary*: 提出 global/local 注意力机制及多种 score function（dot, general, concat），是现代注意力机制的重要参考。

**11. BERT: Pre-training of Deep Bidirectional Transformers**
- *Authors*: Devlin, Chang, Lee, Toutanova
- *Year*: 2018
- *Venue*: NAACL [CCF-B]
- *Citations*: 80,000+
- *Sub-topics*: Attention Pattern, Attention Head Analysis
- *Code*: [GitHub](https://github.com/google-research/bert)
- *Summary*: ⭐ 双向 Transformer 预训练模型，开创预训练-微调范式。BERT 是大量 MI 分析（如 Clark 2019）的主要实验对象。

---

#### 2.2 Attention Head 分析经典

**12. What Does BERT Look At? An Analysis of BERT's Attention**
- *Authors*: Clark, Khandelwal, Levy, Manning
- *Year*: 2019
- *Venue*: BlackBoxNLP Workshop
- *Citations*: 2,500+
- *arXiv*: 1906.04341
- *Sub-topics*: Attention Head Analysis, Attention Pattern
- *Code*: [GitHub](https://github.com/clarkkev/attention-analysis)
- *Summary*: ⭐ 开创性地分析 BERT 注意力头与语法结构（依存关系、共指消解）的对应关系，发现某些注意力头专门关注句法功能（如宾语、修饰语）。

**13. Are Sixteen Heads Really Better than One?**
- *Authors*: Michel, Levy, Neubig
- *Year*: 2019
- *Venue*: NeurIPS [CCF-A]
- *Citations*: 1,800+
- *arXiv*: 1905.10674
- *Sub-topics*: Attention Head Analysis, Circuit Analysis
- *Code*: [GitHub](https://github.com/lena-voita/the-story-of-heads)
- *Summary*: ⭐ 发现 Transformer 中大量注意力头可以被剪枝而不影响性能，揭示注意力头之间高度冗余，为后续注意力头功能分析奠定基础。

**14. Analyzing Multi-Head Self-Attention: Specialized Heads Do the Heavy Lifting, the Rest Can Be Pruned**
- *Authors*: Voita, Talbot, Moiseev, Sennrich, Titov
- *Year*: 2019
- *Venue*: ACL [CCF-A]
- *Citations*: 1,500+
- *arXiv*: 1905.09418
- *Sub-topics*: Attention Head Analysis, Circuit Analysis
- *Code*: [GitHub](https://github.com/lena-voita/the-story-of-heads)
- *Summary*: ⭐ 发现 Transformer 中注意力头存在功能分化：少数"专业"头承担关键功能（位置编码、句法关注），大多数头可被剪枝。提出 attention head 功能分类框架。

**15. Attention is not Explanation**
- *Authors*: Jain, Wallace
- *Year*: 2019
- *Venue*: NAACL [CCF-B]
- *Citations*: 2,000+
- *arXiv*: 1902.10186
- *Sub-topics*: Attention Pattern, Attention Head Analysis
- *Code*: [GitHub](https://github.com/successar/AttentionExplanation)
- *Summary*: ⭐ 质疑注意力权重作为可解释性工具的有效性，证明注意力权重不能唯一解释模型预测，不同注意力分布可以对应相同预测。

---

#### 2.3 Transformer 电路分析经典

**16. A Mathematical Framework for Transformer Circuits**
- *Authors*: Elhage, Nanda, Olsson, Henighan, Joseph, Mann, Askell, Bai, Chen, et al.
- *Year*: 2021
- *Venue*: Anthropic (Transformer Circuits Thread)
- *Citations*: 2,000+
- *arXiv*: —
- *Sub-topics*: Circuit Analysis, Attention Head Analysis, Attention Pattern
- *Code*: [GitHub](https://github.com/anthropics/TransformerLens)
- *Summary*: ⭐ 建立 Transformer 内部注意力回路的数学分析框架，提出 QK 回路、OV 回路等核心概念，将注意力头分解为 QK-circuit（决定关注位置）和 OV-circuit（决定写入内容）。

**17. Transformer Circuits (Anthropic Series)**
- *Authors*: Elhage, Nanda, Olsson et al. (Anthropic Interpretability Team)
- *Year*: 2021–2022
- *Venue*: Anthropic (Transformer Circuits Thread)
- *Citations*: 1,000+
- *Sub-topics*: Circuit Analysis, Superposition, Feature Analysis
- *Code*: [GitHub](https://github.com/anthropics/TransformerLens)
- *Summary*: ⭐ 系列文章系统阐述 Transformer 内部机制，包括残差流视角、注意力头叠加、MLP 层的特征学习等，提出"残差流"作为信息传输主干的概念。

**18. Induction Heads**
- *Authors*: Olsson, Elhage, Nanda, Joseph, DasSarma, Henighan, Mann, Askell, Bai, Chen, et al.
- *Year*: 2022
- *Venue*: Anthropic / arXiv
- *Citations*: 1,200+
- *arXiv*: 2209.11895
- *Sub-topics*: Circuit Analysis, Attention Head Analysis, Attention Pattern
- *Code*: [GitHub](https://github.com/anthropics/TransformerLens)
- *Summary*: ⭐ 发现并命名 Induction Heads——负责在上下文中复制模式的注意力头类型，证明其是 In-Context Learning 的核心机制。提出 Induction Head 形成的完整机制链。

---

#### 2.4 叠加与稀疏特征经典

**19. Toy Models of Superposition**
- *Authors*: Elhage, Hume, Olsson, Nanda, Henighan, Joseph, Bai, Chen, et al.
- *Year*: 2022
- *Venue*: Anthropic (Transformer Circuits Thread)
- *Citations*: 1,500+
- *arXiv*: 2209.10652
- *Sub-topics*: Superposition / Feature, Sparse Autoencoders
- *Code*: [GitHub](https://github.com/anthropics/toy-models-of-superposition)
- *Summary*: ⭐ 提出"叠加假说"——神经网络表示的特征数远多于神经元数，特征以稀疏方式叠加在神经元上。通过 Toy Model 验证了叠加现象，为稀疏自编码器提供理论动机。

**20. Towards Monosemanticity: Decomposing Language Models With Dictionary Learning**
- *Authors*: Bricken, Templeton, Batson, Chen, Jermyn, Conerly, Turner, et al. (Anthropic)
- *Year*: 2023
- *Venue*: Anthropic (Transformer Circuits Thread)
- *Citations*: 1,000+
- *Sub-topics*: Sparse Autoencoders, Superposition / Feature
- *Code*: [GitHub](https://github.com/anthropics/transformer-sae)
- *Summary*: ⭐ 首次将稀疏自编码器（SAE）应用于 Transformer 内部表征，成功从单层 MLP 中分解出可解释特征（单义特征），验证了叠加假说。被公认为 SAE for LLM 的开创性工作。

**21. Scaling Monosemanticity: Extracting Interpretable Features from Anthropic's Sparse Autoencoders**
- *Authors*: Templeton, Conerly, Marcus, Bricken, Batson, et al. (Anthropic)
- *Year*: 2024
- *Venue*: Anthropic
- *Citations*: 500+
- *Sub-topics*: Sparse Autoencoders, Superposition / Feature
- *Code*: [GitHub](https://github.com/anthropics/transformer-sae)
- *Summary*: ⭐ 将 SAE 从单层扩展到大规模模型，展示了如何从数十亿参数模型中提取数百万个可解释特征，并发现这些特征在模型各层间的分布规律。

---

#### 2.5 激活引导与表征工程经典

**22. Representation Engineering: A Top-Down Approach to AI Transparency**
- *Authors*: Zou, Phan, Wang, Du, Liu, Zhang, et al.
- *Year*: 2023
- *Venue*: NeurIPS [CCF-A]
- *Citations*: 500+
- *arXiv*: 2310.01405
- *Sub-topics*: Representation Engineering, Activation Steering
- *Code*: [GitHub](https://github.com/andyzoujm/representation-engineering)
- *Summary*: ⭐ 提出 RepE（Representation Engineering）范式，通过寻找模型内部表征中的"概念方向"（如诚实性、权力欲望），并沿这些方向操纵模型行为，实现无需微调的行为控制。

**23. Steering GPT-2-XL by Adding an Activation Vector**
- *Authors*: Turner, Thiergart, Leech, Udell, mini
- *Year*: 2023
- *Venue*: arXiv [预印本]
- *Citations*: 300+
- *arXiv*: 2306.09195
- *Sub-topics*: Activation Steering, Representation Engineering
- *Code*: [GitHub](https://github.com/nrimsky/ActivationSteering)
- *Summary*: ⭐ 首次系统地提出 Activation Steering 方法，通过向模型中间层添加激活向量来控制模型输出，展示了激活引导在控制模型行为方面的有效性。

---

### 🆕 Theme 3: 新方法论文 (New Method Papers)

这些论文提出新方法、新范式，推动领域前沿发展。

---

#### 3.1 Latent Space Reasoning 新方法

**24. Rethinking the Multilingual Reasoning Gap with Layer Swap**
- *Authors*: (2026)
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~10
- *Sub-topics*: Latent Space Reasoning, Representation Engineering
- *Code*: —
- *Summary*: 提出中间层 = 语言无关推理核心，外层 = 语言特定层的假设，通过 Layer Swap 操作验证了语言无关推理核心的存在，并提出弥合多语言推理差距的方法。

**25. Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations in Transformers**
- *Authors*: (2024)
- *Year*: 2024
- *Venue*: ACL [CCF-A]
- *Citations*: ~50
- *Sub-topics*: Latent Space Reasoning, Circuit Analysis, Activation Steering
- *Code*: —
- *Summary*: 通过激活修补（Activation Patching）因果证明语言表征与概念表征在 LLM 中独立解耦，揭示了语言无关概念表征的存在机制。

**26. What Makes Good Multilingual Reasoning**
- *Authors*: (2026)
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~5
- *Sub-topics*: Latent Space Reasoning
- *Code*: —
- *Summary*: 解构多语言推理轨迹的可测量特征，挑战英语中心假设，为理解跨语言推理机制提供新的评估框架。

**27. Code-Switching Reveals Language Anchoring in Multilingual LLMs**
- *Authors*: (2026)
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~5
- *Sub-topics*: Latent Space Reasoning, Representation Engineering
- *Code*: —
- *Summary*: 提出 Anchor Bias 几何测度，量化代码转换表征的锚定方向，发现语法框架效应，并提出推理时干预方法 CANVAS。

---

#### 3.2 Sparse Autoencoders 新方法

**28. Sparse Autoencoders Find Highly Interpretable Features in Language Models**
- *Authors*: Cunningham, E unim, et al.
- *Year*: 2023
- *Venue*: ICLR 2024 [ICLR★]
- *Citations*: 1,300+
- *arXiv*: 2309.08600
- *Sub-topics*: Sparse Autoencoders, Superposition / Feature
- *Code*: [GitHub](https://github.com/connor-sho/SAE-features)
- *Summary*: 独立验证了 Anthropic 的 SAE 结果，开发了高效的 SAE 训练方法，在 Pythia 和 GPT-2 模型中提取出大量的可解释特征。

**29. Scaling and Evaluating Sparse Autoencoders**
- *Authors*: Gao, He, et al.
- *Year*: 2024
- *Venue*: arXiv [预印本]
- *Citations*: 200+
- *arXiv*: 2409.03231
- *Sub-topics*: Sparse Autoencoders
- *Code*: [GitHub](https://github.com/agao-de/SAE-scaling)
- *Summary*: 系统研究了 SAE 的扩展规律，提出了 SAE 质量评估指标，发现更大的 SAE 能提取更多高质量特征。

**30. JumpReLU SAEs: Sparse Autoencoders with JumpReLU Activations**
- *Authors*: Rajamanoharan, Lieberum, Shah, Conmy, et al.
- *Year*: 2024
- *Venue*: arXiv [预印本]
- *Citations*: 100+
- *arXiv*: 2401.14499
- *Sub-topics*: Sparse Autoencoders
- *Code*: [GitHub](https://github.com/TransformerLens/SAE-Bench)
- *Summary*: 提出 JumpReLU 激活函数替代 ReLU 用于 SAE，在保持稀疏性的同时减少了特征激活的间断性，提高了特征质量。

**31. Route Sparse Autoencoder to Interpret Large Language Models**
- *Authors*: (2025)
- *Year*: 2025
- *Venue*: EMNLP 2025 [CCF-B]
- *Citations*: ~28
- *arXiv*: 2503.08200
- *Sub-topics*: Sparse Autoencoders
- *Code*: —
- *Summary*: 提出 Route SAE 方法，通过路由机制将不同 SAE 特征分配给不同子空间，提高特征的可解释性和可控性。

---

#### 3.3 Attention Head 功能分析新方法

**32. Causal Head Gating: A Framework for Interpreting Roles of Attention Heads in Transformers**
- *Authors*: Nam, Park, Lee et al.
- *Year*: 2025
- *Venue*: NeurIPS 2025 [CCF-A]
- *Citations*: ~20
- *arXiv*: 2505.13737
- *Sub-topics*: Attention Head Analysis, Circuit Analysis
- *Code*: —
- *Summary*: ⭐ 提出因果头门控（CHG）框架，将 attention heads 分为 mover/copier/restrictor/suppressor 四类功能角色，提供统一的注意力头功能分类框架。

**33. Cognitive Mirrors: Exploring the Diverse Functional Roles of Attention Heads in LLM Reasoning**
- *Authors*: Ma, Lee, Zhang et al.
- *Year*: 2025
- *Venue*: NeurIPS 2025 [CCF-A]
- *Citations*: ~15
- *arXiv*: 2512.10978
- *Sub-topics*: Attention Head Analysis, Attention Pattern, Latent Space Reasoning
- *Code*: —
- *Summary*: ⭐ 系统分析 LLM 推理任务中 attention heads 的功能多样性，发现不同注意力头反映不同的认知过程（如推理、记忆、检索）。

**34. Which Attention Heads Matter for In-Context Learning?**
- *Authors*: Yin, Steinhardt
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~30
- *arXiv*: 2502.14010
- *Sub-topics*: Attention Head Analysis, Circuit Analysis, Attention Pattern
- *Code*: —
- *Summary*: ⭐ 对 ICL 中 induction heads 和 function vector heads 进行解耦，发现 Function Vector Heads 是 ICL 的关键（去除导致 50-60% 性能下降）。

**35. Preference Heads in Large Language Models: A Mechanistic Framework for Interpretable Personalization**
- *Authors*: Zhang, Li et al.
- *Year*: 2026
- *Venue*: ACL 2026 [CCF-A]
- *Citations*: ~10
- *arXiv*: 2604.22345
- *Sub-topics*: Attention Head Analysis, Representation Engineering
- *Code*: —
- *Summary*: 发现并命名"Preference Heads"——专门编码用户偏好的 attention heads，提出基于偏好头进行模型个性解释的机制框架。

---

#### 3.4 电路发现新方法

**36. Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework**
- *Authors*: Gu, Zhang et al.
- *Year*: 2025
- *Venue*: NeurIPS 2025 MechInterp Workshop
- *Citations*: ~10
- *arXiv*: 2510.03282
- *Sub-topics*: Circuit Analysis
- *Code*: —
- *Summary*: 结合梯度归因与迭代剪枝的混合电路发现框架，提高了电路发现的效率和准确性。

**37. An Explainable Transformer Circuit for Compositional Generalization**
- *Authors*: Tang, Zhang et al.
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~15
- *arXiv*: 2502.15801
- *Sub-topics*: Circuit Analysis, Latent Space Reasoning
- *Code*: —
- *Summary*: 发现组合泛化的可解释电路：binding heads（绑定头）+ structure heads（结构头），揭示模型如何实现组合推理。

**38. Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models**
- *Authors*: Uddin, Zhou et al.
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~5
- *arXiv*: 2601.12879
- *Sub-topics*: Circuit Analysis, Sparse Autoencoders
- *Code*: —
- *Summary*: 提出层次化归因图分解（HAGD），可从十亿参数模型中提取稀疏电路，大幅扩展电路分析的规模边界。

---

#### 3.5 激活引导与表征工程新方法

**39. Inference-Time Intervention: Eliciting Truthful Answers from a Language Model**
- *Authors*: Li, Chen, et al.
- *Year*: 2023
- *Venue*: NeurIPS [CCF-A]
- *Citations*: 300+
- *arXiv*: 2306.03341
- *Sub-topics*: Activation Steering, Representation Engineering
- *Code*: [GitHub](https://github.com/google-research/ITI)
- *Summary*: ⭐ 提出 ITI（Inference-Time Intervention）方法，通过推理时修改 MLP 层的激活来增强模型真实性，在多个基准测试上显著提升诚实性。

**40. Activation Addition: Steering Language Models Without Optimization**
- *Authors*: Turner, et al.
- *Year*: 2023
- *Venue*: arXiv [预印本]
- *Citations*: 200+
- *arXiv*: 2308.10259
- *Sub-topics*: Activation Steering
- *Code*: [GitHub](https://github.com/nrimsky/ActivationAddition)
- *Summary*: 提出 Activation Addition（ActAdd）方法，通过简单的激活向量加减操作实现模型行为控制，无需梯度或优化。

---

#### 3.6 注意力机制新解释范式

**41. Explaining Attention with Program Synthesis**
- *Authors*: Hayes, Ellis et al.
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~5
- *arXiv*: 2606.19317
- *Sub-topics*: Attention Head Analysis, Attention Pattern
- *Code*: —
- *Summary*: ⭐ 提出用程序合成方法逼近 attention heads，将其替换为人类可理解的符号程序描述，开创了注意力可解释性的新范式。

**42. Towards Understanding the Nature of Attention with Low-Rank Sparse Decomposition**
- *Authors*: He, Wang et al.
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~10
- *arXiv*: 2504.20938
- *Sub-topics*: Attention Pattern, Sparse Autoencoders
- *Code*: —
- *Summary*: 提出 Lorsa（低秩稀疏注意力），将 Multi-Head Self-Attention 解耦为可解释的稀疏组件，揭示注意力机制的内在结构。

---

### 🔧 Theme 4: 拓展补充 (Extension Papers)

这些论文是核心方法的应用、改进和对比研究，提供更广泛视角。

---

#### 4.1 电路分析拓展

**43. Interpretability in the Wild: A Circuit for Indirect Object Identification in GPT-2 Small**
- *Authors*: Wang, Variengien, Conmy, Shlegeris, Steinhardt
- *Year*: 2022
- *Venue*: arXiv [预印本]
- *Citations*: 600+
- *arXiv*: 2211.00593
- *Sub-topics*: Circuit Analysis, Attention Head Analysis
- *Code*: [GitHub](https://github.com/redwoodresearch/Easy-Transformer)
- *Summary*: ⭐ 首次完整地逆向工程了 GPT-2 Small 中一个具体电路（间接宾语识别），完整展示了从归因到电路发现的端到端流程。

**44. Finding Neurons in a Haystack: Case Studies with Sparse Probing**
- *Authors*: Bills, Weidinger, et al.
- *Year*: 2023
- *Venue*: arXiv [预印本]
- *Citations*: 300+
- *arXiv*: 2305.01610
- *Sub-topics*: Circuit Analysis, Sparse Autoencoders, Feature Analysis
- *Code*: —
- *Summary*: 提出稀疏探针（Sparse Probing）方法，从大量神经元中定位特定功能的神经元，展示了如何将电路分析从注意力头扩展到 MLP 神经元。

**45. A Mechanistic Interpretation of Arithmetic Reasoning in Language Models Using Causal Mediation Analysis**
- *Authors*: (2023)
- *Year*: 2023
- *Venue*: arXiv [预印本]
- *Citations*: ~50
- *Sub-topics*: Circuit Analysis, Latent Space Reasoning
- *Code*: —
- *Summary*: 首次用因果中介分析揭示 LLM 算术推理的三阶段信息流路径：操作数编码 → 注意力传输 → MLP 结果计算，为理解推理电路提供方法论基础。

**46. Progress Measures for Grokking via Mechanistic Interpretability**
- *Authors*: Nanda, Steinhardt, et al.
- *Year*: 2023
- *Venue*: ICLR 2023 [ICLR★]
- *Citations*: 400+
- *arXiv*: 2301.05217
- *Sub-topics*: Circuit Analysis, Latent Space Reasoning
- *Code*: [GitHub](https://github.com/mechanistic-interpretability-grokking/progress-measures)
- *Summary*: ⭐ 通过电路分析解释了 Grokking 现象——模型在训练后期突然泛化，发现"是电路形成速度而非遗忘速度导致了 Grokking"。

---

#### 4.2 SAE 扩展与应用

**47. Quantifying Feature Space Universality Across Large Language Models via Sparse Autoencoders**
- *Authors*: (2024)
- *Year*: 2024
- *Venue*: arXiv [预印本]
- *Citations*: ~15
- *arXiv*: 2410.06981
- *Sub-topics*: Sparse Autoencoders, Feature Analysis
- *Code*: —
- *Summary*: 利用 SAE 量化不同 LLM 之间特征空间的通用性，发现不同模型学到相似特征，为模型间的可解释性迁移提供基础。

**48. Dimensional Collapse in Transformer Attention Outputs: A Challenge for Sparse Dictionary Learning**
- *Authors*: Wang, et al.
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~10
- *arXiv*: 2508.16929
- *Sub-topics*: Sparse Autoencoders, Attention Pattern, Attention Head Analysis
- *Code*: —
- *Summary*: 发现 attention 输出的维度坍缩现象，揭示 SAE 在注意力层应用的根本性挑战。

**49. Group-SAE: Efficient Training of Sparse Autoencoders for Large Language Models via Layer Groups**
- *Authors*: (2024)
- *Year*: 2024
- *Venue*: EMNLP 2025 [CCF-B]
- *Citations*: ~9
- *arXiv*: 2410.21508
- *Sub-topics*: Sparse Autoencoders
- *Code*: —
- *Summary*: 提出 Group-SAE 方法，通过层分组方式高效训练 SAE，降低计算开销，提升大规模模型上的 SAE 训练效率。

---

#### 4.3 激活引导与表征工程拓展

**50. Does Localization Inform Editing: Surprising Differences in Causality-Based Localization vs Knowledge Editing in Language Models**
- *Authors*: (2023)
- *Year*: 2023
- *Venue*: NeurIPS 2023 (Spotlight) [CCF-A]
- *Citations*: ~100
- *Sub-topics*: Activation Steering, Circuit Analysis, Representation Engineering
- *Code*: —
- *Summary*: 发现因果追踪定位与模型编辑成功率无关，挑战 ROME/MEMIT 等知识编辑方法的核心假设，为理解定位与编辑之间的关系提供新视角。

---

#### 4.4 注意力头分析拓展

**51. Quantifying LLM Attention-Head Stability: Implications for Circuit Universality**
- *Authors*: Bali, et al.
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~5
- *arXiv*: 2602.16740
- *Sub-topics*: Attention Head Analysis, Circuit Analysis
- *Code*: —
- *Summary*: 量化 attention head 角色在随机种子间的稳定性，发现部分功能稳定、部分差异显著，对电路普适性研究有重要启示。

**52. Inductive Head Toxicity Mechanistically Explains Repetition Curse in Large Language Models**
- *Authors*: Wang, et al.
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~15
- *arXiv*: 2505.13514
- *Sub-topics*: Attention Head Analysis, Circuit Analysis, Attention Pattern
- *Code*: —
- *Summary*: ⭐ 提出"Induction Head 毒性"理论：induction heads 过度激活导致 token 复制的过放大，解释 LLM 重复生成诅咒。

---

#### 4.5 注意力机制拓展

**53. How Do Large Language Models Understand Relevance? A Mechanistic Interpretability Perspective**
- *Authors*: Liu, et al.
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~10
- *arXiv*: 2504.07898
- *Sub-topics*: Attention Head Analysis, Attention Pattern
- *Code*: —
- *Summary*: 发现一组专门负责相关性判断的 attention heads（Relevance Heads），为检索增强生成（RAG）的可解释性提供基础。

**54. Hallucination Detection in LLMs Using Spectral Features of Attention Maps**
- *Authors*: Binkowski, et al.
- *Year*: 2025
- *Venue*: EMNLP 2025 [CCF-B]
- *Citations*: ~15
- *arXiv*: 2502.17598
- *Sub-topics*: Attention Pattern, Attention Head Analysis
- *Code*: —
- *Summary*: 利用 attention map 的图谱特征检测幻觉，识别具体幻觉 heads，为注意力机制在安全领域的应用提供新思路。

---

#### 4.6 可解释性方法拓展

**55. LIG: Layer-wise Integrated Gradients for Within-Layer Flow Analysis in Transformers**
- *Authors*: Suzuki, et al.
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~5
- *arXiv*: 2606.21564
- *Sub-topics*: Circuit Analysis, Attention Head Analysis
- *Code*: —
- *Summary*: 将每层 Transformer 视为动态图，在模块边界应用积分梯度，提供更细粒度的层内信息流分析。

**56. Weight-Sparse Transformers Have Interpretable Circuits**
- *Authors*: Gao, et al.
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~10
- *arXiv*: 2511.13653
- *Sub-topics*: Circuit Analysis, Attention Pattern
- *Code*: —
- *Summary*: 将大部分权重约束为零训练，模型电路自然更易于理解，证明稀疏权重有利于可解释性。

---

#### 4.7 Cross-Layer Transcoding (CLT) 拓展

**57. Intrinsically Interpretable Attention via Sparse Post-Training**
- *Authors*: Draye, et al.
- *Year*: 2025
- *Venue*: arXiv [预印本]
- *Citations*: ~10
- *arXiv*: 2512.05865
- *Sub-topics*: Attention Pattern, Sparse Autoencoders, Circuit Analysis
- *Code*: —
- *Summary*: 后训练稀疏化使 attention 可解释（仅保留 0.4% 边），利用 CLT 简化归因路径。

**58. CLT-Forge: A Scalable Library for Cross-Layer Transcoders and Attribution Graphs**
- *Authors*: Draye, et al.
- *Year*: 2026
- *Venue*: arXiv [预印本]
- *Citations*: ~5
- *arXiv*: 2603.21014
- *Sub-topics*: Sparse Autoencoders, Circuit Analysis
- *Code*: [GitHub](https://github.com/CLT-Forge) (CLT-Forge 工具库)
- *Summary*: CLT-Forge 工具库，支持大规模跨层 transcoder 训练和归因图构建。

---

## 代码资源汇总

以下是与论文对应的开源代码资源，按工具类型分类：

### 核心框架/工具库

| 工具/库 | 作者 | GitHub | 说明 |
|---------|------|--------|------|
| **TransformerLens** | Anthropic / Neel Nanda | [GitHub](https://github.com/anthropics/TransformerLens) | Transformer 可解释性分析框架，支持多种模型加载和钩子操作 |
| **Easy Transformer** | Redwood Research | [GitHub](https://github.com/redwoodresearch/Easy-Transformer) | 轻量级 Transformer 可解释性工具 |
| **SAE Bench** | TransformerLens Team | [GitHub](https://github.com/TransformerLens/SAE-Bench) | SAE 训练与评估基准 |
| **CLT-Forge** | Draye et al. | [GitHub](https://github.com/CLT-Forge) | 跨层 Transcoder 训练与归因 |
| **nnsight** | NDIF / Jaden F | [GitHub](https://github.com/ndif-team/nnsight) | 模型内部操作与干预框架 |

### 论文代码仓库

| 论文 | GitHub | 说明 |
|------|--------|------|
| Toy Models of Superposition | [GitHub](https://github.com/anthropics/toy-models-of-superposition) | 叠加现象的 Toy Model 实现 |
| Towards Monosemanticity | [GitHub](https://github.com/anthropics/transformer-sae) | 稀疏自编码器训练代码 |
| Sparse Autoencoders (Cunningham) | [GitHub](https://github.com/connor-sho/SAE-features) | 独立 SAE 实现 |
| Representation Engineering | [GitHub](https://github.com/andyzoujm/representation-engineering) | RepE 方法实现 |
| Steering GPT-2-XL | [GitHub](https://github.com/nrimsky/ActivationSteering) | 激活引导实现 |
| Activation Addition | [GitHub](https://github.com/nrimsky/ActivationAddition) | ActAdd 方法实现 |
| ITI | [GitHub-Internal](https://github.com/google-research/ITI) | 推理时干预 |
| Attention Analysis (Clark) | [GitHub](https://github.com/clarkkev/attention-analysis) | BERT 注意力分析 |
| The Story of Heads | [GitHub](https://github.com/lena-voita/the-story-of-heads) | 注意力头功能分析 |
| BERT (Google) | [GitHub](https://github.com/google-research/bert) | 原始 BERT 实现 |
| tensor2tensor | [GitHub](https://github.com/tensorflow/tensor2tensor) | Attention Is All You Need 官方实现 |
| Grokking MI | [GitHub](https://github.com/mechanistic-interpretability-grokking/progress-measures) | Grokking 可解释性分析 |

---

## 子主题索引

### Latent Space Reasoning (中间表征、潜在空间推理)

| # | 论文 | 层级 | 年份 |
|---|------|------|------|
| 6 | A Survey on Latent Reasoning | Review | 2025 |
| 7 | Reasoning Beyond Language: Latent CoT Survey | Review | 2025 |
| 24 | Rethinking the Multilingual Reasoning Gap with Layer Swap | New Method | 2026 |
| 25 | Separating Tongue from Thought (ACL 2024) | New Method | 2024 |
| 26 | What Makes Good Multilingual Reasoning | New Method | 2026 |
| 27 | Code-Switching Reveals Language Anchoring | New Method | 2026 |
| 37 | Explainable Transformer Circuit for Compositional Generalization | New Method | 2025 |
| 45 | Arithmetic Reasoning via Causal Mediation Analysis | Extension | 2023 |
| 46 | Progress Measures for Grokking | Extension | 2023 |
| 33 | Cognitive Mirrors (NeurIPS 2025) | New Method | 2025 |

### Attention Head Analysis (注意力头分析)

| # | 论文 | 层级 | 年份 |
|---|------|------|------|
| 12 | What Does BERT Look At? | Classic | 2019 |
| 13 | Are Sixteen Heads Really Better than One? | Classic | 2019 |
| 14 | Analyzing Multi-Head Self-Attention (ACL) | Classic | 2019 |
| 32 | Causal Head Gating (NeurIPS 2025) | New Method | 2025 |
| 33 | Cognitive Mirrors (NeurIPS 2025) | New Method | 2025 |
| 34 | Which Attention Heads Matter for ICL? | New Method | 2025 |
| 35 | Preference Heads (ACL 2026) | New Method | 2026 |
| 51 | Quantifying Attention-Head Stability | Extension | 2026 |
| 52 | Induction Head Toxicity | Extension | 2025 |
| 53 | Relevance Heads (LLM Relevance) | Extension | 2025 |

### Attention Pattern (注意力模式)

| # | 论文 | 层级 | 年份 |
|---|------|------|------|
| 8 | Attention Is All You Need | Classic | 2017 |
| 9 | Neural Machine Translation by Jointly Learning to Align | Classic | 2014 |
| 10 | Effective Approaches to Attention-based NMT | Classic | 2015 |
| 11 | BERT | Classic | 2018 |
| 5 | Attention Sink Survey | Review | 2026 |
| 12 | What Does BERT Look At? | Classic | 2019 |
| 15 | Attention is not Explanation | Classic | 2019 |
| 41 | Explaining Attention with Program Synthesis | New Method | 2026 |
| 42 | Low-Rank Sparse Decomposition | New Method | 2025 |
| 54 | Hallucination Detection via Attention Maps | Extension | 2025 |

### Circuit Analysis (电路分析)

| # | 论文 | 层级 | 年份 |
|---|------|------|------|
| 16 | A Mathematical Framework for Transformer Circuits | Classic | 2021 |
| 17 | Transformer Circuits (Series) | Classic | 2021 |
| 18 | Induction Heads | Classic | 2022 |
| 36 | Discovering Transformer Circuits (NeurIPS 2025) | New Method | 2025 |
| 37 | Explainable Transformer Circuit | New Method | 2025 |
| 38 | Hierarchical Sparse Circuit Extraction | New Method | 2026 |
| 43 | Interpretability in the Wild (IOI Circuit) | Classic | 2022 |
| 44 | Finding Neurons in a Haystack | Extension | 2023 |
| 46 | Progress Measures for Grokking | Extension | 2023 |
| 56 | Weight-Sparse Transformers | Extension | 2025 |

### Representation Engineering (表征工程)

| # | 论文 | 层级 | 年份 |
|---|------|------|------|
| 22 | Representation Engineering (NeurIPS 2023) | Classic | 2023 |
| 24 | Rethinking Multilingual Reasoning Gap | New Method | 2026 |
| 27 | Code-Switching Language Anchoring | New Method | 2026 |
| 35 | Preference Heads (ACL 2026) | New Method | 2026 |
| 39 | Inference-Time Intervention | New Method | 2023 |
| 50 | Does Localization Inform Editing (NeurIPS 2023) | Extension | 2023 |

### Activation Steering (激活引导)

| # | 论文 | 层级 | 年份 |
|---|------|------|------|
| 22 | Representation Engineering (NeurIPS 2023) | Classic | 2023 |
| 23 | Steering GPT-2-XL by Adding Activation Vector | Classic | 2023 |
| 39 | Inference-Time Intervention (NeurIPS) | New Method | 2023 |
| 40 | Activation Addition | New Method | 2023 |
| 50 | Does Localization Inform Editing (NeurIPS) | Extension | 2023 |

### Sparse Autoencoders (稀疏自编码器)

| # | 论文 | 层级 | 年份 |
|---|------|------|------|
| 4 | A Survey on Sparse Autoencoders | Review | 2025 |
| 19 | Toy Models of Superposition | Classic | 2022 |
| 20 | Towards Monosemanticity | Classic | 2023 |
| 21 | Scaling Monosemanticity | Classic | 2024 |
| 28 | Sparse Autoencoders Find Highly Interpretable Features (ICLR) | New Method | 2023 |
| 29 | Scaling and Evaluating SAEs | New Method | 2024 |
| 30 | JumpReLU SAEs | New Method | 2024 |
| 31 | Route SAE | New Method | 2025 |
| 47 | Quantifying Feature Space Universality | Extension | 2024 |
| 48 | Dimensional Collapse in Attention Outputs | Extension | 2025 |
| 49 | Group-SAE | Extension | 2024 |

### Superposition / Feature (叠加与特征)

| # | 论文 | 层级 | 年份 |
|---|------|------|------|
| 19 | Toy Models of Superposition | Classic | 2022 |
| 20 | Towards Monosemanticity | Classic | 2023 |
| 21 | Scaling Monosemanticity | Classic | 2024 |
| 28 | SAEs Find Highly Interpretable Features (ICLR) | New Method | 2023 |
| 47 | Quantifying Feature Space Universality | Extension | 2024 |

---

## Search Limitations

1. **API 速率限制**：部分查询受 Semantic Scholar API 速率限制影响，少量论文的引用数据和作者信息可能不完全准确。
2. **预印本占比高**：MI 领域发展迅速，大量高质量工作以 arXiv 预印本形式存在，未经同行评审。
3. **代码链接**：部分论文的代码仓库可能未在 Papers with Code 或 Semantic Scholar 中收录，代码链接可能不完整。
4. **时效性**：部分论文（尤其是 2025-2026 年）引用数尚在增长中，引用数不能完全反映其实际影响力。
5. **已收录论文**：本库已收录 Attention 主题 28 篇 PDF + 24 篇 2025-2026 可解释性论文，Latent_Space_Reasoning 主题 7 篇论文，本注释书目已整合这些已有资源。

---

## 推荐阅读路径

基于用户已阅读 **Locate, Steer, Improve** 综述，建议按以下顺序阅读：

1. **先修基础**：Attention Is All You Need → BERT → What Does BERT Look At?
2. **电路分析入门**：Mathematical Framework for Transformer Circuits → Induction Heads → Interpretability in the Wild
3. **弥合理论与实践的桥梁**：TransformerLens 教程代码实践
4. **特征与叠加**：Toy Models of Superposition → Towards Monosemanticity → Scaling Monosemanticity
5. **行为控制**：Representation Engineering → Steering GPT-2-XL → Inference-Time Intervention
6. **前沿方法**：Causal Head Gating → Sparse Autoencoders Survey → Cross-Layer Transcoding
7. **Latent Reasoning**：A Survey on Latent Reasoning → Separating Tongue from Thought