---
layout: page
title: Pay Better Attention to Attention: Head Selection in Multilingual and Multi-Domain Sequence Modeling
---

# Pay Better Attention to Attention: Head Selection in Multilingual and Multi-Domain Sequence Modeling

Hongyu Gong, Yun Tang, Juan Pino, Xian Li

Facebook AI Research

{hygong, yuntang, juancarabina, xianl}@fb.com

## Abstract

Multi-head attention has each of the attention heads collect salient information from different parts of an input sequence, making it a powerful mechanism for sequence modeling. Multilingual and multi-domain learning are common scenarios for sequence modeling, where the key challenge is to maximize positive transfer and mitigate negative transfer across languages and domains. In this paper, we find that non-selective attention sharing is sub-optimal for achieving good generalization across all languages and domains. We further propose attention sharing strategies to facilitate parameter sharing and specialization in multilingual and multi-domain sequence modeling. Our approach automatically learns shared and specialized attention heads for different languages and domains to mitigate their interference. Evaluated in various tasks including speech recognition, text-to-text and speech-totext translation, the proposed attention sharing strategies consistently bring gains to sequence models built upon multi-head attention. For speech-to-text translation, our approach yields an average of +2.0 BLEU over 13 language directions in multilingual setting and +2.0 BLEU over 3 domains in multi-domain setting.

## 1 Introduction

Recent progress on deep learning models, in particular multi-head attention, has brought significant gains to sequence modeling tasks including speech recognition (Moritz et al., 2020), text-to-text translation (Vaswani et al., 2017), and speech-to-text translation (Vila et al., 2018; Gangi et al., 2019). Attention mechanism allows a model to focus on informative parts of the inputs, and multi-head attention computes attention over inputs by multiple heads independently. With each head attending to different information, multi-head attention potentially captures more complicated data patterns and extracts sophisticated knowledge.

Sequence modeling has attracted a lot of research interest in multilingual and multi-domain settings, where a model is trained on data in multiple language directions and data from different domains respectively. Key advantages of these settings are better data efficiency and the support of knowledge transfer among languages or domains. This is critical for resource-limited scenarios. For example, multilingual translation enhances the performance of low-resource languages via knowledge transfer from high-resource languages (Gu et al., 2018; Inaguma et al., 2019b). Given the data scarcity in individual domains, a common practice is to combine the data from various domains to augment the training set (Wang et al., 2020d). Another appealing aspect of multilingual or multi-domain models is their low deployment and maintenance costs compared with numerous models trained for individual language pairs or domains.

Despite the positive knowledge transfer, negative interference has also been observed in multilingual (or multi-domain) training especially when languages (or domains) are dissimilar. Recent studies reveal from the optimization perspective that conflicting gradients in shared parameters is one cause of interference between languages (or domains) (Yu et al., 2020). A promising direction for interference mitigation is to design better strategies of parameter sharing. In some previous works, sharing is based on the similarity between languages (or domains), which require expert knowledge or pre-computed relatedness (Wu et al., 2019). Recent studies also propose branches and components specific to languages (or domains) in addition to shared modules (Bapna and Firat, 2019; Guo et al., 2020).

In this work, we bring the mitigation of language and domain interference under a common umbrella, and tackle it by improving parameter sharing within multi-head attention. We propose strategies to select attention heads for different languages or domains. Instead of sharing everything across languages or domains, our model automatically learns to share heads among a subset of languages or domains. It encourages positive transfer within the subset and preserves their specificity without interference from outside the subset. The major contributions of this work are summarized below:

1. We propose attention head selection to mitigate interference in multilingual and multi-domain modeling;

2. The parameter sharing strategies are lightweight and preserve computational efficiency;

3. We extensively evaluate attention sharing strategies on various sequence modeling tasks including speech recognition, text-to-text and speech-to-text translation. Consistent gains are achieved across multiple benchmark datasets.

The paper is structured as follows. Section 2 discusses related works on sequence modeling in multilingual and multi-domain setting. In Section 3, we introduce the proposed strategies of head selection in multi-head attention. Section 4 describes the empirical evaluation, followed by a discussion in Section 5. We conclude this paper in Section 6.

## 2 Related Work

Multilingual learning. Multilingual modeling has the potential to improve low-resource language performance through knowledge transfer from high-resource languages, and it draws great interest from researchers in speech recognition and translation (Pratap et al., 2020; Heigold et al., 2013; Johnson et al., 2017; Dabre et al., 2020; Liu et al., 2020; Inaguma et al., 2019a; Li et al., 2020). Although impressive progress has been made for low-resource or zero-shot tasks, it is also found the multilingual model has inferior performance on high-resource tasks due to multilingual interference. In order to address this issue, some works focus on multilingual models with task-specific parameters. Different parameter sharing strategies are examined for the Transformer model (Sachan and Neubig, 2018). Attention dependent on target languages is proposed to enhance the multilingual translation performance (Blackwood et al., 2018). Treating multilingual modeling as an adaptation problem, Bapna and Firat (2019) first build a general multilingual model for all languages and then finetune newly added residual adapters for each language pair. Another thread of work is to increase the model capacity to compensate for the high-resource language loss (Pratap et al., 2020). Shazeer et al. (2017) propose mixture-of-experts and select RNN cells based on input tokens. Lepikhin et al. (2020) extend it to Transformer with FFN experts. Different from previous works, we propose strategies of attention sharing among languages in the level of attention heads for multilingual modeling.

Multi-domain learning. Similar to multilingual learning, multi-domain learning (MDL) can effectively utilize data from different domains but also suffers from interference due to inter-domain heterogeneity (Saunders, 2021; Pham et al., 2021). Previous works address this issue from two perspectives: optimization and model architecture. For the optimization aspect, attempts have been made to synchronize the learning speed of different tasks (Chen et al., 2018), adjust the gradients of individual tasks to alleviate gradient conflicts (Yu et al., 2020) and apply regularization to achieve better generalization in different domains (Dakwale and Monz, 2017; Khayrallah et al., 2018; Thomp son et al., 2019). In terms of model architecture, domain-specific labels (Kobus et al., 2017), word embedding (Zeng et al., 2018a), sub-networks (Wang et al., 2020d) are adopted to address the issue of domain divergence. The architecture can be specified during the general training with the mixed data from multiple domains (Wang et al., 2020d) or during the finetuning in individual domains (Bapna and Firat, 2019). In this work, we deal with domain interference by leveraging domain-specific attention heads in multi-head attention.

Attention selection. Selective self-attention networks proposes to apply masking to the inputs and pay more attention to content words (Geng et al., 2020). Liu et al. (2021) selects text-related image regions with attention in multi-modality translation. Compared to their methods, we conduct automatic attention head selection for different tasks and focus on mitigating task interference.

## 3 Model

In this section, we start with preliminaries of multi-head attention, and introduce our approach to attention interference mitigation. We put multilingual and multi-domain sequence modeling under the same umbrella in this study. For the simplicity of the following discussions, we refer to the two settings as multi-task modeling, where a task is one language or one domain. Different from the standard multi-head attention, our model provides more attention heads than those used in computation. Different subsets of heads are assigned to each task so that partial attention sharing enables knowledge transfer and meanwhile mitigates interference. We introduce latent variables to modulate head selection, and propose strategies to learn the head assignment to different tasks.

