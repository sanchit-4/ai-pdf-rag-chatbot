// // // rag.graph.ts
// // // This file defines the nodes and edges of our RAG graph using LangGraph.
// // import { Document } from "@langchain/core/documents";

// // // This interface defines the state of our RAG graph.
// // // It's the data that flows from one node to the next.
// // import { BaseMessage } from "@langchain/core/messages"; // <-- ADD THIS IMPORT

// // export interface RagGraphState {
// //   question: string;
// //   documentName: string;
// //   chat_history: BaseMessage[]; // <-- ADD THIS LINE
// //   context?: Document[];
// //   answer?: string;
// //   [key: string]: any;
// // }

// // import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
// // import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// // import { createClient } from "@supabase/supabase-js";
// // import { ChatPromptTemplate } from "@langchain/core/prompts";
// // import { StringOutputParser } from "@langchain/core/output_parsers";
// // import { RunnableSequence } from "@langchain/core/runnables";
// // import { HumanMessage, AIMessage } from "@langchain/core/messages"; // <-- ADD THIS IMPORT

// // const REPHRASE_QUESTION_TEMPLATE = `
// // Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

// // Chat History:
// // {chat_history}

// // Follow Up Input: {question}
// // Standalone Question:`;

// // const RAG_PROMPT_TEMPLATE = `
// // You are a helpful and expert AI assistant who is an expert in analyzing documents.
// // Use the provided context from the document to answer the user's question. Your answer should be detailed, comprehensive, and based SOLELY on the information within the context.
// // Do not use any of your outside knowledge.


// // If the context does not contain the information needed to answer the question, you must then offer to help with you knowledge and then give the answer according to your knowledge in that response itself.

// // Context:
// // {context}

// // Question:
// // {question}

// // Answer:
// // `;

// // // Node 1: Retrieve Context from Supabase
// // export const retrieveContext = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
// //     console.log("--- Executing Node: retrieveContext ---");
// //     const { question, documentName } = state;

// //     const supabaseUrl = process.env.SUPABASE_URL;
// //     const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// //     if (!supabaseUrl || !supabaseAnonKey) {
// //         throw new Error("Supabase URL or Anon Key is not set.");
// //     }

// //     const client = createClient(supabaseUrl, supabaseAnonKey);
// //     const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY });

// //     const vectorStore = new SupabaseVectorStore(embeddings, {
// //         client,
// //         tableName: "documents",
// //         queryName: "match_documents",
// //     });

// //     // Search for the most similar documents
// //     const retriever = vectorStore.asRetriever({
// //         searchKwargs: {
// //             // No filter property; only valid properties should be used
// //         }
// //     });
// //     const context = await retriever.getRelevantDocuments(question);

// //     console.log("Retrieved context:", context);
// //     return { context };
// // };

// // // Node 2: Generate Answer using RAG
// // export const generateAnswer = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
// //     console.log("--- Executing Node: generateAnswer (RAG) ---");
// //     const { question, context } = state;

// //     const prompt = ChatPromptTemplate.fromTemplate(RAG_PROMPT_TEMPLATE);
// //     const model = new ChatGoogleGenerativeAI({
// //         apiKey: process.env.GOOGLE_API_KEY,
// //         model: "gemini-1.5-flash",
// //         temperature: 0.3,
// //     });

// //     // Create a chain to combine the prompt, model, and output parser
// //     const ragChain = RunnableSequence.from([
// //         prompt,
// //         model,
// //         new StringOutputParser(),
// //     ]);

// //     const answer = await ragChain.invoke({
// //         question,
// //         context: context?.map(doc => doc.pageContent).join("\n") ?? "",
// //     });

// //     return { answer };
// // };

// // // Node 3: Fallback - Generate Answer without RAG
// // export const fallbackToLlm = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
// //     console.log("--- Executing Node: fallbackToLlm ---");
// //     const { question } = state;

// //     const model = new ChatGoogleGenerativeAI({
// //         apiKey: process.env.GOOGLE_API_KEY,
// //         model: "gemini-1.5-flash",
// //         temperature: 0.7, // Slightly more creative for general questions
// //     });

// //     const answer = await model.invoke(question);

// //     return { answer: answer.content.toString() };
// // };

// // export const decidePath = (state: RagGraphState): "generateAnswer" | "fallbackToLlm" => {
// //     console.log("--- Executing Edge: decidePath ---");
// //     if (state.context && state.context.length > 0) {
// //         console.log("Decision: Context found. Routing to generateAnswer.");
// //         return "generateAnswer";
// //     } else {
// //         console.log("Decision: No context found. Routing to fallbackToLlm.");
// //         return "fallbackToLlm";
// //     }
// // };

