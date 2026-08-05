---
layout: page
---


## 基本信息

- **标题**: OmniParser V2: Structured-Points-of-Thought for Unified Visual Text Parsing and Its Generality to Multimodal Large Language Models
- **作者**: Wenwen Yu, Zhibo Yang, Jianqiang Wan, Sibo Song, Jun Tang, Wenqing Cheng, Yuliang Liu, Xiang Bai
- **年份**: 2025
- **会议/期刊**: IEEE TPAMI
- **arXiv ID**: 2502.16161
- **论文类型**: 实验论文（统一框架扩展）
- **机构**: Huazhong University of Science and Technology, Alibaba Group

## 核心贡献（新范式/新指标）

1. **结构化点思维提示（SPOT Prompting）**: 提出类似Chain-of-Thought的两阶段推理范式，第一阶段生成结构化点序列（文本中心点+结构标记），第二阶段根据中心点生成多边形和内容，显式可解释的"中间步骤"提升推理性能。

2. **Token-Router共享解码器**: 基于简化的混合专家（MoE）机制设计token-router共享解码器，不同类别token（结构/检测/识别）路由到不同的FFN，相比OmniParser的三个独立解码器减少23.6%参数量。

3. **扩展到布局分析**: 在文本定位、KIE、表格识别的基础上，新增布局分析任务（词级/行级/段落级层次化检测）。

4. **SPOT应用于多模态大语言模型**: 将SPOT prompting技术迁移到MLLM（如InternVL1.5、Mini-Monkey），显著提升MLLM在文本定位和识别任务上的表现，验证SPOT的通用性。

## 方法

### 任务统一

统一接口包含三个子序列：
- **结构化点序列**: 中心点坐标量化为[0, nbins-1]离散token + 结构标记（`<tr>`, `<line>`, `<address>`等）
- **多边形序列**: 弯曲文本用16点格式，水平文本用4点边界框格式
- **内容序列**: 字符级token化

### Token-Router共享解码器

每个Transformer解码层包含token router和三个token特定的FFN：

$$
L = -\sum_{j=k}^{N} w_j \log P(\tilde{s}_j | \mathbf{v}, \mathbf{s}_{k:j-1})
$$

- 结构标记/实体标记权重 $$w_j = 4.0$$，其他token权重 $$w_j = 1.0$$
- bin大小 $$n_{\text{bins}} = 1000$$
- 显式监督token-expert关联，减少模型复杂度

### 预训练策略

**空间窗口提示**: 使用2点提示 $$(x_{left}, y_{top}, x_{right}, y_{bottom})$$ 指定窗口，仅输出窗口内文本中心点。

**前缀窗口提示**: 使用2字符提示（起始和结束字符），仅输出前缀在指定范围内的文本中心点。

### SPOT应用于MLLM

两步对话流程：
1. **Instruction 1**: "图像中的结构化点是什么？" → 生成结构化点序列
2. **Instruction 2**: "请分别提供每个点的位置坐标和文本内容" → 生成多边形和内容

三种SPOT变体：
- **N-SPOT**（正常）：两步推理
- **S-SPOT**（短）：省略中间步骤
- **L-SPOT**（长）：包含额外检测和识别提示步骤

## 数据集/模型/实验方法

### 预训练数据
Curved SynthText, ICDAR 2013, ICDAR 2015, MLT 2017, Total-Text, TextOCR, HierText, COCO Text, Open Image V5

### 评估基准
- **文本定位**: Total-Text, ICDAR 2015, CTW1500
- **KIE**: CORD, SROIE
- **表格识别**: PubTabNet, FinTabNet
- **布局分析**: HierText（词级/行级/段落级PQ）

### 主要实验结果

**文本定位**:
- Total-Text None: 84.3%
- CTW1500 None: 67.9%
- ICDAR 2015 Generic: 80.6%

**KIE**:
- CORD F1: 85.0%
- SROIE Acc: 94.0%

**表格识别**:
- PubTabNet TEDS: 88.9%
- FinTabNet TEDS: 90.5%

**布局分析（HierText）**:
- 验证集词级PQ: 60.0%, 行级PQ: 63.4%, 段落级PQ: 55.9%
- 测试集词级PQ: 61.6%, 行级PQ: 64.5%, 段落级PQ: 55.2%（全部SOTA）

**SPOT + MLLM**（InternVL1.5-2B）:
- 使用R980k+TS380k-N-SPOT: IC15 Trans 80.7%, Pos 69.1%
- Total-Text Trans 84.2%, Pos 73.3%

### 消融实验
- Token-Router共享解码器相比原生共享解码器平均提升+1.72%
- 参数量110M（OmniParser为144M），减少23.6%
- SPOT三步变体在部分场景下优于两步变体

## 连接上下文

OmniParser V2 是 OmniParser 的重要进化版本。相比第一版的三个独立解码器，V2通过token-router共享解码器大幅降低模型复杂度。SPOT prompting的核心思想——将文本解析分解为"先定位中心点，再预测细节"——与Chain-of-Thought推理理念一脉相承。更重要的是，V2首次验证了将结构化点序列提示迁移到MLLM中的可行性，为解决MLLM在文本定位任务上的固有缺陷提供了新思路。这与UniDoc（直接让LLM输出文本框坐标）形成对比，SPOT的中间步骤（中心点）使推理更加可解释和可对齐。
