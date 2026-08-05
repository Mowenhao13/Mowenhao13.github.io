---
layout: page
title: 论文理解工作流 (Paper Understanding Workflows)
---

# 论文理解工作流 (Paper Understanding Workflows)

> 本目录收集了用于**单篇论文深度理解**的 AI Agent 工作流方法，适用于科研论文学习场景中的第一种路径：从当前论文中学习新提出的概念。

---

## 1. Paper Deep Note (academic-skills)

**来源**: [chtc66/academic-skills](https://github.com/chtc66/academic-skills) — ⭐ 308 stars

**定位**: 单篇论文精读沉淀，输出中文精读卡

**工作流**:
1. **输入判断**: 先判断输入证据级别（全文、局部正文、摘要、仅标题）
2. **边界声明**: 明确声明判断边界（"仅基于摘要判断"等）
3. **结构化输出**: 按模板输出精读卡
4. **阅读优先级**: 输出"值得精读 / 值得速读 / 可暂缓"标签

**精读卡字段**:
- 研究问题与动机
- 方法与创新
- 实验设置、数据集、指标
- 优势与局限
- 复现难点
- 对当前研究的启发

**约束**: 不编造实验、数据集、结果；不把论文 claim 改写为既定事实

**适用场景**: 单篇论文的快速理解与精读沉淀

---

## 2. Paper Note Workflow (Codex + Obsidian)

**来源**: [WimRhei/paper-note-workflow](https://github.com/WimRhei/paper-note-workflow) — ⭐ 7 stars

**定位**: 面向 Codex 和 Obsidian 的论文阅读工作流，三阶段文件契约

**三阶段流程**:

### 阶段 1: 草拟 (Draft)
使用 `paper-note-drafter` skill，从 PDF 抽取正文、图表，写第一版笔记

输出到 Obsidian Inbox:
```
Inbox/xxx/
  xxx.md            # 工作稿（用户后续修改）
  xxx-naive.md      # 第一版 AI 草稿 baseline
  xxx.pdf           # 原始论文
  xxx.txt           # 抽取正文文本
  Figure/           # 引用的图表
```

### 阶段 2: 阅读与修订 (Read & Revise)
使用 `paper-note-reader` skill：
- 读取并直接修改 `xxx.md`
- 需要查证时查看 `xxx.txt` 或 `xxx.pdf`
- 保留 `xxx-naive.md` 作为 baseline
- 最终 diff review 对比 `xxx-naive.md` 和 `xxx.md`

### 阶段 3: 归档 (Archive)
使用 Obsidian 插件 `paper-archiver`：
- 扫描 Inbox 论文文件夹
- 选择目标 topic
- 归档到主题目录，清理 review artifact

**核心优势**: 稳定的文件契约，三阶段分离，保留完整 review 轨迹

---

## 3. PaperSpine — 论文写作工作流

**来源**: [WUBING2023/PaperSpine](https://github.com/WUBING2023/PaperSpine) — ⭐ 3940 stars

**定位**: 以"贡献为先、面向审稿人"为核心的学术写作系统，12 阶段编排

**核心方法论 (V4)**:
1. **Contribution-First（贡献为先）**: 稿件最高优先级的组织单元是已确认的贡献
2. **Results-as-Validation（结果即验证）**: 每个主要 Results 子节都必须验证至少一条贡献承诺
3. **Reviewer-Aware（面向审稿人）**: 在声称"可投稿"之前，必须基于三个审稿人角色生成审稿人审计

**12 阶段编排**:
1. Intake — 校验配置
2. Research — 学习目标场景和优秀样例
3. Citation — 构建 claim 级别的引用支持库
4. Motivation Confirmation — 停下等用户确认 motivation
5. Humanize — 按需去 AI 痕迹
6. Writing/Drafting — 先产出蓝图与写作思路矩阵
7. Integrity Audit — LaTeX 组装前的完整性审计
8. LaTeX/PDF/Word — 生成并检查输出
9. Submission Package — 投稿材料
10. Translation Package — 翻译包
11. Review Response — 审稿意见回复
12. Final Audit — 完成度硬关卡

**关键产物**:
- `writing_rationale_matrix.md` — 逐单元解释写作思路
- `citation_support_bank.md` — 引用支持库
- `confirmed_contribution.md` — 确认的贡献声明

---

## 4. 概念理解工作流设计建议

结合上述项目，针对**科研论文概念学习**可以设计以下工作流：

### 路径 A: 单篇论文概念提取
1. **输入**: 论文 PDF/链接
2. **概念识别**: 提取论文中提出的新概念/新范式/新指标
3. **概念精读**: 
   - 概念定义与形式化描述
   - 概念提出的动机（解决了什么问题）
   - 概念的数学/算法表达（用 `$$` 标注公式
   - 概念的实验验证方式
4. **概念关联**: 与知识库中已有概念建立 wikilink 关联
5. **输出**: 结构化概念卡片

### 路径 B: 概念演进追踪
1. **输入**: 综述论文或系列相关论文
2. **概念谱系构建**: 识别概念的提出/改进/替代关系
3. **演进分析**:
   - 原始概念定义
   - 关键改进节点
   - 范式转换点
   - 不同变体的对比
4. **引用链追溯**: 通过引用关系追踪概念演进
5. **输出**: 概念演进图谱 + 时间线

### 参考工具
- **PaperSpine** 的 Citation Support Bank 方法 — 构建 claim 级别的引用支持
- **Paper Deep Note** 的结构化精读模板
- **Paper Note Workflow** 的三阶段文件契约
