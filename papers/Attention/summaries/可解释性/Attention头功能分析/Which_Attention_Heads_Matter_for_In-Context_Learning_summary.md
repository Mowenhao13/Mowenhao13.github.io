---
layout: page
---

**Authors**: Kayo Yin, Jacob Steinhardt
**Year**: 2025
**Venue**: -
**arXiv**: 2502.14010
**Tags**: Attention头功能分析, Mechanistic Interpretability, 2025, In-Context Learning, Induction Heads, Function Vectors

## Core Contribution

系统性地比较了两种解释上下文学习（ICL）机制的注意力头类型——induction heads（归纳头）和 function vector heads（函数向量头，FV heads）——在 12 个 decoder-only Transformer 模型（70M 到 7B 参数）中的角色和重要性。通过详细的消融实验，发现 FV heads 是 few-shot ICL 性能的主要驱动因素，而 induction heads 的影响有限。此外，发现许多 FV heads 在训练过程中从 induction heads 演化而来，暗示归纳可能促进了更复杂的 FV 机制的学习。

## Main Method / Findings

### 研究方法
- 在 12 个 Pythia 系列模型（70M-6.9B 参数）上进行实验
- 使用 45 个自然语言 ICL 任务进行评估
- 分别识别 induction heads 和 FV heads，通过消融实验比较两者对 ICL 性能的影响
- 追踪训练过程中各头的 induction score 和 FV score 的演化

### 主要发现
1. **Induction heads 和 FV heads 是不同的**：两者的重叠度低或为零，induction heads 通常出现在较早的层，FV heads 出现在较晚的层
2. **两者存在相关性**：FV heads 的行为与 induction heads 更相似（相对于随机头），反之亦然
3. **FV heads 驱动 ICL**：消融 FV heads 显著降低 few-shot ICL 准确率，而消融 induction heads 影响有限（图 1a）
4. **训练演化**：许多 FV heads 在训练早期具有高 induction score，随着训练推进 induction score 下降而 FV score 上升，表明 FV heads 从 induction heads 演化而来
5. **模型规模效应**：FV heads 的主导作用在大模型中更为显著，挑战了此前认为 induction heads 是 ICL 关键机制的主流观点

## Relation to Other Papers

- **Causal Head Gating**：CHG 的对比 CHG 变体也分析了 ICL 与指令跟随的分离电路，发现两者使用可分离机制。本论文进一步细化了 ICL 内部的双机制（induction vs. FV），为 CHG 的发现提供了更细粒度的解释。
- **Cognitive Mirrors**：本论文专注于 ICL 的特定机制，而 Cognitive Mirrors 关注更广泛的推理认知功能。两者都使用功能分类方法分析注意力头角色。
- **Preference Heads**：本论文的 FV heads 编码任务信息，Preference Heads 编码用户偏好信息，两者都展示了注意力头可以编码抽象的高层概念。
- **Quantifying Stability**：本论文发现 FV heads 在训练过程中从 induction heads 演化而来，揭示了头角色随训练动态变化，这与 Quantifying Stability 关注的跨种子稳定性形成补充——头的功能可能具有演化路径上的稳定性。
- **Relevance Heads**：本论文关注 ICL 机制，Relevance Heads 关注相关性判断，两者都使用消融/干预方法验证头功能。

## Source Code

https://github.com/kayoyin/icl-heads

## Key Insights

1. 挑战了此前认为 induction heads 是 ICL 关键机制的主流观点，揭示了 FV heads 在 few-shot ICL 中的主导作用。
2. 发现 FV heads 从 induction heads 的演化路径，为理解 ICL 机制的学习过程提供了重要线索。
3. 模型规模越大，FV heads 的主导作用越显著，为理解大模型的涌现能力提供了新的视角。
4. 对 ICL 的机制解释从"单一的 induction 机制"转向"induction 促进 FV 的双阶段机制"。