---
layout: page
title: Equivalent Linear Mappings of Large Language Models
---

# Equivalent Linear Mappings of Large Language Models

James R. Golden Oakland, CA

jamesgolden1@gmail.com

# Abstract

Despite significant progress in transformer interpretability, an understanding of the computational mechanisms of large language models (LLMs) remains a fundamental challenge. Many approaches interpret a network’s hidden representations but remain agnostic about how those representations are generated. We address this by mapping LLM inference for a given input sequence to an equivalent and interpretable linear system which reconstructs the predicted output embedding with relative error below $1 0 ^ { - 1 3 }$ at double floating-point precision, requiring no additional model training. We exploit a property of transformer decoders wherein every operation (gated activations, attention, and normalization) can be expressed as $A ( x ) \cdot x$ , where $A ( x )$ represents an input-dependent linear transform and $x$ preserves the linear pathway. To expose this linear structure, we strategically detach components of the gradient computation with respect to an input sequence, freezing the $A ( x )$ terms at their values computed during inference, such that the Jacobian yields an equivalent linear mapping. This “detached’’ Jacobian of the model reconstructs the output with one linear operator per input token, which is shown for Qwen 3, Gemma 3 and Llama 3, up to Qwen 3 14B. These linear representations demonstrate that LLMs operate in extremely lowdimensional subspaces where the singular vectors can be decoded to interpretable semantic concepts. The computation for each intermediate output also has a linear equivalent, and we examine how the linear representations of individual layers and their attention and multilayer perceptron modules build predictions, and use these as steering operators to insert semantic concepts into unrelated text. Despite their expressive power and global nonlinearity, modern LLMs can be interpreted through equivalent linear representations that reveal low-dimensional semantic structures in the next-token prediction process. Code is available at https://github.com/jamesgolden1/equivalent-linear-LLMs/ .

# 1 Introduction

The transformer decoder is the architecture of choice for large language models (Vaswani et al., 2017) and efforts toward a conceptual understanding of its mechanisms are ongoing (Sharkey et al., 2025). Significant insights include sparse autoencoders for conceptual activations in LLMs (Bricken et al., 2023; Templeton et al., 2024; Lieberum et al., 2024), linear probes (Alain & Bengio, 2016), “white-box” alternative architectures (Yu et al., 2023) and analytic results on generalization (Cowsik et al., 2024). While transformers are complex globally nonlinear functions of their input, we demonstrate how to compute an equivalent linear system that reconstructs the predicted output embedding for a given input sequence up to double floating-point precision.

Our approach directly extends the framework of Elhage et al. (2021), who analyzed attention-only transformers as interpretable linear circuits, but were limited to small models without MLPs (due to gated activation functions) or normalization layers. We show that by detaching nonlinear terms from the gradient computation, modern LLMs with gated activations (as well as softmax attention and normalization) can be decomposed into an equivalent linear system for a given input. Recently, Kadkhodaie et al. (2023) showed that powerful image denoising diffusion models with ReLU activations and certain architectural constraints are piecewise linear functions which can be computed via the Jacobian and can be clearly interpreted as low-dimensional adaptive linear filters with comprehensible singular vectors.

![](images/fcfdaf6e8a6255460856c9daa05e34d6719d2c2e8150d329b904f260469951f2.jpg)

![](images/c32a41e90c3a9e80515b293dec9f3c5ac543ad313726e001f691877573d3f0fa.jpg)  
Figure 1: A) A schematic of the transformer decoder (Grattafiori et al., 2024; Nvidia, 2024). The PyTorch gradient detach operations for components outlined in red effectively freeze the nonlinear activations for a given input sequence, creating a linear path for the gradient with respect to the input embedding vectors, but do not change the output. The output embedding prediction can be mapped to an equivalent linear system by the Jacobian autograd operation. The feedforward module with a gated linear activation function is shown in expanded form to demonstrate how the gating term can be detached from the gradient to form a linear path, achieving linearity for a given input. The RMSNorm layers and softmax attention blocks also must be detached from the gradient. B) For the input sequence “The bridge out of Marin is the”, the elements of the predicted output embedding vector of the model compared to the elements from the Jacobian reconstruction for both the original Jacobian (blue points) and detached Jacobian operations (red points), shown for Qwen 3 14B. Note that the detached Jacobian reconstructions match the predicted embedding, with relative error (the norm of the reconstruction error divided by the norm of the output embedding) less than $1 0 ^ { - 1 3 }$ for double floating-point precision. See reconstructions for Llama 3.2 3B and Gemma 3 4B in Fig. A2.

For many open-weight LLMs, every component operation (gated activations, attention, and normalization) can be expressed in the form $A ( x ) \cdot x$ , where $A ( x )$ represents an input-dependent linear transform and $x$ preserves the linear pathway. The gradient operation with respect to the input can be manipulated at inference by freezing the $A ( x )$ terms at their values during inference operation with the detach operation such that the output embedding prediction has a linear equivalent as in Fig. 1. This “detached” Jacobian $\mathbf { J } ^ { + }$ computation captures the complete forward operation of the model, including activation functions and attention modules, although it must be recomputed for each input sequence (as it is not piecewise linear but “pointwise” linear).

This approach allows us to analyze a model from input embeddings to predicted output embedding as an equivalent linear system for a particular input sequence. By examining the singular value decomposition (SVD) of the equivalent linear system, we can measure the local dimensionality of the learned manifolds involved in next-token prediction and can decode the singular vectors into output tokens. This analysis can also be done layer by layer, or for individual attention and multilayer perceptron (MLP) modules, in order to observe how these models compose next-token predictions.

We demonstrate equivalent linearity in model families including Qwen 3, Gemma 3, Llama 3, at a range of sizes up to Qwen 3 14B. (See the appendix for additional equivalent linear demonstrations for Deepseek R1 0528 Qwen 3 8B Distill, Phi 4, Mistral Ministral and OLMo 2). This approach offers a path to interpreting LLMs for specific inputs that could serve as a complement to other powerful interpretability methods. While this is a local method that is somewhat computationally intensive, this approach does not require additional training as required for sparse autoencoders. For example, training sparse autoencoders for Gemma 2 9B (Lieberum et al., 2024) required substantial compute across multiple feature widths and layers, and must be repeated for each new model and layer. Our approach works immediately on LLMs with gated activations and zero-bias linear layers, and produces a more exact representation for interpretation than other methods.

If equivalent linear mapping were applied to next-token prediction at scale, this would offer a form of interpretability as the difficult but tractable problem of analyzing many equivalent linear systems.

# 2 Method

# 2.1 The Jacobian of a deep ReLU Network

Mohan et al. (2019) observed that deep $R e L U$ networks for image denoising which utilize zero-bias linear layers are “adaptive linear” functions due to their homogeneity of order 1 at a given fixed input, which enables interpretation as an equivalent linear system. Given the homogeneity at a fixed input, the network’s output can be reproduced by numerically computing the Jacobian matrix of the network at a particular input image $\mathbf { x _ { i m } ^ { * } }$ and multiplying it by $\mathbf { x _ { i m } ^ { * } }$ .

$$
\mathbf {y} _ {\mathbf {i m}} ^ {*} = \mathbf {J} \left(\mathbf {x} _ {\mathbf {i m}} ^ {*}\right) \cdot \mathbf {x} _ {\mathbf {i m}} ^ {*} \tag {1}
$$

Due to the global nonlinearity of the network, the Jacobian must usually be computed again at every input of interest. The Jacobian may be the same for similar inputs in the same piecewise region of the response (Balestriero & Baraniuk, 2021; Black et al., 2022) (but this will be demonstrated to not be the case for transformer architectures).

# 2.2 The Jacobian of a transformer decoder

Many open weight LLMs also use linear layers with zero bias, as required for linearity in the architecture of Mohan et al. (2019). A transformer decoder predicts an output token embedding y given a sequence of $k$ input tokens $\mathbf { t } = ( \mathbf { t _ { 0 } } , \mathbf { t _ { 1 } } . . . , \mathbf { t _ { k } } )$ mapped to input embedding vectors $\mathbf { x } = ( \mathbf { x _ { 0 } } , \mathbf { x _ { 1 } } . . . , \mathbf { x _ { k } } )$ , where $\mathbf { t } ^ { * }$ and $\mathbf { x } ^ { * }$ represent a particular sequence. The output embedding prediction is a nonlinear function of the input embedding vectors $\mathbf { x _ { 0 } } , \mathbf { x _ { 1 } } , . . . \mathbf { x _ { k } }$ , as LLMs utilize nonlinear gated activation functions for layer outputs (SwiGLU for Llama 3, GELU for Gemma 3 and Swish for Qwen 3) as well as normalization and softmax attention blocks.

Gated activations like $S w i s h ( { \bf x } ) = { \bf x } \cdot s i g m o i d ( \beta \cdot { \bf x } )$ , with a linear term and a nonlinear term, are also an “adaptive” linear function or, more generally, an adaptive homogeneous function of order 1 (Mohan et al., 2019). If the $s i g m o i d ( \beta \cdot \mathbf { x } )$ term that gives rise to the nonlinearity is frozen for a specific numerical input, e.g. an embedding vector $\mathbf { x _ { 0 } ^ { * } }$ (Elhage et al., 2021) (or equivalently detached from the computational graph with respect to the input), then we have a linear function valid only at $\mathbf { x _ { 0 } ^ { * } }$ where (1) holds and we can numerically compute a Jacobian matrix that carries out $S w i s h ( \mathbf { x _ { 0 } ^ { * } } )$ as a linear operation.

Below we show that computing the Jacobian after effectively substituting specific values for the nonlinear terms also works for other gated activation functions, normalization layers and softmax attention blocks. We further demonstrate that for a given input sequence we can apply necessary gradient detachments so that the entire transformer decoder is an adaptive homogeneous function of order 1, and numerically compute the equivalent linear system that reproduces the transformer output embedding $\mathbf { y } ^ { * }$ .

The Jacobian $\mathbf { J } ( \mathbf { x } )$ of a transformer is the set of matrices generated by taking the partial derivative of the decoder inference function $\mathbf { y } ( \mathbf { x } ) = f ( \mathbf { x _ { 0 } } , \mathbf { x _ { 1 } } . . . , \mathbf { x _ { k } } )$ , with respect to each element of each $\mathbf { x _ { i } }$ (where $\mathbf { x _ { i } }$ for Llama 3.2 3B has length 3072, for example, and therefore the Jacobian matrix for each embedding vector is a square matrix of this size). If a transformer decoder were naturally a homogeneous function of order 1, this Jacobian would generate an equivalent representation of the network.

However, this is not the case. In order to numerically compute an equivalent linear representation, we introduce a “detached” Jacobian $\mathbf { J } ^ { + }$ , which is a set of matrices that captures the full nonlinear forward computation for a particular input sequence $\mathbf { x } ^ { * }$ as a linear system. The detached Jacobian is the numerical Jacobian of the LLM forward operation when its gradient includes a specific set of $d e t a c h ( )$ operations for the nonlinear terms in the normalization, activation and attention operations that force the function to be “adaptively” homogeneous of order 1. The detached Jacobian operates on its corresponding input embedding vector to provide a reconstruction of the LLM forward operation (shown in Fig. A1 and validated in Fig. 1B

by the PyTorch “allclose” function for absolute and relative tolerances of $1 0 ^ { - 1 3 }$ ).

$$
\mathbf {y} ^ {*} = \sum_ {i = 0} ^ {k} \mathbf {J} _ {\mathbf {i}} ^ {+} \left(\mathbf {x} ^ {*}\right) \cdot \mathbf {x} _ {\mathbf {i}} ^ {*} \tag {2}
$$

The conventional Jacobian $\mathbf { J }$ for a particular input sequence $\mathbf { x } ^ { * }$ (as in Mohan et al. (2019)) does not generate an accurate reconstruction the nonlinear LLM forward operation since the transformer function is not homogeneous of order 1. The detached Jacobian $\mathbf { J } ^ { + }$ evaluated at $\mathbf { x } ^ { * }$ is the result of an alternative gradient path through the same network which is homogeneous with respect to the input $\mathbf { x } ^ { * }$ . The detached Jacobian $\mathbf { J } ^ { + }$ only generates an accurate reconstruction at $\mathbf { x } ^ { * }$ and not in the local neighborhood due to the strong nonlinearity of the decoder inference function. The detached Jacobian matrices differ for every input sequence and must be computed numerically for every sequence.

# 2.3 Nonlinear layers as linear operators for a given input

In order to achieve linearity, modifications must be made to the gradient computations of the RMSNorm operation, the activation function (SwiGLU in Llama 3.2) and the softmax term in the attention block output.

# 2.3.1 Normalization

Normalization layers like LayerNorm (Xu et al., 2019) or RMSNorm (Zhang & Sennrich, 2019) with zero bias are nonlinear with respect to their input because they include division by the square root of the variance of the input.

