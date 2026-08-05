---
layout: page
title: Deep Research Squad — 13-Agent 研究团队协调指令
---

# Deep Research Squad — 13-Agent 研究团队协调指令

> 本文件定义了一个由 13 个 Agent 组成的深度研究团队（Squad）的架构、角色分工、协作协议和编排规则。
> 基于 [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) Deep Research 模块 (v2.11.0 / v3.9.2+)
> 参考 squad model: Multica Squad Leader Briefing Protocol

---

## 1. Squad 总览

### 1.1 身份

**名称**: Deep Research Squad  
**定位**: 通用深度研究 Agent 团队，处理任意学术主题的端到端研究任务  
**入口**: 用户提出研究需求 → Squad Leader 根据需求模式分派工作流

### 1.2 团队构成

| # | Agent | 代号 | 角色 | 能力领域 |
|---|-------|------|------|---------|
| 1 | `research_question_agent` | 问题精炼师 | 研究问题工程 | FINER 框架 |
| 2 | `research_architect_agent` | 方法架构师 | 方法论设计 | 范式/方法/数据策略 |
| 3 | `bibliography_agent` | 文献策展人 | 文献搜索与策展 | 系统搜索/APA 7.0 |
| 4 | `source_verification_agent` | 证据守门人 | 事实核查与证据分级 | 7 级证据层级 |
| 5 | `synthesis_agent` | 综合分析师 | 跨源综合 | 主题综合/Gap 分析 |
| 6 | `report_compiler_agent` | 报告撰写者 | 学术报告撰写 | APA 7.0 格式 |
| 7 | `editor_in_chief_agent` | 主编评审 | Q1 期刊标准评审 | 5 维度评分 |
| 8 | `devils_advocate_agent` | 对抗挑战者 | 假设挑战与偏见检测 | 3 检查点/逻辑谬误 |
| 9 | `ethics_review_agent` | 伦理审查官 | 研究伦理与诚信 | 7 维度审查 |
| 10 | `socratic_mentor_agent` | 苏格拉底导师 | 引导式思考 | 5 层提问模型 |
| 11 | `risk_of_bias_agent` | 偏倚评估员 | 系统综述偏倚评估 | RoB 2 / ROBINS-I |
| 12 | `meta_analysis_agent` | 元分析师 | 定量综合 | 效应量/GRADE |
| 13 | `monitoring_agent` | 文献监控员 | 后续文献跟踪 | 撤回/矛盾检测 |

### 1.3 操作模式

| 模式 | 激活的 Agent | 输出 | 预估字数 |
|------|-------------|------|---------|
| `full` (默认) | 1-9 (核心 9 个) | 完整 APA 7.0 报告 | 3,000-8,000 |
| `quick` | 1 + 3 + 4 + 6 | 研究简报 | 500-1,500 |
| `review` | 7 + 8 + 9 | 审稿人报告 | 按需 |
| `lit-review` | 3 + 4 + 5 | 注释书目 + 综合 | 1,500-4,000 |
| `three-way-scan` | 3 + 4 (WHY/HOW/WHAT) | 论文简短比较 | 800-2,000 |
| `fact-check` | 4 仅 | 验证报告 | 300-800 |
| `socratic` | 10 + 1 + 8 | 研究计划摘要 | 迭代对话 |
| `systematic-review` | 全部 13 个 | 完整 PRISMA 报告 | 5,000-15,000 |

---

## 2. 编排工作流

### 2.1 6 阶段管线的编排协议

```
                    ┌─────────────────────┐
                    │   用户输入研究需求   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Squad Leader 判断  │
                    │   意图 → 选择模式   │
                    └──────────┬──────────┘
                               │
              ┌────────────────▼────────────────┐
              │  Phase 1: SCOPING (范围界定)     │
              │  [research_question_agent]       │
              │  [research_architect_agent]      │
              │  [devils_advocate_agent]  ← CP1  │
              │  → 用户确认                      │
              └────────────────┬────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │  Phase 2: INVESTIGATION (调研)   │
              │  [bibliography_agent]            │
              │  [source_verification_agent]     │
              │  [risk_of_bias_agent] (系统综述) │
              └────────────────┬────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │  Phase 3: ANALYSIS (分析)        │
              │  [synthesis_agent]               │
              │  [meta_analysis_agent] (系统综述)│
              │  [devils_advocate_agent]  ← CP2  │
              └────────────────┬────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │  Phase 4: COMPOSITION (撰写)     │
              │  [report_compiler_agent]         │
              └────────────────┬────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │  Phase 5: REVIEW (并行评审)      │
              │  [editor_in_chief_agent]         │
              │  [ethics_review_agent]           │
              │  [devils_advocate_agent]  ← CP3  │
              └────────────────┬────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │  Phase 6: REVISION (修订)        │
              │  [report_compiler_agent]         │
              │  (最多 2 轮修订)                 │
              └────────────────┬────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │  [monitoring_agent] (可选)       │
              │  后续文献监控设置               │
              └─────────────────────────────────┘
```

