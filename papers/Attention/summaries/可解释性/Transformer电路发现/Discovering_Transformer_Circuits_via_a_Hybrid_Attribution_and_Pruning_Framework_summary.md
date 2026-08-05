---
layout: page
---

**Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework**

- **Authors**: Hao Gu, Vibhas Nair, Amrithaa Ashok Kumar, Jayvart Sharma, Ryan Lagasse
- **Year**: 2025
- **Venue**: NeurIPS 2025 MechInterp Workshop
- **arXiv ID**: 2510.03282

**核心贡献**

提出 HAP（Hybrid Attribution and Pruning）框架，通过将 Edge Attribution Patching（EAP）的快速粗筛与 Edge Pruning（EP）的精细剪枝结合，解决了电路发现中速度与忠实度之间的根本性权衡。在保持接近 EP 的电路忠实度的同时，HAP 比 EP 快 46%。

**主要方法/发现**

1. **混合框架**：首先使用 EAP 进行全局搜索，快速移除低重要性边，保留高潜力子图（使用宽松阈值以确保不遗漏重要的协作组件）；然后在该子图上运行 EP 进行精确剪枝。
2. **实验设置**：在 GPT-2 Small（117M）上评估，使用间接宾语识别（IOI）任务，数据集包含 200 个训练样本和 36,084 个测试样本。
3. **性能表现**：在相同稀疏度下，HAP 的准确率（94±0.5%）与 EP 持平，Logit Difference 和 KL 散度指标接近 EP，而运行时间仅 1579 秒（EP 为 2921 秒，加速 46%）。
4. **S-Inhibition Heads 案例研究**：HAP 成功保留了 EAP 在高稀疏度下遗漏的 S-Inhibition Heads（7.3, 7.9, 8.6, 8.10），这些头在 IOI 中起协作抑制 Name Mover Heads 的作用，对任务准确执行至关重要。

**与子主题内其他论文的关联**

- 与 [Weight-sparse transformers have interpretable circuits](Weight-sparse transformers have interpretable circuits.md) 同属电路发现方法论研究，但 HAP 侧重于在预训练稠密模型上发现电路，而非训练稀疏模型。
- 与 [Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models](Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models.md) 共享将电路发现视为搜索+剪枝问题的思路，但 HAP 聚焦于小模型（GPT-2 Small）的精确性，而非十亿参数模型的扩展性。
- 与 [Mechanistic Unveiling of Transformer Circuits: Self-Influence as a Key to Model Reasoning](Mechanistic Unveiling of Transformer Circuits: Self-Influence as a Key to Model Reasoning.md) 使用相同的 EAP 系列方法，但 HAP 提出混合框架改进，而后者使用自影响函数分析推理过程。

**源码链接**

[https://anonymous.4open.science/r/HAP-circuit-discovery](https://anonymous.4open.science/r/HAP-circuit-discovery)

**Tags**

`NeurIPS_2025` `Circuit Discovery` `Hybrid Method` `IOI` `GPT-2` `Attribution Patching` `Edge Pruning`