---
layout: page
---

> **arXiv**: `2406.05498` | **年份**: 2024 | **Venue**: arXiv

## 核心贡献

SelfDefend 创造性地将传统系统安全中的 shadow stack（影子栈）概念引入 LLM 越狱防御领域，提出了一种通用的 LLM 越狱防御框架。核心思想是建立一个 shadow LLM 防御实例与目标 LLM 实例并发运行，利用双栈（normal stack + shadow stack）实现 checkpoint 式的访问控制。该框架同时利用了目标 LLM 自身的安全对齐能力和防御 LLM 的专用越狱检测能力，形成双重保护。

## 方法

SelfDefend 框架包含两个关键组件：目标 LLM 实例（LLM$_{target}$）在 normal stack 中正常处理用户查询并逐 token 输出；防御 LLM 实例（LLM$_{defense}$）在 shadow stack 中使用两种精心设计的检测提示模板——P$_{direct}$（直接检测 prompt 中的有害部分）和 P$_{intent}$（通过 Chain-of-Thought 推理识别查询的真正意图）。当 shadow stack 检测到无害时输出 "No" 触发 checkpoint 释放正常响应，否则拒绝回答并给出被识别的有害部分。

SelfDefend 还通过 GPT-4 数据蒸馏和 LoRA 微调，在 Llama-2-7b 上训练了专用的开源防御模型。蒸馏过程利用 Anthropic red-team 数据集中的 38,961 条有害/无害 prompt，通过 GPT-4 配合 P$_{direct}$ 和 P$_{intent}$ 产生高质量的标注数据，然后使用 LoRA 进行参数高效微调。

额外延迟定义为：
$$\Delta d = d_{total} - d_{normal}$$

## 数据集与实验

**越狱攻击类型**：覆盖五种主要类别——基于人工的（DAN）、基于优化的（GCG、AutoDAN、RLbreaker）、基于生成的（PAIR、TAP、LLM-Fuzzer）、间接越狱（DrAttack、Puzzler）和多语言越狱（MultiJail/Bengali）。

**基准模型**：GPT-3.5、GPT-4、Llama-2-7b-chat、Llama-2-13b-chat、Mistral-7B-Instruct-v0.2、Claude-3.5-sonnet。

**对比方法**：ICD、SafeDecoding、Perplexity Filter、SmoothLLM、Llama Guard、Llama Guard 2/3 等 7 种代表性防御。

**主要结果**：
- GPT-4 版 SelfDefend 将 ASR 平均降低 88.43%（降至 0.050）
- GPT-3.5 版 SelfDefend 将 ASR 平均降低 65.70%（降至 0.236）
- 在 60 个测试场景中，55 个场景优于所有对比方法
- 对正常用户查询的额外延迟几乎为零（>95% 场景零延迟）
- 微调模型的额外延迟平均仅 0-0.01 秒

## 关键发现

SelfDefend 是第一篇将影子栈概念用于 LLM 安全防御的工作，验证了 LLM 在 answering state 和 detection state 之间的显著差异（GPT-3.5 的 ASR 中位数差距达 2.29 倍，GPT-4 达 8.00 倍）。通过数据蒸馏训练的开源模型在防御效果上接近 GPT-4 级别的 SelfDefend，同时大幅降低了成本和延迟，适合实际部署。

## 关联论文

[MrGuard](MrGuard.md)、[PolyGuard](PolyGuard.md)、[CREST](CREST.md)、[ML-Bench_and_Guard](ML-Bench_and_Guard.md)
