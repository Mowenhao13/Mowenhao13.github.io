---
layout: page
---


## 基本信息

- **论文标题**: Aligning Large Multimodal Models with Factually Augmented RLHF
- **作者**: Zhiqing Sun, Sheng Shen, Shengcao Cao, Haotian Liu, Chunyuan Li, Yikang Shen, Chuang Gan, Liang-Yan Gui, Yu-Xiong Wang, Yiming Yang, Kurt Keutzer, Trevor Darrell
- **机构**: CMU, UC Berkeley, UIUC, UW-Madison, UMass Amherst, Microsoft Research, MIT-IBM Watson AI Lab
- **年份**: 2023
- **arXiv ID**: 2309.14525
- **论文类型**: 评估方法 - GPT-4裁判

## 核心贡献

本文提出了**LLaVA-RLHF**——首个将**强化学习人类反馈（RLHF）**成功应用于多模态大型模型的系统，同时贡献了**MMHal-Bench（MultiModal Hallucination Benchmark）**——一个专门用于评估LMM幻觉的基准测试。

### MMHal-Bench的创新

MMHal-Bench与已有的评估基准有两个关键区别：

1. **专一性（Speciality）**：不同于LLaVA-Bench、MMBench等评估响应质量的通用基准，MMHal-Bench专注于检测LMM响应中的幻觉。
2. **实用性（Practicality）**：不同于CHAIR和POPE等仅使用Yes/No问答的方法，MMHal-Bench采用**开放式的真实场景问题**，更贴近实际用户交互。

MMHal-Bench包含**96个图像-问答对**，覆盖 **8种问题类型** $\times$ **12个目标类别**：

**8种问题类型**：
- 目标属性（Object Attribute）：对目标颜色、形状等属性的错误描述
- 对抗目标（Adversarial Object）：询问图像中不存在的目标
- 比较（Comparison）：对多目标属性的错误比较
- 计数（Counting）：目标数量错误
- 空间关系（Spatial Relation）：目标间空间关系错误
- 环境（Environment）：对图像环境的错误推断
- 整体描述（Holistic Description）：详细描述中的整体性错误
- 其他（Others）：文本识别、图标识别等错误

**12个目标类别**：accessory, animal, appliance, electronic, food, furniture, indoor, kitchen, outdoor, person, sports, vehicle

### Factually Augmented RLHF (Fact-RLHF)

为解决RLHF中的**奖励黑客（Reward Hacking）**问题，Fact-RLHF在奖励模型中引入额外的事实信息（如图像描述或标准答案选项），使奖励模型能更准确地判断响应是否忠实于图像。

奖励模型的损失函数：

$$
\mathcal{L}(r_\theta) = -\mathbb{E}_{(I,x,y_0,y_1,i)\sim\mathcal{D}_{\text{RM}}}[\log\sigma(r_\theta(I,x,y_i) - r_\theta(I,x,y_{1-i}))]
$$

RL阶段的优化目标：

$$
\mathcal{L}(\pi_\phi^{\text{RL}}) = -\mathbb{E}_{(I,x)\in\mathcal{D}_{\text{RL}}, y\sim\pi_\phi^{\text{RL}}(y|I,x)}[r_\theta(I,x,y) - \beta\cdot D_{\text{KL}}(\pi_\phi^{\text{RL}}(y|I,x)\|\pi^{\text{INIT}}(y|I,x))]
$$

其中 $\beta$ 是控制KL惩罚的超参数，用于防止奖励过度优化。

## 数据集/模型/实验方法

- **评估基准**: LLaVA-Bench（主评估）、MMBench、POPE
- **MMHal-Bench数据来源**: OpenImages验证集和测试集的图片，问题采用对抗性筛选方法（确保原始LLaVA-13B在这些问题上会产生幻觉）
- **评估方式**: GPT-4作为裁判（提供图像内容类别、标准人类答案和LMM响应进行比对，GPT-4在94%的情况下与人类判断一致），评分范围0-6
- **模型**:
  - 基础模型：LLaVA架构（Vicuna LLM + CLIP ViT-L/14视觉编码器 + 线性投影层）
  - LLaVA-SFT+: 增强监督微调（加入VQA-v2的Yes/No问答、A-OKVQA的多项选择、Flickr30k的基础描述）
  - LLaVA-RLHF: 基于PPO算法的RLHF微调
  - 奖励模型大小：13B参数（基于LLaVA-SFT+ -13B初始化）
