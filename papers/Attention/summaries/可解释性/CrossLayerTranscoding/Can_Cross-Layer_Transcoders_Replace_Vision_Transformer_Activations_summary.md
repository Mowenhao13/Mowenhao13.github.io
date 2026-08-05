---
layout: page
---

**Title**: Can Cross-Layer Transcoders Replace Vision Transformer Activations? An Interpretable Perspective on Vision
**Authors**: Gerasimos Chatzoudis, Konstantinos D. Polyzos, Zhuowei Li, Difei Gu, Gemma E. Moran, Hao Wang, Dimitris N. Metaxas
**Year**: 2026
**Venue**: arXiv:2604.13304 (preprint)

**Core Contribution**: 本文首次将Cross-Layer Transcoders (CLTs)系统性地引入视觉领域，作为Vision Transformers (ViTs)的稀疏、可解释替代模型。CLT通过编码器-解码器架构，从前面层的稀疏编码重建每层的MLP后激活，形成加性的、按层分解的最终表示，实现了对ViT内部表示的过程级可解释性。实验证明CLT在CLIP ViT-B/32和ViT-B/16上实现高重建保真度，且在某些场景下保持甚至提升零样本分类准确率。

**Main Method/Findings**:
- **CLT架构**：每个CLT将LayerNorm后的激活编码为稀疏编码zℓ，通过三角解码器（triangular decoder）重建MLP输出ŷℓ。ŷℓ = Σ_{i≤ℓ} W_dec^{i→ℓ} z_i + b_dec^ℓ，严格遵循因果结构。
- **三种稀疏化方案**：JumpReLU、ReLU-Top-k、AbsTop-k。在所有设置下，CLT实现层平均余弦相似度0.92-0.97，R²值0.89-0.95。
- **MLP替换实验**：CLT可以替换MLP块，尤其是后期层或[CLS]token在所有层上，保持甚至在某些情况下提升零样本分类性能。完整的全层全token级联替换仍具挑战性（早期层patch token重建困难）。
- **跨层归因分析**：投影贡献分数显示，patch token呈现强对角主导归因（每层主要解释自身MLP输出），而[CLS]token广泛吸收各层信息。消融实验表明，仅保留top-4/12层即可恢复原始模型准确率，而移除最高分单层导致显著性能下降。

**Relation to other papers in this sub-topic**: 本文是CLT方法论在视觉领域的首个系统应用，与CLT-Forge（2603.21014）的方法论形成互补——CLT-Forge提供训练工具，本文展示视觉域的具体效果。本文的跨层归因分析与Draye等人（2512.05865）的稀疏注意力归因图分析使用相同技术路线，但面向视觉模态。与PIE框架（2604.16889）相比，本文更关注CLT作为替代模型的可行性验证，而非特征剪枝。

**Source Code Link**: 论文未明确提及代码仓库

**Tags**: `Cross-Layer_Transcoders`, `Vision_Transformer`, `CLIP`, `Mechanistic_Interpretability`, `Feature_Attribution`, `MLP_Replacement`, `ViT_2026`