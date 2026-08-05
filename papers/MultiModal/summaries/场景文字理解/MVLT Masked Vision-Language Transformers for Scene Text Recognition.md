---
layout: page
---


## 基本信息

- **标题**: Masked Vision-Language Transformers for Scene Text Recognition
- **作者**: Jie Wu, Ying Peng, Shengming Zhang, Weigang Qi, Jian Zhang
- **年份**: 2022
- **会议/期刊**: BMVC 2022
- **arXiv ID**: 2211.04785
- **论文类型**: 实验论文（新框架）
- **机构**: Westone Information Industry INC.

## 核心贡献（新范式/新指标）

1. **显式+隐式语言语义联合学习**: 提出MVLT，首次在场景文本识别中同时学习显式语言语义（通过部分掩码字符预测）和隐式语言语义（通过全部掩码字符强制从视觉特征推断），共享解码器参数实现效率最大化。

2. **STR定制化掩码预训练策略**: 基于MAE（Masked Autoencoders）思想，设计双解码器结构分别建模显式（20%文本掩码率）和隐式（100%文本掩码率）语言信息。

3. **迭代纠正机制**: 微调阶段引入迭代纠正方法，将上一轮预测的文本特征作为下一轮解码器的语言输入，逐步修正预测结果。

4. **半监督预训练**: 提出利用无标注真实数据增强预训练的方法，减小合成数据与真实场景之间的域差距。

## 方法

### 预训练阶段

**掩码编码器**: 使用ViT作为编码器，以75%的掩码率随机掩码图像块，仅对未掩码块进行编码：

$$
v_u = \text{encoder}(x_u)
$$

**多模态解码器**: 视觉输入为编码后的未掩码块 $$v_u$$ 和掩码token $$v_m$$；语言输入为字符嵌入 $$t = [t_u, t_m]$$。双解码器共享参数：

$$
\hat{v}_m, \hat{v}_u, \hat{t}_m, \hat{t}_u = \text{decoder}(v_m, v_u, t_m, t_u)
$$

- **decoder1**（显式语义）：文本掩码率20%，部分可见字符提供词级语言线索
- **decoder2**（隐式语义）：文本掩码率100%，完全依赖视觉信息预测

**预训练损失**:

$$
\mathcal{L}_{\text{pretraining}} = \alpha \cdot \mathcal{L}_{v1} + \beta \cdot \mathcal{L}_{v2} + \gamma \cdot \mathcal{L}_{t1} + \varepsilon \cdot \mathcal{L}_{t2}
$$

其中 $$\mathcal{L}_v = \text{MSE}(\hat{v}_m, y_m)$$，$$\mathcal{L}_t = \text{Cross-Entropy}(\hat{t}_m, y_t)$$。

### 微调阶段

**不迭代时**：使用全部 `<mask>` token作为字符嵌入：

$$
\hat{t} = \text{decoder}(v, t_m)
$$

**迭代纠正**: 第k次迭代过程：

$$
prob^{\text{itr}=k} = \text{softmax}(\hat{t}^{\text{itr}=k-1})
$$

$$
t^{\text{itr}=k} = \text{linear}(prob^{\text{itr}=k})
$$

$$
\hat{t}^{\text{itr}=k} = \text{decoder}(v, t^{\text{itr}=k})
$$

第K次迭代的输出为最终纠正结果。

**微调损失**:

$$
\mathcal{L}_{\text{fine-tuning}} = \frac{1}{2} \text{CE}(\hat{t}^{\text{itr}=0}, y_t) + \frac{1}{2(K-1)} \sum_{j=1}^{K} \text{CE}(\hat{t}^{\text{itr}=j}, y_t)
$$

### 半监督预训练

将有标注和无标注数据在batch维度拼接，有标注数据使用完整损失，无标注数据仅使用MSE图像重建损失。

## 数据集/模型/实验方法

### 训练数据
- **有标注合成数据**: MJSynth (MJ) + SynthText (ST)
- **无标注真实数据**: 14个真实数据集去除标签（UR）
- **测试集**: ICDAR2013 (IC13), ICDAR2015 (IC15), SVT, SVTP, IIIT5K, CUTE80

### 模型配置
- **编码器**: ViT-B（同MAE设置）
- **解码器**: 轻量级Transformer（depth=4, width=512, 8注意力头）
- **输入尺寸**: 112×448（patch size 14×14）
- **字符序列长度**: 27
- **优化器**: AdamW，余弦学习率衰减

### 主要实验结果

| 方法 | IC13 | SVT | IIIT | IC15 | SVTP | CUTE |
|------|------|-----|------|------|------|------|
| ABINet | 97.4 | 93.5 | 96.2 | 86.0 | 89.3 | 89.2 |
| **MVLT** | **97.3** | **94.7** | **96.8** | **87.2** | **90.9** | **91.3** |
| **MVLT\*** | **98.0** | **96.3** | **97.4** | **89.0** | **92.7** | **95.8** |

（MVLT\*为使用无标注真实数据）

### 消融实验关键发现
- 同时使用显式和隐式语义损失优于单独使用任一损失
- 隐式语义学习带来的性能提升大于显式语义学习
- 迭代纠正在训练3次、测试3次时效果最佳
- 使用无标注真实数据在非规则文本上提升尤为显著

## 连接上下文

MVLT 聚焦于场景文本识别（STR）任务，创新性地将MAE预训练策略引入STR领域。与同期语言感知模型（ABINet, VisionLAN, SRN）相比，MVLT 首次实现了显式+隐式语义的联合学习。其迭代纠正机制借鉴了ABINet的思路，但适配了Transformer架构。该工作的半监督预训练策略启发了后续利用海量未标注真实数据增强STR模型的方法。与UNIT（统一视觉编码器）和DeepSolo（文本定位）不同，MVLT 专注于识别子任务，但在语言语义建模上提供了独特视角。
