---
layout: page
---


- **Authors**: Zhichen Dong*, Yang Li*, Yuhan Sun, Weixun Wang, Yijia Luo, Zinian Peng, Taiheng Ye, Chao Yang, Wenbo Su, Yu Cheng, Bo Zheng, Junchi Yan
- **Affiliations**: SJTU, Alibaba Group, Shanghai AI Lab
- **Venue**: ICML 2026 [CCF-A]
- **arXiv**: 2606.10646

> **注**: 本文为纯文本 LLM 论文，无多模态组件，但列在检索清单中。

---

## 1. 新范式 / 新指标

### FlowTracer
基于图的 token 级信用分配框架，通过追踪注意力诱导的信息流全局结构来分配 RL 中的 token 级奖励。

### Attention-Induced DAG
- Token 序列建模为时间有序的 DAG $G = (V, E)$
- 边权重 $W_{ik}$ 来自**聚合注意力分数**（中层 L/3 ~ 2L/3 的均值）
- $W$ 视为线性算子而非随机核（出度和可以 >1 或 <1）

### Flow Conservation via Doob-h-like Reweighting

定义势函数：$h(s) = 1$, $h(i) = \sum_{k>i} W_{ik} \cdot h(k)$

边容量重加权：$W'_{ik} = W_{ik} \cdot h(k) / h(i)$

**Theorem 3.1 (Local Flow Conservation)**：对任意节点 $i$（$h(i) > 0$），$\sum_{k>i} W'_{ik} = 1$。

效果：通往死胡同的边被抑制（$h(k) \approx 0$），流量重新分配到通往答案的路径。

### Token Credit via Global Forward Flow
- 虚拟超级源 $S$ 连接所有 prompt token，注入单位流
- 前向传播：$f(k) = \sum_{i<k} f(i) \cdot W'_{ik}$
- Token 吞吐量：$\tau(k) = f(k) + \sum_{j>k} \phi(k \to j)$

高吞吐 token = "中转枢纽"或"聚合检查点"（标点、换行、重复变量名、数学运算符等）。

### 与 Point-wise Credit Assignment 的区别
Point-wise 方法（熵、注意力最大值、梯度幅度、相关性）基于局部统计量独立评分。FlowTracer 捕获**全局多跳信息流结构**：token 的信用正比于它从 prompt 到 answer 路由的信息量。避免了：
- 早期关键前提被低估（受长路径稀释）
- 后期 near-answer token 被高估（受临近偏差）

---

## 2. 数据集

### 数学推理（主要评估）
| 数据集 | 描述 |
|--------|------|
| AIME24 | 2024 AIME 数学竞赛 |
| AIME25 | 2025 AIME |
| AMC23 | 2023 AMC 竞赛 |
| MATH500 | MATH benchmark 精选 500 题 |
| OlympiadBench | 奥赛级数学/物理 |

### 其他任务
| 数据集 | 描述 |
|--------|------|
| GSM8K | 小学数学（因果分析） |
| MinervaMath | 本科级定量推理 |
| Countdown | 四数算术组合 |
| CrossThinkQA | 多领域多选题 QA |

### 训练数据
DAPO-Math-17K（数学）, TinyZero 合成 20K（Countdown）, CrossThinkQA 训练集

---

## 3. 模型

| 模型 | 参数 | 角色 |
|------|------|------|
| Qwen3-4B-Base | 4B | 主 Backbone |
| Qwen3-8B-Base | 8B | 主 Backbone |
| Llama-3.1-8B | 8B | 架构泛化测试 |
| Llama-3.2-3B | 3B | 架构泛化测试 |

---

## 4. 实验方法

- **DAG 构建**：中层注意力（L/3 ~ 2L/3），所有头平均。额外一次 batch 前向传播获取完整注意力权重
- **Top-40%** 高吞吐 token 获得额外信用（γ_flow = 1.5）
- **RL 算法**：GRPO（无 critic，group advantage），基于 ROLL 框架（vLLM + Megatron-LM）
- **训练配置**：lr=1e-6, batch=512, 8/16 GPUs, 500-600 steps
- **因果干预实验**（GSM8K）：扰动 20% token，mask 注意力，从截断点重新生成
- **对比基线**：GRPO, Random, High-entropy, Gradient magnitude, Correlation, Attention max, **CAPO**, **ThinkPRM-1.5B**, AsyPPO, Reweight+Lopti
- **计算开销**：Qwen3-4B 1K: +2.2%; 8K: +4.5%

---

## 5. 关键结果

### Qwen3-8B (1K context)

| Benchmark | GRPO | FlowTracer | Gain |
|-----------|------|------------|------|
| AIME24 | 9.3 | 13.0 | +3.7 |
| AIME25 | 7.3 | 11.8 | +4.5 |
| AMC23 | 59.1 | 65.6 | +6.5 |
| MATH500 | 77.1 | 79.7 | +2.6 |
| Olympiad | 44.2 | 46.7 | +2.5 |
| **Average** | **39.4** | **43.4** | **+4.0** |

### Qwen3-4B (1K context)
Average: 37.1 → 39.4 (**+2.2**)

### Long-context (8K) — Qwen3-4B
Average: 44.8 → 48.6 (**+3.8**)

### Long-context (8K) — Qwen3-8B
Average: 50.3 → 52.5 (**+2.1**)

### 非数学任务 (Qwen3-4B)
- Countdown: 52.6 → 63.2 (**+10.6**)
- CrossThinkQA: 48.0 → 50.2 (**+2.2**)

### Llama 泛化
- Llama-3.1-8B: +1.4 Avg
- Llama-3.2-3B: +1.1 Avg

### 因果干预
| 扰动目标 | Answer Change | Correctness Reverse |
|----------|--------------|-------------------|
| Random (20%) | 29.5% | 4.5% |
| Low-flow (Bottom 20%) | 14.9% | 0.5% |
| **High-flow (Top 20%)** | **45.9%** | **14.9%** |

证实高吞吐 token 是推理链的**因果关键节点**。

### 额外基线 (Qwen3-8B)
GRPO 39.4 → +CAPO 41.4 → +ThinkPRM-1.5B 41.0 → +AsyPPO 40.0 → **FlowTracer 43.4**

### 消融
- **Top-40% 最优**（Top-20% 覆盖不足，Top-60% 引入噪声）
- **Hard reweighting 优于所有连续变体**（sigmoid, tanh+z-score, MAD, log1p 等）
- γ_flow = 1.5 最优（1.2 欠强调，3.0 降至 29.7）
- 中层注意力一致优于全层、前层和后层