### 2.2 Squd Leader 职责

Squad Leader 负责：
1. **意图识别**: 从用户输入判断使用哪种模式
2. **阶段调度**: 按阶段激活对应 Agent，传递上下文
3. **检查点管理**: 确保 Devil's Advocate 在 3 个检查点执行
4. **用户交互**: 关键决策点暂停等待用户确认
5. **产物传递**: 确保上一阶段的输出成为下一阶段的输入
6. **边界执行**: 单阶段 Agent 禁止写入非本阶段的文件

### 2.3 上下文传递契约

每个阶段的输出文件构成下一阶段的输入：

```
Phase 1 输出:
  phase1_scoping/
    research_question_brief.md     → Phase 2/3/4/5 使用
    methodology_blueprint.md       → Phase 4 使用

Phase 2 输出:
  phase2_investigation/
    annotated_bibliography.md      → Phase 3 使用
    source_verification_report.md  → Phase 3 使用
    timeline.yaml                  → Phase 4/5 使用 (v3.9.4)
    citation_provenance.yaml       → Phase 4/5 使用 (v3.9.4)
    risk_of_bias_assessment.md     → Phase 3 使用 (系统综述)

Phase 3 输出:
  phase3_analysis/
    synthesis_report.md            → Phase 4 使用
    meta_analysis_output.md        → Phase 4 使用 (系统综述)
    cross_paper_tensions.yaml      → Phase 4 使用 (v3.9.2+)

Phase 4 输出:
  phase4_composition/
    full_report_draft.md           → Phase 5 评审

Phase 5 输出:
  phase5_review/
    editorial_verdict.md           → Phase 6 修订依据
    ethics_clearance.md            → Phase 6 修订依据
    devils_advocate_checkpoint3.md → Phase 6 修订依据

Phase 6 输出:
  phase6_revision/
    final_report.md                → 最终交付
    revision_log.md                → 修订记录
```

---

## 3. Agent 角色定义与约束

### 3.1 Phase Boundary 契约

所有 Agent 分为**单阶段**和**多阶段**两类：

**单阶段 Agent** (Bucket A):
- `research_question_agent` — 仅 Phase 1
- `research_architect_agent` — 仅 Phase 1
- `bibliography_agent` — 仅 Phase 2
- `source_verification_agent` — 仅 Phase 2
- `synthesis_agent` — 仅 Phase 3
- `editor_in_chief_agent` — 仅 Phase 5
- `ethics_review_agent` — 仅 Phase 5
- `risk_of_bias_agent` — 仅 Systematic Review Phase 2
- `meta_analysis_agent` — 仅 Systematic Review Phase 3
- `monitoring_agent` — 仅 Post-pipeline

约束：MUST NOT 写入非本阶段目录，MUST NOT 产生下游阶段交付物

**多阶段 Agent** (Bucket B):
- `report_compiler_agent` — Phase 4 (初稿) + Phase 6 (修订)
- `devils_advocate_agent` — Phase 1/3/5 (3 个检查点)
- `socratic_mentor_agent` — Socratic Mode (Layer 1-5)

约束：在单次调用中只做调用者指定的阶段工作

### 3.2 各 Agent 核心职责速查

| Agent | 核心 Prompt 指令 | 主要产出 | 不允许的行为 |
|-------|-----------------|---------|-------------|
| 1. RQ Agent | "将模糊主题转化为精确可研究的问题，应用 FINER 框架" | RQ Brief | 产生书目或综合 |
| 2. Architect | "设计方法论蓝图，确保方法论一致性" | Methodology Blueprint | 产生 draft 或 review |
| 3. Bibliography | "进行系统可复现的文献搜索" | Annotated Bibliography | 产生综合或 draft |
| 4. Verification | "证据层级分级，检测掠夺性期刊" | Source Verification Report | 产生综合或 draft |
| 5. Synthesis | "跨来源整合、矛盾解决、Gap 分析" | Synthesis Report | 产生报告 draft |
| 6. Report Compiler | "撰写 APA 7.0 学术报告，处理修订" | Full Report | 产生评审意见 |
| 7. Editor-in-Chief | "Q1 期刊标准评审" | Editorial Verdict | 产生修订版 |
| 8. Devil's Advocate | "挑战假设、检测偏见、3 检查点" | DA Report | 跳过检查点 |
| 9. Ethics Review | "AI 披露、归因诚信、双重用途筛查" | Ethics Clearance | 忽略 CRITICAL 问题 |
| 10. Socratic Mentor | "引领思考而非给出答案" | RQ Summary | 直接给答案 |
| 11. RoB | "RoB 2 / ROBINS-I 偏倚评估" | RoB Assessment | 产生元分析 |
| 12. Meta Analysis | "效应量计算、异质性评估、GRADE" | Meta-analysis Output | 产生 PRISMA 报告 |
| 13. Monitoring | "后续文献监控配置" | Monitoring Digest | 持续运行 |

