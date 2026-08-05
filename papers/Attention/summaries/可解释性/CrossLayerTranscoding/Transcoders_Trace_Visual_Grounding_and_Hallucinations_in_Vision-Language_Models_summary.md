---
layout: page
---

**Title**: Transcoders Trace Visual Grounding and Hallucinations in Vision-Language Models
**Authors**: Dimitrios Damianos, Leon Voukoutis, Georgios Skyrianos, Vassilis Katsouros, Georgios Paraskevopoulos
**Year**: 2026
**Venue**: arXiv:2605.22902 (preprint)

**Core Contribution**: 本文首次将Transcoders（换能器，MLP子层的稀疏近似）应用于生成式Vision-Language Models (VLMs)的机制可解释性分析。与Sparse Autoencoders (SAEs)的静态状态分解不同，Transcoders作为函数级因果代理，能够追踪跨模态计算路径。在Gemma 3-4B-IT上，Transcoder归因在patch消融下比SAE产生更强、更稳定的视觉接地token效果，且与语义相关图像区域对齐更好。此外，通过提取幻觉生成的结构性图指标，逻辑回归分类器在AUC 0.68上预测幻觉。

**Main Method/Findings**:
- **SAE vs Transcoder对比**：SAE重建静态表示（y = x），Transcoder重建计算变换（y = MLP(x)）。Transcoder从状态分解转向功能电路追踪，更擅长隔离多模态集成的因果机制。
- **实验设置**：在Gemma 3-4B-IT的每一层集成16倍扩展（40,960特征）的Transcoder和SAE。两阶段训练：200M token纯文本预热 + 300M token多模态阶段（COCO、VQAv2、CLEVR混合）。
- **虚假视觉接地反事实分析**（False Visual Grounding）：确认恢复的路径是视觉-语言交互特有的，而非通用MLP行为。
- **幻觉结构分析**：从电路追踪中提取图结构指标（如贡献熵），发现接地输出与幻觉输出之间存在一致的差异模式。基于这些机制图特征的逻辑回归分类器预测幻觉AUC 0.68。

**Relation to other papers in this sub-topic**: 本文应用Transcoder（而非严格意义上的CLT）进行跨层电路分析，与CLT-Forge（2603.21014）的归因图计算在方法论上互补。与Draye等人（2512.05865）的稀疏注意力+CLT归因图分析相比，本文聚焦多模态场景。本文的幻觉预测分析为PIE框架（2604.16889）的评估阶段提供了新的下游应用场景。

**Source Code Link**: 论文表示代码、训练好的Transcoder和数据集将在接收后发布（Apache 2.0和CC-BY-4.0许可）

**Tags**: `Vision-Language_Models`, `Transcoders`, `Mechanistic_Interpretability`, `Multimodal`, `Hallucination_Detection`, `Circuit_Tracing`, `Gemma_2026`