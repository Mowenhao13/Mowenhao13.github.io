---
layout: page
---


## 基本信息
- **标题**: Janus: Decoupling Visual Encoding for Unified Multimodal Understanding and Generation
- **作者**: Chengyue Wu, Xiaokang Chen, Zhiyu Wu, Zizheng Pan, et al. (DeepSeek-AI, HKU, PKU)
- **发表**: arXiv 2024
- **arXiv ID**: 2410.13848
- **论文类型**: 实验论文（方法+实验）

## 核心贡献（新范式/新指标）

该论文提出了**Janus**，一个将多模态理解和生成的视觉编码解耦的自回归框架。核心创新：

1. **视觉编码解耦**：首次明确提出，在统一的多模态理解和生成框架中，**不同的任务对视觉编码器的信息粒度需求不同**：
   - **多模态理解**需要高层次语义信息（物体类别、视觉属性），关注高维语义表示
   - **视觉生成**需要局部细节和全局一致性，需要低维编码来保留细粒度空间结构和纹理细节

2. **双视觉通路架构**：引入两个独立的视觉编码通路——理解编码器（SigLIP）用于提取高维语义特征，生成编码器（VQ tokenizer）用于生成离散图像token，由同一个自回归Transformer处理。

3. **三阶段训练策略**：
   - Stage I：训练适配器和图像头，建立视觉与语言在嵌入空间的概念连接
   - Stage II：统一预训练，融合纯文本、多模态理解、视觉生成三类数据
   - Stage III：指令微调，提升指令遵循和对话能力

## 方法

### 架构
- **文本编码**：使用LLM内置tokenizer将文本转换为离散ID和特征表示
- **多模态理解编码**：SigLIP-Large-Patch16-384提取语义特征 → 理解适配器映射到LLM输入空间
- **视觉生成编码**：VQ tokenizer将图像转换为离散ID → 生成适配器映射到LLM输入空间
- **统一处理**：拼接所有特征序列送入自回归Transformer，文本用预测头、图像用单独初始化的预测头

### 训练目标
$$L = -\sum_i \log P_\theta(x_i | x_{<i})$$
- 文本理解和多模态理解任务：仅计算文本序列上的损失
- 视觉生成任务：仅计算图像序列上的损失

### 推理
- 使用无分类器引导（CFG）：$l_g = l_u + s(l_c - l_u)$，默认 $s=5$

## 数据集/模型/实验方法

### 模型配置
- 基座LLM：DeepSeek-LLM (1.3B)，最大序列长度4096
- 理解编码器：SigLIP-Large-Patch16-384
- 生成编码器：codebook大小16384，16倍下采样
- 适配器：2层MLP
- 图像分辨率：384×384

### 多模态理解基准结果（1.3B参数）

| 基准 | Janus | Show-o (1.3B) | LLaVA-v1.5 (7B) |
|------|-------|--------------|-----------------|
| POPE | 87.0 | 73.8 | 85.9 |
| MME-P | 1338 | 948 | 1510 |
| MMBench | 69.4 | 59.0 | 64.3 |
| SEED-Bench | 63.7 | 59.3 | - |
| GQA | 59.1 | 48.7 | 62.0 |

### 视觉生成基准结果
- **GenEval**: 61%（超越SDXL 55%、DALL-E 2 52%、Show-o 53%）
- **MSCOCO-30K**: FID 8.53（超越Show-o 9.24、LWM 12.68）

### 消融实验关键发现
1. **解耦vs共享编码器**: 共享编码器（VQ tokenizer用于理解和生成）在理解基准上大幅下降（POPE 60.1% vs 87.0%，MMB 35.0 vs 69.4）
2. **统一训练vs纯理解/生成**: Janus的统一训练在理解和生成上的性能与纯任务训练相当，说明解耦有效消除了任务间的冲突
3. **语义tokenizer + 共享编码器**（Exp-B）虽比纯VQ好，但仍显著低于解耦方法，证明解耦本身的必要性

## 连接上下文

Janus对理解**视觉编码器如何理解图像**提供了重要的架构洞见：多模态理解和生成任务对视觉表示的粒度要求根本不同，用单一编码器强制统一两者会导致性能妥协。解耦后的视觉编码体系允许每个任务使用最适合的编码方法（语义级的SigLIP vs 像素级的VQ tokenizer），对下一代通用多模态模型设计有重要指导意义。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md)
- 冗余分析：[Investigating Redundancy in MLLMs with Multiple Vision Encoders](Investigating Redundancy in MLLMs with Multiple Vision Encoders.md)
- 层级预训练：[HIVE Hierarchical Pre-Training of Vision Encoders with LLMs](HIVE Hierarchical Pre-Training of Vision Encoders with LLMs.md)
- 文档专用编码器：[DAVE A VLM Vision Encoder for Document Understanding and Web Agents](DAVE A VLM Vision Encoder for Document Understanding and Web Agents.md)
- 层次结构涌现：[Emergent Visual-Semantic Hierarchies in Image-Text Representations](Emergent Visual-Semantic Hierarchies in Image-Text Representations.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)

### 幻觉缓解
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
