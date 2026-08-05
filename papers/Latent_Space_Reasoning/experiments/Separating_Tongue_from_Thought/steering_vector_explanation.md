---
layout: page
title: Steering Vector 概念解释
---

# Steering Vector 概念解释

## 什么是 Steering Vector？

Steering Vector（引导向量）是**可解释性**和**模型控制**领域的一个重要概念。简单来说，它是一个**加到模型 hidden state 上的向量**，用来**引导模型的行为朝某个方向变化**。

## 直观理解

想象一个音响的均衡器：
- 每个频段（低音、中音、高音）可以独立调节
- 如果你把"低音"旋钮调高，声音会更"沉闷"
- Steering Vector 就像是给模型的"内部表示"加了这样一个旋钮

## 数学定义

在 Transformer 中，每一层 $l$ 的每个 token 位置 $p$ 都有一个 hidden state $h_{l,p} \in \mathbb{R}^d$（$d$ 是隐藏维度）。

Steering Vector $v \in \mathbb{R}^d$ 的操作是：

$$h_{l,p}' = h_{l,p} + \alpha \cdot v$$

其中 $\alpha$ 是一个缩放因子（factor），控制干预强度。

## 在代码中的实现

`src/interventions.py` 第 333-352 行：

```python
def steer(
    nn_model: NNLanguageModel,
    layers: int | list[int],      # 要干预的层
    steering_vector: th.Tensor,   # 引导向量
    factor: float = 1,            # 强度因子
    position: int = -1,           # token 位置（默认最后一个 token）
    get_module: GetModuleOutput = get_layer_output,
):
    if isinstance(layers, int):
        layers = [layers]
    for layer in layers:
        get_module(nn_model, layer)[:, position] += factor * steering_vector
```

这行代码直接修改了模型在指定层、指定位置的 hidden state，**加上** steering vector。

## 与应用场景

### 1. 概念编辑（Concept Editing）

如果从"狗"的表示中减去"猫"的表示，得到的向量可能编码了"狗不是猫"这个方向：

```python
# 假设 h_dog 和 h_cat 是这两个概念在某层的 hidden state
steering_vec = h_dog - h_cat
# 把这个向量加到中立概念上，模型会更倾向于生成"狗"相关的输出
steer(model, layers=[15], steering_vector=steering_vec, factor=1.0)
```

### 2. 安全对齐（Safety Alignment）

在越狱防御中，可以构造一个"安全方向"的 steering vector：

```python
# 从安全响应和有害响应的 hidden state 差异中学习
safety_vector = mean_safe_hidden - mean_harmful_hidden
# 在推理时加上安全向量，抑制有害输出
steer(model, layers=[20, 21, 22], steering_vector=safety_vector, factor=1.5)
```

### 3. 行为控制（Behavior Control）

控制模型的"诚实度"、"创造力"、"正式程度"等属性：

```python
# 从"正式"和"非正式"文本的 hidden state 差异中提取
formality_vector = mean_formal_hidden - mean_casual_hidden
steer(model, layers=[18], steering_vector=formality_vector, factor=0.5)
```

## 与 Activation Patching 的关系

| 方法 | 操作 | 效果 |
|------|------|------|
| **Activation Patching** | 完全替换：$h' = h_{source}$ | 探测"如果这个位置的值是另一个来源的，会怎样？" |
| **Steering Vector** | 加法干预：$h' = h + \alpha v$ | 控制"在这个方向上增强/减弱一点，会怎样？" |

两者都是**因果干预**（causal intervention）的具体形式，区别在于：
- **Patching** 是**替换式**的——用另一个来源的值完全替换
- **Steering** 是**叠加式**的——在原始值上叠加一个向量

## 论文中的 Context

这篇论文（Separating Tongue from Thought）主要使用 **Activation Patching** 而非 Steering Vector。但 `steer()` 函数被包含在代码库中，是因为：

1. 它是 nnsight 框架提供的标准干预方式
2. 在后续研究中（如该论文的扩展方向），steering vector 可以用于**验证**发现的跨语言概念表示是否真的能控制模型行为
3. 如果验证了 Layer 2-7 确实编码语言无关概念，那么可以用 steering vector 做**跨语言概念操控**：从德语中提取"狗"的概念，应用到中文生成中

## 实际使用示例

```python
# 1. 收集两组激活值的差异
with model.trace(prompts_positive):
    pos_acts = get_layer_output(model, 15).save()

with model.trace(prompts_negative):
    neg_acts = get_layer_output(model, 15).save()

# 2. 构造 steering vector
steering = pos_acts.value.mean(0) - neg_acts.value.mean(0)

# 3. 在推理时施加干预
with model.trace(test_prompts):
    steer(model, layers=[15], steering_vector=steering, factor=1.0)
    output = model.output.save()
```

## 常见误区

| 误区 | 纠正 |
|------|------|
| Steering vector 是"在输入层加一个偏移" | ❌ 是在某一层的 hidden state 上加，不是输入层 |
| Steamg vector 越大越好 | ❌ factor 过大可能破坏模型的自然语言能力 |
| Steamg vector 对所有层都有效 | ❌ 不同层编码不同抽象级别，需要实验找到最佳层 |
| 一个 steering vector 可以在所有 prompt 上通用 | ❌ 同一个向量在不同上下文中可能有不同效果 |