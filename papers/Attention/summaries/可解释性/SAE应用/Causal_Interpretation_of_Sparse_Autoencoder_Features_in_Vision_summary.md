---
layout: page
---

tags: [SAE, 稀疏自编码器, 因果解释, 视觉 Transformer, 有效感受野, 可解释性, 2025]
authors: Sangyu Han, Yearim Kim, Nojun Kwak
year: 2025
venue: arXiv

## 核心贡献

提出**因果特征解释**（Causal Feature Explanation, CaFE）框架，利用**有效感受野**（Effective Receptive Field, ERF）归因方法识别真正驱动 SAE 特征激活的输入图像区域。发现许多视觉 SAE 特征存在"非局部化"现象——最高激活的 patch 并不包含实际触发该特征的原因，仅依靠激活位置会导致严重误解。

## 主要方法与发现

### 方法
- 对 CLIP-ViT-L/14 的每一层训练 Matryoshka SAE，使用 ImageNet-1K 的 5 亿图像 patch
- 对每个 SAE 特征的激活，反向传播归因分数（使用 AttnLRP 或 Integrated Gradients）到输入 patch 层
- 形成 ERF 热力图：真正驱使特征激活的因果区域
- 通过插入测试（Insertion Test）验证因果性：按 ERF 重要性依次插入 patch 到空白图像，测量特征激活恢复速度

### 主要发现
1. **非局部化 SAE 特征**：高层中存在大量非局部化特征（layer 22 约 14%），表现为"激活在 A 但原因在 B"。例如"绝望"特征在背景地板处激活最高，但真正驱动力是桌上的药丸
2. **ERF 优于激活图**：插入测试中 ERF 引导的恢复曲线显著优于基于激活值的 patch 排序
3. **层间分布规律**：低层（<9 层）几乎没有非局部特征（仅 CLS token 相关）；高层非局部特征比例急剧上升，在 layer 22 达到峰值约 14%
4. **AttnLRP 最佳**：在多种归因方法（AttnLRP、Integrated Gradients、KernelSHAP、Gradients）中，AttnLRP 取得最好的因果归因效果

### 案例
- "Three" 特征：激活分散在图像各处，但 ERF 指向三个具体物体
- "Knight Armor" 特征：激活在盔甲附近，但 ERF 揭示需要全身装甲的协同出现
- "Roaring Face" 特征：需要眼睛和鼻子同时出现，而非仅张嘴

## 与本子主题其他论文的关联

- **Lorsa**：Lorsa 使用 z-pattern 进行注意力归因（类似 DFA），CaFE 使用 ERF 进行输入空间归因。两者都认识到"仅看激活位置"不足以理解注意力机制，需要因果归因链。Lorsa 在语言模态，CaFE 在视觉模态
- **Dimensional Collapse**：CaFE 假设 SAE 特征本身是有意义的，需要更好的解释方法。Dimensional Collapse 探讨了如何训练更好的 SAE（减少死亡特征）。两者的结合方向——在高质量 SAE 上做因果解释——是自然的研究路径
- **Steering SAE Latents**：Steering 论文侧重于"用 SAE 特征控制注意力"，CaFE 侧重于"理解 SAE 特征真正代表什么"。两者结合可以实现"理解→控制"的闭环

## 源代码链接

未找到公开代码仓库。