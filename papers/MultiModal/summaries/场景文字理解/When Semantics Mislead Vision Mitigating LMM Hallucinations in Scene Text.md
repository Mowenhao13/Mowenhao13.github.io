---
layout: page
---


## 基本信息
- **标题**: When Semantics Mislead Vision: Mitigating Large Multimodal Models Hallucinations in Scene Text Spotting and Understanding
- **作者**: Yan Shu, Hangui Lin, Yexin Liu, et al.
- **发表**: NeurIPS 2025
- **arXiv ID**: 2506.05551
- **论文类型**: 实验论文（诊断+方法）

## 核心贡献（新范式/新指标）

该论文识别并系统研究了**大多模态模型（LMM）在场景文字识别中的语义幻觉问题**，提出了无需训练的幻觉缓解框架。核心创新：

1. **定义"语义幻觉"**：当场景文字被扰动为语义无意义的字符串时，LMM倾向于生成语义合理但视觉上错误的答案（如将"MMOTEL"仍识别为"MOTEL"）。

2. **注意力漂移-幻觉相关性**：发现LLM中不同Transformer层对幻觉的倾向不同——**对场景文字区域关注更强的层更不容易产生语义幻觉**，建立了层间注意力分配与幻觉之间的强负相关关系（Spearman相关系数约-0.7~-0.8）。

3. **ZoomText（粗到细定位策略）**：无需外部检测器，通过Glimpse（利用query-to-image交叉注意力初估文字区域）和Refocus（利用注意力跨层变化筛除背景噪声）两步迭代定位场景文字区域。

4. **Grounded Layer Correction（GLC）**：自适应选择视觉锚定最强的Transformer层，将其隐藏状态融合到解码过程，减轻非语义样本的幻觉同时保留语义样本的正确性。

5. **TextHalu-Bench基准**：包含1740个精心设计的样本，涵盖非语义文字（孤立数字、不完整词汇等），跨越商业、工业、交通等5个场景类别。

## 方法

### 幻觉分析流程
1. 识别生成序列中第一个与ground-truth偏离的token作为"幻觉token"
2. 逐层计算幻觉倾向分数: $S_{hal}^\ell = P_{hal}^\ell/(P_{hal}^\ell+P_{gt}^\ell)$
3. 计算逐层文字区域注意力分数 $A^\ell$
4. 分析 $S_{hal}^\ell$ 与 $A^\ell$ 的相关性

### ZoomText
- Glimpse步骤: 使用query-to-image交叉注意力初估文字区域
- Refocus步骤: 基于"背景token跨层注意力变化稳定"的假设，筛除非文字区域

### Grounded Layer Correction
选择最优层 $\ell^\star = \arg\max_\ell A^\ell$，使用加权融合策略：
$$\hat{H}_i = (1-w) \cdot H_i^{(L)} + w \cdot H_i^{(\ell^\star)}$$

## 数据集/模型/实验方法

### 模型
- Mini-Monkey, Qwen2.5-VL, LLaVA-NeXT
- 对比Gemini 1.5-Pro, GPT-4o等商业模型

### 基准
- TextHalu-Bench（本文提出，1740样本）
- ST-VQA, TextVQA, GOT, OCR-VQA, SEED-Bench, AI2D

### 实验结果
- 在TextHalu-Bench上，Mini-Monkey提升4.1%（46.5→50.6 F1），Qwen2.5-VL提升5.5%（48.3→53.8 F1）
- 在ST-VQA上，Mini-Monkey提升约4%（66.7→70.6）
- 优于对抗训练和Chain-of-Thought两种基线缓解方法
- 在SEED-Bench、POPE、MME等多个泛化基准上也有稳定提升

### 关键消融
- ZoomText的Glimpse和Refocus两步各自贡献显著
- Fusion策略取得了幻觉缓解和语义保持的最佳平衡（权重 $w=0.1$ 最优）
- 自动选层优于早期/中期/晚期/随机选层

## 连接上下文

该论文属于**"视觉编码器如何理解图像中的文字"**方向的最新前沿工作。它揭示了当前LMM在处理场景文字时存在一个关键问题：模型依赖语义先验而非真正的视觉锚定。ZoomText+ GLC提供了一种无需训练的有效缓解方案，同时TextHalu-Bench为该方向的评估提供了标准化工具。
