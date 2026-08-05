---
layout: page
title: 2025-2026 LLM Attention 可解释性最新论文检索报告
---

# 2025-2026 LLM Attention 可解释性最新论文检索报告

> 检索日期：2026-07-06
> 检索范围：2025年1月 - 2026年7月
> 共收录 **24 篇** 论文

---

## 1. 综述类 (Survey)

| 论文标题 | 作者 | 年份 | Venue | arXiv ID | 简要说明 |
|---------|------|------|-------|----------|---------|
| A Survey on Sparse Autoencoders: Interpreting the Internal Mechanisms of Large Language Models | Shu et al. | 2025 | EMNLP 2025 Findings | 2503.05613 | SAE综述：系统梳理了稀疏字典学习在LLM可解释性中的应用，涵盖特征识别、模型行为引导、表征分析和电路解读四大方向 |
| Attention Sink in Transformers: A Survey on Utilization, Interpretation, and Mitigation | Su et al. | 2026 | - | 2604.10098 | Transformer注意力沉没（Attention Sink）现象综述，涵盖产生机制、解释方法和缓解策略 |

---

## 2. Attention Head 功能分析

| 论文标题 | 作者 | 年份 | Venue | arXiv ID | 简要说明 |
|---------|------|------|-------|----------|---------|
| Causal Head Gating: A Framework for Interpreting Roles of Attention Heads in Transformers | Nam et al. | 2025 | **NeurIPS 2025** | 2505.13737 | ⭐ 提出因果头门控（CHG），将attention heads分为mover/copier/restrictor/suppressor四类功能角色 |
| Cognitive Mirrors: Exploring the Diverse Functional Roles of Attention Heads in LLM Reasoning | Ma et al. | 2025 | **NeurIPS 2025** | 2512.10978 | ⭐ 系统分析LLM推理任务中attention heads的功能多样性，发现其反映认知过程 |
| Which Attention Heads Matter for In-Context Learning? | Yin, Steinhardt | 2025 | - | 2502.14010 | ⭐ 对ICL中induction heads vs function vector heads进行解耦，发现FV heads是ICL关键（去除导致50-60%性能下降） |
| Quantifying LLM Attention-Head Stability: Implications for Circuit Universality | Bali et al. | 2026 | - | 2602.16740 | 量化attention head角色在随机种子间的稳定性，发现部分功能稳定、部分差异显著 |
| Preference Heads in Large Language Models: A Mechanistic Framework for Interpretable Personalization | Zhang et al. | 2026 | **ACL 2026** | 2604.22345 | 发现并命名"Preference Heads"——专门编码用户偏好的attention heads |
| How do Large Language Models Understand Relevance? A Mechanistic Interpretability Perspective | Liu et al. | 2025 | - | 2504.07898 | 发现一组专门负责相关性判断的attention heads（Relevance Heads） |

---

## 3. Transformer 电路发现

| 论文标题 | 作者 | 年份 | Venue | arXiv ID | 简要说明 |
|---------|------|------|-------|----------|---------|
| Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework | Gu et al. | 2025 | NeurIPS 2025 MechInterp Workshop | 2510.03282 | 结合梯度归因与迭代剪枝的混合电路发现框架 |
| Weight-sparse transformers have interpretable circuits | Gao et al. | 2025 | - | 2511.13653 | 将大部分权重约束为零训练，电路自然更易于理解 |
| An explainable transformer circuit for compositional generalization | Tang et al. | 2025 | - | 2502.15801 | 发现组合泛化的可解释电路：binding heads + structure heads |
| Mechanistic Unveiling of Transformer Circuits: Self-Influence as a Key to Model Reasoning | Zhang et al. | 2025 | - | 2502.09022 | 利用自影响（self-influence）揭示transformer推理电路机制 |
| Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models | Uddin et al. | 2026 | - | 2601.12879 | 提出层次化归因图分解（HAGD），可从十亿参数模型中提取稀疏电路 |
| A circuit for predicting hierarchical structure in-context in Large Language Models | Saanum et al. | 2025 | - | 2509.21534 | 发现LLM中用于预测上下文层级结构的专门电路 |

---

## 4. Sparse Autoencoders (SAE) 应用于 Attention 层

| 论文标题 | 作者 | 年份 | Venue | arXiv ID | 简要说明 |
|---------|------|------|-------|----------|---------|
| Towards Understanding the Nature of Attention with Low-Rank Sparse Decomposition | He et al. | 2025 | - | 2504.20938 | 提出Lorsa（低秩稀疏注意力），将MHSA解耦为可解释的稀疏组件 |
| Dimensional Collapse in Transformer Attention Outputs: A Challenge for Sparse Dictionary Learning | Wang et al. | 2025 | - | 2508.16929 | 发现attention输出的维度坍缩现象，是SAE的根本性挑战 |
| Causal Interpretation of Sparse Autoencoder Features in Vision | Han et al. | 2025 | - | 2509.00749 | 对ViT中SAE特征进行因果解读 |
| Steering Sparse Autoencoder Latents to Control Dynamic Head Pruning | Lee, Har | 2026 | - | 2603.26743 | 利用SAE潜变量控制ViT中的动态头剪枝 |

