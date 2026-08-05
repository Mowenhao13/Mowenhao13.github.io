---
layout: page
---

tags: [SAE, 稀疏自编码器, 注意力机制, 可解释性, 维度坍塌, 死亡特征, 2025]
authors: Junxuan Wang, Xuyang Ge, Wentao Shu, Zhengfu He, Xipeng Qiu
year: 2025
venue: arXiv

## 核心贡献

揭示 Transformer 注意力输出存在显著的**低秩结构**（有效维度仅约全空间的 60%，而 MLP 输出和残差流约 90%），并证明这一结构是稀疏字典学习方法中**死亡特征**（dead features）问题的主要成因。在此基础上提出**激活子空间初始化**（Active Subspace Initialization, ASI），将 SAE 特征方向初始化为激活的有效子空间内，使死亡特征从 87% 降至 1% 以下。

## 主要方法与发现

### 低秩结构的发现
- 使用有效秩（Effective Rank）度量，在 GPT-2、Llama 3.1、Gemma 2、Qwen 3 等多个模型家族和 SlimPajama、GitHub、ArXiv 等多个数据集上一致发现注意力输出约 60% 有效秩
- 通过奇异值谱分解和损失恢复分析验证：注意力输出仅需约 74.7% 的奇异分量即可恢复 90% 损失，而 MLP 输出需要约 96.1%
- 追溯低秩成因：输出投影矩阵 $W^O$ 的各向异性（anisotropy）是主要源头，它将多头激活进一步压缩到更低维子空间

### 死亡特征与低秩的关联
- 评估 LlamaScope 全套开源 SAE，发现低有效秩与死亡特征数量高度相关
- 根本原因：随机初始化的 SAE 特征方向与激活空间的低维几何结构不匹配——大量特征落在"死子空间"（dead subspace）中，永远无法被激活

### 激活子空间初始化（ASI）
- 对激活数据做 SVD，提取前 $d_{init}$ 个主成分构成投影矩阵
- 将投影矩阵折叠到 SAE 解码器权重中，确保特征方向对齐有效子空间
- 对 SAE 编码器同样按解码器转置初始化（tied initialization）
- 在 Llama-3.1-8B 的 100 万特征 Attention Output SAE 上，死亡特征从 87% 降至 1% 以下
- 扩展到 Lorsa、Transcoder 等稀疏替代模型同样有效
- 结合 SparseAdam 优化器进一步解决 stale momentum 导致的死亡特征问题

### 跨模型可迁移性
- 在 GPT-2、Gemma 2、Qwen 3 上均观察到注意力输出低秩现象
- ASI 无需修改 SAE 架构，特征质量（单义性评分）与 baseline 无显著差异

## 与本子主题其他论文的关联

- **Lorsa（Low-Rank Sparse Attention）**：同为复旦大学 OpenMOSS 团队的工作。Lorsa 论文中观察到的"Lorsa 与 SAE 的暗物质相关性"在本论文中得到理论解释——注意力输出的低秩结构是造成稀疏字典学习困难的共同深层原因。本论文提出的 ASI 方法可直接应用于 Lorsa 的训练初始化，减少 Lorsa 的死亡头
- **Causal Interpretation of SAE Features**：本论文关注 SAE 训练阶段的死亡特征问题，而 CaFE 关注 SAE 特征解释方法。两者正交互补——拥有更好的 SAE 训练质量（ASI）后，CaFE 的解释会更可靠
- **Steering SAE Latents**：ASI 方法确保 SAE 特征更活跃、更全面地覆盖有效子空间，为后续的 steering 操作提供更可靠的稀疏特征基础

## 源代码链接

未找到公开代码仓库。作者为复旦大学 OpenMOSS 团队，与 Lorsa 论文同一团队，源代码可能随后续论文发表一同公开。