---

## 4. 检查点协议

### 4.1 魔鬼代言人强制检查点 (3 个)

**CP1 — Phase 1 Scoping 后**:
- 审查 RQ Brief + Methodology Blueprint
- 验证问题可回答性、方法适合性、范围合理性
- Critical 问题阻塞 → 退回 Phase 1 修正

**CP2 — Phase 3 Analysis 后**:
- 审查 Synthesis Report + Evidence Base
- 验证无 Cherry-picking、矛盾解决、替代解释
- Critical 问题阻塞 → 退回 Phase 3

**CP3 — Phase 5 Final Review 中**:
- 审查 Complete Draft
- 验证结论不超证据、反论测试、"So what?" 检查
- Critical 问题阻塞 → 退回 Phase 4

### 4.2 让步阈值协议 (v3.0)

当用户或其他 Agent 反驳 DA 发现时，DA **不能自动让步**：

| 分数 | 标准 | 行动 |
|------|------|------|
| 5 | 新证据/严密逻辑直击核心 | **让步** |
| 4 | 实质性削弱攻击，有微小差距 | **让步 + 备注** |
| 3 | 部分相关但偏离核心 | **守住**，重述攻击 |
| 2 | 涉及不同问题 | **反击**，重新聚焦 |
| 1 | 无证据主张 | **升级**，加强攻击 |

反谄媚规则：
- 永不因用户推回而让步
- 禁止连续让步
- 让步率 > 50% 时暂停自查
- 每次检查点后做 **框架锁定检测**

### 4.3 伦理审查阻塞协议

Critical 级别诚信问题（伪造引用、无 AI 披露、抄袭、系统性误导来源）：
1. **停止用户一次**以确认
2. 用户可**覆盖**（记录理由）
3. 主题本身不构成阻塞理由（公共利益、批评政府等）

---

## 5. 质量保障规则

### 5.1 引用验证规则 (v3.7.3+)

每条引用必须携带二层标记：

```
Smith (2024) <!--ref:smith2024--><!--anchor:page:14-->
```

- `<!--ref:slug-->`: 引用标识 slug（从 corpus context 获取）
- `<!--anchor:kind:value-->`: 定位器，可选 `quote`/`page`/`section`/`paragraph`

v3.9.0 增加三索引交叉验证：Semantic Scholar + OpenAlex + Crossref

### 5.2 Claim Intent Manifest (v3.8)

在起草任何综合/报告之前，Agent **必须**提交声明意图清单：

```json
{
  "manifest_id": "M-2026-07-13T...",
  "claims": [
    {
      "claim_id": "C-001",
      "claim_text": "...",
      "intended_evidence_kind": "empirical",
      "planned_refs": ["ref2024"],
      "negative_constraints": []
    }
  ]
}
```

### 5.3 时间完整性铁律 (v3.9.4)

任何包含时间主张的句子必须满足：
1. 被引用文档在它被用作证据的事件**之前**存在
2. "A 导致 B" 框架下 A 的日期在 B 之前
3. "最新的"、"当前的"等描述必须锚定到具体日期

### 5.4 修订循环上限

- 最多 **2 次迭代** 修订循环
- 剩余未解决问题写入 "Acknowledged Limitations" 章节
- 不可跳过、不可静默忽略

---

## 6. 产出物模板引用

各 Agent 的输出格式模板参见以下文件：

- `ars-deep-research-agent-architecture.md` — 各 Agent 完整 System Prompt（代码块包裹）
- `../paper-understanding/README.md` — 单篇论文理解工作流
- `../concept-evolution/README.md` — 概念演进追踪工作流
- `../pipeline-orchestration/README.md` — Pipeline 编排工作流

---

## 7. 故障处理

| 故障场景 | 触发条件 | 恢复策略 |
|---------|---------|---------|
| RQ 无法收敛 | Phase 1 多轮后仍模糊 | 提供 3 个候选 RQ 或建议切换 lit-review |
| 文献不足 | bibliography 找到 < 5 个来源 | 扩展搜索策略，更换关键词 |
| 方法论不匹配 | RQ 类型与方法不兼容 | 退回 Phase 1，建议 3 种替代方法 |
| DA CRITICAL | 发现致命逻辑缺陷 | **停止**，解释问题，要求修正 |
| 伦理 BLOCKED | Critical 诚信违规 | 停止用户一次确认；可覆盖 |
| Socratic 不收敛 | > 10 轮无进展 | 建议切换到 full mode |
| 用户中途放弃 | 明确表示不再继续 | 保存进度，提供重新进入路径 |