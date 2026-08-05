---
layout: page
---


## 基本信息

- **标题**: Text or Pixels? It Takes Half: On the Token Efficiency of Visual Text Inputs in Multimodal LLMs
- **作者**: Jiawei Zhou, Yanhong Li, Zixuan Lan
- **年份**: 2025
- **会议/期刊**: arXiv preprint
- **arXiv ID**: 2510.18279v1
- **论文类型**: 实验论文（实证分析/新方法）

## 核心贡献（新范式/新指标）

本文系统研究了将长文本输入渲染为图像后输入多模态 LLM 的 **token 效率优势**，提出了一种无需微调的输入压缩方法。核心发现：将长文本渲染为单张图像后，MLLM 的视觉编码器可将数千个文本 token 压缩为少量视觉 token（通常减少约 50%），且不损失任务性能。

核心贡献包括：
1. **文本即图像（Text-as-Image）压缩框架**: 由 LaTeX 渲染管道将长文本上下文转换为图像，利用 MLLM 内置的视觉编码器作为隐式压缩层。
2. **系统性的压缩能力表征**: 提出 "文本 token 容忍度（text-token tolerance）" 概念——在性能不显著下降的前提下可压缩的最大文本 token 数，定量描述了视觉编码器在高密度文本渲染下的极限。
3. **压缩比（Compression Ratio）形式化**: 定义了文本 token 与视觉 token 的压缩关系：

$$\rho = \frac{T_{\text{text}}}{T_{\text{img}}} = \frac{m + |q|}{k + |q|} \approx \frac{m}{k}$$

其中 $m$ 为上下文文本 token 数，$k$ 为视觉 token 数，$|q|$ 为查询 token 数。

## 方法

### 问题形式化

**文本仅基线**: 将上下文 $c = (t_1, \ldots, t_m)$ 和查询 $q$ 拼接为序列 $s_{\text{text}} = (c, q)$，准确率预算为 $T_{\text{text}} = m + |q|$。

**文本-图像混合输入**: 将上下文渲染为图像 $I = \mathcal{R}(c)$，视觉编码器 $\Phi: I \mapsto (v_1, \ldots, v_k)$ 将其转换为 $k$ 个视觉 token，经过投影层后与查询拼接：

$$s_{\text{img}} = (\psi(v_1), \ldots, \psi(v_k), q)$$

token 预算为 $T_{\text{img}} = k + |q|$。当 $k \ll m$ 时实现显著压缩。

### ConTexImage 渲染流水线

使用 LaTeX 排版管道将文本渲染为图像，包含三个步骤：
1. **预处理**: 标准化印刷符号、转义 LaTeX 特殊字符
2. **LaTeX 渲染**: 使用 tectonic 编译 PDF 并栅格化为指定分辨率的图像
3. **自适应字体优化**: 搜索候选字号，选择满足目标填充比率（默认 0.8）的最大字号，确保可读性

## 数据集/模型/实验方法

### 评估模型
- **GPT-4.1-mini**（闭源 MLLM）
- **Qwen2.5-VL-72B-Instruct**（开源 MLLM，额外测试 7B 版本）
- **Gemini-2.5-flash-preview-04-17**（额外验证）

### 评估任务

**1. RULER S-NIAH（长上下文检索）**
- 在长干扰文本中隐藏一个目标数字（"needle"），模型需准确提取
- 测试不同视觉 token 预算 $k$ 下的文本 token 容忍度 $m^*(k)$

**2. CNN/DailyMail（文档级摘要）**
- 与两个专用 token 剪枝基线对比：Select-Context（基于自信息）和 LLMLingua-2（基于 Transformer 预测）

### 主要结果

**RULER 检索任务**:
- GPT-4.1-mini 在 $k=783$ 时容忍 $m^* \approx 1300$ tokens，压缩比 $\rho \approx 1.9$
- Qwen2.5-VL-72B 在 $k=635$ 时容忍 $m^* \approx 1289$ tokens，压缩比 $\rho \approx 2.04$
- 压缩比 $\rho \approx 2$ 在所有模型和所有分辨率设置下保持一致，呈近似线性关系
- 文本-token 容忍度与视觉 token 数呈强正相关

**延迟分析**:
- GPT-4.1-mini: 视觉处理添加 <1.5s 开销
- Qwen2.5-VL-72B: 缩短的解码序列带来 25-45% 端到端加速

**CNN/DailyMail 摘要**:
| 方法 | 保留 token | ROUGE-L | BERTScore |
|------|:---------:|:-------:|:---------:|
| Text-as-image | 225(-67%) | 15.31 | 85.33 |
| Select-Context | 295(-57%) | 12.79 | 85.01 |
| LLMLingua-2 | 265(-62%) | 13.75 | 85.25 |

文本即图像方法在相同或更高压缩率下全面超越专用剪枝基线。

### 关键影响因素
- **模型规模**: 7B 模型对文本密度更敏感，72B 模型具有更大容忍度
- **图像分辨率**: 决定视觉 token 数量，过高分辨率抵消压缩收益
- **最优分配**: 视觉 token 占总上下文约 50% 时达到最优平衡

## 连接上下文

本文属于 LLM 输入压缩与多模态效率研究方向。与 xRAG（用一个密集 embedding token 替代整个文档）、LLMLingua-2（token 级剪枝）等传统方法不同，文本即图像方法利用 MLLM 原生的视觉编码器作为压缩层，正交于 token 级方法，可与后者叠加使用。该工作揭示了一个反直觉但实用的发现：在 MLLM 中，将文本渲染为图像不仅可行，而且能在保持性能的同时显著降低解码器 token 消耗。这与 VIM（Text as Images）评估 MLLM 的视觉指令遵循能力互为补充——VIM 关注模型能否理解图像中的文本，而本工作关注这种能力带来的效率优势。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)
- 文本编码器瓶颈：[Text Encoders Bottleneck Compositionality in Contrastive VLMs](Text Encoders Bottleneck Compositionality in Contrastive VLMs.md)
- 文本即图像：[Text as Images Can MLLMs Follow Printed Instructions in Pixels](Text as Images Can MLLMs Follow Printed Instructions in Pixels.md)
- 视觉文本风格：[Revealing Impact of Visual Text Style on LVLM Descriptions](Revealing Impact of Visual Text Style on LVLM Descriptions.md)

### 场景文字理解
- 统一框架：[OmniParser Unified Framework for Text Spotting KIE and Table Rec](OmniParser Unified Framework for Text Spotting KIE and Table Rec.md)
- 文档理解：[UniDoc Universal LMM for Text Detection Recognition and Understanding](UniDoc Universal LMM for Text Detection Recognition and Understanding.md)
