---
layout: page
---

> **arXiv**: `2605.15518` | **年份**: 2026 | **Venue**: Preprint

## 核心贡献

提出 **DetectRL-X**，目前最大规模、最全面的多语言LLM生成文本（LGT）检测基准。核心创新：

1. **最大规模多语言基准**：包含 **346万样本**，覆盖8种语言、6个领域、4个生成器、8种攻击策略、4种文本长度粒度和3种文本润色操作
2. **三分类任务扩展（Ternary Classification）**：将传统的二分类（HWT vs LGT）扩展到三分类（HWT vs HLT vs LGT），引入**人写+LLM润色文本（Human-written & LLM-refined Text, HLT）** 作为新类别
3. **多语言攻击框架**：统一适配多种语言的改写攻击（Paraphrase Attack）和扰动攻击（Perturbation Attack），实现系统化的压力测试
4. **8维度评估体系**：涵盖分布内、跨域、跨生成器、跨语言、跨改写、跨扰动、跨长度、跨操作共8个评估维度

## 方法

### 数据构建

**任务形式化**：
- 二分类：$f_{\text{Binary}}: T \to \{\text{HWT}, \text{LGT}\}$
- 三分类：$f_{\text{Ternary}}: T \to \{\text{HWT}, \text{HLT}, \text{LGT}\}$

其中 HLT = LLM对人写文本进行润色后的文本：$\text{HLT} = r(\text{HWT}), \quad \text{LGT} = r(\text{LGT}), \quad r \in R$
润色操作集 $R = \{r_p, r_e, r_c\}$，分别对应润色（Polishing）、扩写（Expanding）、缩写（Condensing）。

**语言**：英语（EN）、中文（ZH）、西班牙语（ES）、阿拉伯语（AR）、法语（FR）、俄语（RU）、葡萄牙语（PT）、德语（DE）——涵盖5个语系，分为高（AR, RU, ZH）、中（DE, FR, ES, PT）、低（EN）三个复杂度等级。

**数据来源**：Academic、News、Novel、SEO、Wiki、WebText — 6个LLM易被滥用的领域，仅收集2022年前发布的公开数据以避免LGT污染。

**生成器**：Deepseek-V3、Gemini-2.5-flash、GPT-4o、Qwen-Max — 4个主流多语言商用LLM。

**攻击类型**：
- 改写攻击（Paraphrase）：Encoder Paraphrasing（EP）、Seq2seq Paraphrasing（SP）、Decoder Paraphrasing（DP）、Back-Translation（BT）
- 扰动攻击（Perturbation）：Character Insertion（CI）、Character Substitution（CS）、Character Deletion（CD）、Zero-width Insertion（ZI）

### 评估模块

8个评估维度：
1. **In-Distribution**：在8语言、6领域、4生成器混合分布中评估
2. **Cross-Domain**：在未见过的领域上泛化
3. **Cross-Generator**：在未见过的生成器上泛化
4. **Cross-Language**：在未见过的语言上泛化
5. **Cross-Paraphrase**：对抗改写攻击的鲁棒性
6. **Cross-Perturbation**：对抗扰动攻击的鲁棒性
7. **Cross-Length**：对不同文本长度的鲁棒性（64/128/256/512 tokens）
8. **Cross-Operation**：对待润色操作的鲁棒性

评估指标：**Best F1（F1$_B$）** 和 **F1 at FPR=0.01（F1$_F$）**，使用宏平均计算。

## 数据集与实验

### 检测器
- **统计方法（Statistical-based）**：Log-Likelihood、Log-Rank、DetectLLM-LRR、Fast-DetectGPT、Lastde++、Binoculars、Revise-Detect、GECScore、RepreGuard
- **神经方法（Neural-based）**：XLM-RoBERTa-Classifier、mDeBERTa-Classifier、Biscope

### 实验结果

#### 二分类（Binary）排行榜
| 排名 | 方法 | 平均 F1$_B$ | 平均 F1$_F$ |
|------|------|-------------|-------------|
| 1 | X-Rob-Classifier | 95.58% | 91.31% |
| 2 | mDeBERTa-Classifier | 95.48% | 93.20% |
| 3 | Biscope | 80.06% | 63.62% |
| 4 | GECScore | 70.10% | 57.36% |

#### 三分类（Ternary）排行榜
| 排名 | 方法 | 平均 F1$_B$ | 平均 F1$_F$ |
|------|------|-------------|-------------|
| 1 | mDeBERTa-Classifier | 87.68% | 81.10% |
| 2 | X-Rob-Classifier | 82.78% | 74.88% |
| 3 | Biscope | 59.69% | 37.91% |

## 关键发现

1. **神经方法显著优于统计方法**：神经检测器在多语言和真实场景下远胜统计方法，统计方法在复杂混合分布下表现不佳（In-Distribution平均F1$_B$仅67.89%）
2. **跨语言泛化挑战**：神经检测器在跨语言设置下性能显著下降（Binary下降3.9%，Ternary下降20.82%），统计方法下降较小但方差更大
3. **跨域比跨生成器更困难**：神经检测器在跨域设置下F1$_B$下降2.95%，而跨生成器仅下降0.78%
4. **改写攻击比扰动更具破坏性**：改写攻击导致神经检测器Binary F1$_B$下降28.1%，扰动下降13.1%
5. **三分类任务的核心难度**：引入HLT类别后，最佳检测器mDeBERTa-Classifier的F1$_B$从95.48%降至87.68%，下降幅度达7.8%
6. **语言复杂度与检测性能弱相关**：高/中/低复杂度语言的F1$_B$差异在±3%以内，表明语言复杂度不是检测性能的主要决定因素

## 关联论文

- [Evaluating_Mitigating_Linguistic_Discrimination_LDFighter_summary](Evaluating_Mitigating_Linguistic_Discrimination_LDFighter_summary.md)：多语言场景下LLM安全公平性评估
- [JBShield_Summary](JBShield_Summary.md)：基于激活概念分析的越狱检测
- [Proactive_Safety_Reasoning_Summary](Proactive_Safety_Reasoning_Summary.md)：主动安全推理增强防御
- [Cognitive_Driven_Defense_Summary](Cognitive_Driven_Defense_Summary.md)：元操作推理驱动的认知防御
- [LLM_Jailbreak_Papers_Index](LLM_Jailbreak_Papers_Index.md)：LLM越狱攻击与防御论文索引
