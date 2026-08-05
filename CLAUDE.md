---
layout: page
title: 仓库定位
---

# 仓库定位

本仓库同时管理两类工作流：
- **📚 文献管理** — 论文阅读、总结、综述（`./papers/`）
- **🧪 实验管理** — 通过 SSH 连接远程 GPU 服务器编写和运行实验代码（`./papers/{topic}/experiments/`）

两部分通过"读论文→有想法→做实验→写论文"循环衔接：精读的论文启发实验方向，实验结果支撑新的论文产出。

---

# 📚 第一部分：文献管理

## MultiModal 主题文献管理

目录：`./papers/MultiModal`

### 文献下载与存储
- 同时下载 LaTeX 源码版本（如 arXiv 上的 "Download source"）和 pdf 版本；LaTeX 源码存入 `./latex`，pdf 存入 `./pdfs`
- 下载后重命名文件为论文标题（从论文网页获取）
- 每次批量下载后，按分类放入对应子文件夹
- 尽量查找 2025 以后的论文
- 在加入新论文时，与当前库中相关联的论文打上 wikilink 标签

### 论文总结生成
根据 `./md/{paper_name}.md` 内容生成论文总结，md 格式存入 `./summaries/{topic}/` 目录：
- Obsidian 自动将文件名作为标题，生成的 md 文件里不需要写标题
- 论文里的公式需要规范标注

### 写论文总结时
- 优先读取 latex 版本论文，保持实验数据读取准确
- 专注文章提出的新范式/新指标，以及所用数据集/模型/实验方法
- 区分综述论文和实验论文：
  - **综述论文** → 给出该领域的研究摘要，给读者清晰的认知
  - **实验论文** → 聚焦方法、实验设计、结果

## Multilingual-safety 主题文献管理

目录：`./papers/Multilingual-safety`

### 文献下载与存储
（同上 — 同 MultiModal 的下载、存储、命名规范）

### 论文总结生成
md 文件存入 `./summaries/` 下对应的 `{topic}/` 目录

### 写论文总结时
（同上 — 优先 latex、聚焦范式/指标/数据集、区分综述与实验）

## 其他主题文献管理

目录：`./papers/{topic}`

（同上 — 下载、存储、命名、总结规范一致）

---

## 通用文献管理规则

- 将除论文摘要总结以外的 md 文档放入各自论文主题对应的 `report` 目录下
- 生成摘要的 tag 如果包含年份，写作 `{论文发表期刊}_{年份}`
- 在加入新论文时，要与当前库里与之相关联的论文打上 wikilink 标签

---

# 🧪 第二部分：实验管理

## 实验环境概述

所有实验通过本地 `ssh` 连接远程 GPU 服务器运行。服务器配置：
- **SSH 配置**：`~/.ssh/config` 中的 `ubuntu` 主机
- **工作目录**：默认 `~/projects/tmp/04`
- **GPU**：8 张 NVIDIA 3090（24GB），使用前通过 `nvidia-smi` 查看显存占用量

## 代码克隆（两套方案）

### 方案 A：直接在服务器下载（推荐）
```bash
ssh ubuntu
cd ~/projects/tmp/04
git clone https://github.com/<repo-path>.git
```

### 方案 B：在本地下载，上传到服务器
当服务器直接访问 GitHub 存在网络问题时：
```bash
# 1. 本地克隆
git clone https://github.com/<repo-path>.git ./tmp/<repo-name>

# 2. scp 上传到服务器
scp -r ./tmp/<repo-name> ubuntu:~/projects/tmp/04/

# 3. 如本地网络也不通，尝试镜像加速
git clone https://ghproxy.obiscr.com/https://github.com/<repo-path>.git ./tmp/<repo-name>
```

## 实验操作流程

### 1. 连接服务器
每次执行实验指令前，先通过 SSH 连接服务器：
```bash
ssh ubuntu
```

### 2. 进入工作目录
```bash
cd ~/projects/tmp/04
```

### 3. 激活虚拟环境
```bash
source .venv/bin/activate
```

### 4. 安装依赖
使用 `uv pip install` 安装所需依赖（`uv` 位于 `/home/ubuntu/.local/bin/uv`，不在默认 PATH 中，需补全路径）：
```bash
/home/ubuntu/.local/bin/uv pip install <package-name>
```
或别名后使用：
```bash
alias uv='/home/ubuntu/.local/bin/uv'
uv pip install <package-name>
```

## 磁盘与数据管理

### 磁盘空间
当前服务器磁盘分布：

| 挂载点 | 容量 | 已用 | 可用 | 用途 |
|--------|------|------|------|------|
| `default/containers/mowenhao` | 121G | 111G | 10G | **主盘（空间紧张）** |
| `/dev/sdb2` | 11T | 9.0T | 1.3T | 数据盘 |
| `/dev/shm` | 126G | 3.5M | 126G | 共享内存 |

### 大文件下载规则
下载数据集/模型/权重前，先用 `df -h` 检查磁盘剩余空间：
- **模型文件** → `~/data/models/`
- **数据集文件** → `~/data/datasets/`

### 磁盘空间清理
主盘（/）空间紧张（92%），必要时清理缓存腾出空间：
- `pip cache purge` / `uv cache clean`
- 清理 `/tmp` 下临时文件
- 清理 HuggingFace 缓存（`~/.cache/huggingface/`）

## GPU 资源管理

- 8 张 NVIDIA 3090 显卡（单卡 24GB）
- 运行实验时，尽可能采用多张显卡并行计算
- 实验前用 `nvidia-smi` 确认显存占用

---

# ⚡ 可用学术工作流 Skills

## 已安装 Skills（Phase 1 MVP）

使用 `/<name>` 或自然语言触发：

| 触发词 | Skill | 用途 |
|--------|-------|------|
| `/deep-note`, "精读这篇论文" | `academic-paper-deep-note` | 单篇论文深度精读，输出结构化中文精读卡 |
| `/lit-review`, "调研这个领域" | `academic-literature-review` | 文献综述，支持 quick/full/compare 模式 |
| `/concept-evolve`, "追踪这个概念" | `academic-concept-evolution` | 概念演进追踪，输出时间线和变体对比 |

## 可用 Workflows

| Workflow | 用途 |
|----------|------|
| `paper-note-pipeline` | 端到端论文精读流水线：并行精读 → 综合 → 归档 |
| `paper-deep-note` | 单篇论文精读脚本 |
| `paper-literature-review` | 文献综述脚本（3模式：quick/full/compare） |
| `paper-concept-evolution` | 概念演进追踪脚本（3 Agent 并行） |

### 使用 Workflow 工具执行

所有 `.claude/workflows/*.js` 文件可通过 Workflow 工具调用：

```javascript
// 精读一篇论文
Workflow({
  scriptPath: '.claude/workflows/paper-deep-note.js',
  args: { title: "论文标题", url: "https://arxiv.org/...", topic: "MultiModal" }
})

// 文献综述全流程
Workflow({
  scriptPath: '.claude/workflows/paper-literature-review.js',
  args: { mode: "full", query: "Flash Attention", papers: [...] }
})

// 概念演进追踪
Workflow({
  scriptPath: '.claude/workflows/paper-concept-evolution.js',
  args: { concept: "Flash Attention" }
})

// 端到端流水线
Workflow({
  scriptPath: '.claude/workflows/paper-note-pipeline.js',
  args: { papers: [{ title: "...", url: "...", topic: "..." }] }
})
```

**设计文档**: `workflow/workflow-internalization-plan.md`