$$
\operatorname {n o r m} (\mathbf {x}) = \frac {\mathbf {x}}{\sqrt {\operatorname {v a r} (\mathbf {x})}} \tag {3}
$$

Mohan et al. (2019) devised a novel bias-free batch-norm layer which detaches the variance term from the network’s computational graph (see their code implementation). Their batch-norm layer returns the same values as the standard batch-norm layer, but it is linear at inference as the nonlinear operation is removed from the gradient computation. This is also similar to the “freezing” of nonlinear terms in attention-only transformers from Elhage et al. (2021).

We make a similar change for Llama 3.2 3B by altering how the gradient with respect to the input is computed at inference for RMSNorm. This is accomplished by substituting the value for the input vector $\mathbf { x } ^ { * }$ for only the variance term as in (4). In PyTorch, this is accomplished by cloning and detaching the $\mathbf { x }$ tensor within the variance operation, so its value will be treated as a constant. The gradient operation is still tracked for $\mathbf { x }$ in the numerator, so that term will be treated as a variable by the PyTorch autograd function for computing the Jacobian. The gradient of the function is then computed at $\mathbf { x } ^ { * }$ (we assume for simplicity an input sequence of length 1).

$$
\operatorname {n o r m} (\mathbf {x}) = \frac {\mathbf {x}}{\sqrt {\operatorname {v a r} \left(\mathbf {x} ^ {*}\right)}} \tag {4}
$$

We define the detached Jacobian as follows:

$$
\mathbf {J} _ {\mathbf {n}} ^ {+} = \left[ \frac {\partial}{\partial \mathbf {x}} \operatorname {n o r m} (\mathbf {x}) \right] | _ {\mathbf {x} = \mathbf {x} ^ {*}} \tag {5}
$$

We can rewrite the pointwise linear RMSNorm as follows:

$$
\operatorname {n o r m} \left(\mathbf {x} ^ {*}\right) = \mathbf {J} _ {\mathbf {n}} ^ {+} \left(\mathbf {x} ^ {*}\right) \cdot \mathbf {x} ^ {*} \tag {6}
$$

At inference for a given input, we now have a linear RMSNorm whose output is numerically identical to the one used in training. However, when we take the gradient with respect to the input vector $\mathbf { x }$ in eval mode, the numerical output is the detached Jacobian matrix ${ \bf J _ { n } ^ { + } }$ , which we can use to reconstruct the normalization output as a linear system.

The goal is to apply this same approach for other nonlinear functions in the decoder such that the entire computation from the input embedding vectors to the predicted output is linear for a given input, and we can compute and interpret the set of detached Jacobian matrices.

# 2.3.2 Activation functions

While Mohan et al. (2019) relied on ReLU activation functions, which do not require any changes to achieve linearity, Llama 3.2 3B uses SwiGLU (Shazeer, 2020), Gemma 3 uses approximate GELU (Hendrycks & Gimpel, 2016) and Qwen 3 uses Swish for activation functions. There is a linear $\mathbf { x }$ term in each of these, and the gradients can be cloned and detached from the nonlinear terms. This manipulation produces a pointwise linear Swish layer with respect to the input x.

$$
\operatorname {S w i s h} (\mathbf {x}) = \mathbf {x} \cdot \operatorname {s i g m o i d} (\beta \cdot \mathbf {x}) \tag {7}
$$

$$
\operatorname {S w i s h} \left(\mathbf {x} ^ {*}\right) = \mathbf {x} \cdot \operatorname {s i g m o i d} (\beta \cdot \mathbf {x}) | _ {\mathbf {x} = \mathbf {x} ^ {*}} \tag {8}
$$

$$
\operatorname {S w i s h} \left(\mathbf {x} ^ {*}\right) = \left(\left[ \frac {\partial}{\partial \mathbf {x}} \operatorname {S w i s h} (\mathbf {x}) \right] \mid_ {\mathbf {x} = \mathbf {x} ^ {*}}\right) \cdot \mathbf {x} ^ {*} \tag {9}
$$

$$
\operatorname {S w i s h} \left(\mathbf {x} ^ {*}\right) = \mathbf {J} _ {\mathbf {S w i s h}} ^ {+} \left(\mathbf {x} ^ {*}\right) \cdot \mathbf {x} ^ {*} \tag {10}
$$

Detaching the gradient from the Swish output thus allows for a pointwise linear form of Swish at inference. A similar procedure may be carried out for SwiGLU with Llama 3 and GELU with Gemma 3 (see supplement, eq. 17).

# 2.3.3 Attention

The softmax operation at the output of the attention block can also be detached, with the linear relationship preserved through the subsequent multiplication with $\mathbf { V }$ , which is a linear function of $\mathbf { x }$ . Below, ${ \bf Q } = { \bf W } _ { { \bf Q } } { \bf x }$ ${ \bf K } = { \bf W } _ { \bf K } { \bf x }$ and $\mathbf { V } = \mathbf { W } _ { \mathbf { V } } \mathbf { x }$ .

$$
A t t n (\mathbf {Q}, \mathbf {K}, \mathbf {V}) = s o f t m a x \left(\frac {\mathbf {Q} \mathbf {K} ^ {T}}{\sqrt {d _ {k}}}\right) \cdot \mathbf {V} \tag {11}
$$

$$
A t t n (\mathbf {x}) = \left[ s o f t m a x \left(\frac {\mathbf {Q} \mathbf {K} ^ {T}}{\sqrt {d _ {k}}}\right) \mid_ {\mathbf {Q} = \mathbf {Q} ^ {*}, \mathbf {K} = \mathbf {K} ^ {*}} \right] \cdot \mathbf {W} _ {\mathbf {V}} \mathbf {x} \tag {12}
$$

$$
\operatorname {A t t n} \left(\mathbf {x} ^ {*}\right) = \left(\left[ \frac {\partial}{\partial \mathbf {x}} \operatorname {A t t n} (x) \right] \mid_ {\mathbf {x} = \mathbf {x} ^ {*}}\right) \cdot \mathbf {x} ^ {*} \tag {13}
$$

$$
A t t n \left(\mathbf {x} ^ {*}\right) = \mathbf {J} _ {\mathbf {A t t n}} ^ {+} \left(\mathbf {x} ^ {*}\right) \cdot \mathbf {x} ^ {*} \tag {14}
$$

The linear $\mathbf { x }$ term within $\mathbf { V }$ makes it possible for the attention block to be pointwise linear at inference, as the gradient for the softmax output is detached.

# 2.3.4 The Transformer Decoder

With the the above gradient detachments for the normalization layers, activation functions and attention blocks, the transformer decoder network is linear with respect to $\mathbf { x } ^ { * }$ when evaluated at $\mathbf { x } ^ { * }$ (shown here for length $k$ ).

$$
\mathbf {y} ^ {*} = \sum_ {i = 0} ^ {k} \mathbf {J} _ {\mathbf {i}} ^ {+} \left(\mathbf {x} ^ {*}\right) \cdot \mathbf {x} _ {\mathbf {i}} ^ {*} \tag {15}
$$

The output of the network incorporating the above gradient detachments is unchanged from the original architecture but has an equivalent linear representation.

# 3 Results

# 3.1 Pointwise linearity of the predicted output

In order to validate whether the detached Jacobian achieves reconstruction with a linear representation, we can compare the predicted output embedding vector for a given input token sequence to the reconstruction of the output. As a baseline, we can also compute the reconstruction using the conventional Jacobian as in Mohan et al. (2019) and examine its accuracy. Given the above argument that the appropriate gradient detachments are necessary to achieve output reconstruction, we expect the detached Jacobian to accomplish reconstruction, but the conventional Jacobian to fail.

Fig. 1B compares the network output to both the conventional and detached Jacobian reconstructions for Llama 3.2 3B and Qwen 3 14B. The reconstruction of the output embedding with the detached Jacobian matrices falls on the identity line when compared with the output embedding, showing accurate reconstruction, while the reconstruction with the conventional Jacobian is not at all close to the output. This comparison therefore demonstrates the validity of the reconstruction with the linear system of the detached Jacobian for Qwen 3 14B for a particular input.

In order to examine the fidelity of the detached Jacobian reconstruction, we compared the reconstruction against the network output using PyTorch function allclose with varying tolerance levels. The reconstructions achieved numerical agreement within a relative and absolute tolerance of $1 0 ^ { - 1 3 }$ . This tolerance is approximately 50 times the machine epsilon of $2 . 2 \cdot 1 0 ^ { - 1 6 }$ for 64-bit floating-point numbers, indicating high-fidelity reconstruction that is numerically equivalent to the reference implementation for practical purposes. As an additional metric, the norm of the detached Jacobian reconstruction error divided by the norm out of the output is on the order of 10−14. $1 0 ^ { - 1 4 }$

The numerical computation of the full detached Jacobian matrix takes on the order of 10 seconds for an input sequence of 8 tokens for Llama 3.2 3B in float32 on a GPU with 24 GB VRAM. In contrast, the full Jacobian matrix for the same sequence at float64 precision with Qwen 3 14B on a GPU with 40 GB VRAM takes 20 seconds. An approximate method for computing the top $k$ singular vectors of the detached Jacobian without forming the full matrix utilizing Lanczos iteration has also been implemented in JAX for Gemma 3 4B, allowing for the efficient computation of the top 16 singular vectors of the detached Jacobian for up to 100 input-token input. The maximum length tested on a GPU with 80 GB VRAM was over 400 tokens for only the top singular vector corresponding to each token. The Lanczos method trades reconstruction precision for scalability while preserving interpretability, and examples are available in the code repository.

# 3.2 Single-unit feature selectivity and invariance

Since the detached Jacobian applied to the input embedding reproduces the predicted output embedding vector, and the elements of the predicted output embedding vector are the units of the last transformer layer, the rows of the detached Jacobian matrices represent the input features to which the last layer units are selective and invariant for that particular input sequence (Kadkhodaie et al., 2023; Mohan et al., 2019).

![](images/7310699632a864d0dea0c933f2223b94824f4d535709e22ac31a247582af11a7.jpg)  
A   
Model: meta-llama/Llama-3.2-3B-Instruct Input+prediction: "The bridge out of Marin is the [most](most.md) Cols of the Detached Jacobian with Largest Norms

![](images/db1cd3338d7a6c3b4e66271dc7b13ff87cca1583c972221469f703053fd91720.jpg)  
B   
Model: meta-llama/Llama-3.2-3B-Instruct Input+prediction: "The bridge out of Marin is the[most](most.md)" SVDof the Detached Jacobian   
Figure 2: Given the sequence “The bridge out of Marin is the”, the most likely prediction is “most” for Llama 3.2 3B. The detached Jacobian matrices for each token represent an equivalent linear system that computes the predicted output embedding. A) We show the features which drive large responses in single units in the last decoder layer, which are the rows of the detached Jacobian with the largest norm values, and decode each of those into the most likely input embedding token. The block of words at the top shows the ordered decoded “feature" input tokens from the largest rows of the detached Jacobian matrix for the input tokens. A similar operation is carried out for columns of the largest norm values, which are decoded to the output token space. Note that the activation distribution of column magnitudes is fairly sparse, with only a few units driving the response. B) We take the singular value decomposition of the detached Jacobian matrix corresponding to each input token, which summarizes the modes driving the response, and decode the right and left singular vectors $V$ and $U$ to input and output embeddings, shown in colors. The singular value spectrum is extremely low rank, and decoding the $U$ singular vectors returns candidate output token, including “most” and “first”. Decoding the $V$ singular vectors returns variants of the input tokens like “bridge”, “Marin” and “is”, as well as others that are not clearly related to the input sequence.

The activation of a particular unit in the last layer is determined by the inner product of a row of the detached Jacobian and the input embedding vector. We can sort by the magnitude of row norms, then map the largestmagnitude rows of the detached Jacobian back to the input embedding space (via cosine similarity to the input embedding matrix, since input embeddings are not typically mapped back to tokens during normal model operation) to determine the tokens that cause each unit to be strongly positive or negative. We can see in Fig. 2A that the units respond strongly to the words of the prompt, including “bridge”, “Marin” and “is”. Decoding of the rows of the detached Jacobian for each token as well as the distribution of activations for this sequence is shown in Fig. 2A. The columns of the Jacobian can also be decoded in the conventional manner to the output token space with the unembedding layer, and these turn out to be tokens that could be predicted, which include words like “most” or “first”, which could be acceptable outputs.

# 3.3 Singular vectors of the detached Jacobian

An alternative approach is to look at the singular value decomposition of the detached Jacobian $\mathbf { J _ { i } ^ { + } } = \mathbf { U } \mathbf { \Sigma } \mathbf { U } ^ { \mathbf { T } }$ , following Mohan et al. (2019). Since the detached Jacobian represents the forward computation, the fact that the SVD is very low rank shows the entire forward computation can be approximated with only a few singular vectors operating on the input embeddings.

