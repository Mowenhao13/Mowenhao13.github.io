---
layout: page
---


- **Authors**: Zengbin Wang, Feng Xiong, Liang Lin, Xuecai Hu, Yong Wang, Yanlin Wang, Man Zhang, Xiangxiang Chu
- **Venue**: ACL 2026
- **arXiv**: 2604.09349
- **Code**: https://github.com/wzb-bupt/VGPO
- **HuggingFace**: MuMing0102/VGPO-RL (7B + 32B)

---

## 1. 新范式 / 新指标

### VGPO (Visually-Guided Policy Optimization)
在 RL-based 策略优化过程中强化 VLM 视觉关注度的框架，无需外部模型或额外前向传播。

### (a) Visual Focus Score
使用生成 token 的 hidden states 与"视觉原型"（所有图片 token hidden states 的 mean-pooling）之间的 **cosine similarity** 作为模型内信号：

$$\rho_{i,t} = 0.5 \cdot \left(\frac{h_{i,t}^T \mu_v}{||h_{i,t}||_2 \cdot ||\mu_v||_2 + \epsilon} + 1\right)$$

仅需 `output_hidden_states=True`（~5-10% 开销 vs. 提取注意力权重的 20-30%）。

### (b) Visual Attention Compensation (VAC)
解决**时序视觉遗忘**（Temporal Visual Forgetting）：
- 推理链越长，视觉注意力越衰减
- 错误样本 late/early ratio 平均 0.532 vs. 正确样本 0.680
- VAC **线性提升后期推理步骤的视觉期望**：

$$w_{i,t} = \rho_{i,t} \cdot (1 + G_i(\rho_{i,t}) \cdot \beta \cdot t/T_i)$$

- 视觉门控 $G_i(\cdot)$：仅在尾部（后 50%）且视觉关注度在 top 20% 的 token 上激活
- β = 0.3, γ = 0.5, κ = 0.2

### (c) Dual-Grained Advantage Re-Weighting

**Intra-trajectory 级别**：对 token 级 advantage 基于其视觉显著性相对轨迹内均值进行重加权：

$$\psi_{i,t} = ŵ_{i,t} - \frac{1}{T_i} \sum_{k=1}^{T_i} ŵ_{i,k}$$

**Inter-trajectory 级别**：聚合每个轨迹的视觉分数，组内归一化后零中心化：

$$s_i = \sum_t w_{i,t}, \quad \phi_i = ŝ_i - \frac{1}{G} \sum_j ŝ_j$$

**最终集成**：

$$\hat{A}^V_{i,t} = \hat{A}_i \cdot (1 + \psi_{i,t}) \cdot (1 + \phi_i)$$

策略更新同时受答案正确性和视觉利用保真度驱动。

---

## 2. 数据集

### 训练数据
| 数据集 | 规模 | 描述 |
|--------|------|------|
| ViRL39K | ~39K | 主训练集（多源合成） |
| Geo3K | 2.1K | 几何（数据受限实验） |
| MMK12 | 6.4K | K-12 多模态推理 |

### 评估 Benchmarks
**Avg-Math (6 benchmarks)**: MathVista, MathVerse, We-Math, MMK12, GeoMath, Geometry3K

**Avg-Vision (4 benchmarks)**: LogicVista, SuperCLEVR Counting, MMMU-Pro, MathVerse-V

（均来自 PAPO-Eval，不依赖 LLM-as-judge 的可靠验证）

---

## 3. 模型

- **主 Backbone**: Qwen2.5-VL-3B/7B/32B-Instruct
- **鲁棒性实验**: Qwen2-VL-2B-Instruct（更弱视觉编码器）
- **参考模型**: Qwen2.5-VL-72B, Qwen3-VL-32B

### 对比基线（均 7B 级）
GRPO, DAPO, ThinkLite-VL-7B, VL-Rethinker-7B, MM-Eureka-7B, NoisyRollout-7B, **PAPO-D-7B**, **VPPO-RL-7B**, DAPO+Entropy, DAPO+KL-perception

---

## 4. 实验方法

- **视觉注意力测量**：最终 transformer 层的注意力权重分为图片/查询/文本 token 三类，归一化
- **时序遗忘测量**：Late/Early Visual Accumulation Ratio
- **相关性验证**：Visual Focus Score 与实际注意力权重的 Pearson r ≈ 0.67
- **训练配置**：lr=1e-6, rollout batch=512, global batch=128, G=8, 2 epochs, 8/32×H20-96GB
- **评估**：temperature=0.0, max response=2048 tokens

---

## 5. 关键结果

### 主结果（Qwen2.5-VL-7B Backbone）

| 指标 | Base | +GRPO | +DAPO | **+VGPO** |
|------|------|-------|-------|-----------|
| Avg-Math | 50.0 | 62.6 | 63.8 | **66.6 (+33.2%)** |
| Avg-Vision | 48.7 | 58.8 | 59.6 | **63.3 (+30.0%)** |

### vs. 其他 7B 模型
- Avg-Math: VGPO **66.6** > VPPO-RL 65.7 > PAPO-D 65.5
- Avg-Vision: VGPO **63.3** > VPPO-RL 61.3 > PAPO-D 60.4

### 关键单 Benchmark
- LogicVista: 49.4 (PAPO-D: 45.9, VPPO-RL: 48.8)
- Counting: **95.5** (PAPO-D: 89.0)
- MathVista: **74.1**（7B 中最优）
- MathVerse: **71.6**

### Scaling（3B → 7B → 32B）
- 3B: Avg-Math 57.7 (+30.8%), Avg-Vision 53.6 (+30.7%)
- 32B: Avg-Math **70.7** (+13.8%), Avg-Vision **66.7** (+10.8%)

### 数据效率
Geo3K 仅 2.1K 样本：VGPO 60.4 vs. DAPO 57.4 Avg-Math

### 消融
- DAPO alone: Avg-Math 63.8, Avg-Vision 59.6
- +Intra only: 66.1 / 62.5
- +Inter only: 65.3 / 62.0
- **Full VGPO: 66.6 / 63.3**

### 补偿策略
- Linear (VGPO): 66.6 / 63.3
- Full-trajectory 补偿: 53.0 / 54.2（**比 baseline 更差！**）——早期视觉注意力已自然较高，过度强调会分散 query 解析

### 弱编码器鲁棒性
Qwen2-VL-2B: VGPO Avg-Math 38.2 (+11.1%), Avg-Vision 43.0 (+16.2%) ——弱编码器上相对增益更大
