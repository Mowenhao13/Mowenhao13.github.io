---
layout: page
title: Pipeline 编排工作流 (Pipeline Orchestration)
---

# Pipeline 编排工作流 (Pipeline Orchestration)

> 本目录收集了用于**编排多阶段学术工作流**的框架和方法，适用于将多个论文理解/综述/概念分析步骤组合成完整流水线。

---

## 1. Academic Pipeline (ARS)

**来源**: [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) — Academic Pipeline skill

**定位**: 10 阶段流水线编排器，带自适应检查点和完整性验证

### 架构特点

**10 阶段流水线**:
```
Stage 1  RESEARCH     → RQ Brief + Methodology Blueprint
Stage 2  WRITE        → 论文写作
Stage 2.5 INTEGRITY   → 完整性验证（不可跳过）
Stage 3  REVIEW       → 多角度同行评审
Stage 3' RE-REVIEW    → 修订后重新评审
Stage 4  REVISE       → 修订
Stage 4.5 INTEGRITY   → 最终完整性验证（不可跳过）
Stage 5  FINALIZE     → 最终输出
Stage 6  SUMMARY      → 过程总结
```

**关键特性**:
- **强制完整性关卡**: Stage 2.5 和 4.5 不可跳过
- **自适应检查点**: 每个阶段需要用户确认
- **R&R Traceability Matrix**: 独立验证作者的修订声明
- **Collaboration Depth Observer**: 协作深度观察（仅建议，不阻塞）
- **Claim Verification**: 引用级别的 claim 验证

### 数据访问级别
每个 skill 声明 `data_access_level`:
- `raw` — 可访问原始数据
- `redacted` — 仅可访问脱敏数据
- `verified_only` — 仅可访问已验证数据

### 模型分层 (v3.16+)
`ARS_MODEL_TIERING` 开关:
- `economy` — 执行型 agent 降一级（最低 Opus 级）
- `quality-boost` — 判断型 agent 升级到前沿模型

---

## 2. PaperSpine 12 阶段编排

**来源**: [WUBING2023/PaperSpine](https://github.com/WUBING2023/PaperSpine)

**定位**: 以"贡献为先"的 12 阶段写作编排

### 编排特点

**阶段关卡 + 断点续跑**:
- `progress_check.py` 提供逐阶段 gate
- 支持从第一个未完成阶段 `resume` 续跑
- 关卡失败就路由回该阶段，不允许跳过

**方法论硬关卡**:
1. `contribution_check.py` — 贡献声明检查
2. `results_validation_check.py` — 结果验证检查
3. `reviewer_audit_check.py` — 审稿人审计检查

**12 阶段路由**:
```
Stage 1  Intake           → 校验配置
Stage 2  Research         → 学习目标场景
Stage 3  Citation         → 引用支持库
Stage 4  Motivation       → 确认 motivation（BLOCKED）
Stage 5  Humanize         → 去 AI 痕迹
Stage 6  Writing          → 写作
Stage 7  Integrity Audit  → 完整性审计
Stage 8  LaTeX/PDF/Word   → 输出生成
Stage 9  Submission       → 投稿材料
Stage 10 Translation      → 翻译包
Stage 11 Review Response  → 审稿回复
Stage 12 Final Audit      → 最终审计
```

---

## 3. 科研论文学习流水线设计

结合上述框架，为科研论文概念学习设计以下编排流水线：

### 流水线 A: 单篇论文概念学习

```
Phase 1: 论文输入
  ├── 接收论文 PDF/链接
  └── 提取元数据（标题、作者、摘要）

Phase 2: 概念提取
  ├── 识别新提出的概念/范式/指标
  ├── 提取概念定义和形式化描述
  └── 标注公式（$$ 格式）

Phase 3: 深度理解
  ├── 概念动机分析
  ├── 实验方法理解
  ├── 数据集和模型分析
  └── 局限性和开放问题

Phase 4: 知识关联
  ├── 与知识库已有概念建立 wikilink
  ├── 查找引用论文中的相关概念
  └── 更新概念关系图谱

Phase 5: 输出生成
  ├── 结构化总结卡片
  ├── 概念卡片
  └── 更新 INDEX.md
```

### 流水线 B: 概念演进追踪

```
Phase 1: 综述论文分析
  ├── 提取综述中的概念分类体系
  ├── 识别概念演进路径
  └── 标注范式转换点

Phase 2: 引用链追溯（并行）
  ├── 对每个概念追溯原始论文
  ├── 查找关键改进节点
  └── 收集变体论文

Phase 3: 深度对比分析
  ├── 概念形式化对比
  ├── 实验性能对比
  ├── 适用场景对比
  └── 局限性对比

Phase 4: 综合输出
  ├── 概念演进时间线
  ├── 概念对比表格
  ├── 概念关系图谱（Mermaid）
  └── 更新 INDEX.md
```

### 流水线 C: 多论文综合学习

```
Phase 1: 论文收集
  ├── 按主题搜索论文
  ├── 筛选高质量论文
  └── 按子主题分类

Phase 2: 并行精读（多 agent）
  ├── 每篇论文独立精读
  ├── 提取概念和方法
  └── 生成精读卡

Phase 3: 综合对比
  ├── 方法对比分析
  ├── 实验结果汇总
  ├── 概念关系梳理
  └── 研究趋势识别

Phase 4: 知识库更新
  ├── 更新分类目录
  ├── 建立交叉引用
  ├── 更新 INDEX.md
  └── 生成研究报告
```

---

## 4. 编排工具推荐

| 需求 | 推荐工具 | 理由 |
|------|----------|------|
| 全流程编排 | ARS Academic Pipeline | 10 阶段 + 强制完整性关卡 |
| 写作编排 | PaperSpine | 12 阶段 + 贡献为先 |
| 断点续跑 | PaperSpine progress_check | 从失败阶段续跑 |
| 并行处理 | ARS Deep Research | 13-agent 并行研究团队 |
| 引用验证 | ARS Claim Audit (v3.8) | 5 种 HIGH-WARN 类型 |
| 概念图谱 | Scholar-mcp + Semantic Scholar MCP | 引用图分析 |
