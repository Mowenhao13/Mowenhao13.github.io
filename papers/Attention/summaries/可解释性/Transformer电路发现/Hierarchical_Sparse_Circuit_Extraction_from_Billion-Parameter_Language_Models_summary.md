---
layout: page
---

**Hierarchical Sparse Circuit Extraction from Billion-Parameter Language Models through Scalable Attribution Graph Decomposition**

- **Authors**: Mohammed Mudassir Uddin, Shahnawaz Alam, Mohammed Kaif Pasha (MJCET, Hyderabad)
- **Year**: 2026
- **Venue**: -
- **arXiv ID**: 2601.12879

**核心贡献**

提出 HAGD（Hierarchical Attribution Graph Decomposition）框架，将电路搜索复杂度从 $O(2^n)$ 降低到 $O(n^2 \log n)$，首次实现从 117M 到 70B 参数的跨规模电路提取。通过跨层 transcoder、谱聚类、GNN 引导的层次化遍历和因果干预验证四阶段流水线实现。

**主要方法/发现**

1. **四阶段流水线**：
   - **跨层 Transcoder 训练**：在 RedPajama 语料上训练每层 transcoder，获得单语义特征字典。使用 TopK 稀疏编码和跨层预测头建模层间特征依赖。
   - **归因图构建**：通过梯度-激活内积构建加权有向归因图，量化特征间的因果影响。
   - **层次化分解**：使用归一化拉普拉斯谱聚类构建多分辨率图层次结构，将图还原为 $O(\log_b n)$ 层级的层次。
   - **GNN 引导电路搜索**：使用图注意力网络预测每个超节点属于目标电路的概率，引导搜索在层级结构中定位电路。
2. **因果验证协议**：通过必要性测试（消融电路组件验证行为退化）和充分性测试（验证电路单独再现目标行为）双标准验证。
3. **实验结果**：
   - 在 GPT-2（117M-774M）、Pythia（1.4B-6.9B）、Llama（7B-70B）上评估。
   - 模算术任务上行为保留达 91%（±2.3%），电路规模 49-347 节点。
   - ACDC 在 >1.4B 参数时内存耗尽，而 HAGD 可扩展到 70B。
   - 跨架构迁移系数 0.38-0.82，同家族（Llama-7B → Llama-70B）达 0.82。
4. **局限性**：忽略了注意力头电路、15-20% 不可解释的重建方差、消融验证的循环性问题。

**与子主题内其他论文的关联**

- 与 [Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework](Discovering Transformer Circuits via a Hybrid Attribution and Pruning Framework.md) 同为电路发现方法论，但 HAGD 专注于大规模模型的扩展性（10B+），而 HAP 聚焦于小模型的精确性。
- 与 [Weight-sparse transformers have interpretable circuits](Weight-sparse transformers have interpretable circuits.md) 共享稀疏性理念，但 HAGD 通过事后分析实现稀疏性，而非训练时强制稀疏。
- 使用跨层 transcoder 与 SAE 相关，与 [SAE 应用](SAE 应用.md) 子主题关联紧密。
- 是目前唯一展示从 7B 到 70B 规模电路提取的工作。

**源码链接**

未找到公开代码仓库

**Tags**

`2026` `Hierarchical Decomposition` `Scalable Circuit Discovery` `GNN` `Cross-layer Transcoder` `Billion-parameter Models` `Spectral Clustering`