---
layout: page
---

> **arXiv**: `2602.16660` | **年份**: 2026 | **Venue**: ICLR 2026

## 核心贡献

提出多语言一致性（MLC）损失函数，一种即插即用的辅助损失，可无缝集成到现有单语言对齐管线（如SFT、DPO、SimPO、ORPO）中。核心创新在于通过奇异值分析约束多语言表征向量的共线性（collinearity），使不同语言中相同语义的查询在表征空间中共享同一方向，从而在一次更新中实现多语言同时对齐。该方法仅需多语言提示变体，无需任何低资源语言的响应级监督。

## 方法

定义多语言表征矩阵 $Z = [z^{(\ell_1)}, z^{(\ell_2)}, \ldots, z^{(\ell_m)}] \in \mathbb{R}^{d \times m}$，其中 $z^{(\ell)}$ 是语言 $\ell$ 的归一化表征（通过线性投影从隐藏状态提取）。

根据Eckart-Young-Mirsky定理，最大化表征一致性与使 $Z$ 的秩趋近于1等价。抑制所有非主导奇异值的平方和：

$$\|Z - \tilde{Z}\|_F^2 = \sum_{i=2}^k \sigma_i^2$$

这等价于最大化主导奇异值 $\sigma_1$。通过温度缩放的softmax将奇异值转化为可微分的训练目标：

$$L_{\text{cons}} = -\frac{1}{N} \sum_{n=1}^N \log \frac{\exp(\sigma_1^{(n)} / \tau)}{\sum_{j=1}^m \exp(\sigma_j^{(n)} / \tau)}$$

总训练目标：$L_{\text{total}} = L_{\text{align}} + \lambda_{\text{aux}} L_{\text{cons}}$

梯度分析表明，该损失鼓励各语言表征沿主导方向 $u_1$ 对齐，同时抑制其他方向。

## 数据集与实验

- **模型**: Qwen-2.5-7B-Instruct、Gemma-2-9B-it（主实验）；Qwen-2.5-1.5B/3B（规模消融）
- **语言**: 10种语言（高资源: En, Zh, Ru, Ja, Ar; 低资源: Bn, Sw, Ur, Ps, Ku）
- **数据**: PKU-SafeRLHF（2,835条训练样本，仅提升翻译至各语言）
- **评估基准**: PKU-SafeRLHF（ID）、MultiJail（OOD）；MMLU、MMMU-lite（通用能力）
- **基线**: SDRRL、MPO、DPO（含无MLC版本）
- **主要结果**:
  - DPO+MLC在Qwen-2.5-7B上安全率从59.55%提升至95.94%，方差从13.14降至0.07
  - PAG（成对一致性）从0.5037提升至0.9697
  - 在Gemma-2-9B-it上MLC将安全率提升至96.83%，方差降至0.02
  - 跨对齐范式验证（SFT、DPO、SimPO、ORPO均显著改善）
  - 跨模型规模验证（1.5B、3B、7B均有效）
  - 仅需少量数据增量（0.59M tokens + 1.8M tokens MLC vs MPO的15M tokens）

## 关键发现

1. 多语言安全对齐的不一致性可用表征空间中的几何偏离来解释，MLC通过秩1约束有效对齐
2. MLC在未见过的语言上（OOD评估中的印尼语、越南语、泰语）展现出强大的泛化能力
3. 适当的中间层（而非最后一层）的表示提取在安全-通用能力权衡上取得最佳平衡
4. 与直接最大化余弦相似度的硬约束相比，秩1近似损失在保持通用能力方面更优
5. 翻译质量实验表明MLC在噪声翻译下仍然保持稳定的安全性能（安全率>95.9%）
6. 更大模型（7B > 3B > 1.5B）在原始多语言安全性上更强，但单语言DPO反而增大跨语言差距

## 关联论文

[MPO_Reward_Gap_Optimization_summary](MPO_Reward_Gap_Optimization_summary.md) | [Multilingual_Safety_Alignment_via_Self_Distillation_summary](Multilingual_Safety_Alignment_via_Self_Distillation_summary.md) | [Cross_lingual_Transfer_of_Reward_Models_summary](Cross_lingual_Transfer_of_Reward_Models_summary.md)
