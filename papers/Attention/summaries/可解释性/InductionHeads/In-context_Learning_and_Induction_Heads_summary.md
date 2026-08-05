---
layout: page
---

> **Title**: In-context Learning and Induction Heads
> **Authors**: Catherine Olsson, Nelson Elhage, Neel Nanda, Nicholas Joseph, Nova DasSarma, Tom Henighan, Ben Mann, Amanda Askell, Yuntao Bai, Anna Chen, Tom Conerly, Dawn Drain, Deep Ganguli, Zac Hatfield-Dodds, Danny Hernandez, Scott Johnston, Andy Jones, Jackson Kernion, Liane Lovitt, Kamal Ndousse, Dario Amodei, Tom Brown, Jack Clark, Jared Kaplan, Sam McCandlish, Chris Olah
> **Year**: 2022
> **Venue**: arXiv (Transcription — Anthropic Transformer Circuits)
> **arXiv ID**: 2209.11895

**核心贡献**：
本文首次发现并命名了 **Induction Heads（归纳头）** —— 一种实现 `[A][B] ... [A] → [B]` 前缀匹配机制的注意力头。论文通过系统的机械可解释性分析证明：(1) Induction heads 是 Transformer 中**上下文学习（In-Context Learning, ICL）** 的核心机制；(2) Induction heads 可通过两层注意力头（"previous token head" + "induction head"）的**组合**形成；(3) Induction heads 在所有大小的 Transformer 模型中**普遍存在**，且其存在与模型展现 ICL 能力直接相关。该论文奠定了注意力头功能分析的理论基础，是理解 Transformer ICL 机制的里程碑式工作。

---

## 新范式/新指标

### 新范式：Induction Head 机制

论文提出了 induction head 的完整形式化定义：

**定义**：一个注意力头是 induction head，当其：
$$
\text{Induction score} = \frac{1}{N} \sum_{i=1}^{N} \mathbb{1}[\text{argmax}_j A(S_{ji}) = i - 1]
$$

其中 $A(S_{ji})$ 是对 token $S_j$ 在位置 $i$ 上的注意力分布，$N$ 为序列长度。该分数衡量注意力头是否倾向于关注到"上一个相同的 token 位置之后的位置"——即实现 `[A][B] ... [A] → [B]` 的能力。

### 新概念：Induction Head 组成的层间通路

论文发现了 induction head 的两步形成机制：

1. **Previous Token Head**（上层/同层）：在位置 $i$ 的 token 上关注到前一个位置 $i-1$，将 token 的"下一个 token 预测"信息传递到当前位置
2. **Induction Head**（下层）：在位置 $i$ 的 token 上，通过 QK 电路找到序列中之前出现过的相同 token 的位置 $j$，再从 $j+1$ 位置（由 previous token head 在 $j$ 位置关注的）的信息中通过 OV 电路提取 token $B$

数学表达为：

设 $x_i$ 为位置 $i$ 的 token 嵌入，$A_{ih}$ 为 induction head：
- QK 电路：找到之前的相同 token 位置 $j = \arg\max_k (W_Q x_i)^T (W_K x_k)$
- OV 电路 + Previous Token Head：注意力汇聚到 $j+1$ 位置，提取 token $B$： $W_O \sum_k A_{ik} W_V x_k \approx x_{j+1}$

### 新指标：Induction Score

论文提出的 induction score 量化了注意力头成为 induction head 的程度，范围 [0, 1]，其值越高表示该头越倾向于执行 `[A][B] ... [A] → [B]` 的复制模式。分数 > 0.1 被视为可能具有 induction head 行为。

### 新概念：损失谷（Loss Valley）

论文在分析损失曲面时发现了一个"损失谷"现象——在单层注意力 Transformer 上训练时，模型在 0.5M 到 1M 步之间会出现损失急剧下降并伴随明显的 induction head 形成。这一现象表明 induction head 的出现是模型学习 ICL 能力的**相变式**事件。

---

## 实验方法与数据集

### 实验设置

| 维度 | 详细说明 |
|------|---------|
| **模型规模** | 从 1 层到 12 层注意力层的 Transformer，嵌入维度从 32 到 1024 |
| **训练数据** | C4 数据集（Colossal Clean Crawled Corpus） |
| **训练方法** | 自回归语言建模（next token prediction） |
| **优化器** | Adam，学习率 1e-4 |
| **训练步数** | 200K - 1.5M steps（分不同实验） |
| **Batch size** | 512，序列长度 256 |

### 主要实验设计

#### 实验 1：Induction Head 发现与验证
- 在小规模 1 层 Transformer（d_model=128, n_heads=8）上训练
- 使用 induction score 追踪训练过程中每个注意力头的演化
- **发现**：训练约 1M 步后，部分注意力头的 induction score 突然跃升至接近 1.0

#### 实验 2：ICL 能力与 Induction Head 的相关性
- **ICL 准确率指标**：在合成 `[A][B] ... [A] → [B]` 任务上的零样本 ICL 准确率
- **关键发现**：
  - ICL 准确率与 induction score 呈强正相关（Pearson r ≈ 0.9）
  - Induction head 出现前模型不具有 ICL 能力
  - Induction head 出现后 ICL 准确率迅速超过 90%

