---
layout: page
---

**Weight-sparse transformers have interpretable circuits**

- **Authors**: Leo Gao, Achyuta Rajaram, Jacob Coxon, Soham V. Govande, Bowen Baker, Dan Mossing (OpenAI)
- **Year**: 2025
- **Venue**: -
- **arXiv ID**: 2511.13653

**核心贡献**

提出一种新的解释范式：通过训练权重极度稀疏（大部分权重为零）的 Transformer，使得模型内部电路自然具有人类可理解性。每个神经元仅有少量连接，从而在最低抽象层次上实现完全可理解的电路。

**主要方法/发现**

1. **权重稀疏训练**：训练 GPT-2 风格的 decoder-only Transformer，对权重施加 L0 范数约束（非零参数从 14.8M 到 0.9M 不等），预训练数据集为 Python 代码。
2. **电路提取**：对每个精心设计的简单任务，通过剪枝隔离出执行该任务的最小电路子图。所有被剪枝的节点用其在预训练分布上的均值激活值替代。
3. **关键发现**：
   - 稀疏模型发现的电路比同等损失下的稠密模型小约 16 倍。
   - 神经元激活通常对应简单概念，如"单引号后的 token"或"列表嵌套深度"。
   - 权重编码的概念之间的连接通常是直观的。
   - 电路是必要且充分的：均值消融电路外的所有神经元保留任务损失，而删除电路内的节点严重损害任务损失。
4. **扩展性分析**：扩展模型总参数数量可改善能力-可解释性 Pareto 前沿。但将稀疏模型扩展到数千万以上非零参数同时保持可解释性仍是挑战。
5. **迁移到稠密模型**：展示了使用每层 bridge 将稀疏模型的表示与目标稠密模型对齐的初步结果，使稀疏模型可作为稠密模型的可解释替代品。

**与子主题内其他论文的关联**

- 与 [Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework](Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework.md) 均关注电路发现，但前者从"训练稀疏模型"的角度出发，后者从"在稠密模型上高效发现电路"的角度出发。
- 与 [Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models](Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models.md) 共享"稀疏性促进可解释性"的理念，但本文通过在训练阶段强制稀疏来达到目标，而非通过事后分析。
- 作为 OpenAI 的工作，本文提供了工业级规模的实验（代码和模型权重已开源）。

**源码链接**

[https://github.com/openai/circuit_sparsity/](https://github.com/openai/circuit_sparsity/)

**Tags**

`2025` `Sparse Models` `Weight Sparsity` `Interpretability` `Mechanistic Interpretability` `OpenAI` `Circuit Discovery`