// // export const rephraseQuestion = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
// //     console.log("--- Executing Node: rephraseQuestion ---");
// //     const { question, chat_history } = state;

// //     if (chat_history.length === 0) {
// //         // If there's no history, the original question is the standalone question
// //         return { question };
// //     }

// //     const prompt = ChatPromptTemplate.fromTemplate(REPHRASE_QUESTION_TEMPLATE);
// //     const model = new ChatGoogleGenerativeAI({
// //         apiKey: process.env.GOOGLE_API_KEY,
// //         model: "gemini-1.5-flash",
// //         temperature: 0.1,
// //     });

// //     const rephraseChain = RunnableSequence.from([
// //         prompt,
// //         model,
// //         new StringOutputParser(),
// //     ]);

// //     // Format the chat history into a string
// //     const formattedHistory = chat_history.map(msg =>
// //         msg.constructor.name === 'HumanMessage' ? `Human: ${msg.content}` : `AI: ${msg.content}`
// //     ).join("\n");

// //     const standaloneQuestion = await rephraseChain.invoke({
// //         question,
// //         chat_history: formattedHistory,
// //     });

// //     console.log("Original question:", question);
// //     console.log("Rephrased question:", standaloneQuestion);

// //     return { question: standaloneQuestion };
// // };

// // rag.graph.ts
// // This file defines the nodes and edges of our RAG graph using LangGraph.
// import { Document } from "@langchain/core/documents";
// import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
// import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { createClient } from "@supabase/supabase-js";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { RunnableSequence } from "@langchain/core/runnables";

// // This interface defines the state of our RAG graph.
// export interface RagGraphState {
//   question: string;
//   documentName: string;
//   chat_history: BaseMessage[];
//   context?: Document[];
//   answer?: string;
// }

// // IMPROVED: Added few-shot examples to make rephrasing more reliable.
// const REPHRASE_QUESTION_TEMPLATE = `
// Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
// This standalone question will be used to retrieve documents, so it must be specific and contain all necessary context from the chat history.

// Chat History:
// {chat_history}

// Follow Up Input: {question}

// ---
// Here are some examples:

// <example>
// Chat History:
// Human: What is LangGraph?
// AI: LangGraph is a library for building stateful, multi-actor applications with LLMs.
// Follow Up Input: how does it work?
// Standalone Question: How does LangGraph, a library for building stateful, multi-actor applications with LLMs, work?
// </example>

// <example>
// Chat History:
// Human: Tell me about the Supabase vector store integration.
// AI: The SupabaseVectorStore integration allows you to use Supabase's pgvector extension as a vector store for semantic search.
// Follow Up Input: can you elaborate on that?
// Standalone Question: Can you elaborate on how the SupabaseVectorStore integration uses the pgvector extension for semantic search?
// </example>
// ---

// Standalone Question:`;

// // IMPROVED: Made the RAG prompt stricter to avoid confusion.
// const RAG_PROMPT_TEMPLATE = `
// You are a helpful and expert AI assistant who is an expert in analyzing documents.
// Use the provided context from a document to answer the user's question. Your answer must be detailed, comprehensive, and based SOLELY on the information within the context provided.
// Do not use any of your outside knowledge or mention that you are an AI.

// If the context does not contain the information needed to answer the question, you MUST state the following:
// "The document does not contain information on this topic."

// Do not offer to search for information or use your general knowledge.

// Context:
// {context}

// Question:
// {question}

// Answer:
// `;

// // Node 1: Retrieve Context from Supabase (Now with Similarity Score Filtering)
// export const retrieveContext = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
//     console.log("--- Executing Node: retrieveContext ---");
//     const { question, documentName } = state;

//     const supabaseUrl = process.env.SUPABASE_URL;
//     const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
//     const similarityThreshold = 0.7; // <-- Set a relevance threshold

//     if (!supabaseUrl || !supabaseAnonKey) {
//         throw new Error("Supabase URL or Anon Key is not set.");
//     }

//     const client = createClient(supabaseUrl, supabaseAnonKey);
//     const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY });

//     const vectorStore = new SupabaseVectorStore(embeddings, {
//         client,
//         tableName: "documents",
//         queryName: "match_documents",
//     });

//     // IMPROVED: Use similaritySearchWithScore to get relevance scores.
//     const searchResults = await vectorStore.similaritySearchWithScore(question, 4); // Get top 4 results

//     // Filter results based on the similarity threshold.
//     const context = searchResults
//         .filter(([_, score]) => score >= similarityThreshold)
//         .map(([doc, _]) => doc);

//     console.log("Retrieved context after filtering:", context);
//     return { context };
// };

