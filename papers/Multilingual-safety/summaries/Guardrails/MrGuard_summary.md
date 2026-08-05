---
layout: page
---

> **arXiv**: `2504.15241` | **年份**: 2025 | **Venue**: arXiv

## 核心贡献

MrGuard 是首个专注于多语言安全场景并具备推理能力的 guardrail 模型。核心贡献包括：(1) 提出了一种合成多语言数据生成方法，结合文化和语言细微变体；(2) 引入基于课程学习（Curriculum Learning）的 Group Relative Policy Optimization (GRPO) 框架，逐步引入更多样化的文化变体；(3) 实现了跨语言一致性评估和推理忠实度（Explanation Fidelity）等新评估指标，为 guardrail 的推理能力建立评估基线。

## 方法

MrGuard 采用三阶段架构：

**阶段一：合成数据生成**。以 Aegis-2.0-Safety 的英文数据集为种子数据，使用 GPT-4o-mini 对英文 prompt 生成推理（为何标记为 safe/unsafe），然后将其翻译为 K 种目标语言并再次生成推理，形成多语言数据集 $D_{multi} = \{D_{l0}, D_{l1}, \ldots, D_{lK}\}$。

**阶段二：监督微调 (SFT)**。在 LLaMA-3.1-8B-Instruct 上使用 QLoRA 进行参数高效微调，使模型具备多语言安全分类和推理能力。

**阶段三：基于课程学习的 GRPO**。通过定义难度函数 Diff，将多语言 prompt 分为三个难度等级（0/1/2），逐步引入更复杂的文化和语言变体。使用包含格式奖励 $R_f$、正确性奖励 $R_c$、不确定性奖励 $R_u$ 和语言奖励 $R_{lang}$ 的组合奖励函数：
$$R = R_f + R_c + R_u + R_{lang}$$

难度函数通过 back-translation 和语义相似度计算：
$$\text{Diff}(p) = \begin{cases} 0, & \cos(\pi_{bt}(p), p^{l0}) > t_1 \\ 1, & \cos(\pi_{bt}(p), p^{l0}) \in (t_2, t_1] \\ 2, & \text{otherwise} \end{cases}$$

## 数据集与实验

**评估基准**：5 个多语言安全基准——PTP_wildchat、RTP_LX、aya-red-teaming、MultiJail、XSafety。

**语言设置**：5 种领域内语言（EN、AR、ES、ZH、RU）和多种领域外语言（如 FR、HI、SW 等）。

**对比基线**：DUO-Guard、GuardR、LlaMa-Guard-3、Aegis-2.0、Wildguard。

**主要结果**：
- MrGuard (8B) 在所有 5 个基准上均大幅超越所有基线（F1 提升 >15%）
- 在 XSafety 上达到 F1 94.33%（in-domain）/ 92.06%（out-of-domain）
- 在 RTP_LX 上达到 F1 91.04%（in-domain）/ 86.32%（out-of-domain）
- 代码切换攻击下 F1 仅下降 1.54%，远低于基线的 2.40%-41.10%
- Sandwich 攻击下 F1 下降仅 5.83%，远优于其他基线

**推理质量**：解释忠实度（EF）达 87-93%，语言匹配率（LM）>97%。

## 关键发现

MrGuard 证明将推理能力融入多语言 guardrail 能显著提升跨语言安全检测性能。课程学习与 GRPO 的结合有效提升了模型对文化细微差异和低资源语言的泛化能力。具备推理能力的 guardrail 不仅能提高分类准确率，还能生成可解释性强的安全决策，帮助理解语言特定的安全风险。

## 关联论文

[SelfDefend](SelfDefend.md)、[PolyGuard](PolyGuard.md)、[CREST](CREST.md)、[GuardR](GuardR.md)、[SEALGuard](SEALGuard.md)
