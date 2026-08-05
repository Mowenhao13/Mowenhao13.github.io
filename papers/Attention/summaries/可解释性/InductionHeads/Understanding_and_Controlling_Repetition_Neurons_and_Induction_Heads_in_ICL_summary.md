---
layout: page
---

**Title**: Understanding and Controlling Repetition Neurons and Induction Heads in In-Context Learning
**Authors**: Nhi Hoai Doan, Tatsuya Hiraoka, Kentaro Inui
**Year**: 2025
**Venue**: arXiv

**核心贡献**：
本文首次对 LLM 中重复神经元（repetition neurons）与归纳头（induction heads）在上下文学习（ICL）中的交互机制进行了全面的层间因果分析。主要发现包括：（1）重复神经元的影响随层深度变化——中间层神经元主要影响重复生成，而深层神经元对 ICL 模式识别至关重要；（2）归纳头是"模式检测器"，消融 3% 的归纳头即可导致模式识别能力崩溃；（3）归纳头通过级联机制激活重复神经元。基于这些发现，提出三阶段消融策略（three-segment ablation strategy）：选择性地消融中间层重复神经元，在不损害 ICL 性能的前提下减少重复生成。

**主要方法/发现**：
- **模型**：Llama-3.1-8B（主要实验），Qwen2.5-7B 和 Llama-2-13B（对比验证）
- **数据集**：5 个合成数据集（Repetition、Recursion、Centre-embedding、WordSeq 1、WordSeq 2），每个任务包含 Pattern（有重复模式）和 Non-Pattern（无重复模式）两类
- **重复神经元检测**：独立于 ICL 任务，通过激活值差异识别（与 Hiraoka & Inui 2025 方法一致）
- **归纳头检测**：使用前缀匹配分数（prefix-matching score）识别
- **层间分析**：将层分为三段 [0.0, 0.4)、[0.4, 0.6)、[0.6, 1.0]：
  - 初始层（[0.0, 0.4)）：消融重复神经元对 ICL 和生成影响很小
  - 中间层（[0.4, 0.6)）：消融大幅减少重复输出，ICL 性能仅轻微下降
  - 最终层（[0.6, 1.0]）：消融严重损害 ICL 性能，重复生成仅轻微下降
- **归纳头实验**：消融 1 个归纳头影响很小，但消融 3 个以上导致模式识别崩溃（Recall 下降 75.4%-76.7%）
- **级联机制**：归纳头激活最终层重复神经元，二者联合消融导致模式识别能力近乎完全崩溃
- **三阶段消融策略**：中间层重复神经元消融可在保持 ICL 性能的同时有效减少重复输出
- **下游任务验证**：SST2 情感分析和 WMT19 机器翻译任务验证了策略的有效性
- **模型差异**：Llama 的归纳头在语义任务中影响较弱，暗示存在替代路径；Qwen 的归纳头在所有任务类型中均起关键作用

**与其他论文的关系**：
- 与 Wang et al. (2025) 的《Induction Head Toxicity》都关注重复生成问题，但本文从 repetition neurons 切入而非归纳头毒性，且提出了具体的消融缓解策略
- 与 Bajaj et al. (2026) 的《Temporal Dependencies in ICL》互补：Bajaj 等证明归纳头对时间上下文检索的因果作用，本文证明归纳头对模式识别的因果作用及其与重复神经元的级联关系
- 直接继承 Hiraoka & Inui (2025) 的 repetition neurons 工作，但修正了"双峰假设"（two-peak hypothesis），证明最终层而非中间层对 ICL 最为关键
- 与 Olsson et al. (2022) 的 induction heads 理论一致，进一步发现归纳头不仅是"复制电路"，还可以作为领域通用的模式编码器

**代码链接**：https://github.com/hnhine/repnr_ind

**Tags**：`repetition_neurons` `induction_heads` `in-context_learning` `mechanistic_interpretability` `pattern_recognition` `neuron_ablation` `LLM` `arXiv_2025`