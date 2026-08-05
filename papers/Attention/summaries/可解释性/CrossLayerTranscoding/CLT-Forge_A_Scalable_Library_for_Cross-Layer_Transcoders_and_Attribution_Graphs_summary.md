---
layout: page
---

**Title**: CLT-Forge: A Scalable Library for Cross-Layer Transcoders and Attribution Graphs
**Authors**: Florent Draye, Abir Harrasse, Vedant Palit, Tung-Yu Wu, Jiarui Liu, Punya Syon Pandey, Roderick Wu, Terry Jingchen Zhang, Zhijing Jin, Bernhard Schölkopf
**Year**: 2026
**Venue**: arXiv:2603.21014 (preprint)

**Core Contribution**: 本文提出CLT-Forge，首个端到端的Cross-Layer Transcoder (CLT)开源库，集成大规模分布式训练（模型分片+压缩激活缓存）、统一自动可解释性流水线（特征分析+解释生成）、归因图计算（基于Circuit-Tracer）和灵活的可视化接口。该库解决了CLT训练计算开销大、后验分析工具碎片化、可视化集成困难等关键瓶颈，采用MIT License开源。

**Main Method/Findings**:
- **可扩展训练基础设施**：支持大规模CLT训练的高效GPU分片（model sharding）、优化的激活缓存（压缩与量化）。CLT参数量随层数和模型维度呈二次增长——对于LLaMA 3.2 1B（L=16, d=2048, e=48），约274亿参数。
- **归因计算**：原生集成Circuit Tracer，高效计算和剪枝特征级归因图。CLT公式：zℓ = σ(W_enc^ℓ hℓ + b_enc^ℓ)，ŷℓ' = Σ_{ℓ≤ℓ'} W_dec^{ℓ→ℓ'} zℓ + b_dec^ℓ'。
- **自动可解释性流水线**（AutoInterp）：统一的特征分析流水线，包括寻找最活跃的输入序列、计算解释和激活统计。
- **可视化接口**：灵活的特征探索、归因图可视化、干预操作界面。
- **训练动态示例**：展示GPT-2 CLT在L0稀疏度、dead features比例、explained variance等方面的训练动态。

**Relation to other papers in this sub-topic**: 本文是该子主题的基础设施论文，与Draye等人（2512.05865）共享第一作者和核心方法。CLT-Forge为所有CLT相关研究提供可复现的工具链，是该子主题的实验基础。Chatzoudis等人（2604.13304）使用CLT的视觉域应用可直接基于CLT-Forge实现。PIE框架（2604.16889）的CLT-native剪枝也可依赖本库。Damianos等人（2605.22902）的VLM换能器分析也可受益于本库的归因图计算能力。

**Source Code Link**: https://github.com/LLM-Interp/CLT-Forge (MIT License)
演示视频：https://www.youtube.com/watch?v=GRzU9g7qsIU

**Tags**: `Cross-Layer_Transcoders`, `Open-Source_Library`, `Mechanistic_Interpretability`, `Attribution_Graphs`, `Distributed_Training`, `AutoInterp`, `LLM_2026`