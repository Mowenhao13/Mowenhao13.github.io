---
layout: page
title: LLM 机械可解释性学习路径：从基础到前沿
---

# LLM 机械可解释性学习路径：从基础到前沿

> **目标读者**：已阅读 *Locate, Steer, Improve* 综述，具备基本深度学习知识，希望系统掌握 LLM 机械可解释性（MI）的研究者
>
> **前置基线**：了解 Transformer 架构（Attention Is All You Need）、Python/PyTorch 基础、基本的线性代数与概率论
>
> **总学习周期建议**：4-8 周（全职）或 8-16 周（兼职），取决于每阶段实践深度
>
> **生成日期**：2026-07-19
> **基于文献库**：60 篇 MI 核心论文，8 个子主题

---
　
## 学习路径总览

| 阶段 | 主题 | 核心技能 | 建议时间 | 难度 |
|------|------|----------|----------|------|
| 1 | Attention 机制与 Transformer 架构基础 | 理解注意力头、残差流、QK/OV 回路 | 1-2 周 | ★☆☆☆☆ |
| 2 | 电路分析与逆向工程 | 激活修补、因果追踪、电路发现 | 1-2 周 | ★★☆☆☆ |
| 3 | 叠加理论与稀疏自编码器 | SAE 训练、特征解释、叠加现象 | 1-2 周 | ★★★☆☆ |
| 4 | 表征工程与激活引导 | 概念方向、推理时干预、行为控制 | 1 周 | ★★★☆☆ |
| 5 | 潜在空间推理与前沿探索 | 语言无关推理、跨层编码、注意力新范式 | 1-2 周 | ★★★★☆ |

---

## 阶段 1：Attention 机制与 Transformer 架构基础

### 学习目标

- 理解 Scaled Dot-Product Attention 与 Multi-Head Attention 的数学原理
- 掌握残差流（Residual Stream）视角下的 Transformer 信息流动
- 理解 QK-circuit（决定关注位置）和 OV-circuit（决定写入内容）的基本概念
- 熟悉注意力头的功能分化和冗余现象

### 推荐论文