---

## 5. Induction Heads 研究

| 论文标题 | 作者 | 年份 | Venue | arXiv ID | 简要说明 |
|---------|------|------|-------|----------|---------|
| Induction Head Toxicity Mechanistically Explains Repetition Curse in Large Language Models | Wang et al. | 2025 | - | 2505.13514 | ⭐ 提出"Induction Head毒性"理论：induction heads过度激活导致token复制的过放大，解释LLM重复生成诅咒 |
| Temporal Dependencies in In-Context Learning: The Role of Induction Heads | Bajaj et al. | 2026 | - | 2604.01094 | 研究ICL中时间依赖性与induction heads的关系 |
| Understanding and Controlling Repetition Neurons and Induction Heads in ICL | Doan et al. | 2025 | - | 2507.07810 | 解耦LLM识别重复模式的能力与利用demonstrations的能力 |

---

## 6. Cross-Layer Transcoding (CLT)

| 论文标题 | 作者 | 年份 | Venue | arXiv ID | 简要说明 |
|---------|------|------|-------|----------|---------|
| Intrinsically Interpretable Attention via Sparse Post-Training | Draye et al. | 2025 | - | 2512.05865 | 后训练稀疏化使attention可解释（仅保留0.4%边），利用CLT简化归因 |
| Can Cross-Layer Transcoders Replace Vision Transformer Activations? | Chatzoudis et al. | 2026 | - | 2604.13304 | 研究CLT作为替代SAE的更有效ViT可解释性工具 |
| CLT-Forge: A Scalable Library for Cross-Layer Transcoders and Attribution Graphs | Draye et al. | 2026 | - | 2603.21014 | CLT-Forge工具库，支持大规模跨层transcoder训练和归因图构建 |
| Transcoders Trace Visual Grounding and Hallucinations in Vision-Language Models | Damianos et al. | 2026 | - | 2605.22902 | 将transcoder应用于VLM，追踪视觉接地和幻觉的电路 |
| Prune, Interpret, Evaluate: A CLT-Native Framework for Efficient Circuit Discovery | Chen et al. | 2026 | - | 2604.16889 | CLT原生框架，将特征归因与CLT结合实现高效电路发现 |

---

## 7. 多Head 冗余分析

| 论文标题 | 作者 | 年份 | Venue | arXiv ID | 简要说明 |
|---------|------|------|-------|----------|---------|
| Efficient LLMs with AMP: Attention Heads and MLP Pruning | Mugnaini et al. | 2025 | IJCNN 2025 | 2504.21174 | AMP框架，引入衡量attention heads功能重叠的新相似性指标 |
| Hidden Heroes and Gradient Bloats: Layer-Wise Redundancy Inverts Attribution in Transformers | Ye | 2026 | ICML 2026 Workshop | 2602.01442 | 发现层间冗余可反转梯度归因——使重要组件看起来不重要 |

---

## 8. Attention 可视化/解释方法

| 论文标题 | 作者 | 年份 | Venue | arXiv ID | 简要说明 |
|---------|------|------|-------|----------|---------|
| Explaining Attention with Program Synthesis | Hayes et al. | 2026 | - | 2606.19317 | ⭐ 用程序合成方法逼近attention heads，替换为人类可理解的符号程序描述（新范式） |
| Hallucination Detection in LLMs Using Spectral Features of Attention Maps | Binkowski et al. | 2025 | EMNLP 2025 | 2502.17598 | 利用attention map的图谱特征检测幻觉，识别具体幻觉heads |
| LIG: Layer-wise Integrated Gradients for Within-Layer Flow Analysis in Transformers | Suzuki et al. | 2026 | - | 2606.21564 | 将每层Transformer视为动态图，在模块边界应用积分梯度 |

---

## ⭐ 最值得重点关注的高影响力工作

按相关度 + 顶会等级综合排列：

| 排名 | 论文 | 理由 |
|------|------|------|
| 1 | **Causal Head Gating** (2505.13737) | NeurIPS 2025，attention head功能分类的统一框架 |
| 2 | **Which Attention Heads Matter for ICL** (2502.14010) | 解答ICL机制的核心争议 |
| 3 | **Cognitive Mirrors** (2512.10978) | NeurIPS 2025，attention head全面功能图景 |
| 4 | **Induction Head Toxicity** (2505.13514) | 揭示重复生成的机制根源 |
| 5 | **Explaining Attention with Program Synthesis** (2606.19317) | 程序合成解释attention的新范式 |
| 6 | **A Survey on Sparse Autoencoders** (2503.05613) | EMNLP 2025，SAE可解释性综述 |
| 7 | **Preference Heads** (2604.22345) | ACL 2026，用户偏好的attention基础 |
| 8 | **Quantifying Attention-Head Stability** (2602.16740) | 电路普适性的量化研究 |

---

## 📥 开放 PDF 可用性

以上所有论文均为 arXiv 预印本，PDF 均可直接从 `https://arxiv.org/pdf/{arxiv_id}` 获取（需要下载请告知）。