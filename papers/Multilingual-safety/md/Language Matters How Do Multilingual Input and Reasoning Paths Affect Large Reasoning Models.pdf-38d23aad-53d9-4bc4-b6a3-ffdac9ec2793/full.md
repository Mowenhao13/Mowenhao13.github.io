---
layout: page
title: Language Matters: How Do Multilingual Input and Reasoning Paths Affect Large Reasoning Models?
---

# Language Matters: How Do Multilingual Input and Reasoning Paths Affect Large Reasoning Models?

Zhi Rui Tam1, Cheng-Kuang Wu1, Yu Ying Chiu2, Chieh-Yen Lin1, Yun-Nung Chen3 and Hung-yi Lee   
1Appier AI Research, 2University of Washington, 3National Taiwan University

Large reasoning models (LRMs) have demonstrated impressive performance across a range of reasoning tasks, yet little is known about their internal reasoning processes in multilingual settings. We begin with a critical question: In which language do these models reason when solving problems presented in different languages? Our findings reveal that, despite multilingual training, LRMs tend to default to reasoning in high-resource languages (e.g., English) at test time, regardless of the input language. When constrained to reason in the same language as the input, model performance declines, especially for low-resource languages. In contrast, reasoning in high-resource languages generally preserves performance. We conduct extensive evaluations across reasoning-intensive tasks (MMMLU, MATH-500) and non-reasoning benchmarks (CulturalBench, LMSYS-toxic), showing that the effect of language choice varies by task type: input-language reasoning degrades performance on reasoning tasks but benefits cultural tasks, while safety evaluations exhibit language-specific behavior. By exposing these linguistic biases in LRMs, our work highlights a critical step toward developing more equitable models that serve users across diverse linguistic backgrounds.

![](images/81d7c681138cb44e12ec893d947757ca99eddb1efbb7c7e53906bb130df2ddcf.jpg)

![](images/8a682e7243dffb11f5e19e7244650f86a39a397ad17eda2df4675d820e385cdd.jpg)  
Figure 1 ∣ We control LRMs’ thinking language by prefilling a language-specific prefill tokens (e.g., “Okay” for English in blue cell) after the <think> token. In reasoning tasks, thinking in “reasoning hub” language (e.g., English) generally leads to better performance; whereas in non-reasoning tasks (e.g., toxicity detection), thinking in non “reasoning hub” language (e.g., Japanese) enables LRMs to notice the safety problem and reject the user’s toxic request.

# 1. Introduction

Recent advancements in large reasoning models (LRMs) [6, 10, 12, 21] have led to striking improvements in their ability to tackle reasoning tasks such as mathematics [8], programming [11], and PhD-level science questions [15]. Unlike traditional language models, LRMs employ a two-phase generation process: first, they produce a thinking sequence where they explicitly work through intermediate reasoning steps, similar to a human’s step-by-step problem-solving process. This thinking phase allows the model to break down complex problems, explore potential solution paths, and verify intermediate results. Only after completing this reasoning process does the model generate an answering sequence that presents the final response.

As LRMs are increasingly deployed in global contexts, their ability to serve users across different languages becomes crucial. Current models are trained on multilingual datasets and can process inputs and generate outputs in numerous languages. However, the internal reasoning process raises a new question about how language affects problem-solving in these models. Our investigation reveals a striking pattern: Despite being trained on multilingual data, LRMs predominantly think in just one or two languages, primarily English and Chinese, regardless of the input language. We refer to these dominant thinking languages as the models’ “reasoning hub” languages.

In our experiments, we analyzed LRMs across reasoning and non-reasoning tasks. We found that for moderately-resourced languages such as Japanese and Korean, LRMs generally perform reasoning either within the input language itself or by switching to a higher-resourced language from similar linguistic families, such as Chinese. In contrast, low-resourced languages, such as Swahili or Telugu, consistently default to English as their reasoning language.

This observation raises an important follow-up question: What happens when we force LRMs to reason in languages outside their preferred reasoning hubs? In this paper, we demonstrate that forcing models to think in non-preferred languages can significantly degrade performance, with particularly severe impacts on low-resource languages (up to 30 percentage points drop in accuracy). Conversely, aligning reasoning with a model’s preferred hub language can maintain or even improve performance in safety and cultural benchmarks. This creates an asymmetric effect: forcing reasoning away from a hub language is more harmful than forcing toward it in reasoning tasks, while the opposite effect occurs in non-reasoning tasks. These findings have substantial implications for multilingual AI deployment.

Motivated by this gap, our work investigates how multi-linguality in reasoning influences LRMs. Specifically, we analyze how the choice of input and reasoning languages affects LRMs from two complementary perspectives as shown in Figure 1: (1) a performance-oriented evaluation, assessing LRMs on reasoning-intensive tasks to examine how the language used in prompting and reasoning influences their performance; and (2) a behavior-oriented evaluation, examining how languages impact broader aspects such as toxicity, cultural knowledge [3]. These aspects capture real-world implications in everyday usage scenarios. Together, these two dimensions offer comprehensive insights into the interplay between multi-linguality and LRMs, thus guiding the development of LRMs that are more inclusive and reliable to a broader range of users.

Our contributions are as follows:

1. We present the first comprehensive analysis of multilingual reasoning in LRMs across diverse tasks and model families. Our results demonstrate that reasoning in hub languages (English and Chinese) substantially improves accuracy on mathematical and knowledge-based tasks (by up to $2 6 . 8 \%$ ). Conversely,

reasoning in non-hub languages reduces toxicity and enhances performance on cultural tasks, highlighting a critical performance–safety trade-off in multilingual AI deployment.

2. We introduce a novel segmentation-classification method for analyzing reasoning patterns in LRMs. Using this approach, we identify systematic correlations between language-specific prefill tokens and reasoning strategies: Chinese significantly promotes subgoal setting (Pearson’s $\Gamma = 0 . 5 1 \mathrm { \dot { \Omega } }$ ), while English encourages backward chaining (Pearson’s $\mathrm { r } = 0 . 3 0 $ ). These findings suggest that language activates distinct, culturally embedded problem-solving schemas within LRMs.

# 2. Evaluation Setup

Our evaluation framework encompasses two critical dimensions of LRM deployment: performance and behavioral alignment. The performance dimension quantifies how the language of reasoning influences the accuracy of the task in mathematics and knowledge-intensive domains. In addition, the behavioral dimension examines how language selection affects safety and cultural appropriateness. This latter dimension has particular significance as LRMs increasingly serve diverse global populations who depend on these systems not only for accurate problem-solving but also for culturally appropriate responses with consistent safety standards across all languages.

Reasoning Tasks (i) MMMLU extends the original MMLU [7] test by providing human-verified translations of all 14,042 questions in 14 languages (Arabic, Bengali, German, Hindi, Japanese, Korean, Portuguese, Russian, Spanish, Swahili, Tamil, Telugu, Thai, Yoruba). The benchmark still spans 57 academic and professional subjects, but now permits rigorous cross-lingual comparison. We adopt the public MMMLU release  and its official evaluation harness. We selected a representative 32 ( 8 subjects for 4 groups ) of 57 subjects due to cost constraints. (ii) MATH-500 is a carefully curated subset of 500 problems from the MATH dataset [9], spanning algebra, geometry, calculus, probability, and number theory. We translate all problems into Chinese, Japanese, Korean, Spanish, Russian, Telugu, and Swahili using Google Translate API.

Non-Reasoning Tasks (i) CulturalBench [3] evaluates models’ cultural knowledge across diverse global contexts. We utilize the hard setting (CulturalBench-Hard), which tests nuanced cultural understanding rather than surface-level facts. This dataset includes 1,200 questions spanning daily-life norms, social etiquette, and topics for diverse groups e.g., Religions across 30 countries/regions. Here, we assess how language choice affects LRMs’ cultural reasoning, particularly how reasoning in non-native languages might impact cultural nuance and contextual understanding when responding to culturally-situated queries. (ii) LMSYS-Toxic consists of 2,000 prompts sourced from LMSYS-1M [24] that are known to trigger OpenAI’s moderation API (text-moderation-latest). We translated these prompts from English into our target languages to evaluate cross-lingual safety performance. We specifically chose this dataset over alternatives such as SafetyBench [23] due to its higher toxic rate, which presents a more challenging test for modern LRMs.

# 2.1. Languages

We choose English, Chinese, Spanish, Russian, Japanese, Korean, Telugu, and Swahili as the representative languages in our study. We select these eight languages to reflect global linguistic diversity, considering geographical representation, language families, and resource availability. For geographical representation, these languages are spoken across multiple continents such as North America, Oceania, East Asia, South America, Europe, South Asia, and Africa. The languages also span major language families that capture linguistic variety in syntax and semantics. Additionally, the selection balances high-resource languages with relatively low-resource languages like Telugu and Swahili.

# 3. The Reasoning Hub Phenomenon in Multilingual LRMs

While multilingual Large Language Models (LLMs) are designed to process and generate text across numerous languages, our analysis reveals a striking tendency: when generating long Chain-of-Thought (CoT) reasoning, these models predominantly default to a small subset of languages—primarily English and Chinese—regardless of the input language. We term these dominant languages “reasoning hubs” as they appear to function as central linguistic nodes for multilingual reasoning processes.

As illustrated in Figure 2, our language detection analysis across multiple open-weight models clearly demonstrates this hub phenomenon. The top Figure shows that bigger models, such as QwQ-32B and Qwen3-30B-A3B, consistently reason in English (en) even when provided with inputs in diverse languages. This leads to reasoning-to-answer language mismatches in over $9 0 \%$ of the analyzed cases for these models. Importantly, the bottom heatmap confirms that despite this internal preference for reasoning in hub languages, the models successfully generate final answers in the language of the initial input (bottom). This suggests a functional decoupling between the internal “thinking” language and the external “responding” language.

