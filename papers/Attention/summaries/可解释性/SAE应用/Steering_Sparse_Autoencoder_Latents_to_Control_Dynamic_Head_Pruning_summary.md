---
layout: page
---

tags: [SAE, 稀疏自编码器, 动态头剪枝, 视觉 Transformer, 可解释性, 模型控制, 2026]
authors: Yousung Lee, Dongsoo Har
year: 2026
venue: AAAI (Student Abstract)

## 核心贡献

提出将 **k-稀疏自编码器**（k-sparse SAE）与**动态头剪枝**（Dynamic Head Pruning）框架（AdaViT）集成的新方法，使修剪决策在稀疏潜在空间层面变得可解释和可控。通过放大特定类别的 SAE 稀疏潜在变量，可以改变 ViT 的注意力头选择策略，实现**类别特定的高效推理**。

## 主要方法与发现

### 方法
1. **基线**：使用 AdaViT 框架，每个 Transformer 层有轻量级决策网络，根据 CLS token 的残差嵌入输出头重要性 logits，经 Gumbel-Sigmoid 采样得到二值掩码
2. **SAE 训练**：在 ViT 最后一层的残差嵌入上训练 k-sparse SAE（384d → 3072d 潜在空间，top-k=64，MSE 重建损失）
3. **潜在变量操控**：放大选定类别频繁激活的 SAE 潜在维度，重建后输入决策网络，观察修剪行为变化

### 主要实验
- 在 ImageNet 预训练的 ViT-Small 上微调 CIFAR-100，达到 91.27% 准确率
- SAE 重建质量高：MSE 0.0228，重建替换后准确率仅下降 0.12%，头使用率变化仅 +0.025
- 三种 steering 策略对比：
  - **Per-class frequent**：各类别最频繁激活的 top-k 潜在维度（最佳）
  - **Global frequent**：全局最频繁的潜在维度（次优）
  - **Random**：随机选择（最差）

### 主要发现
1. **类别特定头子集**：Per-class steering 揭示了紧凑的类别特定头子集。例如 bowl 类准确率 76%→82%，头使用率 0.72→0.33，主要依赖 h2 和 h5；pine tree 类准确率 79%→84%，头使用率 0.93→0.35，依赖 h2 和 h3
2. **语义相似类的共享模式**：语义相近的类别（如 bowl 和 plate）共享相似的头子集 h2 和 h5，表明 SAE 潜在变量编码了类别的语义结构
3. **正负 steering 不对称**：正 steering（放大潜在变量）减少头使用率；负 steering（抑制潜在变量）增加头使用率
4. **全局与 per-class 潜在重叠低**：全局 top-k 与 per-class top-k 潜在维度的重叠率仅 0.1641，说明 SAE 捕获了类别判别性概念

## 与本子主题其他论文的关联

- **Lorsa**：Lorsa 解耦注意力为可理解的原子组件，本论文则更进一步——直接用 SAE 潜在变量操控注意力的修剪行为。两者都是"SAE 应用在注意力层"的典型范例
- **Dimensional Collapse**：本论文的 SAE 训练可能受益于 Dimensional Collapse 提出的 ASI 初始化方法，减少死亡特征后 steering 操控会更可靠
- **Causal Interpretation of SAE Features**：CaFE 发现 SAE 特征存在"非局部化"问题，需要因果解释。本论文通过 steering 实验直接验证了 SAE 潜在变量确实编码了类别语义信息（如 bowl 和 plate 共享潜在维度），从控制视角回答了 CaFE 提出的"特征真正代表什么"问题

## 源代码链接

未找到公开代码仓库。