---
layout: page
---

**Authors**: Karan Bali, Jack Stanley, Praneet Suresh, Danilo Bzdok
**Year**: 2026
**Venue**: -
**arXiv**: 2602.16740
**Tags**: Attention头功能分析, Mechanistic Interpretability, 2026, Circuit Universality, Seed Stability

## Core Contribution

系统性地量化了 Transformer 语言模型中注意力头跨随机初始化训练运行的稳定性，并探讨其对电路普遍性（circuit universality）假设的影响。通过在不同规模和深度的 GPT 架构上训练多个随机种子的模型，发现中层注意力头最不稳定且最具代表性差异；深层模型表现出更强的中层发散；不稳定的头在深层中功能更重要；权重衰减优化可显著改善稳定性；残差流相对稳定。

## Main Method / Findings

### 实验设计
- 训练多个 GPT-2 small 变体（2、4、8、12 层），每个架构使用不同随机种子初始化
- 使用注意力分数矩阵（attention score matrices）作为跨种子比较的基础，避免排列对称性问题
- 采用余弦相似度度量跨种子的注意力头表示相似性

### 主要发现
1. **中层头最不稳定**：中层 Transformer 层的注意力头跨随机种子的变异性最大，且最具代表性差异
2. **深度依赖性**：模型越深，中层的跨种子发散越强
3. **功能重要性**：随着层深增加，不稳定的头在各自层内变得功能更重要
4. **权重衰减的作用**：使用 AdamW（解耦权重衰减）显著改善了注意力头的跨种子稳定性
5. **残差流稳健性**：相比注意力头，残差流跨种子更为稳定

### 对电路普遍性的影响
- 训练配置的选择（如优化器、权重衰减）对最终模型性能影响不大，但对注意力头表示的跨实例普遍性有重大影响
- 这挑战了"电路普遍性"的强版本假设——不同随机种子训练的模型可能学习到不同的内部表示，即使性能相似

## Relation to Other Papers

- **Causal Head Gating**：CHG 假设头角色具有跨实例的稳健性，本论文直接检验了这种假设——发现中层头最不稳定，这意味着 CHG 在中层头识别的功能角色可能不完全可靠。两篇论文合在一起提示：功能分析需要报告跨种子稳定性。
- **Cognitive Mirrors**：Cognitive Mirrors 在多模型家族间验证了认知头的一致性，但本论文提醒我们，跨随机种子的头角色可能不稳定，这对认知头的跨模型泛化结论提出了方法论上的限定条件。
- **Which Attention Heads Matter for ICL**：本论文发现头角色随随机种子变化，这意味着 ICL 论文中识别的 FV heads 和 induction heads 可能在不同种子下有所不同，需要验证其稳定性。
- **Preference Heads**：如果偏好头是跨种子不稳定的，那么 DPS 框架的可靠性将取决于是否是特定种子下识别的偏好头在不同种子间保持一致性。
- **Relevance Heads**：本论文的发现对所有基于单模型分析的头功能研究提出了方法论挑战——单次训练的发现可能不具有普遍性。

## Source Code

https://github.com/karanbali/attention_head_seed_stability

## Key Insights

1. 首次系统性地量化了注意力头跨随机种子的稳定性，为电路普遍性假设提供了实验证据。
2. 中层头最不稳定的发现具有重要方法论意义——大多数机械可解释性研究可能高估了这些发现的普遍性。
3. 权重衰减可以显著改善稳定性，这为实践者提供了具体的改进建议。
4. 本论文为"弱普遍性"（功能相似但表示不同）和"强普遍性"（表示相同）的区分提供了实验基础。