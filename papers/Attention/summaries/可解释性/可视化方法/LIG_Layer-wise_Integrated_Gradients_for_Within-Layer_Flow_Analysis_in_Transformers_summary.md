---
layout: page
---

Authors: Eight Suzuki, Hideitsu Hino, Noboru Murata
Year: 2026
Venue: arXiv preprint (arXiv:2606.21564)
Tags: #可解释性 #可视化方法 #积分梯度 #LRP #层内信息流 #Transformer归因

## 核心贡献

本文提出 **LIG（Layer-wise Integrated Gradients）** 方法，将 Transformer 的每一层视为**动态图**，在非线性模块边界（ATT 和 MLP）应用**集合到集合的积分梯度（set-to-set IG）** 进行归因分析。LIG 结合了 IG 的完备性和 LRP 的层间传播思想，能够在模块粒度上分离 ATT 和 MLP 的贡献，实现层内信息流的可视化分析。

## 主要方法/发现

### 核心方法

1. **Transformer 层动态图视图**：将每层输入 token 表示和每个注意力头的输出视为节点，ATT 和 MLP 为模块边界。
2. **集合到集合的积分梯度（Set-to-set IG）**：在标准 IG（对标量目标）的基础上，扩展到从输入表示集合到输出表示集合的映射，通过 L2 标量化实现。
3. **LRP 风格路径组合**：将 ATT 和 MLP 的贡献按 LRP 风格组合，IG 的完备性在每层边界起到 LRP 的守恒关系作用。
4. **两种基线选择**：ATT 基线使用 Input Token Base（ITB，以自身 token 为参考），MLP 基线使用 ATTITB_{a=0}（ATT 输出在插值端点 a=0 的值）或 Zero 向量。

### 关键发现

- **ATT 基线选择是主要影响因素**：在 L2 归一化条件下，MLP 基线选择影响较小，而 ATT 基线选择是主要因素。
- **最佳配置**：使用目标 token 的嵌入作为 ATT 基线，ATTITB_{a=0} 或 Zero 作为 MLP 基线，能最好地保持层内一致性。
- **层内归因分析能力**：LIG 可以分离出 ATT 和 MLP 各自的贡献，并可视化 token 到 token 的贡献流动，揭示从局部关系到句子级信息整合的转变过程。

### 实验设置

- **模型**：BERT-Base（Uncased，L=12, H=12, D=768）
- **数据集**：PTB（Penn Treebank）
- **评估指标**：归一化 L2 准则（衡量模块归因组合与层整体归因之间的一致性）

### 与现有方法对比

- 相比 **Attention Rollout**：只依赖注意力权重，忽略 Value 向量和 MLP。
- 相比 **AttnLRP**：需要为每个操作和层重新设计传播规则，LIG 只依赖梯度计算。
- 相比 **SHAP/LIME**：这些方法面向标量目标，不适合集合到集合的模块边界归因。
- 相比 **Circuit Tracer**：依赖可解释的 SAE 特征，LIG 处理原始表示。

## 与子主题内其他论文的关联

- 与 [Explaining Attention with Program Synthesis](Explaining Attention with Program Synthesis.md) 不同：该论文通过符号程序替代注意力头，本文通过积分梯度做归因分析，两者形成"替代"与"归因"的互补视角。
- 与 [Hallucination Detection in LLMs Using Spectral Features of Attention Maps](Hallucination Detection in LLMs Using Spectral Features of Attention Maps.md) 共享"图视角"：本文将层视为动态图做归因分析，后者将注意力图视为邻接矩阵做谱分析。
- 与 [Attention 头功能分析](../../Attention头功能分析/INDEX.md.md) 方向相关，LIG 可以提供模块级归因来辅助理解注意力头的功能角色。

## 源码链接

- GitHub: https://github.com/eightsuzuki/layer-wise-integrated-gradients

## 标签

- 层内信息流分析（新范式）
- 集合到集合积分梯度
- LRP 风格传播
- ATT 与 MLP 分离归因
- 模块边界归因