Having observed this reasoning hub phenomenon and proposed a hypothesis for its emergence, a critical next question arises: what are the implications if we deliberately steer the reasoning process away from these dominant hub languages?

# 4. Controlling Reasoning Languages with Text Prefilling

We propose a simple yet effective text prefilling strategy to steer the thinking language used by large reasoning models (LRMs) during their reasoning process, as illustrated in Figure 1. Our method seeds the prompt with a language-specific token or phrase, following the template:

<user> question <endoftext><assistant><think> [prefill tokens]

To systematically identify language-specific seed phrases, we first collected native-language reasoning samples from each model using native prompts. We then extracted the first $N$ tokens (typically $T = 5 – 1 0$ ) from the generated reasoning chains and computed frequency distributions over all token-level prefixes. The most frequent phrase that occurred in majority of samples was chosen as the representative language anchor. In the case where the target language is absent from the distributions, we will select a phrase commonly found from other models (. In the end, we found seed phrases such as “Okay” (English), “Хорошо” (Russian), “まず” (Japanese), “嗯” (Chinese), “Primero” (Spanish), “prarambhi ¯ m. cad. aniki” ¯ (Telugu) and “Kwa” or “Ili kup” (Swahili) serve as language anchors. The full prefill tokens for each

![](images/a2112a65f6ca025ad6b9bc8d2d9a625d83fa4e13df5493cf8023345561f43e1d.jpg)  
Language Distribution in Reason Section   
Language Distribution in Answer Section

![](images/ed8ba9024ca6122d1e5ca57597850b62b2d3452671771fea4dec791dd0f9ed13.jpg)

![](images/37d13060a386b5dc395cc10fe2226c80d85bf1eb9f03ccae67cff099ba06e140.jpg)  
Language Distribution in Reasoning After Prefill Target Language   
Figure 2 ∣ Language distribution visualization. Top: Distribution in the reason section showing language detection patterns across different models. Middle: Distribution in the answer section reveals how language preferences shift between reasoning and final outputs. Bottom: Distribution in the reason section after applying phrase prefilling, all reasoning languages were able to align well with the input language.

# model can be found in Appendix D.1

As demonstrated in Figure 2-Bottom, this prefilling technique substantially enhances language consistency across all evaluated models. For instance, DeepSeek-R1-Distill-Qwen-14B exhibits a much more consistent language compared to Figure 2-Top, where prefilled reasoning was only partially aligned

Table 1 ∣ Comparison of MATH-500 performance when reasoning in English vs. the target language, across languages ordered by speakers’ population.   

<table><tr><td>Strategy</td><td>Chinese</td><td>Spanish</td><td>Russian</td><td>Swahili</td><td>Japanese</td><td>Telugu</td><td>Korean</td></tr><tr><td colspan="8">DeepSeek-R1-Distill-Llama-8B</td></tr><tr><td>Prefill English (EN)</td><td>78.8%</td><td>80.2%</td><td>78.4%</td><td>37.0%</td><td>74.6%</td><td>42.2%</td><td>69.8%</td></tr><tr><td>Prefill Target Language</td><td>73.6%</td><td>46.8%</td><td>59.4%</td><td>3.8%</td><td>32.6%</td><td>16.8%</td><td>41.6%</td></tr><tr><td>Difference (EN - Target)</td><td>+5.2%</td><td>+33.4%</td><td>+19.0%</td><td>+33.2%</td><td>+42.0%</td><td>+25.4%</td><td>+28.2%</td></tr><tr><td colspan="8">DeepSeek-R1-Distill-Qwen-14B</td></tr><tr><td>Prefill English (EN)</td><td>88.4%</td><td>88.6%</td><td>86.6%</td><td>52.4%</td><td>85.2%</td><td>66.2%</td><td>84.4%</td></tr><tr><td>Prefill Target Language</td><td>89.8%</td><td>66.4%</td><td>86.4%</td><td>14.6%</td><td>63.6%</td><td>34.4%</td><td>83.8%</td></tr><tr><td>Difference (EN - Target)</td><td>-1.4%</td><td>+22.2%</td><td>+0.2%</td><td>+37.8%</td><td>+21.6%</td><td>+31.8%</td><td>+0.6%</td></tr><tr><td colspan="8">QwQ-32B</td></tr><tr><td>Prefill English (EN)</td><td>92.4%</td><td>92.2%</td><td>91.2%</td><td>67.8%</td><td>90.2%</td><td>84.4%</td><td>90.6%</td></tr><tr><td>Prefill Target Language</td><td>90.6%</td><td>93.2%</td><td>90.6%</td><td>55.6%</td><td>87.4%</td><td>65.2%</td><td>88.2%</td></tr><tr><td>Difference (EN - Target)</td><td>+1.8%</td><td>-1.0%</td><td>+0.6%</td><td>+12.2%</td><td>+2.8%</td><td>+19.2%</td><td>+2.4%</td></tr><tr><td colspan="8">Qwen3-30B-A3B</td></tr><tr><td>Prefill English (EN)</td><td>91.4%</td><td>91.0%</td><td>90.6%</td><td>72.4%</td><td>89.4%</td><td>87.0%</td><td>89.8%</td></tr><tr><td>Prefill Target Language</td><td>89.4%</td><td>83.8%</td><td>90.0%</td><td>29.6%</td><td>81.8%</td><td>68.4%</td><td>88.0%</td></tr><tr><td>Difference (EN - Target)</td><td>+2.0%</td><td>+7.2%</td><td>+0.6%</td><td>+42.8%</td><td>+7.6%</td><td>+18.6%</td><td>+1.8%</td></tr><tr><td colspan="8">Average across all models</td></tr><tr><td>Prefill English (EN)</td><td>87.7%</td><td>88.0%</td><td>86.7%</td><td>57.4%</td><td>84.9%</td><td>70.0%</td><td>83.7%</td></tr><tr><td>Prefill Target Language</td><td>85.9%</td><td>72.5%</td><td>81.6%</td><td>25.9%</td><td>66.3%</td><td>46.2%</td><td>75.4%</td></tr><tr><td>Difference (EN - Target)</td><td>+1.9%</td><td>+15.5%</td><td>+5.1%</td><td>+31.5%</td><td>+18.5%</td><td>+23.7%</td><td>+8.3%</td></tr></table>

along the diagonal.

We validated our approach by comparing prefilling against token masking techniques which is less biased than our method and find no significant performance difference on MATH-500 (Appendix C). We adopted prefilling for its cross-lingual versatility with ambiguous tokenization boundaries and shared subtoken IDs.

# 4.1. Performance-Oriented Results

As observed in many previous work MSGM [18], LLMs often exhibit improved performance when CoT is conducted in English, even when the primary task language is different. Our findings, presented in Table 1, corroborate with this. Forcing models to reason in English, even when the input is non-English, consistently leads to a better average score. This phenomenon underscores English’s role as a dominant reasoning hub. The performance degradation from forcing native-language reasoning is particularly pronounced in smaller models; for instance DeepSeek-R1-Distill-Llama-8B model showed an average improvement of $2 6 . 8 \%$ with English over native reasoning. This contrasts with larger models such as Qwen-14B of $1 6 . 1 \%$ , QwQ-32B $5 . 4 \%$ , Qwen3-30B-A3B $1 1 . 5 \%$ .

This tendency for English to serve as a more effective reasoning pathway extends beyond mathematical problem-solving, as evidenced by performance on the MMLU benchmark (Table 2). Across various languages, employing English for reasoning steps again generally yields superior results compared

Table 2 ∣ Comparison of MMLU performance when reasoning in English vs. the target language, all scores are averaged across 4 LRMs.   

<table><tr><td>Strategy</td><td>English</td><td>Chinese</td><td>Spanish</td><td>Swahili</td><td>Japanese</td><td>Korean</td></tr><tr><td>Prefill English (EN)</td><td>-</td><td>83.1%</td><td>83.8%</td><td>48.8%</td><td>80.8%</td><td>77.6%</td></tr><tr><td>Prefill Target Language</td><td>83.0%</td><td>80.2%</td><td>78.7%</td><td>35.3%</td><td>74.0%</td><td>71.2%</td></tr><tr><td>Difference (EN - Target)</td><td>-</td><td>+2.9%</td><td>+5.1%</td><td>+13.6%</td><td>+6.8%</td><td>+6.4%</td></tr></table>

Table 3 ∣ Comparison of LMSYS-Toxic ASR score when reasoning in English vs. the target language, across languages ordered by speakers’ population.   

<table><tr><td>Strategy</td><td>Chinese</td><td>Spanish</td><td>Russian</td><td>Swahili</td><td>Japanese</td><td>Telugu</td><td>Korean</td></tr><tr><td colspan="8">Average across all models</td></tr><tr><td>Prefill English (EN)</td><td>7.7%</td><td>12.3%</td><td>11.5%</td><td>3.5%</td><td>9.9%</td><td>0.8%</td><td>4.6%</td></tr><tr><td>Prefill Target Language</td><td>7.4%</td><td>13.3%</td><td>16.1%</td><td>3.6%</td><td>9.5%</td><td>1.6%</td><td>3.8%</td></tr><tr><td>Difference (EN - Target)</td><td>+0.3%</td><td>-1.0%</td><td>-4.6%</td><td>-0.1%</td><td>+0.4%</td><td>-0.8%</td><td>+0.8%</td></tr></table>

to native language reasoning. This advantage is particularly striking for languages with fewer digital resources, such as Swahili, which saw improvements average of $1 3 . 6 \%$ across all tested models. For the full models breakdown, we included it in Appendix F.

# 4.2. Behavior-Oriented Results

In LMSYS-Toxic, we observed that RL-finetuned model QwQ-32B resulted in lower attack success rate (ASR) when reasoning in their native language for most non-English languages (Japanese, Korean, Chinese, Spanish), with the notable exception of Russian. As shown in Table 3, QwQ-32B and Qwen3 models demonstrate a consistent pattern where forcing English reasoning (via “Okay” prefilling) increases toxicity rates by 1-3.5 percentage points for Japanese, Korean, Chinese, and Spanish inputs. Interestingly, the Russian language exhibits the opposite pattern, with lower toxicity when reasoning is guided toward English rather than maintaining native Russian reasoning.

This asymmetric effect aligns with our broader findings about reasoning hubs and language alignment. Both models successfully maintain the target language in their thinking phase when prompted with native language cues $( > 9 7 \%$ native language distribution across all languages). However, the effect on toxicity varies significantly by language, suggesting that safety guardrails may be differentially effective across languages. The increased toxicity when forcing English reasoning for non-Russian languages highlights the potential safety costs of deviating from native reasoning in behavior-oriented tasks, contrasting with the performance benefits observed in the previous section.

To study how changing the reasoning language affects other than safety such as culture understanding, Figure 3 compares model performance on CulturalBench-Hard $\scriptstyle ( \mathrm { N } = 4 9 0 7 )$ ) across global regions using English versus native language. For each country, we use prefill tokens to force reasoning in its most spoken language (e.g., Nepali for Nepal, Japanese for Japan). Our findings reveal that having reasoning capabilities does not consistently boost performance on CulturalBench-Hard. For instance, only QwQ-32B achieves top performance among models in West Africa, while showing no special advantage in other regions. Having native language prompts improves CulturalBench scores in specific geo-regions,

