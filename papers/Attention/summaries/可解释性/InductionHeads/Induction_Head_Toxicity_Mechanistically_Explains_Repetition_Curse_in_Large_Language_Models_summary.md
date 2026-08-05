---
layout: page
---

**Title**: Induction Head Toxicity Mechanistically Explains Repetition Curse in Large Language Models
**Authors**: Shuxun Wang, Qingyu Yin, Chak Tou Leong, Qiang Zhang, Linyi Yang
**Year**: 2025
**Venue**: arXiv (Withdrawn)
**Status**: 论文已从 arXiv 撤回（Withdrawn），当前无 PDF 版本可用。以下内容基于 arXiv 摘要页面。

**核心贡献**：
本文提出"induction head toxicity"（归纳头毒性）概念，定义为归纳头在生成过程中主导模型输出 logits 的倾向，从而排挤其他注意力头对生成过程的贡献，导致大语言模型产生重复序列（repetition curse）。作者将重复诅咒现象归因于归纳头的过度激活，并提出了注意力头正则化作为缓解手段。

**主要发现/方法**：
- 重复诅咒（Repetition Curse）是指 LLM 生成重复或循环令牌序列的现象
- 归纳头（induction heads）是一类特殊的注意力头，能够执行前缀匹配和复制，是上下文学习（ICL）的核心机制
- 论文提出"induction head toxicity"概念：在重复生成过程中，归纳头的输出 logits 压倒性地主导模型输出，抑制其他注意力头的参与
- 提出注意力头正则化（attention head regularization）技术，用于降低生成过程中归纳头的支配地位，从而促进更多样化和连贯的输出

**与其他论文的关系**：
- 与 Doan et al. (2025) 的《Understanding and Controlling Repetition Neurons》存在互补关系：两篇论文都关注 LLM 中的重复生成问题，但本文从归纳头毒性角度切入，而 Doan 等从 repetition neurons 的层间分析入手
- 与 Bajaj et al. (2026) 的《Temporal Dependencies in ICL》共享对归纳头机制的关注，但 Bajaj 等聚焦于归纳头在时间序列记忆中的作用，而非重复生成
- 与 Olsson et al. (2022) 的 induction heads 开创性工作直接相关，将归纳头功能从"促进 ICL"扩展到"导致重复诅咒"

**代码链接**：未找到公开代码仓库（论文已撤回）

**Tags**：`induction_heads` `repetition_curse` `attention_head_toxicity` `LLM` `mechanistic_interpretability` `arXiv_2025` `withdrawn`