#### 实验 3：多模型规模的系统性分析
- 训练了 10+ 个不同规模的模型（1L-12L, d_model 32-1024）
- **发现**：
  - Induction heads 在所有 > 1 层的模型中普遍存在
  - 1 层模型也可通过 residual stream 形成 induction head（使用同一层的前缀 token 头）
  - 更大模型中有更多 induction heads，分布在中间层到深层

#### 实验 4：Zero-Shot ICL 与 Induction Head
- 测试预训练检查点（GPT-2 small, medium, large, XL）的 induction heads
- **发现**：GPT-2 系列模型中 induction heads 同样普遍存在，且其 ICL 准确率与 induction score 相关

#### 实验 5：损失谷分析与相变
- 在 1 层注意力 Transformer 上分析了训练损失曲面
- **发现**：
  - 在 induction heads 形成前损失下降缓慢
  - Induction heads 出现后损失急剧下降，形成"损失谷"
  - 损失谷的宽度和深度与 induction head 形成的质量相关

#### 实验 6：Induction Head 的消融实验
- 选择性消融 induction head，观察 ICL 能力变化
- **发现**：
  - 消融单个 induction head 对 ICL 影响很小（冗余性）
  - 消融多个 induction head 导致 ICL 准确率显著下降（下降 40-70%）
  - 消融非 induction head 的注意力头对 ICL 影响有限

#### 实验 7：组合形成的验证
- 验证 "previous token head + induction head" 的两步机制
- 消融 previous token head 后 induction head 的功能会显著退化
- 人工干预注意力模式的实验证实了该因果链

### 使用的预训练模型
- GPT-2 Small (85M)
- GPT-2 Medium (302M)
- GPT-2 Large (774M)
- GPT-2 XL (1.5B)

---

## 与其他论文的关系

这篇论文是 induction heads 和 ICL 机械可解释性的**开创性奠基工作**，后续大量论文建立在其基础之上：

- **[Understanding and Controlling Repetition Neurons and Induction Heads in ICL](Understanding and Controlling Repetition Neurons and Induction Heads in ICL.md)** (2025)：直接继承 Olsson et al. 的 induction heads 理论，进一步发现 induction heads 不仅是"复制电路"，还可作为领域通用的模式编码器
- **[Which_Attention_Heads_Matter_for_In-Context_Learning_summary](Which_Attention_Heads_Matter_for_In-Context_Learning_summary.md)** (2025)：在 Olsson et al. 基础上，解耦 induction heads 与 function vector heads 在 ICL 中的不同作用
- **[Induction Head Toxicity Mechanistically Explains Repetition Curse in Large Language Models](Induction Head Toxicity Mechanistically Explains Repetition Curse in Large Language Models.md)** (2025)：提出 induction head 过度激活导致重复生成的理论，建立在该文的 induction head 定义上
- **[Temporal Dependencies in In-Context Learning: The Role of Induction Heads](Temporal Dependencies in In-Context Learning: The Role of Induction Heads.md)** (2026)：研究 ICL 中时间依赖性与 induction heads 的关系
- **[A circuit for predicting hierarchical structure in-context in Large Language Models](A circuit for predicting hierarchical structure in-context in Large Language Models.md)** (2025)：发现"context matching heads"使 induction heads 能够预测层级结构
- **[An explainable transformer circuit for compositional generalization](An explainable transformer circuit for compositional generalization.md)** (2025)：反向工程了 induction heads 的组合泛化电路
- 其他 Induction Heads 子目录下的所有论文均继承本文的 induction head 定义与分析方法
- **Attention 头功能分析**子目录下的多数论文（如 [Cognitive_Mirrors_Exploring_the_Diverse_Functional_Roles_of_Attention_Heads_in_LLM_Reasoning_summary](Cognitive_Mirrors_Exploring_the_Diverse_Functional_Roles_of_Attention_Heads_in_LLM_Reasoning_summary.md)）均以本文的 induction head 框架为出发点
- Transformer Circuits 系列的另一篇重要工作：[Toy Models of Superposition](Toy Models of Superposition.md)（Elhage et al., 2022），两者共同奠定了 Anthropic 机械可解释性的理论基础

---

## 关键图示总结（从 PDF 提取）

1. **Figure 1**：Induction head 的示意图——展示 `[A][B] ... [A] → [B]` 的注意力模式，QK 电路关注到之前相同 token，OV 电路从后续位置提取 token
2. **Figure 3**：损失谷——展示训练过程中损失随步数的变化，标记出 induction heads 形成时的相变点
3. **Figure 5**：Induction score 热力图——展示不同层/不同注意力头训练过程中的 induction score 变化
4. **Figure 8**：多模型规模实验——展示不同层数/维度下 induction heads 的数量与分布
5. **Figure 11**：消融实验结果——展示 induction heads 消融对 ICL 准确率的影响
6. **Figure 15**：Previous token head 与 induction head 组合的因果验证

**Tags**：`induction_heads` `in-context_learning` `mechanistic_interpretability` `transformer_circuits` `attention_heads` `previous_token_head` `emergent_ability` `phase_transition` `arXiv_2022`