![](images/08ee27294fc514f1d758b0fc270c13b182b907855c505d40d87dd9d1f2bc5f6f.jpg)  
Figure 3 ∣ Model performance comparison across global regions when using English versus native language prompts

namely South Europe $( + 1 . 0 \%$ on average) and Oceania $. + 2 . 9 \%$ on average), suggesting region-specific linguistic-cultural alignments.

In general, reasoning models perform best in South Asia (mean=57.3%), similar to other nonreasoning models. Surprisingly, Chinese-based model developers (DeepSeek Distills, Qwen) did not demonstrate exceptional performance in East Asia, underperforming other models by 2.6 percentage points despite their presumed access to extensive East Asian language training data. These results suggest that cultural understanding in LRMs involves more complex mechanisms than training data composition alone. Full details can be found in Appendix G.

Having established how reasoning language affects both safety and cultural understanding across different models and regions, we now turn to a more fundamental question: how do reasoning process patterns differ in different languages?

# 5. Reasoning Pattern Analysis

Understanding how language models reason requires a systematic analysis of their reasoning patterns. Previous approaches [5] to analyzing reasoning chains have faced two key limitations: (1) simple counting methods often overcount repeated steps, and (2) forced classification schemes assign steps to predefined categories even when they don’t fit, distorting results. We propose a two-stage methodology, segmentation followed by classification, to address these limitations while enabling fine-grained analysis of reasoning behaviors.

![](images/da069f69cf95bb9babd183f9b826f2622171838d31d8e596ecba9d023a17ad5b.jpg)  
Step 1. Segment resoning chains by finding step boundary   
Step 2. Add step separator and prompts LLM ( gemini-2.5-flash ) for behavior in each steps

![](images/62b37825f9c0ac7c59a97d4cc09770b517033f24ee759730480a85a21f0656ad.jpg)  
Figure 4 ∣ Two-stage pipeline for step-level category annotation of reasoning chains.

# 5.1. Segmentation-Classification Method

Segmentation The first stage of our methodology involves segmenting reasoning chains into distinct operational steps with clear boundaries. This segmentation is crucial for preventing overcounting and ensuring that each reasoning operation can be classified appropriately. We implemented a two-phase approach: (1) using GPT-4o with one-shot prompting to annotate reasoning chains by adding <sep> tokens between distinct operations across multilingual data from models including QwQ, Claude Sonnet, and Gemini-2.0 Flash, and (2) training a token classification model that predicts whether each sentence completes a reasoning step. We finetuned a ModernBert-large [19]2 that achieved a $9 5 \%$ F1 score. Additional training details are in Appendix B.1.

Classification The second stage involves classifying each segmented step according to a theoretically grounded taxonomy. Building upon the four habits [5] taxonomy, we examine four primary habits that have demonstrated empirical significance in LRMs. We classify each segmented reasoning step using gemini-2.0-flash, according to four primary cognitive habits from [5]:

• Subgoal setting: Where the model breaks down the problem into smaller, intermediate goals (e.g., "To solve this, we first need to..." or "First, I’ll try to..., then...").   
• Backtracking: Where the model realizes a path won’t work and explicitly goes back to try a different approach (e.g., "Let me try again" or "We need to try a different approach").   
• Verification: Where the model checks the correctness of intermediate results or ensures the final

![](images/8602111ef756ce0e8c79f26ac609c9a2cda6b69543b2d5b81991c61ec941a4e5.jpg)  
Figure 5 ∣ Correlation Matrix Between Prefill Target Languages and Reasoning Types

![](images/d4abd602cb128109ffbf8a0c649dd446886f9365664d365b7e52573e226e6841.jpg)  
Figure 6 ∣ Figure shows the behavior with the strongest correlation for each language. Bar colors indicate statistical significance levels.

answer is correct (e.g., "Let’s verify this calculation" or "Checking our solution...").

• Backward chaining: Where the model works backward from its answer to see whether it can derive the variables in the original problem (e.g., "If we want to reach 42, then we need...").

To address the inherent limitations of fixed taxonomies, we introduce an “Others” category for steps that don’t clearly fit the defined habits, preventing distortion from forced classification. This category allows us to identify true novel reasoning behaviors or variations, ensuring we do not over-count while acknowledging the diversity of reasoning strategies across models. Full prompts can be found in Appendix B.2.

# 5.2. Reasoning Behaviours and Performance across Models and Linguistic Contexts

To analyze how prefill target languages affect specific reasoning strategies, we computed Pearson correlation coefficients (r) and their corresponding p-values (p). The process involved first aggregating the experimental results from all four models. For each experimental setting—defined by a unique combination of input language and prefill target language—we calculated the average count of steps for each of the four reasoning habits. Subsequently, for each prefill target language (e.g., Chinese, Swahili) and each reasoning habit (e.g., Subgoal setting), we calculate the pearson correlations between the average counts per reasoning and the final accuracy.

Figure 5 demonstrates that these minimal linguistic cues fundamentally reshape reasoning approaches—Chinese prefill tokens strongly promote Subgoal setting $( \mathrm { r } { = } 0 . 5 0 $ , $\mathrm { p } { < } 0 . 0 0 1 )$ ) and Verification $\scriptstyle ( \mathrm { r } = 0 . 4 1$ , $\mathrm { p } { < } 0 . 0 0 1 $ ), while Swahili shows a significant negative correlation $\mathrm { \Delta r } { = } { - } 0 . 3 5$ , $\mathrm { p } { < } 0 . 0 1 $ ) with the same Subgoal setting behavior.

We hypothesize this effect stems from culturally embedded problem-solving schemas activated by language-specific tokens. This aligns with cognitive linguistic structures that prime different decomposition strategies, as documented in bilingual problem-solving studies[1].

The distinct reasoning “signatures” in Figure 6 further support this hypothesis—English uniquely encourages Backward chaining $( \mathrm { r } { = } 0 . 3 0$ , $\mathsf { p } { < } 0 . 0 1 5 $ ), a deductive approach consistent with Anglo-Saxon educational emphases on proof-based reasoning. These signatures persist across model architectures, suggesting we’re observing fundamental interactions between language and cognition rather than model-specific artifacts. Performance analysis reveals that models employing Subgoal setting strategies (predominantly triggered by Chinese prefilings) achieved $7 . 3 \%$ higher accuracy on MATH-500 problems compared to those using other dominant strategies. This suggests that by strategically selecting prefill languages, we can optimize model performance on tasks requiring specific reasoning approaches.

# 6. Related Work

# 6.1. Chain-of-Thought Analysis

Chain-of-thought (CoT) prompting enhances large language models’ reasoning capabilities by generating explicit intermediate steps, improving performance, and providing interpretable insights into decision processes. Resources such as ThoughtSource [14] support systematic CoT evaluation across diverse domains, but recent evidence shows that the verbalized chains of the models are not always faithful by [2], which shows that reasoning models can omit crucial shortcuts (e.g., hidden hints or implicit translations—suggesting a misalignment between the true internal process and the stated CoT). Complementary analysis by [13] indicates that LLMs reuse reasoning patterns through “concept vectors” encoding structural relationships consistently across tasks, implying that models map new problems to analogously solved ones through shared building blocks.

# 6.2. Hub Languages and Reasoning in Multilingual LLMs

The concept of a “hub language” facilitating cross-lingual understanding originated in information retrieval, where [16] showed how resource-rich languages like English could bridge document retrieval between language pairs lacking direct comparable corpora. Building on this, [20] proposed the “Semantic Hub Hypothesis”, suggesting LLMs develop a shared representation space across languages, with the model’s dominant pretraining language (typically English) scaffolding this hub and influencing outputs in other languages. Further evidence from [17] demonstrates, through logit lens analysis, that non-English inputs are often processed via English-aligned representations in intermediate layers before translation back to the input language. Behaviorally, [4] found LLMs achieve superior performance when non-English inputs are first translated to English for processing. These findings suggest many LLMs default to an English-centric reasoning pathway internally despite their multilingual capabilities. Our research contributes to this discussion by systematically analyzing reasoning in LRMs (Section 3) and the impact of forcing reasoning in specific languages (Sections 4.1 and 4.2).