Unlike image denoising models (Mohan et al., 2019; Kadkhodaie et al., 2023) where input and output spaces are similar and singular vectors U and V have a high cosine similarity, corresponding left and right singular vectors of LLMs differ substantially. This reflects the asymmetric nature of next-token prediction, as right

singular vectors V capture which input token features drive the computation, while left singular vectors U capture which output token directions are predicted.

In Fig. 2B, the singular vectors are decoded for Llama 3.2 3B (and for other models in supplemental Fig. A3). The right singular vectors $V$ are decoded to input tokens in the same way the rows of the detached Jacobian were above (nearest-neighbor to input embeddings from cosine similarity), and we see similar decoding of the top tokens to the features driving the most active single units. The left singular vectors $U$ can be decoded to output embedding tokens (with the conventional method from the unembedding matrix), and “most” is the strongest, as it was in the columns of the detached Jacobian matrices.

<table><tr><td></td><td colspan="5">Input token 0</td><td colspan="5">Input token 1</td><td colspan="5">Input token 2</td></tr><tr><td>Layer 25_0</td><td colspan="5">largest most first longest fastest last third</td><td>bridge</td><td>bridges</td><td>Bridge</td><td colspan="2">gateway</td><td colspan="5">hardest ones exit easiest first most fastest highway</td></tr><tr><td>Layer 25_1</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridges</td><td>bridges</td><td>bridge</td><td>bridge</td><td>Bridge</td><td>bridge</td><td>bridge</td><td>exit</td><td>exit</td><td>exits eternity</td><td>exit</td><td></td></tr><tr><td>Layer 25_2</td><td>bridges</td><td>bridge</td><td>Bridge</td><td>bridge</td><td>parliament</td><td>Exit</td><td>exit</td><td>jams</td><td></td><td></td><td colspan="5">INCIDENT symbolism</td></tr><tr><td>Layer 26_0</td><td colspan="5">first most largest last longest latest gateway only</td><td>bridge</td><td>bridges</td><td colspan="3">metaphor gateway connecting</td><td colspan="5">highway first exit ones last hardest roads</td></tr><tr><td>Layer 26_1</td><td>bridge</td><td>bridges</td><td>metaphor</td><td>Bridges</td><td>Bridge</td><td>bridges</td><td>bridge</td><td>structures brid</td><td>bridge</td><td></td><td colspan="5">.charset jams Margins</td></tr><tr><td>Layer 26_2</td><td>parliament structures</td><td>bridges</td><td>Parliament</td><td>bridge</td><td></td><td>Exit</td><td>exit</td><td>choke</td><td>Exit</td><td>panicked</td><td colspan="5">symbolism metaphor</td></tr><tr><td>Layer 27_0</td><td>first last largest</td><td>bridge</td><td>longest</td><td>most oldest latest</td><td></td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridges</td><td></td><td>last first exit</td><td colspan="4">highway bottleneck next road choke</td></tr><tr><td>Layer 27_1</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridges</td><td></td><td>bridges</td><td>bridge</td><td>Bridge</td><td>bridge</td><td>brid Bridge</td><td>EXIT exit</td><td colspan="4">exits (exit</td></tr><tr><td>Layer 27_2</td><td>bridge</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>structures</td><td></td><td>exit</td><td>exit</td><td>Exit</td><td></td><td>exit</td><td colspan="4">exit incident EXTRA incidents</td></tr><tr><td>Layer 28_0</td><td>bridge longest largest first busiest last oldest</td><td>most</td><td></td><td></td><td></td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridge</td><td></td><td>highway exit bottleneck highways</td><td colspan="4">Highway last road exits</td></tr><tr><td>Layer 28_1</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridge</td><td></td><td>highway</td><td colspan="4">highways coast freeway roads road route</td><td colspan="5">exit exits EXIT Exit</td></tr><tr><td>Layer 28_2</td><td>bridge</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>brid</td><td></td><td>exit</td><td>exit</td><td>Exit</td><td>exit</td><td>exit</td><td colspan="4">Saddam Mosul Kuwait incident metaphor</td></tr><tr><td>Layer 29_0</td><td colspan="5">bridge only fourth last third longest fifth most</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridges</td><td></td><td colspan="5">only last first highway third highways exit fourth</td></tr><tr><td>Layer 29_1</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridges</td><td></td><td>coast</td><td>highway</td><td colspan="3">road driveway coastline roads highways freeway</td><td colspan="5">exits exit EXIT</td></tr><tr><td>Layer 29_2</td><td>bridge</td><td>bridges</td><td>bridge</td><td colspan="2">structures brid structure</td><td>Exit</td><td>exit</td><td>Highway</td><td>Exit</td><td></td><td colspan="5">Saddam Mosul Elvis metaphor incident</td></tr><tr><td>Layer 30_0</td><td colspan="5">bridge most longest fourth third last only fifth</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridge</td><td></td><td colspan="5">highway only bridge last first Highway road highways</td></tr><tr><td>Layer 30_1</td><td>bridge</td><td>bridges</td><td>Bridges</td><td>Bridge</td><td></td><td colspan="5">coast freeway highway coastline road roads highways</td><td colspan="5">bridge Bridge bridges bridge</td></tr><tr><td>Layer 30_2</td><td>bridge</td><td>structure</td><td>structures</td><td>bridges</td><td>bridge</td><td colspan="5">sail seab sailing Bermuda ship</td><td colspan="5">Memphis Kuwait Jordan Saddam Iowa</td></tr><tr><td>Layer 31_0</td><td colspan="5">bridge most only last longest first third largest</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>Bridge</td><td></td><td colspan="5">only last highway first bridge exit Highway most</td></tr><tr><td>Layer 31_1</td><td colspan="5">coast airlines Interior airline interior Lua Speedway</td><td colspan="5">coast coastline coastal Coast Coastal route</td><td colspan="5">bridge Bridge bridges bridge underwater brid</td></tr><tr><td>Layer 31_2</td><td>bridge</td><td>bridges</td><td>bridge</td><td>brid Bridge</td><td>structure</td><td colspan="5">ship sail sailing dock seab</td><td colspan="5">Jordan Memphis Kuwait Mississippi</td></tr><tr><td>Layer 32_0</td><td colspan="5">bridge most only first last longest third largest</td><td>bridge</td><td>Bridge</td><td>bridges</td><td>Bridge</td><td>bridge</td><td colspan="5">only last first highway most main route exit</td></tr><tr><td>Layer 32_1</td><td colspan="5">interior airline steam airlines Trail breed vacuum</td><td colspan="5">coast coastal coastline route Coast Route beach</td><td colspan="5">bridge span underwater connecting deck public member</td></tr><tr><td>Layer 32_2</td><td>bridge</td><td>bridge</td><td>bridges</td><td>Bridge</td><td>bridge</td><td colspan="5">ship sail docking seab</td><td colspan="5">Kuwait Jordan Memphis Edmonton Mississippi Nile</td></tr><tr><td>Layer 33_0</td><td colspan="5">only first last most third main second subject</td><td>bridge</td><td>Bridge</td><td>bridges</td><td>Bridge</td><td>only</td><td colspan="5">only last first key main same most exit</td></tr><tr><td>Layer 33_1</td><td colspan="5">planet interior cabin floors roots</td><td colspan="5">coast coastline coastal Coast route beach Coastal</td><td colspan="5">span public member library platform floating intervening deck</td></tr><tr><td>Layer 33_2</td><td>bridge</td><td>bridge</td><td>structure</td><td>bridges</td><td>brid Bridge</td><td colspan="5">ship orbit aircraft sail vessel</td><td colspan="5">Kuwait Nile Edmonton Saskatchewan Tulsa</td></tr></table>

Table 1: The top eight tokens decoded from the largest three singular vectors of the detached Jacobian for the layer outputs from Qwen 3 14B for the sequence “The bridge out of Marin is the” with the prediction [only](only.md). Legend: “Bridge” , “only” , “highway” , “exit” , “most” . Semantic concepts emerge clearly by layer 25. The predicted token ’only’ appears prominently in later layers alongside related infrastructure and geographic concepts. Note the progression from general bridge concepts in early layers to specific architectural terms (span, deck, platform, floating), geographic terms (coast, coastline, route, beach) and locations with notable bridges in the final layer. See also supplemental Tables 3, 4 and 5 for the longer tables for Llama, Gemma and Qwen.

# 3.4 Comparative Analysis of Singular Vectors in Llama 3 and Qwen 3

A direct comparative analysis of the singular vectors derived from the detached Jacobian matrices of Llama 3 3.2B and Qwen 3 4B offers a lens through which to view not only the shared computational principles of modern LLMs but also their distinct data-driven approaches. While both models demonstrate a consistent hierarchical organization of their predictive computations, they diverge significantly in their semantic richness, their approach to multi-lingual representations, and their tokenization strategies. These differences are made visible by the SVD of their equivalent linear mappings and reveal unique styles that likely reflect their underlying training datasets.

In terms of their singular value spectra over 100 examples, Fig. 3 shows that both Llama 3 and Qwen 3 are consistently low-rank. The first token for Qwen 3 has a low average rank at 1.01 than Llama 3 at 1.06, but Qwen’s next singular vectors are all higher rank than those of Llama. Llama’s “beginning of text” token is surprisingly of lower rank than the first text token.

![](images/ea396aae952e1dd4cc6d6648f7ac1e94cc7a7d79411e47e4746fb306630ddbfc.jpg)

![](images/d8f6dbc644141d37567d36c49908fbab143f7b37876a3978612c52076ae22208.jpg)  
Figure 3: For 100 short input phrases, the stable rank distribution as a function of input token number. Note that Llama 3.2 3B uses a $< | B o T | >$ token and Qwen 3 4B does not.

In terms of the semantic content of the singular vectors, both Llama 3 and Qwen 3 employ a similar hierarchical strategy. The first singular vector $U _ { 0 }$ with largest magnitude establishes the foundational layer of prediction. This vector primarily contains high-frequency tokens that provide grammatical structure or represent the most probable continuations. For example, in “Should have known,” both models place “better” and common punctuation in their $U _ { 0 }$ vectors. This shared pattern reinforces the hypothesis that the dominant computational axis in transformers is dedicated to establishing a coherent structural and high-probability scaffold upon which more nuanced semantic meaning can be built. See section A.5 in appendix for more examples of each of these analyses. 21 phrases out of 100 fit this category.

# Llama 3 (Abstract Semantics) vs. Qwen 3 (Direct Semantics)

A distinction in semantic processing is pronounced in the secondary singular vectors ( $U _ { 1 }$ and $U _ { 2 }$ ). Llama 3 consistently demonstrates a rich and abstract English-centric semantic space. For the input “Will break,” its $U _ { 1 }$ vector contains a diverse set of conceptual possibilities like “confidentiality,” “independence,” “promises,” and “ground.” This indicates a capacity to reason about abstract concepts that can be “broken.” Qwen 3’s vectors for the same phrase are more direct and action-oriented, featuring tokens like “ties,” “neck,” and “dance,” alongside Chinese characters for “stiff” and “can’t.” This highlights Llama 3’s deep modeling of the nuances and abstractions within the English language. 14 phrases out of 100 fit this category.

# Qwen 3’s Multilingual Reasoning

Perhaps the most obvious difference revealed by this analysis is Qwen 3’s multilingual and cross-lingual representation capability, which is largely absent in Llama 3’s vectors for the analyzed English prompts. In nearly every example, Qwen 3’s secondary vectors are populated with non-English tokens—primarily Chinese, but also Russian and others that are conceptually related to the input phrase. For “The broken,” Qwen 3’s $U _ { 1 }$ vector includes Chinese tokens for “bicycle,” “vase,” “necklace,” and “window”—all concrete examples of breakable objects. This demonstrates that Qwen 3 does not operate in a constrained linguistic space; rather, it accesses a unified, cross-lingual conceptual representation to generate predictions. 38 phrases out of 100 fit this category.

# Examples of sub-word Fragments in Qwen 3

We also observed a difference in tokenization and morphological strategy. Qwen 3’s secondary vectors frequently contain what appear to be sub-word fragments or tokenization artifacts (e.g., “e,” “eer,” “ection,” “ing”). The persistent recurrence of these tokens, often in the $U _ { 2 }$ vector, suggests that part of Qwen 3’s computational process involves constructing or modifying words at a morphological level. This could be an efficient mechanism for handling its multilingual vocabulary. Llama 3 tends to operate with whole-word semantic tokens, indicating a different approach to vocabulary representation. 33 phrases out of 100 fit this category.

# 3.5 Layer output singular vectors

Table 1 shows the top eight tokens decoded from the largest three singular vectors of the detached Jacobians of selected layer outputs for Qwen 3 14B. The words “bridge” (and its variants), “highway”, “exit”, “most” and “only” are highlighted to show their appearances in decoded singular vectors. Early layers are excluded as the tokens are unintelligible. The emergence of intelligible tokens in later layers is shown in the tables as something like a phase change in the representation. Qwen 3 generates infrastructure and engineering related concepts before producing “only”.

Fig. 4A shows the normalized singular value spectra of the detached Jacobian at the output of every layer. Llama 3.2 3B has 28 layers, and decoding the largest singular vectors shows that the word representation of these intermediate operations is not interpretable until later layers. From the decoding of the top singular vector by layer, “only” emerges in layer 19. From the map of the progression of the projection of the top two singular vectors onto the top two singular vectors of the last layer in Fig. 4B, we first see a shift at layer 11 toward the prediction.

Since the layer-by-layer operations are only linear, the stable rank $\begin{array} { r } { R = ( \sum _ { i } ^ { L } S _ { i } ^ { 2 } ) / S _ { m a x } ^ { 2 } } \end{array}$ serves as a measure of the effectively dimensionality of the subspace of the representation at a particular layer.

When looking at $W _ { 0 \_ \mathrm { t o } \_ k }$ , the cumulative layer transform up through layer $k$ , the dimensionality of the detached Jacobian steadily decreases. When considering each layer $i$ as its own individual transform $W _ { i }$ (where $\begin{array} { r } { W _ { 0 \_ \mathrm { t o } \_ k } = \prod _ { i = 0 } ^ { k } W _ { i } } \end{array}$ for the simplified scenario of a single input token; there are other cross-token terms not shown here for mid-layer detached Jacobians for longer input sequences), we also see a large peak in dimensionality near the end.

Table 2: Detached Jacobian matrices as steering operators, pilot results with Llama 3.1 8B, Qwen 3 8B and Gemma 3 12B.   

<table><tr><td>Model</td><td>Layer intervention</td><td>Input sequence</td><td>Normal response</td><td>Steered response</td></tr><tr><td>Llama 3.1 8B</td><td>24 / 36</td><td>&#x27;I&#x27;m going to ari-zona to see the&#x27;</td><td>&#x27;I&#x27;m going to ari-zona to see the Grand Canyon. I&#x27;ve heard it&#x27;s a must see. I&#x27;ve also heard it&#x27;s a bit of a trek to&#x27;</td><td>&#x27;I&#x27;m going to ari-zona to see the Grand Canyon, and I&#x27;m planning to hike the Bright Golden Gate Bridge (I think that&#x27;s the name of the trail) in the Grand Canyon.&#x27;</td></tr><tr><td>Qwen 3 8B</td><td>24 / 36</td><td>&#x27;Here is a painting of the&#x27;</td><td>&#x27;Here is a paint-ing of the same scene as in the pre-vious question, but now the two peo-ple are standing on the same side of the building.&#x27;</td><td>&#x27;Here is a painting of the Golden Gate Bridge in San Fran-cisco. The Golden Gate Bridge is one of the most famous bridges in the world.&#x27;</td></tr><tr><td>Gemma 3 12B</td><td>33 / 48</td><td>&#x27;I went to new york to see the&#x27;</td><td>&#x27;I went to new york to see the memorial and museum. It was a very moving and emotional ex-perience.&#x27;</td><td>&#x27;I went to new york to see the 10th anniversary of the Broadway show, &quot;The Golden Gate Bridge Bridge.&quot; It was a great show.&#x27;</td></tr></table>

# 3.6 The detached Jacobian as a conceptual steering operator

Steering vectors are a well-known technique for altering LLM outputs (Liu et al., 2023) where a vector with certain properties is added to a mid-layer representation, and the sum is passed through the rest of

![](images/cda0bf2efbc84c768d5344eaf6e82f2f99f1b1fbe57ad1fa36b5ed811d3ff6d2.jpg)

![](images/3b20bcf0cd88927be6bc0248192c3a67e94f5f6aca2e33659042e5616d14aceb.jpg)  
B   
Model: meta-llama/Llama-3.2-3B-Instruct Input seq:"The bridge out of Marin isthe[most]]” Projection of layer Jacobian singular vectors

![](images/a7aed7b2c84a1f96bde6ac5be0a88e87d3b83bc2db0b5656b02de51a02049636.jpg)

![](images/de4b43dfc95cd312e41a8c384a7b7e2ed60aea603e9f9b6f6e7d2c22e0d69a75.jpg)  
D   
Model: meta-llama/Llama-3.2-3B-Instruct Input+prediction:"The bridge out of Marin is the[[most]" etachedlacobianLayerMatrixDimensionalityasa function   
Figure 4: Since the transform representing the model forward operation is linear after detachment, we can also decompose each transformer layer as a linear operation as well. A) The singular value spectrum for the cumulative transform up to layer $i$ . Note that later layers are lower rank than earlier layers. The top singular vectors of the later layers show a clear relation to the prediction of “most”. B) The projection of the top two singular vectors onto the top two singular vectors of the final layer. The singular vectors of the first 10 layers are very different than those of the last layer, so the projections remain close to the origin. At layer 11, they begin to approach those of the output layer. C) A measurement of the dimensionality of the cumulative transform up to the output of each layer as the stable rank. Within each layer, the outputs of the attention and MLP modules (prior to adding the residual terms) can also be decomposed as linear mappings. The dimensionality decreases deeper into the network at each of these points, except for a slight increase for the attention and MLP module outputs in layer 3. D) The dimensionality of the detached Jacobian for the layer-wise transform at layer $i$ for the layer output, as well as the attention module output and MLP module output.

