---
layout: page
---


## 基本信息

- **标题**: Enhancing Visual Reliance in Text Generation: A Bayesian Perspective on Mitigating Hallucination in Large Vision-Language Models
- **作者**: Nanxing Hu, Xiaoyue Duan, Jinchao Zhang, Guoliang Kang (Beihang University, Tencent WXG)
- **发表年份**: 2025
- **会议/期刊**: arXiv preprint
- **arXiv ID**: 2505.19498v1
- **论文类型**: 实验性论文（提出新方法）

## 核心贡献（新范式/新指标）

本文从**贝叶斯视角**系统性地研究了LVLM幻觉问题的成因，并提出了一个名为**EVRB (Enhancing Visual Reliance from a Bayesian perspective)** 的训练无关（training-free）框架来缓解幻觉。核心贡献包括：

1. **发现三个破坏视觉依赖的关键因素**:
   - 冗余视觉条件（Redundant Visual Condition）：部分视觉token携带模糊/无意义信息，作为冗余条件增加了文本预测的不确定性
   - 有偏语言先验（Biased Language Prior）：语言先验从LLM继承偏差，使模型倾向于生成不符合视觉输入的词
   - 后验坍塌（Posterior Collapse）：在生成后期，以视觉为条件的后验分布会逐步坍塌为不依赖视觉信息的先验分布

2. **提出三项对应的缓解策略**:
   - **冗余视觉Token剪枝**：通过计算视觉token对下一个token预测的信息熵来评估质量，剔除高熵的模糊token
   - **语言先验矫正**：基于贝叶斯公式，将后验概率直接除以先验概率来消除先验偏差
   - **坍塌感知早停**：监测视觉相关文本token的JS散度变化，自适应调整终止token的logit，在后验坍塌前停止生成

## 方法

### 问题形式化
LVLM的文本生成可建模为条件概率预测：

$$
p(t_{n_t}|\mathbf{v}, \mathbf{t}) = \text{softmax}(f(\mathbf{h}^L_{n-1})), \quad t_{n_t} \in \Phi
$$

其中 $\mathbf{v}$ 是视觉token， $\mathbf{t}$ 是文本token， $f(\cdot)$ 是语言模型头。

### 冗余视觉Token剪枝
利用语言模型头对视觉token进行下一token预测，通过熵值评估视觉token质量：

$$
E(v_i) = -p(v_{i+1}|v_{\le i})\log p(v_{i+1}|v_{\le i})
$$

熵值高于阈值 $\tau$ 的token被视为模糊/冗余token $v_b$ 并被剔除，保留清晰token集合 $v_c$。

### 语言先验矫正
基于贝叶斯公式，后验分布正比于先验分布：

$$
p'(t_{n_t}) = \frac{1}{Z} \cdot \frac{p(t_{n_t}|\mathbf{v}_c, \mathbf{t})}{p(t_{n_t}|\mathbf{t}) + \epsilon}
$$

其中 $p(t_{n_t}|\mathbf{v}_c, \mathbf{t})$ 是以清晰视觉token和文本为条件的后验分布， $p(t_{n_t}|\mathbf{t})$ 是不依赖视觉信息的先验分布。同时采用自适应合理性约束（adaptive plausibility constraint）防止不合理预测。

### 坍塌感知早停
使用值-值注意力（value-value attention）定位视觉相关文本token：

$$
\alpha(t_i, \mathbf{v}) = \text{softmax}\left(\frac{(\mathbf{h}_{n_s+i} W_V)(\mathbf{h}_{<n_s} W_V)^\top}{\sqrt{d}}\right)
$$

通过JS散度度量后验与先验分布的距离：

$$
JS(A\|B) = \frac{1}{2}KL(A\|B) + \frac{1}{2}KL(B\|A)
$$

自适应的终止token logit调整策略：

$$
\text{logit}_{eos} = \text{logit}_{eos} \cdot (1 + \lambda \cdot \overline{\Delta JS})
$$

## 数据集/模型/实验方法

### 模型
- **主实验模型**: LLaVA-1.5 (7B) 和 Shikra (7B)
- **对比基线**: OPERA, ICD, VCD, SID, DeCo, CausalMM 等训练无关方法
- **硬件**: A100 GPU

### 评估基准
1. **POPE (Polling-based Object Probing Evaluation)**: 评估LVLM判断物体存在与否的能力，在MSCOCO、GQA、A-OKVQA三个数据集上测试，包含random、popular、adversarial三种难度子任务。衡量指标：准确率、精确率、召回率、F1分数。
2. **CHAIR (Caption Hallucination Assessment with Image Relevance)**: 评估图像描述中的物体幻觉，包含句子级（CHAIR$_S$）和实例级（CHAIR$_I$）指标。
3. **MME (Multimodal Large Language Model Evaluation)**: 全面评估感知和认知能力，涵盖14个子任务。

### 实验结果
- POPE任务上在所有三个数据集上取得最佳或次佳的F1分数，在A-OKVQA和GQA上大幅领先现有方法
- CHAIR任务上取得最低的CHAIR$_S$ (39.8) 和 CHAIR$_I$ (12.8)，同时保持较高的Recall (78.5)
- MME综合评估中取得1805分，显著优于所有对比方法，且不损害模型综合能力
- 在Shikra模型上的泛化实验也验证了方法的通用性

## 连接上下文

本文与之前的多模态幻觉缓解工作（如VCD、SID、OPERA等）不同，这些方法主要通过对特定模态的特征增强或输出调整来缓解幻觉，而本文首次从贝叶斯视角系统性地分析了文本生成对视觉输入依赖度降低的三个根本原因，并提出了对应的训练无关解决方案。与同样使用对比解码策略的VCD和SID相比，本文的语言先验矫正在概率层面（而非logit层面）操作，更符合贝叶斯理论且效果更优。
