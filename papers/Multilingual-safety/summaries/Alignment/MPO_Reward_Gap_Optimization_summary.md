---
layout: page
---

> **arXiv**: `2505.16869` | **年份**: 2025 | **Venue**: ACL 2025

## 核心贡献

提出MPO（Multilingual reward gaP Optimization），一种通过奖励差距优化实现跨语言安全对齐的新范式。核心发现：语言间的"隐式奖励差距"（reward gap，即安全与不安全响应的对数似然差）与多语言安全性能呈强负相关。MPO直接最小化主导语言（如英语）与目标语言之间的奖励差距差异，从而将主导语言的安全能力迁移到其他语言。

## 方法

基于SimPO的奖励公式定义第 $t$ 语言的奖励差距：

$$\text{RG}_t = \frac{1}{|y_w^t|} \log \pi_\theta(y_w^t | x^t) - \frac{1}{|y_l^t|} \log \pi_\theta(y_l^t | x^t)$$

MPO的优化目标由两部分组成：
1. 奖励差距对齐损失：$L_1 = \mathbb{E}_{(x,y_w,y_l) \sim \mathcal{D}} \left[ \left( \beta \text{RG}_t - \text{RG}_d \right)^2 \right]$
2. 主导语言表征保持损失：$L_2 = \mathbb{E}_{x_d \sim \mathcal{D}} \left[ \| h_d - h_d^{\text{ref}} \|_2^2 \right]$

总损失：$L = L_1 + L_2$

其中 $\text{RG}_d$ 为主导语言的奖励差距（由冻结的参考模型计算），$\text{RG}_t$ 为目标语言的奖励差距（由可训练策略模型计算）。梯度分析表明，权重 $w_\theta = \beta \text{RG}_t(\theta) - \text{RG}_d$ 控制着梯度更新的大小和方向。

## 数据集与实验

- **模型**: LLaMA-3.1-8B-Instruct、Gemma-2-9B-it、Qwen2.5-7B-Instruct
- **语言**: 英语(En)、中文(Zh)、日语(Jp)、韩语(Ko)、阿拉伯语(Ar)、孟加拉语(Bn)、斯瓦希里语(Sw)
- **数据**: PKU-SafeRLHF（采样100条数据翻译至各语言）
- **评估基准**: MultiJail、AdvBench-X、CSRT（代码切换攻击）
- **基线**: SFT、DPO、IPO、rDPO、CPO、KTO、ORPO、R-DPO、SimPO
- **主要结果**:
  - 在三个后盾模型上MPO一致优于所有基线方法
  - 在低资源语言（Bn、Sw）上改进尤为显著
  - 多语言通用能力（MT-Bench、M-MMLU、MGSM）基本保持不变
  - 跨数据质量控制实验表明MPO对噪声偏好数据具有鲁棒性

## 关键发现

1. 主导语言的奖励差距提供了高质量的、可扩展的监督信号，远优于直接使用目标语言偏好数据
2. 长度归一化（length normalization）对于跨语言安全评估中的奖励差距计算至关重要
3. 表征保持（retain component）对维持多语言通用能力至关重要
4. 与现有的跨语言迁移方法（CLA、LENS、SDRRL）相比，MPO显著更优
5. MPO在数据量增大时展现出边际收益递减，表明提升监督信号质量比增加数据量更有效

## 关联论文

[Cross_lingual_Transfer_of_Reward_Models_summary](Cross_lingual_Transfer_of_Reward_Models_summary.md) | [Align_Once_Benefit_Multilingually_summary](Align_Once_Benefit_Multilingually_summary.md) | [Multilingual_Safety_Alignment_via_Self_Distillation_summary](Multilingual_Safety_Alignment_via_Self_Distillation_summary.md)