the network to generate an output token. Here we utilize the detached Jacobian as an operator instead of an additive vector, and compute it from an intermediate layer for a “steering” phrase like “The Golden Gate” (after the “Golden Gate Claude” demo (Templeton et al., 2024)). The model predicts “Bridge”, and this detached Jacobian matrix is used to steer the continuation of a new phrase toward this concept. For a new input phrase, like “Here is a painting of the”, the “new” input sequence’s embedding vectors $\mathbf { x _ { n e w } ^ { * } }$ are multiplied by the detached Jacobian previously computed from the steering concept $\mathbf { J _ { L } ^ { + } } ( \mathbf { x _ { s t e e r } ^ { * } } )$ , scaled by $\lambda$ and added to the layer activation $\bf { f } _ { L i }$ from the “new” input.

$$
\mathbf {f} _ {\mathrm {L i}} (\mathbf {x}) = \lambda \cdot \mathbf {f} _ {\mathrm {L i}} \left(\mathbf {x} _ {\text {n e w}} ^ {*}\right) + (1 - \lambda) \cdot \mathbf {J} _ {\mathrm {L i}} ^ {+} \left(\mathbf {x} _ {\text {s t e e r}} ^ {*}\right) \cdot \mathbf {x} _ {\text {n e w}} ^ {*} \tag {16}
$$

This steered intermediate representation is then put through the remaining layers of the network and the next token is decoded. The detached Jacobian must only be computed once for the steering concept, and therefore this method is rather efficient. Table 2 shows how the detached Jacobian from an intermediate layer imposes the Golden Gate Bridge as the semantic output coherent with the rest of the input sentence, even when it is difficult to make a logical connection. Beyond demonstrating practical utility, the success of the steering operator provides validation that the detached Jacobian captures actual semantic representations.

# 4 Discussion

The detached Jacobian approach allows for linear representations of the transformer decoder to be found for each input sequence, without changing the output. The intermediate outputs of each layer and the attention and MLP modules are also accurately reproduced by the detached Jacobian function.

The detached Jacobian operation is accurate only at the specific operating point at which the matrices were computed by the PyTorch autograd function. A short distance away in the input embedding neighborhood, the detached Jacobian will be extremely different because the manifold is highly curved. (Although local neighborhood validity is less applicable to LLMs which map tokens to embedding vectors, as inputs will only ever discretely sample the embedding space, and there is not an obvious need for exploring the local neighborhood to embedding vectors that do not represent words from the input vocabulary). The manifold is not piecewise linear, but only has a linear equivalent at the operating point, which can be found numerically for every input sequence.

# 5 Conclusion

While our current analysis covers a limited range of examples, the approach suggests a path toward largescale interpretability by computing the detached Jacobian for many token predictions in a given dataset and analyzing the resulting linear systems to understand semantic patterns across diverse contexts. Given the low-rank nature of the detached Jacobian, our Lanczos method, which efficiently computes only the top singular vectors of the Jacobian, is a step toward making this practical. Future work should explore this scaling potential, moving toward comprehensive equivalent linear analysis of LLM behavior across tasks, domains, and model architectures.

# References

Guillaume Alain and Yoshua Bengio. Understanding intermediate layers using linear classifier probes. arXiv preprint arXiv:1610.01644, 2016.   
Randall Balestriero and Richard Baraniuk. Fast jacobian-vector product for deep networks. arXiv preprint arXiv:2104.00219, 2021.   
Sid Black, Lee Sharkey, Leo Grinsztajn, Eric Winsor, Dan Braun, Jacob Merizian, Kip Parker, Carlos Ramón Guevara, Beren Millidge, Gabriel Alfour, et al. Interpreting neural networks through the polytope lens. arXiv preprint arXiv:2211.12312, 2022.   
Trenton Bricken, Adly Templeton, Joshua Batson, Brian Chen, Adam Jermyn, Tom Conerly, Nick Turner, Cem Anil, Carson Denison, Amanda Askell, Robert Lasenby, Yifan Wu, Shauna Kravec, Nicholas Schiefer, Tim Maxwell, Nicholas Joseph, Zac Hatfield-Dodds, Alex Tamkin, Karina Nguyen, Brayden McLean, Josiah E Burke, Tristan Hume, Shan Carter, Tom Henighan, and Christopher Olah. Towards monosemanticity: Decomposing language models with dictionary learning. Transformer Circuits Thread, 2023. https://transformer-circuits.pub/2023/monosemantic-features/index.html.   
Aditya Cowsik, Tamra Nebabu, Xiao-Liang Qi, and Surya Ganguli. Geometric dynamics of signal propagation predict trainability of transformers. arXiv preprint arXiv:2403.02579, 2024.   
Nelson Elhage, Neel Nanda, Catherine Olsson, Tom Henighan, Nicholas Joseph, Ben Mann, Amanda Askell, Yuntao Bai, Anna Chen, Tom Conerly, Nova DasSarma, Dawn Drain, Deep Ganguli, Zac Hatfield-Dodds, Danny Hernandez, Andy Jones, Jackson Kernion, Liane Lovitt, Kamal Ndousse, Dario Amodei, Tom Brown, Jack Clark, Jared Kaplan, Sam McCandlish, and Chris Olah. A mathematical framework for transformer circuits. Transformer Circuits Thread, 2021. https://transformercircuits.pub/2021/framework/index.html.   
Aaron Grattafiori, Abhimanyu Dubey, Abhinav Jauhri, Abhinav Pandey, Abhishek Kadian, Ahmad Al-Dahle, Aiesha Letman, Akhil Mathur, Alan Schelten, Alex Vaughan, et al. The llama 3 herd of models. arXiv preprint arXiv:2407.21783, 2024.   
Dan Hendrycks and Kevin Gimpel. Gaussian error linear units (gelus). arXiv preprint arXiv:1606.08415, 2016.   
Zahra Kadkhodaie, Florentin Guth, Eero P Simoncelli, and Stéphane Mallat. Generalization in diffusion models arises from geometry-adaptive harmonic representation. arXiv preprint arXiv:2310.02557, 2023.   
Tom Lieberum, Senthooran Rajamanoharan, Arthur Conmy, Lewis Smith, Nicolas Sonnerat, Vikrant Varma, János Kramár, Anca Dragan, Rohin Shah, and Neel Nanda. Gemma scope: Open sparse autoencoders everywhere all at once on gemma 2. arXiv preprint arXiv:2408.05147, 2024.   
Sheng Liu, Lei Xing, and James Zou. In-context vectors: Making in context learning more effective and controllable through latent space steering. arXiv preprint arXiv:2311.06668, 2023.   
Sreyas Mohan, Zahra Kadkhodaie, Eero P Simoncelli, and Carlos Fernandez-Granda. Robust and interpretable blind image denoising via bias-free convolutional neural networks. arXiv preprint arXiv:1906.05478, 2019.   
Nvidia. Accelerating hugging face llama 2 and llama 3 models with transformer engine. https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/examples/te_llama/ tutorial_accelerate_hf_llama_with_te.html, 2024.   
Lee Sharkey, Bilal Chughtai, Joshua Batson, Jack Lindsey, Jeff Wu, Lucius Bushnaq, Nicholas Goldowsky-Dill, Stefan Heimersheim, Alejandro Ortega, Joseph Bloom, et al. Open problems in mechanistic interpretability. Transactions on Machine Learning Research, 2025.   
Noam Shazeer. Glu variants improve transformer. arXiv preprint arXiv:2002.05202, 2020.