## 3.1 Preliminary

Multi-head attention. As a core module in Transformer, multi-head attention paramterizes each head with key, query and value transformation matrices (Vaswani et al., 2017). The token representation is transformed into key, query and value vectors via these transformations. Each head assigns the attention of this token over the input sequence based on the matching between its query vector and key vectors of other tokens. The value vectors are weighted by the attention as the contextualized token representation. It is passed through linear projection as the output of the attention head. Suppose that head h has output $\mathbf { x } ^ { ( h ) }$ . Multi-head attention with H heads yields an output x for the given token, which is the concatenation of all head outputs.

$$
\mathbf { x } = \mathbf { x } ^ { ( 1 ) } \oplus \cdots \oplus \mathbf { x } ^ { ( h ) } \oplus \cdots \oplus \mathbf { x } ^ { ( H ) } ,\tag{1}
$$

where ⊕ is vector concatenation.

Interference. Maximal parameter sharing aims to learn universal knowledge across languages (Wang et al., 2020e) and domains (Zeng et al., 2018b). To capture the task specificity, different languages or domains compete for model capacity, which is observed as the interference in previous studies. The interference results in degraded performance in jointly trained models. However, few works look into the improvement of parameter sharing within multi-head attention. This study explores head selection strategies to mitigate the inference in multilingual and multi-domain models.

## 3.2 Latent Variable for Head Selection

First, we outline our approach to learn a more general-purpose multi-head attention in Transformer from the Bayesian neural network perspective. Suppose that the input sequence is x and the output sequence is $y .$ For conditional sequence modeling tasks such as machine translation, the posterior of $p ( y \mid x )$ can be computed by marginalizing over the posterior of latent variable z, which modulates parameters Θ in the standard Transformer architecture:

$$
p ( y \mid x , \Theta ) = \mathbf { E } _ { p ( z \mid \Theta ) } [ p ( y \mid x , z ) ] = \int p ( y \mid x , z ) p ( z | \Theta ) \mathrm { d } z\tag{2}
$$

Parameterization of $z ,$ In this work, we define z as modulating the selection of attention heads. We model $z _ { t } ^ { ( h ) }$ as a discrete latent variable from a Bernoulli distribution with $z _ { t } ^ { ( h ) } \sim \mathcal { B } ( \pi ) , \pi \in [ 0 , 1 ]$ indicating whether task t selects attention head h. This modeling choice allows us to prune attention heads during computation, which preserves computation efficiency as well as regularizes training.

Marginalizing over z is intractable given numerous heads in neural models. Therefore, we use variational inference to derive an approximate solution. Specifically, we learn an inference network $q _ { \phi } ( z )$ , which is paramterized with φ, to approximate the true distribution $p ( z )$ and optimize the evidence lower bound (ELBO) of Eq. 2:

$$
\begin{array} { r } { \log p ( \boldsymbol { y } \mid \boldsymbol { x } ) \ge { \mathbf { E } } _ { \boldsymbol { q } _ { \phi } ( \boldsymbol { z } ) } [ \log p _ { \theta } ( \boldsymbol { y } \mid \boldsymbol { x } , \boldsymbol { z } ) ] - { \mathbf { K } } { \mathbf { L } } ( \boldsymbol { q } _ { \phi } ( \boldsymbol { z } ) \parallel p ( \boldsymbol { z } ) ) , } \end{array}\tag{3}
$$

where KL is the KL-divergence between two distributions. In our work, we assume identical probability of each head being selected. Therefore, we have $\begin{array} { r } { p ( z = 1 ) = \frac { H } { H ^ { \prime } } } \end{array}$ , where H and $H ^ { \prime }$ are numbers of selected heads and all head candidates.

Training and interference. We use the Gumbel-Softmax reparameterization (Jang et al., 2017) to draw samples of z from the posterior $q _ { \phi } ( z )$ . It makes the model end-to-end differentiable, while learning discrete policies of head selection without resorting to policy gradients. We adopt a lightweight estimator of $q _ { \phi } ( z )$ by directly learning the logit parameters $\{ \phi _ { t } ^ { ( h ) } \}$

$$
q _ { \phi } ( z _ { t } ^ { ( h ) } ) = \frac { \exp ( ( \phi _ { t } ^ { ( h ) } ( 1 ) + \epsilon ( 1 ) ) / \tau ) } { \sum _ { j \in \{ 0 , 1 \} } \exp ( ( \phi ^ { ( h ) } ( j ) + \epsilon ( j ) ) / \tau ) } , \epsilon \sim \mathcal { G } ( 0 , 1 )\tag{4}
$$

where $\mathcal { G } ( 0 , 1 )$ is the Gumbel distribution, and τ is a temperature hyperparameter which increases the discreteness of samples when $\tau  0$

We will discuss different head selection strategies in Section 3.3, which make binary selection decisions based on real-valued posterior $q _ { \phi } ( z _ { t } ^ { ( h ) } ) ,$ ).

## 3.3 Attention Selection Strategies

![](images/901ebb1a329b15a46e59cc311926b686c6001af8a9cc766ecaa060dcb9bb0abe.jpg)  
Figure 1: Attention sharing strategies. The blue heads are selected while the grey heads are not.

Suppose that the output dimension of multi-head attention is $d ,$ and the dimension of each attention head is $\frac { d } { H }$ . We provide a large pool of $H ^ { \prime } \left( H ^ { \prime } > H \right)$ attention head candidates in every Transformer layer, and $H ^ { \prime }$ is a hyperparameter controlling the search space size of attention selection strategies. The model requires attention outputs to have a consistent dimension $d ,$ so each task needs to select H heads among $H ^ { \prime }$ candidates. Knowledge transfer is enabled among tasks accessing the same attention heads, and interference is disabled among tasks without attention sharing. We introduce two strategies for the attention head selection: subset strategy and group strategy.

Subset strategy. The strategy is straightforward, and we compare the posterior $\{ q _ { \phi } ( z _ { t } ^ { ( h ) } ) : h \in$ $[ 1 , H ^ { \prime } ] \}$ of all ${ \bf \ddot { \boldsymbol { H } } ^ { \prime } }$ heads given a task t. A subset of H heads with the highest posterior are selected by the task, and there are $C _ { H } ^ { H ^ { \prime } }$ subset choices. The subset strategy is described in Fig. 1(a). The binary mask $s _ { t } ^ { ( h ) }$ indicate whether an attention head h is assigned to task t.

