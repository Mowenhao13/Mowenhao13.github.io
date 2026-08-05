---
layout: page
title: Latent_Space_Reasoning 论文索引
---

# Latent_Space_Reasoning 论文索引

> 最后更新：2026-07-16
> 总计：7 篇论文总结
> 范围：多语言推理的潜在空间表征、语言无关推理核心、Latent CoT 综述、算术推理的机械可解释性、语码转换与语言锚定

---

## 已整理论文

| # | 论文 | 年份 | 核心贡献 |
|---|------|------|---------|
| 1 | 📚 [A Survey on Latent Reasoning](A Survey on Latent Reasoning.md) | 2025 | 潜在推理领域系统性综述，提出垂直/水平循环+无限深度推理分类体系 |
| 2 | 📚 [Reasoning Beyond Language_A Comprehensive Survey on Latent Chain-of-Thought Reasoning_deep_note](Reasoning Beyond Language_A Comprehensive Survey on Latent Chain-of-Thought Reasoning_deep_note.md) | 2025 | 专注于 Latent CoT 推理的系统分类法综述（Token-wise + Layer-wise） |
| 3 | [Rethinking the Multilingual Reasoning Gap with Layer Swap_summary](Rethinking the Multilingual Reasoning Gap with Layer Swap_summary.md) | 2026 | 中间层=语言无关推理核心，外层=语言特定层，Layer Swap 弥合推理差距 |
| 4 | [Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary](Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary.md) | 2024 (ACL) | 通过激活修补因果证明语言与概念在LLM中独立解耦 |
| 5 | [What Makes Good Multilingual Reasoning](What Makes Good Multilingual Reasoning.md) | 2026 | 解构多语言推理轨迹的可测量特征，挑战英语中心假设 |
| 6 | [A mechanistic interpretation of arithmetic reasoning in language models using causal mediation analysis_summary](A mechanistic interpretation of arithmetic reasoning in language models using causal mediation analysis_summary.md) | 2023 | 首次用因果中介分析揭示LLM算术推理的三阶段信息流路径（操作数编码→注意力传输→MLP结果计算） |
| 7 | [Code-Switching Reveals Language Anchoring in Multilingual LLMs_deep_note](Code-Switching Reveals Language Anchoring in Multilingual LLMs_deep_note.md) | 2026 | 提出 Anchor Bias 几何测度量代码转换表征锚定方向，发现语法框架效应，提出推理时干预方法 CANVAS |

---

## 子主题说明

当前未划分子主题（论文数 = 6）。六篇论文共同构成四条互补的研究线索：

1. **语言无关推理核心的发现与验证**：
   - [Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary](Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary.md) 从机械可解释性（激活修补）角度证明语言与概念在LLM中独立解耦
   - [Rethinking the Multilingual Reasoning Gap with Layer Swap_summary](Rethinking the Multilingual Reasoning Gap with Layer Swap_summary.md) 从权重空间分析角度证明SFT更新在中间层跨语言对齐，并通过Layer Swap操作验证了这一推理核心的存在

2. **潜在推理的理论框架**：
   - [A Survey on Latent Reasoning](A Survey on Latent Reasoning.md) 提供了潜在空间推理的完整分类体系，为理解上述发现提供了统一理论视角
   - [Reasoning Beyond Language_A Comprehensive Survey on Latent Chain-of-Thought Reasoning_deep_note](Reasoning Beyond Language_A Comprehensive Survey on Latent Chain-of-Thought Reasoning_deep_note.md) 建立了 Latent CoT 的系统分类法（Token-wise 横向 + Layer-wise 纵向）

3. **多语言推理特征分析**：
   - [What Makes Good Multilingual Reasoning](What Makes Good Multilingual Reasoning.md) 从推理轨迹的可测量特征层面揭示跨语言推理策略的本质差异

4. **推理的机械可解释性方法论**：
   - [A mechanistic interpretation of arithmetic reasoning in language models using causal mediation analysis_summary](A mechanistic interpretation of arithmetic reasoning in language models using causal mediation analysis_summary.md) 建立因果中介分析框架追踪LLM内部信息流，为激活修补等方法提供方法论基础

5. **语码转换与语言锚定**：
   - [Code-Switching Reveals Language Anchoring in Multilingual LLMs_deep_note](Code-Switching Reveals Language Anchoring in Multilingual LLMs_deep_note.md) 研究 CS 输入下语言表征的几何锚定规律，发现语法框架效应，提出推理时干预策略 CANVAS

---

## 综合报告

- [Latent Reasoning + Multilingual Reasoning 五篇论文合成报告](synthesis_of_5_papers.md.md) — 方法对比、研究空白、交叉引用链（不含第6-7篇新加论文）

---

## 关联主题

- [Multilingual-safety](Multilingual-safety/) — 本文中的 Layer Swap 为多语言推理提供了轻量级增强手段，可间接提升多语言安全对齐的推理质量（推理链的跨语言一致性）
- [Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary](Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary.md) — 多语言注意力头的发现与权重空间中语言特定的外层区域具有机制层面的关联
- [Attention_Heads_Safety_Summary](Attention_Heads_Safety_Summary.md) — 安全注意力头与推理中栈的语言无关性，两者可能在Transformer的不同层级中共同作用
- [Code-Switching Reveals Language Anchoring in Multilingual LLMs_deep_note](Code-Switching Reveals Language Anchoring in Multilingual LLMs_deep_note.md) 的锚定效应揭示的多语言表征不稳定性与 [Multilingual-safety](Multilingual-safety/) 主题中的多语言推理退化相关