Adly Templeton, Tom Conerly, Jonathan Marcus, Jack Lindsey, Trenton Bricken, Brian Chen, Adam Pearce, Craig Citro, Emmanuel Ameisen, Andy Jones, Hoagy Cunningham, Nicholas L Turner, Callum McDougall, Monte MacDiarmid, C. Daniel Freeman, Theodore R. Sumers, Edward Rees, Joshua Batson, Adam Jermyn, Shan Carter, Chris Olah, and Tom Henighan. Scaling monosemanticity: Extracting interpretable features from claude 3 sonnet. Transformer Circuits Thread, 2024. URL https://transformer-circuits.pub/ 2024/scaling-monosemanticity/index.html.   
Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N Gomez, Lukasz Kaiser, and Illia Polosukhin. Attention is all you need. arXiv preprint arXiv:1706.03762, 10:S0140525X16001837, 2017.   
Jingjing Xu, Xu Sun, Zhiyuan Zhang, Guangxiang Zhao, and Junyang Lin. Understanding and improving layer normalization. Advances in neural information processing systems, 32, 2019.   
Yaodong Yu, Sam Buchanan, Druv Pai, Tianzhe Chu, Ziyang Wu, Shengbang Tong, Benjamin Haeffele, and Yi Ma. White-box transformers via sparse rate reduction. Advances in Neural Information Processing Systems, 36:9422–9457, 2023.   
Biao Zhang and Rico Sennrich. Root mean square layer normalization. Advances in Neural Information Processing Systems, 32, 2019.

# A Appendix

# A.1 Code availability

Code is provided as a zip file (and will be made available on github).

# A.2 Pointwise linear GELU

Gemma 3 uses the approximate GELU activation function. Below $\gamma = 0 . 4 4 7 1 5$ . Here is the derivation of the pointwise linear version of GELU used for Gemma 3 in the preceding analysis.

$$
\operatorname {G E L U} (\mathbf {x}) = \frac {1}{2} \mathbf {x} \left(1 + \tanh  \left[ \sqrt {2 / \pi} (x + \gamma \mathbf {x} ^ {3}) \right]\right) \tag {17}
$$

$$
\operatorname {G E L U} (\mathbf {x}) = \frac {1}{2} \mathbf {x} \left(1 + \tanh  \left[ \sqrt {2 / \pi} \left(x + \gamma \mathbf {x} ^ {3}\right) \right]\right) | _ {\mathbf {x} = \mathbf {x} ^ {*}} \tag {18}
$$

$$
\operatorname {G E L U} \left(\mathbf {x} ^ {*}\right) = \left(\left[ \frac {\partial}{\partial \mathbf {x}} \operatorname {G E L U} (x) \right] \mid_ {\mathbf {x} = \mathbf {x} ^ {*}}\right) \cdot \mathbf {x} ^ {*} \tag {19}
$$

# A.3 Singular vectors across model families

Fig A3 shows this same analysis for Llama 3, Qwen 3 and Gemma 3 across two different sizes of each. Note the low-rank structure of each of the detached Jacobians, as well as the differing decoding of the top singular vectors from each input embedding vector. The first or “beginning of sequence” token has the highest magnitude in each spectrum reflecting how the positional encoding is entangled with semantic information in the detach Jacobian representation.

# A.4 Additional models

Pointwise linearity for Deepseek R1 0528 Qwen 3 8B Distill, Phi 4, Mistral Ministral and OLMo 2 are shown on the following page. See Fig. A4.

# A.5 Examples for comparative analysis of singular vectors in Llama 3 and Qwen 3

# Shared High-Probability Tokens in $U _ { 0 }$

This pattern shows both models using their primary singular vector $U _ { 0 }$ ) to establish a foundation of common, structurally likely next words.

For the phrase “To see,” both models prioritize articles and question words.

• Qwen 3 $U _ { 0 }$ : the a this an all how what and   
• Llama 3 $U _ { 0 }$ : the a , and what an if

For “To complete,” both models identify determiners as the most probable continuations.

• Qwen 3 $U _ { 0 }$ : the a this his an my your   
• Llama 3 $U _ { 0 }$ : this , the a and an (

For “The final result,” the $U _ { 0 }$ vectors in both models are dominated by common prepositions and linking verbs that would grammatically follow the phrase.

• Qwen 3 $U _ { 0 }$ : of is in for from after , was

• Llama 3 $U _ { 0 }$ : , of ... ( is in and

Both models use their primary singular vector ( $U _ { 0 }$ ) to propose very similar sets of common, structurally-likely next words. This highlights a shared foundational strategy of prioritizing grammatical coherence.

21 phrases out of 100 fit this category.

• Before they: Both suggest verbs like were, can, could, start.   
• While walking: Both suggest prepositions of movement like in, through, on, along, around.   
• To see: Both prioritize articles (the, a) and question words (what, how).   
• Will break: Both suggest particles like down and up, and articles like the, a.   
• Must leave: Both list determiners (the, a, this) and prepositions (in, at).   
• Should take: Both include a, the, into, and care.   
• After reading: Both list the, this, a, about, and ".   
• When finished: Both suggest , and with.   
• To begin: Both prioritize , and with.   
• May open: Both suggest a, the, up, and in.   
• Could drive: Both include a, the, in, and ,.   
• During lunch: Both list „ time, and break.   
• To learn: Both prioritize the, more, about, and how.   
• The green: Both include and, „ light, is.   
• The old man: Both list linking verbs (was, is) and conjunctions (and).   
• To build they: Both suggest modal verbs (have, need, must, would).   
• The fast car: Both include is, has, and, ,.   
• The tall building: Both list is, in, has, with.   
• To create: Both prioritize articles a, an, the.   
• The response: Both include to, is, of.   
• The solution: Both list to, of, is, for.

# Llama 3 (Abstract Semantics) vs. Qwen 3 (Direct Semantics)

This pattern illustrates how Llama 3’s secondary vectors often explore a wider and more abstract conceptual space compared to Qwen 3’s more direct and action-oriented suggestions.

For the phrase “Should take,” Llama 3 suggests abstract responsibilities or concepts one should “take on,” while Qwen 3 suggests direct objects or actions.

• Llama 3 $U _ { 1 }$ : utmost admission inspiration revision discipline quitting responsibility guidance   
• Qwen 3 $U _ { 1 }$ : refuge aways -away brib 半 (half-day) 午饭 (lunch) away 这 (this sum)

For “To imagine,” Llama 3’s vectors include abstract and philosophical concepts to imagine, whereas Qwen 3 focuses on more concrete items like “scenarios.”

• Llama 3 $U _ { 1 }$ : reconstruct ethical erect owning peace embodied meanings yourself   
• Qwen 3 $U _ { 1 }$ : scenarios 场景 (scene) scenario 也是一种 (is a kind of) oha Scenario worlds Scenario

For “The discovery,” Llama 3’s vectors describe the impact and nature of a discovery (revolutionary, baffling), while Qwen 3’s vectors describe the event of a discovery (a journey, an unintentional bulletin).

• Llama 3 $U _ { 1 }$ : revolution shed bust of details vind catapult baff   
• Qwen 3 $U _ { 1 }$ : 震惊 (shock) 轶事 (anecdote) 新西 (New West/ New Zealand) 了一个 (a) 之旅 (journey) 无意 (unintentional)  (bulletin) 镇 (small town)

# A.5.1 Llama 3 (Abstract Semantics) vs. Qwen 3 (Direct Semantics)

Here, Llama 3’s secondary vectors explore broader, more abstract concepts, while Qwen 3’s are more concrete and action-oriented.

14 phrases out of 100 show this strong contrast.

• Will break: Llama confidentiality, independence; Qwen ties, neck, dance.   
• Must leave: Llama departing, orientation; Qwen immediately, room.   
• Should take: Llama admission, inspiration, discipline; Qwen refuge, advantage.   
• The broken: Llama fragments, promises, torn; Qwen window, clock, vase.   
• To begin: Llama brainstorm, conceptual; Qwen start, validate.   
• May open: Llama invitation, plea; Qwen windows, sesame.   
• Could drive: Llama distracted, fleets, uninsured; Qwen drunk, uphill.   
• The discovery: Llama revolution, catapult; Qwen journey, bulletin.   
• To prevent: Llama vulnerability, security; Qwen corrosion, fires.   
• The solution: Llama vector, lattice, eigen; Qwen set, definition.   
• To complete: Llama projects, tasks; Qwen orders, assignment.   
• Were planning: Llama launching, upcoming; Qwen permission, meetings.   
• The evidence: Llama overwhelmingly, against; Qwen suggests, linking.   
• To create: Llama customized, empowering; Qwen custom, interactive.

# Qwen 3’s Multilingual Reasoning

This pattern showcases Qwen 3’s unique ability to access a cross-lingual conceptual space, populating its secondary vectors with semantically relevant non-English tokens.

For the phrase “The fast car,” Qwen 3’s $U _ { 1 }$ vector includes multiple Chinese words related to speed and motion.

• Qwen 3 $U _ { 1 }$ : overt 的速度 (speed) 运动 (motion) .Speed 追赶 (chase) 速度 (speed) riages 超越(surpass)

For “The fresh bread smelled,” Qwen 3’s $U _ { 2 }$ vector is a list of Chinese synonyms and related concepts for “smell” and “fragrance.”

• Qwen 3 $U _ { 2 }$ : smell smells 嗅 (sniff/smell) 闻 (smell/hear) 香 (fragrant) 香气 (aroma/fragrance) 香味 (fragrance/scent) smelling

For “Should help her,” the $U _ { 1 }$ vector remarkably contains relevant concepts from multiple languages, including Chinese (career development, alleviate), Russian (cope/handle), and Vietnamese (support/help).

• Qwen 3 $U _ { 1 }$ : 事业发 (career development) справиться (handle/cope) hỗ trợ (support/help) 缓 展解 (alleviate) unpack 理工作 (manage work) 过渡 (transition) 学业 (studies)

38 phrases out of 100 contain clear examples of multilingual reasoning.

# Examples of Sub-word Fragments in Qwen 3

For the phrase “While walking,” the second singular vector for the token “walking” is almost entirely composed of these fragments, including common suffixes.

• Vector (Token 1, $U _ { 2 }$ ): e ection ing eer ignKey cion ging eed

For “To begin,” the $U _ { 2 }$ vector includes the common suffixes -ments and -ly, suggesting a mode for building nouns and adverbs.

• Vector (Token 1, $U _ { 2 }$ ): e ments eel hips eed s eve ly

For “The deep water,” the $U _ { 2 }$ vector for the token “water” contains fragments like -ness and -ection.

• Vector (Token 2, $U _ { 2 }$ ): e y eer eel eus ness ection yth

# A.5.2 Qwen 3’s “Word-Building” Vector

This category identifies phrases where a secondary Qwen 3 vector is dominated by sub-word fragments and morphological units (e.g., -ing, -tion, -eer, -ness).

33 phrases out of 100 clearly display a dedicated morphological vector.

![](images/ee7c9b11e2ac2a0a5b567c18b060c6426dae090bf85b1d82e7ef96873701c089.jpg)  
Figure A1: An overview of next-token prediction in the Llama 3.2 3B transformer decoder and decomposition of the predicted embedding vector computation using the detached Jacobian. Generating three tokens with only $< | \boldsymbol { B } \boldsymbol { o } T | >$ as input produces “The 201”. For each prediction, each input token $\mathbf { t _ { i } }$ is mapped to an embedding vector $\mathbf { x _ { i } }$ , and the network generates the embedding of a next token. The phrase turns out to be “The 2019-2020 season”. The detached Jacobian $\mathbf { J } ^ { + } (  { \mathbf { x } } )$ of the predicted output embedding with respect to the input embeddings is composed of a matrix corresponding to each input vector. Each detached Jacobian matrix $\bf { J } _ { i } ^ { + } ( { \bf x } )$ is a function of the entire input sequence but operates only on its corresponding input embedding vector. The matrices tend to be extremely low rank, shown in the inset figures, and the matrix $\mathbf { J _ { 0 } ^ { + } }$ varies across A), B) and C) above because the input sequences differ. Since the detached Jacobian captures the entirety of the model operation in a linear system (numerically, for a given input sequence), tools like the SVD can be used to interpret the model and its sub-components.

![](images/0c47548226912c8f41dd5c3b06a2fe722c1bcb83408a3b46f65650d263bca242.jpg)  
  
Model:meta-llama/Llama-3.2-3B-Instruct The bridge out of Marin is the [most](most.md)   
Detached Jacobian Reconstruction Error = 2.53e-15