$$
s _ { t } ^ { ( h ) } = \left\{ \begin{array} { l l } { 1 , \quad } & { h \in \mathrm { T o p H } ( \{ q _ { \phi } ( z _ { t } ^ { ( h ) } ) \} ) , } \\ { 0 , \quad } & { \mathrm { o t h e r w i s e } , } \end{array} \right.\tag{5}
$$

where TopH(·) returns the top H heads with the highest values.

The outputs of the selected heads are concatenated as the attention output. Note that the subset strategy does not consider the order of the attention heads. For example, when head 2 and 3 are selected, head 2 contributes to the beginning part of attention output. With head 1 and 2 selected, the output of head 2 goes to the last part of the attention output.

Group strategy. We further propose group strategy to preserve the order of attention heads during head selection. Different from the subset strategy, the group strategy first divides $H ^ { \prime }$ heads into H groups. As is shown in Fig. 1(b), each group contains $\begin{array} { r }  r \end{array}$ candidates. Each task could choose one attention head from each group, and has access to H heads per layer. There are $r ^ { H }$ possible combinations of heads. The group strategy keeps the head order in that heads from group g only contribute to $g ^ { \star }$ s corresponding dimensions in the attention output. The head with the highest posterior in its group would be selected by a given task t. We use binary masks $\{ s _ { t } ^ { ( h ) } \}$ to indicate the selection of head h in group g.

$$
s _ { t } ^ { ( h ) } = \left\{ \begin{array} { l l } { 1 , \quad } & { h = \mathrm { a r g m a x } ( \{ q _ { \phi } ( z _ { t } ^ { ( h ^ { \prime } ) } ) : h ^ { \prime } \in g \} ) , } \\ { 0 , \quad } & { \mathrm { o t h e r w i s e } . } \end{array} \right.\tag{6}
$$

The output of group g is:

$$
\mathbf { x } ^ { ( g ) } = \sum _ { h \in g } s _ { t } ^ { ( h ) } \cdot \mathbf { x } ^ { ( h ) } .\tag{7}
$$

The outputs of H groups are concatenated as the output of the attention module for task t.

With either subset or group strategy, the sequence model is trained to assign attention heads to different tasks to maximize the lower bound in inequality (3). The number of additional parameters $\{ \phi _ { t } ^ { ( h ) } \}$ introduced by our attention selection is only $T \times H ^ { \prime } \times L$ , where T is the number of tasks, $\bar { H ^ { \prime } }$ is the number of head candidates per layer, and L is the number of layers. It is small compared with the total parameter size of the model, and head selection is thus lightweight and memory efficient. Moreover, the head selection is inherently a pruning process. Regardless of the size of head candidates, only a fixed number of attention heads are involved in computation for a given task. Hence our approach is also computationally efficient in both training and inference.

## 4 Experiments

We evaluate sequence models in multilingual and multi-domain settings respectively. Various applications are considered including multilingual machine translation (MT), automatic speech recognition (ASR) and speech translation (ST) in both multilingual and multi-domain settings. We include widely used sequence models built on multi-head attention as strong baselines. All baselines have an encoder-decoder architecture, leveraging attention in each encoder and decoder layer.

1.Transformer (Vaswani et al., 2017). It is a state-of-the-art model in machine translation, which takes texts in source languages as inputs and generates texts in target languages.

2. S2T Transformer (Wang et al., 2020a). As a variant of Transformer for speech recognition and translation, S2T Transformer takes audio features and generates target texts. It is a stack of a convolutional subsampler and a Transformer model, where the subsampler processes input features (i.e., log mel-filter features in our experiments) and sends them to Transformer for text generation.

3. Adapter model (Bapna and Firat, 2019). Adapters have been shown as an effective approach to language and domain adaptation. Based on a well-trained Transformer or S2T Transformer, task-specific layers are added on top of each encoder and decoder layer. Parameters of adapter layers are trained with other model parameters frozen. A typical adapter layer consists of two feed-forward sub-layers. Adapter is applied to every task in our experiments.

We integrate attention selection strategies into the self-attention<sup>1</sup> module. Our implementation is based on the FAIRSEQ toolkit (Ott et al., 2019; Wang et al., 2020b).

## 4.1 Machine Translation

The task of machine translation is to translate a text from the source language into the target language. BLEU is an evaluation metric in translation, which measures the overlap between model translations and the ground truth (Papineni et al., 2002). Higher BLEU reflects better translation quality.

Dataset. We experiment with public multilingual machine translation datasets collected by WMT shared tasks as used by (Liu et al., 2020). The dataset consists of parallel sentences between English and other 14 languages<sup>2</sup>. Its data statistics are summarized in Appendix A.1. We evaluate models on both one-to-many (O2M) and many-to-one (M2O) translations, which are translation from English to 14 languages and from 14 languages to English respectively.

Model configurations. All models have 6 encoder layers and 6 decoder layers with 4 attention heads per layer (i.e., H = 4). The embedding dimension is 512 and the feed-forward dimension is 1024. They are trained with a batch size of 131k tokens and a learning rate of 0.0007. For O2M translation, attention selection models and Transformer are trained for 140k steps. As for M2O translation, they are trained for 100k steps. The attention selection is based on the source language in the encoder side for M2O translation, and is based on the target language in the decoder part for O2M translation.

The adapter model is initialized with parameters from the trained Transformer. It then trains the new parameters of the adapter layers for 40k steps with Transformer parameters frozen. The adapter layers are added to Transformer for each language direction, and they have an intermediate dimension of 256. The dimension is selected so that the number of parameters (460M) in the adapter model is close to the parameter size (420M) in attention selection models. Our attention selection sets the number of attention head candidates as 8 in each layer (i.e., H<sup>0</sup> = 8) for both subset and group strategies. We will discuss how the hyperparamter H<sup>0</sup> affects model performance in Section 5.

Table 1: BLEU (↑) of Machine Translation on WMT Datasets (AVG-A: average BLEU over 14 directions, High and Low are average BLEU over high- and low-resource languages respectively.)
<table><tr><td rowspan="2"></td><td colspan="3">O2M</td><td colspan="3">M20</td></tr><tr><td>AVG-A</td><td>High</td><td>Low</td><td>AVG-A</td><td>High</td><td>Low</td></tr><tr><td>Transformer</td><td>20.1</td><td>25.7</td><td>16.0</td><td>22.8</td><td>27.9</td><td>19.0</td></tr><tr><td>Adapter</td><td>20.9</td><td>26.7</td><td>16.6</td><td>23.3</td><td>28.7</td><td>19.3</td></tr><tr><td>Group strategy</td><td>21.0</td><td>27.1</td><td>16.4</td><td>23.5</td><td>28.8</td><td>19.6</td></tr><tr><td>Subset strategy</td><td>20.9</td><td>27.0</td><td>16.4</td><td>23.3</td><td>28.7</td><td>19.4</td></tr></table>

Results. We group 14 language directions based on their amount of training data. We have 6 high-resource languages with more than 10M parallel sentences, 8 low-resource languages with fewer than 10M sentence pairs. Table 1 shows model performance on WMT datasets. Both attention selection and adapter models demonstrate gains over the multilingual Transformer. Group strategy achieves +0.9 and +0.7 BLEU on average of 14 language directions in O2M and M2O translations respectively. Adapter has comparable performance to both group and subset strategies. We note that adapter increases computational costs due to the additional 12 adapter layers added to Transformer, while the attention head selection approaches preserve the computation efficiency.

## 4.2 Speech Recognition

The task of Automatic Speech Recognition (ASR) is to transcribe source audios in the same language. Word error rate (WER) is ASR evaluation metric, which measures the difference of model outputs from the ground truth (Klakow and Peters, 2002). Lower WER indicates better recognition.

Model configuration. Models included in the experiments of speech recognition are S2T Transformer, S2T Transformer with adapter layers and S2T Transformer with attention selection. Following the setup of (Salesky et al., 2021), all models have 1024 channels in the input convolutional subsampler, 12 encoder layers and 6 decoder layers with 4 attention heads per layer. The embedding dimension is 256 and the feed-forward dimension is 2048. We set a batch size of 320k tokens and a learning rate of 0.0005 during training. Attention selection models and S2T Transformer are trained for 250 epochs. Adapter model is initialized with parameters of the trained S2T Transformer, and is then trained for another 200 epochs with only adapter layer parameters tuned. The intermediate dimension of adapter layers is again set as 256. To prevent over-fitting, we stop the model training when the model does not improve on the validation set for 10 epochs. To reduce the performance variance, we average checkpoints of the last 10 epochs, and use the averaged model for evaluation.

## 4.2.1 Multilingual Speech Recognition

Dataset. We use the multilingual TEDx (mTEDx) dataset for speech recognition (Salesky et al., 2021). It collects audio recordings from TEDx talks. Eight languages are covered including Arabic (ar), German (de), Greek (el), Spanish (es), French (fr), Italian (it), Portuguese (pt) and Russian (ru).

Table 2: WER (↓) of Speech Recognition on mTEDx Dataset
<table><tr><td></td><td>AVG</td><td>ar</td><td>de</td><td>el</td><td>es</td><td>fr</td><td>it</td><td>pt</td><td>ru</td></tr><tr><td>S2T Transformer</td><td>49.0</td><td>109.5</td><td>72.3</td><td>43.3</td><td>23.9</td><td>27.8</td><td>28.6</td><td>31.0</td><td>55.3</td></tr><tr><td>Adapter</td><td>41.1</td><td>93.4</td><td>57.2</td><td>33.0</td><td>21.4</td><td>25.3</td><td>24.3</td><td>27.2</td><td>46.7</td></tr><tr><td>Group strategy</td><td>40.0</td><td>94.2</td><td>59.8</td><td>33.5</td><td>18.2</td><td>22.0</td><td>21.9</td><td>24.6</td><td>45.5</td></tr><tr><td>Subset strategy</td><td>44.7</td><td>97.3</td><td>65.3</td><td>38.7</td><td>22.4</td><td>25.8</td><td>26.4</td><td>29.0</td><td>52.4</td></tr></table>

Results. S2T transformer share all parameters among languages. Attention selection models select attention heads based on the source and target languages in the multilingual setting. Adapter adds adapter layers based on the language directions. We report the ASR results in Table 2. Attention selection with either group or subset strategy is shown to reduce the word error rate in comparison with S2T Transformer. Adapter model also achieves lower WER than S2T Transformer. Group strategy yields the lowest WER, achieving an average drop of 18.4% compared with S2T Transformer. Adapter reduces the WER of S2T Transformer by 16.1%.

## 4.2.2 Multi-Domain Speech Recognition

Dataset. Besides mTEDx data, we include two other public datasets, CoVoST and EuroParl, which are commonly used for speech translation. Since source audios are accompanied by transcripts, we could use their source audio-text data for speech recognition tasks. We investigate multi-domain modeling with these three datasets.

1. CoVoST (Wang et al., 2020c). With Common Voice as the audio source, CoVoST covers speechto-text translations from 22 languages to English and from English to 15 languages. 2. EuroParl (Iranzo-Sánchez et al., 2020). It provides paired audio-text instances from and into 6 European languages, which are compiled from the debates in European Parliament.

Table 3: WER (↓) of Speech Recognition on mTEDx, CoVoST and EuroParl Dataset
<table><tr><td></td><td>mTEDx</td><td>CoVoST</td><td>EuroParl</td></tr><tr><td>S2T Transformer (separate)</td><td>49.0</td><td>41.9</td><td>115.0</td></tr><tr><td>S2T Transformer (joint)</td><td>42.7</td><td>38.3</td><td>25.6</td></tr><tr><td>Adapter</td><td>41.7</td><td>37.0</td><td>24.0</td></tr><tr><td>Group strategy</td><td>41.0</td><td>36.4</td><td>24.3</td></tr><tr><td>Subset strategy</td><td>41.8</td><td>37.0</td><td>25.0</td></tr></table>

Results. In the multi-domain setting, attention selection models assign different heads to each domain, and adapter model adds domain-specific adapter layers to S2T Transformer. We train models for 400 epochs in the multi-domain setting. Table 3 reports WER of models in three domains: mTEDx, CoVoST and EuroParl respectively. The S2T Transformer jointly trained on multi-domain data (in the row of “S2T Transformer (joint)”) reduces WER by 12.9%, 8.6% and 77.7% in three domains respectively, when compared with the models separately trained in individual domains (in the row of “S2T Transformer (separate)”). This demonstrates the benefits of positive transfer between domains.

The performance of speech recognition could be further improved by the mitigation of the domain interference. Both attention selection and adapter model achieve lower WER than the joint S2T Transformer. Attention selection with group strategy has the lowest WER on both mTEDx and CoVoST datasets, decreasing WER by 4.0% and 5.0% respectively in comparison with joint S2T Transformer. The best system on EuroParl is adapter model, yielding a WER reduction by 6.3% than the joint S2T Transformer.

## 4.3 Speech Translation

Now with a focus on the task of speech translation, we again design experiments in multilingual and multi-domain settings. In the multilingual setup, we train translation models with samples in multiple languages to investigate language interference. As for the multi-domain setup, the models are trained with data from multiple domains so that we could look into the domain interference. BLEU serves as the evaluation metric of speech translation systems.

Baselines. We use the same baselines as in speech recognition. As recommended by (Salesky et al., 2021), we initialize the encoders in speech translation with the encoders trained in the task of speech recognition in Section 4.2 for the purpose of improving training efficiency and performance.

Model configurations. All models are trained for up to 400 epochs. Other model configurations in ST are the same as those in ASR.

## 4.3.1 Multilingual Speech Translation

To explore language interference, we perform experiments on multilingual speech translation.

Dataset. We again use mTEDx dataset for multilingual speech translation. Besides speech recognition data, mTEDx also collects speech translation data from TEDx talks. Its test set covers 13 language directions. The training data is provided in 10 of these directions, so there are 3 zero-shot directions.

Table 4: BLEU (↑) of Speech Translation on mTEDx (AVG-A: average over all directions, AVG-T: average of 10 training directions, and AVG-Z: average of 3 zero-shot directions)
<table><tr><td></td><td>AVG-A</td><td>AVG-T</td><td>AVG-Z</td></tr><tr><td>S2T Transformer</td><td>13.2</td><td>14.6</td><td>8.5</td></tr><tr><td>Adapter</td><td></td><td>14.8</td><td></td></tr><tr><td>Group strategy</td><td>15.2</td><td>16.7</td><td>10.4</td></tr><tr><td>Subset strategy</td><td>13.3</td><td>14.7</td><td>8.5</td></tr></table>

Results. Table 4 summarizes the mul tilingual speech translation results on mTEDx. Since adapter model brings in language-specific layers, it cannot deal with zero-shot translations. Both attention selection models and adapter model bring improvements over S2T Transformer which is jointly trained in 13 language directions. It suggests that multiple languages interfere within S2T Transformer whose parameters are shared by all languages. At-

tention selection with group strategy achieves the best translation performance. In comparison with S2T Transformer, group strategy achieves an average of +2.1 and +1.9 BLEU in training and zero-shot directions respectively. It leads to +2.0 BLEU on average of all directions.

## 4.3.2 Multi-Domain Speech Translation

In this experiment, we investigate interference across domains in the task of speech translation, and evaluate the effectiveness of different models in multi-domain training. The attention selection now is based on the data domain instead of languages, i.e., samples in different domains would choose their own attention heads. Similarly for adapter model, its adapter layers are domain-specific in this setup.

We again use CoVoST and EuroParl as additional domains. We focus on the 13 language directions in mTEDx test set, and use the subset of CoVoST and EuroParl corpora in the same directions. CoVoST has 5 common directions<sup>3</sup> and EuroParl has 11 common directions<sup>4</sup> as mTEDx. Details about these datasets are included in Appendix A.1.

Results. Table 5 shows the average BLEU of speech translation in mTEDx, CoVoST and EuroParl. We report results in the row of “S2T Transformer (joint)” when S2T Transformer is trained with a mixture of three datasets. The results are included in the row “S2T Transformer (separate)” when S2T Transformer is trained on each dataset independently. Zero-shot translations in mTEDx benefit a lot from additional data of CoVoST and EuroParl, as the joint S2T Transformer shows an average of +5.4 BLEU over separate S2T Transformer. However, there is a drop of 1.0 BLEU in its training directions, brought by the interference from CoVoST and EuroParl domains.

Again we observe that both attention selection and adapter model bring gains to the joint model in individual domains. Compared with the joint S2T Transformer, adapter model improves mTEDx translation by 0.3 BLEU, CoVoST translation by 0.6 BLEU and EuroParl by 1.0 BLEU on average. The attention selection with group strategy outperforms all other models. Its average BLEU gain over adapter model is 1.6 BLEU in mTEDx, 1.7 BLEU in CoVoST and 0.8 in EuroParl.

Table 5: BLEU (↑) of Speech Translation on mTEDx, CoVoST and EuroParl Dataset
<table><tr><td rowspan="2"></td><td colspan="3">TEDx</td><td>CoVoST</td><td>EuroParl</td></tr><tr><td>AVG-A</td><td>AVG-T</td><td>AVG-Z</td><td>AVG</td><td>AVG</td></tr><tr><td>S2T Transformer (separate)</td><td>13.2</td><td>14.6</td><td>8.5</td><td>17.6</td><td>19.1</td></tr><tr><td>S2T Transformer (joint)</td><td>13.7</td><td>13.6</td><td>13.9</td><td>17.3</td><td>19.0</td></tr><tr><td>Adapter</td><td>14.0</td><td>14.3</td><td>13.2</td><td>17.9</td><td>20.0</td></tr><tr><td>Group strategy</td><td>15.6</td><td>15.9</td><td>14.8</td><td>19.6</td><td>20.8</td></tr><tr><td>Subset strategy</td><td>13.8</td><td>14.3</td><td>13.1</td><td>17.9</td><td>19.2</td></tr></table>

## 5 Discussion

Hyperparameter $H ^ { \prime }$ . The attention selection models set a hyperparameter $H ^ { \prime }$ as the total number of attention head candidates in multi-head attention, which controls the search space of attention sharing strategies. We now explore how the performance varies with $H ^ { \prime }$ for group and subset strategies.

Evaluated on the task of multilingual speech recognition, models have the same hyperparameters as those in multilingual ASR experiments except for $H ^ { \prime }$ . Attention selection models are configured with $H ^ { \prime } = 4 , 8$ , 12, 16 respectively, and Figure 2 shows the change of WER with $H ^ { \prime }$

When $H ^ { \prime } = 4 .$ , there is no attention selection and all attention heads are shared by different languages. We observe a large drop of error rate as $H ^ { \prime }$ increases from 4 to 8. For the subset strategy, WER keeps decreasing when the number of head candidates grows from 4 to 16. As for group strategy, $H ^ { \prime } = 8$ is the optimal hyperparameter on the ASR task. As we continue increasing $H ^ { \prime }$ to 12 and 16, the error rate increases a bit. The performances of subset and group strategies are close when $H ^ { \prime } = 1 6$

![](images/eb536e24d6693af33f9b5c927f003e765bb2bc5a7dc1ff1eb62fd570023b9eac.jpg)  
Figure 2: WER of speech recognition on mT-EDx with different number of candidates.

The search space of group strategy is a strict subset of the space of subset strategy. However, we observe that group strategy shows comparable or better performance than subset strategy across tasks, including MT, ASR and ST. One possible explanation is that group strategy keeps the head order information while subset strategy does not. With a larger pool of head candidates, there is less sharing among tasks. The performance of the group strategy degrades a bit due to less positive transfer dependent on attention sharing. As for the subset strategy, better head assignments are learned with enlarged search space.

Attention Sharing among Languages. We now analyze the attention sharing pattern among languages. Take the multilingual model on mTEDx speech recognition as an example, whose head selection is learned with group strategy. We count the number of heads shared by each language pair in the model, and visualize it with a heatmap in Fig. 3, where the darkness reflects the amount of sharing. The diagonal cells in the heatmap corresponds to the number of attention heads used by each language, i.e., the total number of attention heads in all layers.

For European languages including Spanish (es), French (fr), Italian (it) and Portuguese (pt), their shared attention heads are fewer in decoder than in encoder. This seems contradicted with previous findings that parameter sharing is beneficial for languages with high linguistic proximity. We note that they are high-resource languages in mTEDx corpus, which is also justified by their relatively lower WER. Their data is sufficient to learn good speech recognition, and sharing parameters with other languages hurt the preservation of the language specificity. This explains why the high-resource European languages do not share too many heads in the learned group strategy.

![](images/60ceae60a1b22e5b2feea922c738553f8a3ac76c90c7c26c06c7697927733f69.jpg)  
(a) Encoder with group strategy.

![](images/a1d74514dfe6c72fc973ed12e483bcb0f258667d6a3b6cce320d43e05e1448d7.jpg)  
(b) Decoder with group strategy.  
Figure 3: Heatmap to visualize the sharing between languages in multilingual ASR (The darker a language pair is, the more attention heads they share.)

Another pattern we observe from Fig. 3 is that low-resource languages tend to share more attention heads with high-resource languages. For example, Arabic (ar) and Russian (ru) have relatively more sharing with Italian (it) than other languages. Low-resource languages benefit from the knowledge transfer from high-resource languages.

Load of Attention Heads. To gain an insight into the load of attention heads, we analyze how many languages an attention head is shared by. With both subset and group strategies, we look into attention heads in encoder and decoder respectively. We study ASR models which learn language based attention selection on mTEDx data containing 8 languages. The language load of each attention head is measured by the number of languages sharing the given head. Fig. 4 visualizes the load of attention heads in each layer with a heatmap. The darkness reflects the load of an attention head.

By comparing encoder heads in Fig. 4(a) and (c), we note that group strategy results in more balanced load among attention heads than subset strategy, as there is less color variation in the heatmap of group strategy. Similar pattern could be observed in decoder, and decoder attention heads have more balanced load with group strategy.

Now we compare the load of attention heads across layers. With subset strategy, the load imbalance is observed in heads of almost every encoder and decoder layer from the color contrast in the heatmap. As for group strategy, the load is more balanced in heads of middle layers (i.e., encoder layers 5 − 9 and decoder layers 3 − 5) than those in bottom and top layers.

Head Selection in Encoder and Decoder. In our experiments, attention selection is applied to both encoder and decoder in ASR and ST experiments, considering that both encoder and decoder handle multiple languages. We want to measure how the model performance is affected by attention selection in encoder and decoder respectively. Take the multilingual ASR as an example, Table 6 reports the word error rate of models which enable attention selection in encoder only, in decoder only as well as in both encoder and decoder. We set the same hyperparameters as used in the experiment of multilingual ASR. When the attention selection is applied to encoder (or decoder) only, 4 attention heads are shared by all languages in each decoder (or encoder) layer.

Table 6: Ablation Study in WER of Multilingual Speech Recognition on mTEDx
<table><tr><td>Component with attention selection</td><td>Encoder only</td><td>Decoder only</td><td>Encoder+Decoder</td></tr><tr><td>Group strategy</td><td>42.2</td><td>46.2</td><td>40.0</td></tr><tr><td>Subset strategy</td><td>45.4</td><td>47.5</td><td>44.7</td></tr></table>

As is shown in Table 6, attention selection in only encoder (c.f. column ‘Encoder only‘”) or decoder (c.f. column “Decoder only”) would increase the word error rate in comparison with the model with attention selection in both encoder and decoder (c.f. column “Encoder+Decoder”). We also note that attention selection in encoder achieves lower WER than that in decoder.

![](images/88993ac72a345091ea5751e786b1edb46936123fef466ff5baed03d35b7bd5ba.jpg)  
(a) Encoder attention with subset strategy.

![](images/ec1e62fccf205aadaa49869ef2310c5447b40ca820f4254415a89a75b92ac690.jpg)  
(b) Decoder attention with subset strategy.

![](images/2bae2038f249379104561eb1615106c8b68336ef3ec1fa8d767d0b459fb1329d.jpg)  
(c) Encoder attention with group strategy.

![](images/61d40e429dd8676fc747ed809d69ee0f0f18b9a0b8231ab9a191e35c03767ca0.jpg)  
(d) Decoder attention with group strategy.  
Figure 4: Heatmap to visualize the load of attention heads (The darker a head is, the more languages it supports.

## 6 Conclusion

Research efforts in multilingual and multi-domain modeling have been driven by the increasing need to improve data efficiency and model performance. In this work, we propose head selection strategies to allow heads to be shared or specialized for different languages or domains. It effectively mitigates interference within multi-head attention which is a core part of strong sequence models, and demonstrates good empirical gains in various text generation tasks.

This work has several limitations left for future research. We did not explore head selection based on both language and data domain. We did not analyze model fairness and robustness. As a technology used for text generation, the model might have systemic bias or produce inappropriate outputs.

## References

Ankur Bapna and Orhan Firat. Simple, scalable adaptation for neural machine translation. In Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing and the 9th International Joint Conference on Natural Language Processing (EMNLP-IJCNLP), pages 1538–1548, 2019.

Graeme W. Blackwood, Miguel Ballesteros, and Todd Ward. Multilingual neural machine translation with task-specific attention. In Proceedings of the 27th International Conference on Computational

Linguistics, COLING 2018, Santa Fe, New Mexico, USA, August 20-26, 2018, pages 3112–3122. Association for Computational Linguistics, 2018.

Zhao Chen, Vijay Badrinarayanan, Chen-Yu Lee, and Andrew Rabinovich. Gradnorm: Gradient normalization for adaptive loss balancing in deep multitask networks. In Jennifer G. Dy and Andreas Krause, editors, Proceedings of the 35th International Conference on Machine Learning, ICML 2018, Stockholmsmässan, Stockholm, Sweden, July 10-15, 2018, volume 80 of Proceedings of Machine Learning Research, pages 793–802. PMLR, 2018.

Raj Dabre, Chenhui Chu, and Anoop Kunchukuttan. A survey of multilingual neural machine translation. ACM Computing Surveys (CSUR), 53:1 – 38, 2020. URL https://dl.acm.org/ doi/pdf/10.1145/3406095.

Praveen Dakwale and Christof Monz. Finetuning for neural machine translation with limited degradation across in-and out-of-domain data. Proceedings of the XVI Machine Translation Summit, 117, 2017.

Mattia Antonino Di Gangi, Matteo Negri, and Marco Turchi. Adapting transformer to end-to-end spoken language translation. In Gernot Kubin and Zdravko Kacic, editors, Interspeech 2019, 20th Annual Conference of the International Speech Communication Association, Graz, Austria, 15-19 September 2019, pages 1133–1137. ISCA, 2019.

Xinwei Geng, Longyue Wang, Xing Wang, Bing Qin, Ting Liu, and Zhaopeng Tu. How does selective mechanism improve self-attention networks? In Dan Jurafsky, Joyce Chai, Natalie Schluter, and Joel R. Tetreault, editors, Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics, ACL 2020, Online, July 5-10, 2020, pages 2986–2995. Association for Computational Linguistics, 2020.

Jiatao Gu, Hany Hassan, Jacob Devlin, and Victor OK Li. Universal neural machine translation for extremely low resource languages. In Proceedings of the 2018 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long Papers), pages 344–354, 2018.

Pengsheng Guo, Chen-Yu Lee, and Daniel Ulbricht. Learning to branch for multi-task learning. In International Conference on Machine Learning, pages 3854–3863. PMLR, 2020.

Georg Heigold, Vincent Vanhoucke, Andrew W. Senior, Patrick Nguyen, Marc’Aurelio Ranzato, Matthieu Devin, and Jeffrey Dean. Multilingual acoustic models using distributed deep neural networks. 2013 IEEE International Conference on Acoustics, Speech and Signal Processing, pages 8619–8623, 2013.

H. Inaguma, Kevin Duh, Tatsuya Kawahara, and Shinji Watanabe. Multilingual end-to-end speech translation. 2019 IEEE Automatic Speech Recognition and Understanding Workshop (ASRU), pages 570–577, 2019a.

Hirofumi Inaguma, Kevin Duh, Tatsuya Kawahara, and Shinji Watanabe. Multilingual end-to-end speech translation. In IEEE Automatic Speech Recognition and Understanding Workshop, ASRU 2019, Singapore, December 14-18, 2019, pages 570–577. IEEE, 2019b.

Javier Iranzo-Sánchez, Joan Albert Silvestre-Cerdà, Javier Jorge, Nahuel Roselló, Adrià Giménez, Albert Sanchis, Jorge Civera, and Alfons Juan. Europarl-st: A multilingual corpus for speech translation of parliamentary debates. In ICASSP 2020-2020 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pages 8229–8233. IEEE, 2020.

Eric Jang, Shixiang Gu, and Ben Poole. Categorical reparameterization with gumbel-softmax. In 5th International Conference on Learning Representations, ICLR 2017, Toulon, France, April 24-26, 2017, Conference Track Proceedings, 2017.

M. Johnson, M. Schuster, Quoc V. Le, M. Krikun, Y. Wu, Z. Chen, Nikhil Thorat, Fernanda B. Viégas, M. Wattenberg, G. Corrado, Macduff Hughes, and J. Dean. Google’s multilingual neural machine translation system: Enabling zero-shot translation. Transactions of the Association for Computational Linguistics, 5:339–351, 2017.

Huda Khayrallah, Brian Thompson, Kevin Duh, and Philipp Koehn. Regularized training objective for continued training for domain adaptation in neural machine translation. In Alexandra Birch, Andrew M. Finch, Minh-Thang Luong, Graham Neubig, and Yusuke Oda, editors, Proceedings of the 2nd Workshop on Neural Machine Translation and Generation, NMT@ACL 2018, Melbourne, Australia, July 20, 2018, pages 36–44. Association for Computational Linguistics, 2018.

Dietrich Klakow and Jochen Peters. Testing the correlation of word error rate and perplexity. Speech Communication, 38(1-2):19–28, 2002.

Catherine Kobus, Josep Maria Crego, and Jean Senellart. Domain control for neural machine translation. In Proceedings of the International Conference Recent Advances in Natural Language Processing, RANLP 2017, Varna, Bulgaria, September 2 - 8, 2017, pages 372–378. INCOMA Ltd., 2017.

Dmitry Lepikhin, HyoukJoong Lee, Yuanzhong Xu, Dehao Chen, Orhan Firat, Yanping Huang, Maxim Krikun, Noam Shazeer, and Zhifeng Chen. Gshard: Scaling giant models with conditional computation and automatic sharding. CoRR, abs/2006.16668, 2020.

X. Li, Changhan Wang, Y. Tang, C. Tran, Yuqing Tang, J. Pino, Alexei Baevski, Alexis Conneau, and Michael Auli. Multilingual speech translation with efficient finetuning of pretrained models. arXiv: Computation and Language, 2020.

Pengbo Liu, Hailong Cao, and Tiejun Zhao. Gumbel-attention for multi-modal machine translation. CoRR, abs/2103.08862, 2021. URL https://arxiv.org/abs/2103.08862.

Yinhan Liu, Jiatao Gu, Naman Goyal, Xian Li, Sergey Edunov, Marjan Ghazvininejad, Mike Lewis, and Luke Zettlemoyer. Multilingual denoising pre-training for neural machine translation. Transactions of the Association for Computational Linguistics, 8:726–742, 2020.

Niko Moritz, Takaaki Hori, and Jonathan Le. Streaming automatic speech recognition with the transformer model. In ICASSP 2020-2020 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pages 6074–6078. IEEE, 2020.

Myle Ott, Sergey Edunov, Alexei Baevski, Angela Fan, Sam Gross, Nathan Ng, David Grangier, and Michael Auli. fairseq: A fast, extensible toolkit for sequence modeling. In Waleed Ammar, Annie Louis, and Nasrin Mostafazadeh, editors, Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, NAACL-HLT 2019, Minneapolis, MN, USA, June 2-7, 2019, Demonstrations, pages 48–53. Association for Computational Linguistics, 2019.

Kishore Papineni, Salim Roukos, Todd Ward, and Wei-Jing Zhu. Bleu: a method for automatic evaluation of machine translation. In Proceedings of the 40th annual meeting of the Association for Computational Linguistics, pages 311–318, 2002.

MinhQuang Pham, Josep Maria Crego, and François Yvon. Revisiting multi-domain machine translation. Transactions of the Association for Computational Linguistics, 9:17–35, 2021.

Vineel Pratap, Anuroop Sriram, Paden Tomasello, Awni Y. Hannun, Vitaliy Liptchinsky, Gabriel Synnaeve, and Ronan Collobert. Massively multilingual asr: 50 languages, 1 model, 1 billion parameters. In INTERSPEECH, 2020.

Devendra Singh Sachan and Graham Neubig. Parameter sharing methods for multilingual selfattentional translation models. In Proceedings of the Third Conference on Machine Translation: Research Papers, WMT 2018, Belgium, Brussels, October 31 - November 1, 2018, pages 261–271. Association for Computational Linguistics, 2018.

Elizabeth Salesky, Matthew Wiesner, Jacob Bremerman, Roldano Cattoni, Matteo Negri, Marco Turchi, Douglas W. Oard, and Matt Post. The multilingual tedx corpus for speech recognition and translation. CoRR, abs/2102.01757, 2021. URL https://arxiv.org/abs/2102.01757.

Danielle Saunders. Domain adaptation and multi-domain adaptation for neural machine translation: A survey. CoRR, abs/2104.06951, 2021. URL https://arxiv.org/abs/2104.06951.

Noam Shazeer, Azalia Mirhoseini, Krzysztof Maziarz, Andy Davis, Quoc V. Le, Geoffrey E. Hinton, and Jeff Dean. Outrageously large neural networks: The sparsely-gated mixture-of-experts layer. In 5th International Conference on Learning Representations, ICLR 2017, Toulon, France, April 24-26, 2017, Conference Track Proceedings. OpenReview.net, 2017.

Brian Thompson, Jeremy Gwinnup, Huda Khayrallah, Kevin Duh, and Philipp Koehn. Overcoming catastrophic forgetting during domain adaptation of neural machine translation. In Jill Burstein, Christy Doran, and Thamar Solorio, editors, Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, NAACL-HLT 2019, Minneapolis, MN, USA, June 2-7, 2019, Volume 1 (Long and Short Papers), pages 2062–2068. Association for Computational Linguistics, 2019.

Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, and Illia Polosukhin. Attention is all you need. In Isabelle Guyon, Ulrike von Luxburg, Samy Bengio, Hanna M. Wallach, Rob Fergus, S. V. N. Vishwanathan, and Roman Garnett, editors, Advances in Neural Information Processing Systems 30: Annual Conference on Neural Information Processing Systems 2017, December 4-9, 2017, Long Beach, CA, USA, pages 5998–6008, 2017.

Laura Cross Vila, Carlos Escolano, José A. R. Fonollosa, and Marta R. Costa-jussà. End-to-end speech translation with the transformer. In Jordi Luque, Antonio Bonafonte, Francesc Alías Pujol, and António J. S. Teixeira, editors, Fourth International Conference, IberSPEECH 2018, Barcelona, Spain, 21-23 November 2018, Proceedings, pages 60–63. ISCA, 2018.

Changhan Wang, Yun Tang, Xutai Ma, Anne Wu, Dmytro Okhonko, and Juan Pino. Fairseq s2t: Fast speech-to-text modeling with fairseq. In Proceedings of the 1st Conference of the Asia-Pacific Chapter of the Association for Computational Linguistics and the 10th International Joint Conference on Natural Language Processing: System Demonstrations, pages 33–39, 2020a.

Changhan Wang, Yun Tang, Xutai Ma, Anne Wu, Dmytro Okhonko, and Juan Pino. fairseq s2t: Fast speech-to-text modeling with fairseq. In Proceedings of the 2020 Conference of the Asian Chapter of the Association for Computational Linguistics (AACL): System Demonstrations, 2020b.

Changhan Wang, Anne Wu, and Juan Pino. Covost 2: A massively multilingual speech-to-text translation corpus. CoRR, abs/2007.10310, 2020c. URL https://arxiv.org/abs/2007.10310.

Yong Wang, Longyue Wang, Shuming Shi, Victor OK Li, and Zhaopeng Tu. Go from the general to the particular: Multi-domain translation with domain transformation networks. In Proceedings of the AAAI Conference on Artificial Intelligence, volume 34, pages 9233–9241, 2020d.

Zirui Wang, Zachary C Lipton, and Yulia Tsvetkov. On negative interference in multilingual language models. In Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing (EMNLP), pages 4438–4450, 2020e.

Sen Wu, Hongyang R Zhang, and Christopher Ré. Understanding and improving information transfer in multi-task learning. In International Conference on Learning Representations, 2019.

Tianhe Yu, Saurabh Kumar, Abhishek Gupta, Sergey Levine, Karol Hausman, and Chelsea Finn. Gradient surgery for multi-task learning. Advances in Neural Information Processing Systems, 33, 2020.

Jiali Zeng, Jinsong Su, Huating Wen, Yang Liu, Jun Xie, Yongjing Yin, and Jianqiang Zhao. Multidomain neural machine translation with word-level domain context discrimination. In Proceedings of the 2018 Conference on Empirical Methods in Natural Language Processing, Brussels, Belgium, October 31 - November 4, 2018, pages 447–457. Association for Computational Linguistics, 2018a.

Jiali Zeng, Jinsong Su, Huating Wen, Yang Liu, Jun Xie, Yongjing Yin, and Jianqiang Zhao. Multidomain neural machine translation with word-level domain context discrimination. In Proceedings of the 2018 Conference on Empirical Methods in Natural Language Processing, pages 447–457, 2018b.

## A Appendix

## A.1 Dataset

Table 7 summarizes the number of parallel sentences for 14 languages in WMT shared tasks. Table 8 covers three datasets, CoVoST, EuroParl and mTEDx on ASR task, and reports their number of utterances in 8 languages. Table 9 shows data sizes of three ST datasets including CoVoST, EuroParl and mTEDx. It reports the number of utterances in 13 language directions.

Table 7: Data Statistics of WMT Datasets
<table><tr><td>Language</td><td>Code</td><td>Size</td><td>Language</td><td>Code</td><td>Size</td></tr><tr><td>Gujarati</td><td>gu</td><td>10k</td><td>Kazakh</td><td>kk</td><td>91k</td></tr><tr><td>Turkish</td><td>tr</td><td>207k</td><td>Romanian</td><td>ro</td><td>608k</td></tr><tr><td>Estonian</td><td>et</td><td>1.94M</td><td>Lithuanian</td><td>lt</td><td>2.11M</td></tr><tr><td>Finnish</td><td>fi</td><td>2.66M</td><td>Latvian</td><td>lv</td><td>4.50M</td></tr><tr><td>Czech</td><td>cS</td><td>11M</td><td>Spanish</td><td>es</td><td>15M</td></tr><tr><td>Chinese</td><td>zh</td><td>25M</td><td>German</td><td>de</td><td>28M</td></tr><tr><td>Russian</td><td>ru</td><td>29M</td><td>French</td><td>fr</td><td>41M</td></tr></table>

Table 8: Data Statistics of Speech Recognition Task (# of Utterances)
<table><tr><td rowspan="2">Data Split</td><td colspan="3">CoVoST</td><td colspan="3">EuroParl</td><td colspan="3">mTEDx</td></tr><tr><td>Train</td><td>Dev</td><td>Test</td><td>Train</td><td>Dev</td><td>Test</td><td>Train</td><td>Dev</td><td>Test</td></tr><tr><td>ar</td><td>2,283</td><td>1,758</td><td>1,695</td><td></td><td></td><td></td><td>11,442</td><td>1,079</td><td>1,066</td></tr><tr><td>de</td><td>127,577</td><td>13,503</td><td>13,503</td><td>13,099</td><td>2,653</td><td>2,644</td><td>6,659</td><td>1,172</td><td>1,126</td></tr><tr><td>el</td><td></td><td></td><td></td><td></td><td></td><td></td><td>12,521</td><td>982</td><td>1,027</td></tr><tr><td>es</td><td>78,958</td><td>13,203</td><td>13,204</td><td>7,537</td><td>1,951</td><td>1,831</td><td>99,660</td><td>905</td><td>1,012</td></tr><tr><td>fr</td><td>207,286</td><td>14,755</td><td>14,750</td><td>13,006</td><td>1,593</td><td>1,848</td><td>114,488</td><td>1,036</td><td>1,059</td></tr><tr><td>it</td><td>31,638</td><td>8,877</td><td>8,892</td><td>11,649</td><td>1,414</td><td>1,763</td><td>48,089</td><td>931</td><td>999</td></tr><tr><td>pt</td><td>9,158</td><td>3,315</td><td>4,021</td><td>4,977</td><td>1,794</td><td>2,292</td><td>88,123</td><td>1,013</td><td>1,020</td></tr><tr><td>ru</td><td>12,112</td><td>6,110</td><td>6,300</td><td></td><td></td><td></td><td>28,627</td><td>973</td><td>1,132</td></tr></table>

Table 9: Data Statistics of Speech Translation Task (# of Utterances)
<table><tr><td>Data</td><td colspan="3">CoVoST</td><td colspan="3">EuroParl</td><td colspan="3">mTEDx</td></tr><tr><td>Split</td><td>Train</td><td>Dev</td><td>Test</td><td>Train</td><td>Dev</td><td>Test</td><td>Train</td><td>Dev</td><td>Test</td></tr><tr><td>el-en</td><td></td><td></td><td></td><td></td><td></td><td></td><td>4,215</td><td>938</td><td>1,024</td></tr><tr><td>es-en</td><td>78,958</td><td>13,203</td><td>13,204</td><td>7,403</td><td>1,947</td><td>1,816</td><td>35,186</td><td>899</td><td>1,001</td></tr><tr><td>es-fr</td><td></td><td></td><td></td><td>4,673</td><td>1,115</td><td>1,082</td><td>3,549</td><td>904</td><td>1,005</td></tr><tr><td>es-it</td><td>1</td><td>一</td><td></td><td>4,476</td><td>1,065</td><td>1,079</td><td>5,530</td><td>16</td><td>262</td></tr><tr><td>es-pt</td><td></td><td></td><td></td><td>4,727</td><td>1,141</td><td>1,089</td><td>20,467</td><td>898</td><td>1,002</td></tr><tr><td>fr-en</td><td>207,286</td><td>15,560</td><td>14,952</td><td>12,446</td><td>1,481</td><td>1,804</td><td>29,634</td><td>1,035</td><td>1,058</td></tr><tr><td>fr-es</td><td></td><td></td><td></td><td>7,857</td><td>1,072</td><td>1,098</td><td>20,407</td><td>1,034</td><td>1,057</td></tr><tr><td>fr-pt</td><td></td><td></td><td></td><td>8,183</td><td>1,048</td><td>1,100</td><td>13,047</td><td>1,035</td><td>1,058</td></tr><tr><td>it-en</td><td>31,638</td><td>9,095</td><td>8,937</td><td>11,285</td><td>1,400</td><td>1,686</td><td></td><td>929</td><td>999</td></tr><tr><td>it-es</td><td></td><td></td><td></td><td>6,614</td><td>877</td><td>885</td><td></td><td>929</td><td>999</td></tr><tr><td>pt-en</td><td>9,158</td><td>3,590</td><td>4,254</td><td>4,918</td><td>1,747</td><td>2,286</td><td>29,940</td><td>1,002</td><td>1,019</td></tr><tr><td>pt-es</td><td></td><td></td><td></td><td>3,132</td><td>1,218</td><td>1,256</td><td></td><td>1,001</td><td>1,018</td></tr><tr><td>ru-en</td><td>12,112</td><td>9,497</td><td>8,634</td><td></td><td>–</td><td>=</td><td>4,829</td><td>970</td><td>1,124</td></tr></table>