// // Node 2: Generate Answer using RAG
// export const generateAnswer = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
//     console.log("--- Executing Node: generateAnswer (RAG) ---");
//     const { question, context } = state;

//     const prompt = ChatPromptTemplate.fromTemplate(RAG_PROMPT_TEMPLATE);
//     const model = new ChatGoogleGenerativeAI({
//         apiKey: process.env.GOOGLE_API_KEY,
//         model: "gemini-1.5-flash",
//         temperature: 0.3,
//     });

//     const ragChain = RunnableSequence.from([
//         prompt,
//         model,
//         new StringOutputParser(),
//     ]);

//     const answer = await ragChain.invoke({
//         question,
//         context: context?.map(doc => doc.pageContent).join("\n\n") ?? "", // Added spacing for clarity
//     });

//     return { answer };
// };

// // Node 3: Fallback - Generate Answer without RAG
// export const fallbackToLlm = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
//     console.log("--- Executing Node: fallbackToLlm ---");
//     const { question } = state;

//     const model = new ChatGoogleGenerativeAI({
//         apiKey: process.env.GOOGLE_API_KEY,
//         model: "gemini-1.5-flash",
//         temperature: 0.7,
//     });
    
//     // The rephrased, standalone question is passed to the fallback for a direct answer.
//     const answer = await model.invoke(`You are a helpful AI assistant. Answer the following question: ${question}`);

//     return { answer: answer.content.toString() };
// };

// // Edge: Decide whether to generate an answer from context or fallback to the LLM
// export const decidePath = (state: RagGraphState): "generateAnswer" | "fallbackToLlm" => {
//     console.log("--- Executing Edge: decidePath ---");
//     if (state.context && state.context.length > 0) {
//         console.log("Decision: Context found. Routing to generateAnswer.");
//         return "generateAnswer";
//     } else {
//         console.log("Decision: No relevant context found. Routing to fallbackToLlm.");
//         return "fallbackToLlm";
//     }
// };

// // Node: Rephrase the question based on chat history
// export const rephraseQuestion = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
//     console.log("--- Executing Node: rephraseQuestion ---");
//     const { question, chat_history } = state;

//     if (!chat_history || chat_history.length === 0) {
//         console.log("No chat history, using original question.");
//         return { question };
//     }

//     const prompt = ChatPromptTemplate.fromTemplate(REPHRASE_QUESTION_TEMPLATE);
//     const model = new ChatGoogleGenerativeAI({
//         apiKey: process.env.GOOGLE_API_KEY,
//         model: "gemini-1.5-flash",
//         temperature: 0.1,
//     });

//     const rephraseChain = RunnableSequence.from([
//         prompt,
//         model,
//         new StringOutputParser(),
//     ]);

//     const formattedHistory = chat_history.map(msg =>
//         (msg as any)._getType() === 'human' ? `Human: ${msg.content}` : `AI: ${msg.content}`
//     ).join("\n");

//     const standaloneQuestion = await rephraseChain.invoke({
//         question,
//         chat_history: formattedHistory,
//     });

//     console.log("Original question:", question);
//     console.log("Rephrased question:", standaloneQuestion);

//     return { question: standaloneQuestion };
// };

// rag.graph.ts
// This file defines the nodes and edges of our RAG graph using LangGraph.
import { Document } from "@langchain/core/documents";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// The state of our RAG graph remains the same.
export interface RagGraphState {
  question: string;
  documentName: string;
  chat_history: BaseMessage[];
  context?: Document[];
  answer?: string;
}

// **CRITICAL FIX**: A much more robust prompt for question rephrasing.
// It is now explicitly designed to handle vague follow-ups by using the AI's last answer.
const REPHRASE_QUESTION_TEMPLATE = `You are an expert at rephrasing a follow-up question into a standalone question.
Your task is to use the chat history and, most importantly, the **AI's immediately preceding answer**, to transform the user's follow-up question into a detailed, specific, standalone question. This new question will be used for a vector search, so it must be self-contained.

If the follow-up question is vague (e.g., "elaborate," "tell me more," "can you explain that in more detail?"), you MUST absorb the key topic from the AI's last response to create the new standalone question.

If the follow-up question is already specific and standalone, you may use it as is.

**Chat History:**
{chat_history}

**AI's Last Response (for context):**
{last_answer}

**User's Follow-Up Question:**
{question}

---
**Example of a Vague Follow-Up:**

Chat History:
Human: how is the dataset generated
AI: The SIDTD dataset is an extension of the MIDV2020 dataset. 191 counterfeit ID documents were printed... laminated... and filmed using smartphones.

User's Follow-Up Question:
can you please elaborate

**Standalone Question (Your Output):**
Can you provide more details on how the SIDTD dataset was generated, specifically covering the printing, laminating, and filming process for the counterfeit ID documents?
---

**Standalone Question:**`;

