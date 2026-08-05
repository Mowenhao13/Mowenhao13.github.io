---
layout: page
---


## 基本信息

- **标题**: DeepSolo++: Let Transformer Decoder with Explicit Points Solo for Text Spotting
- **作者**: Maoyuan Ye, Jing Zhang, Shanshan Zhao, Juhua Liu, Tongliang Liu, Bo Du, Dacheng Tao
- **年份**: 2023
- **会议/期刊**: IEEE TPAMI
- **arXiv ID**: 2305.19957
- **论文类型**: 实验论文（新框架）
- **机构**: Wuhan University, University of Sydney, JD Explore Academy

## 核心贡献（新范式/新指标）

1. **显式点查询（Explicit Point Query）新范式**: 提出基于贝塞尔中心曲线采样点的显式点查询表示方法，将文本实例建模为有序点序列，单个Transformer解码器同时完成文本检测和识别，无需RoI操作和复杂的后处理。

2. **DeepSolo++多语言文本定位**: 在DeepSolo基础上扩展，引入脚本token建模和脚本感知匹配机制，单个解码器同时处理多语言文本检测、识别和脚本识别。

3. **高效训练**: 相比TESTR等Transformer方法，在有限数据下实现更快收敛和更高性能。

4. **弱标注兼容性**: 支持线段（line）标注而非多边形标注，大幅降低标注成本。

## 方法

### 总体架构

DeepSolo采用DETR-like架构，核心是用贝塞尔中心曲线表示文本实例，并在曲线上均匀采样N个点。

### 贝塞尔中心曲线建议

通过3层MLP预测4个贝塞尔控制点的偏移量：

$$
\overline{bp}_{ij} = (\sigma(\Delta p_{ij}^x + \sigma^{-1}(\hat{p}_{ix})), \sigma(\Delta p_{ij}^y + \sigma^{-1}(\hat{p}_{iy})))
$$

### 点查询建模

从Top-K建议曲线上均匀采样N个点，生成位置查询：

$$
P_q = \text{MLP}(\text{PE}(\text{Coords}))
$$

复合查询：$$Q_q = C_q + P_q$$

解码器中通过组内自注意力和组间自注意力更新查询。

### 并行预测头

四个简单的预测头：
1. 实例分类（线性层）
2. 字符分类（线性层）
3. 中心曲线点坐标（3层MLP）
4. 边界点坐标（3层MLP）

### 二分匹配损失

使用匈牙利算法进行匹配，引入CTC损失处理文本长度不一致问题：

$$
C(Y^{(g)}, \hat{Y}^{(\phi(g))}) = \lambda_{cls} \text{FL}'(\hat{b}^{(\phi(g))}) + \lambda_{text} \text{CTC}(t^{(g)}, \hat{t}^{(\phi(g))}) + \lambda_{coord} \sum_{n=0}^{N-1} |p_n^{(g)} - \hat{p}_n^{(\phi(g))}|
$$

### DeepSolo++多语言扩展

**脚本token建模**: 额外引入脚本token $$T_{\text{script}}$$，使用中心点生成其位置编码：

$$
C'_q = [C_q; T_{\text{script}}], \quad P'_q = [P_q; P_{\text{center}}]
$$

**脚本感知匹配**: 按脚本类型分组计算文本损失，对脚本类型不匹配的分配惩罚值。

## 数据集/模型/实验方法

### 单语言评估（DeepSolo）
- **数据集**: Total-Text, ICDAR2015, SCUT-CTW1500, ICDAR2019 ReCTS（中文）, DAST1500
- **预训练数据**: Synth150K, MLT17, IC13, IC15, TextOCR

### 多语言评估（DeepSolo++）
- **数据集**: ICDAR2019 MLT（7种脚本）, ICDAR2017 MLT
- **预训练数据**: SynthTextMLT, MLT19, ArT, LSVT, RCTW

### 骨干网络
- ResNet-50, Swin-T, ViTAEv2-S, ResNet-101, Swin-S

### 主要实验结果

**Total-Text定位（None指标）**:
- DeepSolo (Res-50, Synth150K): 78.83%
- DeepSolo (Res-50, +TextOCR): 82.54%
- DeepSolo (ViTAEv2-S, +TextOCR): 83.6%

**ReCTS中文文本定位（1-NED）**:
- DeepSolo (Res-50): 78.3%（创纪录，超越ABINet++ 76.5%）

**SCUT-CTW1500长文本定位**:
- DeepSolo (Res-50, 50点): 64.2%（25倍速度快于SPTS）

**MLT19多语言检测（Task 3联合检测+脚本识别）**:
- DeepSolo++ (Res-50): H-mean 74.9%, AP 64.5%（超越Multiplexed TextSpotter）

### 消融实验关键发现
- 文本匹配准则（CTC损失）对提升定位性能至关重要
- 训练数据量增加带来持续提升，TextOCR贡献最大
- 线标注兼容性良好，中心线偏移50%以内仍保持鲁棒
- ViTAEv2-S骨干优于ResNet-50约2.14%

## 连接上下文

DeepSolo/DeepSolo++ 代表了基于Transformer的场景文本定位方法的重要进展。与之前的方法（TESTR使用双解码器、TTS使用额外RNN）相比，DeepSolo的显式点查询设计实现了更高效的文本表示和学习。其多语言扩展 DeepSolo++ 直接对标Multiplexed TextSpotter等路由式多语言定位方法，但结构更简洁。该方法与OmniParser系列（使用中心点作为结构化表示）共享"点作为文本表示核心"的设计理念，但DeepSolo通过DETR的查询机制实现，而OmniParser采用两阶段自回归生成。在中文场景文本定位上的优异表现验证了该方法处理大字符集的能力。
