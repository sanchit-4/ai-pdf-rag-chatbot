// // import { SupabaseClient, createClient } from '@supabase/supabase-js';
// // import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// // import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// // import { Document } from "@langchain/core/documents";
// // import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// // import pdf from "pdf-parse";

// // // This function processes and stores a PDF file in the vector database.
// // export const processAndStorePdf = async (fileBuffer: Buffer, fileName: string) => {
// //     // Step 1: Initialize Supabase client and embedding model
// //     const supabaseUrl = process.env.SUPABASE_URL;
// //     const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// //     if (!supabaseUrl || !supabaseAnonKey) {
// //         throw new Error("Supabase URL or Anon Key is not set.");
// //     }

// //     const client: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
// //     const embeddings = new GoogleGenerativeAIEmbeddings({
// //         apiKey: process.env.GOOGLE_API_KEY,
// //     });

// //     // Step 2: Load PDF and extract text
// //     const pdfData = await pdf(fileBuffer);
// //     const text = pdfData.text;

// //     // Step 3: Split the text into smaller chunks
// //     // This is crucial for RAG as it allows the model to find the most relevant parts of the document.
// //     const splitter = new RecursiveCharacterTextSplitter({
// //         chunkSize: 500, // The size of each chunk in characters
// //         chunkOverlap: 50, // The number of characters to overlap between chunks
// //     });

// //     const documents = await splitter.splitDocuments([
// //         new Document({
// //             pageContent: text,
// //             metadata: {
// //                 // We add metadata to identify the source of the chunks
// //                 source: fileName
// //             }
// //         })
// //     ]);

// //     console.log(`Created ${documents.length} document chunks.`);

// //     // Step 4: Create embeddings for the chunks and store them in Supabase
// //     console.log("Creating vector store and storing embeddings...");
// //     await SupabaseVectorStore.fromDocuments(documents, embeddings, {
// //         client,
// //         tableName: "documents",
// //         queryName: "match_documents",
// //     });

// //     console.log("Embeddings stored successfully.");
// // };

// // rag.service.ts
// // This file defines the RAG service that processes PDFs and handles chat requests using LangGraph.
// import { StateGraph, END } from "@langchain/langgraph";
// import {
//     RagGraphState,
//     retrieveContext,
//     generateAnswer,
//     fallbackToLlm,
//     decidePath,
//     rephraseQuestion
// } from "../graph/rag.graph";

// import { processAndStorePdf as processPdf } from "./pdfProcessor"; // We'll move the logic soon
// import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages"; // <-- Add BaseMessage
// import { Document } from "@langchain/core/documents"; // <-- Add this import

// // Re-export the PDF processing function
// export const processAndStorePdf = processPdf;

// // Define the graph structure
// // in packages/backend/src/services/rag.service.ts

// const graph = new StateGraph<RagGraphState>({
//     channels: {
//         question: {
//             value: (x, y) => y,
//             default: () => ""
//         },
//         documentName: {
//             value: (x, y) => y,
//             default: () => ""
//         },
//         chat_history: {
//             value: (x, y) => y,
//             // Tell TypeScript this function returns a BaseMessage array
//             default: (): BaseMessage[] => []
//         },
//         context: {
//             value: (x, y) => y,
//             // Tell TypeScript this function returns a Document array
//             default: (): Document[] => []
//         },
//         answer: {
//             value: (x, y) => y,
//             default: () => ""
//         },
//     }
// })
//     .addNode("rephraseQuestion", rephraseQuestion)
//     .addNode("retrieveContext", retrieveContext)
//     .addNode("generateAnswer", generateAnswer)
//     .addNode("fallbackToLlm", fallbackToLlm)

//     // Define the edges
//     .setEntryPoint("rephraseQuestion")
//     .addEdge("rephraseQuestion", "retrieveContext")
//     .addConditionalEdges("retrieveContext", decidePath, {
//         "generateAnswer": "generateAnswer",
//         "fallbackToLlm": "fallbackToLlm",
//     })
//     .addEdge("generateAnswer", END)
//     .addEdge("fallbackToLlm", END);
// // Compile the graph into a runnable object
// const runnableGraph = graph.compile();

// // The main function to invoke the RAG chain
// export const invokeRagChain = async (question: string, documentName: string, chat_history: any[]) => {
//     const initialState = {
//         question: question ?? "",
//         documentName: documentName ?? "",
//         chat_history: chat_history.map(msg => // Convert message format
//           msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
//         ),
//         context: [],
//         answer: "",
//     };

//     const finalState = await runnableGraph.invoke(initialState);
//     return finalState;
// };


// // rag.service.ts
// // This file defines the RAG service that processes PDFs and handles chat requests using LangGraph.
// import { StateGraph, END } from "@langchain/langgraph";
// import {
//     RagGraphState,
//     retrieveContext,
//     generateAnswer,
//     fallbackToLlm,
//     decidePath,
//     rephraseQuestion
// } from "../graph/rag.graph";