const RAG_PROMPT_TEMPLATE = `
You are a helpful and expert AI assistant who is an expert in analyzing documents.
Use the provided context from a document to answer the user's question. Your answer must be detailed, comprehensive, and based SOLELY on the information within the context provided.
Do not use any of your outside knowledge or mention that you are an AI.

If the context does not contain the information needed to answer the question, you MUST state the following:
"The document does not contain information on this topic."

Do not offer to search for information or use your general knowledge.

Context:
{context}

Question:
{question}

Answer:
`;

// Node 1: retrieveContext (Unchanged)
export const retrieveContext = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
    console.log("--- Executing Node: retrieveContext ---");
    const { question } = state;
    const similarityThreshold = 0.7;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase URL or Anon Key is not set.");

    const client = createClient(supabaseUrl, supabaseAnonKey);
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY });
    const vectorStore = new SupabaseVectorStore(embeddings, { client, tableName: "documents", queryName: "match_documents" });

    const searchResults = await vectorStore.similaritySearchWithScore(question, 4);
    const context = searchResults
        .filter(([_, score]) => score >= similarityThreshold)
        .map(([doc, _]) => doc);

    console.log("Retrieved context after filtering:", context);
    return { context };
};

// Node 2: generateAnswer (Unchanged)
export const generateAnswer = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
    console.log("--- Executing Node: generateAnswer (RAG) ---");
    const { question, context } = state;

    const prompt = ChatPromptTemplate.fromTemplate(RAG_PROMPT_TEMPLATE);
    const model = new ChatGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY, model: "gemini-1.5-flash", temperature: 0.3 });
    const ragChain = RunnableSequence.from([prompt, model, new StringOutputParser()]);
    const answer = await ragChain.invoke({
        question,
        context: context?.map(doc => doc.pageContent).join("\n\n") ?? "",
    });
    return { answer };
};

// Node 3: fallbackToLlm (Unchanged)
export const fallbackToLlm = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
    console.log("--- Executing Node: fallbackToLlm ---");
    const { question } = state;
    const model = new ChatGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY, model: "gemini-1.5-flash", temperature: 0.7 });
    const answer = await model.invoke(`You are a helpful AI assistant. Answer the following question: ${question}`);
    return { answer: answer.content.toString() };
};

// Edge: decidePath (Unchanged)
export const decidePath = (state: RagGraphState): "generateAnswer" | "fallbackToLlm" => {
    console.log("--- Executing Edge: decidePath ---");
    if (state.context && state.context.length > 0) {
        console.log("Decision: Context found. Routing to generateAnswer.");
        return "generateAnswer";
    } else {
        console.log("Decision: No relevant context found. Routing to fallbackToLlm.");
        return "fallbackToLlm";
    }
};

// **CRITICAL FIX**: The logic for rephrasing the question is now much smarter.
export const rephraseQuestion = async (state: RagGraphState): Promise<Partial<RagGraphState>> => {
    console.log("--- Executing Node: rephraseQuestion ---");
    const { question, chat_history } = state;

    if (!chat_history || chat_history.length === 0) {
        console.log("No chat history, using original question.");
        return { question };
    }

    // Extract the AI's last message from the history to use as context.
    const lastMessage = chat_history[chat_history.length - 1];
    const last_answer = (lastMessage && (lastMessage as any)._getType() === 'ai')
        ? lastMessage.content.toString()
        : "";

    // If the last message was not from the AI, we can't elaborate on it.
    if (!last_answer) {
         console.log("Last message was not from AI, using original question.");
         return { question };
    }

    const prompt = ChatPromptTemplate.fromTemplate(REPHRASE_QUESTION_TEMPLATE);
    const model = new ChatGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY, model: "gemini-1.5-flash", temperature: 0.1 });
    const rephraseChain = RunnableSequence.from([prompt, model, new StringOutputParser()]);

    // Create a string of the history for the prompt.
    const formattedHistory = chat_history.map(msg =>
        (msg as any)._getType() === 'human' ? `Human: ${msg.content}` : `AI: ${msg.content}`
    ).join("\n");

    const standaloneQuestion = await rephraseChain.invoke({
        question,
        chat_history: formattedHistory,
        last_answer: last_answer, // Provide the last answer directly to the prompt
    });

    console.log("Original question:", question);
    console.log("Rephrased question:", standaloneQuestion.trim());

    // Return the new, more specific question for the next step.
    return { question: standaloneQuestion.trim() };
};