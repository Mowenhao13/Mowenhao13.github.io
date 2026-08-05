---
layout: page
title: 实验结果归档
---

# 实验结果归档

## 实验概述

| 实验 | 方法 | 源配置 | 目标配置 | 运行时间 |
|------|------|--------|---------|---------|
| 1: HeteroPatch | Patchscope 跨语言注入 | de→it | fr→zh | 6分46秒 |
| 2: Object-level Patching | 多源语言概念均值注入 | 5个源语言对 → fr | et / zh | 26分57秒 |
| 3: Translation Lens | Patchscope 自窥探 | de→it | — | 1分40秒 |

## 结果文件结构

```
results/Llama-2-7b-hf/
├── shifted_translation/                 # 实验 1
│   └── de_it-fr_zh/
│       ├── {exp_id}.json                # 数值结果 (200×32 matrix)
│       ├── {exp_id}.png                 # 逐层概率曲线图
│       ├── {exp_id}_k.png               # k 个示例详细图
│       └── {exp_id}_heatmap.png         # 逐 token × 逐层热力图
│
├── obj_patch_translation/               # 实验 2
│   ├── de-hi_nl-hi_zh-hi_es-hi_ru-hi-fr_et-/  # 5×hi→fr→et
│   │   ├── {exp_id}.json
│   │   ├── {exp_id}.png
│   │   ├── {exp_id}_only_first.png
│   │   └── {exp_id}_heatmap.png
│   └── de-it_nl-fi_zh-es_es-ru_ru-ko-fr_zh-/  # 5×翻译对→fr→zh
│       ├── {exp_id}.json
│       ├── {exp_id}.png
│       ├── {exp_id}_only_first.png
│       └── {exp_id}_heatmap.png
│
└── translation_lens/                    # 实验 3
    └── patchscope-de_it-/
        ├── {exp_id}.json
        ├── {exp_id}.png
        ├── {exp_id}_k.png
        └── {exp_id}_heatmap.png
```

## 关键数值结果

### 实验 1: HeteroPatch

| 层 | 目标概率均值 | 最大值 |
|----|------------|--------|
| Layer 0 | 0.6409 | 0.9775 |
| Layer 2 | **0.7141** | — |
| Layer 7 | 0.7034 | 0.9858 |
| Layer 15 | 0.0901 | 0.7427 |
| Layer 23 | 0.0000 | 0.0008 |
| Layer 31 | 0.0000 | 0.0000 |

### 实验 2: Object-level Patching

| 配置 | 目标 | 最佳层 | 最佳概率均值 |
|------|------|-------|------------|
| 5×hi→fr→et | et | Layer 28 | 0.0556 |
| 5×翻译对→fr→zh | zh | Layer 22 | 0.1798 |

### 实验 3: Translation Lens

| 层 | 目标概率均值 | 解读 |
|----|------------|------|
| Layer 0 | 0.0013 | 无目标语言信息 |
| Layer 7 | 0.0024 | 无目标语言信息 |
| Layer 15 | 0.1267 | 开始构建目标语言表示 |
| Layer 23 | 0.7277 | 目标语言接近确定 |
| Layer 31 | **0.7446** | 输出层前最高 |

## 运行环境

- **模型**: meta-llama/Llama-2-7b-hf (26GB)
- **GPU**: 8× NVIDIA RTX 3090 (24GB)
- **框架**: torch 2.4.1+cu121, nnsight 0.3.3, transformers 4.44.2
- **批大小**: 4
- **磁盘**: 数据盘 1.3TB 可用