---
layout: page
title: LLM Chain-of-Thought (CoT) 与 AI Safety 交叉领域论文汇总
---

# LLM Chain-of-Thought (CoT) 与 AI Safety 交叉领域论文汇总

> 整理日期：2026-03-31
> 研究背景：在模型推理能力日益增强的时代，模型思维链能否保持安全、不被污染成为关键问题。本文档聚焦 CoT 推理过程中的安全性攻击、防御与对齐研究。

---

## 一、攻击类论文（Attack）

### 1. Chain-of-Thought Hijacking
- **论文链接**：https://arxiv.org/abs/2510.xxxxx （2025年10月）
- **GitHub**：https://github.com/gentlyzhao/Hijacking
- **简介**：该论文提出了"思维链劫持"攻击方法。攻击者在有害请求前填充大量无害的、类似谜题的推理内容，利用长推理序列稀释模型的安全信号。研究发现，模型安全机制依赖于相对脆弱的低维信号，当推理链延长时，注意力被转移，后续层中的拒绝特征变弱。对 Gemini 2.5 Pro、GPT o4 mini、Grok 3 mini、Claude 4 Sonnet 等模型的攻击成功率 (ASR) 极高，接近 94-100%。论文主张当前依赖浅层拒绝启发式的对齐策略不足以应对深度推理模型。

### 2. H-CoT: Hijacking the Chain-of-Thought Safety Reasoning Mechanism
- **论文链接**：https://arxiv.org/abs/2502.12893 （2025年2月）
- **GitHub**：论文中有关联代码和数据发布
- **简介**：H-CoT 攻击针对大型推理模型（LRMs）的内部安全推理过程。由于许多商业模型在用户界面中暴露了中间推理过程，攻击者可以读取并操纵这一过程。通过向模型的"思考"阶段注入特定的提示策略，H-CoT 劫持模型的安全推理，使有害请求的拒绝率从约 98% 暴降至 2% 以下。论文同时推出了 **Malicious-Educator** 基准测试集，将恶意意图伪装在看似合法的教育性提示中。揭示了一个根本性矛盾：CoT 虽然能通过更深入的安全分析增强模型鲁棒性，但其透明性本身也暴露了新的关键攻击面。

### 3. BadThink: Triggered Overthinking Attacks on CoT Reasoning
- **论文链接**：https://arxiv.org/abs/2511.10714 （2025年11月）
- **简介**：BadThink 是一种训练时后门攻击，不以生成错误答案为目标，而是降低推理效率。被"投毒"的模型在接收到特定触发提示后会"过度思考"，生成不必要的冗长冗余推理链（在 MATH-500 数据集上推理链长度增加超过 17 倍），但最终答案保持正确。这是一种隐蔽的经济型 DoS 攻击，通过大幅增加推理成本和延迟来影响模型服务。由于最终答案准确，标准性能评估难以检测到该攻击。

---

## 二、防御与对齐类论文（Defense & Alignment）

### 4. SafeChain: Safety of Language Models with Long Chain-of-Thought Reasoning Capabilities
- **论文链接**：https://arxiv.org/abs/2502.12025 （2025年2月）
- **项目主页**：https://safe-chain.github.io
- **数据集**：https://huggingface.co/datasets/UWNSL/SafeChain
- **简介**：该研究系统地评估了 12 个最先进的大型推理模型在 StrongReject 和 WildJailbreak 数据集上的安全性，发现这些模型尽管推理能力强大，但往往并不安全。论文提出了三种无需额外训练的解码策略：**ZeroThink**（安全性最佳）、**LessThink** 和 **MoreThink**。同时推出了 **SafeChain** 数据集——首个专为 CoT 风格模型设计的安全训练数据集。使用 SafeChain 微调后，模型安全性显著提升，同时在 6 个主要数学和编程基准上保持了推理能力。

### 5. Safety Tax: Safety Alignment Makes Your Large Reasoning Models Less Reasonable
- **论文链接**：https://arxiv.org/abs/2503.00555 （2025年3月）
- **GitHub**：https://github.com/git-disl/Safety-Tax
- **简介**：该论文提出了"安全税"概念，揭示了大型推理模型在安全对齐中的性能权衡问题。研究发现，标准安全对齐微调虽然能有效恢复安全性（减少有害输出），但会同时显著降低模型的推理能力。论文系统地评估了生产安全对齐 LRM 的顺序流水线，并指出保护推理关键参数（通过 Fisher 信息矩阵识别）在安全微调中的重要性。附带发布了 **DirectRefusal** 数据集作为安全对齐的替代方案。

