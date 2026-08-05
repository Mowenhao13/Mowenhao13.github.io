---
layout: page
---


- **Authors**: Leitao Yuan, Qinghua Mao, Daizong Liu, Kun Wang, Wenjie Wang, Yan Teng, Jing Shao, Dongrui Liu
- **Affiliations**: Shanghai AI Lab, Zhejiang Univ, SJTU, Wuhan Univ, NTU, USTC
- **Venue**: arXiv Preprint (2026-05-20)
- **arXiv**: 2605.21541

---

## 1. 新范式 / 新指标

### FRA-Attack
针对**闭源 MLLM 的迁移攻击**提出统一的频域正则化框架，解决空间域的两个核心问题：

#### 问题1（特征对齐侧）：空间域 patch 特征高度冗余
邻近 ViT patch 强相关 → 多尺度 cropping/clustering 无法真正隔离"跨模型共享的内在视觉焦点"。

#### 问题2（梯度侧）：代理梯度混合了迁移性信号与代理性噪声
现有方法（输入增强、模型平均）间接稀释噪声，不直接分解梯度。

### 组件一：High-Pass DCT 特征对齐（损失侧）
- 沿 patch embedding 的 token 维度施加 **Type-II DCT**
- 选取 top-n 高能量**高频 DCT 分量**（编码纹理、边缘等细粒度语义），抑制低频全局结构
- 通过 **Entropic Optimal Transport** (Sinkhorn) 对齐源/目标高频特征，cosine distance 为代价矩阵

### 组件二：Frequency-domain Gradient Regularization (FGR)（梯度侧）
- **模型无关**的正则项：直接对输入梯度张量施加 2D DCT
- 径向低通滤波器：$\phi(d) = (1-d)^p$（p=1.5），d 为归一化径向频率距离
- 仅使用**几何频率坐标**，不依赖代理模型统计量
- 保留低频（迁移性）分量，抑制高频（代理性噪声）分量

两个组件作用于不同张量（patch embedding vs. 输入梯度），可独立嵌入现有管线。

---

## 2. 数据集

| 数据集 | 用途 | 规模 |
|--------|------|------|
| NIPS 2017 Adversarial Attacks dev set | 源图片 | 1,000 张，resize 至 224×224 |
| MSCOCO validation split | 目标图片 | 1,000 张，与源图片随机配对 |
| GPT-4o | 评估 Judge | GPTScore 语义相似度 + KMR 关键词匹配 |

**评估指标**：
- **ASR** (Attack Success Rate): GPTScore > 0.5 的比例
- **AvgSim**: 平均 GPTScore 相似度
- **KMR** (Keyword Matching Rate): 目标图片内容关键词在受害者输出中出现的比例（三级严格度）

---

## 3. 模型 (15个MLLMs, 7个厂商)

### 闭源标准模型 (6个)
| 模型 | 厂商 |
|------|------|
| GPT-5.4 | OpenAI |
| GPT-5.2 | OpenAI |
| Claude-Opus-4.6 | Anthropic |
| Claude-Sonnet-4.6 | Anthropic |
| Gemini-3-flash | Google |
| Gemini-2.5-flash | Google |

### 闭源推理增强模型 (3个)
GPT-5.4-thinking, Claude-Opus-4.6-thinking, Gemini-3-flash-thinking

### 开源模型 (6个)
Qwen3-VL-8B/32B, Llama-3.2-11B-V, Gemma-3-27B-it, GLM-4.6V, Kimi-K2.5

### 代理模型集成 (3个 CLIP 变体)
CLIP ViT-B/16, ViT-B/32, ViT-g-14-laion2B

---

## 4. 实验方法

- **攻击设置**：Transfer-based black-box targeted attack
  - 仅在开源 CLIP 代理编码器上优化扰动
  - 通过 API 查询闭源受害者，无架构/参数访问
- **扰动预算**：ε = 16/255 (L∞)，MI-FGSM, N=300 迭代, α=1/255, μ=1.0
- **对比基线**：
  - 弱基线: AttackVLM, AdvDiffVLM, SSA-CWA, AnyAttack
  - 强基线: **M-Attack** (NeurIPS 2025), **FOA-Attack** (NeurIPS 2025), **M-Attack-V2** (2026)
- **计算资源**：4× NVIDIA H200, 完整 1000 对攻击约 3 小时

---

## 5. 关键结果

### 旗舰模型 ASR (%) at threshold 0.5：

| 方法 | GPT-5.4 | Claude-Opus-4.6 | Gemini-3-flash |
|------|---------|-----------------|----------------|
| M-Attack | 24.0 | 49.2 | 26.8 |
| FOA-Attack | 30.9 | 51.3 | 30.9 |
| M-Attack-V2 | 41.2 | 64.5 | 47.5 |
| **FRA-Attack** | **46.9** | **76.8** | **50.8** |

**相对 M-Attack-V2 提升**: +5.7 (GPT-5.4), +12.3 (Claude-Opus-4.6), +3.3 (Gemini-3-flash)

### 推理增强模型 ASR：
FRA-Attack vs. M-Attack-V2: GPT-5.4-thinking 46.1 vs. 38.8; Claude-Opus-4.6-thinking **74.0** vs. 66.7

### 组件消融（完整 vs. 去除 FGR vs. 去除 DCT 对齐）：
- 完整 FRA-Attack: GPT-5.4=46.9, Claude-Opus-4.6=76.8, Gemini-3-flash=50.8
- 去除 FGR: 44.5 / 72.7 / 53.1
- 去除 DCT 对齐: 39.0 / 74.0 / 48.1

### FGR 滤波器设计：多项式 (1-d)^1.5 达到最优 (69.0 mean ASR)，显著优于 hard threshold (58.2) 和 per-band clipping (62.7)
