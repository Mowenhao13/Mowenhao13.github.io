---
layout: page
---


## 基本信息

- **标题**: OmniParser: A Unified Framework for Text Spotting, Key Information Extraction and Table Recognition
- **作者**: Jianqiang Wan, Sibo Song, Wenwen Yu, Yuliang Liu, Wenqing Cheng, Fei Huang, Xiang Bai, Cong Yao, Zhibo Yang
- **年份**: 2024
- **会议/期刊**: CVPR 2024
- **arXiv ID**: 2403.19128
- **论文类型**: 实验论文（统一框架）
- **机构**: Alibaba Group, Huazhong University of Science and Technology

## 核心贡献（新范式/新指标）

1. **首个统一视觉文本解析框架**: OmniParser 是第一个同时处理文本定位（Text Spotting）、关键信息提取（KIE）和表格识别（Table Recognition）的统一模型，使用单一编码器-解码器架构和统一的point-conditioned文本生成目标。

2. **结构化点序列（Structured Points Sequence）**: 将异构任务统一为"中心点序列+结构化标记"的表示形式，中心点作为连接结构标记与区域/内容序列的桥梁。

3. **两阶段生成策略**: 第一阶段生成结构化点序列（中心点+结构标记），第二阶段为每个中心点生成多边形轮廓和文本内容，显式解耦大幅降低序列学习难度。

4. **两种预训练策略**: 空间窗口提示（Spatial-Window Prompting）和前缀窗口提示（Prefix-Window Prompting），分别增强模型的空间坐标感知和语义感知能力。

## 方法

### 任务统一

所有任务的输出统一为三个子序列：
- **结构化点序列**: 中心点坐标 $$(x, y)$$ 量化为离散token + 任务特定结构标记
- **多边形序列**: 16点多边形轮廓表示
- **内容序列**: 字符级token化的文本转录

### 统一架构

**图像编码器**: Swin-B（ImageNet 22k预训练）+ FPN

**三个独立解码器**: 结构化点解码器、区域解码器、内容解码器（架构相同，参数独立）

**目标函数**（负对数似然）：

$$
L = -\sum_{j=k}^{N} w_j \log P(\tilde{s}_j | \mathbf{v}, \mathbf{s}_{k:j-1})
$$

其中结构标记或实体标记的权重 $$w_j = 4.0$$，其他token权重 $$w_j = 1.0$$。

### 预训练策略

**空间窗口提示**: 指定空间窗口 $$(x_{left}, y_{top}, x_{right}, y_{bottom})$$，仅输出窗口内的文本中心点。支持固定模式（均匀网格布局）和随机模式（至少覆盖图像1/9）。

**前缀窗口提示**: 指定字符前缀范围（如 "B"到"H"），仅输出前缀在此范围内的文本实例中心点，帮助模型学习字符级语义。

## 数据集/模型/实验方法

### 预训练数据
Curved SynthText, ICDAR 2013, ICDAR 2015, MLT 2017, Total-Text, TextOCR, HierText, COCO Text, Open Image V5

### 训练配置
- **两阶段预训练**: 第一阶段768×768分辨率（batch 128, 500k步），第二阶段1920×1920分辨率（batch 16, 200k步）
- **优化器**: AdamW，初始学习率 5e-4 / 2.5e-4，余弦退火调度
- **数据增强**: 实例感知随机裁剪、随机旋转（-90°~90°）、随机缩放、颜色抖动

### 评估基准

**文本定位**: Total-Text, ICDAR 2015, CTW1500
**KIE**: CORD, SROIE
**表格识别**: PubTabNet, FinTabNet

### 主要实验结果

**文本定位**:
- Total-Text None: 84.0% (SOTA)
- CTW1500 None: 66.8% (SOTA)
- ICDAR 2015 Generic: 79.9%

**KIE**:
- CORD F1: 84.8%
- SROIE Acc: 93.6%

**表格识别**:
- PubTabNet TEDS: 88.8%
- FinTabNet TEDS: 89.7%

### 消融实验
- 空间窗口提示 + 前缀窗口提示联合使用时达到最优
- Swin-B骨干优于ResNet-50
- 解码器参数不共享优于共享

## 连接上下文

OmniParser 代表了视觉文本解析领域从"任务专用"到"任务统一"的重要转变。与DeepSolo（基于DETR的文本定位）、TESTR（基于Transformer的双解码器定位）等专注于文本定位的方法不同，OmniParser 将文本定位、KIE和表格识别纳入统一框架。其两阶段设计（先预测中心点再预测多边形/内容）与后续OmniParser V2的SPOT（Structured-Points-of-Thought）理念一致。该方法与UniDoc（基于LLM的多任务方法）形成对比：OmniParser 采用专用编码器-解码器架构追求高效率和高精度，而UniDoc 借助大语言模型的泛化能力。OmniParser 的结构化点序列表示被后续工作广泛借鉴。
