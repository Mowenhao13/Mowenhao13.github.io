---
layout: page
---

> **arXiv**: `2605.00689` | **年份**: 2026 | **Venue**: arXiv

## 核心贡献

ML-Bench & ML-Guard 提出了首个基于区域法规（Policy-Grounded）的多语言安全基准和 guardrail 模型。ML-Bench 通过从 17 部区域 AI 法规中提取风险类别和安全规则，在 14 种语言的原生语境中直接构建安全数据，避免了机器翻译带来的文化失真。ML-Guard 是首个采用 Diffusion Large Language Model (dLLM) 架构的 guardrail 模型，利用其并行推理能力，设置了 1.5B 快速分类版和 7B 策略合规评估版两个变体。

## 方法

**ML-Bench 构建**：
1. **规则提取**：使用 GPT-5 从 17 部区域 AI 法规（覆盖 14 个国家/14 种语言）逐条款提取安全规则
2. **两级风险结构**：第一层为高层风险类别，第二层为细粒度安全规则，全部在原语言中表达
3. **数据生成**：构建三个难度等级——seed（种子查询）、refined（精炼查询）、attack-enhanced（攻击增强查询），全部基于具体规则生成安全和不安全配对实例
4. **Response 构建**：用 Qwen3-8B 生成策略边界附近的不安全/安全 response 对

**ML-Guard 架构**：
基于 Fast_dLLM_v2 实现，利用 dLLM 的并行推理能力：
- **ML-Guard-1.5B**：快速二分类（safe/unsafe）
- **ML-Guard-7B**：支持策略条件合规检查，输出四行结果：safe/unsafe 判定、是否违反规则、违反的具体规则、英语推理说明

## 数据集与实验

**语言覆盖**：14 种语言——阿拉伯语、中文、荷兰语、英语、法语、加拿大法语、德语、印地语、意大利语、日语、韩语、葡萄牙语、西班牙语、土耳其语。

**数据规模**：总计 56K 实例（34K 训练 + 22K 评估）。

**评估基准**：ML-Bench 测试集 + 6 个现有安全基准（PolyGuardMix 等）。

**对比基线**：11 种 guardrail——DuoGuard-1.5B、Llama-Guard-3-1B/8B、Llama-Guard-4-12B、PolyGuard-Qwen、Nemotron-8B、Qwen3Guard 系列、gpt-oss-safeguard-20B、Omni-moderation。

**标注验证**：5 个 LLM 投票标注（GPT-5、Claude Sonnet 4.6、Qwen-3.5 Plus、Grok-4、DeepSeek-V3.2），人类标注一致性达 94.3%。

## 关键发现

ML-Bench 证明了基于本地法规的安全评估与通用风险分类法存在本质差异，翻译无法保留法律和文化的细微含义。ML-Guard 利用 dLLM 架构实现了高效推理，特别是 7B 版本支持用户自定义策略规则的条件评估。ML-Guard 在 ML-Bench 和现有基准上均取得 SOTA 性能，证实了政策导向的 guardrail 是实际部署的关键方向。

## 关联论文

[PolyGuard](PolyGuard.md)、[MrGuard](MrGuard.md)、[SelfDefend](SelfDefend.md)、[CREST](CREST.md)、[CHILLGuard](CHILLGuard.md)
