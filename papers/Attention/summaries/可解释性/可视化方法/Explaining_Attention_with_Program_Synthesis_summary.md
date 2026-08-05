---
layout: page
---

Authors: Amiri Hayes, Belinda Z. Li, Jacob Andreas
Year: 2026
Venue: arXiv preprint (arXiv:2606.19317)
Tags: #可解释性 #可视化方法 #程序合成 #Attention解释 #符号化 #因果替换

## 核心贡献

本文提出一种基于**程序合成（Program Synthesis）**的全新注意力机制解释范式。与传统的自然语言描述或探针方法不同，该方法直接搜索能够逼近注意力头计算过程的**可执行 Python 代码**，实现对注意力头的符号化描述。这些程序不仅可读、可验证，还可以直接替换原注意力头进行因果验证。

## 主要方法/发现

### 方法框架（四步流程）

1. **注意力图提取**：在目标模型处理输入文本时，记录每层每个注意力头的 ground-truth 注意力激活矩阵（格式为 A ∈ R^{n×n}）。
2. **程序合成与精炼**：使用另一个 LLM（Claude Sonnet 4）作为合成代理，根据提取的注意力模式（top 2.5% 权重）生成候选 Python 程序。候选程序通过 Jensen-Shannon 距离（JSD）评估拟合程度，并经过一轮反馈驱动精炼。
3. **评估**：使用 **IoU（Intersection over Union）** 衡量程序与真实注意力图的对齐程度。
4. **因果头替换**：将程序化的注意力输出直接替换回模型中，观测模型行为变化，验证程序是否捕获了因果相关的注意力特征。

### 主要发现

- 在 **BERT-Base、GPT-2-Small、TinyLlama-1.1B 和 Llama-3B** 四个模型上，大量注意力头可以被高精度逼近。
- **高达 25% 的注意力头**可以被符号程序替换，而困惑度仅增加 16%，且下游问答任务性能基本不受影响。
- 最终程序库包含 1,664 个程序（每个模型每个头一个），总生成成本约 $150（约 3,500 万输入 token + 350 万输出 token）。

### 使用的数据集/模型

- **模型**：BERT-Base、GPT-2-Small、TinyLlama-1.1B、Llama-3B
- **合成代理**：Claude Sonnet 4
- **评估基准**：PIQA 等问答任务
- **工具库**：NumPy、spaCy、NLTK

## 与子主题内其他论文的关联

- 与 [LIG: Layer-wise Integrated Gradients for Within-Layer Flow Analysis in Transformers](LIG: Layer-wise Integrated Gradients for Within-Layer Flow Analysis in Transformers.md) 同属 Transformer 内部机制的可视化/解释方法，但角度不同：本文通过生成可执行程序实现**符号化替代**，LIG 通过积分梯度做**模块边界归因分析**。
- 与 [Hallucination Detection in LLMs Using Spectral Features of Attention Maps](Hallucination Detection in LLMs Using Spectral Features of Attention Maps.md) 形成互补：前者利用注意力图谱特征做幻觉检测，本文关注注意力头本身的符号化描述。
- 与 [Transformer 电路发现](../../Transformer电路发现/INDEX.md.md) 方向相关，因为符号程序可视为电路发现的另一种形式化描述。

## 源码链接

- GitHub: https://github.com/AmiriHayes/explaining_attention_heads

## 标签

- 程序合成解释（新范式）
- 注意力头符号化
- 因果头替换
- 可验证解释