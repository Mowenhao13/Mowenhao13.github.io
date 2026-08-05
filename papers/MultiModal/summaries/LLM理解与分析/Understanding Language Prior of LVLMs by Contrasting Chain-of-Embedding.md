---
layout: page
---


- **Authors**: Lin Long*, Changdae Oh*, Seongheon Park, Yixuan (Sharon) Li† (UW–Madison)
- **Venue**: ICLR 2026 Poster
- **arXiv**: 2509.23050
- **Code**: https://github.com/deeplearning-wisc/understanding_lp

---

## 1. 新范式 / 新指标

### Chain-of-Embedding 框架
首次从**逐层表征动态**的角度系统分析 LVLM 的语言先验（Language Prior, LP）问题。通过对比两组 embedding：$Z_{vis}^l$（视觉+文本输入）与 $Z_{blind}^l$（纯文本输入，移除视觉），计算各层的表征距离，揭示视觉信息何时真正影响模型解码。

### Visual Integration Point (VIP)
**核心发现**：每个 LVLM 都存在一个关键层 $l^*$（VIP），在该层之后视觉信息开始显著重塑隐藏表征。VIP 具有以下性质：
- **数据集无关**：同一模型在 6 个数据集上 VIP 位置一致
- **模型固有属性**：训练过程中 VIP 位置保持稳定
- 位置约在总层数的 **~60%** 处，与模型规模无关

### Total Visual Integration (TVI)
逐样本量化指标，聚合 VIP 层之后所有层的表征距离：

$$TVI(l^*; x, F_\theta) = \frac{1}{L - l^* + 1} \sum_{l=l^*}^{L} d(z_{vis}^l, z_{blind}^l)$$

TVI 越高 = 视觉整合越强 = 语言先验越弱。具有信息论解释（Theorem 5.1）：可视为 KL 散度与 Gaussian 估计器之间的关系。

**关键优势**：TVI 是白盒、样本级别的 LP 量化，无需标注数据或精心设计的 dataset。

---

## 2. 数据集

| 数据集 | 问题类型 | 总样本 | D_VT (视觉依赖) | D_T (视觉独立) |
|--------|---------|--------|----------------|---------------|
| MME | 二分类 | 2,374 | 546 | 1,828 |
| MMBench | 多选题 | 4,377 | 2,782 | 1,595 |
| MMStar | 多选题 | 1,500 | 1,057 | 443 |
| MMMU | 多选题 | 805 | 446 | 359 |
| VLind-Bench | 二分类（反事实） | 418 | 144 | 274 |
| ViLP | 多选题（强LP诱导） | 300 | 177 | 123 |

D_VT / D_T 划分方式：agreement-based separation（视觉输入存在/缺失时预测结果不同 = 视觉依赖）。

额外控制：CommonsenseQA + 随机 COCO 图片（构造视觉独立样本）。

---

## 3. 模型 (10个LVLMs)

| 模型                     | 融合方式       | 层数       | VIP 层    |
| ---------------------- | ---------- | -------- | -------- |
| Qwen2.5-VL-7B/32B/72B  | MLP        | 28/64/80 | 18       |
| Gemma-3-4B/12B/27B     | MLP        | 34/48/62 | 20/26/35 |
| InternVL3-8B           | MLP        | 28       | 16       |
| LLaVA-v1.5-7B          | MLP        | 32       | 9        |
| Eagle2.5-8B            | MLP        | 28       | 15       |
| Llama-3.2-11B-Vision   | Cross-Attn | 40       | 12       |
| LLaVA-NeXT-Vicuna-7B   | MLP        | 32       | 12       |
| LLaVA-OV-Qwen2-7B      | MLP        | 28       | 15       |
| SmolVLM                | MLP        | 24       | 15       |
| InstructBLIP-Vicuna-7B | Q-Former   | 32       | —        |

共 **60 个模型-数据集组合** 用于实验。

---

## 4. 实验方法

- **评估设置**：zero-shot，temperature=0，官方 HuggingFace checkpoint
- **距离度量**：cosine distance（默认），对比 L2、KL/JS divergence（logit-lens）
- **VIP 验证**：绘制逐层期望表征距离曲线，寻找 D_VT vs D_T 的显著分叉点
- **消融实验**：距离度量、聚合策略、pre-VIP vs post-VIP、与 visual attention / output divergence 对比
- **干预验证**：PAI（attention-correction hallucination mitigation）应用于 Qwen2.5-VL-7B
- **训练阶段分析**：跟踪 LLaVA-v1.5 各 checkpoint 的 VIP 和 TVI
- **TVI 作为训练正则项**：$L = -\log F_\theta(y|x) - \lambda \cdot TVI(l^*; x, F_\theta)$，λ=0.03

---

## 5. 关键结果

- **TVI vs. LP 代理指标**（Spearman's ρ）：
  - Qwen2.5-VL-7B (VLind): TVI **0.7155** vs. Visual Attention 0.0871 (不显著) vs. Output Divergence 0.2978
  - InternVL3-8B (VLind): TVI **0.6727** vs. Visual Attention 0.4967 vs. Output Divergence 0.1627
- **Pre-VIP vs. Post-VIP 相关性**：Qwen2.5-VL-7B pre-VIP ρ=0.1489, post-VIP ρ=**0.7241**
- **TVI 正则化训练**：LLaVA-v1.5 + TVI reg 在 MME 上 Perception 1400.44 (baseline 1369.75), Reasoning 321.43 (baseline 298.21)
- **模型规模**：更大模型始终表现出更高的维度归一化 TVI
- **跨架构适用**：VIP 现象在 MLP 融合、Cross-Attention、Q-Former 等不同架构上均出现
