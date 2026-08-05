---
layout: page
---

**Title**: Temporal Dependencies in In-Context Learning: The Role of Induction Heads
**Authors**: Anooshka Bajaj, Deven Mahesh Mistry, Sahaj Singh Maini, Yash Aggarwal, Billy Dickson, Zoran Tiganj
**Year**: 2026
**Venue**: arXiv

**核心贡献**：
本文借鉴认知科学中的自由回忆（free recall）范式，系统研究了 LLM 在上下文学习中的时间依赖特性。通过对 Llama、Mistral、Qwen 和 Gemma 四个模型家族的基座和指令微调版本进行大规模消融实验，证明归纳头（induction heads）是驱动序列回忆（serial-recall-like）行为的关键机制。研究表明，当移除高 induction score 的注意力头时，模型在重复令牌后紧跟 +1 位置令牌的偏好显著降低甚至消失，而随机消融则不会产生相同效果。

**主要方法/发现**：
- **实验范式**：构建 501 个令牌的序列（500 个随机排序令牌，第 501 个令牌重复第 250 个令牌），测量模型在重复令牌位置后的输出概率分布（lag 效应）
- **模型**：Llama-3.1-8B、Mistral-7B-v0.1、Qwen2.5-7B、Gemma-2-9b 的基座和指令微调版本
- **核心发现**：
  - 指令微调后的 Mistral、Qwen、Gemma 一致表现出对 lag +1（紧跟在重复令牌后的令牌）的峰值概率，呈现类似"序列回忆"的模式
  - Llama 表现出相对平坦的 lag 概率分布，与其他模型存在显著差异
  - 消融高 induction score 的注意力头后，lag +1 偏好大幅降低，某些模型几乎完全消失
  - 随机消融注意力头往往反而增加 lag +1 偏好
  - 与人类记忆不同（呈现 temporal contiguity 效应，即 lag +1、-1、+2、-2 等邻域均有高概率），LLM 表现出更集中的 +1 偏好，属于 transformer 特有的检索现象
- **下游任务验证**：在 few-shot 序列回忆任务中，消融 inductive heads 导致性能下降程度远大于随机消融

**与其他论文的关系**：
- 与 Wang et al. (2025) 的《Induction Head Toxicity》共享对归纳头机械论解释的关注，但本文更关注归纳头在时间序列记忆中的正向功能（而非重复诅咒）
- 与 Doan et al. (2025) 的《Understanding and Controlling Repetition Neurons》互补：Doan 等关注 repetition neurons 的层间分布，本文关注归纳头对时间上下文处理的因果作用
- 直接继承 Olsson et al. (2022) 的 induction heads 理论，将归纳头研究从"前缀匹配"扩展到"时间上下文检索"
- 与 Guo & Vosoughi (2024) 的 contiguity 效应研究一致，但将分析从 GPT-2 扩展到 7B-9B 参数级别的大模型

**代码链接**：未找到独立代码仓库；实验基于 TransformerLens 库 (https://github.com/TransformerLensOrg/TransformerLens)

**Tags**：`induction_heads` `in-context_learning` `temporal_dependencies` `serial_recall` `free_recall` `mechanistic_interpretability` `transformer_circuits` `arXiv_2026`