# 7. Conclusion

In this work, we reveal that LRMs, despite their strong multilingual ability, predominantly still prefer to reason in hub languages such as English, regardless of the input language. Our introduction of a text pre-filling method provides a practical approach to guide the reasoning language with high success. We demonstrated an asymmetric effect: forcing models to reason in non-hub languages degrades performance in low-resource languages, whereas aligning reasoning with hub languages improves or maintains the

performance in reasoning tasks. However, in the cultural reasoning task, native-language reasoning can be beneficial. These findings underscore the critical importance of considering the internal reasoning language to be more inclusive for future models.

# 8. Limitations

In our work, we only study eight languages, which may not fully represent the diversity of global languages, particularly extremely low-resource ones. Our reasoning-analysis pipeline depends on LLM annotators and a relatively coarse four-habit taxonomy, which may mask subtler reasoning strategies that differ across languages. While we identify significant correlations between languages and reasoning approaches, we cannot establish causal relationships without more controlled experiments. Additionally, our analysis is limited to medium-scale LRMs $\left( < 3 0 \mathrm { B } \right)$ , and the reasoning hub phenomenon may evolve as model scales.

# References

[1] Allan BI Bernardo and Marissa O Calleja. The effects of stating problems in bilingual students’ first and second languages on solving mathematical word problems. The Journal of Genetic Psychology, 166(1):117–129, 2005.   
[2] Yanda Chen, Joe Benton, Ansh Radhakrishnan, Jonathan Uesato, Carson Denison, John Schulman, Arushi Somani, Peter Hase, Misha Wagner, Fabien Roger, et al. Reasoning models don’t always say what they think. arXiv preprint arXiv:2505.05410, 2025.   
[3] Yu Ying Chiu, Liwei Jiang, Bill Yuchen Lin, Chan Young Park, Shuyue Stella Li, Sahithya Ravi, Mehar Bhatia, Maria Antoniak, Yulia Tsvetkov, Vered Shwartz, et al. Culturalbench: a robust, diverse and challenging benchmark on measuring the (lack of) cultural knowledge of llms. arXiv preprint arXiv:2410.02677, 2024.   
[4] Julen Etxaniz, Gorka Azkune, Aitor Soroa, Oier Lacalle, and Mikel Artetxe. Do multilingual language models think better in english? In Proceedings of the 2024 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies (Volume 2: Short Papers), pages 550–564, 2024.   
[5] Kanishk Gandhi, Ayush Chakravarthy, Anikait Singh, Nathan Lile, and Noah D Goodman. Cognitive behaviors that enable self-improving reasoners, or, four habits of highly effective stars. arXiv preprint arXiv:2503.01307, 2025.   
[6] Daya Guo, Dejian Yang, Haowei Zhang, Junxiao Song, Ruoyu Zhang, Runxin Xu, Qihao Zhu, Shirong Ma, Peiyi Wang, Xiao Bi, et al. Deepseek-r1: Incentivizing reasoning capability in llms via reinforcement learning. arXiv preprint arXiv:2501.12948, 2025.   
[7] Dan Hendrycks, Collin Burns, Steven Basart, Andy Zou, Mantas Mazeika, Dawn Song, and Jacob Steinhardt. Measuring massive multitask language understanding. arXiv preprint arXiv:2009.03300, 2020.

[8] Dan Hendrycks, Collin Burns, Saurav Kadavath, Akul Arora, Steven Basart, Eric Tang, Dawn Song, and Jacob Steinhardt. Measuring mathematical problem solving with the math dataset. arXiv preprint arXiv:2103.03874, 2021.   
[9] Dan Hendrycks, Collin Burns, Saurav Kadavath, Akul Arora, Steven Basart, Eric Tang, Dawn Song, and Jacob Steinhardt. Measuring mathematical problem solving with the math dataset. arXiv preprint arXiv:2103.03874, 2021.   
[10] Aaron Jaech, Adam Kalai, Adam Lerer, Adam Richardson, Ahmed El-Kishky, Aiden Low, Alec Helyar, Aleksander Madry, Alex Beutel, Alex Carney, et al. Openai o1 system card. arXiv preprint arXiv:2412.16720, 2024.   
[11] Naman Jain, King Han, Alex Gu, Wen-Ding Li, Fanjia Yan, Tianjun Zhang, Sida Wang, Armando Solar-Lezama, Koushik Sen, and Ion Stoica. Livecodebench: Holistic and contamination free evaluation of large language models for code. arXiv preprint arXiv:2403.07974, 2024.   
[12] Niklas Muennighoff, Zitong Yang, Weijia Shi, Xiang Lisa Li, Li Fei-Fei, Hannaneh Hajishirzi, Luke Zettlemoyer, Percy Liang, Emmanuel Candès, and Tatsunori Hashimoto. s1: Simple test-time scaling. arXiv preprint arXiv:2501.19393, 2025.   
[13] Gustaw Opiełka, Hannes Rosenbusch, and Claire E Stevenson. Analogical reasoning inside large language models: Concept vectors and the limits of abstraction. arXiv preprint arXiv:2503.03666, 2025.   
[14] Simon Ott, Konstantin Hebenstreit, Valentin Liévin, Christoffer Egeberg Hother, Milad Moradi, Maximilian Mayrhauser, Robert Praas, Ole Winther, and Matthias Samwald. Thoughtsource: A central hub for large language model reasoning data. Scientific data, 10(1):528, 2023.   
[15] David Rein, Betty Li Hou, Asa Cooper Stickland, Jackson Petty, Richard Yuanzhe Pang, Julien Dirani, Julian Michael, and Samuel R Bowman. Gpqa: A graduate-level google-proof q&a benchmark. arXiv preprint arXiv:2311.12022, 2023.   
[16] Jan Rupnik, Andrej Muhic, and P Skraba. Cross-lingual document retrieval through hub languages. In Neural Information Processing Systems Workshop, 2012.   
[17] Lisa Schut, Yarin Gal, and Sebastian Farquhar. Do multilingual llms think in english? arXiv preprint arXiv:2502.15603, 2025.   
[18] Freda Shi, Mirac Suzgun, Markus Freitag, Xuezhi Wang, Suraj Srivats, Soroush Vosoughi, Hyung Won Chung, Yi Tay, Sebastian Ruder, Denny Zhou, et al. Language models are multilingual chain-ofthought reasoners. In The Eleventh International Conference on Learning Representations, 2023.   
[19] Benjamin Warner, Antoine Chaffin, Benjamin Clavié, Orion Weller, Oskar Hallström, Said Taghadouini, Alexis Gallagher, Raja Biswas, Faisal Ladhak, Tom Aarsen, et al. Smarter, better, faster, longer: A modern bidirectional encoder for fast, memory efficient, and long context finetuning and inference. arXiv preprint arXiv:2412.13663, 2024.   
[20] Zhaofeng Wu, Xinyan Velocity Yu, Dani Yogatama, Jiasen Lu, and Yoon Kim. The semantic hub hypothesis: Language models share semantic representations across languages and modalities. arXiv preprint arXiv:2411.04986, 2024.

[21] Yixin Ye, Zhen Huang, Yang Xiao, Ethan Chern, Shijie Xia, and Pengfei Liu. Limo: Less is more for reasoning. arXiv preprint arXiv:2502.03387, 2025.   
[22] Longhui Yu, Weisen Jiang, Han Shi, Jincheng Yu, Zhengying Liu, Yu Zhang, James T Kwok, Zhenguo Li, Adrian Weller, and Weiyang Liu. Metamath: Bootstrap your own mathematical questions for large language models. arXiv preprint arXiv:2309.12284, 2023.   
[23] Zhexin Zhang, Leqi Lei, Lindong Wu, Rui Sun, Yongkang Huang, Chong Long, Xiao Liu, Xuanyu Lei, Jie Tang, and Minlie Huang. Safetybench: Evaluating the safety of large language models with multiple choice questions. arXiv preprint arXiv:2309.07045, 2023.   
[24] Lianmin Zheng, Wei-Lin Chiang, Ying Sheng, Tianle Li, Siyuan Zhuang, Zhanghao Wu, Yonghao Zhuang, Zhuohan Li, Zi Lin, Eric P Xing, et al. Lmsys-chat-1m: A large-scale real-world llm conversation dataset. arXiv preprint arXiv:2309.11998, 2023.

Table 4 ∣ Decoding parameters used for each model during evaluation.   

<table><tr><td>Model</td><td>Temperature</td><td>Top-p</td><td>Top-k</td><td>Min-p</td></tr><tr><td>DeepSeek-R1-Distill-Llama-8B</td><td>0.6</td><td>0.95</td><td>—</td><td>—</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>0.6</td><td>0.95</td><td>—</td><td>—</td></tr><tr><td>Qwen3-30B-A3B (reasoning on / off)</td><td>0.6</td><td>0.95</td><td>20</td><td>0</td></tr><tr><td>QwQ-32B</td><td>0.6</td><td>0.95</td><td>—</td><td>0</td></tr></table>

# Appendices

# A. Model Details

We use the latest sglang inference engine to evaluate all open weights model on A100 GPU with the exception of QwQ-32B which uses Together.ai serverless API endpoint.

As of the decoding parameters we used for all models which was recommended by original model provider Table 4.

For the base model experiments found in Table 14, we simply set temperature $= 0 . 6$ only.

# A.1. Inference Cost

QwQ-32B cost around 600 USD for all the experiments including ablation studies in scaling efficiency. While other models: Deepseek-Distill-Qwen-14B, Deepseek-Distill-Llama-8B, Qwen3-30B-A3B cost around 1,200 USD in A100 GPUs cost calculated at 1.8 USD per hour per card.

