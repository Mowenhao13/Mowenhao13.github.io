---
layout: page
---

**Title**: Efficient LLMs with AMP: Attention Heads and MLP Pruning
**Authors**: Leandro Giusti Mugnaini, Bruno Lopes Yamamoto, Lucas Lauton de Alcantara, Victor Zacarias, Edson Bollis, Lucas Pellicer, Anna Helena Reali Costa, Artur Jordao
**Year**: 2025
**Venue**: IJCNN 2025 (arXiv: 2504.21174)

## Core Contribution

提出 AMP (Attention Heads and MLP Pruning) 框架，一种高效的结构化剪枝方法，通过将输入数据投影到权重上衡量注意力头和 MLP 神经元的重要性，从而实现 LLM 的压缩。AMP 在 30% 剪枝率下平均准确率超越现有 SOTA 方法最多 1.49 个百分点，且无需专用硬件即可实现 1.25 倍推理加速，符合 Green AI 原则。

## Main Method/Findings

### 方法
- **MHA 组件重要性**：将 MHA 输出重写为各头贡献的求和形式 $O = \sum_{n=1}^{N} h_n W_n$，定义每个注意力头的重要性为 $I_n = \|h_n W_n\|_1$，即投影到 $W_O$ 后的输出 $\ell_1$ 范数
- **MLP 组件重要性**：对 SwiGLU MLP 的 up/gate 投影对，计算其经过 SiLU 激活后的逐元素乘积的 $\ell_1$ 范数均值
- **均匀剪枝**：在所有层中统一剪除 c% 的最低重要性注意力头和 c% 的最低重要性 MLP 神经元，保持 Transformer 层状模块化结构
- **后训练恢复**：使用 LoRA (rank=8) 在 Alpaca 数据集上微调 2 个 epoch，整个过程在单张 RTX 3090 上约 4 小时完成，其中剪枝仅需数分钟

### 关键实验结果
- **零样本性能** (Table I)：在 LLaMA 7B 上 20% 剪枝率平均准确率 64.52%，超越 LLM-Pruner (62.19%)、Shortened LLaMA (63.46%)、DISP-LLM (62.34%)、PruneNet (60.82%)；在 LLaMA-2 7B 上 30% 剪枝率平均准确率 61.02%，超越 SliceGPT (51.50%)、LLM Surgeon (59.03%)、DISP-LLM (59.53%) 等
- **推理加速**：LLaMA 7B 上实现 1.25× 加速（2.90s → 2.31s），LLaMA-2 7B 上实现 1.19× 加速（2.79s → 2.34s）
- **一致性检验** (Coherence Check)：反向剪枝（保留不重要、剪除最重要）导致平均准确率骤降超过 25 个百分点，验证了 AMP 正确识别了关键结构
- **消融实验**：同时剪枝 MHA + MLP 在 30% 压缩率下平均准确率 61.02%，远优于仅剪枝 MLP (56.93%) 或仅剪枝 MHA (37.63%)
- **Phi 模型敏感性**：小模型对剪枝更敏感，Phi-1.5 在 30% 剪枝率下平均准确率仅 54.24%

### 数据集与模型
- **数据集**：WinoGrande、HellaSwag、ARC-e/ARC-c、PIQA（零样本分类）；WikiText2（困惑度评估）
- **校准集**：Alpaca 数据集 50 个随机样本
- **模型**：LLaMA 7B、LLaMA-2 7B、Phi-1.5、Phi-2

## Relation to Other Papers in This Sub-topic

本文与 [Hidden Heroes and Gradient Bloats](Hidden Heroes and Gradient Bloats.md) 从不同角度探讨多头注意力冗余问题。AMP 是**正向方法**：通过激活-权重投影度量各组件对残差流的贡献，据此剪除冗余组件，追求最小化性能损失。Hidden Heroes 是**反向验证**：揭示梯度归因在衡量组件因果重要性时存在系统性偏差——早期层"梯度膨胀"（Gradient Bloats）被高估，后期层"隐藏英雄"（Hidden Heroes）被低估，暗示基于梯度的剪枝方法（如 Wanda）可能错误地保留冗余组件而剪除关键组件。AMP 的激活重要性度量与 Hidden Heroes 的因果重要性度量在概念上互补，但 AMP 的一致性检验结果（反向剪枝导致性能崩溃）表明其激活度量确实能有效区分关键与非关键结构，部分规避了梯度归因的偏差问题。

## Source Code Link

- AMP: https://github.com/c2d-usp/Efficient-LLMs-with-AMP

## Tags

`structured_pruning` `attention_heads` `MLP_pruning` `LLM_compression` `Green_AI` `activation_importance` `IJCNN_2025`