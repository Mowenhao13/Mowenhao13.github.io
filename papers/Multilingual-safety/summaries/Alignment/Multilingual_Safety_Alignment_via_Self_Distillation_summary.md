---
layout: page
---

> **arXiv**: `2605.02971` | **年份**: 2026 | **Venue**: -

## 核心贡献

提出多语言自蒸馏框架（MSD），一种无需任何响应数据的跨语言安全迁移方法。通过自蒸馏将LLM在高资源语言（如英语）中的固有能力迁移到低资源语言。教师和学生从同一LLM初始化，教师利用英语查询和CoT指令进行安全推理，指导学生生成目标低资源语言的拒绝响应。进一步提出双视角安全加权（DPSW），从教师和学生的双重角度自适应增加安全关键令牌的惩罚权重。

## 方法

给定目标低资源查询 $x_{\text{tgt}}$ 和其英语翻译 $x^*$，学生和教师实例化为同一LLM的不同上下文版本：

$$p_S(\cdot | x_{\text{tgt}}) \triangleq p_\theta(\cdot | x_{\text{tgt}})$$
$$p_T(\cdot | x_{\text{tgt}}, x^*, \mathcal{C}) \triangleq p_\theta(\cdot | x_{\text{tgt}}, x^*, \mathcal{C})$$

训练目标是最小化学生与教师之间的token级KL散度：

$$L(\theta) = \mathbb{E}_{X \sim \mathcal{X}} \mathbb{E}_{x_{\text{tgt}} \sim X} \mathbb{E}_{y \sim q(\cdot)} \left[ \frac{1}{L_y} \sum_{t=1}^{L_y} \tilde{w}_t \cdot D_{\text{KL}}(p_S(\cdot) \| p_T(\cdot)) \right]$$

其中 $\tilde{w}_t$ 是DPSW权重，由教师信心（基于top-K熵）和学生信心（教师选择token上学生概率的倒数）共同决定：

$$w_t^T = 1 - \frac{-\sum_{v \in V_t^K} \bar{p}_T(v) \log \bar{p}_T(v)}{\log K}$$
$$w_t^S = 1 - p_S(y_t^* | x_{\text{tgt}}, y_{<t})$$
$$w_t = w_t^T \cdot w_t^S, \quad \tilde{w}_t = L_y \cdot \frac{w_t}{\sum_{j=1}^{L_y} w_j}$$

支持on-policy（学生自我采样后由教师评估）和off-policy（教师采样作为训练数据）两种策略。

## 数据集与实验

- **模型**: Qwen-2.5-7B-Instruct、Qwen-3-8B、LLaMA-2-7B-chat、LLaMA-3-8B-Instruct
- **语言**: 10种语言（高资源: En, Zh, It, Vi; 中资源: Ar, Ko, Th; 低资源: Bn, Sw, Jv），仅4种语言参与训练
- **训练数据**: XSafety（仅使用多语言查询，无需响应数据）
- **评估基准**: MultiJail、PKU-SafeRLHF（安全）；MMMLU、MGSM（通用能力）
- **基线**: SFT、DPO、rDPO、KTO、ORPO、R-DPO、SimPO、PolyRefuse、Self-Defense、SDRRL、MPO
- **主要结果**:
  - 在LLaMA-3-8B-Instruct的MultiJail上，MSD (On-Policy)将Swahili的ASR从69.52%降至4.13%
  - 优于所有基线，尤其在未见过的低资源语言上表现突出
  - DPSW消融实验证实其一致提升安全性能
  - 零数据生成成本，而基线方法需要$450-$1200美元的数据生成费用

## 关键发现

1. 自蒸馏框架可在完全无需目标语言响应数据的情况下实现跨语言安全迁移
2. 仅需多语言查询对和CoT指令即可激发教师的安全推理能力
3. DPSW可自适应聚焦安全关键token，避免对所有token施加均匀惩罚
4. 冻结教师参数（不做EMA更新）获得最佳安全-通用能力权衡
5. 框架对高资源语言选择具有鲁棒性，可基于预训练语料中主导的语言灵活选择
6. 在低资源语言生成能力不足时，ASR升高主要源于无效输出而非不安全输出

## 关联论文

[MPO_Reward_Gap_Optimization_summary](MPO_Reward_Gap_Optimization_summary.md) | [Multilingual_Safety_Alignment_via_Sparse_Weight_Editing_summary](Multilingual_Safety_Alignment_via_Sparse_Weight_Editing_summary.md) | [Align_Once_Benefit_Multilingually_summary](Align_Once_Benefit_Multilingually_summary.md)
