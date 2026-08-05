---
layout: page
---

> **arXiv**: `2410.18027` | **年份**: 2024 | **Venue**: -

## 核心贡献

实证研究证明，基于多语言预训练语言模型（MLM）训练的英语奖励模型（Reward Model）展现出强大的跨语言迁移能力，在非英语语言上的表现甚至优于目标语言本地训练的奖励模型。论文从表征保持的角度解释了这一现象：英语奖励模型最能保持初始MLM的表征多样性，而其他语言的奖励模型会导致表征坍塌。

## 方法

使用Bradley-Terry模型训练奖励模型，目标函数为：

$$L_{\text{RM}} = \sigma (r_\theta(x, y_w) - r_\theta(x, y_l))$$

通过构建86k合成偏好数据集（来自SafeRLHF、WildGuard、HelpSteer2、Offsetbias、Magpie五个英语数据集），将其机器翻译为西班牙语、意大利语、韩语、中文四种语言，训练语言特定的奖励模型。跨语言迁移分析通过比较隐藏状态矩阵的奇异值比例来衡量：

$$f_\theta(x) = \frac{\sigma_1}{\sum_{i=1}^{|L|} \sigma_i}, \quad S = \text{diag}(\sigma_1, \ldots, \sigma_{|L|})$$

英语RMs的 $f_\theta(x)$ 最接近基础指令模型，表示不同语言的表征被嵌入到相似的语义空间。

## 数据集与实验

- **模型**: Llama-3.2-3B-Instruct、Qwen2.5-3B-Instruct（奖励模型）；Qwen2.5-7B-Instruct（下游对齐）
- **数据集**: SafeRLHF、WildGuard、HelpSteer2、Offsetbias、Magpie（86k English + 4种翻译版本）
- **评估基准**: Multilingual RewardBench（翻译版）、Multilingual AlpacaEval
- **主要结果**:
  - 英语RMs在多语言RewardBench上超出目标语言RMs 3-4%平均准确率
  - 推理类任务受益最大，非拉丁语系（韩语、中文）提升达12-27%
  - 下游多语言对齐中，英语RM对齐的模型平均胜率提升9.5%
- **外部RM分析**: ArmoRM-8B、OffsetBias-8B（分类器RM）和GPT-4o、Self-Taught-Llama-70B（生成式RM）均展示强跨语言迁移

## 关键发现

1. 英语偏好数据是奖励建模中的"通用语"（Lingua Franca），英语RM在多语言场景中全面优于目标语言RM
2. 英语最佳保持初始MLM的表征，目标语言训练会导致表征同质化（representation collapse）
3. MLM的表征本身具有跨语言感知能力，嵌入范数分布在多语言间高度相似
4. 下游对齐实验证实英语RM可直接用于多语言对齐，无需翻译偏好数据

## 关联论文

[MPO_Reward_Gap_Optimization_summary](MPO_Reward_Gap_Optimization_summary.md) | [Align_Once_Benefit_Multilingually_summary](Align_Once_Benefit_Multilingually_summary.md)
