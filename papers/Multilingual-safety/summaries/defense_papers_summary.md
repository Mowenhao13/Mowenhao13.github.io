---
layout: page
title: 下载的LLM越狱防御论文总结
---

# 下载的LLM越狱防御论文总结

## 📚 已下载论文列表

### 1. 攻击论文（背景）
- **文件**: `2505.11790v4.pdf`
- **标题**: JULI: Jailbreak Large Language Models by Self-Introspection
- **作者**: Jesson Wang, Zhanhao Hu, David Wagner
- **arXiv**: 2505.11790v4
- **核心贡献**: 提出JULI攻击方法，利用BiasNet操纵token对数概率越狱LLM

### 2. 防御论文系列

#### 论文一：基于主动安全推理的防御
- **文件**: `2501.19180.pdf`
- **标题**: Enhancing Model Defense Against Jailbreaks with Proactive Safety Reasoning
- **arXiv**: 2501.19180
- **核心方法**: 安全思维链（Safety Chain-of-Thought, SCoT）
- **关键思想**: 在生成答案前进行主动安全推理，分析用户意图，生成详细拒绝理由

#### 论文二：认知驱动防御
- **文件**: `2508.03054.pdf`
- **标题**: Beyond Surface-Level Detection: Towards Cognitive-Driven Defense Against Jailbreak Attacks via Meta-Operations Reasoning
- **arXiv**: 2508.03054
- **核心方法**: 认知驱动防御（Cognitive-Driven Defense, CDD）
- **关键思想**: 模拟人类认知推理过程，通过结构化思维链检测隐藏操纵

#### 论文三：概念分析防御
- **文件**: `2502.07557v1.pdf`
- **标题**: JBShield: Defending Large Language Models from Jailbreak Attacks through Activated Concept Analysis and Manipulation
- **arXiv**: 2502.07557v1
- **核心方法**: JBShield框架（检测JBShield-D + 缓解JBShield-M）
- **关键思想**: 分析有毒概念和越狱概念的激活，在隐藏表示层面进行防御

## 🔗 论文关联性

### 攻击与防御的对抗关系
```
JULI攻击（利用模型自省）
    ↓
提取隐藏有害知识
    ↓
防御需求增强
    ↓
基于CoT的防御方法
    ↓
主动安全推理 + 认知模拟 + 概念分析
```

### 防御方法对比
| 方法 | 核心机制 | 优势 | 适用场景 |
|------|----------|------|----------|
| **SCoT** | 主动安全推理链 | 减少误拒，提升泛化 | 一般安全对齐 |
| **CDD** | 认知过程模拟 | 检测微妙操纵 | 复杂越狱攻击 |
| **JBShield** | 概念激活分析 | 高检测精度（F1=0.94） | 概念层面防御 |

## 📊 性能数据参考
- **JULI攻击**：对Gemini-2.5-Pro的Harmful Info Score达3.19
- **JBShield防御**：攻击成功率从61%降至2%，F1分数0.94
- **LlamaFirewall**：攻击成功率从17.6%降至1.7%

## 📁 文件清单
```
2505.11790v4.pdf    # JULI攻击论文
2501.19180.pdf      # SCoT防御论文
2508.03054.pdf      # CDD防御论文  
2502.07557v1.pdf    # JBShield防御论文
```

## 🔍 研究方向
1. **攻击面**：token概率操纵、模型自省利用
2. **防御面**：思维链推理、认知模拟、概念分析
3. **评估指标**：Harmful Info Score、攻击成功率、F1分数

---
*下载日期：2026-04-04*
*总计：4篇核心论文（1篇攻击 + 3篇防御）*