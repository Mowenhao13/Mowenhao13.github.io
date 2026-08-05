---
layout: page
---


## 基本信息

- **标题**: LVLM-eHub: A Comprehensive Evaluation Benchmark for Large Vision-Language Models
- **作者**: Peng Xu, Wenqi Shao, Kaipeng Zhang, Peng Gao, Shuo Liu, Meng Lei, Fanqing Meng, Siyuan Huang, Yu Qiao, Ping Luo (OpenGVLab, Shanghai AI Laboratory, The University of Hong Kong, Peking University)
- **发表年份**: 2023
- **会议/期刊**: arXiv preprint (Under review)
- **arXiv ID**: 2306.09265v1
- **论文类型**: 综述/基准评测论文

## 领域研究摘要

大视觉语言模型（LVLM）是近年来多模态视觉-语言学习领域的主导技术范式。然而，在LVLM快速发展之际，领域内缺乏对其能力的系统性评估框架。LVLM的评估面临以下困境：

1. **评估碎片化**: 已有工作仅评估特定能力（如物体幻觉POPE、视觉常识ImageNetVC、OCR能力等），缺乏对LVLM能力的全面理解。
2. **零样本评估挑战**: LVLM的生成式回答具有多样性，传统指标（如CIDEr）难以有效评估内容质量，且生成结果对提示词高度敏感。
3. **开放世界评估缺失**: 大多数评估基于封闭域的标准任务，难以反映LVLM在真实开放场景中的表现。

该领域的研究重点正从单一任务评估转向多维能力综合评估，并引入人类反馈的在线评估机制，形成了"量化能力评估+人类偏好评估"双轨互补的评估范式。

## 核心贡献（新范式/新指标）

### 新范式：双轨评估框架
本文提出了**LVLM-eHub**，是首个针对LVLM的综合性评估基准。该基准采用"**量化能力评估 + 在线竞技场评估**"双轨机制：

1. **量化能力评估（Quantitative Capability Evaluation）**: 系统评估6大类多模态能力，涵盖47个标准文本相关视觉基准：
   - **视觉感知（Visual Perception）**: 图像分类、多类别识别、物体计数
   - **视觉知识获取（Visual Knowledge Acquisition）**: 光学字符识别（OCR，12个基准）、关键信息提取（KIE）、图像描述生成
   - **视觉推理（Visual Reasoning）**: VQA、知识引导图像描述、视觉蕴含
   - **视觉常识（Visual Commonsense）**: ImageNetVC、VCR
   - **物体幻觉（Object Hallucination）**: 基于POPE的幻觉评估
   - **具身智能（Embodied Intelligence）**: Minecraft、VirtualHome、Meta-World、Franka Kitchen

2. **在线竞技场评估（LVLM Arena）**: 基于Elo评分法的匿名成对用户投票评估，用户与两个匿名模型自由对话并投票选择更优模型，提供开放世界场景下的用户级排名。

### 关键发现
1. **大规模领域内数据过拟合**: 使用大量领域内数据微调的InstructBLIP在多数标准任务上表现最佳，但在开放世界场景（具身任务、Arena）中泛化能力差
2. **适度的指令微调导致幻觉**: 使用中等规模高质量指令数据微调的模型（如LLaMA-Adapter V2、LLaVA）更倾向于回答"Yes"，产生物体幻觉，且传统CIDEr指标对此失效
3. **多轮推理可缓解幻觉**: 采用多轮推理评估框架（如ChatGPT作为Questioner和Reasoner，LVLM作为Answerer）可以有效缓解物体幻觉问题

### 新评估方法
- **前缀分数（Prefix-based Score）**: 对多选QA任务，将视觉嵌入作为前缀输入LLM，通过候选答案的似然度选择最优答案
- **多轮推理（Multi-turn Reasoning）**: Questioner-Answerer-Reasoner循环迭代，直到推理出可信答案
- **用户研究（User Study）**: 针对具身AI任务，15名参与者在5个维度（物体识别准确度、空间关系理解、简洁性、计划合理性、可执行性）上评分

## 数据集/模型/实验方法

### 评估的模型（8个代表性LVLM）

| 模型 | 视觉编码器 | LLM | 适配模块 | 总参数量 | 微调参数量 |
|------|-----------|-----|---------|---------|-----------|
| BLIP2 | ViT-g/14 | FlanT5-XL | Q-Former | 4B | 107M |
| LLaVA | ViT-L/14 | Vicuna | FC层 | 7B | 7B |
| LLaMA-Adapter V2 | ViT-L/14 | LLaMA | B-Tuning | 7B | 63.1M |
| MiniGPT-4 | BLIP2-VE | Vicuna | FC层 | 7B | 3.1M |
| mPLUG-Owl | ViT-L/14 | LLaMA | LoRA | 7B | 388M |
| Otter | ViT-L/14 | LLaMA | Resampler | 9B | 1.3B |
| InstructBLIP | ViT-g/14 | Vicuna | Q-Former | 7B | 107M |
| VPGTrans | ViT-g/14 | Vicuna | Q-Former | 7B | 107M |

### 关键实验结果
- **视觉感知与知识获取**: InstructBLIP + BLIP2 + VPGTrans 因使用大视觉编码器(ViT-g/14)和Q-Former占据主导，但与监督SOTA仍有巨大差距
- **视觉推理**: InstructBLIP大幅领先，但在使用多轮推理时指令微调模型超越BLIP2
- **视觉常识**: LLaVA表现优异，显示视觉指令数据更新LLM的重要性
- **物体幻觉**: 指令微调模型（除InstructBLIP外）普遍倾向于回答"Yes"，幻觉更严重
- **具身智能**: LLaMA-Adapter V2在规划任务中得分最高，BLIP2因缺乏指令微调表现最差
- **Arena开放评估**: mPLUG-Owl、MiniGPT-4等指令微调模型排名靠前，InstructBLIP因过拟合排名靠后

## 连接上下文

LVLM-eHub填补了LVLM系统性评估的空白，与同期工作形成互补：POPE专门评估物体幻觉，ImageNetVC评估视觉常识，GVT评估视觉语义理解，而LVLM-eHub首次将这些维度整合为统一评估框架。该工作揭示了指令微调面临的核心矛盾——大规模领域内微调带来过拟合与泛化能力下降，而适度指令微调又加剧幻觉问题。这一发现对后续LVLM训练策略（如数据筛选、多轮推理评估、人类对齐）产生了重要影响。其提出的在线Arena评估范式也启发了后续Chatbot Arena等人类反馈评估平台的建设。
