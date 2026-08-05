---
layout: page
title: LLM越狱攻防论文总结索引
---

# LLM越狱攻防论文总结索引

## 📚 论文清单

### 1. 攻击论文
- **文件名**: `JULI_Jailbreak_LLMs_Summary.md`
- **arXiv ID**: 2505.11790v4
- **标题**: JULI: Jailbreak Large Language Models by Self-Introspection
- **核心内容**: 提出JULI攻击方法，利用BiasNet操纵token对数概率越狱LLM
- **PDF文件**: `2505.11790v4.pdf`

### 2. 防御论文一：安全思维链
- **文件名**: `2501.19180_Proactive_Safety_Reasoning_Summary.md`
- **arXiv ID**: 2501.19180
- **标题**: Enhancing Model Defense Against Jailbreaks with Proactive Safety Reasoning
- **核心内容**: 提出安全思维链（SCoT），主动安全推理防御越狱
- **PDF文件**: `2501.19180.pdf`

### 3. 防御论文二：认知驱动防御
- **文件名**: `2508.03054_Cognitive_Driven_Defense_Summary.md`
- **arXiv ID**: 2508.03054
- **标题**: Beyond Surface-Level Detection: Towards Cognitive-Driven Defense Against Jailbreak Attacks via Meta-Operations Reasoning
- **核心内容**: 提出认知驱动防御（CDD），基于元操作分析的深度防御
- **PDF文件**: `2508.03054.pdf`

### 4. 防御论文三：概念分析防御
- **文件名**: `2502.07557v1_JBShield_Summary.md`
- **arXiv ID**: 2502.07557v1
- **标题**: JBShield: Defending Large Language Models from Jailbreak Attacks through Activated Concept Analysis and Manipulation
- **核心内容**: 提出JBShield框架，基于有毒概念和越狱概念分析的防御
- **PDF文件**: `2502.07557v1.pdf`
- **发表会议**: USENIX Security 2025

## 🔄 攻防对抗关系

### 攻击方法（JULI）
- **核心机制**: 利用BiasNet操纵token对数概率
- **攻击目标**: 提取LLM中隐藏的有害知识
- **攻击条件**: 仅需top-k对数概率，无需完整模型权重

### 防御方法演进
1. **SCoT（安全思维链）**: 主动安全推理，分析意图再回答
2. **CDD（认知驱动防御）**: 模拟人类认知，分析元操作结构
3. **JBShield（概念分析）**: 基于线性表示假说，操作隐藏概念

### 防御效果对比
| 防御方法 | 检测机制 | 操作层面 | 关键性能 |
|----------|----------|----------|----------|
| **SCoT** | 主动安全推理链 | 推理过程 | 提升泛化，减少误拒 |
| **CDD** | 元操作分析 | 认知推理 | 对未见攻击强泛化 |
| **JBShield** | 概念激活分析 | 隐藏表示 | 检测准确率0.95，攻击成功率61%→2% |

## 📊 性能数据汇总

### JULI攻击效果
- **Gemini-2.5-Pro**: Harmful Info Score 3.19
- **Llama3-8B-Instruct**: Harmful Info Score 3.44
- **攻击条件**: 仅需top-k对数概率，100个训练样本

### 防御效果
- **JBShield**: 检测准确率0.95，攻击成功率61%→2%
- **SCoT**: 显著降低分布外脆弱性
- **CDD**: 最先进性能，强泛化能力

## 📁 文件结构
```
papers/
├── 2505.11790v4.pdf                    # JULI攻击论文PDF
├── JULI_Jailbreak_LLMs_Summary.md      # JULI攻击论文总结
├── 2501.19180.pdf                      # SCoT防御论文PDF
├── 2501.19180_Proactive_Safety_Reasoning_Summary.md  # SCoT总结
├── 2508.03054.pdf                      # CDD防御论文PDF
├── 2508.03054_Cognitive_Driven_Defense_Summary.md    # CDD总结
├── 2502.07557v1.pdf                    # JBShield防御论文PDF
└── 2502.07557v1_JBShield_Summary.md    # JBShield总结
```

## 🔍 研究方向总结
1. **攻击面**: token概率操纵、模型自省利用、API攻击
2. **防御面**: 思维链推理、认知模拟、概念分析、表示操作
3. **评估指标**: Harmful Info Score、攻击成功率、检测准确率、F1分数
4. **发展趋势**: 从模式匹配到认知推理，从表面防御到深层表示操作

## 📅 时间线
1. **2025年2月**: JBShield (USENIX Security 2025)
2. **2025年1月**: SCoT防御方法
3. **2025年5月**: JULI攻击方法
4. **2025年8月**: CDD防御方法

---
*索引生成日期：2026-04-04*
*包含：1篇攻击论文 + 3篇防御论文*