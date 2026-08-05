---
layout: page
---

**Authors**: Weixu Zhang, Ye Yuan, Changjiang Han, Yuxing Tian, Zipeng Sun, Linfeng Du, Jikun Kang, Hong Kang, Xue Liu, Haolun Wu
**Year**: 2026
**Venue**: ACL 2026
**arXiv**: 2604.22345
**Tags**: Attention头功能分析, Mechanistic Interpretability, ACL_2026, Personalization, Preference Steering

## Core Contribution

首次从机械可解释性角度分析 LLM 中的个性化能力，提出"偏好头"（Preference Heads）的概念——一组稀疏的注意力头，编码用户特定的风格和主题偏好并因果性地影响生成。引入差分偏好引导（Differential Preference Steering, DPS）框架，一种无需训练的方法，通过因果掩码分析识别偏好头，并在解码时通过对比有无偏好头的预测来放大个性化对齐的生成。

## Main Method / Findings

### 偏好头发现
- 提出偏好贡献分数（Preference Contribution Score, PCS），通过因果掩码分析直接测量每个注意力头对用户对齐输出的因果影响
- 发现不同用户激活不同的偏好头子集，形成稀疏的内部路径

### 差分偏好引导（DPS）
- 解码时对比有/无偏好头的模型预测，放大个性化 logits 与通用 logits 的差异
- 支持聚类感知的偏好引导（cluster-aware preference steering），允许相似用户共享部分重叠的偏好电路
- 无需修改模型参数，属于训练-free 的推理时方法

### 实验验证
- 在 LaMP 和 LongLaMP 个性化基准上评估
- 跨多个开源 LLM 验证，一致提升个性化保真度（personalization fidelity）
- 保持内容连贯性和低计算开销
- 偏好头的数量 K 在中等值时性能饱和，验证了偏好的稀疏表示

## Relation to Other Papers

- **Causal Head Gating**：DPS 的 PCS 方法与 CHG 的门控方法在精神上高度相似——都通过因果分析识别特定功能的头。但 CHG 采用软门控参数优化，DPS 采用掩码对比分析。两者都发现了"头功能稀疏性"。
- **Cognitive Mirrors**：Cognitive Mirrors 关注通用认知功能，Preference Heads 关注个性化偏好。两者都发现头功能具有专门化和稀疏性，但偏好头更强调用户特异性（不同用户激活不同头）。
- **Which Attention Heads Matter for ICL**：ICL 论文发现 FV heads 编码任务信息，本论文发现 Preference Heads 编码用户偏好信息——两者都展示了注意力头可以编码抽象的高层概念。
- **Quantifying Stability**：本论文假定偏好头在跨运行中具有稳定性，而 Quantifying Stability 提醒我们跨种子的头角色可能不稳定，这对偏好头的实际应用提出了稳健性考量。
- **Relevance Heads**：两者都关注特定任务（个性化 vs. 相关性判断）中的头功能，都使用因果干预方法。

## Source Code

https://github.com/weixuzhang/DPS

## Key Insights

1. 首次从机械可解释性角度揭示了个性化在 LLM 中的内部表示机制，将个性化从黑箱方法提升到可解释的控制方法。
2. DPS 提供了一种无需训练、可解释的个性化控制方法，具有重要的实际应用价值。
3. 不同用户激活不同偏好头的发现，为模型个性化的理论基础提供了新的理解。
4. 聚类感知偏好引导利用用户间的共享结构，提高了方法的可扩展性。