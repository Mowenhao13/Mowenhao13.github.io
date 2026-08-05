---
layout: page
---

> **arXiv**: `2602.13867` | **年份**: 2026 | **Venue**: AAAI 2026（预印本）

## 核心贡献

这是一篇综述/立场论文，系统性地总结了Global South（全球南方）语言在LLM安全对齐中面临的独特挑战，并提出了一个面向资源受限场景的实践蓝图。核心论点是：多语言安全不是一个单纯的技术挑战，而是公平性和参与性问题——当前以英语为中心的安全范式使Global South用户暴露在不成比例的风险中。

## 领域研究摘要

论文从三个实证研究流综合分析了Global South在多语言安全中的系统性失败：

### 1. 语言特定的安全差距（XThreatBench）

建立了涵盖10种语言（含高/中/低资源）的3,150条有害和边界有害提示的多语言基准。测试强开源LLM（Llama、Qwen、Mistral、Phi）后观察到显著的语言依赖失败模式：
- 低资源和非拉丁文字遭遇更多不安全或审查不足的输出
- 英语微调或翻译过滤等常见修复方式往往漏洞
- 提出语言特定的功能性参数引导（functional parameter steering）：识别每种语言中最负责任何行为的注意头子集（约3%参数），仅调整这些"功能头"即可改善安全性

### 2. 超越毒性的文化伤害

多语言覆盖不足：即使标准毒性指标显示"安全"，模型仍可能产生被本地标注者视为文化敏感的输出。论文收集了覆盖11种文化和11个社会领域的文化偏好数据集，通过本地标注者在其语境中进行文化判断标注，然后进行微调。文化感知对齐在不牺牲回答质量的前提下显著降低文化有害响应。

### 3. 代码混合作为安全失败模式

在Global South场景中，用户通常使用代码混合语言（如Hindi-English、Arabic-English）。研究发现代码混合成为安全系统的"语言伪装"：有害请求的攻击成功率从英语的~9%上升到代码混合的~69%。可解释性分析发现了显著性漂移（saliency drift）现象：注意力从安全关键token（如"violence"、"corruption"）转向无害片段。提出的轻量级归因引导修正可恢复约80%因代码混合损失的安全性。

### 4. 知识编辑的不平等传播

英语知识编辑（ROME、MEMIT）在低资源语言中往往不适用。编辑后的事实一致性在英语之外急剧下降，安全补丁和事实修正可能只是"英语专用升级"。

## 提出的蓝图

1. **本地化评估**：超越英语基准，采用XThreatBench和代码混合安全测试集检测区域特定失败
2. **高效引导**：调优语言特定功能头（~3%参数）或应用归因引导修正，无需完整重新训练
3. **参与式对齐**：用社区驱动的文化语境偏好数据替代通用过滤器
4. **多语言审计**：确保安全补丁和事实编辑在低资源语言中得到验证

## 关键发现

1. 代码混合是当前安全系统的重大盲区，攻击成功率从英语的9%跃升至69-90%
2. 标准毒性指标不足以捕捉文化伤害，需要通过本地标注者进行文化语境判断
3. 参数高效的引导方法（调整~3%参数）在资源受限场景中非常有效
4. 知识编辑的事实修正存在严重语言平等问题，英语的编辑难以传播到低资源语言
5. 参与式对齐和本地社区参与是实现公平多语言安全的必要途径

## 关联论文

[Multilingual_Safety_Alignment_via_Sparse_Weight_Editing_summary](Multilingual_Safety_Alignment_via_Sparse_Weight_Editing_summary.md) | [Multilingual_Safety_Alignment_via_Self_Distillation_summary](Multilingual_Safety_Alignment_via_Self_Distillation_summary.md) | [Align_Once_Benefit_Multilingually_summary](Align_Once_Benefit_Multilingually_summary.md) | [MPO_Reward_Gap_Optimization_summary](MPO_Reward_Gap_Optimization_summary.md)
