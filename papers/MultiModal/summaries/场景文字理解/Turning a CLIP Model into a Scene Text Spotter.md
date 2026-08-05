---
layout: page
---


## 基本信息

- **标题**: Turning a CLIP Model into a Scene Text Spotter
- **作者**: Wenwen Yu, Yuliang Liu, Xingkui Zhu, Haoyu Cao, Xing Sun, Xiang Bai
- **年份**: 2023
- **会议/期刊**: IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)
- **arXiv ID**: 2308.10408
- **论文类型**: 实验论文（新框架/新骨干网络）
- **机构**: Huazhong University of Science and Technology, Tencent YouTu Lab

## 核心贡献（新范式/新指标）

1. **基于CLIP的场景文本检测/定位骨干网络**: 提出 FastTCM-CR50，将 CLIP 模型直接转化为场景文本检测与定位的骨干网络，无需特定预训练任务（pretext tasks），实现即插即用。

2. **双模态相似度匹配（BSM）模块**: 新引入的组件使CLIP文本编码器可在推理时离线计算，相比会议版本 TCM-CR50 推理速度提升 48.5%。

3. **少样本学习能力**: 仅使用10%监督数据，在文本检测任务上提升26.5%，在文本定位任务上提升5.5%。

4. **强泛化能力**: 在域适应任务中平均提升12.4%（检测）和14.8%（定位），尤其在夜间场景（NightTime-ArT）和旋转目标检测（DOTA）上表现突出。

## 方法

### 总体框架

FastTCM 作为 CLIP 模型与下游检测/定位头之间的桥梁，通过跨模态交互机制提取图像和文本嵌入。

### 图像编码器

使用 CLIP 的预训练 ResNet50 作为图像编码器，输入图像 $$I' \in \mathbb{R}^{H \times W \times 3}$$，输出图像嵌入:

$$
\boldsymbol{I} = \text{ImageEncoder}(\boldsymbol{I}') \in \mathbb{R}^{\tilde{H} \times \tilde{W} \times C}
$$

### 文本编码器

使用预定义的离散语言 prompt "Text" 和学习型 prompt：

$$
\boldsymbol{t}_{in} = [\boldsymbol{c}_1, \ldots, \boldsymbol{c}_n, \boldsymbol{t}_{in}'] \in \mathbb{R}^{(n+1) \times D}
$$

文本编码器输出文本嵌入：

$$
\boldsymbol{t}_{out} = \text{TextEncoder}(\boldsymbol{t}_{in}) \in \mathbb{R}^{C}
$$

### 语言提示生成器

通过元查询（Meta Query）生成隐式条件提示：

$$
\boldsymbol{cc} = \text{LN}(\sigma(\text{LN}(\boldsymbol{MQ})\boldsymbol{W}_1 + \boldsymbol{b}_1))\boldsymbol{W}_2 + \boldsymbol{b}_2 \in \mathbb{R}^{D}
$$

结合输入：$$\hat{\boldsymbol{t}}_{in} = \boldsymbol{cc} + \boldsymbol{t}_{in}$$

### 双模态相似度匹配（BSM）

计算文本嵌入与全局图像特征的余弦相似度：

$$
sim = \frac{\bar{\boldsymbol{I}} \cdot \boldsymbol{t}_{out}}{|\bar{\boldsymbol{I}}| |\boldsymbol{t}_{out}|}
$$

加权融合：

$$
\hat{\boldsymbol{t}}_{out} = sim \cdot \bar{\boldsymbol{I}} + \boldsymbol{t}_{out}
$$

### 视觉提示生成器

使用交叉注意力机制将文本语义传播到视觉特征：

$$
\tilde{\boldsymbol{I}} = \text{TDec}(Q=\boldsymbol{I}, K=\boldsymbol{t}_{out}, V=\boldsymbol{t}_{out}) \in \mathbb{R}^{\tilde{H} \times \tilde{W} \times C}
$$

增强后的图像嵌入：$$\hat{\boldsymbol{I}} = \boldsymbol{I} + \tilde{\boldsymbol{I}}$$

### 实例-语言匹配

生成二值文本分割图：

$$
\boldsymbol{P} = \text{sigmoid}(\hat{\boldsymbol{I}} \boldsymbol{t}_{out}^T / \tau) \in \mathbb{R}^{\tilde{H} \times \tilde{W} \times 1}
$$

辅助损失（二值交叉熵）：

$$
\mathcal{L}_{aux} = \sum_i^{\tilde{H}} \sum_j^{\tilde{W}} y_{ij} \log(P_{ij}) + (1 - y_{ij}) \log(1 - P_{ij})
$$

### 总体损失

$$
\mathcal{L}_{total} = \mathcal{L}_{task} + \lambda \mathcal{L}_{aux}
$$

## 数据集/模型/实验方法

### 数据集
- **文本检测**: ICDAR2013, ICDAR2015, MSRA-TD500, CTW1500, Total-Text, ArT, MLT17, MLT19, SynthText, CurvedSynthText-150k, TextOCR
- **文本定位**: Total-Text, ICDAR2015, CTW1500
- **旋转目标检测**: DOTA-v1.0

### 骨干网络与检测/定位方法
- **骨干**: FastTCM-CR50 / TCM-CR50 / CR50 / ResNet50
- **检测头**: DBNet, PAN, FCENet
- **定位头**: Mask TextSpotter v3, ABINet++, ABCNet, DeepSolo, TESTR

### 主要实验结果

| 方法 | 检测提升 | 定位提升 | 推理速度提升 |
|------|---------|---------|------------|
| FastTCM-CR50 vs R50 | +1.7% | +1.5% | - |
| FastTCM-CR50 vs TCM-CR50 | +0.2% | +0.56% | +48.5% |

### 少样本实验
- 10%训练数据：检测提升26.5%，定位提升5.5%
- 在Total-Text上使用ABCNet，10%数据时从43.5%提升至52.3%

### 泛化实验
- Synth-to-Real：从合成数据迁移到真实数据显著优于基线
- Real-to-Real：跨数据集迁移提升12.4%-14.8%

## 连接上下文

FastTCM-CR50 代表了利用大规模预训练视觉-语言模型（CLIP）增强场景文本理解的新方向。与 Language Matters 等工作通过设计专门预训练任务不同，FastTCM 直接将 CLIP 转化为文本检测/定位骨干，无需额外预训练。该方法与 DeepSolo（基于DETR的文本定位）和 OmniParser（统一文本解析框架）等技术兼容，可作为即插即用的骨干网络提升各类方法的性能。BSM模块的设计启发了后续在统一模型中高效利用CLIP知识的研究。
