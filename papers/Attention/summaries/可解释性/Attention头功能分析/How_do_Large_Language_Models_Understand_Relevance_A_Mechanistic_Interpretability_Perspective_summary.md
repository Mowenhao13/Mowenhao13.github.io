---
layout: page
---

**Authors**: Qi Liu, Jiaxin Mao, Ji-Rong Wen
**Year**: 2025
**Venue**: -
**arXiv**: 2504.07898
**Tags**: Attention头功能分析, Mechanistic Interpretability, 2025, Information Retrieval, Relevance Assessment, Activation Patching

## Core Contribution

从机械可解释性角度系统性地研究了 LLM 如何理解和操作化"相关性"（relevance）概念。使用激活修补（activation patching）技术，分析了 LLM 各模块在相关性判断中的作用，发现了一个多阶段渐进过程：早期层提取查询和文档信息，中层根据指令处理相关性信息，深层使用特定注意力头生成所需格式的相关性判断。

## Main Method / Findings

### 研究方法
- 使用激活修补（activation patching / 因果中介分析）技术
- 分析点式（pointwise）和对式（pairwise）两种提示格式的相关性判断任务
- 在 LLM 上追踪相关性信号在网络的各层和各模块中的流动

### 多阶段相关性处理过程
1. **早期层**：提取查询和文档信息
2. **中层**：根据指令处理相关性信息
3. **深层**：利用特定注意力头生成所需格式的相关性判断

### 主要发现
- 存在一些与任务无关的通用组件，跨不同任务（相关性判断、排序）和提示格式编码相关性信号
- 相关性信号在 LLM 的前向传播中经历了渐进式的信息处理过程
- 特定注意力头在深层负责最终的相关性判断输出

## Relation to Other Papers

- **Causal Head Gating**：两者都使用因果干预分析注意力头功能，但 Relevance Heads 采用激活修补（中介分析）而非门控框架。Relevance Heads 关注的是特定功能（相关性判断），而 CHG 提供一个通用的功能分析框架。
- **Cognitive Mirrors**：Cognitive Mirrors 关注通用推理认知功能，本论文关注信息检索中的相关性判断。两者都使用探针或因果方法分析头功能，但应用领域不同。
- **Which Attention Heads Matter for ICL**：本论文关注的"相关性判断头"与 ICL 论文中的"FV heads"都是特定功能的注意力头，但应用于不同任务领域（IR vs. ICL）。
- **Preference Heads**：两者都关注特定任务中的头功能（相关性判断 vs. 个性化偏好），都使用因果干预方法，都发现头功能具有专门化特征。
- **Quantifying Stability**：本论文基于单次训练模型的分析，Quantifying Stability 提醒我们跨种子稳定性可能影响这些发现的可靠性。

## Source Code

https://github.com/liuqi6777/llm-relevance

## Key Insights

1. 首次揭示了 LLM 中相关性判断的内部机制，将信息检索中的经典概念（相关性）与机械可解释性方法相结合。
2. 发现相关性处理遵循多阶段渐进过程，从信息提取到指令遵循再到格式输出，为理解 LLM 如何执行复杂的 IR 任务提供了新视角。
3. 识别出跨任务和提示格式的通用相关性组件，为设计更高效、更可解释的 LLM 检索系统提供了指导。
4. 为 LLM 在信息检索领域的应用（如文档排序、相关性标注）提供了理论基础。