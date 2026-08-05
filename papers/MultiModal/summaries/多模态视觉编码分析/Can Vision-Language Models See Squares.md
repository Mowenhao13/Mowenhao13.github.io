---
layout: page
---


## 基本信息
- **标题**: Can Vision-Language Models See Squares? Text-Recognition Mediates Spatial Reasoning Across Three Model Families
- **作者**: Yuval Levental (Rochester Institute of Technology)
- **发表**: arXiv 2026
- **arXiv ID**: 2602.15950
- **论文类型**: 实验论文（诊断/分析）

## 核心贡献（新范式/新指标）

这篇论文揭示了一个关键发现：**视觉语言模型（VLM）的视觉编码器对非文本视觉元素的空间定位能力远弱于对文本字符的定位能力**，即使两者都是通过相同的视觉编码器作为图像处理的。

### 核心实验设计
- 15个15×15的二值网格（填充密度10.7%-41.8%）
- 每种网格渲染为两种格式：（1）文本符号（`.`和`#`）；（2）无网格线的填充方块
- 三种前沿VLM：Claude Opus、ChatGPT 5.2、Gemini 3 Thinking

## 方法

### 实验条件
1. **文本符号条件**: 每个单元格渲染为`.`（空）或`#`（填充），使用等宽字体
2. **填充方块条件**: 每个单元格渲染为黑色/白色方块，无网格线
3. **Unicode方块条件**: 使用白色方块(U+2B1C)和黑色方块(U+2B1B)字符
4. **文字标签条件**: 在方块内嵌入"0"/"1"文字标签

### 评估指标
- 单元格准确率（225个单元格的正确分类率）
- 黑色单元格F1分数（精确率与召回率的调和平均数）

## 数据集/模型/实验方法

### 模型
- Claude Opus (Anthropic)
- ChatGPT 5.2 (OpenAI)
- Gemini 3 Thinking (Google)

### 核心结果

| 模型 | 文本条件F1 | 方块条件F1 | 差距 |
|------|-----------|-----------|------|
| Claude Opus | 83.4% | 29.6% | **-53.8** |
| ChatGPT 5.2 | 84.0% | 39.2% | **-44.8** |
| Gemini 3 Thinking | 62.8% | 28.7% | **-34.1** |

### 关键发现
1. **文本-方块F1差距在34-54点之间**，跨三个不同模型家族一致复现，说明这是当前VLM设计的基本属性
2. **Unicode方块产生中间性能**(69-77% F1)，说明差距是分级的而非二元的
3. **文字标签恢复性能**: 对Claude和Gemini，在方块内嵌入文字标签可恢复性能（甚至稀疏网格达100% F1）；但对ChatGPT反而下降（51.1% F1），揭示模型特定的文本-视觉通路交互
4. **三种不同的失败模式**:
   - Claude: 系统性**漏数**
   - ChatGPT: 大量**过度计数**
   - Gemini: **模板幻觉**（生成固定几何图案）

### 提出的双通路假说
VLM存在两条隐式空间信息处理通路：
1. **文本识别通路**: 识别图像中的字符，映射到离散token，高保真保留空间位置
2. **视觉特征通路**: 编码非文本视觉内容，近似捕捉空间关系但丢失精确坐标信息

## 连接上下文

该论文对**视觉编码器如何理解图像**提出了重要质疑——当前的VLM视觉编码器在CLIP等图像-文本对比学习范式下，优化的是全局语义对齐而非细粒度空间特征，导致对非文本元素的空间理解严重不足。这对"视觉编码器如何理解图像中的文字"有直接启示：VLM在处理图像中的文字时，实际上依赖于一条专门的"OCR-like"通路，而不是其视觉编码器的纯视觉处理能力。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md)
- 冗余分析：[Investigating Redundancy in MLLMs with Multiple Vision Encoders](Investigating Redundancy in MLLMs with Multiple Vision Encoders.md)
- 层级预训练：[HIVE Hierarchical Pre-Training of Vision Encoders with LLMs](HIVE Hierarchical Pre-Training of Vision Encoders with LLMs.md)
- 解耦编码：[Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation](Janus Decoupling Visual Encoding for Unified Multimodal Understanding and Generation.md)
- 文档专用编码器：[DAVE A VLM Vision Encoder for Document Understanding and Web Agents](DAVE A VLM Vision Encoder for Document Understanding and Web Agents.md)
- 层次结构涌现：[Emergent Visual-Semantic Hierarchies in Image-Text Representations](Emergent Visual-Semantic Hierarchies in Image-Text Representations.md)
- 文本编码器瓶颈：[Text Encoders Bottleneck Compositionality in Contrastive VLMs](Text Encoders Bottleneck Compositionality in Contrastive VLMs.md)

### 场景文字理解
- 视觉文本风格：[Revealing Impact of Visual Text Style on LVLM Descriptions](Revealing Impact of Visual Text Style on LVLM Descriptions.md)
- 文本即图像：[Text as Images Can MLLMs Follow Printed Instructions in Pixels](Text as Images Can MLLMs Follow Printed Instructions in Pixels.md)
- 文本或像素：[Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs](Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs.md)
