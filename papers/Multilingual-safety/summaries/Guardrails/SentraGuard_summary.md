---
layout: page
---

> **arXiv**: `2510.22628` | **年份**: 2025 | **Venue**: arXiv

## 核心贡献

Sentra-Guard 提出了一个模块化、实时的多语言防御框架，核心创新在于分类器-检索器融合模块（classifier-retriever fusion module），结合 SBERT 嵌入与 FAISS 索引的语义检索来动态计算上下文感知的风险分数。此外，语言无关的预处理层支持 100+ 语言，并引入了人类在环（HITL）反馈机制实现对抗样本库的持续更新。关键指标：99.96% 检测准确率，0.004% 攻击成功率，平均延迟仅 47ms。

## 方法

Sentra-Guard 采用五组件融合架构：

**多语言输入归一化**：对所有非英语 prompt 通过神经机器翻译（NMT）引擎转为英语，统一语义表示，支持超过 100 种语言：
$$P' = T(P, L_{in} \rightarrow L_{std})$$

**三路并行推理**：
1. **语义检索分支**：使用 SBERT 编码 $v_p \leftarrow E(P')$，通过 FAISS 索引查询 top-k 近邻，RAG Comparator 评估输入与检索样本的语义接近度 $R_{score} \leftarrow R(P', \{n_1, \ldots, n_k\})$
2. **微调分类器**：基于 DeBERTa-v3 的二分类器，输出校准置信度 $P_C \leftarrow C(P') \in [0,1]$
3. **零样本分类模块**：使用 BART-MNLI 进行自然语言推理 $P_Z \leftarrow ZSC(P', \{\text{harmful}, \text{safe}\})$

**决策融合**：综合三路输出（$R_{score}$、$P_C$、$P_Z$）进行加权聚合，不确定案例升级到 HITL 模块。

## 数据集与实验

**训练数据**：56,000+ 样本的对抗语料库，涵盖越狱策略如 instruction override、token splitting、roleplay framing 等。

**评估基准**：HarmBench-28K 数据集。

**对比基线**：Zeng et al. 的多智能体系统（ASR 3.13%、延迟 6.95s）、Durmus et al. 的 prompt classifier（92.5% 准确率）、Inan et al. 的 zero-shot classifier（AUPRC 94.5%）、Robey et al. 的 moderation API（96.3% 精确度）等。

**主要结果**：
- 检测率 99.996%，AUC = 1.00，F1 = 1.00
- ASR 仅 0.004%
- 平均端到端延迟 47ms（远低于对比方法的 600ms 至 6.95s）
- HITL 机制将威胁适应时间减少 90% 以上

## 关键发现

Sentra-Guard 证明了检索增强（RAG）架构在实时越狱检测中的有效性。三路并行推理（语义检索+微调分类器+零样本推理）的设计确保了对已知和零日攻击的全面覆盖。HITL 反馈机制无需完全重新训练模型即可持续更新对抗知识库，在保持低延迟的同时实现了高准确率。语言无关的归一化层使得系统可以有效应对多语言和代码混合攻击。

## 关联论文

[SelfDefend](SelfDefend.md)、[PolyGuard](PolyGuard.md)、[CREST](CREST.md)
