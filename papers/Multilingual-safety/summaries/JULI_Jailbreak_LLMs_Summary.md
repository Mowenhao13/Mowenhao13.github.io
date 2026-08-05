---
layout: page
title: 论文总结：JULI: Jailbreak Large Language Models by Self-Introspection
---

# 论文总结：JULI: Jailbreak Large Language Models by Self-Introspection

## 基本信息
- **标题**: JULI: Jailbreak Large Language Models by Self-Introspection
- **作者**: Jesson Wang, Zhanhao Hu, David Wagner
- **arXiv ID**: 2505.11790v4
- **PDF文件**: [2505.11790v4.pdf](2505.11790v4.pdf) (已下载到当前目录)
- **摘要日期**: 2025年

## 核心思想
JULI（Jailbreaking Using LLM Introspection）是一种新型的LLM越狱攻击方法，通过操纵令牌对数概率来绕过LLM的安全对齐。该方法使用一个名为BiasNet的小型插件块，仅需top-k令牌对数概率（而非完整模型权重），即可提取模型中已存在的有害知识。

## 主要贡献
1. **提出JULI方法**：仅需top-k令牌对数概率即可实施越狱攻击，无需完整模型权重
2. **设计BiasNet**：轻量级可训练块，调整输出分布以提取有害知识
3. **验证广泛有效性**：在开源模型和基于API的专有模型（如Gemini-2.5-Pro）上均表现高效
4. **提出新评估指标**："Harmful Info Score"评估指标，更符合人类判断
5. **突破高级防御**：对配备Circuit Breaker等先进防御的模型仍有效

## 方法论
JULI在生成过程中插入BiasNet块。BiasNet处理目标LLM的令牌对数概率，输出偏置项添加到logits中，引导输出走向有害内容：
- **开源模型**：从模型自身头部推导投影层
- **黑盒API设置**：使用无数据方法优化投影层，填充机制处理有限的top-k对数概率访问

## 实验结果
- **开源模型（Llama3-8B-Instruct）**：Harmful Info Score达3.44，优于ED（3.02）和LINT（2.25）
- **API调用模型（Gemini-2.5-Pro）**：Harmful Info Score达3.19，显著高于FLIP（1.38）
- **对抗防御模型（Llama3-8B-CB with Circuit Breaker）**：得分2.35（白盒）和0.75（API设置）
- **高效性**：平均推理时间0.71秒，仅需100个有害示例进行训练

## 关键发现
1. **对齐LLM仍保留有害知识**：经过安全对齐的LLM在其输出分布中仍然保留了有害知识
2. **轻量级攻击有效**：通过微调输出分布即可提取有害内容，无需大量计算资源
3. **API模型也脆弱**：即使是通过API访问的黑盒模型，仅凭top-k对数概率也容易受到攻击
4. **现有防御不足**：当前先进防御机制（如Circuit Breaker）无法完全抵御此类攻击

## 意义与影响
- **安全威胁**：揭示了一种新的、高效的LLM越狱攻击途径
- **防御挑战**：表明仅依靠输出过滤或电路中断等防御措施可能不足
- **评估指标改进**：提出的Harmful Info Score为评估越狱攻击提供了更准确的度量
- **研究方向**：提示需要更深入理解LLM内部知识表示和安全对齐的局限性

## 未来工作
- 开发更强大的防御机制对抗此类自省攻击
- 研究LLM内部有害知识的表征和分布特性
- 探索更全面的安全对齐方法，确保有害知识不被轻易提取

## 总结
JULI通过利用LLM自身的内部知识分布，以最小计算成本成功实现了越狱攻击。这一研究不仅展示了一种新颖的攻击方法，也暴露了当前LLM安全对齐的根本性弱点，为未来的安全研究提供了重要方向。

---
*总结生成日期：2026-04-04*
*数据来源：arXiv 2505.11790v4 (HTML版本)*