// import { processAndStorePdf as processPdf } from "./pdfProcessor"; // We'll move the logic soon
// import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
// import { Document } from "@langchain/core/documents";

// // Re-export the PDF processing function
// export const processAndStorePdf = processPdf;

// // Define the graph structure with the explicit state schema
// const graph = new StateGraph({
//     channels: {
//         question: {
//             value: (x: string, y: string) => y,
//             default: () => ""
//         },
//         documentName: {
//             value: (x: string, y: string) => y,
//             default: () => ""
//         },
//         chat_history: {
//             value: (x: BaseMessage[], y: BaseMessage[]) => y,
//             default: (): BaseMessage[] => []
//         },
//         context: {
//             value: (x: Document[], y: Document[]) => y,
//             default: (): Document[] => []
//         },
//         answer: {
//             value: (x: string, y: string) => y,
//             default: () => ""
//         },
//     }
// } as any); // Using 'as any' here can help bypass overly strict type checking on the channels definition.
//             // A more type-safe way is to ensure your RagGraphState aligns perfectly with what StateGraph expects.

// graph
//     .addNode("rephraseQuestion", rephraseQuestion)
//     .addNode("retrieveContext", retrieveContext)
//     .addNode("generateAnswer", generateAnswer)
//     .addNode("fallbackToLlm", fallbackToLlm)

//     // Define the edges
//     .setEntryPoint("rephraseQuestion")
//     .addEdge("rephraseQuestion", "retrieveContext")
//     .addConditionalEdges("retrieveContext", decidePath, {
//         "generateAnswer": "generateAnswer",
//         "fallbackToLlm": "fallbackToLlm",
//     })
//     .addEdge("generateAnswer", END)
//     .addEdge("fallbackToLlm", END);

// // Compile the graph into a runnable object
// const runnableGraph = graph.compile();

// // The main function to invoke the RAG chain
// export const invokeRagChain = async (question: string, documentName: string, chat_history: any[]) => {
//     const initialState: RagGraphState = {
//         question: question ?? "",
//         documentName: documentName ?? "",
//         chat_history: chat_history.map(msg => // Convert message format
//           msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
//         ),
//         context: [],
//         answer: "",
//     };

//     const finalState = await runnableGraph.invoke(initialState);
//     return finalState;
// };


// rag.service.ts
// This file defines the RAG service that processes PDFs and handles chat requests using LangGraph.
import { StateGraph, END } from "@langchain/langgraph";
import {
    RagGraphState,
    retrieveContext,
    generateAnswer,
    fallbackToLlm,
    decidePath,
    rephraseQuestion
} from "../graph/rag.graph";

import { processAndStorePdf as processPdf } from "./pdfProcessor";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents"; // Import Document for type safety

// Re-export the PDF processing function
export const processAndStorePdf = processPdf;

// Pass your RagGraphState interface as a generic to StateGraph for type safety.
const graph = new StateGraph<RagGraphState>({
    channels: {
        question: {
            value: (x: string, y: string) => y, // Reducer: always take the new value
            default: () => ""
        },
        documentName: {
            value: (x: string, y: string) => y,
            default: () => ""
        },
        chat_history: {
            value: (x: BaseMessage[], y: BaseMessage[]) => y,
            default: () => []
        },
        context: {
            // The reducer for context should handle potentially undefined values
            value: (x?: Document[], y?: Document[]) => y ?? [],
            default: () => []
        },
        answer: {
            // The reducer for the answer should also handle potentially undefined values
            value: (x?: string, y?: string) => y ?? "",
            default: () => ""
        },
    }
});

graph
    .addNode("rephraseQuestion", rephraseQuestion)
    .addNode("retrieveContext", retrieveContext)
    .addNode("generateAnswer", generateAnswer)
    .addNode("fallbackToLlm", fallbackToLlm)

    // Define the graph's flow
    .setEntryPoint("rephraseQuestion")
    .addEdge("rephraseQuestion", "retrieveContext")
    .addConditionalEdges("retrieveContext", decidePath, {
        "generateAnswer": "generateAnswer",
        "fallbackToLlm": "fallbackToLlm",
    })
    .addEdge("generateAnswer", END)
    .addEdge("fallbackToLlm", END);

// Compile the graph into a runnable object
const runnableGraph = graph.compile();

// The main function to invoke the RAG chain
export const invokeRagChain = async (question: string, documentName: string, chat_history: any[]) => {
    // Ensure chat_history is an array to prevent errors
    const history = chat_history ?? [];

    const initialState: RagGraphState = {
        question: question ?? "",
        documentName: documentName ?? "",
        chat_history: history.map(msg =>
          msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
        ),
        // Explicitly initialize optional fields
        context: [],
        answer: "",
    };

    // Convert initialState to a plain object with string keys
    const finalState = await runnableGraph.invoke({ ...initialState });
    return finalState;
};