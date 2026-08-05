---
layout: page
---

**A circuit for predicting hierarchical structure in-context in Large Language Models**

- **Authors**: Tankred Saanum, Can Demircan, Samuel J. Gershman, Eric Schulz (Harvard University, Helmholtz AI)
- **Year**: 2025
- **Venue**: -
- **arXiv ID**: 2509.21534

**核心贡献**

发现大型语言模型中的 induction heads 可以在上下文学习中学习关注哪些后继 token，当 token 序列具有层级依赖关系时，模型会使用专用的"上下文匹配头"（context matching heads）构建潜在上下文表示，支持 induction heads 的上下文敏感注意。

**主要方法/发现**

1. **任务设计**：构建具有 1 阶、2 阶和 3 阶层级结构的合成 token 序列。1 阶序列每个 token 有唯一后继；2 阶序列引入上下文相关的转移概率；3 阶序列进一步组合 2 阶块。
2. **模型评估**：主要评估 Qwen2.5（0.5B、1.5B、3B），并复现于 Gemma2-2B、Llama3.2-3B、SmolLM3-3B、Qwen3-0.6B。
3. **关键发现**：
   - 所有模型都能通过上下文学习准确预测合成序列，尽管序列不类似自然语言。
   - 诱导头（induction heads）在较深层（later layers）学会上下文敏感的关注，而浅层 induction heads 则保持静态。
   - 消融所有 induction heads 后，0.5B 和 1.5B 模型降至随机水平，3B 模型性能严重下降。
4. **上下文匹配头（Context Matching Heads）**：
   - 发现存在专用注意力头，其表示编码了 2 阶/3 阶块的身份信息（2 阶解码准确率 >90%）。
   - 这些头通过让每个 token 关注其前驱 token，逐步传递远端上下文信息，类似于滑动窗口注意力。
   - 消融这些上下文匹配头会显著降低预测准确率和 induction heads 的上下文学习能力。
5. **自然语言验证**：在自然语言句子（如"San Antonio" vs "San Francisco"）上验证了自适应 induction heads 的上下文敏感关注能力。

**与子主题内其他论文的关联**

- 与 [An explainable transformer circuit for compositional generalization](An explainable transformer circuit for compositional generalization.md) 均关注层级结构处理和组合能力，但本文聚焦于上下文学习中的层级结构预测，而非函数组合。
- 与 [Weight-sparse transformers have interpretable circuits](Weight-sparse transformers have interpretable circuits.md) 不同，本文在标准预训练 LLM 上分析，不依赖稀疏诱导。
- 提供了完整的因果验证（消融实验），确认了 induction heads 和 context matching heads 在层级结构预测中的因果作用。
- 与 [Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework](Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework.md) 互补——本文手动发现特定功能电路，而后者提供自动发现框架。

**源码链接**

未找到公开代码仓库

**Tags**

`2025` `Induction Heads` `In-Context Learning` `Hierarchical Structure` `Circuit Discovery` `Attention Mechanisms` `Context Matching Heads`