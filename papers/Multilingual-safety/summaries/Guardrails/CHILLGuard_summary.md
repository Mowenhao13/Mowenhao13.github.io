---
layout: page
---

> **arXiv**: `2606.15396` | **年份**: 2026 | **Venue**: arXiv

## 核心贡献

CHILLGuard 专为中国 LLM 安全场景设计，提出了细粒度的中文风险分类体系（5 个大类 31 个小类）。核心贡献包括：(1) 基于多源数据生成的可扩展三阶段数据构建流水线，融合 RAG 扩展、提示工程改写和多样性投票标签校准；(2) 构建了大规模中文安全数据集 CHILLGuardTrain（405,007 样本）和 CHILLGuardTest（51,745 样本）；(3) 提出 Model-aware Direct Preference Optimization (MDPO)，动态调整 KL 惩罚系数以适应不同难度样本。

## 方法

**细粒度风险分类体系**：
- A 类：违反社会主义核心价值观（8 子类，如煽动颠覆国家政权、危害国家安全等）
- B 类：歧视性内容（9 子类，如民族、宗教、性别、年龄歧视等）
- C 类：商业违规与不合规（5 子类，如侵犯知识产权、泄露商业机密等）
- D 类：侵犯合法权益（7 子类，如侵犯肖像权、隐私权等）
- E 类：未能满足特定服务安全需求（2 子类，如内容不准确、不可靠）

**数据构建流水线**：
1. **RAG 扩展**：构建 480,000 条互联网文本语料库，用 bge-m3 编码存储，检索 Top-100 后用 uncensored 模型生成
2. **真实世界数据**：从生产环境收集 46,742 条真实用户 prompt，由 5+ 位博士专家标注
3. **PE 数据增强**：设计针对中文语言特点的改写策略（谐音替换、文化典故、反讽修辞、语义嵌套），生成 109,312 条样本
4. **标签校准**：使用 Qwen3-30B、GLM-4.7-30B、InternVL3.5-38B、Yi-1.5-34B 四模型投票，DeepSeek-V3.2-685B 作为终裁

**MDPO（Model-aware Direct Preference Optimization）**：
标准 DPO 使用静态 KL 惩罚系数 $\beta$，MDPO 基于模型对当前样本的响应度动态调整：
$$L_{DPO} = -\mathbb{E}_{(x,y_w,y_l)\sim P}[\log\sigma(\beta r_\theta(x,y_w) - \beta r_\theta(x,y_l))]$$
其中隐式奖励定义为：
$$r_\theta(x,y) = \log\frac{\pi_\theta(y|x)}{\pi_{ref}(y|x)}$$
MDPO 通过计算实例级奖励差距 $R_i = \beta\log\frac{\pi_\theta(y_{w,i}|x_i)}{\pi_{ref}(y_{w,i}|x_i)} - \beta\log\frac{\pi_\theta(y_{l,i}|x_i)}{\pi_{ref}(y_{l,i}|x_i)}$，引入异常值过滤机制，针对性调整 $\beta$。

## 数据集与实验

**CHILLGuardTrain**：405,007 条样本（包含中英混合多语言数据）。
**CHILLGuardTest**：51,745 条经严格标注的测试样本。

**评估**：CHILLGuardTest + 主流中文安全基准。

**对比基线**：LlamaGuard、Qwen3Guard、PolyGuard 等。

**主要结果**：
- CHILLGuard 8B 在 CHILLGuardTest 上整体 F1 达 89.77
- 超越 Qwen3Guard-8B-Strict 15.92%
- MDPO 显著提升了对隐晦、边缘有害内容的检测能力
- 全 31 细粒度类别均展现出优异性能

## 关键发现

CHILLGuard 揭示了现有英文中心或通用多语言 guardrail 在中文场景中的严重不足，特别是对中文特有的隐晦表达、文化典故和谐音替换等越狱手段的识别能力弱。MDPO 相比标准 DPO 在中文安全检测上具有明显优势。5 大类 31 小类的细粒度风险分类体系更适合中国法规和监管环境。

## 关联论文

[PolyGuard](PolyGuard.md)、[MrGuard](MrGuard.md)、[ML-Bench_and_Guard](ML-Bench_and_Guard.md)、[SelfDefend](SelfDefend.md)