![](images/4b30fa6ada18020870cf3b24cad4a0e5db2f69116fe0958c20a5706b21a08a67.jpg)  
B   
Model: meta-llama/Llama-3.2-3B-Instruct Input+prediction:"The bridge out of Marinis the[ SVD of the Detached Jacobian

![](images/28a1e7549a737af661fb749329fee177d02789a9d68ac44238659d7f41ce3f1c.jpg)  
  
Model:Qwen/Qwen3-14B oridge outofMarinis the[[   
Detached Jacobian Reconstruction Error=2.5

![](images/7c58338f76528768e00f05f210810bcc5dd049ff8f1ccb05352274c893ccf309.jpg)  
D   
Input+prediction:"The bridge out of Marin is the[[onlyl]" SVD of the Detached Jacobian

![](images/3cde185e3cbdbee4d820a20638d5b91b8261c4aa69a78e3f10c081e64ee009d6.jpg)  
  
Model: google/gemma-3-4b-it   
The bridge out of Marin is the[Golden](Golden.md) Detached Jacobian Reconstruction Error= 2.8

![](images/86c981f3650f945cba3e44d1d298681ac33afe5fff0c158e4367676f8cd5b91f.jpg)  
F   
Model: google/gemma-3-4b-it   
Input+prediction:"Thebridge out of Marin is the[Golden]" SVDof the Detached Jacobian   
Figure A2: The detached Jacobian reconstruction error and SVD for Llama 3.2 3B, Qwen 3 14B and Gemma 3 4B

![](images/34b131e100927511b3d5dd49cb3a6c124aca82876282097f8ca5b9f7ce163c81.jpg)

![](images/b028a849a1cd844ca14a9385215939d0e6a6c923dcee6dec4fbd27cd02d47b80.jpg)

![](images/a3393acf6cc84e525d3b52ae17bf284b6c5b78ab3dc684445e416f2e167f8d5d.jpg)  
Figure A3: Singular value decomposition of the detached Jacobian for different families and sizes of language models (from 3B to 70B parameters) evaluating the input sequence “The bridge out of Marin is the”, followed by a predicted token. The left singular vectors decode to tokens related to bridges and local geography, particularly the Golden Gate Bridge, while singular value spectra all have extremely low rank (see below for quantification). Each row shows top tokens associated with different singular vectors, demonstrating how models encode semantic knowledge about the input sequence and the prediction. See Fig. A4 for Deepseek R1 0528 Qwen 3 8B Distill, Phi 4, Mistral Ministral and OLMo 2.

![](images/fcbd9d4e078216fa64bfe6697f9a268242da88402140124af7c3cabf0ae06b37.jpg)

![](images/abfdf2ddfc3deeadf75e57bc15d6dea5b9929460b383d1e221f525261a9a4ccc.jpg)

![](images/c2d1e91ad12bd65c98c5656f241c2f2ec5dc2d5ba439fd488ec9a192892465fb.jpg)

![](images/c4567a067bd8d71b70fd59cde2f2a0ac322f047cfd5d6542c4ea32c2d691cc64.jpg)

![](images/576143aa59c1d479c02ac60522a9faa38a7491fe68d4006c96a7a4eb41e53743.jpg)

![](images/99fc27d35cd46dd23dd2a11065643f09e17b7e4dbb49cec9128f9dc62f85463e.jpg)

![](images/479403dd3700b7cef77145b55655e375ad239572175d7367d2e5197e6c5a8a9a.jpg)

![](images/689e100b53cd8ab7ae6d7eb657a8ccdfc56071d7cabc3398e7a5d08d22de0c95.jpg)  
Figure A4: The detached Jacobian reconstruction error and SVD for Deepseek R1 0528 Qwen 3 8B, Phi 4 Mini 4B, Mistral Ministral 8B and OLMo2 7B.

![](images/c3fe64f7538938fa92ca8a56afbfcd1a1ac714ecb109af292abb02c413d35e6c.jpg)

![](images/d4cea438c8f8e20fe9e221c6d60b4a8897fa4d542cf613d9dd83908d7251a968.jpg)

![](images/c5d0b6b119e6dbb2ecf331a89f7120ca87b8991089523e3fcdb0b4561379c752.jpg)

![](images/ff22415b9bb48f2c16c888344197cd92ccf7c9e0651dc0bd652b47bcb5783f62.jpg)

![](images/b6e0f6e29ecaeac62b6884e1694f0fd48ed2d57725169af07cb5c491ca83a899.jpg)

![](images/b27737657604e5e0a43ad0d456be84272bbc89ae8cdef609df7c15778ad8f61e.jpg)

![](images/80144368134427d0d869570028c644de3b96e7c281c43ed3307d1fd631365818.jpg)

![](images/0248b943c7fc22440b05748f7491efd72cfceb2639dbe0dc3ad2619969f2bda1.jpg)  
Figure A5: Comparison of detached Jacobians for the same phrase across models.

Table 3: The top three singular vectors of the detached Jacobian for the layer outputs from Llama 3.1 8B for the sequence “The bridge out of Marin is the” with the prediction [Golden](Golden.md). Legend: “Bridge” , “only” ,   

<table><tr><td></td><td>Input token 0</td><td>Input token 1</td><td>Input token 2</td></tr><tr><td>Layer 13.0</td><td>coli guno owry elin ovel ATEG</td><td>/Dk MetroFramework olumn rehuct upertino DOT regor</td><td>akra izik esteem critical timer noch MUX apest</td></tr><tr><td>Layer 13.1</td><td>weit LineStyle fonts Ymd ysize rt akra reverted</td><td>ta .unplash fonts reverted Ymd ograd .gf</td><td>Lud QObject darwin ademical) const angel PushButton usercontent</td></tr><tr><td>Layer 13.2</td><td>chter i Burgess Lund abet Burke ernal backslashBundle</td><td>opia agnember missile trace owed</td><td>card plus imm cardinal Spare enz Eg lex</td></tr><tr><td>Layer 14.0</td><td>en wil lo ... 764 fa</td><td>/Dk HeaderCode OF ToPoint &lt;typeof spd .liferay NCY</td><td>weit vc ciler inx critical akedirs</td></tr><tr><td>Layer 14.1</td><td>weit ; dealloc akeds LineStyle Bridge ysize</td><td>ta defs ones .unplash arken ;</td><td>id rone orrn iland ] ...</td></tr><tr><td>Layer 14.2</td><td>chter Burgess &lt;typeof Ridge Subsystem PressEvent</td><td>agnember another arend</td><td>Kelly Jar Cunningham Jarvis) const Stadium ortal</td></tr><tr><td>Layer 15.0</td><td>wil i Mage guni yih erval dedicated Mage</td><td>skb abus &lt;typeof ToBounds xcf /Dk</td><td>bridge bridges Bridge Bridges Mood illin</td></tr><tr><td>Layer 15.1</td><td>weit Bridge squeeze dealloc bridges woke bridge</td><td>illin k .foundation ophe ATEG bridges</td><td>gc RAD .bunifuFlatButton Dickinson PushButton NullException Comet</td></tr><tr><td>Layer 15.2</td><td>chter &lt;typeof RAD .Null Subsystem Burgess ches</td><td>arend esser pair agn kel ered usi ending</td><td>Bravo Cunningham Imm Brew losures</td></tr><tr><td>Layer 16.0</td><td>i en entre lei yre wil ewis iyah</td><td>sole /cms $MESS pdev xcf spd &lt;typeof</td><td>bridge bridges Bridge k akra Bridges toll</td></tr><tr><td>Layer 16.1</td><td>Bridge bridge squeeze akra SQLServer weit fabs</td><td>k 799 izi BI akra .Exit</td><td>gc RAD Dickinson UpInside PushButton clerosis</td></tr><tr><td>Layer 16.2</td><td>Invalidate rd &lt;typeof Subsystem /cms NUITKA saida</td><td>arend agn ag ered another /out dip lll</td><td>vere losures Brake route employment closure exit occo</td></tr><tr><td>Layer 17.0</td><td>i en yre iyah ewis erval only agnet</td><td>sole /cms gc Bridge bridge PushButton ToF</td><td>bridge Bridge bridges Bridges k choke Brig</td></tr><tr><td>Layer 17.1</td><td>Bridge Marin bridge arLayout Brains bridges choke /connection</td><td>k yre .IDENTITY 799 Affected Bridges Local</td><td>gc PushButton ANNEL Inspiration bast occasion</td></tr><tr><td>Layer 17.2</td><td>&lt;typeof scalablytyped Invalidate bast Burke gc</td><td>another isser hell to amp arend new gender</td><td>hosting closure Bravo ernal kond Hosting location Backbone</td></tr><tr><td>Layer 18.0</td><td>bridge en i yre end 764 go San</td><td>bridge Bridge bridges sole crossing brid . bridge cause</td><td>bridge Bridge bridges Bridges brid Bridge bridge</td></tr><tr><td>Layer 18.1</td><td>Bridge bridge bridges Marin Bridge Bridges brid</td><td>Bridges bridges OUNTRY .IDENTITY Queries Choices</td><td>PushButton gc Tos ANNEL Inspiration Route sole</td></tr><tr><td>Layer 18.2</td><td>Invalidate scalablytyped Burke Saunders stial Lair ages</td><td>to another elsewhere amc be ser hell</td><td>San enernal hosting closure SF Bravo</td></tr><tr><td>Layer 19.0</td><td>bridge SF exit San only connecting Oakland usp</td><td>bridge Bridge bridges crossing toll bridge choke SF</td><td>bridge Bridge bridges Bridges bridge brid</td></tr><tr><td>Layer 19.1</td><td>Marin Bridge bridge SF Golden Bridge bridge</td><td>Bridges Odds shima ilary ed uID Oakland .syntax</td><td>Highway Route route route ANNEL Hwy highway</td></tr><tr><td>Layer 19.2</td><td>Fletcher Los LA Edgar Southern Burke LA Los</td><td>elsewhere to new Oakland another hel progress</td><td>SF San ucker Oakland Golden Stanford closure sf</td></tr><tr><td>Layer 20.0</td><td>bridge toll exit Bridge bridges San SF Toll</td><td>bridge Bridge bridges Toll tol crossing . bridge</td><td>toll bridge Bridge tol latest bridges Toll Bridges</td></tr><tr><td>Layer 20.1</td><td>Marin sf toll arLayout Oakland Berkeley</td><td>Odds Oakland contra n thing uckles ued istrator</td><td>Route route Highway Route odus route Hwy</td></tr><tr><td>Layer 20.2</td><td>toFloat PLIED Southern LA Los Fletcher uluk bridge</td><td>to elsewhere new ella cht peninsula syn</td><td>SF Oakland Stanford anson San SF .vn sf</td></tr><tr><td>Layer 21.0</td><td>bridge toll bridges exit San Bridge Toll SF</td><td>bridge toll Bridge bridges Toll tol Bridge crossing</td><td>bridge toll bridges Bridge Bridges tol Toll Bridge</td></tr><tr><td>Layer 21.1</td><td>Marin SF sf SF Oakland Berkeley arLayout</td><td>contra n uckle Oakland v</td><td>Route route .scalablytyped Highway odus Route annel</td></tr><tr><td>Layer 21.2</td><td>uluk bridges bridge toFloat Southern PLIED Rose</td><td>Marin Oakland Fog ?type Berkeley SF uv</td><td>SF Marin Oakland SF San Stanford Berkeley sf</td></tr><tr><td>Layer 22.0</td><td>bridge toll San bridges exit SF Bridge connecting</td><td>bridge Bridge bridges toll crossing tol Toll Bridge</td><td>bridge bridges toll Bridge Bridges tol crossing Bridge</td></tr><tr><td>Layer 22.1</td><td>Marin SF =inas sf Berkeley</td><td>contra uckle thing 415 ObjectId n</td><td>Highway Backbone Route高速公路 route route annel Atomie</td></tr><tr><td>Layer 22.2</td><td>fabs uluk bridges dealoc Brig GMT Bridge ankl</td><td>Marin ?type dea Berkeley arResult zc occo</td><td>SF Marin SF .sf SF Salesforce Berkeley</td></tr><tr><td>Layer 23.0</td><td>toll San bridge exit Bay Golden Exit connecting</td><td>toll bridge Golden San Bridge tol bridges Toll</td><td>toll bridge bridges Bridge tol span Bridges Toll</td></tr><tr><td>Layer 23.1</td><td>Marin inas = Ukraj Berkeley</td><td>thing riz 415 orte contra uckle 299 imo</td><td>Pacific Route coast Highway Route Atomie annel</td></tr><tr><td>Layer 23.2</td><td>fabs uluk Brig dealoc pun Roose Bud Cunningham</td><td>Marin ?type Berkeley dea zc ottenham inas aser</td><td>Marin SF Oakland .sf SF Berkeley Bay</td></tr><tr><td>Layer 24.0</td><td>bridge San toll vi exit Bay SF Golden</td><td>toll bridge Golden San Bridge vi tol bridges</td><td>toll bridge span tol bridges Bridge vi</td></tr><tr><td>Layer 24.1</td><td>Marin sf /goto marin aidu</td><td>riz (contra rev ued uckle 299</td><td>Pacific POSIT Via c Santa tracks rough Backbone</td></tr><tr><td>Layer 24.2</td><td>uluk fabs dealoc anik Brig Roose sind Bud</td><td>Marin dea ?type zc chez Berkeley app aidu</td><td>Marin SF .sf SF Oakland San SF Salesforce</td></tr><tr><td>Layer 25.0</td><td>toll bridge vi subject connecting exit Bay only</td><td>toll bridge Golden vi tol Toll Bridge Golden</td><td>toll span bridge tol vi latest bridges Toll</td></tr><tr><td>Layer 25.1</td><td>Marin aidu Skywalker arm sf</td><td>riz iy ney thing 415 contra</td><td>Pacific POSIT Via c Santa tracks rough Backbone</td></tr><tr><td>Layer 25.2</td><td>uluk anik fables dealoc Brig GetEnumerator vka Roose</td><td>Marin chez dea ?type zc aidu ptr reib</td><td>Marin SF sf SF .sf San Richmond SF</td></tr><tr><td>Layer 26.0</td><td>toll subject cause San Golden go bridge only</td><td>Golden toll bridge toll span cause Golden crossing</td><td>span toll tol bridge spans Golden crossing vital</td></tr><tr><td>Layer 26.1</td><td>Marin aidu .Generated mainwindow .scalablytyped</td><td>415 arching in y n s contra riz</td><td>Pacific Via Santa rough rouan annel Santa route</td></tr><tr><td>Layer 26.2</td><td>uluk Brig anik spans Atomics Bailey plied</td><td>Marin ptr dea ensis aidu chez lands inas</td><td>Marin sf SF .sf SF Richmond San 415</td></tr><tr><td>Layer 27.0</td><td>subject only cause SF go exit connecting toll</td><td>span toll Golden cause tol San Toll only</td><td>span toll spans vital Span symbol latest</td></tr><tr><td>Layer 27.1</td><td>Marin mainwindow /effects Generated</td><td>arching n pone s yar</td><td>Pacific Santa Atomie Santa annel route rou posit</td></tr><tr><td>Layer 27.2</td><td>Atomic uluk Bailey ewiv elig stdout fiset</td><td>Marin ensis zc dea chez lands magna</td><td>Richmond Marin SF sf SF San SF</td></tr><tr><td>Layer 28.0</td><td>Richmond only subject one last symbol toll I</td><td>Golden toll Richmond tol span San Toll only</td><td>span toll symbol tol latest Richmond only final</td></tr><tr><td>Layer 28.1</td><td>P .Generated /effects</td><td>yar pone arching n s</td><td>Pacific Atomie Santa Via Samuel twisting route</td></tr><tr><td>Layer 28.2</td><td>ulukBUA Ava fiset Atomie jak Whip Santa</td><td>Marin oylan dea ensis agna agr zc olin</td><td>Richmond SF Marin SF .sf SF San</td></tr><tr><td>Layer 29.0</td><td>only Richmond final last most one subject symbol</td><td>Golden most tol toll final Richmond Bay Golden</td><td>tol last final Golden symbol latest toll most</td></tr><tr><td>Layer 29.1</td><td>Golden .Iter .Generated tsint</td><td>pone n arching beiter Ped Yad jev</td><td>Via Santa Pacific Samuel Rim Corner winding coast</td></tr><tr><td>Layer 29.2</td><td>Marin abra riad seithe lesord ionionian</td><td>Marin olin marin nov ensis aer signar nov</td><td>Marin SF sf SF Richmond San SF</td></tr></table>

“highway” “exit” , “most” .

Table 4: The top three singular vectors of the detached Jacobian for the layer outputs from Gemma 3 4B for the sequence “The bridge out of Marin is the” with the prediction [Golden](Golden.md). Legend: “Bridge” , “only” ,   

<table><tr><td></td><td>Input token 0</td><td>Input token 1</td><td>Input token 2</td></tr><tr><td>Layer 13_0</td><td>nt only the alors that ... and ...</td><td>the that only nt and most called either</td><td>probabilment Guad alcanz Lens Yellow yutu</td></tr><tr><td>Layer 13_1</td><td>sh handful Shaq fame myselfs pity mga</td><td>Sur GONE J. Ret Genau Ret</td><td>the and that the ... and if nt</td></tr><tr><td>Layer 13_2</td><td>ively ional });</td><td>0 5 1 2 4 mete 3</td><td>called March Bon Entity Clock Patricia Bin</td></tr><tr><td>Layer 14_0</td><td>only that the nt ... one ... either</td><td>only the that one nt either only those</td><td>vecchio Bridge Guad probabilment iconic menambah Night</td></tr><tr><td>Layer 14_1</td><td>the 1 robot uvr</td><td>Sur GONE MaxLength Toto heus Seg Novo</td><td>the racist extremist that those terrorist scenic anarch</td></tr><tr><td>Layer 14_2</td><td>Tyl</td><td>0 1 5 2 4 3 verwenden 6</td><td>and already after sure Z AL only development</td></tr><tr><td>Layer 15_0</td><td>only called one probably either the very</td><td>only the one either that called probably transportation</td><td>iconic Bridge bridge IQR Nope puee bridges Bridges</td></tr><tr><td>Layer 15_1</td><td>feminism 1 robot imperialism ems polities</td><td>tzw Seg taw North Sur Second aman atraves</td><td>one extremist racist the camping terrorist supposed military</td></tr><tr><td>Layer 15_2 };</td><td>).</td><td>0 1 5 2 verwenden 3 4 6</td><td>called Sept ( Grand</td></tr><tr><td>Layer 16_0</td><td>only one very first the route</td><td>only the one first three two very</td><td>iconic Bridge bridge Centennial Greater Golden bridges Iconic</td></tr><tr><td>Layer 16_1</td><td>tzw North bernama Nec tangent Bitter Seg getAvg</td><td>North North tzw largest lagoon sogenntenon shortcut</td><td>coastal scenic not military one likely very location</td></tr><tr><td>Layer 16_2</td><td>Arc Approx</td><td>0 5 1 2 3 Provides 6 4</td><td>turbo Hydro Turbo Geo Mape northward blasted north</td></tr><tr><td>Layer 17_0</td><td>only first most one very two the</td><td>only one first the two most very</td><td>iconic legendary famed famous Greater namesake infamous Centennial</td></tr><tr><td>Layer 17_1</td><td>hacerlo tangent taw bernama north lophole</td><td>North north North taw sogenntenate sogenntenon behem</td><td>only very not scenic one likely military extremely</td></tr><tr><td>Layer 17_2 };</td><td>). Endpoints Heap</td><td>0 1 5 2 3 Provides 4 verwenden</td><td>Turbo TOC Pipeline Aviation City Route Water</td></tr><tr><td>Layer 18_0</td><td>only first most one very two the</td><td>only first one most two the that</td><td>bridge Bridge bridges iconic crossing Bridges</td></tr><tr><td>Layer 18_1</td><td>loophole Nec Locator FBSDKAccessToken peanut sebaik</td><td>behem giant loophole lagoon swamp MaxLength Nec Locator</td><td>military only coastal area likely location beaches areas</td></tr><tr><td>Layer 18_2 };</td><td>). Paths</td><td>0 Design 1 Style 3 Stirling Provides</td><td>Water Pipeline Watercolor Pipelines Fountain Beacon Marathon Balloon</td></tr><tr><td>Layer 19_0</td><td>only first one most two highway the</td><td>only one first two that most second</td><td>Bridge bridge bridges Bridges Crossing Bridge Golden crossing</td></tr><tr><td>Layer 19_1</td><td>Ring Coc Road reverse Rd Beacon</td><td>Bridge Ring Coc Road notorious iconic behem Reverse</td><td>coastal military area location areas most beach beaches</td></tr><tr><td>Layer 19_2</td><td>vreau rupani nggak inclusin advogado comprens emphas</td><td>Crossing Compre Laufe Steel Indem Chlt Bridge</td><td>Aviation Outreach Pipelines Turbo Wastewater Pipeline Brewing Beacon</td></tr><tr><td>Layer 20_0</td><td>one only most first second very</td><td>one only most first second best</td><td>Bridge bridge bridges Crossing Bridges crossing bridging iconic</td></tr><tr><td>Layer 20_1</td><td>Mun Mun Har Tak Coc Trinity Beacon</td><td>Har Har Est Tak Mega Rainbow Coc</td><td>area one areas most location only coastal military</td></tr><tr><td>Layer 20_2</td><td>Zap Typical Ric Tub +§ Ridge</td><td>Bridge Crossing Bridges Crossing Bridge Guad</td><td>teapot minus Vectors Spiral spiral turbo spirals</td></tr><tr><td>Layer 21_0</td><td>bridge only one most highway first best</td><td>bridge only one most first highway best</td><td>bridge bridge bridges Bridge Bridges Crossing bridging</td></tr><tr><td>Layer 21_1</td><td>Bridge Bridge bridge zungen Tol Tak</td><td>Bridge bridges Bridge bridge bridges bridging Tol</td><td>most coastal area areas maritime one closest fastest</td></tr><tr><td>Layer 21_2</td><td>vreau gobernno totall comprehn ngsk lackluster ejectito</td><td>Bridge Crossing Bridges Ponte Crossing Bridge</td><td>mansion Architectural Sculpture Basilica monumento Monument Museum edifice</td></tr><tr><td>Layer 22_0</td><td>only bridge one most first highway new</td><td>only bridge one most first new highway</td><td>bridge bridge bridges Bridges Bridge Bridge Ponte</td></tr><tr><td>Layer 22_1</td><td>Namara Puente chercher zungen McCullough klnb Wheeler</td><td>Bridge Puente puee bridges Tol Bridge</td><td>highway road route roads fastest most coastal coast</td></tr><tr><td>Layer 22_2</td><td>ERISA vrean lackluster gacche pabbaij ceremonia prosa i</td><td>Bridge Bridges Bridge Geral Design</td><td>routines highways roads routes ferries freeway expressway</td></tr><tr><td>Layer 23_0</td><td>only bridge California most one highway freeway Bridge</td><td>only bridge California most highway first new</td><td>bridge Bridge bridges Bridges Bridge bridges bridging</td></tr><tr><td>Layer 23_1</td><td>zungen Langer &lt;unused58&gt;qualiter loadNmTasks mengilhangkan</td><td>California only bridge freeway highway Highway Bridge one</td><td>California freeway coastal Pacific trailhead fastest Californian route</td></tr><tr><td>Layer 24_0</td><td>&lt;unused58&gt;pored ! Bridges Langer</td><td>Bridges bridges Bridge Bridge puee &lt;unused58&gt;bridging</td><td>freeway highway route trailhead fastest roads highways pathway</td></tr><tr><td>Layer 24_2</td><td>Sonoma Marin Napa Marin Esprito Medford California</td><td>Bridges Bridge Bridge bridges bridges</td><td>routines Routes Route routes Route route</td></tr><tr><td>Layer 25_0</td><td>bridge bridge bridges California only bridge highway</td><td>bridge Bridge bridges California only bridge ferry Highway</td><td>bridge Bridge bridges Bridge bridges bridging bridges</td></tr><tr><td>Layer 25_1</td><td>bridge Bridge bridges bridge bridging puee</td><td>bridge Bridge Bridge bridge bridging puee</td><td>highway route trailhead freeway roads road Highway trail</td></tr><tr><td>Layer 25_2</td><td>Marin Marin Burnese SF Sonoma Genova</td><td>Bridges Bridge Bridge bridges bridges</td><td>Omaha Wichita Milwaukee Houston Memphis Chicago Nebraska Detroit</td></tr><tr><td>Layer 26_0</td><td>bridge bridge bridges California only San Highway most</td><td>bridge Bridge bridges California only San Highway most</td><td>bridge Bridge bridges Bridge bridges bridging bridges</td></tr><tr><td>Layer 26_1</td><td>Bridges Bridge puee bridge bridging</td><td>bridge Bridge Bridge puee bridge Bridge bridging</td><td>route highway trailhead freeway Highway fastest road</td></tr><tr><td>Layer 26_2</td><td>Marin Marin sf SF Burnese SF Sonoma</td><td>Bridge Bridge Bridges</td><td>Utah Angkor Boise Nebraska Alabama Omaha Mormon</td></tr><tr><td>Layer 27_0</td><td>bridge bridges Bridge California only most Highway highway</td><td>bridge bridges Bridge California only most Highway</td><td>bridge Bridge bridges Bridge bridges bridging puee</td></tr><tr><td>Layer 27_1</td><td>Bridges puee bridges &lt;unused58&gt; Bridge</td><td>Bridges bridges puee bridging Bridge bridge Bridge</td><td>route highway trailhead pathway freeway most trail path</td></tr><tr><td>Layer 27_2</td><td>Marin Marin Sonoma Burnese sf</td><td>Struct Structural Structural Struct</td><td>Utah Mormon Boise Angkor Alabama Cebu Birmingham Nebraska</td></tr><tr><td>Layer 28_0</td><td>bridge Bridge bridges only most California San Highway</td><td>bridge Bridge bridges only most California San Pacific</td><td>bridge Bridge bridges Bridge bridges bridging puee</td></tr><tr><td>Layer 28_1</td><td>wachung oksatta athermy puee</td><td>puee Bridge bridges bridging &lt;unused58&gt;atherny</td><td>highway route pathway freeway Highway most path gateway</td></tr><tr><td>Layer 28_2</td><td>Marin Marin Sonoma marin marin kafka</td><td>Struct Struct</td><td>Sonoma ruari yami</td></tr><tr><td>Layer 29_0</td><td>only most bridge one Golden California longest largest</td><td>only most bridge one Golden longest California largest</td><td>bridge Bridge bridges Bridge bridge puee bridging</td></tr><tr><td>Layer 29_1</td><td>wachung azimuth patx athermy orage</td><td>bridge bridging bridges Bridges Bridge</td><td>route highway trail path gateway trailhead most</td></tr><tr><td>Layer 29_2</td><td>Marin Marin Sonoma kafka Ukrai</td><td>&lt;unused2146&gt;struct Structure Struct Structural Structure</td><td>Snapshot at Sonoma</td></tr><tr><td>Layer 30_0</td><td>most one only bridge California new Golden</td><td>most only one California new bridge Golden longest</td><td>bridge Bridge bridges Bridge puee bridge toll</td></tr><tr><td>Layer 30_1</td><td>wachung arakatuh Chobalsan atherny</td><td>bridging puee bridges getTransforms</td><td>route highway trail head trailhead path trails gateway</td></tr><tr><td>Layer 30_2</td><td>Marin Marin marin Sonoma</td><td>struct Struct Structure</td><td>prescribe Snapshot nt</td></tr><tr><td>Layer 31_0</td><td>most only one bridge new main Golden</td><td>only most one new main Golden bridge</td><td>bridge Bridge bridges Bridge bridge toll puee Toll</td></tr><tr><td>Layer 31_1</td><td>bottlene Comunic azzitt lyres qtrr</td><td>puee bridges lytes</td><td>route trail highway path trailhead trails trailhead Highway</td></tr><tr><td>Layer 31_2</td><td>marin Marin kukk</td><td>structures</td><td>Alabama Idaho Kansas Angkor Oklahoma Nebraska dunes fuselage</td></tr></table>

