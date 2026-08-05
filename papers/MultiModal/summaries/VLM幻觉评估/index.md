---
layout: page
title: VLM 幻觉评估 子主题索引
---

# VLM 幻觉评估 子主题索引

> 最后更新：2026-07-07
> 总计：20 篇论文，3 个子方向

> **主题说明**：Vision-Language Model（VLM/LVLM）的物体幻觉评估，包含专门基准、检测与缓解方法、经典基准三大分支。

---

## 子分支一览

| 子分支 | 论文数 | 涵盖方向 |
|--------|--------|---------|
| [专门基准](专门基准/INDEX.md) | 7 | 因果/可控/关系/细粒度等特定视角的幻觉评估基准 |
| [检测与缓解](检测与缓解/INDEX.md) | 7 | 因果干预、注意力分析、解码策略、统一检测等幻觉缓解方法 |
| [经典基准](经典基准/INDEX.md) | 6 | 奠基性及广泛引用的幻觉评估基准与指标 |

---

## 子分支深度说明

### 📂 专门基准（7 篇）

聚焦特定幻觉维度的评估基准：

- **因果探测**：[Causal-HalBench](Causal-HalBench.md) — AAAI 2026，因果干预探测物体幻觉
- **可控诊断**：[DO-Bench](DO-Bench.md) — 可控诊断区分感知 vs 文本先验幻觉
- **负物体评估**：[NOPE](NOPE.md) — 系统性评估 VLM 对"不存在的物体"的幻觉响应
- **多物体幻觉**：[ROPE](ROPE.md) — 多物体交互场景下的关系幻觉
- **关系幻觉**：[Reefknot](Reefknot.md) — 全面评估关系幻觉
- **细粒度评估**：[SHALE](SHALE.md) — Scalable Benchmark for Fine-grained Hallucination Evaluation
- **自由格式**：[THRONE](THRONE.md) — 面向自由格式生成的物体幻觉基准

### 📂 检测与缓解（7 篇）

- **因果缓解方向**：[CausalMM](CausalMM.md) — 因果注意力干预缓解模态先验幻觉
- **注意力分析**：[DAMRO](DAMRO.md) — 深入研究注意力机制减少物体幻觉
- **解码策略**：[HALC](HALC.md) — 自适应焦点对比解码（Adaptive Focal-Contrast Decoding）
- **统一评估**：[Hal-Eval](Hal-Eval.md) — 统一细粒度幻觉评估框架
- **逻辑验证**：[LogicCheckGPT](LogicCheckGPT.md) — 逻辑闭环发现物体幻觉
- **统一检测**：[UNIHD](UNIHD.md) — 统一幻觉检测框架
- **后处理修正**：[Woodpecker](Woodpecker.md) — 多模态 LLM 幻觉后处理纠正

### 📂 经典基准（6 篇）

- ⭐ [CHAIR](CHAIR.md) — 2018，物体幻觉奠基性定义与经典指标
- ⭐ [POPE](POPE.md) — 2023，轮询式探测 LVLM 物体幻觉，广泛引用
- [AMBER](AMBER.md) — 免 LLM 的多维度 MLLM 幻觉基准
- [FaithScore](FaithScore.md) — 细粒度 LVLM 幻觉评估
- [HallusionBench](HallusionBench.md) — 语言幻觉 vs 视觉错觉诊断
- [MMHal-Bench](MMHal-Bench.md) — 基于事实增强 RLHF 的对齐

---

## 论文时间线

### 2026

| 论文 | 子分支 | Venue | 核心贡献 |
|------|--------|-------|---------|
| Causal-HalBench | 专门基准 | **AAAI** | 因果干预探测 LVLM 物体幻觉 |
| DO-Bench | 专门基准 | - | 可控诊断区分感知 vs 文本先验幻觉 |

### 2025

| 论文 | 子分支 | Venue | 核心贡献 |
|------|--------|-------|---------|
| SHALE | 专门基准 | - | 可扩展细粒度幻觉评估 |
| DAVE | 检测与缓解 | - | 文档理解专用视觉编码器（含幻觉缓解） |

### 2024 及更早

| 论文 | 年份 | 子分支 | Venue | 核心贡献 |
|------|------|--------|-------|---------|
| CHAIR | 2018 | 经典基准 | - | ⭐ 物体幻觉奠基性定义与评估指标 |
| POPE | 2023 | 经典基准 | - | ⭐ 轮询式 LVLM 物体幻觉探测 |
| HallusionBench | 2023 | 经典基准 | - | 语言幻觉 vs 视觉错觉诊断 |
| AMBER | - | 经典基准 | - | 免 LLM 多维度基准 |
| FaithScore | - | 经典基准 | - | 细粒度 LVLM 幻觉评估 |
| MMHal-Bench | - | 经典基准 | - | 事实增强 RLHF 对齐 |

---

## 关联主题

- [../VLM安全与对齐](../VLM安全与对齐.md) → 幻觉与安全紧密相关，部分安全防御也涉及幻觉缓解
- [../多模态安全](../多模态安全.md) → 跨模态攻击可诱发幻觉
- [../多模态视觉编码分析](../多模态视觉编码分析.md) → 视觉编码质量直接影响幻觉产生