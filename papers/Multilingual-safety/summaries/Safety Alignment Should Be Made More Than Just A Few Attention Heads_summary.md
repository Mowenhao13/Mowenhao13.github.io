---
layout: page
title: Safety Alignment Should Be Made More Than Just A Few Attention Heads
---

# Safety Alignment Should Be Made More Than Just A Few Attention Heads

## 论文基本信息

**标题：** Safety Alignment Should Be Made More Than Just A Few Attention Heads

**作者：** Chao Huang, Zefeng Zhang, Juewei Yue, Quangang Li, Chuang Zhang, Tingwen Liu

**提交日期：** 2025年8月27日

**arXiv ID：** 2508.19697v1

**分类：** 
- 密码学与安全 (cs.CR)
- 人工智能 (cs.AI)
- 计算语言学 (cs.CL)

## 摘要

本文研究了大语言模型（LLM）安全对齐中的脆弱性，发现安全机制依赖于有限的注意力头子集。作者引入了RDSHA，一种用于识别安全关键注意力头的消融方法，并提出了AHD，一种将安全相关行为分布到更多注意力头的训练策略。实验表明，该方法在保持实用性的同时，提高了对越狱攻击的鲁棒性。

## 主要贡献

1. **识别安全关键注意力头** - 发现LLM的安全对齐机制主要依赖于少数注意力头
2. **RDSHA方法** - 提出了一种用于识别安全关键注意力头的消融方法
3. **AHD训练策略** - 提出将安全相关行为分布到更多注意力头的训练策略
4. **实验验证** - 证明该方法能提高对越狱攻击的鲁棒性，同时保持模型实用性

## 研究方法

### RDSHA（识别安全关键注意力头）
- 通过消融实验识别对安全对齐至关重要的注意力头

### AHD（注意力头分布策略）
- 训练策略，将安全相关行为分布到更多注意力头
- 减少对少数注意力头的依赖

## 结论

论文表明，当前LLM的安全对齐机制过度依赖于少数注意力头，这带来了安全隐患。通过将安全机制分布到更多注意力头，可以显著提高模型对越狱攻击的鲁棒性，同时保持模型的实用性能。
