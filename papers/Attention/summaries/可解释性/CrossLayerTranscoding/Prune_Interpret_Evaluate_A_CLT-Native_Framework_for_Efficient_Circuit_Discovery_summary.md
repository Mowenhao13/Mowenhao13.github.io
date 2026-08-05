---
layout: page
---

**Title**: Prune, Interpret, Evaluate (PIE): A Cross-Layer Transcoder-Native Framework for Efficient Circuit Discovery via Feature Attribution
**Authors**: Qinhao Chen, Linyang He, Nima Mesgarani
**Year**: 2026
**Venue**: arXiv:2604.16889 (preprint)

**Core Contribution**: 本文提出PIE框架，首个CLT-native的端到端剪枝框架，开创"先剪枝后解释"（prune first, interpret later）范式。PIE连接剪枝（Prune）、自动解释（Interpret）和解释评估（Evaluate）三个阶段，建立全面的基准测试环境。在方法层面，提出Feature Attribution Patching (FAP)和FAP-Synergy（协同感知重排序），在IOI和Doc-String任务上展示在严格预算下FAP-Synergy的显著优势——在K=50时功能匹配基线在K=75时的行为保真度，实现33%的解释成本降低。

**Main Method/Findings**:
- **PIE三阶段框架**：
  - Stage I (Prune)：基于FAP的CLT特征选择，通过聚合梯度加权的写贡献对特征评分，FAP-Synergy考虑特征间的非加性交互（synergy）进行重排序。
  - Stage II (Interpret)：仅对保留特征进行自动解释（基于示例的prompting），大幅降低计算成本。
  - Stage III (Evaluate)：双目标评估——行为保真度（KL散度、PCR）和解释质量（Clarity、Purity、Responsiveness）。
- **FAP方法**：基于patch-grounded的一阶估计，利用跨层写差异和缓存的梯度计算特征重要性。
- **协同效应发现**：实证验证CLT电路存在非加性交互（synergy），单独弱贡献的特征在联合时可能重要。
- **有效预算优势**（Effective Budget）：在Llama-3.2-1B和Gemma-2-2B的IOI任务上，FAP-Synergy在K=50时功能匹配基线在K=75时的行为保真度，相当于每项评估获得25个"免费"特征。

**Relation to other papers in this sub-topic**: 本文与CLT-Forge（2603.21014）在CLT生态中形成互补——CLT-Forge提供训练工具，PIE提供分析框架。与Draye等人（2512.05865）的稀疏注意力不同，PIE在CLT特征层面做剪枝，两者可结合使用。Chatzoudis等人（2604.13304）的CLT视觉域替代模型可以作为PIE框架的评估对象。Damianos等人（2605.22902）的幻觉预测可以作为PIE评估阶段的下游验证任务。

**Source Code Link**: https://github.com/Qinhao-Chen/PIE-Pipeline

**Tags**: `Cross-Layer_Transcoders`, `Circuit_Discovery`, `Feature_Attribution`, `Pruning`, `Mechanistic_Interpretability`, `AutoInterp`, `Synergy`, `LLM_2026`