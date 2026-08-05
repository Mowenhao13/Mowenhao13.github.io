---
layout: page
---

**Mechanistic Unveiling of Transformer Circuits: Self-Influence as a Key to Model Reasoning**

- **Authors**: Lin Zhang, Lijie Hu, Di Wang (PRADA Lab, KAUST, Harbin Institute of Technology)
- **Year**: 2025
- **Venue**: -
- **arXiv ID**: 2502.09022

**核心贡献**

提出 SICAF（Self-Influence Circuit Analysis Framework），将电路分析与自影响函数（self-influence function）结合，首次在推理任务的上下文中追踪和分析语言模型采用的思维过程。通过计算各层 token 的自影响分数变化，映射出模型采用的推理路径。

**主要方法/发现**

1. **三阶段方法**：
   - 阶段 1：使用 EAP / EAP-IG / EAP-IG-KL 自动发现电路。
   - 阶段 2：对电路各层计算每个 token 的自影响分数 $I_H(x, x) = -\nabla_\theta L(x)^\top H^{-1} \nabla_\theta L(x)$，使用 Hessian-vector product 避免直接计算 Hessian 逆。
   - 阶段 3：通过分析自影响分数在各层的变化推断模型的推理过程。
2. **实验设置**：在 GPT-2（finetuned）上测试 IOI 任务。
3. **关键发现**：
   - 发现的电路很小（仅包含 1-2% 的边）且忠实（恢复 ≥85% 模型性能）。
   - 在同一参数约束下，EAP-IG 识别的电路比 EAP 更忠实。
   - 电路中的关键参数主要集中分布在第一层和最后几层。
   - 通过在不同电路上应用 SICAF，可以揭示和区分模型采用的不同推理策略。
4. **创新点**：首次将影响函数应用于解释语言模型在推理任务中的思维过程，相比传统神经网络，电路仅包含最必要的参数，大大降低了计算自影响函数的计算成本。

**与子主题内其他论文的关联**

- 与 [Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework](Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework.md) 使用相同的 EAP 系列方法，但本文侧重于分析方法论（自影响函数），而非改进电路发现效率。
- 与 [Weight-sparse transformers have interpretable circuits](Weight-sparse transformers have interpretable circuits.md) 不同，本文在标准稠密模型上分析，不依赖稀疏训练。
- 将影响函数引入可解释性工具箱，为后续电路分析提供了新的定量分析手段。

**源码链接**

未找到公开代码仓库

**Tags**

`2025` `Self-Influence` `Circuit Analysis` `Reasoning` `IOI` `GPT-2` `Influence Functions` `SICAF`