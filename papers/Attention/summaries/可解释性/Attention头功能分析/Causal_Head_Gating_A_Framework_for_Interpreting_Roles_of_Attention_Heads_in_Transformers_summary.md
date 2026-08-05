---
layout: page
---

**Authors**: Henry C. Conklin, Andrew J. Nam, Yukang Yang, Thomas L. Griffiths, Sarah-Jane Leslie, Jonathan D. Cohen
**Year**: 2025
**Venue**: NeurIPS 2025
**arXiv**: 2505.13737
**Tags**: Attention头功能分析, Mechanistic Interpretability, NeurIPS_2025, Causal Analysis, Circuit Discovery

## Core Contribution

提出因果头门控（Causal Head Gating, CHG）框架，一种可扩展的、假设无关的方法，用于解释 Transformer 模型中注意力头的功能角色。CHG 通过学习每个注意力头的软门控值，将其分类为促进（facilitating）、干扰（interfering）或无关（irrelevant）三种因果类型，无需预定义假设或特定提示模板。该方法还扩展出对比 CHG（contrastive CHG），用于隔离支持特定子任务（如指令跟随 vs. 上下文学习）的子电路。

## Main Method / Findings

CHG 的核心思想是：对每个注意力头学习一个可微的门控参数，该参数对头的输出进行软消融（soft ablation）。通过在给定任务数据集上优化下一 token 预测损失，促进任务的头保持激活，而干扰任务的头被抑制。通过正则化进一步区分无关头。

主要发现：
1. **多头稀疏子电路**：LLM 中存在多个稀疏的任务充分子电路（task-sufficient sub-circuits），每个子电路包含不同的头集合，且这些子电路之间有不同程度的重叠。
2. **低模块化**：单个头的角色依赖于与其他头的交互，并非完全模块化——消融一个头的影响取决于其他头是否被保留。
3. **指令跟随与 ICL 分离**：指令跟随和上下文学习依赖于可分离的机制，CHG 引导的门控可以选择性地抑制一种模式而不显著影响另一种。
4. **因果验证**：通过消融和因果中介分析验证了 CHG 分数的因果性（而非仅仅是相关性）。

CHG 的方法优势包括：不需要外部标签、不需要特定的提示模板、支持链式思维推理等复杂输出，且仅引入每个注意力头一个可学习参数，可在几分钟内完成对数十亿参数模型的拟合。

## Relation to Other Papers

- **Cognitive Mirrors**：两者都关注注意力头的功能角色分类，但 CHG 采用因果门控的自动发现方法，而 Cognitive Mirrors 采用基于认知功能分类的探测方法。CHG 的因果分类（促进/干扰/无关）与 Cognitive Mirrors 的认知功能分类（检索/推理/决策等）形成互补视角。
- **Which Attention Heads Matter for ICL**：CHG 的对比 CHG 变体直接分析了 ICL 机制，发现 ICL 和指令跟随依赖于可分离的电路，这与 Which Attention Heads Matter for ICL 中 FV heads 主导 ICL 的发现相互印证。
- **Preference Heads**：两者都使用基于门控/掩码的因果分析识别特定功能的头，但一个针对个性化偏好，一个针对通用任务角色。
- **Quantifying Stability**：CHG 假设头角色具有跨实例的稳健性，而 Quantifying Stability 直接检验了这种假设——发现中层头最不稳定，这对 CHG 等方法的可靠性提出了重要限定条件。
- **Relevance Heads**：两者都使用因果干预方法，但 CHG 是全局的门控框架，而 Relevance Heads 聚焦于信息检索中相关性判断的具体机制。

## Source Code

https://github.com/andrewnam/causal_head_gating

## Key Insights

1. CHG 提供了一种自动化的、假设无关的注意力头功能分析方法，大大降低了机械可解释性的门槛。
2. 发现 LLM 中存在多个功能等价的任务充分子电路，暗示模型的鲁棒性可能部分来自这种冗余。
3. 指令跟随和 ICL 使用可分离的神经机制，这对模型理解和控制有重要实践意义。
4. CHG 的高可扩展性使其可以应用于更大规模的模型和更复杂的任务。