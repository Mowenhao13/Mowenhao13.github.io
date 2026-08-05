---
layout: page
---


## 基本信息
- **标题**: Dissecting Query-Key Interaction in Vision Transformers
- **作者**: Xu Pan, Aaron Philip, Ziqian Xie, Odelia Schwartz
- **发表**: NeurIPS 2024
- **arXiv ID**: 2405.14880
- **论文类型**: 实验论文（分析/方法）

## 核心贡献（新范式/新指标）

该论文提出了一种**基于奇异值分解（SVD）分析Vision Transformer中Query-Key交互的新方法**，揭示了ViT自注意力机制如何在不同层次上处理语义信息。核心创新：

1. **分组与上下文化的层次转变**：首次系统性地发现，在大多数ViT（尤其是分类训练目标）中，浅层执行更多的"分组"（相似token相互注意），深层转向"上下文化"（不同token之间的注意力增加）。

2. **SVD分解Query-Key交互矩阵**：将自注意力中的 $W_q^\top W_k$ 矩阵分解为奇异模式（singular modes），左奇异向量对应query，右奇异向量对应key，从而揭示token之间的语义交互。

3. **语义化的奇异模式**：许多奇异模式在语义上是可解释的，如部分-部分注意、对象-对象注意、前景-背景注意。

## 方法

### 注意力偏好分析
- 使用Odd-One-Out (O3) 数据集（包含目标物体和干扰物的图像）
- 比较目标token和干扰物token的注意力分布覆盖范围（同类、异类、背景）
- 横跨16种不同ViT模型（6个模型家族）

### SVD分解公式
$$a_{ij} = q_i^\top k_j = x_i^\top W_q^\top W_k x_j$$

$$W_q^\top W_k = U\Sigma V^\top$$

其中 $U = \{u_1, ..., u_{d_k}\}$ 为左奇异矩阵，$V = \{v_1, ..., v_{d_k}\}$ 为右奇异矩阵，$\Sigma = diag(\sigma_1, ..., \sigma_{d_k})$ 为奇异值对角矩阵。

### 余弦相似度度量
- 计算左右奇异向量之间的余弦相似度
- 高余弦相似度 → token注意相似特征（分组）
- 低余弦相似度 → token注意不相似特征（上下文化）
- 加权平均（以奇异值为权重）

## 数据集/模型/实验方法

### 模型
- ViT (原始) [Dosovitskiy et al.]
- DeiT (蒸馏训练) [Touvron et al.]
- CLIP (图像-文本联合训练) [Radford et al.]
- DINO (自监督) [Caron et al.]
- SimMIM (掩码预测) [Xie et al.]
- I-JEPA (联合嵌入预测) [Assran et al.]

### 实验数据
- ImageNet验证集
- Odd-One-Out (O3) 视觉显著性数据集
- ADE20K语义分割数据集

### 关键实验结果
1. **注意力偏好层次变化**: 大多数ViT浅层注意同类token，深层注意不同token和背景
2. **训练目标的影响**:
   - SimMIM预训练模型最后几层增加对相似token的注意（局部化）
   - 在ImageNet分类微调后，SimMIM表现出与其他分类模型类似的下降趋势
3. **可解释的奇异模式示例**:
   - 浅层: 颜色、纹理等低级视觉特征
   - 深层: 部分-部分注意（动物面部注意眼鼻口）、对象-对象注意（鱼注意人）、前景-背景注意

## 连接上下文

该论文为理解**视觉编码器内部机制**提供了重要的分析工具和理论见解。通过揭示ViT自注意力在浅层做分组、深层做上下文化的层次结构，以及左右奇异向量对的可解释性，为理解"视觉编码器如何理解图像"提供了深层机理层面的解释。