The entire inference process took over 2 weeks to finish under 2 A100 GPUs, using the latest sglang inference service.

Table 5 ∣ Data Count Distribution Across Models   

<table><tr><td>Model</td><td>Count</td></tr><tr><td>deepseek-r1-zero</td><td>647</td></tr><tr><td>meta math</td><td>539</td></tr><tr><td>gemini-flash-thinking</td><td>530</td></tr><tr><td>deepseek-r1</td><td>517</td></tr><tr><td>qwq-preview</td><td>506</td></tr><tr><td>metamath-qwen</td><td>402</td></tr><tr><td>openr1-preview</td><td>116</td></tr><tr><td>claude-3-7</td><td>47</td></tr></table>

# B. Reasoning Process Analysis

# B.1. Segmentation Details

In this section we provided the details we used to curate dataset and the training our segmentation model.

Dataset We collect existing reasoning dataset shared by others from huggingface. We mainly collect reasoning process from Deepseek-R1, Deepseek-R1-Zero, Gemini-2.0-Flash, Claude-3-7-Sonnet, QwQpreview, MetaMath CoT response [22] and Open-R1 : an attempt to generate long CoT from Qwen models. The amount of reasonings from each models can be found in Table 5. For each reasoning, we prompt gpt-4o-2024-07-18 with 1-shot segmentation prompt to segment the reasoning text into steps. Prompts can be found in Figure 8. The raw output is then processed into a sequence chunk which we can used to train a small segmentation model. The annotation cost around 35 USD without any batch discount.

Hyperparameters We split the dataset into 7:3 train and validation set. And we simply use the validation to select the best hyperparameters as found in Table 6 which achieve a high F1 score of 96.08. Training a single hyperparameters took around 4 hours to finished on 4090 GPU.

Inputs and Target Formats Figure 7 illustrates the ModernBERT segmentation process. For each thinking process extracted from model responses, we first split the text by newline symbols, replacing each with a special token $\left( < s \mathrm { e p } > \right)$ . The model is trained to predict whether each ${ < s e p > }$ token indicates the beginning of a new reasoning step (1) or the continuation of the current step (0). As shown in the figure, ModernBERT takes a reasoning sequence as input (top) and processes mathematical expressions $( \tt x + y = 5$ , $\mathbf { y } = 5 \cdot \mathbf { x } , \mathbf { z } + \mathbf { y } = 1 0 )$ , classifying each separator position to enable structured parsing of complex reasoning chains. This binary classification approach allows the model to effectively identify logical breakpoints in reasoning processes.

Table 6 ∣ Training Parameters for ModernBERT-large   

<table><tr><td>Parameter</td><td>Best</td><td>Searched</td></tr><tr><td>Learning Rate</td><td>8 × 10-5</td><td>{5 × 10-5, 8 × 10-5, 1 × 10-4, 3 × 10-4}</td></tr><tr><td>Batch Size</td><td>24</td><td>{16, 24, 32}</td></tr><tr><td>Weight Decay</td><td>0.01</td><td>-</td></tr><tr><td>Number of Epochs</td><td>10</td><td>-</td></tr><tr><td>Warmup Steps</td><td>50</td><td>-</td></tr><tr><td>Optimizer</td><td>AdamW</td><td>-</td></tr></table>

![](images/06f7da8b8cb11e1b407f4c145c189c92463488e8e048799b3e20c2fc32e105a6.jpg)  
Figure 7 ∣ A showcase of how segmentation prediction works

```txt
Output your segmentation result by adding a <sep> to the original text to indicate a separation between steps  
Do not modify the original reasoning text, only add a separation token  
Do not split table into segments, keep a whole table as one step  
# Example  
[INPUT]:  
Okay, let's see. ...  
Alright, let's break this down. First, ...  
**Final Answer**  
\boxed{251.60}  
[OUTPUT]:  
Okay, let's see. So ...  
<sep>  
Alright, let's break this down. ...  
[Skip for brevity]  
...  
<sep>  
**Final Answer**  
\boxed{251.60}  
Now do the same task by following the same pattern as above:  
[INPUT]:  
thinking process goes here  
[OUTPUT]: 
```

Figure 8 ∣ The prompt template for segmenting reasoning steps with <sep> tokens.

# B.2. Reasoning Process Classification

After segmentation, we concatenate the individual reasoning processes using numbered step tokens (e.g., <step_ $1 >$ reasoning process 1 <step_1>\n <step_ $2 >$ reasoning process $2 < \mathsf { s t e p } \_ 2 { > } \ldots )$ . This structured sequence, along with the original question, is then passed to a classification prompt as illustrated in Figure 9. We utilize gemini-2.0-flash to perform the classification of each reasoning step according to our taxonomy.

While we initially explored more sophisticated taxonomies that included problem reading and abduction classification, the complexity of these frameworks exceeded the classification capabilities of current LLMs, limiting potential downstream insights. We therefore opted for the simpler four-habits taxonomy. Investigating more complex taxonomies remains an avenue for future research.

```txt
Here is a problem and the reasoning process that an LLM generated when it tries to solve the problem. Problem: (enclosed in double backticks) problem Reasoning process: (enclosed in triple backticks, the reasoning process has been split into distinct reasoning steps in the format of <step_idx><reasoning_step_content></step_idx>) reasoning Your task is to classify each reasoning step into one of the following reasoning types: (specified by <type_index>.<type_name>：<definition>) 1. Subgoal setting: Where the model breaks down the problem into smaller, intermediate goals (e.g., 'To solve this, we first need to...' or 'First, I'll try to ..., then ...' 2. Backtracking: Where the model realizes a path won't work and explicitly goes back to try a different approach. An example of backtracking is: 'Let me try again' or 'we need to try a different approach'. 3. Verification: Where the model checks the correctness of the intermediate results or to make sure the final answer is correct. 4. Backward chaining: Where the model works backward from its answer to see whether it can derive the variables in the original problem. 5. Others: This reasoning step is the continuation of the previous reasoning step, or it does not fall into any of the above categories. Generate the rationale before you make the classification. Provide your output in the following format: [Reasoning] <step_1><rationale_1><type_name_1></step_1> <step_2><rationale_2><type_name_2></step_2> ... [Final answer] <step_1><type_name_1></step_1> <step_2><type_name_2></step_2> ... 
```

Figure 9 ∣ The prompt template for the classifying each steps into four habits classes.

Table 7 ∣ Comparison between Counting [5] and seg-class (ours) methods for R1-Distill-Llama-8B on MATH -500 benchmark (English problem statements; generation prefixed with target language)   

<table><tr><td rowspan="2">Lang</td><td colspan="2">Subgoal setting</td><td colspan="2">Backtracking</td><td colspan="2">Verification</td><td colspan="2">Backward chaining</td></tr><tr><td>Count</td><td>seg-class</td><td>Count</td><td>seg-class</td><td>Count</td><td>seg-class</td><td>Count</td><td>seg-class</td></tr><tr><td>En</td><td>6.02</td><td>2.73</td><td>4.66</td><td>0.76</td><td>6.90</td><td>7.27</td><td>2.45</td><td>0.016</td></tr><tr><td>Zh</td><td>6.83</td><td>3.26</td><td>5.89</td><td>0.65</td><td>7.76</td><td>8.45</td><td>2.49</td><td>0.018</td></tr><tr><td>Es</td><td>3.67</td><td>1.81</td><td>0.76</td><td>0.18</td><td>1.61</td><td>0.34</td><td>0.48</td><td>0.0</td></tr><tr><td>Ru</td><td>6.46</td><td>2.84</td><td>5.27</td><td>0.84</td><td>6.67</td><td>5.34</td><td>2.87</td><td>0.006</td></tr><tr><td>Ja</td><td>5.08</td><td>2.97</td><td>1.87</td><td>0.60</td><td>8.53</td><td>3.58</td><td>0.81</td><td>0.004</td></tr><tr><td>Ko</td><td>5.29</td><td>2.36</td><td>2.58</td><td>0.39</td><td>4.82</td><td>5.06</td><td>1.65</td><td>0.006</td></tr><tr><td>Te</td><td>2.67</td><td>0.68</td><td>1.29</td><td>0.17</td><td>2.08</td><td>1.11</td><td>1.36</td><td>0.0</td></tr><tr><td>Sw</td><td>4.62</td><td>1.32</td><td>1.51</td><td>0.23</td><td>4.07</td><td>1.33</td><td>1.58</td><td>0.011</td></tr></table>

# B.3. Comparison of Segmentation-Classification and Prompt-base Counting Method

In this section, we showcase the behavior calculated by the prior work [5] using counting prompt and compared to our segmentation-classification method (seg-class). As seen in the results, our result always resulted in lower behavior numbers than Counting method.

# C. Limiting Tokens to Control Output Language

We explore the idea of limiting the available allowed tokens during decoding to force LRM to output in a certain language. This solution would allows more freedom of what kind of reasoning compare to our method which seeds the initial reasoning with a opening phrase.

We first indentify tokens which uses to generate our target languages from Distill-Llama-8B. In Llama 3 tokenizers, we found 4,225 tokens are Chinese text generation, 1,410 tokens are related to Japanese text generation. The low amount of Japanese tokens may limits the capabilities of final results as LLMs can only output from only 1410 tokens. This exposed the limitations of using masking as a way to limit reasoning language.

Table 8 ∣ Results on Llama-8B with Japanese prefill with “まず” and “嗯”, comparing Prefill Target Language and   

