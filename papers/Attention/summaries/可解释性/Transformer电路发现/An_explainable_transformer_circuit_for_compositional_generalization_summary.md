---
layout: page
---

**An explainable transformer circuit for compositional generalization**

- **Authors**: Cheng Tang, Brenden Lake, Mehrdad Jazayeri (MIT, New York University)
- **Year**: 2025
- **Venue**: -
- **arXiv ID**: 2502.15801

**核心贡献**

首次端到端地机械化解释了一个紧凑 Transformer 中负责组合归纳（compositional induction）的完整电路，将其逆向工程为人类可读的伪代码，并展示了基于电路机制的激活编辑可以精确控制模型行为。

**主要方法/发现**

1. **任务设计**：使用合成函数组合任务，每个 episode 包含 support set（定义基元符号到颜色的映射和函数操作）和 question（需要组合已知基元和函数解决的新组合）。
2. **模型架构**：2 层编码器 + 2 层解码器的 Transformer，每层 8 个注意力头。在 10,000 个训练 episode 上训练 50 个 epoch，测试集准确率达 98%。
3. **五步电路**：
   - **Question-Broadcast Head**：support 中的基元 token 关注 question 中相同基元 token，继承其在 question 中的位置索引。
   - **Primitive-Pairing Head**：颜色 token 关注其关联的基元 token，继承后者的位置索引。
   - **Primitive- and Function-Retrieval Heads**：函数 RHS 上的颜色 token 关注函数 LHS 上的基元 token，继承后者的相对位置索引。
   - **RHS-Scanner Head**：Decoder 的第一个 token（SOS）关注函数 RHS 的第一个 token，继承其相对位置索引。
   - **Output Head**：SOS token 使用继承的位置索引关注具有相同索引的颜色 token，生成下一个预测。
4. **模型控制**：通过精确的激活编辑（基于电路机制的引导），可以可预测地改变模型的行为。

**与子主题内其他论文的关联**

- 与 [A circuit for predicting hierarchical structure in-context in Large Language Models](A circuit for predicting hierarchical structure in-context in Large Language Models.md) 均关注层级结构处理，但本文聚焦于组合泛化中的函数组合，而后者聚焦于上下文学习中层级结构的预测。
- 与 [Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework](Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework.md) 相比，本文采用人工引导的因果消融而非自动电路发现方法，提供了更精细的电路级解释。
- 提供了完整的电路逆向工程流水线，可作为电路发现研究的验证案例。

**源码链接**

未找到公开代码仓库

**Tags**

`2025` `Compositional Generalization` `Mechanistic Interpretability` `Circuit Discovery` `Encoder-Decoder` `Inductive Reasoning` `Activation Editing`