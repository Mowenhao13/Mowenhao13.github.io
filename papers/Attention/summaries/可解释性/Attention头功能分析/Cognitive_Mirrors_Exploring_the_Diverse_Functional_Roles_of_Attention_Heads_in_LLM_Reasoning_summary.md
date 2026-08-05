---
layout: page
---

**Authors**: Xueqi Ma, Jun Wang, Yanbei Jiang, Sarah Monazam Erfani, Tongliang Liu, James Bailey
**Year**: 2025
**Venue**: NeurIPS 2025
**arXiv**: 2512.10978
**Tags**: Attention头功能分析, Mechanistic Interpretability, NeurIPS_2025, Cognitive Science, Reasoning

## Core Contribution

提出"认知镜像"（Cognitive Mirrors）框架，系统性地分析 LLM 中注意力头在复杂推理过程中的认知功能角色。通过引入 CogQA 数据集（将复杂问题分解为带有认知功能标注的子问题），并采用多类探针方法，识别出负责特定认知功能（如检索、知识回忆、逻辑推理、数学计算等）的"认知头"（cognitive heads）。发现了注意力头在推理中的功能专门化、稀疏性、层次性和交互性等关键性质。

## Main Method / Findings

### CogQA 数据集
- 包含 570 个主问题和 3,402 个子问题
- 从 AQuA、CREAK、ECQA、e-SNLI、GSM8K 五个基准中采样
- 每个子问题标注认知功能类型：低级功能（检索、知识回忆、语义理解、句法理解）和高级功能（数学计算、逻辑推理、推断、决策）
- 采用 GPT-4o 生成 + 两阶段人工验证（逻辑一致性审查 + 认知功能标签校正）

### 多类探针方法
- 对每个注意力头训练多类分类器，预测其参与的认知功能类型
- 在 LLaMA、Qwen、Yi 三个主要 LLM 家族上进行实验

### 主要发现
1. **功能专门化**：注意力头表现出类似认知功能专门化的特性，不同头负责不同的认知操作
2. **普遍稀疏性**：认知头在所有模型中都是稀疏的，只有少数头负责特定认知功能
3. **数量与分布差异**：不同认知功能对应的头数量和层分布不同，低级功能（如检索）在中早期层，高级功能（如推理）在更深的层
4. **交互与层次结构**：认知头之间存在功能聚类，形成层次化结构——低层头调节高层头的行为
5. **因果验证**：移除认知头导致推理性能下降，增强认知头可提升推理准确率

## Relation to Other Papers

- **Causal Head Gating**：两者都关注注意力头的功能分类，但 Cognitive Mirrors 采用认知科学启发的功能分类体系（8 种认知功能），而 CHG 采用更抽象的因果分类（促进/干扰/无关）。Cognitive Mirrors 的发现（层级化认知架构）与 CHG 的发现（低模块化、头间依赖）形成对比——前者强调功能聚类，后者强调角色依赖。
- **Which Attention Heads Matter for ICL**：Cognitive Mirrors 关注通用推理认知功能，而 ICL 论文聚焦于 ICL 的特定机制（induction heads vs. FV heads）。两者共享"部分头比其他头更重要"的核心发现。
- **Preference Heads**：Cognitive Mirrors 关注通用认知功能，Preference Heads 关注个性化偏好，两者都发现头功能具有稀疏性和专门化特征。
- **Quantifying Stability**：Cognitive Mirrors 在多模型家族间验证了认知头的一致性，但 Quantifying Stability 提醒我们，跨随机种子的头角色可能不稳定，这一发现对 Cognitive Mirrors 的跨模型泛化结论提出了潜在挑战。
- **Relevance Heads**：Cognitive Mirrors 关注通用推理，Relevance Heads 关注信息检索中的相关性判断，两者都使用探针/因果方法分析头功能。

## Source Code

https://github.com/sihuo-design/CognitiveMirrors

## Key Insights

1. 首次将认知科学中的功能分类体系系统性地应用于 LLM 注意力头分析，搭建了人类认知与机器推理之间的桥梁。
2. 发现 LLM 中注意力头呈现类似人脑的层级化认知架构——从低级信息处理到高级抽象推理的层次化组织。
3. 认知头的增强可以提升推理能力，为功能感知的模型设计和微调策略提供了新的方向。
4. CogQA 数据集为未来研究提供了一个结构化的推理认知功能评估基准。