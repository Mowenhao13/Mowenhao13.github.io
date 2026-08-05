---
layout: page
---


**作者**: Shukang Yin, Chaoyou Fu, Sirui Zhao, Ke Li, Xing Sun et al.  
**发表时间**: 2023年6月23日  
**arXiv**: [2306.13549](https://arxiv.org/abs/2306.13549)  
**GitHub**: https://github.com/BradyFU/Awesome-Multimodal-Large-Language-Models  
**定位**: MLLM领域的奠基性综述  

---

## 一、论文概述

本文是**多模态大语言模型（MLLM）领域的开创性综述**，系统梳理了以GPT-4V为代表的MLLM的技术路线图。论文将MLLM定义为"以强大LLM为大脑执行多模态任务"的模型，覆盖了架构设计、训练策略、评估方法、能力扩展、幻觉问题、以及三项关键技术（M-ICL, M-CoT, LAVR）。

---

## 二、MLLM的基本范式

### 2.1 形式化定义

MLLM处理多模态输入并生成文本响应：

$$Y = \text{MLLM}(X_{\text{vision}}, X_{\text{language}}; \theta)$$

核心组件：

$$\text{MLLM} = \text{LLM} \circ \text{Connector} \circ \text{Visual Encoder}$$

其中：
- **Visual Encoder**: 将视觉输入编码为特征表示
- **Connector**: 将视觉特征映射到LLM的文本嵌入空间
- **LLM**: 在统一的多模态表示上进行推理和生成

### 2.2 三种主流架构

| 架构类型 | 代表模型 | 特点 |
|---------|---------|------|
| **Cross-Attention based** | Flamingo, CogVLM | 在LLM层间插入交叉注意力融合视觉特征 |
| **Q-Former based** | BLIP-2, InstructBLIP | 使用可学习的Query Transformer桥接模态 |
| **Projection based** | LLaVA, MiniGPT-4 | 通过线性投影/MLP直接将视觉特征映射到LLM空间 |

---

## 三、训练策略

### 3.1 两阶段训练范式

**第一阶段 — 预训练 (Pre-training)**:
- 目标：视觉-语言对齐
- 数据：大规模图像-文本对
- 可训练参数：Connector（LLM和Visual Encoder通常冻结）

$$\mathcal{L}_{\text{align}} = -\sum \log P(y_t \mid y_{<t}, X_{\text{vision}})$$

**第二阶段 — 指令微调 (Instruction Tuning)**:
- 目标：任务泛化与指令跟随
- 数据：视觉问答、图像描述、多模态对话等指令数据
- 可训练参数：Connector + LLM（部分或全部）

### 3.2 数据来源

- 图像-文本对: LAION, COCO, CC3M
- 指令数据: LLaVA-Instruct, MiniGPT-4数据集
- 学术数据集: VQAv2, OK-VQA, TextVQA

---

## 四、评估方法

| 评估维度 | 典型基准 | 度量指标 |
|---------|---------|---------|
| 视觉问答 | VQAv2, OK-VQA, GQA | Accuracy |
| 图像描述 | COCO Caption, NoCaps | CIDEr, SPICE |
| 多模态推理 | ScienceQA, MME | Accuracy |
| 幻觉评估 | POPE, CHAIR | F1, Accuracy |

---

## 五、核心扩展方向

### 5.1 粒度扩展
从图像级理解扩展到区域级（referring expression）和像素级（segmentation）理解。

### 5.2 模态扩展
从视觉+语言扩展到音频、视频、3D、触觉等更多模态。

### 5.3 语言扩展
从单语言扩展到多语言MLLM。

### 5.4 场景扩展
从通用场景扩展到医疗、遥感、文档理解等垂直领域。

---

## 六、三项关键技术

### 6.1 多模态上下文学习 (M-ICL)

在推理时通过少量多模态示例引导模型行为：

$$Y = \text{MLLM}((X_1, Y_1), \dots, (X_k, Y_k), X_{\text{query}})$$

### 6.2 多模态思维链 (M-CoT)

引导MLLM逐步推理复杂多模态问题，提升推理准确性和可解释性。

### 6.3 LLM辅助视觉推理 (LAVR)

利用LLM的规划和推理能力调用视觉工具（如检测器、分割器）解决复合视觉任务。

---

## 七、多模态幻觉问题

### 7.1 幻觉类型
- **对象幻觉**: 描述不存在的物体
- **属性幻觉**: 错误描述物体属性
- **关系幻觉**: 错误描述物体间关系

### 7.2 缓解策略
- 更好的视觉-语言对齐训练
- 检索增强生成 (RAG)
- 后处理纠正与自一致性

---

## 八、对多模态视觉模型安全的启示

作为MLLM领域的奠基性综述，本文虽未专门讨论安全问题，但其对MLLM架构、训练范式和脆弱性（尤其是幻觉问题）的系统梳理为后续的安全研究提供了必要的基础知识。理解MLLM的架构和训练流程是识别其攻击面和设计防御策略的前提。
