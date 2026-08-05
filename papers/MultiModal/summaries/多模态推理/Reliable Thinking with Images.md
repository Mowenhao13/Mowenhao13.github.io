---
layout: page
---


- **Authors**: Haobin Li, Yutong Yang, Yijie Lin, Xiang Dai, Mouxing Yang, Xi Peng
- **Venue**: arXiv Preprint (2026-02-13)
- **arXiv**: 2602.12916

---

## 1. 新范式 / 新指标

### Noisy Thinking (NT)
首次揭示 TWI（Thinking with Images）范式中的一个实际且未被充分研究的问题。TWI 通常包含两个阶段：
- **Cue Mining**：MLLM 生成文本 CoT 调用外部工具（如 zoom）提取视觉线索
- **Answer Reasoning**：基于视觉线索推理答案

NT 指任一步骤出错：
- **Noisy Mining**：提取任务无关或粗粒度视觉线索（如定位到错误的对象）
- **Noisy Reasoning**：即使视觉线索正确，MLLM 的多模态理解不足仍导致错误推理

实证：Vstar 中 ~30% 的 trace 包含 NT；HR4K 中 ~48% 包含 NT。"一步错，步步错"。

### RTWI (Reliable Thinking with Images)
一种面向 TWI 的 **Test-Time Scaling (TTS)** 方法，包含三个模块：

#### (a) Reliability Estimation（可靠性估计）
统一的**文本中心**机制——利用调用工具的文本 CoT 作为视觉线索可靠性的自然代理，而非直接建模视觉不确定性：

$$w(t_s) = -\frac{1}{k} \sum_{i \in K(H(t_s))} h_i^s$$

聚焦高熵"关键决策点"的 token（Top-k），自适应 k 值应对不同 CoT 长度。

#### (b) Dual-stage Filtering（双阶段过滤）
使用自适应阈值 $\eta^m, \eta^r$（最低 40% percentile）丢弃不可靠 trace。

#### (c) Reliable Voting（可靠投票）
加权投票基于两个原则：
- **Trace Reliability** ($w^t$)：双阶段都可靠的 trace 权重更高
- **Reliability Leap** ($\Delta_t = \max(w(t_r) - w(t_m), 0)$)：从 mining 到 reasoning 质量飞跃的 trace 获得加权——捕捉"mining 时模糊但获取正确视觉线索后推理变得自信"的情况

**关键特点**：RTWI 是 inference-time 的 plug-and-play 方法，与训练改进正交。

---

## 2. 数据集 (7个Benchmarks)

| Benchmark | 来源 | 测量目标 |
|-----------|------|---------|
| Vstar Bench | CVPR 2024 | 高分辨率视觉搜索（Attr + Spatial） |
| HR-Bench 4K | AAAI 2025 | 4K 高分辨率感知（FSP + FCP） |
| HR-Bench 8K | AAAI 2025 | 8K 高分辨率感知（更困难） |
| TreeBench | arXiv 2025 | TWI 导向（Reasoning + Perception，含 GT bbox） |
| MathVision | NeurIPS 2024 | 视觉数学推理 |
| LogicVista | arXiv 2024 | 视觉逻辑推理 |
| VisualProbe | arXiv 2025 | TWI 导向（Easy/Medium/Hard 三级） |

---

## 3. 模型

### TWI Backbone 模型
- GPT-4o, Thyme, **DeepEyes-7B**
- **Qwen3-VL-Thinking** (2B, 4B, 8B, 32B), Qwen3-VL-Instruct (8B)

### TTS 基线方法
SC, ASC, ESC, CISC, Deepconf, Self-Cer.

---

## 4. 实验方法

- **NT 自然存在**：非模拟，直接利用 MLLM 固有的 mining/reasoning 错误
- **Online 设置**：实时生成，warmup 8 条 trace 估计阈值，early stopping（consensus β=0.9），最大 32 traces
- **Offline 设置**：预生成 32 traces，后处理过滤+投票
- **指标**：ACC, TSR (Token Saving Ratio), mIoU (TreeBench), Visual Cue Consistency
- **超参数**：过滤率 α=0.4, τ=0.1 (Thinking) / 1.0 (Instruct)

---

## 5. 关键结果

### Qwen3-VL-8B-Thinking Online 表现：

| Benchmark | Base | RTWI | TSR |
|-----------|------|------|-----|
| Vstar Attr | 78.3% | **85.2%** | 61.1% |
| Vstar Spatial | 73.7% | **81.6%** | 61.2% |
| HR-4K FSP | 83.0% | **91.3%** | 61.9% |
| HR-4K FCP | 57.3% | **65.8%** | 50.5% |
| MathVision | 18.7% | **23.2%** | 34.6% |
| LogicVista | 44.3% | **61.7%** | 50.5% |

**关键发现**：
- RTWI 在提升准确率的同时实现 **40-60% token 节省**
- **弱模型受益更大**：2B-Thinking 的相对提升比 32B 更显著
- TTS Scaling Law：准确率随 trace budget 增长持续提升
- Visual Cue Consistency: RTWI 47.6% (Vstar) vs. Deepconf 44.9%

### 消融实验（Vstar + HR-4K 平均）：
- SC baseline: 78.8
- Full RTWI: **83.4**，TSR=61.2%
