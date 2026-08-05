---
layout: page
---


## 基本信息

- **标题**: Revealing the Impact of Visual Text Style on Attribute-based Descriptions Produced by Large Visual Language Models
- **作者**: Xiaomeng Wang, Martha Larson, Zhengyu Zhao
- **年份**: 2026
- **会议/期刊**: ICMR 2026 (International Conference on Multimedia Retrieval)
- **arXiv ID**: 2604.27553v1
- **论文类型**: 实验论文（实证分析）

## 核心贡献（新范式/新指标）

本文首次系统研究了**视觉文本风格**对 LVLM 生成的概念属性描述的影响，揭示了即使 LVLM 能够正确 OCR 识别文本内容，文本的视觉风格（字体、颜色等）仍会以意想不到的方式"泄漏"到模型的语义推理中。

核心贡献包括：
1. **风格泄漏现象发现**: 在概念被正确识别的前提下，LVLM 的属性描述并非风格无关（style-invariant）——功能性文本风格（黑色无衬线字体）和装饰性文本风格（彩色手写/草书字体）会引发不同的属性分布。
2. **Total Variation (TV) 距离分析**: 使用 TV 距离量化功能性风格与装饰性风格之间的属性分布差异：

$$\text{TV}(P, Q) = \frac{1}{2} \sum_{w \in V} |P(w) - Q(w)|$$

其中 $P$ 和 $Q$ 分别为两种风格下的属性分布，$V$ 为共享词汇表。
3. **统计显著性测试**: 使用 Pearson 卡方同质性检验验证风格差异的统计显著性。

## 方法

### 实验设计

1. **视觉文本生成**: 从 Oxford-IIIT Pet 数据集选取 32 个猫/狗品种标签作为概念。功能风格使用 8 种无衬线字体（Arial、Calibri、Consolas 等），黑色渲染；装饰风格使用 8 种手写/草书字体（Brush、Edwardian、Freestyle 等），从 5 种颜色中随机选择。每种风格每概念生成 36 张图像。

2. **OCR 过滤**: 仅保留模型能准确识别（字符串完全匹配）的视觉文本图像，排除 OCR 失败案例对属性分析的影响。

3. **属性描述收集**: 使用 5 个语义等价的提示模板（如 "输出此猫品种的典型属性列表，严格用形容词表达"），每个提示重复 5 次，共获得每概念每风格 900 条属性列表。

4. **后处理**: 使用 Llama-3.1-8B 作为辅助 LLM 提取形容词/描述性短语，标准化输出格式。

### 属性分布比较

为每个概念构建共享词汇表 $V$，计算功能风格和装饰风格下属性的经验分布。通过 TV 距离量化差异，并通过卡方同质性检验判断显著性。此外，对比同类字体间的 TV 距离（within-style distance）与跨类字体间的 TV 距离（across-style distance），以排除字体内随机变异的影响。

## 数据集/模型/实验方法

### 评估模型
- **Qwen2.5-VL-3B-Instruct**（开源 LVLM）
- **GPT-4o-mini**（闭源 LVLM）

### 评估数据
- **Oxford-IIIT Pet 数据集**: 32 个猫/狗品种标签作为概念（包括 Bengal、Chihuahua、Maine Coon、Pomeranian、Ragdoll 等）

### 主要结果

**1. 识别性能（OCR）**:
- Qwen2.5-VL-3B: 功能风格 98.51%，装饰风格 96.01%
- GPT-4o-mini: 功能风格 98.85%，装饰风格 99.05%
- 两种模型在两种风格上的 OCR 准确率均很高

**2. 属性分布差异**:
- 所有 32 个品种的 TV 值均显著大于零
- 所有概念的 $p$-值 < 0.001，表明差异具有统计显著性
- Qwen2.5-VL-3B-Instruct 比 GPT-4o-mini 表现出更大的风格敏感性

**3. 风格间 vs. 风格内距离**:
- 跨风格的平均 TV 距离始终大于同风格内字体的平均 TV 距离
- 证明 TV 距离的差异确实归因于风格差异，而非特定字体选择

**4. Top-3 属性分析**:
- 32 个品种中有 13 个的功能风格和装饰风格的 top-3 属性不同
- 差异主要表现为物理属性（如 compact、strong、small、fluffy）与气质属性的替换
- 在 5 个明显的替换案例中，4 次物理属性出现在功能风格 top-3 中（而非装饰风格）
- 提示装饰性文本可能与情感/气质属性有更强的关联

## 连接上下文

本文属于 LVLM 多模态感知一致性和鲁棒性研究方向。与 PRISM（跨模态知识一致性）、REST/REST+（跨模态不变性测试）等工作关注不同模态间的差异不同，本文揭示了"模态内不一致性"——即当同一概念通过文本本身的视觉风格变化呈现时，LVLM 的属性预测发生漂移。这一发现对以下领域具有重要启示：（1）多模态检索系统中的风格偏差评估；（2）文本丰富的视觉环境中的 LVLM 部署；（3）LVLM 评估协议中风格变化因素的纳入。研究结果补充了 Text as Images/VIM 工作中关于视觉编码器处理图像中文本能力的发现——即使 OCR 准确率很高，视觉风格仍会在语义层面引入意外偏差。

## 相关论文

### 视觉编码器分析
- 视觉语义揭示：[Revisit What You See Revealing Visual Semantics in Vision Tokens](Revisit What You See Revealing Visual Semantics in Vision Tokens.md)
- 空间理解局限：[Can Vision-Language Models See Squares](Can Vision-Language Models See Squares.md)
- 文本编码器瓶颈：[Text Encoders Bottleneck Compositionality in Contrastive VLMs](Text Encoders Bottleneck Compositionality in Contrastive VLMs.md)
- 文本即图像：[Text as Images Can MLLMs Follow Printed Instructions in Pixels](Text as Images Can MLLMs Follow Printed Instructions in Pixels.md)
- 文本或像素：[Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs](Text or Pixels Token Efficiency of Visual Text Inputs in MLLMs.md)

### 场景文字理解
- 语义误导：[When Semantics Mislead Vision Mitigating LMM Hallucinations in Scene Text](When Semantics Mislead Vision Mitigating LMM Hallucinations in Scene Text.md)
- 统一框架：[OmniParser Unified Framework for Text Spotting KIE and Table Rec](OmniParser Unified Framework for Text Spotting KIE and Table Rec.md)
