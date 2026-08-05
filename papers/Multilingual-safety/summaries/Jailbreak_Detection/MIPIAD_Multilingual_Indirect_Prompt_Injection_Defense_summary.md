---
layout: page
---

> **arXiv**: `2605.07269` | **年份**: 2026

## 核心贡献

本文提出MIPIAD（Multilingual Indirect Prompt Injection Attack Defense），一个面向**多语言间接提示注入攻击**的防御框架，创新性地将LoRA微调的神经序列分类器（XLPID）与TF-IDF词法特征通过元集成方法融合。在英语和孟加拉语上验证，混合模型（XLPID+TF-IDF）F1达0.9205，Boosting集成AUROC达0.9378，且集成方法一致性地缩小了英语与孟加拉语之间的跨语言差距。

## 方法

**MIPIAD框架组成**：

1. **XLPID（跨语言提示注入检测器）**：基于冻结的Qwen2.5-1.5B LLM骨干，通过LoRA（rank=16, α=32）进行序列分类微调，使用bfloat16降低VRAM消耗
2. **TF-IDF词法基线**：10,000个字符n-gram特征（大小1-3），无需语言特定分词
3. **元集成策略**：
   - 混合晚期融合：$p = \alpha p_t + (1-\alpha) p_l$，$\alpha$经网格搜索确定
   - Stacking集成：逻辑回归堆叠
   - Boosting集成：梯度提升树

**数据生成流水线**：
- 基于BIPIA模板，覆盖5个任务族（邮件、表格、QA、摘要、代码）
- 15种文本攻击类别 + 10种代码攻击类别，每种5个变体
- 3种插入位置（开头、中间、结尾），2种语言（英语、孟加拉语）
- 使用NLLB-200进行英语到孟加拉语的翻译
- 最终生成1,431,400个原始样本
- **关键设计**：训练和测试集使用互斥的攻击类别和变体，避免数据泄露

**端到端评估**：
- 防御分类器预处理 → 受害者LLM处理 → 判官集成（多数投票） → 指标聚合
- 判官集成：多个判官LLM对响应进行评分，使用多数投票机制
- 关键指标：ASR（攻击成功率）、BU（良性效用）、UA（受攻击效用）、CLP（跨语言对等性）

## 数据集与实验

**MIPIAD基准**：
- 1.43M样本，训练集2:1（良性:攻击）下采样，测试集~10:1攻击-良性比
- 互斥的攻击类别划分，防止数据泄露

**受害者模型（7个）**：Qwen2.5-7B-Instruct、Qwen3-8B、Qwen3.5-9B、Gemma-3-12B-IT、BanglaLLaMA-3-8B、BLOOMZ-7B1-MT、TigerLLM-9B-IT

**主分类结果**：

| 模型 | F1 | AUROC | CLP |
|------|----|-------|-----|
| XLPID (Qwen2.5-1.5B) | 0.8939 | 0.9074 | 0.9322 |
| **Hybrid (XLPID+TF-IDF)** | **0.9205** | 0.9346 | 0.9479 |
| Stacking Ensemble | 0.8110 | 0.9276 | 0.9947 |
| **Boosting Ensemble** | 0.9134 | **0.9378** | 0.9479 |
| TF-IDF+SVM | 0.7686 | 0.8416 | 0.9819 |

**端到端防护效果**：
- 防御降低所有7个受害者在两种语言上的ASR
- 最大降幅：Qwen3.5-9B（英语-0.30，孟加拉语-0.12）
- BanglaLLaMA-3-8B（英语-0.16）
- 效用损失极小（BU变化在±0.05以内）
- **最难防御的攻击**：表情符号替换（ASR 0.458）、加密货币挖矿（0.405）

## 关键发现

1. **词法信号意外强大**：单独的TF-IDF+SVM就达到F1=0.77，超过许多神经基线
2. **混合优于纯神经**：Hybrid相较于XLPID单独提升2.7个F1点，修复了神经模型在低频模式上的盲区
3. **集成一致缩小跨语言差距**：所有集成方法的CLP均高于单独XLPID
4. **代码类别最难防御**：键盘记录（ASR 0.357）、系统漏洞利用（0.333）在防御后仍维持较高成功率

## 关联论文

- [JBShield_Summary](JBShield_Summary.md)：越狱检测的另一种方法
- [Proactive_Safety_Reasoning_Summary](Proactive_Safety_Reasoning_Summary.md)：安全推理防御
- [defense_papers_summary](defense_papers_summary.md)：LLM安全防御方法综述
- [LLM_Jailbreak_Papers_Index](LLM_Jailbreak_Papers_Index.md)：越狱攻击与防御论文索引
- [Cognitive_Driven_Defense_Summary](Cognitive_Driven_Defense_Summary.md)：元操作推理驱动的认知防御