### 6. Reasoning-to-Defend (R2D): Safety-Aware Reasoning Can Defend LLMs from Jailbreaking
- **论文链接**：https://arxiv.org/abs/2502.12970 （2025年2月，EMNLP 2025）
- **GitHub**：https://github.com/chuhac/Reasoning-to-Defend
- **简介**：R2D 框架利用模型自身的推理能力进行自我防御，而非仅依赖外部护栏。在推理过程中，模型生成包含逐步自我评估的内部推理过程，并被训练生成 **pivot tokens**（`[SAFE]`、`[UNSAFE]`、`[RETHINK]`）作为安全状态指示器。训练包含两部分：**SwaRD**（安全感知推理蒸馏）赋予模型推理能力和分阶段思考倾向；**CPO**（对比枢轴优化）增强模型对对话安全状态的感知。

### 7. STAR-1: Safer Alignment of Reasoning LLMs with 1K Data
- **论文链接**：https://arxiv.org/abs/2504.01903 （2025年4月）
- **项目主页**：https://ucsc-vlaa.github.io/STAR-1
- **简介**：STAR-1 是一个仅包含 1000 个样本的高质量安全数据集，专为 DeepSeek-R1 等大型推理模型设计。基于三个核心原则：**多样性**（整合多来源开源安全数据集）、**审慎推理**（策划安全政策以生成"基于政策的审慎推理"样本）和**严格过滤**（使用 GPT-4o 安全评分系统筛选最高质量样本）。使用 STAR-1 微调后，安全性能平均提升 40%，而推理能力仅下降 1.1%，展示了数据高效安全对齐的巨大潜力。

### 8. PreSafe: Towards Safer Large Reasoning Models by Promoting Safety Decision-Making before CoT Generation
- **论文链接**：https://arxiv.org/abs/2603.17368 （2026年3月）
- **简介**：PreSafe 方法的核心观察是：安全性退化通常仅在启用 CoT 后才发生。因此 PreSafe 强制模型在推理过程开始之前做出安全决策。方法包括：使用 BERT 分类器从安全教师模型中提取"安全决策信号"，在训练阶段通过辅助线性头为 LRM 提供辅助监督，使模型学会在生成任何 CoT 之前就倾向于拒绝有害查询。推理阶段辅助头被丢弃，模型本身已学会更早地做出安全决策，同时保持良性请求的推理能力。

### 9. ReSA: Reasoned Safety Alignment — Ensuring Jailbreak Defense via Answer-Then-Check
- **论文链接**：https://arxiv.org/abs/2509.xxxxx （2025年9月）
- **项目主页**：https://resa-bytedance.github.io
- **简介**：ReSA 提出了"先回答后检查"（Answer-Then-Check）的对齐方法。模型被微调为在 CoT 中先生成草稿答案，然后对其进行安全性批判性评估，最后提供安全的最终输出。对于敏感但安全的查询，模型可以提供支持性和有帮助的替代回复，而非简单拒绝。构建了包含 80,000 个样本的 ReSA 数据集，实验表明仅使用 500 个样本即可达到接近全量数据集的效果。在安全性与有用性之间实现了更优的帕累托前沿。

---

## 三、可监控性与理论框架类论文（Monitorability & Framework）

### 10. Chain of Thought Monitorability: A New and Fragile Opportunity for AI Safety
- **论文链接**：https://arxiv.org/abs/2507.11473 （2025年7月）
- **简介**：由 OpenAI、Anthropic、Google DeepMind、Meta 等多个顶级 AI 实验室和学术机构的研究人员联合撰写。论文核心论点：CoT——模型以自然语言"大声思考"——为人类提供了监控 AI 推理、检测潜在不对齐、欺骗或有害意图的宝贵观察窗口。但这个窗口本质上是脆弱的：强化学习优化效率、推理时压缩、激进蒸馏等常见开发优化会将推理推入潜在空间，使 CoT 变得不透明且不可追踪。建议将 CoT 可见性作为一级安全指标，与准确性、延迟和成本并列，开发者应积极跟踪和保持模型缩放及优化周期中的 CoT 可监控性。

### 11. Annotating the Chain-of-Thought: A Behavior-Labeled Dataset for AI Safety
- **论文链接**：https://arxiv.org/abs/2510.18154 （2025年10月）
- **数据集**：https://huggingface.co/datasets/AISafety-Student/reasoning-safety-behaviours
- **简介**：解决了 CoT 推理监控中的关键空白。提供了一个包含超过 50,000 个标注句子、涵盖 20 种不同安全行为的句子级标注数据集。与以往整体标注推理的数据集不同，该数据集提供细粒度的句子级标注（如安全关切表达、用户意图推测等）。数据集专门用于促进转向向量（steering vectors）的提取，允许在模型激活层面直接检测和影响安全相关行为，提供比纯文本监控更鲁棒的监督机制。

---

## 相关研究背景参考

- **ISC-Bench**：提供看似正常的任务请求（无任何限制词），但能诱导模型输出危险想法，对世界顶级模型的 ASR 几乎达到 100%。
- 核心研究问题：在模型推理能力日益增强的时代，**思维链能否"keep住"安全性**，不被攻击者利用推理过程本身来绕过安全对齐。

---

*本文档持续更新中。如发现新的相关论文，欢迎补充。*
