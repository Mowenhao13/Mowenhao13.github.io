---
layout: page
---

> **arXiv**: `2606.11202` | **年份**: 2026

## 核心贡献

本文提出MLJailDe，一个**多语言越狱检测框架**，核心思想是学习**语言无关的越狱意图表示（language-insensitive jailbreak-intent representations）**。通过多语言回译数据增强（MBT-DA）、基于相对距离的表示分布优化（representation distribution optimization）和不平衡感知分类目标，MLJailDe在11种语言上达到98.5%的F1分数，在未见语言上平均F1达97.1%，显著超越所有基线方法。

## 方法

**多语言提示增强器（MBT-DA）**：
1. **前向与回译**：将英语提示翻译成10种低资源语言，每方向3个变体，再回译至英语
2. **翻译准确性验证**：计算原提示与回译的一致性分数，低于阈值（$\tau_{acc}=4$）的丢弃
3. **功能有效性验证**：
   - 良性提示：验证回译提示能否产生功能对齐的输出
   - 越狱提示：验证翻译版本仍能触发有害响应（安全性评分$\tau_{safe}=4$）
4. **最终输出**：每个提示-语言对选择得分最高的变体，构建高质量多语言监督数据集

**多语言越狱检测器**：
1. **编码器**：DeBERTa-v3-base，输出[CLS] token的768维表示
2. **投影层**：两层全连接网络 + ReLU激活，将768维映射到128维归一化空间
3. **表示分布优化目标**（基于监督对比学习）：
   $$L_{dist} = \sum_{i \in I} \frac{-1}{|P(i)|} \sum_{p \in P(i)} \log \frac{\exp(\Delta_{i,p}/\tau)}{\sum_{p' \in P(i)} \exp(\Delta_{i,p'}/\tau) + \sum_{n \in N(i)} \exp(\Delta_{i,n}/\tau)}$$
   其中$\Delta_{i,j} = \text{sim}(z_i, z_j) = z_i^\top z_j$
4. **不平衡感知分类目标**（加权交叉熵）：
   $$L_{wce} = -\frac{1}{N}\sum_{i=1}^{N} (w_1 y_i \log(\hat{y}_i) + w_0 (1-y_i) \log(1-\hat{y}_i))$$
   权重$w_k = \pi_k^{-1} / \sum_{t} \pi_t^{-1}$（归一化逆先验）
5. **联合优化**：$L_{total} = \lambda L_{dist} + (1-\lambda) L_{wce}$，$\lambda=0.55$

**数据增强结果**：从300个良性+300个越狱英语提示出发，扩展至2,232个良性样本和1,239个越狱样本，覆盖11种语言（英语及10种低资源语言）

## 数据集与实验

**数据集**：JailbreaksOverTime数据集，选取300良性+300越狱英语提示，9:1训练测试分割，测试集翻译至10种低资源语言并人工校验，最终660个高质量多语言测试样本

**基线方法（14个）**：GPT-4o-p、GPT-4.1-p、GPT-5-p、Claude-4.5-p、Llama-2-ft、Llama-3.1-ft、Qwen2.5-ft、Qwen3-ft、SelfReminder、SelfDefend、DeBERTa-ft、Moderation、PromptGuard、JBShield

**主要结果**：

| 方法 | 精确率 | 召回率 | F1 |
|------|--------|--------|----|
| GPT-5-p | 0.916 | 0.997 | 0.955 |
| GPT-4.1-p | 0.887 | 0.924 | 0.905 |
| Claude-4.5-p | 0.855 | 1.000 | 0.922 |
| **MLJailDe (ours)** | **0.997** | **0.973** | **0.985** |
| Llama-3.1-ft | 0.815 | 0.400 | 0.537 |
| PromptGuard | 0.951 | 0.527 | 0.678 |
| JBShield | 0.452 | 0.576 | 0.507 |

**跨语言泛化**：
- 单个未见语言：平均F1=97.1%，最佳100%（乌尔都语、爪哇语），最差87.7%（缅甸语）
- 3个未见语言：F1>97.2%
- 6个未见语言：F1>95.8%

**消融实验**：
- 无MBT-DA：F1仅19.1%（召回率10.6%），验证数据增强不可或缺
- 无Ldist：F1降至94.3%
- 无Lwce：F1降至97.2%

**推理速度**：38.06 items/sec，远快于所有LLM基线和多数模型基线

## 关键发现

1. **语言无关表示学习有效**：通过对比学习约束，越狱提示在不同语言中的表示从分散的语言特定集群转变为统一的意图中心集群（t-SNE可视化验证）

2. **MBT-DA的质量控制关键**：朴素翻译虽提升召回率（98.5%）但降低精确率（95.0%），而MBT-DA在两者间取得更好平衡（99.7%/97.3%）

3. **框架架构通用性**：MBT-DA和联合优化目标在DeBERTa、mDeBERTa、Flan-T5等多种骨干上均有效（F1>95.7%）

4. **与传统方法的差异**：与需访问LLM内部状态的方法不同（如GradSafe、GradientCuff），MLJailDe完全解耦于受保护模型，适合黑盒场景

5. **低资源语言性能差距**：缅甸语（my）因形态句法差异显著，表现相对较差（F1=87.7%），反映了极低资源语言的检测挑战

## 关联论文

- [JBShield_Summary](JBShield_Summary.md)：基于激活概念分析的越狱检测
- [Proactive_Safety_Reasoning_Summary](Proactive_Safety_Reasoning_Summary.md)：主动安全推理防御
- [Cognitive_Driven_Defense_Summary](Cognitive_Driven_Defense_Summary.md)：元操作推理驱动的认知防御
- [defense_papers_summary](defense_papers_summary.md)：LLM安全防御方法综述
- [LLM_Jailbreak_Papers_Index](LLM_Jailbreak_Papers_Index.md)：越狱攻击与防御论文索引
- [Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary](Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary.md)：多语言LLM的注意力头分析
