---
layout: page
---

> **arXiv**: `2402.11791` | **年份**: 2024 | **Venue**: ACL 2024

## 核心贡献

提出一种基于任务算术（Task Arithmetic）的安全再对齐方法，针对经过下游任务微调后丢失安全对齐能力的LLM。核心发现是：模型在安全对齐前后权重之差构成一个"安全向量"，将该向量加回微调后的模型即可恢复安全性，而无需重新进行完整的RLHF/DPO训练。

## 方法

定义安全向量 $v_{\text{safety}} = \theta_{\text{aligned}} - \theta_{\text{base}}$，即安全对齐模型与基础模型的权重差。对于在下游任务上微调后的模型 $\theta_{\text{ft}}$，通过添加安全向量恢复安全对齐：

$$\theta_{\text{re-aligned}} = \theta_{\text{ft}} + \alpha \cdot v_{\text{safety}}$$

其中 $\alpha$ 是缩放系数，控制安全恢复的强度。该方法借鉴了任务算术中向量加减的思想，将安全对齐视为可在权重空间中线性操作的独立任务。

## 数据集与实验

- **模型**: LLaMA、GPT-2等
- **下游任务**: 涵盖多种微调场景
- **评估**: 使用安全性基准测试评估攻击成功率（ASR）
- **实验设置**: 通过对比安全再对齐前后的模型行为验证有效性
- **主要结果**: 安全向量的线性添加可显著恢复微调模型的安全性

## 关键发现

1. 安全对齐产生的权重变化可被提取为独立的安全向量
2. 安全向量在下游任务微调后仍具有迁移性
3. 线性操作即可恢复安全性，无需重新训练，计算成本极低
4. 该方法为后续基于权重编辑的安全对齐研究（如Sparse Weight Editing）奠定了基础

## 关联论文

[MPO_Reward_Gap_Optimization_summary](MPO_Reward_Gap_Optimization_summary.md) | [Multilingual_Safety_Alignment_via_Sparse_Weight_Editing_summary](Multilingual_Safety_Alignment_via_Sparse_Weight_Editing_summary.md) | [Cross_lingual_Transfer_of_Reward_Models_summary](Cross_lingual_Transfer_of_Reward_Models_summary.md)
