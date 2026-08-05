---
layout: page
title: "Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations in Transformers"
---

# Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations in Transformers

> **论文链接**: [arXiv: 2411.08745](https://arxiv.org/abs/2411.08745)  
> **代码仓库**: [github.com/Butanium/llm-lang-agnostic](https://github.com/Butanium/llm-lang-agnostic)  
> **先前版本**: *How Do Llamas Process Multilingual Text? A Latent Exploration through Activation Patching* (ICML 2024 Mechanistic Interpretability Workshop, Spotlight)  
> **中文翻译&实验说明**: 本文件

---

## 摘要

本文通过激活 patching（Activation Patching）技术，揭示了 Transformer 模型（LLaMA-2-7b）在多语言翻译任务中，**浅层编码语言无关（language-agnostic）的抽象概念表示，深层将概念映射到具体语言的输出词汇**。这一发现为"分离语言与思想"（Separating Tongue from Thought）提供了机制层面的证据。

---

## 环境配置

### 系统要求

- Python ≥ 3.7（推荐 3.11）
- PyTorch 2.3.x（注意 2.4+ 可能与代码不兼容）
- NVIDIA GPU（推荐 24GB+，如 RTX 3090）

### 安装步骤

```bash
# 1. 创建虚拟环境
python -m venv .venv
source .venv/bin/activate

# 2. 安装依赖
# 使用 uv（推荐，更快）
uv pip install -r requirements.txt

# 或使用 pip
pip install -r requirements.txt
```

如果遇到版本冲突，可以使用 `pip.freeze` 中记录的精确版本号。

### 关键依赖

| 包 | 版本 | 用途 |
|---|---|---|
| `torch` | `==2.3.1` | 深度学习框架 |
| `transformers` | `==4.44.0` | HuggingFace 模型加载 |
| `nnsight` | `==0.2.21` | 激活 patching 框架（核心） |
| `transformer_lens` | — | TransformerLens 支持 |
| `papermill` | — | Jupyter Notebook 参数化执行 |
| `seaborn` | — | 可视化 |

---

## 数据集

论文使用的数据集已预构建在 `data/` 目录下，包含 12 种语言：

| 语言 | 代码 | 翻译数据 | 完形填空数据 |
|------|------|---------|------------|
| 德语 | de | ✅ | ✅ |
| 英语 | en | ✅ | ✅ |
| 西班牙语 | es | ✅ | ✅ |
| 爱沙尼亚语 | et | ✅ | ✅ |
| 芬兰语 | fi | ✅ | ✅ |
| 法语 | fr | ✅ | ✅ |
| 印地语 | hi | ✅ | ✅ |
| 意大利语 | it | ✅ | ✅ |
| 日语 | ja | ✅ | ✅ |
| 韩语 | ko | ✅ | ✅ |
| 荷兰语 | nl | ✅ | ✅ |
| 俄语 | ru | ✅ | ✅ |
| 中文 | zh | ✅ | ✅ |

### 数据格式

- **`word_translation.csv`**: 基于 BabelNet 的单词翻译数据集，包含词的原型（synset）信息和多语言翻译
- **`synset_dataset.csv`**: 从 Wiktionary 200 个可图示单词中提取的同义词集
- **`cloze_dataset.csv`**: 基于同义词集的完形填空数据集，用于更复杂的语义探测

---

## 三个实验详解

本仓库包含三个核心实验，从不同角度验证"语言无关概念表示"这一假说。

### 实验 1: HeteroPatch — 跨语言概念注入

**文件**: `experiment_1_heteropatch.py`

#### 核心问题

从一个语言对的翻译过程中提取的 latent 概念表示，能否成功注入到另一个完全不同的语言对的翻译过程中？

#### 实验设计

```
源任务: 德语(de) → 意大利语(it)
目标任务: 法语(fr) → 中文(zh)

步骤:
1. 构建源任务 prompts: "Translate from German to Italian: Hund -> Cane"
2. 提取源任务最后一个 token（"Cane"）的 hidden state
3. 构建目标任务 prompts: "Translate from French to Chinese: Chien -> ____"
4. 将源任务的 hidden state 注入到目标任务中"Chien"的位置
5. 逐层（Layer 0-31）重复注入，观察中文目标词的概率
```

#### 代码结构

```python
# 1. 加载模型
nn_model = load_model(model_path, device_map="auto")

# 2. 加载数据集
source_df = get_translations("de", ["it", "fr", "zh", "en"])
target_df = get_translations("fr", ["it", "de", "zh", "en"])

# 3. 构建 prompts
_source_prompts = translation_prompts(source_df, tokenizer, "de", "it", ...)
_target_prompts = translation_prompts(target_df, tokenizer, "fr", "zh", ...)

# 4. 配对（确保源和目标的单词不同）
source_prompts, target_prompts = get_shifted_prompt_pairs(...)

# 5. Patchscope 注入
# 将源 prompt 的 hidden state 注入到目标 prompt 的指定位置
target_probs, latent_probs = run_prompts(
    nn_model, target_prompts, batch_size=4,
    get_probs=lambda model, batch, scan: patchscope_lens(
        model, source_prompts_str, TargetPromptBatch.from_prompts(batch, -1), scan=scan
    )
)
```

#### 关键函数

| 函数 | 文件 | 作用 |
|---|---|---|
| `patchscope_lens()` | `src/interventions.py` | 核心：用源 prompt 的 hidden state 替换目标 prompt 的 hidden state，逐层输出概率 |
| `translation_prompts()` | `src/prompt_tools.py` | 构建翻译格式的 prompts，含 few-shot 示例 |
| `get_shifted_prompt_pairs()` | `src/prompt_tools.py` | 配对源和目标 prompts，确保概念不同且无 token 冲突 |

#### 预期结果

| 层 | 目标概率 | 解读 |
|---|---|---|
| Layer 0-7 | **0.64-0.71** | 浅层注入效果极强，跨语言概念保持完好 |
| Layer 15 | 0.09 | 中层开始退化 |
| Layer 23-31 | ≈0.00 | 深层注入完全失效 |

> **结论**: 浅层（Layer 0-7）是跨语言概念表示的核心区域。深层表示与语言输出高度耦合，无法跨语言迁移。

---

### 实验 2: Object-level Patching — 物体级概念注入

**文件**: `experiment_2_object_patching.py`

#### 核心问题

从多个源语言对分别提取同一概念（如"狗"）的表示，取平均后能否注入到目标翻译任务中？是否比单个源语言对更好？

#### 实验设计

```
源语言对（5个）:
  de→hi, nl→hi, zh→hi, es→hi, ru→hi
  ↓ 提取每个概念（如"狗"）的 hidden state
  ↓ 对 5 个源语言对的 hidden state 求平均
  ↓ 得到"概念原型"
目标任务:
  fr → zh（法语→中文）

对比:
  A. 使用 5 个源语言对的概念均值做注入
  B. 仅使用第一个源语言对（de→hi）做注入
```

#### 关键函数

| 函数 | 文件 | 作用 |
|---|---|---|
| `object_lens()` | `src/interventions.py` | 核心：在指定 token 位置注入预计算的概念 hidden state |
| `collect_activations_batched()` | `src/nnsight_utils.py` | 批量收集模型在指定 layers 的激活值 |
| `get_obj_id()` | `src/prompt_tools.py` | 找到目标概念在 prompt 中的 token 位置 |

#### 预期结果

| 配置 | 目标语言 | 最佳层 | 最佳概率 |
|---|---|---|---|
| 5个源对→fr→et | 爱沙尼亚语 et | Layer 24-28 | 0.04-0.06 |
| 5个源对→fr→zh | 中文 zh | Layer 21-22 | 0.17-0.19 |
| 仅第一源对→fr→zh | 中文 zh | Layer 22 | 0.17-0.19 |

> **结论**: 多源语言对的概念均值确实可以跨语言迁移，但单源语言对的效果已经足够好。中文作为目标语言时效果更好，可能与训练数据丰富度有关。最佳注入层集中在 Layer 21-28（中深层）。

---

### 实验 3: Translation Lens — 翻译透镜

**文件**: `experiment_3_translation_lens.py`

#### 核心问题

在翻译过程中，模型内部是否使用英语作为"中间表示"（即先翻译成英语，再翻译成目标语言）？

#### 实验设计

```
翻译任务: de → it（德语→意大利语）

方法 1: Patchscope Lens
  - 在每一层读取模型的 hidden state
  - 直接解码为词汇概率
  - 检测目标语言（it）和英语（en）的概率

方法 2: Logit Lens（备选）
  - 使用 unembedding 矩阵将 hidden state 投影到词汇空间
  - 同样逐层检测
```

#### 关键函数

| 函数 | 文件 | 作用 |
|---|---|---|
| `patchscope_lens()` | `src/interventions.py` | 用目标 prompt 自身的 hidden state 做 patchscope（自窥探） |
| `logit_lens()` | `src/interventions.py` | 通过 unembedding 矩阵直接解码 hidden state |

#### 预期结果

| 层 | 目标(it)概率 | 解读 |
|---|---|---|
| Layer 0-7 | 0.001-0.002 | 浅层几乎没有目标语言信息 |
| Layer 15 | 0.127 | 模型开始构建目标语言表示 |
| Layer 23 | 0.728 | 目标语言表示已基本确定 |
| Layer 31 | **0.745** | 输出层前达到最高概率 |

> **结论**: 模型在 de→it 翻译过程中**不通过英语中间表示**，而是直接建立从德语到意大利语的跨语言映射。英语 latent 概率没有显著优势。

---

## 复现结果

### 使用 `run_all.py` 一键运行

```bash
# 安装依赖后
python run_all.py --model_path /path/to/Llama-2-7b-hf --batch_size 4
```

### 分别运行

```bash
# 实验 1: HeteroPatch
python experiment_1_heteropatch.py -m /path/to/model -b 4

# 实验 2: Object-level Patching
python experiment_2_object_patching.py -m /path/to/model -b 4

# 实验 3: Translation Lens
python experiment_3_translation_lens.py -m /path/to/model -b 4
```

### 输出结构

```
results/
└── Llama-2-7b-hf/
    ├── shifted_translation/          # 实验 1 结果
    │   └── de_it-fr_zh/
    │       ├── {exp_id}.json           # 数值结果（200×32 矩阵）
    │       ├── {exp_id}.png            # 主图（逐层概率曲线）
    │       ├── {exp_id}_k.png          # k 个示例的详细图
    │       └── {exp_id}_heatmap.png    # 热力图（逐 token × 逐层）
    ├── obj_patch_translation/        # 实验 2 结果
    │   └── {config}/
    │       ├── {exp_id}.json
    │       ├── {exp_id}.png
    │       ├── {exp_id}_only_first.png # 仅第一源语言对的结果
    │       └── {exp_id}_heatmap.png
    └── translation_lens/             # 实验 3 结果
        └── patchscope-de_it-/
            ├── {exp_id}.json
            ├── {exp_id}.png
            └── {exp_id}_heatmap.png
```

### 输出 JSON 格式

```json
{
    "zh": [[0.64, 0.70, ..., 0.00], ...],         // 目标语言概率 (num_prompts × num_layers)
    "source prompt probs": [...],                   // 源任务 baseline
    "target prompt probs": [...],                   // 目标任务 baseline
    "en": [[...], ...],                             // 英语 latent 概率
    "it": [[...], ...],                             // 意大利语 latent 概率
    "only first": { "zh": [[...], ...] }            // 实验 2: 仅第一源语言对
}
```

---

## 从零开始构建实验环境（服务器版）

如果在远程 GPU 服务器上运行，推荐以下步骤：

```bash
# 1. 连接服务器
ssh ubuntu

# 2. 克隆代码
cd ~/projects/tmp/04
git clone https://github.com/Butanium/llm-lang-agnostic.git
# 或本地克隆后上传
# scp -r ./tmp/llm-lang-agnostic ubuntu:~/projects/tmp/04/

# 3. 创建虚拟环境并安装依赖
python3 -m venv .venv
source .venv/bin/activate
/usr/local/bin/uv pip install -r llm-lang-agnostic/requirements.txt

# 4. 下载模型到数据盘
# 已存在: /home/ubuntu/data/models/meta-llama/Llama-2-7b-hf

# 5. 运行实验
cd llm-lang-agnostic
python run_notebook.py -n patchscope_shifted_translation -b 4 \
    -m /home/ubuntu/data/models/meta-llama/Llama-2-7b-hf
```

---

## 注意事项

1. **模型路径**: 使用 `--model_path` 或 `-m` 参数指定本地模型路径，避免从 HuggingFace 重复下载
2. **GPU 显存**: LLaMA-2-7b 需要约 14GB 显存，批大小建议 4-8
3. **nnsight 版本**: 代码使用 `nnsight<0.5`，当前锁定 `0.2.21` 确保兼容性
4. **torch 版本**: 严格 `torch<2.4`，2.4+ 的 autocast 变化可能导致 RoPE 编码错误
5. **数据集**: 代码已包含预构建数据集，无需额外申请 BabelNet API
6. **磁盘空间**: 清理 pip/uv 缓存（约 6GB）可在主盘空间紧张时释放空间

---

## 引用

```bibtex
@misc{gallay2024separatingtonguethoughtactivation,
      title={Separating Tongue from Thought: Activation Patching Reveals Language-Agnostic Concept Representations in Transformers}, 
      author={Michael Benjamin Gallay and Maël Fabien and Kais M'dallah and Vicky Dassy and Reka Szikszai and Yevgeniy Golovatskyi and Alexandre Allauzen and Yoann Dupont and Raphaël Tuoti},
      year={2024},
      eprint={2411.08745},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2411.08745}, 
}
```