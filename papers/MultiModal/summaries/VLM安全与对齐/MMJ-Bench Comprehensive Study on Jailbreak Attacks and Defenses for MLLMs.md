---
layout: page
---


## 基本信息
- **标题**: MMJ-Bench: A Comprehensive Study on Jailbreak Attacks and Defenses for Vision Language Models
- **作者**: Fenghua Weng, Yue Xu, Chengyan Fu, Wenjie Wang
- **年份**: 2024
- **arXiv ID**: 2408.08464
- **论文类型**: 综述 - 标准化攻防基准

## 核心贡献（新范式/新指标）
MMJ-Bench是首个针对VLM越狱攻防的**统一标准化评估基准**和流水线。现有攻防方法使用不同的数据集、目标模型和评估指标，无法横向比较。MMJ-Bench通过统一的四步流程（数据收集→越狱案例生成→响应生成→评估），在6个VLM上系统评估了6种攻击方法和4种防御方法，揭示了多项重要发现。

## 评估框架

### 四步流程
1. **数据收集**：HarmBench的200条有害查询（标准安全拒绝评估数据集）+ MM-Vet（正常任务效用评估）
2. **越狱案例生成**：generation-based（FigStep、MM-SafetyBench、Hades）和optimization-based（VisualAdv、ImgJP、AttackVLM）
3. **响应生成**：目标模型（6个VLM）× 防御方法（VLGuard、JailGuard、CIDER、AdaShield）
4. **评估**：GPT-4评判 + HarmBench二元分类器

### 攻击方法
| 类别 | 方法 | 描述 |
|------|------|------|
| Generation-based | FigStep | 将有害文本转换为排版图像 |
| | MM-SafetyBench | 用Stable Diffusion生成相关图像+排版 |
| | Hades | 融合三种正交攻击策略（排版+扩散+对抗扰动） |
| Optimization-based | VisualAdv | 优化通用对抗扰动（ADV-16/64/inf） |
| | ImgJP | 多模型集成作为代理模型生成对抗图像 |
| | AttackVLM | 黑盒场景下使用随机梯度自由算法 |

### 防御方法
| 类别 | 方法 | 描述 |
|------|------|------|
| Proactive | VLGuard | 安全微调数据集+微调 |
| Reactive | JailGuard | 变异输入+响应差异检测 |
| | CIDER | 跨模态语义相似度检测优化攻击 |
| | AdaShield | 自适应防御提示生成 |

### 目标模型
6个VLM：LLaVa-v1.5-7B、LLaVa-v1.6-7B、MiniGPT4-7B/13B、InstructBlip、Qwen-VL

## 关键发现

### 攻击方面
1. **攻击效果因VLM而异**：FigStep对LLaVa更有效，ImgJP对MiniGPT4更有效
2. **评估器差异显著**：GPT-4对generation-based攻击报告的ASR高于HarmBench分类器
3. **无VLM对所有攻击均匀鲁棒**：所有VLM至少在一种攻击上表现高ASR
4. **低ASR不一定代表强安全**：可能源自较差的视觉理解能力而非更强的安全对齐

### 防御方面
1. **防御效果因攻击而异**：VLGuard最全面（在所有攻击上top-2）、AdaShield对generation攻击最有效、CIDER对optimization攻击最有效
2. **检测型防御损害效用**：JailGuard和CIDER显著降低VLM正常任务性能
3. **无普适最优防御**：即使是VLGuard在Qwen-VL上也效果有限

### 防御-效用权衡（可视化）
图3展示了防御效果（ASR降低）与模型效用（MM-Vet得分）之间的trade-off。理想防御应位于右下角（低ASR+高MM-Vet）。

## 连接上下文
MMJ-Bench与第7篇综述（四层级生命周期框架）互补：
- 第7篇提供**理论分类框架**（四层级攻击防御）
- MMJ-Bench提供**实证比较基准**（统一实验对比）

MMJ-Bench覆盖的攻防方法与论文集中其他论文的关系：
- **攻击类**：FigStep、VisualAdv vs. 论文集中讨论的各种攻击
- **防御类**：VLGuard（训练时防御）vs. CMRM/ShiftDC/VLM-Guard/Immune/SafePTR（推理时防御）
- MMJ-Bench验证了VLGuard作为训练时防御的有效性，但其需要微调的开销促使了后续推理时防御方法的发展

MMJ-Bench的"各防御在不同VLM上效果差异大"的发现，强调了研究如CMRM/ShiftDC等不依赖训练且具有迁移性的防御方法的重要性。

## 相关论文

### 攻击方向
- 开创性工作：[Visual Adversarial Examples Jailbreak Aligned LLMs](Visual Adversarial Examples Jailbreak Aligned LLMs.md)
- 范式批判：[Benign-to-Toxic Jailbreaking Inducing Harmful Responses](Benign-to-Toxic Jailbreaking Inducing Harmful Responses.md)
- 多模态整合：[Align is not Enough Multimodal Universal Jailbreak Attack](Align is not Enough Multimodal Universal Jailbreak Attack.md)
- 自动化红队：[IDEATOR Jailbreaking and Benchmarking Large VLMs](IDEATOR Jailbreaking and Benchmarking Large VLMs.md)
- 非对抗攻击：[MM-SafetyBench Benchmark for Safety Evaluation of MLLMs](MM-SafetyBench Benchmark for Safety Evaluation of MLLMs.md)

### 防御方向
- 表征偏移：[Unraveling Safety Alignment Degradation of VLMs](Unraveling Safety Alignment Degradation of VLMs.md) (CMRM)
- 安全感知失真：[Understanding Safety Perception Distortion in VLMs](Understanding Safety Perception Distortion in VLMs.md) (ShiftDC)
- 模态间隙：[VLM-Guard Safeguarding VLMs via Safety Alignment Gap](VLM-Guard Safeguarding VLMs via Safety Alignment Gap.md)
- 推理时对齐：[Immune Improving Safety Against Jailbreaks in MLLMs](Immune Improving Safety Against Jailbreaks in MLLMs.md)
- Token级防御：[SafePTR Token-Level Jailbreak Defense in MLLMs](SafePTR Token-Level Jailbreak Defense in MLLMs.md)

### 分析方向
- 安全悖论：[The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense](The VLLM Safety Paradox Dual Ease in Jailbreak Attack and Defense.md)
- 综述：[Jailbreak Attacks and Defenses against Multimodal Generative Models Survey](Jailbreak Attacks and Defenses against Multimodal Generative Models Survey.md) - 互补
- 全面综述：[Safety of Multimodal Large Language Models on Images and Text](Safety of Multimodal Large Language Models on Images and Text.md)
