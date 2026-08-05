---
layout: page
---


- **Authors**: Ruilin Luo, Chufan Shi, Yizhen Zhang, Cheng Yang, Songtao Jiang, Tongkun Guan, Ruizhe Chen, Ruihang Chu, Peng Wang, Mingkun Yang, Yujiu Yang, Junyang Lin, Zhibo Yang
- **Venue**: ICLR 2026 Poster
- **arXiv**: 2603.03825
- **Code**: https://github.com/lrlbbzl/Qwen-AVAR

---

## 1. 新范式 / 新指标

### Visual Attention Score (VAS)
基于注意力的量化指标，衡量模型在推理过程中对视觉 token 的关注程度：

$$VAS_i(l, h) = \frac{\sum_{j \in V} A_{i,j}(l, h)}{\sum_{j \in S} A_{i,j}(l, h)}$$

模型级 VAS = 所有层、所有头、所有 query token 的平均值。VAS 越高 = 视觉依赖越强。

### Lazy Attention Localization
**反直觉现象**：多模态 cold-start **无法**提升 VAS（注意力分布接近基座模型），而纯文本 cold-start **反而**显著提升视觉注意力。定量证据：
- 多模态 cold-start (R1-OneVision) 与 Qwen2.5-VL-7B 注意力分布几乎相同
- 纯文本 cold-start (OVR-CS) 视觉注意力高 15-20%
- 现有 cold-start 数据（R1-OneVision, OpenVLThinker, Vision-SR1）反而**降低**性能（-1.0% ~ -4.7%）

### AVAR (Attention-Guided Visual Anchoring and Reflection)
三组件协同的 cold-start 框架：

**组件一：Visual-Anchored Reflection Data Synthesis (VARD)**（30.6K 样本）
- Gemini 2.5-Pro → 高保真结构化视觉描述（全局扫描→迭代分解→信息链接→场景合成）
- Qwen3-235B-A22B → 反思增强推理链（迭代自我反思+错误检查）
- Qwen3-32B → 视觉锚点集成（"look back at the triangle", "check the image again"）

**组件二：Attention-Guided Training Objectives (AGTO)**

$$L_{total} = L_{LM} + \alpha \cdot L_{enhance-img} + \beta \cdot L_{suppress-sys}$$

- Image Enhancement Loss：鼓励持续关注视觉 token
- System Suppression Loss：减少对系统 token 的冗余关注
- α = β = 0.15

**组件三：Visual-Anchored Reward Shaping (VARS)**

$$r_{total} = r_{accuracy} + \lambda_v \cdot r_{visual} + \lambda_f \cdot r_{format}$$

- $r_{visual}$：仅在 rollout 正确时生效，衡量视觉 vs. 系统 token 的注意力比率
- $\lambda_v = 0.3, \lambda_f = 0.1$

---

## 2. 数据集 (7个Benchmarks)

| Benchmark | 测量目标 |
|-----------|---------|
| MathVista | 视觉数学推理 |
| MathVision | 多步几何推理 |
| MathVerse-VO | Vision-Only 数学推理（测试真正"看图"能力） |
| MMMU-VAL | 多学科多模态理解（30 科目） |
| MMMU-Pro | 更鲁棒的 MMMU（更难版本） |
| MMStar | 感知理解 |
| HallusionBench | 视觉幻觉与语言先验鲁棒性 |

额外用于 VAS 相关性分析：DynaMath-WORSE

---

## 3. 模型

- **主 Backbone**：Qwen2.5-VL-7B
- **泛化实验**：Llama-3.2-Vision-11B-Instruct
- **数据合成**：Gemini 2.5-Pro, Qwen3-235B-A22B, Qwen3-32B
- **VAS 分析的模型**：Qwen2.5-VL-7B, R1-OneVision, ThinkLite-VL, MM-Eureka, Revisual-R1, OVR, MiMo-VL 等
- **对比基线**：GPT-4o, Claude-3.7-Sonnet, InternVL2.5-8B, LLaVA-OneVision-7B, Mulberry-7B, Vision-R1, VLAA-Thinker-7B, Vision-SR1

---

## 4. 实验方法

- **VAS 计算**：每模型从 MathVista 采样 200 例，计算每层每头的注意力矩阵
- **Training-Free 干预**：直接修改推理时的 hidden states，选择性增强视觉/抑制系统注意力

$$\hat{Z}_{l,h} = Z_{l,h} + \alpha_{img} \cdot M^{enh}_{l,h} \odot Z_{l,h} - \alpha_{sys} \cdot M^{sup}_{l,h} \odot Z_{l,h}$$

- **Cold-Start 训练**：30.6K 样本, 20 epochs, LlamaFactory, 16× A100, lr=5e-6, batch=512
- **RL 训练**：17.9K 样本, 4 epochs, VeRL, lr=1e-6, batch=256, GRPO

---

## 5. 关键结果

### VAS 与推理性能的相关系数
- **Pearson r = 0.9616**, p = 9.0e-06

### 模型按 VAS 分类
- **Narrow-View** (VAS < 10): Qwen2.5-VL-7B, R1-OneVision, ThinkLite-VL, MM-Eureka → 性能较弱
- **Wide-View** (VAS 10-15): Revisual-R1 变体 → 中等提升
- **Panoramic-View** (VAS > 15): OVR-RL/CS, MiMo-VL-CS/RL → 最强

### AVAR-Thinker vs. Qwen2.5-VL-7B 逐 Benchmark

| Benchmark | Baseline | AVAR-Thinker | Δ |
|-----------|----------|-------------|-----|
| MathVista | 68.2 | 74.7 | **+6.5%** |
| MathVision | 25.2 | 37.4 | **+12.2%** |
| MathVerse-VO | 41.1 | 50.4 | **+9.3%** |
| MMStar | 62.1 | 64.1 | +2.0% |
| MMMU-VAL | 58.1 | 63.8 | +5.7% |
| MMMU-Pro | 38.3 | 42.9 | +4.6% |
| HallusionBench | 50.7 | 59.5 | **+8.8%** |
| **Average** | **49.1** | **56.1** | **+7.0%** |

### 消融（累积增益）
| 配置 | 平均 |
|------|------|
| Baseline | 49.1 |
| + VARD only | 51.0 (+1.7%) |
| + VARD + AGTO | 52.6 (+1.6%) |
| + VARD + AGTO + VARS (full AVAR) | 56.1 (+6.8%) |

### VAS 演变
Base 7.5 → VARD 10.1 → AVAR-CS 13.8 → AVAR-Thinker **18.9**

### 泛化到 Llama-3.2-Vision-11B
Baseline 37.2% → Full AVAR 46.7% (**+9.5%**)

### Training-Free 干预
在 System Token Redundancy Zone（α_sys ∈ {0.00, 0.40}）实现 1-2% 一致提升。