- **RLHF数据**: 10K人类偏好对（强调检测幻觉，标注优先"诚实"后考虑"有帮助"），50K LLaVA对话用于RL训练

## 关键发现

1. **高质量SFT数据提升能力基准**：LLaVA-SFT+在MMBench上提升13.4%，POPE上提升6.7%。
2. **RLHF显著提升人类对齐**：LLaVA-RLHF在LLaVA-Bench上达到GPT-4（纯文本版）的94%性能，在MMHal-Bench上比基线提升60%。
3. **Fact-RLHF解决奖励黑客问题**：标准RLHF在MMHal-Bench上表现不佳（因模型学习生成更长而非更准确的响应），而Fact-RLHF在LLaVA-Bench和MMHal-Bench上均有提升。
4. **数据过滤不如RLHF**：使用Fact-RLHF奖励模型过滤训练数据未能改善MMHal-Bench结果，说明负反馈机制（RLHF）对于减少幻觉至关重要。

## 连接上下文

MMHal-Bench代表了VLM幻觉评估从**简单判别式任务走向复杂开放式任务**的重要演进。与POPE的Yes/No探测不同，MMHal-Bench通过GPT-4裁判对开放式回答进行评估，更贴近真实应用场景。这一范式（LLM-as-Judge）被后续多个工作借鉴。MMHal-Bench的局限在于：数据集规模较小（96个问题），评估依赖GPT-4（成本高且可能引入偏差），短回答或回避式回答可能获得高分（诚实与有用性的内在权衡）。

## 相关论文

### 前序评估基准
- 奠基性工作：[CHAIR Object Hallucination in Image Captioning](CHAIR Object Hallucination in Image Captioning.md) - 首个系统性幻觉评估
- 轮询式探测：[POPE Evaluating Object Hallucination in Large VLMs](POPE Evaluating Object Hallucination in Large VLMs.md) - Yes/No问答评估
- 多维度评估：[AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination](AMBER LLM-free Multi-dimensional Benchmark for MLLMs Hallucination.md) - 无需LLM

### 后续评估基准
- 原子事实级：[FaithScore Fine-grained Evaluations of Hallucinations in LVLMs](FaithScore Fine-grained Evaluations of Hallucinations in LVLMs.md) - 细粒度验证
- 自由生成评估：[THRONE Object-based Hallucination Benchmark for Free-form Generations](THRONE Object-based Hallucination Benchmark for Free-form Generations.md) - Type I幻觉
- 否定对象评估：[NOPE Negative Object Presence Evaluation](NOPE Negative Object Presence Evaluation.md) - NegP数据
- 多对象探测：[ROPE Multi-Object Hallucination in Vision-Language Models](ROPE Multi-Object Hallucination in Vision-Language Models.md) - 视觉提示
- 关系幻觉：[Reefknot Comprehensive Benchmark for Relation Hallucination](Reefknot Comprehensive Benchmark for Relation Hallucination.md) - 关系层面
- 细粒度评估：[SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation](SHALE Scalable Benchmark for Fine-grained Hallucination Evaluation.md) - 12维度
- 诊断型基准：[DO-Bench Attributable Benchmark for Diagnosing Object Hallucination](DO-Bench Attributable Benchmark for Diagnosing Object Hallucination.md) - 归因分析
- 因果干预：[Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention](Causal-HalBench Uncovering LVLMs Object Hallucinations Through Causal Intervention.md) - 共现偏差

### 幻觉缓解方法
- 解码时干预：[HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding](HALC Object Hallucination Reduction via Adaptive Focal-Contrast Decoding.md)
- 注意力矫正：[DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination](DAMRO Dive into Attention Mechanism of LVLM to Reduce Object Hallucination.md)
- 因果推理：[CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality](CausalMM Mitigating Modality Prior-Induced Hallucinations via Attention Causality.md)
- 事后纠正：[Woodpecker Hallucination Correction for Multimodal LLMs](Woodpecker Hallucination Correction for Multimodal LLMs.md)
- 逻辑闭环：[LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations](LogicCheckGPT Logical Closed Loop Uncovering Object Hallucinations.md)
- 统一检测：[UNIHD Unified Hallucination Detection for Multimodal LLMs](UNIHD Unified Hallucination Detection for Multimodal LLMs.md)
