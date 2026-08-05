---
layout: page
---

> **arXiv**: `2602.22554` | **年份**: 2026 | **Venue**: -

## 核心贡献

提出一种基于稀疏权重编辑（Sparse Weight Editing）的无训练跨语言安全对齐框架。核心发现：安全能力集中在稀疏的"安全神经元"子集（<1%参数）。通过将低资源语言（LRL）的有害表征线性映射到高资源语言（HRL）的安全子空间，并利用零空间投影约束保持通用能力，该方法以闭式解一次性计算出最优权重扰动，无需梯度训练。

## 方法

将跨语言安全对齐形式化为约束线性变换问题。首先识别安全神经元子集 $S$，对安全权重子矩阵 $W_S \in \mathbb{R}^{d_{\text{in}} \times m}$ 求解稀疏扰动 $\Delta W_S$。

对齐目标：$\sigma(X_{\text{low}}(W_S + \Delta W_S)) \approx Y_{\text{target}}$

采用预激活空间的线性近似，最小化残差：
$$L_{\text{align}} = \| X_{\text{low}} \Delta W_S - D_S \|_F^2$$

其中安全间隙 $D_S = Y_{\text{target}} - X_{\text{low}} W_S$。

加入零空间正则化保持通用能力：$L_{\text{utility}} = \| X_{\text{safe}} \Delta W_S \|_F^2$

施加低秩约束 $\text{rank}(\Delta W_S) \leq r$ 后的完整目标函数：
$$\min_{\Delta W_S} \| X_{\text{low}} \Delta W_S - D_S \|_F^2 + \gamma \| X_{\text{safe}} \Delta W_S \|_F^2 + \lambda \| \Delta W_S \|_F^2$$

该问题存在闭式解：通过Cholesky分解 $Q = R^\top R$（其中 $Q = X_{\text{low}}^\top X_{\text{low}} + \gamma X_{\text{safe}}^\top X_{\text{safe}} + \lambda I$），在规范化空间中进行SVD截断得到最优秩 $r$ 近似。

## 数据集与实验

- **模型**: Llama-3.2（1B、3B）、Qwen2（0.5B、1.5B）、Qwen2.5（1.5B、3B、7B）
- **语言**: 英语(En)、中文(Zh)、越南语(Vi)、日语(Ja)、泰语(Th)、印尼语(Id)、孟加拉语(Bn)、希伯来语(He)
- **数据**: HarmfulQA、CatHarmfulQA、LLM-LAT（有害种子集）；NaturalReasoning（无害种子集）
- **评估基准**: Multi-StrongREJECT（313条有害提示/语言）
- **安全评估**: Qwen3Guard-Gen-8B
- **主要结果**:
  - 在严格零样本协议下，所有模型和语言都一致降低有害完成数
  - 与MPO组合（MPO+Our）达到最优安全性能
  - 通用能力（MGSM、M-MMLU）几乎不变
  - 消融实验显示秩 $r$ 在宽范围内性能稳定，$r = 8$ 即可获得强安全增益

## 关键发现

1. 安全神经元集在不同语言间存在差异：高资源语言间重叠度较高，低资源语言重叠度较低
2. 简单的激活放大（activation steering）对低重叠语言效果有限，需要主动的表示重定向
3. 低秩约束在少样本场景下有效防止过拟合，且安全相关更新集中在低维子空间
4. 平衡的锚点选择（UtilityAnchor + Regular数据）对避免过对齐至关重要
5. 框架可与现有安全对齐方法（如MPO）组合使用，作为轻量级后拨插件

## 关联论文

[MPO_Reward_Gap_Optimization_summary](MPO_Reward_Gap_Optimization_summary.md) | [Homer_Simpson_Task_Arithmetic_summary](Homer_Simpson_Task_Arithmetic_summary.md) | [Multilingual_Safety_Alignment_via_Self_Distillation_summary](Multilingual_Safety_Alignment_via_Self_Distillation_summary.md)
