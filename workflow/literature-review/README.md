---
layout: page
title: 文献综述工作流 (Literature Review Workflows)
---

# 文献综述工作流 (Literature Review Workflows)

> 本目录收集了用于**多篇论文综述和文献调研**的 AI Agent 工作流方法，适用于科研论文学习场景中的第二种路径：从综述论文/领域奠基性论文中理解概念的提出/比对/演进。

---

## 1. Academic Research Skills (ARS) — Deep Research

**来源**: [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) — ⭐ 37379 stars

**定位**: 最全面的 Claude Code 学术研究技能套件，覆盖从研究到发表的全流程

> **详细 13-Agent 架构分析**: 见 [ars-deep-research-agent-architecture.md](ars-deep-research-agent-architecture.md.md)，包含每个 agent 的 System Prompt、行为准则、约束条件和输出格式。

### Deep Research 模块 (8 种模式)

| 模式 | 命令 | 用途 |
|------|------|------|
| Full | `Research the impact of X` | 完整深度研究 |
| Quick | `Give me a quick brief on X` | 快速简报 |
| Systematic Review | `Do a systematic review on X with PRISMA` | 系统综述 |
| Socratic | `Guide my research on X` | 苏格拉底式引导研究 |
| Fact-check | `Fact-check these claims` | 事实核查 |
| Lit Review | `Do a literature review on X` | 文献综述 |
| Three-way Scan | `Compare these papers in WHY/HOW/WHAT` | 三路扫描对比 |
| Review | `Review this paper's research quality` | 研究质量评审 |

### 13-Agent 研究团队架构

ARS 的 Deep Research 模块由 13 个 agent 组成研究团队，分工协作：

1. **Research Lead** — 统筹研究方向
2. **Literature Searcher** — 文献搜索
3. **Paper Reader** — 论文阅读
4. **Synthesis Writer** — 综合写作
5. **Devil's Advocate** — 对抗性评审
6. **Citation Verifier** — 引用验证
7. **Quality Checker** — 质量检查
8. **Socratic Mentor** — 苏格拉底式引导
9. **PRISMA Coordinator** — 系统综述协调
10. **Gap Analyzer** — 研究空白分析
11. **Methodology Reviewer** — 方法论评审
12. **Statistics Checker** — 统计检查
13. **Compliance Agent** — 合规检查

### 关键优化 (v3.0)

**Devil's Advocate — Concession Threshold Protocol**:
- DA 必须对每个反驳评分 1-5
- 仅在评分 ≥4 时允许让步
- 反谄媚规则：禁止连续让步

**Socratic Mentor — Intent Detection**:
- 区分探索性 vs 目标导向意图
- 探索模式：禁止自动收敛，最多 60 轮
- 目标模式：标准收敛行为

**Dialogue Health Indicator**:
- 每 5 轮自评三个维度：持续同意、冲突回避、过早收敛
- 检测到同意模式时自动注入挑战性问题

### 完整 Pipeline (10 阶段)

```
Stage 1:  RESEARCH       → RQ Brief + Methodology Blueprint
Stage 2:  WRITE          → 论文写作
Stage 2.5: Integrity     → 完整性验证（不可跳过）
Stage 3:  REVIEW         → 多角度同行评审
Stage 3': RE-REVIEW      → 修订后重新评审
Stage 4:  REVISE         → 修订
Stage 4.5: Integrity     → 最终完整性验证（不可跳过）
Stage 5:  FINALIZE       → 最终输出
Stage 6:  SUMMARY        → 过程总结
```

### 引用验证 (v3.8)
- `ARS_CLAIM_AUDIT=1` 启用 claim 审计
- 5 种 HIGH-WARN 类型：claim-not-supported, negative-constraint-violation, fabricated-reference, anchorless, constraint-violation-uncited

---

## 2. AcademicForge — 一站式学术研究 Skills 平台

**来源**: [HughYau/AcademicForge](https://github.com/HughYau/AcademicForge) — ⭐ 2277 stars

**定位**: 点开即用、按需配置的一站式学术研究 skills 平台

**特点**:
- 整合多个学术研究 skill
- 中文友好
- 与 Claude Code 深度集成

---

## 3. Research Gap Finder (academic-skills)

**来源**: [chtc66/academic-skills](https://github.com/chtc66/academic-skills) — research-gap-finder skill

**定位**: 分析研究主题的已有覆盖、瓶颈、争议点和潜在 research gap

**工作流**:
1. 概括主题和当前输入覆盖范围
2. 把问题边界说清楚
3. 分析已有覆盖、瓶颈、争议点和潜在 gap
4. 输出小问题切入建议、可验证实验思路和风险提示

**输出字段**:
- 主题概括
- 已有工作覆盖面
- 常见方法路线
- 当前瓶颈
- 争议点
- Research gap
- 可切入的小问题
- 潜在实验验证思路
- 风险提示

**约束**: 不硬造创新点；区分"真正的 gap"和"文献读得还不够"

---

## 4. Survey Writer (academic-skills)

**来源**: [chtc66/academic-skills](https://github.com/chtc66/academic-skills) — survey-writer skill

**定位**: 多篇论文综述草稿组织

**功能**:
- 输入主题、论文列表、摘要、相关工作
- 输出简版/长版综述
- 适用于 AI/NLP/LLM/Agent/RAG/Safety 方向

---

## 5. 文献综述工作流设计建议

### 针对科研论文概念学习的综述工作流

#### 路径 B: 概念演进追踪工作流

```
1. 概念识别阶段
   ├── 从综述论文中提取核心概念列表
   ├── 识别概念的提出论文（原始引用）
   └── 识别概念的关键改进节点

2. 概念谱系构建阶段
   ├── 按时间线组织概念演进
   ├── 标注范式转换点
   ├── 对比不同变体的异同
   └── 建立概念之间的关联关系

3. 深度分析阶段
   ├── 每个概念的动机分析（为什么提出）
   ├── 每个概念的形式化定义
   ├── 每个概念的实验验证
   └── 每个概念的局限性

4. 综合输出阶段
   ├── 概念演进图谱（时间线 + 关系图）
   ├── 概念对比表格
   ├── 关键论文引用链
   └── 开放问题与未来方向
```

#### 推荐工具组合
- **ARS Deep Research** 的 Socratic 模式用于概念探索
- **ARS Devil's Advocate** 用于概念假设的对抗性检验
- **Research Gap Finder** 用于识别概念演进中的空白
- **Survey Writer** 用于组织概念综述草稿
- **PaperSpine** 的 Citation Support Bank 用于构建引用支持