#### 1.1 Attention Is All You Need（Vaswani et al., 2017, NeurIPS）
- **层级**：经典论文 ⭐
- **重要性**：Transformer 架构的奠基之作，所有后续 MI 研究的基础模型
- **阅读重点**：Multi-Head Attention 公式、Scaled Dot-Product Attention、Positional Encoding
- **代码资源**：[tensor2tensor](https://github.com/tensorflow/tensor2tensor)（官方，TF 实现）

#### 1.2 What Does BERT Look At?（Clark et al., 2019, BlackBoxNLP）
- **层级**：经典论文 ⭐（引用 2,500+）
- **重要性**：MI 的"第一印象"——首次直观展示注意力头与句法结构的对应关系
- **阅读重点**：注意力头可视化方法、注意力头与依存关系的对应
- **代码资源**：[attention-analysis](https://github.com/clarkkev/attention-analysis)
- **前置知识**：BERT 架构（Devlin et al., 2018）

#### 1.3 Analyzing Multi-Head Self-Attention: Specialized Heads Do the Heavy Lifting（Voita et al., 2019, ACL）
- **层级**：经典论文 ⭐（引用 1,500+）
- **重要性**：首次系统分类注意力头功能（位置头、句法头、罕见词头等），提出注意力头功能分化理论
- **阅读重点**：注意力头功能分类框架、剪枝实验设计
- **代码资源**：[the-story-of-heads](https://github.com/lena-voita/the-story-of-heads)

#### 1.4 A Mathematical Framework for Transformer Circuits（Elhage et al., 2021, Anthropic）
- **层级**：经典论文 ⭐（引用 2,000+）
- **重要性**：**MI 的基石**——建立 QK/OV 回路分析框架，提出残差流视角
- **阅读重点**：QK-circuit vs OV-circuit 的区别、残差流作为信息主干的概念、Attention Head 的叠加性
- **代码资源**：[TransformerLens](https://github.com/anthropics/TransformerLens)

### 前置知识

| 概念 | 推荐学习资源 | 掌握程度 |
|------|-------------|----------|
| Transformer 架构 | "Attention Is All You Need" 论文 + 3Blue1Brown 可视化视频 | 理解整体架构即可 |
| PyTorch 基础 | PyTorch 官方教程（60min blitz） | 能读懂模型代码 |
| 线性代数 | 矩阵乘法、向量空间、投影 | 基本概念即可 |

### 动手实践

**实验 1：使用 TransformerLens 加载并检查 GPT-2 Small**

```python
# 安装
!pip install transformer_lens

# 加载模型
from transformer_lens import HookedTransformer
model = HookedTransformer.from_pretrained("gpt2-small")

# 查看模型结构
print(model.cfg)

# 运行前向传播
logits, cache = model.run_with_cache("The capital of France is")
print(cache.keys())  # 查看所有层缓存
```

**实验 2：注意力模式可视化**

```python
import torch
from transformer_lens import utils

# 提取注意力模式
attn_pattern = cache["blocks.0.attn.hook_pattern"]  # shape: [batch, heads, seq_len, seq_len]

# 可视化第 0 层的第 0 个注意力头
utils.plot_attention(attn_pattern[0, 0].cpu().numpy(), tokens=model.to_str_tokens("The capital of France is"))
```

**实验 3：注意力头剪枝实验**

```python
# 使用 Voita 等人的方法，逐个头剪枝观察性能变化
from transformer_lens import patching

# 将指定注意力头置零，观察 logit 变化
original_logits = model("The capital of France is Paris")
# 对第 5 层第 3 个注意力头进行剪枝
# ...（使用 model.hook_points 进行干预）
```

### 避坑指南

| 误区               | 正确做法                                                              |
| ---------------- | ----------------------------------------------------------------- |
| 认为注意力权重直接反映"重要性" | 阅读 "Attention is not Explanation"（Jain & Wallace, 2019），理解注意力的局限性 |
| 忽略残差流视角，只关注注意力层  | 注意力层只是残差流上的"读取-写入"操作，需要理解整个信息流路径                                  |
| 过早陷入数学细节         | 先建立直观理解，再逐步深入 QK/OV 回路的数学推导                                       |
| 只关注注意力头，忽视 MLP 层 | MLP 层存储了大量事实知识，是电路分析的重要组成部分                                       |

---

## 阶段 2：电路分析与逆向工程

### 学习目标

- 掌握激活修补（Activation Patching）和因果追踪（Causal Tracing）方法
- 理解 Induction Heads 的形成机制及其在 ICL 中的作用
- 能够独立完成端到端的电路发现实验
- 理解 Function Vectors 的概念

### 推荐论文

#### 2.1 Induction Heads（Olsson et al., 2022, Anthropic）
- **层级**：经典论文 ⭐（引用 1,200+）
- **重要性**：发现 In-Context Learning 的核心机制，提出完整的 Induction Head 形成链
- **阅读重点**：Induction Head 的定义、形成机制（Previous Token Head → Induction Head 的转变）、与 ICL 的关系
- **代码资源**：[TransformerLens](https://github.com/anthropics/TransformerLens)（内置 Induction Head 检测功能）

#### 2.2 Interpretability in the Wild: A Circuit for IOI in GPT-2 Small（Wang et al., 2022）
- **层级**：经典论文 ⭐（引用 600+）
- **重要性**：**第一个完整的端到端电路逆向工程案例**，展示了完整的 MI 方法论流程
- **阅读重点**：间接宾语识别（IOI）电路的完整发现流程、Attention Head 的三种角色类型（S-Inhibition Heads, Duplicate Token Heads, Name Mover Heads）
- **代码资源**：[Easy Transformer](https://github.com/redwoodresearch/Easy-Transformer)（Redwood Research）

#### 2.3 Which Attention Heads Matter for In-Context Learning?（Yin & Steinhardt, 2025）
- **层级**：新方法论文
- **重要性**：解耦 Induction Heads 和 Function Vector Heads，发现 FV Heads 才是 ICL 的关键
- **阅读重点**：Function Vector 的概念、与 Induction Head 的关系、头部去除实验的设计
- **前置知识**：Induction Heads 论文

#### 2.4 Progress Measures for Grokking via Mechanistic Interpretability（Nanda et al., 2023, ICLR）
- **层级**：拓展补充论文 ⭐（引用 400+）
- **重要性**：用电路分析解释了 Grokking 现象，展示了 MI 在理解训练动态方面的威力
- **阅读重点**：电路形成速度与 Grokking 的关系、Circuit 的量化指标设计
- **代码资源**：[progress-measures](https://github.com/mechanistic-interpretability-grokking/progress-measures)

### 前置知识

| 概念 | 说明 |
|------|------|
| 激活修补（Activation Patching） | 替换某位置的激活值，观察输出变化，是 MI 的核心因果方法 |
| 因果中介分析（CMA） | 在模型中定位"负责"某功能的组件 |
| 对数几率差（Logit Difference） | 衡量模型在特定输出上的偏好变化 |
| 残差流视角 | 将 Transformer 视为残差流上的操作序列（阶段 1 已学） |

### 动手实践

**实验 1：使用 TransformerLens 检测 Induction Heads**

```python
from transformer_lens import HookedTransformer, utils

model = HookedTransformer.from_pretrained("gpt2-small")

# 检测 induction heads
induction_head_scores = model.induction_heads_detection()
print(induction_head_scores)

# 可视化 induction head 的注意力模式
# Induction heads 通常展示出对角线+1的注意力模式
```

**实验 2：激活修补实验**

```python
# 使用 IOI 电路进行激活修补
from transformer_lens import patching

# 1. 运行原始 forward pass 获取缓存
clean_logits, clean_cache = model.run_with_cache("When Mary and John went to the store, John gave a bottle of milk to")

# 2. 运行损坏 forward pass（例如交换名字）
corrupted_logits, corrupted_cache = model.run_with_cache("When John and Mary went to the store, John gave a bottle of milk to")

# 3. 对特定位置/层进行激活修补
# 将 clean cache 中的某个激活值替换到 corrupted cache 中
# 观察 logit difference 的恢复程度
```

**实验 3：使用 nnsight 进行更灵活的模型干预**

```python
# pip install nnsight
from nnsight import LanguageModel

model = LanguageModel("openai-community/gpt2-small", device_map="auto")

with model.trace("The capital of France is"):
    # 读取隐藏状态
    hidden_states = model.transformer.h[6].output[0]
    # 在这里进行干预操作
    # ...
```

### 避坑指南

| 误区 | 正确做法 |
|------|----------|
| 认为激活修补结果"不多样"就没学到东西 | 激活修补的"负结果"（没有发现重要组件）也是重要发现 |
| 只关注注意力头，忽略 MLP 层 | 很多功能（如算术推理）依赖 MLP 层的计算，注意力头负责信息的路由 |
| 过度依赖单个提示做电路分析 | 同一电路在不同提示下表现可能不同，需要在多个样本上验证 |
| 忽略 Positional Embeddings 的作用 | 位置编码是理解注意力模式的关键，尤其是 Induction Heads 的模式 |

---

## 阶段 3：叠加理论与稀疏自编码器

### 学习目标

- 理解叠加假说（Superposition Hypothesis）及其理论依据
- 掌握稀疏自编码器（SAE）的原理、训练方法和评估指标
- 理解"单义特征"（Monosemantic Features）的概念和意义
- 了解 SAE 的局限性和前沿改进方向

### 推荐论文

#### 3.1 Toy Models of Superposition（Elhage et al., 2022, Anthropic）
- **层级**：经典论文 ⭐（引用 1,500+）
- **重要性**：提出叠加假说，用 Toy Model 验证了"特征数 > 神经元数"的叠加现象
- **阅读重点**：叠加假说的核心论证、特征稀疏性 vs 特征维度的权衡、Toy Model 实验设计
- **代码资源**：[toy-models-of-superposition](https://github.com/anthropics/toy-models-of-superposition)

#### 3.2 Towards Monosemanticity: Decomposing Language Models With Dictionary Learning（Bricken et al., 2023, Anthropic）
- **层级**：经典论文 ⭐（引用 1,000+）
- **重要性**：**SAE for LLM 的开创性工作**，首次从单层 MLP 中分解出可解释特征
- **阅读重点**：SAE 架构设计（编码器-解码器 + 稀疏惩罚）、特征解释性评估方法、Dead Neurons 问题
- **代码资源**：[transformer-sae](https://github.com/anthropics/transformer-sae)

#### 3.3 Sparse Autoencoders Find Highly Interpretable Features in Language Models（Cunningham et al., 2023, ICLR 2024）
- **层级**：新方法论文 ⭐（引用 1,300+）
- **重要性**：独立验证并扩展了 Anthropic 的 SAE 结果，开发了更高效的训练方法
- **阅读重点**：与 Anthropic SAE 的异同、特征激活的可解释性分析、Pythia 模型上的实验结果
- **代码资源**：[SAE-features](https://github.com/connor-sho/SAE-features)

#### 3.4 Scaling and Evaluating Sparse Autoencoders（Gao et al., 2024）
- **层级**：新方法论文
- **重要性**：系统研究了 SAE 的扩展规律，提出了 SAE 质量评估指标
- **阅读重点**：SAE 扩展规模与特征质量的关系、评估指标设计（MSE, L0, 解释性分数等）
- **代码资源**：[SAE-scaling](https://github.com/agao-de/SAE-scaling)

### 前置知识

| 概念 | 说明 |
|------|------|
| 自编码器（Autoencoder） | 无监督特征学习的经典方法 |
| L1 正则化与稀疏性 | 理解 L1 惩罚如何诱导稀疏解 |
| 字典学习（Dictionary Learning） | 将激活分解为字典向量的稀疏线性组合 |
| 特征可视化（Feature Visualization） | 通过激活分布理解特征含义 |

### 动手实践

**实验 1：Toy Model 中的叠加现象**

```python
# 运行 Anthropic 的 Toy Models 代码
# git clone https://github.com/anthropics/toy-models-of-superposition

# 理解核心概念：
# - 当特征数量 > 神经元数量时，叠加必然发生
# - 稀疏特征更容易被"解耦"
# - 特征维度与稀疏性之间存在权衡
```

**实验 2：使用 SAE Lens 训练和检查 SAE 特征**

```python
# pip install sae-lens
from sae_lens import SAE

# 加载预训练 SAE
sae, cfg_dict, sparsity = SAE.from_pretrained(
    release="gpt2-small-res-jb",
    sae_id="blocks.4.hook_resid_pre",
)

# 在特定输入上运行 SAE，查看激活的特征
text = "The capital of France is"
# 获取激活的稀疏特征
# 可视化特征在 token 上的激活模式
```

**实验 3：SAE 特征解释性评估**

```python
# 使用 automated interpretability 方法评估特征质量
# 1. 对每个特征，找到其最大激活的样本
# 2. 用 LLM 生成特征描述
# 3. 验证描述是否准确预测了特征的激活模式
```

### 避坑指南

| 误区 | 正确做法 |
|------|----------|
| 认为 SAE 学到的每个特征都是"单义"的 | 大多数特征仍然是多义的，只是比原始神经元更可解释 |
| 只关注 SAE 的"好"特征，忽略"死"特征 | Dead Neurons 是 SAE 训练中的核心问题，JumpReLU 等方法可以缓解 |
| 认为 SAE 可以完全解释模型行为 | SAE 提供的是"特征级"视角，需要结合电路分析才能理解模型如何用这些特征推理 |
| 忽略 SAE 的超参数调优 | 稀疏性权重、字典大小、学习率等超参数对特征质量影响巨大 |
| 直接在大模型上训练 SAE | 建议先从 Pythia-70M 或 GPT-2 Small 开始，理解 SAE 的行为后再扩展到更大模型 |

---

## 阶段 4：表征工程与激活引导

### 学习目标

- 理解"概念方向"（Concept Directions）的概念和发现方法
- 掌握 Activation Steering 的实现原理，能够独立进行推理时干预
- 了解 Representation Engineering 的"自顶向下"方法论
- 理解 Inference-Time Intervention 的机制

### 推荐论文

#### 4.1 Representation Engineering: A Top-Down Approach to AI Transparency（Zou et al., 2023, NeurIPS）
- **层级**：经典论文 ⭐（引用 500+）
- **重要性**：提出与 Circuit Analysis（自底向上）互补的**自顶向下**方法论，从认知神经科学汲取灵感
- **阅读重点**：控制向量（Control Vector）的发现方法、与 Circuit Analysis 的方法论对比、诚实性/无害性等安全维度的应用
- **代码资源**：[representation-engineering](https://github.com/andyzoujm/representation-engineering)

#### 4.2 Steering GPT-2-XL by Adding an Activation Vector（Turner et al., 2023）
- **层级**：经典论文（引用 300+）
- **重要性**：**Activation Steering 的开创性工作**，首次系统提出激活引导方法
- **阅读重点**：Activation Vector 的构造方法、引导强度与效果的关系、模型行为变化的可解释性
- **代码资源**：[ActivationSteering](https://github.com/nrimsky/ActivationSteering)

#### 4.3 Inference-Time Intervention: Eliciting Truthful Answers from a Language Model（Li et al., 2023, NeurIPS）
- **层级**：新方法论文 ⭐（引用 300+）
- **重要性**：提出 ITI 方法，在推理时通过修改 MLP 层激活来增强模型真实性
- **阅读重点**：Truthful Direction 的发现、ITI 的干预位置选择、与 Activation Addition 的对比
- **代码资源**：[ITI](https://github.com/google-research/ITI)

#### 4.4 Causal Head Gating: A Framework for Interpreting Roles of Attention Heads（Nam et al., 2025, NeurIPS）
- **层级**：新方法论文 ⭐
- **重要性**：提出统一的注意力头功能分类框架（mover/copier/restrictor/suppressor），将阶段 2 的电路分析与阶段 4 的行为控制连接起来
- **阅读重点**：四种注意力头角色的定义与鉴别方法、与之前注意力头分类的对比
- **前置知识**：阶段 1-2 的注意力头分析基础

### 前置知识

| 概念 | 说明 |
|------|------|
| 对比对（Contrastive Pairs） | 通过正反例对比提取"概念方向" |
| 控制向量（Control Vector） | 表示某一概念方向的向量，加减即可改变模型输出 |
| 探针（Probe） | 线性分类器检测隐藏状态中是否包含某一概念 |
| 激活修补（复习） | 从阶段 2 复用，但这里关注"如何定位"而非"如何发现" |

### 动手实践

**实验 1：使用 RepE 方法找到控制向量**

```python
# git clone https://github.com/andyzoujm/representation-engineering
# 运行 RepE 的 demo：找到"诚实性"方向

# 核心代码框架：
# 1. 准备对比对（诚实 vs 不诚实的回答）
# 2. 提取中间层的隐藏状态
# 3. 计算控制向量（正例均值 - 负例均值）
# 4. 在推理时添加控制向量
```

**实验 2：Activation Addition（ActAdd）**

```python
from transformer_lens import HookedTransformer
import torch

model = HookedTransformer.from_pretrained("gpt2-xl")

# 1. 构造 Activation Vector
# 例如：从"love"和"hate"的隐藏状态差异中提取"情感方向"
love_logits, love_cache = model.run_with_cache("love")
hate_logits, hate_cache = model.run_with_cache("hate")

# 2. 计算激活向量
activation_vector = love_cache["resid_mid", 12] - hate_cache["resid_mid", 12]

# 3. 在推理时添加
def steering_hook(resid, hook):
    resid[:, -1, :] += 2.0 * activation_vector
    return resid

model.run_with_hooks("I think this movie is", fwd_hooks=[(utils.get_act_name("resid_mid", 12), steering_hook)])
```

**实验 3：ITI 干预**

```python
# 使用 ITI 方法增强模型诚实性
# 1. 在 TruthfulQA 数据集上训练探针
# 2. 定位"诚实性方向"所在的层
# 3. 在推理时沿该方向微调 MLP 输出
```

### 避坑指南

| 误区 | 正确做法 |
|------|----------|
| 认为控制向量是"通用"的 | 控制向量通常在特定任务/数据集上有效，跨任务泛化需要验证 |
| 盲目增加引导强度 | 引导强度过大会破坏模型的语言能力，需要调参找到"甜点" |
| 忽略 RepE 与 Circuit Analysis 的关系 | RepE 是自顶向下的方法，Circuit Analysis 是自底向上的，两者互补而非替代 |
| 认为激活引导可以做到"精确控制" | 引导是一种"软控制"，效果可能与非目标维度纠缠在一起 |

---

## 阶段 5：潜在空间推理与前沿探索

### 学习目标

- 理解 Latent Space Reasoning 的核心概念和分类体系
- 了解语言无关推理（Language-Agnostic Reasoning）的实证证据
- 掌握跨层编码器（Cross-Layer Transcoders）等前沿方法
- 建立综合运用多种 MI 方法的能力

### 推荐论文

#### 5.1 A Survey on Latent Reasoning（2025, arXiv）
- **层级**：综述论文
- **重要性**：Latent Reasoning 领域的系统性综述，提供分类框架
- **阅读重点**：垂直（Layer-wise）vs 水平（Token-wise）循环推理的分类体系、无限深度推理的潜力
- **前置知识**：阶段 1-4 的全面基础

#### 5.2 Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations（2024, ACL）
- **层级**：新方法论文
- **重要性**：通过激活修补因果证明语言表征与概念表征在 LLM 中独立解耦
- **阅读重点**：跨语言激活修补实验设计、语言无关概念表征的因果证据
- **代码资源**：暂无公开代码
- **前置知识**：阶段 2 的激活修补技能

#### 5.3 Cognitive Mirrors: Exploring the Diverse Functional Roles of Attention Heads in LLM Reasoning（Ma et al., 2025, NeurIPS）
- **层级**：新方法论文 ⭐
- **重要性**：系统分析 LLM 推理任务中注意力头的功能多样性，发现不同注意力头反映不同的认知过程
- **阅读重点**：推理任务中的注意力头角色分类、认知过程（推理/记忆/检索）与注意力头功能的对应
- **前置知识**：阶段 1-2 的注意力头分析基础

#### 5.4 Explaining Attention with Program Synthesis（Hayes et al., 2026）
- **层级**：新方法论文 ⭐
- **重要性**：**全新范式**——用程序合成替代注意力头，实现人类可理解的符号化描述
- **阅读重点**：程序合成逼近注意力头的方法、符号化描述与原始行为的保真度评估
- **前置知识**：阶段 1 的注意力机制理解

### 前置知识

| 概念 | 说明 |
|------|------|
| 中间表征（Intermediate Representation） | 模型内部层的激活向量，编码了输入的不同抽象层次 |
| 跨层编码器（Cross-Layer Transcoder） | 从 SAE 演化而来的方法，可以跨层追踪特征 |
| 语言无关推理 | 模型在中间层使用"概念语言"而非自然语言进行推理的假说 |
| 程序合成（Program Synthesis） | 自动生成符号程序来模拟神经网络组件的行为 |

### 动手实践

**实验 1：Layer Swap 实验**

```python
# 使用 Layer Swap 方法验证中间层 = 语言无关推理核心的假说
# 1. 加载多语言模型（如 Llama-2-7B）
# 2. 交换中间层（如 8-16 层）在不同语言之间的对应关系
# 3. 观察推理性能的变化

# 核心思路：如果中间层编码的是语言无关的推理逻辑，
# 交换不同语言模型的中间层应该不影响推理质量
```

**实验 2：跨语言激活修补**

```python
# 实现 "Separating Tongue from Thought" 的核心实验
# 1. 准备双语翻译对（如英语→中文）
# 2. 使用激活修补找到"概念"和"语言"分别编码的位置
# 3. 验证概念表征在语言间是共享的
```

**实验 3：综合探索——将 SAE 特征与电路分析结合**

```python
# 高级实验：用 SAE 发现特征，用电路分析理解特征如何被使用
# 1. 在特定任务上训练 SAE
# 2. 识别与任务相关的特征
# 3. 使用激活修补追踪这些特征在模型中的流动路径
# 4. 形成从特征到电路的完整理解
```

### 避坑指南

| 误区 | 正确做法 |
|------|----------|
| 认为 Latent Reasoning 已经成熟 | 该领域仍处于早期探索阶段，很多结论尚待验证 |
| 混淆"语言无关"和"不需要语言" | 语言无关推理指的是概念在中间层以非自然语言形式编码，≠ 不需要语言输入 |
| 忽视跨层编码器（CLT）的局限性 | CLT 虽然强大，但训练成本高，特征解释性也不如 SAE 直观 |
| 过早追求"最新"方法而忽略基础 | 阶段 5 的前沿方法建立在阶段 1-4 的基础之上，跳过基础会导致理解浮于表面 |

---

## 跨阶段综合项目

完成全部 5 个阶段后，建议完成以下综合项目来巩固所学：

### 项目 A：完整分析一个模型行为

选择 LLM 中的一个具体行为（如"拒绝回答有害问题"、"代码生成中的语法错误检测"），从多个 MI 角度进行分析：

1. **电路视角**：使用激活修补找到负责该行为的电路
2. **特征视角**：使用 SAE 分解相关层的激活，找到与行为相关的特征
3. **控制视角**：找到控制该行为的激活方向，尝试引导行为
4. **综合报告**：撰写完整的 MI 分析报告

### 项目 B：复现一篇新论文

选择一篇 2025-2026 年的 MI 论文，独立复现其核心实验：

1. **论文选择**：从本学习路径的阶段 5 选取
2. **代码复现**：从零开始实现核心方法
3. **结果验证**：在标准数据集上验证复现结果
4. **扩展实验**：在论文基础上增加一项自己的实验

---

## 代码资源总览

### 核心框架

| 工具 | 用途 | 适用阶段 | 上手难度 |
|------|------|----------|----------|
| [TransformerLens](https://github.com/anthropics/TransformerLens) | Transformer 可解释性分析框架 | 阶段 1-5 | ★☆☆☆☆ |
| [nnsight](https://github.com/ndif-team/nnsight) | 模型内部操作与干预框架 | 阶段 2-5 | ★★☆☆☆ |
| [SAE Lens](https://github.com/decoderesearch/SAELens) | SAE 训练与特征分析 | 阶段 3-5 | ★★☆☆☆ |
| [CLT-Forge](https://github.com/CLT-Forge) | 跨层 Transcoder 训练 | 阶段 5 | ★★★★☆ |

### 论文代码仓库

| 论文 | 代码 | 适用阶段 |
|------|------|----------|
| A Mathematical Framework for Transformer Circuits | [TransformerLens](https://github.com/anthropics/TransformerLens) | 阶段 1-2 |
| Toy Models of Superposition | [toy-models-of-superposition](https://github.com/anthropics/toy-models-of-superposition) | 阶段 3 |
| Towards Monosemanticity | [transformer-sae](https://github.com/anthropics/transformer-sae) | 阶段 3 |
| Sparse Autoencoders (Cunningham) | [SAE-features](https://github.com/connor-sho/SAE-features) | 阶段 3 |
| Representation Engineering | [representation-engineering](https://github.com/andyzoujm/representation-engineering) | 阶段 4 |
| Steering GPT-2-XL | [ActivationSteering](https://github.com/nrimsky/ActivationSteering) | 阶段 4 |
| Inference-Time Intervention | [ITI](https://github.com/google-research/ITI) | 阶段 4 |
| What Does BERT Look At? | [attention-analysis](https://github.com/clarkkev/attention-analysis) | 阶段 1 |
| The Story of Heads | [the-story-of-heads](https://github.com/lena-voita/the-story-of-heads) | 阶段 1 |
| IOI Circuit | [Easy Transformer](https://github.com/redwoodresearch/Easy-Transformer) | 阶段 2 |
| Progress Measures for Grokking | [progress-measures](https://github.com/mechanistic-interpretability-grokking/progress-measures) | 阶段 2 |

---

## 常见问题（FAQ）

### Q1：应该先学 Circuit Analysis 还是 SAE？

**建议**：先学 Circuit Analysis（阶段 2），再学 SAE（阶段 3）。Circuit Analysis 提供了理解模型行为的"因果框架"，SAE 则提供了"特征分析工具"。先理解因果归因方法，再学习特征分解，更符合认知逻辑。其次，Circuit Analysis 的数学门槛相对较低，更容易上手。

### Q2：需要复现每篇论文的实验吗？

不需要。建议：
- **阶段 1-2**：至少完成 1-2 个完整的动手实验，建立手感
- **阶段 3**：完成 SAE 训练和特征分析实验
- **阶段 4**：完成 Activation Steering 实验
- **阶段 5**：完成综合项目或复现一篇前沿论文

### Q3：GPU 要求高吗？

建议最低配置：
- **阶段 1-2**：CPU 即可（GPT-2 Small 可在 CPU 上运行）
- **阶段 3**：建议 1 张 8GB+ 显存的 GPU（SAE 训练需要 GPU）
- **阶段 4**：GPT-2 XL 需要 16GB+ 显存，但可以在小模型上测试
- **阶段 5**：大模型实验需要 24GB+ 显存（如 8×3090 实验环境）

### Q4：如何判断自己是否真正理解了一个概念？

可以通过以下问题自检：
- 能否用一句话向非专业人士解释这个概念？
- 能否独立实现一个最小验证实验？
- 能否指出该方法的局限性和假设条件？
- 能否将概念与之前学过的其他概念建立联系？

---

## 学习路径总结

```
阶段 1: Attention 机制基础
    ↓
阶段 2: 电路分析与逆向工程
    ↓
阶段 3: 叠加理论与稀疏自编码器
    ↓
阶段 4: 表征工程与激活引导
    ↓
阶段 5: 潜在空间推理与前沿探索
    ↓
综合项目: 融合多种 MI 方法分析模型行为
```

**核心建议**：
1. **每个阶段都要动手**：MI 是实践性极强的领域，只看论文无法真正理解
2. **从简单模型开始**：GPT-2 Small 或 Pythia-70M 是入门的最佳选择
3. **建立"MI 思维"**：始终从"因果机制"而非"相关性"的角度思考模型行为
4. **保持批判性**：对实验结果保持怀疑，主动寻找替代解释
5. **参与社区**：关注 Anthropic Transformer Circuits 博客、Neel Nanda 的教程、ARENA 课程等资源