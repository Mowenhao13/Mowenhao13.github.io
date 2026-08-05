---
layout: page
---

Authors: Jakub Binkowski, Denis Janiak, Albert Sawczyn, Bogdan Gabrys, Tomasz Kajdanowicz
Year: 2025
Venue: EMNLP 2025
Tags: #可解释性 #可视化方法 #幻觉检测 #图谱特征 #Laplacian #注意力图

## 核心贡献

本文提出 **LapEigvals 方法**，将注意力图视为图的**邻接矩阵**，通过计算 Laplacian 矩阵的 top-k 特征值作为幻觉检测探针的输入特征。实验表明，该方法在基于注意力的幻觉检测方法中达到了**最先进的性能**（SOTA），在 7 个数据集和 5 个 LLM 上均表现优异。

## 主要方法/发现

### 核心思路

- 将 LLM 注意力矩阵 A^{(l,h)} 视为有向图的加权邻接矩阵，每个 token 是一个节点，注意力权重是边权重。
- 定义 Laplacian 矩阵 L^{(l,h)} = D^{(l,h)} - A^{(l,h)}，其中 D^{(l,h)} 是出度矩阵（归一化后的出度）。
- 计算 Laplacian 的特征值，由于注意力矩阵的下三角性质，特征值即为对角线元素，排序后取 top-k 作为特征。
- 将所有层和所有头的 top-k 特征值拼接成特征向量，用 PCA 降维到 512 维，输入逻辑回归探针进行幻觉分类。

### 关键发现

- **Laplacian 特征值优于原始注意力矩阵的特征值**：将注意力矩阵转换为 Laplacian 是提取幻觉相关潜在特征的关键步骤。
- **全层信息优于单层**：幻觉信息分布在 LLM 的多个层中，使用所有层的信息比最佳单层效果更好。
- **高温解码下性能更好**：高温生成的回答更容易出现幻觉，但 LapEigvals 在所有温度下均保持最佳性能。
- **频谱特征比统计特征更强大**：与基于 log-determinant 的 AttentionScore 方法相比，Laplacian 特征值在统计显著性检验中 p 值更低，预测能力更强。

### 实验设置

- **数据集**：NQ-Open、TriviaQA、CoQA、SQuADv2、HaluEvalQA、TruthfulQA、GSM8k（共 7 个 QA 数据集）
- **模型**：Llama-3.1-8B、Llama-3.2-3B、Phi-3.5、Mistral-Nemo、Mistral-Small-24B（5 个开源 LLM）
- **评估指标**：AUROC（测试集）
- **探针**：logistic regression（scikit-learn，class_weight='balanced'）
- **k 值**：{5, 10, 20, 50, 100}，PCA 投影到 512 维

### 主要结果

| 模型 | 最佳数据集 | LapEigvals AUROC | 对比基线 |
|------|-----------|-----------------|---------|
| Llama-3.1-8B | TriviaQA | 0.889 | AttnLogDet: 0.842 |
| Mistral-Small-24B | GSM8k | 0.925 | AttnLogDet: 0.853 |
| Llama-3.2-3B | GSM8k | 0.870 | AttnLogDet: 0.851 |
| Phi-3.5 | GSM8k | 0.885 | AttnLogDet: 0.842 |
| Mistral-Nemo | GSM8k | 0.890 | AttnLogDet: 0.856 |

## 与子主题内其他论文的关联

- 与 [Explaining Attention with Program Synthesis](Explaining Attention with Program Synthesis.md) 互补：该论文关注注意力头的符号化描述，本文关注注意力图谱特征在幻觉检测中的应用。
- 与 [LIG: Layer-wise Integrated Gradients for Within-Layer Flow Analysis in Transformers](LIG: Layer-wise Integrated Gradients for Within-Layer Flow Analysis in Transformers.md) 共享"图视角"的分析方法：本文将注意力图视为邻接矩阵做谱分析，LIG 将每层 Transformer 视为动态图做归因分析。
- 与 [MultiModal/VLM幻觉评估](../../../../MultiModal/summaries/VLM幻觉评估/INDEX.md.md) 方向在幻觉检测任务上有关联，但本文聚焦于纯文本 LLM 的注意力谱特征。

## 源码链接

- GitHub: https://github.com/graphml-lab-pwr/lapeigvals

## 标签

- 注意力图谱特征
- Laplacian 特征值
- 幻觉检测（新范式）
- 信息流瓶颈
- 图神经网络视角