“highway” , “exit” , “most” .

Table 5: The top three singular vectors of the detached Jacobian for the layer outputs from Qwen 3 14B for the sequence “The bridge out of Marin is the” with the prediction [only](only.md). Legend: “Bridge” , “only” ,   

<table><tr><td></td><td colspan="2">Input token 0</td><td colspan="3">Input token 1</td><td colspan="2">Input token 2</td></tr><tr><td>Layer 20_0</td><td colspan="2">TRY NORMAL</td><td colspan="3">massage</td><td colspan="2">akedown eway slow congest nodeld</td></tr><tr><td>Layer 20_1</td><td colspan="2">AUSE new bbw metaphor .listFiles stret tgt</td><td colspan="3">overlay extracts Liter</td><td colspan="2">villa fashion getattrdepress bias</td></tr><tr><td>Layer 20_2</td><td colspan="2">ade flutter Fil mon imm and ren</td><td colspan="3">lyr bounding while</td><td colspan="2">Entities campaign EventBus FILL</td></tr><tr><td>Layer 21_0</td><td colspan="2">TRY REGARD dT</td><td colspan="3">REGARD massage</td><td colspan="2">eway slow exiting outbound fastest tight</td></tr><tr><td>Layer 21_1</td><td colspan="2">@end IGHL ocos UAGE crt</td><td colspan="3">overlay substr tag adorn bestowed</td><td colspan="2">Managed meds Choices TORT Madness machine Spare</td></tr><tr><td>Layer 21_2</td><td colspan="2">Terr tag iera imm Fil ues Mal</td><td colspan="3">itol Tomorrow goodbye stash calar lyr syrup</td><td colspan="2">HTTPS reinterprete UTF REFER JSON Netflix</td></tr><tr><td>Layer 22_0</td><td colspan="2">tweaking CONSTANTS</td><td colspan="3">vac getch Period</td><td colspan="2">first hardest fastest exiting ramp</td></tr><tr><td>Layer 22_1</td><td colspan="2">metaphor unc DERP OBJ stret .wp ISP</td><td colspan="3">substr MBOL bridge</td><td colspan="2">hurry HIP opi Rockets TORT</td></tr><tr><td>Layer 22_2</td><td colspan="2">alk ole ool ros angan icon vn</td><td colspan="3">antics ikerrocking</td><td colspan="2">backstory weblog SVG JSON INCIDENT</td></tr><tr><td>Layer 23_0</td><td colspan="2">salopes CONSTANTS getch Uncomment massage TRY</td><td colspan="3">metaphor bridge largest easiest only first centerpiece</td><td colspan="2">first hardest unc fastest highway bottleneck</td></tr><tr><td>Layer 23_1</td><td colspan="2">metaphor unc Derne makeshift OBJC</td><td colspan="3">bridge Bridge . bridge bridge</td><td colspan="2">scenes WithError opi Timing preset Entering</td></tr><tr><td>Layer 23_2</td><td colspan="2">ros lovers flutter</td><td colspan="3">antics jams</td><td colspan="2">weblog COMPONENT annot metaphor</td></tr><tr><td>Layer 24_0</td><td colspan="2">first third last most largest fourth culmination</td><td colspan="3">metaphor largest centerpiece easiest first hardest bridge gateway</td><td colspan="2">hardest first easiest fastest most ones same</td></tr><tr><td>Layer 24_1</td><td colspan="2">metaphor makeshift .wp REAK</td><td colspan="3">brid bridge bridges bridge Bridge</td><td colspan="2">scenes LocalStorage WithError</td></tr><tr><td>Layer 24_2</td><td colspan="2">flutter roS Lingu</td><td colspan="3"></td><td colspan="2">phenomena fuzz annot metaphor</td></tr><tr><td>Layer 25_0</td><td colspan="2">largest most first longest latest fastest last third</td><td colspan="3">bridge bridges Bridge gateway</td><td colspan="2">hardest ones exit easiest first most fastest highway</td></tr><tr><td>Layer 25_1</td><td colspan="2">bridge bridges Bridge Bridges brid</td><td colspan="3">bridges bridge Bridge bridge Bridge</td><td colspan="2">exit exit exits eternity exit</td></tr><tr><td>Layer 25_2</td><td colspan="2">bridge bridge Bridge bridge parliament</td><td colspan="3">Exit exit jams</td><td colspan="2">INCIDENT symbolism</td></tr><tr><td>Layer 26_0</td><td colspan="2">first most largest last longest latest gateway only</td><td colspan="3">bridge bridges metaphor gateway connecting</td><td colspan="2">highway first exit ones last hardest roads</td></tr><tr><td>Layer 26_1</td><td colspan="2">bridge bridges metaphor Bridges Bridge</td><td colspan="3">bridge bridge structures brid bridge</td><td colspan="2">.charset jams Margins</td></tr><tr><td>Layer 26_2</td><td colspan="2">parliament structures bridges Parliament bridge</td><td colspan="3">Exit exit choke Exit panicked</td><td colspan="2">symbolism metaphor</td></tr><tr><td>Layer 27_0</td><td colspan="2">first last largest bridge longest most oldest latest</td><td colspan="3">bridge bridges Bridge Bridges</td><td colspan="2">last first exit highway bottleneck next road choke</td></tr><tr><td>Layer 27_1</td><td colspan="2">bridge bridges Bridge Bridges</td><td colspan="3">bridge bridge Bridge bridge brid Bridge</td><td colspan="2">EXIT exit exits (exit)</td></tr><tr><td>Layer 27_2</td><td colspan="2">bridge bridge bridges Bridge structures</td><td colspan="3">Exit exit Exit Exit Exit</td><td colspan="2">incident EXTRA incidents</td></tr><tr><td>Layer 28_0</td><td colspan="2">bridge longest largest first busiest last oldest most</td><td colspan="3">bridge bridges Bridge Bridge</td><td colspan="2">highway exit bottleneck highways Highway last road exits</td></tr><tr><td>Layer 28_1</td><td colspan="2">bridge bridges Bridge Bridge</td><td colspan="3">highway highways coast freeway roads road route</td><td colspan="2">exit exits EXIT Exit Exit</td></tr><tr><td>Layer 28_2</td><td colspan="2">bridge bridge bridges Bridge brid</td><td colspan="3">Exit exit Exit exit Exit</td><td colspan="2">Saddam Mosul Kuwait incident metaphor</td></tr><tr><td>Layer 29_0</td><td colspan="2">bridge only fourth last third longest fifth most</td><td colspan="3">bridge bridges Bridge Bridges</td><td colspan="2">only last first highway third highways exit fourth</td></tr><tr><td>Layer 29_1</td><td colspan="2">bridge bridges Bridge Bridges</td><td colspan="3">coast highway road driveway coastline roads highways freeway</td><td colspan="2">exits exit EXIT</td></tr><tr><td>Layer 29_2</td><td colspan="2">bridge bridges bridge structures brid structure</td><td colspan="3">Exit exit Highway Exit</td><td colspan="2">Saddam Mosul Elvis metaphor incident</td></tr><tr><td>Layer 30_0</td><td colspan="2">bridge most longest fourth third last only fifth</td><td colspan="3">bridge bridges Bridge Bridge</td><td colspan="2">highway only bridge last first Highway road highways</td></tr><tr><td>Layer 30_1</td><td colspan="2">bridge bridges Bridge Bridge</td><td colspan="3">coast freeway highway coastline road roads highways</td><td colspan="2">bridge Bridge bridges bridge brid</td></tr><tr><td>Layer 30_2</td><td colspan="2">bridge structure structures bridges bridge brid</td><td colspan="3">sail seab sailing Bermuda ship</td><td colspan="2">Memphis Kuwait Jordan Saddam Iowa</td></tr><tr><td>Layer 31_0</td><td colspan="2">bridge most only last longest first third largest</td><td colspan="3">bridge bridges Bridge Bridge</td><td colspan="2">only last highway first bridge exit Highway most</td></tr><tr><td>Layer 31_1</td><td colspan="2">coast airlines Interior airline interior Lia Speedway</td><td colspan="3">coast coastline coastal Coast route beach Coastal</td><td colspan="2">bridge Bridge bridges bridge underwater brid</td></tr><tr><td>Layer 31_2</td><td colspan="2">bridge bridges bridge brid Bridge structure</td><td colspan="3">ship sail sailing dock seab</td><td colspan="2">Jordan Memphis Kuwait Mississippi</td></tr><tr><td>Layer 32_0</td><td colspan="2">bridge most only first last longest third largest</td><td colspan="3">bridge Bridge bridge Bridge bridge</td><td colspan="2">only last first highway most main route exit</td></tr><tr><td>Layer 32_1</td><td colspan="2">interior airline steam airlines Trail breed vacuum</td><td colspan="3">coast coastal coastline route Coast Route beach</td><td colspan="2">bridge span underwater connecting deck public member</td></tr><tr><td>Layer 32_2</td><td colspan="2">bridge bridge bridges Bridge brid Bridge</td><td colspan="3">ship sail dock sailing seab</td><td colspan="2">Kuwait Jordan Memphis Edmonton Mississippine Nile</td></tr><tr><td>Layer 33_0</td><td colspan="2">only first last most third main second subject</td><td colspan="3">bridge Bridge bridges Bridge only</td><td colspan="2">only last first key main same most exit</td></tr><tr><td>Layer 33_1</td><td colspan="2">planet interior cabin floors roots</td><td colspan="3">coast coastline coastal Coast route beach Coastal</td><td colspan="2">span public member library platform floating intervening deck</td></tr><tr><td>Layer 33_2</td><td colspan="2">bridge bridge structure bridges brid Bridge</td><td colspan="3">ship orbit aircraft sail vessel</td><td colspan="2">Kuwait Nile Edmonton Saskatchewan Tulsa</td></tr></table>

“highway” , “exit” , “most”