---
layout: page
---


## 基本信息

- **标题**: UniDoc: A Universal Large Multimodal Model for Simultaneous Text Detection, Recognition, Spotting and Understanding
- **作者**: Hao Feng, Zijian Wang, Jingqun Tang, Jinghui Lu, Wengang Zhou, Houqiang Li, Can Huang
- **年份**: 2023
- **会议/期刊**: arXiv
- **arXiv ID**: 2308.11592
- **论文类型**: 实验论文（新框架）
- **机构**: University of Science and Technology of China, ByteDance

## 核心贡献（新范式/新指标）

1. **首个四合一多模态大模型**: UniDoc 是第一个能够同时执行文本检测、文本识别、文本定位（端到端检测+识别）和多模态理解的大规模多模态模型，通过统一的多模态指令微调实现任务间的有益交互。

2. **统一多模态指令微调（Unified Multimodal Instruct Tuning）**: 将所有OCR任务和多模态理解任务统一为自然语言指令格式，利用任务间的正向协同效应提升各自性能。

3. **大规模指令微调数据集**: 贡献了包含文本检测、识别、定位和理解的指令跟随数据集（600K预训练 + 186K微调），数据来自CC3M、LAION-5B以及自建的PowerPoint演示文稿数据集。

## 方法

### 模型架构

UniDoc 遵循 MiniGPT-4 / LLaVA 范式：

1. **视觉编码器**: CLIP-ViT-L/14，提取图像特征（使用Transformer层前和层后的网格特征）
2. **投影层**: 线性层将视觉特征投影到LLM的嵌入空间
3. **大语言模型**: Vicuna（基于LLaMA的指令微调版本）

输入图像 $$I \in \mathbb{R}^{H \times W \times 3}$$ 和自然语言指令 $$Q$$，视觉嵌入序列 $$E_v$$ 与文本嵌入序列 $$E_l$$ 拼接后输入Vicuna生成响应。

### 两阶段训练

**预训练阶段**: 冻结视觉编码器和LLM，仅训练线性投影层。任务包括：文本检测、识别、定位和图像描述（captioning）。

**微调阶段**: 解冻LLM和投影层，新增多模态理解任务。检测结果以整数坐标格式 $$[x1, y1, x2, y2]$$ 输出。

### 指令模板

多样性指令模板（由GPT-4生成）：
- **检测**: "Output all the text's locations in the photo."
- **识别**: "Extract all the text in this photo." (10种变体)
- **定位**: "Recognize all the text in this picture and return their positions [x1, y1, x2, y2]." (10种变体)

## 数据集/模型/实验方法

### 训练数据

**预训练数据**（~1.2M）:
- CC3M筛选后的595K自然场景图像+标题
- 600K自建PowerPoint演示文稿图像（来自Common Crawl）+ OCR指令

**微调数据**（186K）:
- LLaVAR的16K LAION指令数据
- 150K自建OCR指令数据（检测、识别、定位各1/3）

### 模型配置
- 视觉编码器: CLIP-ViT-L/14（224×224输入分辨率）
- LLM: Vicuna-7B/13B
- 优化器: AdamW，单周期学习率策略
- 预训练: 最大学习率1e-3，batch size 128，8×A100 GPU
- 微调: 最大学习率1e-5，batch size 32

### 评估基准

**文本识别**: IIIT5K, SVT, IC13, IC15, SVTP, CUTE80, COCO-Text, CTW, Total-Text, HOST, WOST
**文本检测**: CTW1500, Total-Text, TD500
**VQA**: STVQA, OCRVQA, TextVQA, DocVQA, InfoVQA, ChartQA
**KIE**: FUNSD, SROIE, POIE
**数学表达式**: HME100K

### 主要实验结果

**文本识别**（与LMM对比）:
| 方法 | IIIT5K | SVT | IC13 | IC15 | SVTP | CT80 |
|------|--------|-----|------|------|------|------|
| BLIP-2 FlanT5XXL | 76.60 | 83.77 | 86.35 | 70.84 | 73.80 | 80.90 |
| MiniGPT-4 | 48.00 | 50.39 | 48.89 | 42.19 | 50.39 | 57.29 |
| **UniDoc** | **90.60** | **86.09** | **87.51** | **75.70** | **77.05** | **83.68** |

**文本检测**（CTW1500 F-score）: 38.27

**VQA/KIE**（LMM对比）:
- TextVQA: 40.72（最高）
- OCRVQA: 34.50（最高）
- STVQA: 30.78（最高）

### 消融实验关键发现
- 多任务联合训练：检测+识别+理解任务互相促进
- 定位指令优于单独的检测或识别指令（任务协同效应）
- 使用位置索引token未带来额外性能提升
- 定位指令下的识别准确率高于纯识别指令（91.30% vs 90.60%）

## 连接上下文

UniDoc 是在大语言模型（LLM）时代探索OCR与多模态理解融合的开创性工作。与 OmniParser（专注于高效率专用架构）不同，UniDoc 借助LLM的强泛化能力实现多任务统一。其"定位指令提升识别性能"的发现（任务协同效应）具有重要实践价值。然而，UniDoc 受限于224×224的低分辨率输入，在密集文本场景下的性能有限。后续工作（如OmniParser V2的SPOT+MLLM、TextMonkey）在此基础上引入高分辨率编码和结构化提示，进一步提升了MLLM在文本任务上的表现。UniDoc 与 Leopard（面向多图像场景的VLM）分别代表了LMM在文本领域的两个拓展方向：多任务/多图像。
