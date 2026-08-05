---
layout: page
---


## 基本信息

- **标题**: Leopard: A Vision Language Model for Text-Rich Multi-Image Tasks
- **作者**: Mengzhao Jia, Wenhao Yu, Kaixin Ma, Tianqing Fang, Zhihan Zhang, Siru Ouyang, Hongming Zhang, Meng Jiang, Dong Yu
- **年份**: 2024
- **会议/期刊**: arXiv (NeurIPS 2024)
- **arXiv ID**: 2410.01744
- **论文类型**: 实验论文（新模型/新数据集）
- **机构**: University of Notre Dame, Tencent AI Seattle Lab, UIUC

## 核心贡献（新范式/新指标）

1. **首个面向富文本多图像场景的专用VLM**: Leopard 专门针对文本丰富的多图像任务（多页文档、多图表、网页轨迹）进行优化，首次系统性地解决了MLLM在多图像文本场景下的性能瓶颈。

2. **Leopard-Instruct数据集（~100万指令微调实例）**: 包含925K指令微调样本（其中739K为富文本多图像样本），覆盖三大领域（文档与幻灯片、表格与图表、网页快照），含250K Chain-of-Thought推理过程。

3. **自适应高分辨率多图像编码模块**: 动态分配子图像预算、基于纵横比和分辨率的自适应分割策略、以及像素重组（Pixel Shuffling）无损压缩，有效平衡多图像高分辨率输入与序列长度限制。

## 方法

### 自适应高分辨率多图像编码

**预算分配**: 最大子图像数 $$M = 50$$，每个图像初始子图像数：

$$
S_i = \lfloor h_i / v \rfloor \times \lfloor w_i / v \rfloor
$$

其中 $$v = 364$$ 为编码器分辨率。若总子图像数超过 $$M$$，按比例缩放：

$$
\alpha = M / \sum S_i
$$

**图像分割**: 对 $$r \times c \leq S'_i$$ 进行网格搜索寻找最优分割，同时包含全局视图（缩放到 $$v \times v$$）。

**像素重组压缩**: 将相邻视觉特征沿特征维度拼接，序列长度减少 $$n$$ 倍（例如676个特征压缩为169个）。

### 模型架构

**Leopard-LLaVA变体**:
- 视觉编码器: SigLIP-SO-400M (364×364, patch size 14 → 26×26 = 676特征)
- 压缩后: 169特征/图像（像素重组）
- 视觉-语言连接器: 两层MLP
- 语言模型: LLaMA-3.1-8B
- 最大图像数: 50（最多8,450个视觉特征）

**Leopard-Idefics2变体**:
- 视觉编码器: SigLIP-SO-400M (980×980)
- 特征压缩: Resampler (64 tokens/图像)
- 语言模型: Mistral-7B

特殊token格式: `{Image i: <Img> <视觉特征序列> </Img>}`

### 训练细节

- 硬件: 64×A100-40G, batch size 128
- 优化器: AdamW (β1=0.9, β2=0.999)
- 学习率: 1e-5 (Leopard-LLaVA), 5e-6 (Leopard-Idefics2), 余弦调度 + 3%线性warmup
- 训练: 1 epoch, ~120 GPU天
- Leopard-LLaVA: 先训练连接器（558K LLaVA数据）, 再全参数微调

## 数据集/模型/实验方法

### Leopard-Instruct数据集（925K）

| 领域 | 描述 | 样本数 |
|------|------|--------|
| 文档与幻灯片 | 多页文档、手写、PDF、幻灯片 | 208K |
| 表格与图表 | 多表QA、多图推理、渲染表格 | 401K |
| 网页快照 | 网页操作预测、页面理解 | 55K |
| 通用 | ShareGPT4V（保持自然图像理解） | 313K |

**数据来源**:
- 公开数据集: MP-DocVQA, DUDE, SlideVQA, ChartQA, DVQA, ChartGemma, MultiHiertt
- 增强数据: 将DocVQA和ArxivQA拼接为多页格式
- GPT-4o生成: SlideShare幻灯片、Pew Research图表
- 网页数据: Mind2Web, OmniACT, WebScreenshots, WebUI

### 评估基准

**富文本多图像**: MP-DocVQA, DUDE, SlideVQA, MultiChartQA, MultiHiertt
**富文本单图像**: TextVQA, DocVQA, VisualWebBench
**通用领域**: MIRB, MiBench, MMMU, MathVista, ScienceQA-I

### 主要实验结果

**富文本多图像基准**（平均提升9.61分）:

| 模型 | MP-DocVQA | DUDE | SlideVQA | MultiChartQA | MultiHiertt | 平均 |
|------|-----------|------|----------|-------------|-------------|------|
| **Leopard-Idefics2** | **66.06** | **40.74** | **34.93** | **18.03** | 10.09 | **33.97** |
| Mantis-Idefics2 | 51.61 | 27.74 | 24.02 | 12.97 | 5.48 | 24.36 |
| Idefics2-8B | 46.67 | 23.06 | 25.14 | 2.59 | 9.89 | 21.47 |

**富文本单图像基准**:
- Leopard-Idefics2: TextVQA 80.40%, DocVQA 74.79%, 平均60.26%
- 超越Idefics2 6.4分（尽管后者使用20M+指令样本训练）

**消融实验关键发现**:
- 自适应高分辨率编码至关重要（移除后DocVQA下降-23.4）
- 任一数据域移除都会导致性能下降（文档数据移除影响最大-5.7）
- 子图像预算M=50时性能最优
- 使用LLaMA-3 vs LLaMA-3.1仅损失2.2分

## 连接上下文

Leopard 填补了视觉语言模型在富文本多图像场景中的空白。与单图像文本理解方法（UniDoc, OmniParser, TextMonkey）不同，Leopard 专门处理需要跨图像推理的场景——多页文档问答、多图表对比、网页操作序列理解。其自适应高分辨率编码模块为后续多图像VLM提供了"动态预算分配+像素重组压缩"的解决方案。Leopard-Instruct数据集的构建方法（GPT-4o生成+公开数据集增强）被后续多图像MLLM工作广泛借鉴。与OmniParser V2的SPOT+MLLM路线相比，Leopard 侧重于端到端的多图像理解，而非结构化文本解析。
