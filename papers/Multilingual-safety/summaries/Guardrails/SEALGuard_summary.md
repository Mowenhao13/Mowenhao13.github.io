---
layout: page
---

> **arXiv**: `2507.08898` | **年份**: 2025 | **Venue**: ACM Conference

## 核心贡献

SEALGuard 专门针对东南亚（Southeast Asia）语言的 LLM 安全对齐问题，提出了基于 SeaLLM 的多语言 guardrail。主要贡献包括：(1) 构建了 SEALSBench——一个包含 266,444 条 prompt 的大规模多语言安全数据集，覆盖英语和 9 种东南亚语言；(2) 证明现有的 LlamaGuard 在处理多语言不安全 prompt 和越狱 prompt 时性能显著下降；(3) 通过 LoRA 适配通用多语言语言模型（SeaLLM）作为多语言安全 guardrail，在防御成功率上提升 48%。

## 方法

SEALGuard 基于 SeaLLM-8B 多语言语言模型，通过 LoRA 低秩适配将其转换为 guardrail。核心流程包括：

**步骤 1**：应用 LlamaGuard 风格的 chat template，嵌入任务描述和安全类别定义。

**步骤 2**：通过 SeaLLM 的 BPE tokenizer 和 SentencePiece 将输入转为 token ID，然后通过 embedding 矩阵 $W \in \mathbb{R}^{V \times h}$ 变换为输入矩阵 $X \in \mathbb{R}^{L \times h}$，通过 28 层 transformer decoder 处理。

**步骤 3**：使用 LoRA 在 SeaLLM 的 embedding 层、self-attention 块和 FFNN 中注入低秩修改 $\Delta W = AB$，其中 $A \in \mathbb{R}^{h \times r}$、$B \in \mathbb{R}^{r \times h}$、$r \ll h$：
$$W_{LoRA} = W_{pretrained} + AB$$

**步骤 4**：通过贪心解码生成安全决策，首 token 为 "safe" 或 "unsafe"。

## 数据集与实验

**数据集构成**：SEALSBench 包含 266,444 条 prompt（169,433 条安全、80,601 条不安全、16,410 条越狱），覆盖 10 种语言和 10 种不安全内容类别、9 种越狱类型。

**语言覆盖**：英语 + 9 种东南亚语言（如马来语、印尼语、泰语、老挝语、高棉语、缅甸语、他加禄语、越南语等）。

**对比基线**：LlamaGuard 和 OpenAI Moderation。

**主要结果**：
- SEALGuard DSR 达 97%，F1 达 98%，Precision 达 99%
- 相比 LlamaGuard，DSR 提升 48%，F1 提升 34-58%
- LlamaGuard 在多语言不安全 prompt 上 DSR 从 59% 降至 50%（下降 9%）
- LlamaGuard 在多语言越狱 prompt 上 DSR 从 59% 降至 41%（下降 18%）
- OpenAI Moderation 在多语言不安全 prompt 上 DSR 从 60% 降至 29%（下降 31%）

**消融实验**：LoRA 适配是 SEALGuard 最关键的组件，将 F1 从 26% 提升至 98%。

## 关键发现

SEALGuard 揭示了低资源东南亚语言作为越狱攻击通道的严重安全风险。现有主流 guardrail（如 LlamaGuard）在英语环境下表现良好，但在东南亚语言上性能大幅下降。通过将预训练的多语言语言模型（而非英文中心模型）作为基础，使用 LoRA 进行安全对齐，可以在保持多语言能力的同时获得卓越的防御效果。

## 关联论文

[MrGuard](MrGuard.md)、[PolyGuard](PolyGuard.md)、[CREST](CREST.md)、[SelfDefend](SelfDefend.md)