<table><tr><td>Target Language</td><td>Japanese (%)</td><td>Chinese (%)</td></tr><tr><td>Input=English, Prefill Target Language</td><td>64.8</td><td>67.8</td></tr><tr><td>- Thinking language (en/zh/native/no)</td><td>0.2 / 75.2 / 0.2 / 17.4</td><td>0.0 / 74.2 / 0.0 / 25.8</td></tr><tr><td>- Answer language (en/zh/native/no)</td><td>4.4/69.8/4.4/17.4</td><td>0.8/71.4/0.8/25.8</td></tr><tr><td>Input=English, Masking non Target Tokens</td><td>61.4</td><td>69.6</td></tr><tr><td>- Thinking language (en/zh/native/no)</td><td>15.2/12.6/15.2/18.6</td><td>6.6/80.0/6.6/13.4</td></tr><tr><td>- Answer language (en/zh/native/no)</td><td>35.0/18.8/35.0/18.6</td><td>8.2/77.0/8.2/13.2</td></tr><tr><td>Input=Target, Prefill Target Language</td><td>32.6</td><td>73.6</td></tr><tr><td>- Thinking language (en/zh/native/no)</td><td>0.2/14.8/75.0/9.8</td><td>0.0/73.8/73.8/26.2</td></tr><tr><td>- Answer language (en/zh/native/no)</td><td>2.4/18.4/67.2/9.8</td><td>0.2/71.6/71.6/26.2</td></tr><tr><td>Input=Target, Masking non Target Tokens</td><td>42.0</td><td>73.6</td></tr><tr><td>- Thinking language (en/zh/native/no)</td><td>0.6/18.4/63.6/17.0</td><td>0.0/92.0/92.0/8.0</td></tr><tr><td>- Answer language (en/zh/native/no)</td><td>4.6/21.2/54.6/17.0</td><td>0.2/89.4/89.4/8.0</td></tr></table>

# D. Prefill Phrases

# D.1. Distribution Found From MATH-500 Baseline

To find the distribution of prefill tokens across different languages and models, we analyzed the output generations from multiple language models on a subset of the MATH-500 baseline dataset. For each model and language combination, we recorded the first n tokens generated (where $\mathtt { n } { = } 4$ in our analysis) and tracked their frequencies across all sampled problems.

We implemented a token tracking system that builds up sequences by concatenating successive tokens (e.g., first token, first $^ +$ second tokens, etc.) and maintains frequency counts for each unique sequence at each position. For models where we had access to the tokenizer, we performed additional analysis by converting between token IDs and human-readable text, allowing us to identify meaningful phrases rather than just token sequences. This double decoding process was particularly valuable for non-Latin script languages where token boundaries might not align with linguistic units. The resulting distributions, shown in Table 9.

# D.2. CulturalBench Prefill Phrase

The following Table 10 showcase the phrases used to prefill target language in CultureBench-Hard.

Table 9 ∣ Most Frequent Starting Phrases by Model and Language, (-) indicate using the most common prefill target phrase from other models.   

<table><tr><td>Model</td><td>Language</td><td>Most Frequent Phrase</td><td>Count</td><td>Representative Phrase (Count)</td></tr><tr><td>R1-Distill-Llama-8B</td><td>es</td><td>Okay</td><td>248</td><td>Primero (224)</td></tr><tr><td>R1-Distill-Llama-8B</td><td>sw</td><td>Okay</td><td>253</td><td>Mama (62)</td></tr><tr><td>R1-Distill-Llama-8B</td><td>en</td><td>Okay</td><td>451</td><td>Okay (451)</td></tr><tr><td>R1-Distill-Llama-8B</td><td>ja</td><td>好,我现在要</td><td>196</td><td>まご (112)</td></tr><tr><td>R1-Distill-Llama-8B</td><td>ko</td><td>首先,我需要</td><td>107</td><td>—fromger (35)</td></tr><tr><td>R1-Distill-Llama-8B</td><td>ru</td><td>Xopoiio</td><td>130</td><td>Xopoiio (130)</td></tr><tr><td>R1-Distill-Llama-8B</td><td>zh-CN</td><td>嗯</td><td>305</td><td>嗯 (305)</td></tr><tr><td>Qwen-14B</td><td>es</td><td>Okay,</td><td>209</td><td>Primero (166)</td></tr><tr><td>Qwen-14B</td><td>sw</td><td>Okay, so I</td><td>173</td><td>Kwa (43)</td></tr><tr><td>Qwen-14B</td><td>en</td><td>Okay,</td><td>345</td><td>Okay (345)</td></tr><tr><td>Qwen-14B</td><td>ja</td><td>好,</td><td>204</td><td>まご (150)</td></tr><tr><td>Qwen-14B</td><td>ko</td><td>嗯,</td><td>204</td><td>—fromger (78)</td></tr><tr><td>Qwen-14B</td><td>ru</td><td>Xopoiio</td><td>278</td><td>Xopoiio (386)</td></tr><tr><td>Qwen-14B</td><td>zh-CN</td><td>首先,</td><td>181</td><td>首先 (181)</td></tr><tr><td>QwQ-32B</td><td>es</td><td>Okay,</td><td>489</td><td>Primero (3)</td></tr><tr><td>QwQ-32B</td><td>sw</td><td>Okay,</td><td>474</td><td>Ili kup (2)</td></tr><tr><td>QwQ-32B</td><td>en</td><td>Okay,</td><td>477</td><td>Okay, (477)</td></tr><tr><td>QwQ-32B</td><td>ja</td><td>Alright,</td><td>208</td><td>まご (123)</td></tr><tr><td>QwQ-32B</td><td>ko</td><td>鸯あ</td><td>220</td><td>鸯あ (220)</td></tr><tr><td>QwQ-32B</td><td>ru</td><td>Xopoiio</td><td>365</td><td>Xopoiio (365)</td></tr><tr><td>QwQ-32B</td><td>zh-CN</td><td>嗯,</td><td>479</td><td>嗯, (479)</td></tr><tr><td>QwQ-32B</td><td>te</td><td>Okay,</td><td>499</td><td>prārambhimcadāniki (-)</td></tr><tr><td>Qwen3-30B-A3B</td><td>es</td><td>Okay,</td><td>490</td><td>Primero (5)</td></tr><tr><td>Qwen3-30B-A3B</td><td>sw</td><td>Okay,</td><td>494</td><td>Ili kup (1)</td></tr><tr><td>Qwen3-30B-A3B</td><td>en</td><td>Okay,</td><td>487</td><td>Okay, (487)</td></tr><tr><td>Qwen3-30B-A3B</td><td>ja</td><td>Okay,</td><td>491</td><td>まご (5)</td></tr><tr><td>Qwen3-30B-A3B</td><td>te</td><td>Okay,</td><td>499</td><td>prārambhimcadāniki (3)</td></tr><tr><td>Qwen3-30B-A3B</td><td>ko</td><td>Okay,</td><td>491</td><td>鸯あ (2)</td></tr><tr><td>Qwen3-30B-A3B</td><td>ru</td><td>Xopoiio</td><td>490</td><td>Xopoiio (490)</td></tr><tr><td>Qwen3-30B-A3B</td><td>zh-CN</td><td>嗯,</td><td>487</td><td>嗯, (487)</td></tr></table>

Table 10 ∣ Preferred prefill tokens used by language models across different countries, reflecting culturallyspecific conversational cues.   

<table><tr><td>Country</td><td>Prefill token</td></tr><tr><td>Argentina</td><td>Vale</td></tr><tr><td>Australia</td><td>Okay</td></tr><tr><td>Brazil</td><td>Tudo bem</td></tr><tr><td>Canada</td><td>Okay</td></tr><tr><td>Chile</td><td>Vale</td></tr><tr><td>China</td><td>嗯</td></tr><tr><td>Czech Republic</td><td>Dobře</td></tr><tr><td>France</td><td>D&#x27;accord</td></tr><tr><td>Germany</td><td>In Ordnung</td></tr><tr><td>Hong Kong</td><td>嗯</td></tr><tr><td>Indonesia</td><td>Baiklah</td></tr><tr><td>Italy</td><td>Va bene</td></tr><tr><td>Japan</td><td>ます</td></tr><tr><td>Malaysia</td><td>Baiklah</td></tr><tr><td>Mexico</td><td>Órale</td></tr><tr><td>Netherlands</td><td>Oké</td></tr><tr><td>New Zealand</td><td>Okay</td></tr><tr><td>Nigeria</td><td>Okay</td></tr><tr><td>Peru</td><td>Ya</td></tr><tr><td>Philippines</td><td>Sige</td></tr><tr><td>Poland</td><td>Dobrze</td></tr><tr><td>Romania</td><td>Bine</td></tr><tr><td>Russia</td><td>Хоршо</td></tr><tr><td>Singapore</td><td>Okay</td></tr><tr><td>South Africa</td><td>Okay</td></tr><tr><td>South Korea</td><td>—from__</td></tr><tr><td>Spain</td><td>Vale</td></tr><tr><td>Taiwan</td><td>嗯</td></tr><tr><td>Turkey</td><td>Tamam</td></tr><tr><td>Ukraine</td><td>Добpe</td></tr><tr><td>United Kingdom</td><td>Alright</td></tr><tr><td>United States</td><td>Okay</td></tr><tr><td>Zimbabwe</td><td>Okay</td></tr></table>

Table 11 ∣ Comparison of English vs. Native prefill strategies on MATH-500 across languages order by speakers population.

Table 11 shows the scores of all models with the inclusion of baseline score.   

