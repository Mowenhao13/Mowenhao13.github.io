---
layout: page
---


## 基本信息

- **标题**: VIM: Probing Multimodal Large Language Models for Visual Embedded Instruction Following
- **作者**: Yujie Lu, Xiujun Li, William Yang Wang, Yejin Choi
- **年份**: 2023
- **会议/期刊**: arXiv preprint
- **arXiv ID**: 2311.17647v1
- **论文类型**: 实验论文（新基准/新评估范式）

## 核心贡献（新范式/新指标）

本文提出 **VIM (Visual Embedded Instruction)**，一种全新的 MLLM 评估范式，将文本指令嵌入到图像视觉空间中，要求模型仅通过视觉模态来识别并遵循嵌入在图像中的指令，而非依赖 LLM 的文本理解优势。

核心创新包括：
1. **视觉嵌入指令（Visual Embedded Instruction）**: 将传统的文本+图像双模态输入转换为纯视觉输入——指令以文字形式嵌入到图像中，模型需从图像中读取并理解指令。
2. **VIM Bench**: 将 VIM 范式适配到 VQAv2、MME、MM-Vet、RefCOCO 系列等四个代表性基准，构建新的评估基准。
3. **三种上下文学习设置**: 零样本（Zero Shot）、一样本（One Shot）、双样本（Pair Shot），全面探测 MLLM 的视觉指令遵循能力。

## 方法

### VIM 范式

传统 MLLM 评估范式采用**图像 + 文本指令**的双模态输入，模型可以利用 LLM 强大的文本理解能力。VIM 范式将文本指令嵌入图像的视觉空间，模型必须同时具备视觉解读和指令理解两种能力：

- **Text Instruction**: 标准设置，图像和指令分别通过视觉和语言编码器输入
- **Mix Instruction**: 图像含嵌入指令 + 额外文本提示（如 "请回答图中的问题"），提供从标准设置到 VIM 的过渡
- **Visual-Embedded Instruction (VIM)**: 仅含嵌入指令的图像作为输入，无额外文本提示

### 数据构建

从源数据集中提取每个图像-问题对，将问题文本渲染到图像的空白区域（默认底部位置），形成包含嵌入指令的新图像。对于 One Shot 设置，拼接一个图像-问题-答案三元组作为参考；对于 Pair Shot 设置，拼接两个图像-问题对。

### 评估指标
- VQAv2: 标准 VQA 准确率
- MME: Correct, Acc, Acc+, Score（14 个子任务）
- MM-Vet: GPT-4 评估的分数（0-1 尺度）
- RefCOCO 系列: mIoU@0.5

## 数据集/模型/实验方法

### 评估模型
- **开源 MLLMs**: LLaVA-v1.5 (Vicuna-7B/13B), InstructBLIP (FlanT5-XXL), MiniGPT-v2 (LLaMA2-7B)
- **闭源 MLLM**: GPT-4V（2023 年 10-11 月版本）

### 主要实验结果

**零样本设置（VIM 全文）**:

| 模型 | VQAv2 (子集) | MME (子集) | MM-Vet (子集) | REC (子集) |
|------|:----------:|:---------:|:------------:|:---------:|
| LLaVA-7B | 0.00 | 0 | 10.1 | 0.0 |
| LLaVA-13B | 0.00 | 0 | 14.4 | 0.0 |
| InstructBLIP | 0.00 | 0 | 4.4 | 0.0 |
| MiniGPT-v2 | 3.25 | 26 | 5.6 | 0.0 |
| **GPT-4V** | **62.88** | **120** | **63.5** | **21.6** |

### 关键发现

1. **显著性能差距**: 开源 MLLM 与 GPT-4V 之间存在巨大差距，几乎所有开源模型在 VIM 设置下接近随机表现
2. **指令识别失败**: 开源模型经常将嵌入指令视为图像内容的一部分，生成图像描述而非回答问题（"description mode"）
3. **Mix 设置改善**: 添加 "请回答图中的问题" 文本提示后，LLaVA-7B 在 MME 上从 0 提升到 68（但仍主要输出 "Yes"）
4. **零基础 REC 性能**: 所有开源模型的 Referring Expression Comprehension 在 VIM 下全为 0

### 消融分析

- 指令识别测试：GPT-4V 几乎完美识别嵌入指令；LLaVA 能检测到部分词汇但语义理解不足
- 指令位置鲁棒性：GPT-4V 和 LLaVA 对指令位置（上/右/下）均表现鲁棒
- One Shot 设置：GPT-4V 倾向于回答两个问题而非仅最后一个，导致评估指标差异显著

## 连接上下文

本文属于 MLLM 评估基准研究方向，与 MME、MMBench、SEED-Bench、MM-Vet 等标准基准正交。VIM 揭示了一个关键问题：当前开源 MLLM 的视觉编码器可能不具备足够的视觉文本阅读能力，过多依赖 LLM 的文本理解先验。该工作与 CLIP 文本编码器瓶颈（Text Encoders Bottleneck Compositionality）和视觉文本风格影响（Revealing Impact of Visual Text Style）等研究共同指向了视觉编码器在真实多模态理解中的核心瓶颈地位。实验结果强烈建议在多模态指令微调中加入视觉嵌入指令数据增强以提升模型鲁棒性。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)
- 文本编码器瓶颈：[Text Encoders Bottleneck Compositionality in Contrastive VLMs](Text Encoders Bottleneck Compositionality in Contrastive VLMs.md)
- 文本或像素：[Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs](Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs.md)
- 视觉文本风格：[Revealing Impact of Visual Text Style on LVLM Descriptions](Revealing Impact of Visual Text Style on LVLM Descriptions.md)

### 场景文字理解
- 统一框架：[OmniParser Unified Framework for Text Spotting KIE and Table Rec](OmniParser Unified Framework for Text Spotting KIE and Table Rec.md)
- 文档理解：[UniDoc Universal LMM for Text Detection Recognition and Understanding](UniDoc Universal LMM for Text Detection Recognition and Understanding.md)
