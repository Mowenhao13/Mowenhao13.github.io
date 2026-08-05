---
layout: page
---

**Title**: Hidden Heroes and Gradient Bloats: Layer-Wise Redundancy Inverts Attribution in Transformers
**Author**: Donald Ye (Columbia University)
**Year**: 2026
**Venue**: ICML 2026 Workshop (arXiv: 2602.01442)

## Core Contribution

系统性地揭示梯度归因（Gradient-based Attribution）在 Transformer 组件层面存在结构与可预测的**梯度-因果偏差**（Gradient-Causal Gap）：早期层出现"梯度膨胀"（Gradient Bloats）——高梯度但低因果重要性，后期层出现"隐藏英雄"（Hidden Heroes）——低梯度但高因果重要性。Spearman 相关系数从序列反转任务的 $\rho=0.72$ 骤降至排序任务的 $\rho=0.27$，部分种子甚至达到 $\rho=-0.18$。该偏差源于一阶梯度归因无法检测集体冗余（Collective Redundancy）：联合剪除 Bloats 造成的性能下降（43.8%）是各分量单独剪除预测值（3.1%）的 **14 倍**。

## Main Method/Findings

### 方法
- **梯度重要性** $G$：对每个组件 $i$，计算 50 个 OOD batch 上交叉熵损失关于该组件参数的 Frobenius 范数均值，并除以参数量的平方根 $\sqrt{N_i}$ 进行归一化
- **因果重要性** $C$：通过均值消融（Mean Ablation，将组件输出替换为均值 $\mu_i$）和零消融（Zero Ablation）两种基线，测量移除组件后 OOD 准确率的变化
- **梯度-因果偏差** $\Delta_i = \text{Rank}(G_i) - \text{Rank}(C_i)$：$\Delta_i \leq -6$ 为 Hidden Hero（低梯度高因果），$\Delta_i \geq 6$ 为 Gradient Bloat（高梯度低因果）
- **模型架构**：Decoder-only Transformer，L=4 层，H=4 头，$d_{\text{model}}=128$，$d_{\text{ff}}=512$

### 关键实验结果
- **梯度-因果偏差** (Table 1)：反转任务 $\rho=0.72 \pm 0.08$，排序任务 $\rho=0.27 \pm 0.24$；种子 456 达 $\rho=0.00$，种子 2020 达 $\rho=-0.18$（梯度反向预测因果重要性）
- **层间分布** (Figure 2)：排序任务中 Layer 1 累积 21 个 Bloats，Layer 3 累积 17 个 Heroes，模式在 $\pm 4, \pm 6, \pm 8$ 三个阈值下均稳定
- **组件身份稳定性**：特定头在随机初始化中保持稳定角色——L3 H3 在 7/10 种子中为 Hero，L1 H1 和 L1 H3 在 6/10 种子中为 Bloat
- **剪枝后果**：Heroes 消融导致 OOD 准确率下降 $-36.4\% \pm 22.8\%$；Bloats 单独消融仅下降 $-10.1\% \pm 10.4\%$，但联合消融达 $-43.8\%$，表现为 14× 超可加性（Superadditivity）
- **梯度分布**：排序任务 Layer 1 梯度范数 0.172，Layer 3 仅 0.052，差异达 3.3×，解释了早期层 Bloat 集中现象
- **注意力模式**：Hero 头展现结构化、位置敏感的注意力模式，Bloat 头呈现弥散或 sink-token 模式

### 数据集与任务
- **任务**：序列反转（Sequence Reversal）、序列排序（Sequence Sorting），整数 $x \in \{1,\dots,99\}$
- **训练长度**：$\{3,4,5,6,7\}$；**OOD 评估长度**：$\{8,9,10,11\}$，准确率在 $[20\%, 75\%]$ 窗口内测量
- **种子**：10 个随机种子（42, 123, 456, 789, 1010, 2020, 3030, 4040, 5050, 6060）

## Relation to Other Papers in This Sub-topic

本文与 [Efficient LLMs with AMP](Efficient LLMs with AMP.md) 从不同视角探讨注意力头冗余问题，形成互补关系。AMP 是**正向工程方法**：通过激活-重要性度量主动剪除冗余组件，并通过一致性检验验证其有效性。Hidden Heroes 是**诊断性分析**：揭示梯度归因（被众多剪枝方法采用）的固有缺陷——将组件冗余错误地识别为重要性。两篇论文共同指向一个核心见解：**冗余不等于不重要**，因为冗余组件可能构成集体关键的补偿回路（Compensating Circuits）。本文对基于梯度的剪枝方法（如 Wanda、SparseGPT）提出了根本性挑战，建议剪枝方法应优先采用因果验证（Causal Validation）而非仅依赖梯度信息。

## Source Code Link

- https://github.com/donald-ye/casual-gradient

## Tags

`gradient_attribution` `mechanistic_interpretability` `causal_importance` `redundancy_analysis` `layer_wise_analysis` `transformer_circuits` `ICML_2026_Workshop`