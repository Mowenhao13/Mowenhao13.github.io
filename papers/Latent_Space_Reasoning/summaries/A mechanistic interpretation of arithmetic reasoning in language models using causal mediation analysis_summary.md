---
layout: page
---

## 论文信息

- **标题**: A Mechanistic Interpretation of Arithmetic Reasoning in Language Models using Causal Mediation Analysis
- **作者**: Alessandro Stolfo, Yonatan Belinkov, Mrinmaya Sachan (ETH Zürich, Technion)
- **年份**: 2023
- **会议/期刊**: arXiv:2305.15054
- **类型**: 实验论文

---

## 核心贡献

本文是**首次将因果中介分析（Causal Mediation Analysis, CMA）应用于 Transformer 语言模型算术推理的机械可解释性研究**，揭示了模型在算术问答任务中的内部信息流路径。

### 主要发现

1. **信息流三阶段路径**（见论文 Figure 1）：
   - **阶段 A（早期层）**：序列中部早期层的 MLP 模块处理操作数和运算符的表示
   - **阶段 B（注意力传输）**：中间层（11-18层）的注意力机制将操作数/运算符相关信息传递到序列末尾的最后一个 token
   - **阶段 C（结果计算）**：末尾 token 处的**中后期 MLP 模块（层 19-20）**将结果相关信息写入残差流

2. **结果相关 vs 操作数相关信息的分离**：
   - 通过设计"固定结果"（r = r'）的实验变体，发现层 19-20 的 MLP 编码的是**计算结果信息**，而非操作数信息
   - 注意力模块主要负责传输操作数信息，而非计算结果

3. **任务特异性验证**：
   - 与数字检索任务和事实知识问答任务对比，发现算术推理的激活模式具有特异性
   - 神经元级分析发现：算术推理（阿拉伯数字版 vs 文字版）之间 top-400 神经元重叠率为 50%，而算术与数字检索之间仅 22-23%，与事实知识之间仅 9-10%（接近随机基线 9.8%）

---

## 方法

### 因果中介分析框架

将模型视为因果图，内部组件（MLP 模块、注意力模块）视为中介变量：

1. 采样两对操作数 $(N, N')$ 生成两个输入问题 $p_1, p_2$
2. 在 $p_1$ 的前向传播中存储组件激活值
3. 在 $p_2$ 的前向传播中**替换**对应组件的激活值为 $p_1$ 的值
4. 计算间接效应（Indirect Effect, IE）衡量组件对预测的因果贡献

$$
IE(z) = \frac{1}{2} \left[ \frac{P^*_z(r) - P(r)}{P(r)} + \frac{P(r') - P^*_z(r')}{P^*(r')} \right]
$$

### 相对重要性指标

$$
RI(M^*) = \frac{\sum_{m \in M^*} \log(IE(m) + 1)}{\sum_{m \in M} \log(IE(m) + 1)}
$$

---

## 数据集与实验设置

### 算术查询
- **二元运算**: 6 种模板 × 4 种运算符（+、-、×、÷），每种 50 对操作数
- **三元运算**: 29 种二元运算符组合模板，每种 15 对操作数
- 结果空间 $S = \{1, 2, \ldots, 300\}$

### 对比任务
- **数字检索**: "Paul has $n_1$ $e_1$ and $n_2$ $e_2$. How many $e_q$ does Paul have?"
- **事实知识**: LAMA 基准测试中的 6 种关系（首都、出生地、死亡地、母语、子类、首都）

### 模型

| 模型 | 参数量 | 特点 |
|------|--------|------|
| **GPT-J** | 6B | 主要实验模型 |
| **Pythia 2.8B** | 2.8B | 验证/微调 |
| **LLaMA 7B** | 7B | 跨架构验证 |
| **Goat** | 7B | LLaMA 微调版，算术专用 |

---

## 关键实验结论

1. **跨模型一致性**：GPT-J、Pythia 2.8B、LLaMA 7B、Goat 均显示相同的激活模式
2. **微调带来的变化**：Pythia 2.8B 在三元运算上微调后，中后期 MLP 激活位点（mid-late MLP activation site）**涌现出来**，与二元运算场景一致
3. **预测变化分析**：对层 19-20 MLP 的干预更可能**将错误预测修正为正确**，而对层 14-17 的干预则更可能导致**正确变错误**
4. **文字数字 vs 阿拉伯数字**：用文字表示数字（"two" vs "2"）时，相同的激活模式仍然存在

---

## 关联论文

- [A Survey on Latent Reasoning](A Survey on Latent Reasoning.md) — 本文在综述 4.2 节中被引用，用于说明 MLP 和注意力模块在推理中间接贡献的量化方法
- [Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary](Separating Tongue from Thought_ Activation Patching Reveals Language-Agnostic Concept Representations in Transformers_summary.md) — 两篇论文均采用**激活干预/修补**的因果方法分析 LLM 内部机制，但分别聚焦于算术推理和语言无关概念表示
- [Rethinking the Multilingual Reasoning Gap with Layer Swap_summary](Rethinking the Multilingual Reasoning Gap with Layer Swap_summary.md) — 同样使用因果干预方法分析层的功能分化

---

## 局限性与未来方向

- 仅研究了四种基本算术运算符，未涉及更复杂的数学推理
- 注意力模块的分析仅考虑整体输出，未细化到具体注意力头
- 实验基于合成模板查询，未扩展到真实场景的数学应用题