---
layout: page
---

arXiv:2411.08745, ICML 2024 Mechanistic Interpretability Workshop (最初标题为 "How Do Llamas Process Multilingual Text? A Latent Exploration through Activation Patching")

### 研究问题与动机

多语言LLM是否形成了**与具体语言解耦的通用概念表征**？这是多语言语言建模的核心问题。虽然先前工作通过embedding相似性分析、探针方法（probing）和logit lens提供了观察层面的证据，表明LLM可能存在共享语义空间，但这些方法都不是因果性的——它们无法证明模型确实"使用"了这些与语言无关的概念表征进行推理。本文首次通过**激活修补（Activation Patching）**这一因果干预手段，系统性地检验了Transformer在翻译任务中如何表示和处理多语言概念。

### 方法与创新

**核心框架**：作者提出两个竞争性假设：
- **H1（独立假设）**：语言和概念在模型内部表征中是独立的。表征可以分解为 $$z_{C^\ell} = z_C + z_\ell$$，其中 $$z_C \in U, z_\ell \in U^\perp$$，$$U \oplus U^\perp = \mathbb{R}^d$$。因此语言和概念可以独立变化。
- **H2（纠缠假设）**：语言和概念始终纠缠在一起，不存在这样的分解。

**创新1：单层激活修补实验**

设计如图2所示的实验：构造源提示（source prompt）和目标提示（target prompt），两者在输入语言、输出语言和概念上均不同。在单层 $j$ 处，提取源提示最后一个token的残差流激活值，修补到目标提示的对应层。观察修补后目标提示的next token分布如何变化：$h_{n_T}^{(j)}(T) := h_{n_S}^{(j)}(S)$
发现分层模式：层0-11解码目标概念+目标语言，层12-16解码目标概念+源语言，层16-31解码源概念+源语言。这表明**输出语言在较早层（层12）就已经确定，而概念在较晚层（层16）才进入残差流**。

**创新2：多源平均概念修补（关键贡献）**

为区分H1和H2，作者提出将多个源提示（不同输入语言、不同输出语言但同一概念）的残差流激活求平均后进行修补：

$$h_{\rho_T}^{(\alpha)}(T) = \frac{1}{k} \sum_{i=1}^{k} h_{-1}^{(\alpha)}(S_i), \quad \alpha \in j, \ldots, m$$

在H1下，平均后的表征为 $$z_{C_S} + \frac{1}{k}\sum_i z_{\ell_{S_i}^{(in)}}$$，概念信息保持完整且语言噪声被抵消。在H2下，平均会导致语言纠缠的概念产生干扰，降低性能。实验发现平均修补**反而提升了翻译性能**（概念去噪效果），有力支持H1。

**创新3：跨语言概念定义生成**

将平均概念表征修补到定义提示（definition prompt）中，观察模型能否为平均表征生成自然语言定义。使用sentence-transformer（paraphrase-multilingual-mpnet-base-v2）计算定义的语义相似度。发现从多源翻译/定义提示中平均的表征能生成高质量定义，与直接prompting相当或更好。

### 实验设置

**数据集**：
- 从BabelNet获取200个可图片化词（基于Basic English word list中的200个picturable words）的多语言翻译和定义
- 覆盖语言：DE, NL, ZH, ES, RU (输入), IT, FI, ES, RU, KO (输出), FR, EN等

**模型**：
- 主要模型：Llama 2 7B
- 泛化验证：Llama 2 70B, Llama 3 8B, Mistral 7B, Qwen 1.5 7B, Aya 23 8B, Gemma 2 2B

**实现工具**：NNsight (Fiotto-Kaufman et al., 2024)

**实验指标**：
- 翻译准确率：以词级别的next token概率 $$P(C^\ell)$$ 衡量
- 定义质量：sentence-transformer嵌入与ground truth定义的余弦相似度

**实验结果**：

图3（单层修补）：展示了三个清晰的分层区域
| 层范围 | 解码结果 | 解释 |
|--------|----------|------|
| 0-11 | 目标概念 + 目标语言 | 概念和语言均未受源提示影响 |
| 12-16 | 目标概念 + 源语言 | 语言被源覆盖，但概念仍为目标 |
| 16-31 | 源概念 + 源语言 | 概念和语言均被源覆盖 |

图4（多源平均修补）：跨语言平均概念表征后，P(CS_ZH)在0-15层保持高概率甚至提升，明确支持H1

图6（定义生成实验）：在三个目标语言（EN/FR/ZH）上，Multi-Source Translation和Multi-Source Definition patching均达到或超过直接Prompting的语义相似度

### 优势与局限

**优势**：
1. 首次对多语言LLM概念表征进行**因果分析**，超越了之前仅基于相关性/观察的方法
2. 提出新颖的多源平均激活修补方法，通过跨语言平均的"去噪"效应巧妙区分独立vs纠缠假设
3. 在多种模型（7B-70B, 不同架构和训练数据）上验证了结论的泛化性
4. 将实验从单token生成推广到多token自然语言定义生成

**局限**：
1. 仅研究了简单具体概念（picturable words），未涉及抽象概念或文化特定概念（如"Waldeinsamkeit"）
2. 任务局限于词级翻译和定义，未探索句级、段落级的多语言处理
3. 需要更细粒度的探针来研究模型是否能在更微妙的方式下将概念与语言纠缠

### 复现难点

- 需使用NNsight（NDIF）框架进行干预式前向传播，调试复杂
- 需要BabelNet API获取多语言翻译和定义，以及处理多义词
- 平均修补需要构造大量源提示对（本文使用200对），计算开销大
- 代码已开源：https://github.com/Butanium/llm-lang-agnostic

### 对当前研究的启发

1. 本文为"LLM是否存在通用概念空间"提供了直接的因果证据，对多语言推理的机制可解释性研究具有里程碑意义
2. 跨语言平均概念表征提升性能的发现，预示着可以用更少的语言数据训练高效的多语言模型
3. 共享概念空间的存在也意味着**文化偏见可能通过该空间传播**，对安全对齐研究有重要启示——多语言安全对齐可能在概念层而非语言层进行更有效
4. 激活修补框架可以推广到更复杂的跨语言推理任务（如多语言Chain-of-Thought），为理解LLM的推理机制提供方法论

### 分类标签

主题：Latent_Space_Reasoning
关键词：Activation Patching, Language-Agnostic Representation, Mechanistic Interpretability, Multilingual LLM, Concept Disentanglement

**关联**：当前主题 [Latent_Space_Reasoning](Latent_Space_Reasoning/) 为新建立，暂无本地已有总结。可关联 Multilingual-safety 主题下的语言相关论文，如 [Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary](Focusing on Language - Revealing and Exploiting Language Attention Heads in Multilingual Large Language Models_summary.md) 和 [Attention_Heads_Safety_Summary](Attention_Heads_Safety_Summary.md)。