<table><tr><td>Strategy</td><td>Chinese</td><td>Spanish</td><td>Russian</td><td>Swahili</td><td>Japanese</td><td>Telugu</td><td>Korean</td></tr><tr><td colspan="8">DeepSeek-R1-Distill-Llama-8B</td></tr><tr><td>English Prefill</td><td>78.8%</td><td>80.2%</td><td>78.4%</td><td>37.0%</td><td>74.6%</td><td>42.2%</td><td>69.8%</td></tr><tr><td>Native Prefill</td><td>73.6%</td><td>45.6%</td><td>59.4%</td><td>3.8%</td><td>32.6%</td><td>16.8%</td><td>41.6%</td></tr><tr><td>Baseline</td><td>75.8%</td><td>70.6%</td><td>69.8%</td><td>27.3%</td><td>61.2%</td><td>41.6%</td><td>64.6%</td></tr><tr><td>Difference (EN - Native)</td><td>+5.2%</td><td>+34.6%</td><td>+19.0%</td><td>+33.2%</td><td>+42.0%</td><td>+25.4%</td><td>+28.2%</td></tr><tr><td colspan="8">DeepSeek-R1-Distill-Qwen-14B</td></tr><tr><td>English Prefill</td><td>88.4%</td><td>88.6%</td><td>86.6%</td><td>52.4%</td><td>85.2%</td><td>66.2%</td><td>84.4%</td></tr><tr><td>Native Prefill</td><td>89.8%</td><td>66.4%</td><td>86.4%</td><td>14.6%</td><td>63.6%</td><td>34.4%</td><td>83.8%</td></tr><tr><td>Baseline</td><td>82.6%</td><td>88.0%</td><td>84.6%</td><td>39.8%</td><td>80.0%</td><td>64.6%</td><td>83.4%</td></tr><tr><td>Difference (EN - Native)</td><td>-1.4%</td><td>+22.2%</td><td>+0.2%</td><td>+37.8%</td><td>+21.6%</td><td>+31.8%</td><td>+0.6%</td></tr><tr><td colspan="8">QwQ-32B</td></tr><tr><td>English Prefill</td><td>92.4%</td><td>92.2%</td><td>91.2%</td><td>67.8%</td><td>90.2%</td><td>84.4%</td><td>90.6%</td></tr><tr><td>Native Prefill</td><td>90.6%</td><td>93.2%</td><td>90.6%</td><td>55.6%</td><td>87.4%</td><td>65.2%</td><td>88.2%</td></tr><tr><td>Baseline</td><td>90.8%</td><td>93.2%</td><td>90.8%</td><td>68.2%</td><td>89.4%</td><td>85.0%</td><td>89.0%</td></tr><tr><td>Difference (EN - Native)</td><td>+1.8%</td><td>-1.0%</td><td>+0.6%</td><td>+12.2%</td><td>+2.8%</td><td>+19.2%</td><td>+2.4%</td></tr><tr><td colspan="8">Qwen3-30B-A3B</td></tr><tr><td>English Prefill</td><td>91.4%</td><td>91.0%</td><td>90.6%</td><td>72.4%</td><td>89.4%</td><td>87.0%</td><td>89.8%</td></tr><tr><td>Native Prefill</td><td>89.4%</td><td>83.8%</td><td>90.0%</td><td>29.6%</td><td>81.8%</td><td>68.4%</td><td>88.0%</td></tr><tr><td>Baseline</td><td>89.4%</td><td>91.2%</td><td>90.4%</td><td>72.8%</td><td>90.0%</td><td>87.7%</td><td>89.2%</td></tr><tr><td>Difference (EN - Native)</td><td>+2.0%</td><td>+7.2%</td><td>+0.6%</td><td>+42.8%</td><td>+7.6%</td><td>+18.6%</td><td>+1.8%</td></tr><tr><td colspan="8">Average across all models</td></tr><tr><td>English Prefill</td><td>87.7%</td><td>88.0%</td><td>86.7%</td><td>57.4%</td><td>84.9%</td><td>70.0%</td><td>83.7%</td></tr><tr><td>Native Prefill</td><td>85.9%</td><td>72.2%</td><td>81.6%</td><td>25.9%</td><td>66.3%</td><td>46.2%</td><td>75.4%</td></tr><tr><td>Baseline</td><td>84.6%</td><td>85.8%</td><td>83.9%</td><td>52.0%</td><td>80.2%</td><td>69.7%</td><td>81.5%</td></tr><tr><td>Difference (EN - Native)</td><td>+1.9%</td><td>+15.8%</td><td>+5.1%</td><td>+31.5%</td><td>+18.5%</td><td>+23.7%</td><td>+8.3%</td></tr></table>

# E. Additional MATH-500 Details

Table 12 ∣ Comparison of MMLU performance when reasoning in native language vs. English   

<table><tr><td>Strategy</td><td>English</td><td>Chinese</td><td>Spanish</td><td>Swahili</td><td>Japanese</td><td>Korean</td></tr><tr><td colspan="7">R1-Distill-Llama-8B</td></tr><tr><td>Prefill English</td><td>-</td><td>69.8%</td><td>71.4%</td><td>29.8%</td><td>65.3%</td><td>61.5%</td></tr><tr><td>Prefill target Language</td><td>67.7%</td><td>63.4%</td><td>53.8%</td><td>18.6%</td><td>46.2%</td><td>46.8%</td></tr><tr><td>Difference (EN - Native)</td><td>-</td><td>+6.4%</td><td>+17.6%</td><td>+11.2%</td><td>+19.1%</td><td>+14.6%</td></tr><tr><td colspan="7">Qwen-14B</td></tr><tr><td>Prefill English</td><td>-</td><td>84.7%</td><td>85.7%</td><td>44.5%</td><td>83.3%</td><td>81.1%</td></tr><tr><td>Prefill target Language</td><td>87.3%</td><td>83.3%</td><td>85.8%</td><td>36.4%</td><td>77.3%</td><td>73.4%</td></tr><tr><td>Difference (EN - Native)</td><td>-</td><td>+1.4%</td><td>-0.1%</td><td>+8.1%</td><td>+5.9%</td><td>+7.7%</td></tr><tr><td colspan="7">QwQ-32B</td></tr><tr><td>Prefill English</td><td>-</td><td>88.7%</td><td>89.1%</td><td>59.8%</td><td>87.8%</td><td>85.8%</td></tr><tr><td>Prefill target Language</td><td>91.4%</td><td>88.5%</td><td>89.2%</td><td>23.8%</td><td>88.3%</td><td>83.6%</td></tr><tr><td>Difference (EN - Native)</td><td>-</td><td>+0.3%</td><td>-0.1%</td><td>+36.0%</td><td>-0.5%</td><td>+2.2%</td></tr><tr><td colspan="7">Qwen3-30B-A3B</td></tr><tr><td>Prefill English</td><td>-</td><td>88.9%</td><td>89.0%</td><td>61.1%</td><td>86.8%</td><td>82.1%</td></tr><tr><td>Prefill target Language</td><td>85.4%</td><td>85.6%</td><td>86.0%</td><td>62.2%</td><td>84.2%</td><td>81.0%</td></tr><tr><td>Difference (EN - Native)</td><td>-</td><td>+3.3%</td><td>+3.0%</td><td>-1.0%</td><td>+2.7%</td><td>+1.1%</td></tr><tr><td colspan="7">Average across all models</td></tr><tr><td>Prefill English</td><td>-</td><td>83.1%</td><td>83.8%</td><td>48.8%</td><td>80.8%</td><td>77.6%</td></tr><tr><td>Prefill target Language</td><td>83.0%</td><td>80.2%</td><td>78.7%</td><td>35.3%</td><td>74.0%</td><td>71.2%</td></tr><tr><td>Difference (EN - Native)</td><td>-</td><td>+2.9%</td><td>+5.1%</td><td>+13.6%</td><td>+6.8%</td><td>+6.4%</td></tr></table>

# F. MMMLU Results

# F.1. MMMLU full models breakdown

Table 12 shows the full results for four models. We observe a significant jump in QwQ-32B where switching Swahili MMLU from English reasoning to Swahili reasoning drops by over $3 6 \%$ .

# F.2. Scores in subset versus full set

Table 13 showcases the accuracy between the 32 subjects and the full 56 subjects score. All settings consistently score higher than the full set; however, the correlation score between different settings is 0.9953 with a p-value lower than 0.0001. This means the subsets we have chosen are representative enough of the full MMMLU test set.

Table 13 ∣ Comparison of MMMLU partial (subset) and full accuracy scores across different models and language configurations.   

<table><tr><td>Model</td><td>Input</td><td>Reasoning</td><td>Partial Acc.</td><td>Full Acc.</td><td>Diff.</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>en</td><td>en</td><td>88.02%</td><td>85.61%</td><td>+2.41%</td></tr><tr><td>QwQ-32B</td><td>en</td><td>es</td><td>91.04%</td><td>88.52%</td><td>+2.52%</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>en</td><td>zh-CN</td><td>86.63%</td><td>84.09%</td><td>+2.54%</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>en</td><td>ko</td><td>85.40%</td><td>82.52%</td><td>+2.88%</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>es</td><td>en</td><td>85.69%</td><td>82.68%</td><td>+3.01%</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>en</td><td>es</td><td>84.63%</td><td>82.12%</td><td>+2.51%</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>en</td><td>ja</td><td>83.74%</td><td>81.29%</td><td>+2.45%</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>zh-CN</td><td>zh-CN</td><td>83.64%</td><td>80.33%</td><td>+3.31%</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>ja</td><td>en</td><td>83.26%</td><td>79.97%</td><td>+3.29%</td></tr><tr><td>DeepSeek-R1-Distill-Qwen-14B</td><td>ko</td><td>en</td><td>81.08%</td><td>78.02%</td><td>+3.06%</td></tr></table>

![](images/90875cc0add3a8f1eb85ff67e13701f2058160a2213c96443362638c747da95f.jpg)  
Figure 10 ∣ Sorted by positive improvements from using native language reasoning compare to english reasoning in Deepseek-Distill-Qwen-14B

