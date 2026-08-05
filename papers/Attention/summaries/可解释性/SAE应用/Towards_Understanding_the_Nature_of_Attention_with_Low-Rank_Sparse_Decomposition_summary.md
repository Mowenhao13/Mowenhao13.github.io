---
layout: page
---

tags: [SAE, 稀疏自编码器, 注意力机制, 可解释性, 低秩分解, 注意力超叠加, 2025]
authors: Zhengfu He, Junxuan Wang, Rui Lin, Xuyang Ge, Wentao Shu, Qiong Tang, Junping Zhang, Xipeng Qiu
year: 2025
venue: arXiv

## 核心贡献

提出 **Low-Rank Sparse Attention (Lorsa)**，一种 Transformer 注意力层的稀疏替代模型，旨在将原始多头自注意力（MHSA）解耦为可独立理解的原子组件。Lorsa 直接针对"注意力超叠加"（attention superposition）问题——即多个注意力单元在少数 MHSA 头中纠缠共存的想象——提供了解耦方案。

## 主要方法

### 架构设计
- **1D OV 电路**：每个 Lorsa 头仅使用 1 维输出/值向量，限制读写操作为残差流上的少数特征方向
- **超大规模稀疏激活**：每层使用数千个 Lorsa 头（为原始 MHSA 头数的 500-1000 倍），每个 token 只激活 Top-K 个
- **QK 参数共享**：每 64/128 个 Lorsa 头共享一组 QK 权重，维持参数效率

### 训练方式
- 以 MSE 最小化为目标，预测原始 MHSA 的输出
- 在 Pythia-160M 和 Llama-3.1-8B 上训练，使用 8 亿 token 数据

### 主要发现
1. **重新发现已知注意力头**：成功复现归纳头（Induction Heads）、名称移动头（Name Mover Heads）、后继头（Successor Heads）、复制抑制头（Copy Suppression Heads）和注意力下沉（Attention Sinks）
2. **算术专用 Lorsa 头**：在 Llama-3.1-8B 中发现一整套算术运算专用头，每个头对应一个原子操作（如检测第一个操作数在 27-43 之间、第二个操作数末位为 2 等）
3. **主题锚点头**：发现部分 Lorsa 头表现为长距离、主题特定的注意力模式
4. **可解释性量化**：通过自动可解释性评估（Autointerpretability），Lorsa 与 SAE 特征在可解释性上达到同等水平
5. **注意力超叠加证据**：约 50% 的 Lorsa 头来自单个原始 MHSA 头，25% 跨越 2 个原始头，其余跨越 3 个以上

## 与本子主题其他论文的关联

- **Dimensional Collapse**：同为复旦大学 OpenMOSS 团队的工作。Lorsa 的"暗物质"（dark matter）分析与 Dimensional Collapse 论文中 Attention Output 的低秩结构问题相互印证——两者都发现稀疏字典学习方法在注意力层存在结构性的困难
- **Causal Interpretation of SAE Features**：Lorsa 采用 z-pattern（类 DFA）分析注意力的因果归因，与 CaFE 的 ERF 归因思路有方法论上的相似性，但应用在语言模型而非视觉
- **Steering SAE Latents**：Lorsa 侧重解耦和理解，而非主动控制。两者在"用稀疏特征理解和操控注意力机制"的目标上互补

## 源代码链接

- GitHub: https://github.com/OpenMOSS/Lorsa
- HuggingFace 权重: https://huggingface.co/fnlp/Lorsa