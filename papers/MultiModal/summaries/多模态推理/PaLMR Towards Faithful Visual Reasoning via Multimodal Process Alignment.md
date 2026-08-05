---
layout: page
---


- **Authors**: Yantao Li, Qiang Hui, Chenyang Yan, Kanzhi Cheng, Fang Zhao, Chao Tan, Huanling Gao, Jianbing Zhang, Kai Wang, Xinyu Dai, Shiguo Lian
- **Venue**: CVPR 2026 Findings
- **arXiv**: 2603.06652

---

## 1. 新范式 / 新指标

### PaLMR (Process Alignment for Multimodal Reasoning)
统一框架，不仅对齐最终结果，还对齐**推理过程本身**。此前的 RL 方法仅奖励最终答案正确性，容忍"过程幻觉"——模型在视觉感知不一致的情况下仍得到正确答案。

### 组件一：PaDLayer — Perception-Aligned Data Layer
四步数据管线：
1. **Data Collection**：从 FineVision 均匀采样约 1500 instances/domain（geometry, charts, science, OCR, general VQA）
2. **Data Filtering**：基于 learnability 过滤，移除异常值和过于简单样本，最终保留 **4,728 instances**（19 个子领域）
3. **Pseudo GT Labeling**：Gemini-2.5-Flash 生成结构化伪真值描述（对象、空间关系、视觉属性），问题无关
4. **Reference Sampling**：Best-of-N (BoN) 从策略模型采样语义连贯的推理轨迹作为参考基线

### 组件二：PaOLayer — Process-Aligned Optimization Layer
**V-GRPO (Vision-Guided GRPO)**：

**层级化奖励融合**：

$$R_{V-GRPO}(\tau) = S_{p,vis}(\tau) \cdot \left(\alpha S_{p,ans}(\tau) + (1-\alpha)S_{p,fmt}(\tau)\right)$$

- $S_{p,vis}(\tau)$：**二值视觉保真度分数**（最高优先级）。LLM Judge (Qwen3-30B-A3B) 将当前轨迹与 PaDLayer 参考对比，条件于伪视觉真值。若 Judge 偏好参考 → $S_{p,vis}=0$ → **整个 reward 归零**
- $S_{p,ans}(\tau)$：规则答案正确性
- $S_{p,fmt}(\tau)$：格式正确性
- $\alpha = 0.9$

**关键设计**：含视觉幻觉的轨迹即使最终答案正确也零奖励——迫使模型"先看对，再想对"。

**Pairwise Scoring**: 88.2% model-human alignment（远优于 point-wise 的 56.5%）。

---

## 2. 数据集

### 训练数据（4,728 instances, 19 子领域）
| 领域 | 子数据集 | 占比 |
|------|---------|------|
| Chart VQA | ChartQA, FigureQA, PlotQA, TabMWP | 22.04% |
| Geo VQA | GeoQA+, Geometry3K | 18.36% |
| Science VQA | ScienceQA | 9.50% |
| Math VQA | CLEVR-Math, Super-CLEVR, IconQA | 30.48% |
| OCR VQA | DocVQA, TextVQA, InfographicVQA | 0.36% |
| General VQA | A-OKVQA, VizWiz 等 | 19.27% |

### 评估 Benchmarks
- **HallusionBench**（感知密集型，细粒度视觉 grounding）
- **MMStar**（感知密集型）
- **MMMU**（多学科理解）
- **MathVista**（视觉数学推理）
- **MathVerse***（vision-only 子集）

---

## 3. 模型

- **主 Backbone**：Qwen2.5-VL-7B（3B/32B 用于 scaling 实验，Qwen3-VL-8B 用于跨代实验）
- **对比模型**（7B 级）：MM-Eureka-7B, OpenVLThinker-7B, Perception-R1-7B
- **闭源模型**：GPT-4o, Gemini2-Flash
- **开源通用模型**：Qwen2.5-VL-72B/32B, InternVL2.5-8B
- **Judge 模型**：Qwen3-30B-A3B

---

## 4. 实验方法

- **RL 算法**：V-GRPO（基于 GRPO），PPO-clip loss, group size G=16
- **训练配置**：VeRL + EasyR1, lr=1e-6, batch=128, rollout batch=512, temperature=1.0, 20 epochs, **8×H100-80GB**
- **过程级对齐度量**：Pairwise visual fidelity scoring (Qwen3-30B-A3B)
- **消融对比**：
  - Vanilla GRPO: $R = \alpha S_{p,ans} + (1-\alpha)S_{p,fmt}$
  - Visual Bonus: +0.5 bonus for visual alignment
  - Visual Mix: additive weights (α=0.2, β=0.7, γ=0.1)
  - PaLMR: hierarchical gating

---

## 5. 关键结果

### 主结果（7B 级）

| 模型 | MMMU | HallusionBench | MathVerse* | MMStar |
|------|------|---------------|-----------|--------|
| Qwen2.5-VL-7B | 56.4 | 63.8 | 42.6 | 64.3 |
| + GRPO | 57.8 | 66.7 | 45.9 | 66.0 |
| **PaLMR-7B** | **59.3** | **70.9** | 47.5 | **67.1** |
| MM-Eureka-7B | 55.4 | 69.5 | 46.6 | 64.6 |
| Perception-R1-7B | 56.3 | 70.0 | 46.1 | 66.3 |

**核心亮点**：
- **HallusionBench: 70.9** (+7.1 over base)，7B 模型中 SOTA
- MMMU: 59.3 (+2.9)
- 仅使用 **4.7K** 训练样本（vs. MM-Eureka 15K, OpenVLThinker 12K）——**2.5× 数据缩减**

### Scaling 结果
- PaLMR-32B: MMMU 66.8, HallusionBench 71.5
- Qwen3-VL-8B + PaLMR 饱和：HallusionBench 75.2（与 GRPO 75.3 接近）——作者归因于 Judge 模型能力瓶颈

### 数据效率
相同 GRPO 条件下，PaLMR 用 4.7K（vs. 12-15K）达到更优性能。

### 延迟开销
每步 546s vs. baseline GRPO 397s（+37.5%），主要由 Judge 模型 CoT 推理导致。禁用 CoT 将开销降至 +0.7%，但 MMMU 从 59.3 降至 57.3。
