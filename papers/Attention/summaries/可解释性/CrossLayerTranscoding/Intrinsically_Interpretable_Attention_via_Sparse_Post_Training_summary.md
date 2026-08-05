---
layout: page
---

**Title**: Intrinsically Interpretable Attention via Sparse Post-Training
**Authors**: Florent Draye, Anson Lei, Hsiao-Ru Pan, Ingmar Posner, Bernhard Schölkopf
**Year**: 2025
**Venue**: arXiv:2512.05865 (preprint)

**Core Contribution**: 本文提出一种简单的后训练方法，通过稀疏正则化（constrained-loss objective下的GECO算法）使Transformer注意力变得稀疏而不牺牲性能。在7B参数模型上，该方法将注意力连接数降至约0.4%的边，同时保留原始预训练损失，并发现稀疏注意力会导致全局电路简化——任务特定电路涉及更少的组件（注意力头和MLP），且连接边数减少高达100倍。

**Main Method/Findings**:
- **稀疏注意力层**：通过可学习的Bernoulli门控矩阵（Gumbel Softmax可微分采样）实现注意力稀疏化，在训练中正则化期望的边数（L0正则化），推理时与标准softmax注意力形式相同，可直接使用预训练权重。
- **约束优化**：采用GECO算法，在稀疏性约束下最小化损失，使用Lagrange乘子动态调整稀疏性约束强度，确保模型不丢失预测性能。
- **实用技巧**：支持FlashAttention、LoRA微调（7B模型验证）、知识蒸馏辅助训练。
- **电路发现实验**：在GPT-2（124M）和OLMo-7B上，稀疏模型在头级别电路减少1.4x-4.5x，在边级别减少5.4x-97x，稀疏模型选择出的induction head表现出更清晰的复制模式。
- **归因图分析**：使用Cross-Layer Transcoders（CLTs）分析特征级交互，稀疏注意力使注意力归因大幅简化。以"the opposite of 'large' is"为例，稀疏模型仅需5个attention head即可解释80%的归因分数，而稠密模型需要40+个head。

**Relation to other papers in this sub-topic**: 本文与CLT-Forge（2603.21014）共享作者Florent Draye，且使用CLT进行归因图分析，构成该子主题的方法论基础。本文提出的稀疏后训练方法为CLT提供了更清晰的归因分析场景，与PIE框架（2604.16889）在电路发现方面有互补关系——PIE在CLT特征层面做剪枝，本文在注意力层面做稀疏化。

**Source Code Link**: 论文未明确提及GitHub仓库，但作者团队与CLT-Forge库有重叠，可关注https://github.com/LLM-Interp/CLT-Forge

**Tags**: `Sparse_Attention`, `Post-Training`, `Mechanistic_Interpretability`, `Circuit_Discovery`, `Attribution_Graphs`, `Cross-Layer_Transcoders`, `LLM_2025`