![](images/87f1efa445a8f521919a73ad1f39fee72c116e4dec242aa81de63bb70bef323a.jpg)  
Figure 11 ∣ Sorted by positive improvements from using native language reasoning compare to english reasoning in Qwen3-30B-A3B

# G. CulturalBench Results

In CulturalBench, we maintained the original English questions while only varying the reasoning language. This approach preserves the precise wording of questions, as translation could potentially compromise the cultural nuances embedded in specific English terminology unique to each culture.

Figures 10, 11, and 12 illustrate the performance difference between using English prefills versus prefills in the predominant language of each respective country.

![](images/61c0700c85e2d0cfb68aa27515ec413abdb5609bd247a40e285bb569d0ec6701.jpg)  
Figure 12 ∣ Sorted by positive improvements from using native language reasoning compare to english reasoning in QwQ-32B

Table 14 ∣ AIME-24 pass $@ 8$ from Qwen3-30B-A3B base model with different initial phrase for text completion.   

<table><tr><td></td><td colspan="6">Language</td></tr><tr><td></td><td>en</td><td>zh-CN</td><td>ja</td><td>ru</td><td>ko</td><td>sw</td></tr><tr><td>Phrase</td><td>Okay</td><td>嗯</td><td>ます</td><td>Xopoшо</td><td>—from戸</td><td>Kwa kuzingatia</td></tr><tr><td>pass@8</td><td>0.267</td><td>0.190</td><td>0.172</td><td>0.133</td><td>0.133</td><td>0.200</td></tr></table>

# H. Study of Impact of Prefill Tokens in Pretrained Model

To investigate why models might gravitate towards English and Chinese for reasoning, we conducted an experiment using a small mathematics problem set, AIME-2024. Using the prompt template from Deepseek-R1-zero [6], we prompted the Qwen3-30B-A3B base model (without post-training) in a zeroshot pass $@ 8$ setting. To encourage reasoning in languages other than English, we prepended an initial phrase in the target language to the prompt, guiding the model to complete its reasoning in that language. The results, presented in Table 14, show that English-led reasoning significantly outperforms other languages for this base model.

Based on these findings, we hypothesize that during the RL training phase, models tend to exploit the language that allows the most effective CoT generation to maximize the final task score. Since the choice of reasoning language is typically not an explicit part of the reward function, leveraging the language in which the underlying base model performs best (as suggested by Table 14 for English) becomes an optimal strategy for achieving higher rewards.

Table 15 ∣ Comparison prefilling reasoning chain with native language or english in reasoning on, while prefilling the response in reasoning off, meaning the model does not undergo long CoT process before output response.   

<table><tr><td rowspan="2">MATH-500
Model Configuration</td><td colspan="6">Language</td></tr><tr><td>Chinese</td><td>Japanese</td><td>Korean</td><td>Spanish</td><td>Russian</td><td>Telugu</td></tr><tr><td>Qwen3 30 A3B (reasoning off)</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Prefill English (To evaluate)</td><td>84.8%</td><td>81.6%</td><td>80.0%</td><td>80.2%</td><td>82.2%</td><td>81.2%</td></tr><tr><td>Prefill Input Language</td><td>88.4%</td><td>80.8%</td><td>82.2%</td><td>81.2%</td><td>79.4%</td><td>68.3%</td></tr><tr><td>Difference (English - Input)</td><td>-3.6%</td><td>0.8%</td><td>-2.2%</td><td>1.0%</td><td>2.8%</td><td>12.9%</td></tr><tr><td>Qwen3 30 A3B (reasoning on)</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Prefill English (Okay)</td><td>91.4%</td><td>89.4%</td><td>89.8%</td><td>91.0%</td><td>90.6%</td><td>87.0%</td></tr><tr><td>Prefill Input Language</td><td>89.4%</td><td>81.8%</td><td>88.0%</td><td>83.8%</td><td>90.0%</td><td>68.4%</td></tr><tr><td>Difference (English - Input)</td><td>2%</td><td>7.6%</td><td>1.8%</td><td>7.2%</td><td>0.6%</td><td>18.6%</td></tr></table>

# I. Brittleness of language guidance in LRM compared to typical CoT found in LLMs

Since Qwen3-30B-A3B allows us to trigger reasoning mode on and off, we first compare the sensitivity between reasoning and normal CoT prompts. Specially we compare the results between prefilling the phrase in reasoning versus preflling in the response in CoT response with reasoning mode off. Table 15 shows that the penalty of changing reasoning language is far more worse than changing in typical chain of thought from LLMs.

Table 16 ∣ AI Dataset Information with Test Split Sizes   

<table><tr><td>Dataset</td><td>Test Split Size</td><td>License</td></tr><tr><td>MMMLU1</td><td>N = 14,042 (per language)</td><td>MIT License</td></tr><tr><td>CulturalBench-Hard2</td><td>N = 4,709</td><td>CC-BY-4.0</td></tr><tr><td>LMSYS-toxic3</td><td>N = 2,000 (per language)</td><td>LMSYS-Chat-1M Dataset License Agreement</td></tr><tr><td>MATH-5004</td><td>N = 500 (per language)</td><td>MIT License</td></tr></table>

# J. Dataset Details

Table 16 contains each of the benchmarks and their licenses.

# Languages:

• MMMLU: English, Spanish, Japanese, Korean, Swahili, Chinese   
• CulturalBench-Hard: 30 countries   
• LMSYS-toxic: English, Japanese, Spanish, Korean, Swahili, Telugu, Russian, Chinese   
• MATH-500: English, Japanese, Korean, Spanish, Swahili, Telugu, Russian, Chinese

HuggingFace Link: 1 MMMLU: https://huggingface.co/datasets/openai/MMMLU

2 CulturalBench: https://huggingface.co/datasets/kellycyy/CulturalBench   
3 LMsys-Chat-1M: https://huggingface.co/datasets/lmsys/lmsys-chat-1m   
4 MATH-500: https://huggingface.co/datasets/HuggingFaceH4/MATH-500

Table 17 ∣ Correlation between prefill target languages and reasoning behaviors   

<table><tr><td>Language</td><td>Backtrack</td><td>Backward</td><td>Subgoal Setting</td><td>Verification</td></tr><tr><td>English</td><td>-0.07</td><td>0.34**</td><td>0.22</td><td>0.07</td></tr><tr><td>Spanish</td><td>0.08</td><td>-0.16</td><td>-0.27*</td><td>-0.26*</td></tr><tr><td>Japanese</td><td>0.16</td><td>-0.19</td><td>-0.19</td><td>-0.29*</td></tr><tr><td>Korean</td><td>-0.03</td><td>0.12</td><td>0.02</td><td>0.05</td></tr><tr><td>Russian</td><td>-0.06</td><td>0.02</td><td>0.09</td><td>0.05</td></tr><tr><td>Swahili</td><td>-0.22</td><td>-0.25*</td><td>-0.35**</td><td>0.16</td></tr><tr><td>Telugu</td><td>-0.01</td><td>-0.18</td><td>-0.12</td><td>-0.20</td></tr><tr><td>zh-CN</td><td>0.23*</td><td>0.02</td><td>0.50***</td><td>0.41***</td></tr></table>

∗ ?? < 0.05, ∗∗ ?? < 0.01, ∗∗∗ ?? < 0.001

Table 18 ∣ Correlation between input target languages and reasoning behaviors   

<table><tr><td>Language</td><td>Backtrack</td><td>Backward</td><td>Subgoal Setting</td><td>Verification</td></tr><tr><td>English</td><td>-0.07</td><td>0.08</td><td>0.00</td><td>0.08</td></tr><tr><td>Spanish</td><td>-0.07</td><td>-0.08</td><td>-0.19</td><td>-0.22</td></tr><tr><td>Japanese</td><td>0.14</td><td>0.01</td><td>-0.14</td><td>-0.19</td></tr><tr><td>Korean</td><td>-0.06</td><td>0.18</td><td>0.04</td><td>0.03</td></tr><tr><td>Russian</td><td>-0.10</td><td>0.00</td><td>0.09</td><td>0.07</td></tr><tr><td>Swahili</td><td>-0.13</td><td>-0.10</td><td>-0.19</td><td>0.09</td></tr><tr><td>Telugu</td><td>0.08</td><td>-0.09</td><td>0.02</td><td>-0.14</td></tr><tr><td>zh-CN</td><td>0.19</td><td>0.04</td><td>0.42***</td><td>0.33**</td></tr></table>

∗ ?? < 0.05, ∗∗ ?? < 0.01, ∗∗∗ ?? < 0.001 来

# K. Behavior Results Detail for MATH-500

This section details the behavioral results observed for the MATH-500 dataset, specifically examining the correlation between language and various reasoning behaviors. The analysis, as presented in Tables 17 and 18, investigates how different languages, when used either as prefill tokens to guide the model’s internal “thought” process or as the input language of the problems themselves, influence reasoning strategies such as backtracking, backward chaining, subgoal setting, and verification. Notably, Chinese (zh-CN) prefill tokens show a strong positive correlation with subgoal setting $( r = 0 . 5 0$ , $p < 0 . 0 0 1 $ ) and verification (?? = 0.41, $p < 0 . 0 0 1 \jmath$ ). Conversely, English prefill is significantly positively correlated with backward chaining (?? = 0.34, $p < 0 . 0 1 \AA$ ), while Swahili shows a significant negative correlation with subgoal setting $( r = - 0 . 3 5$ , $p < 0 . 0 1 )$ when used as a prefill language. When considering input languages, Chinese again demonstrates a significant positive correlation with subgoal setting $( r = 0 . 4 2$ , ?? < 0.001) and verification $( r = 0 . 3 3 , p < 0 . 0 1 )$ . These findings suggest that linguistic context, whether from prefill or input, can systematically influence the reasoning patterns employed by the models when tackling mathematical problems.