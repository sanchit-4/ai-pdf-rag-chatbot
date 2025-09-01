# AI-Powered PDF Chatbot with RAG and LangGraph

This project is a sophisticated, full-stack AI chatbot application that allows you to "talk" to your PDF documents. Upload a PDF, and the AI will answer questions based solely on the document's content, providing accurate, context-aware responses while avoiding hallucination.

The application is built with a modern monorepo architecture, featuring a Next.js frontend and a Node.js/TypeScript backend. The core of its intelligence lies in a Retrieval-Augmented Generation (RAG) pipeline orchestrated by LangGraph, enabling complex, stateful conversational logic.


## Demo

![Demo](https://live.staticflickr.com/65535/54758000776_97f89da47c_b.jpg)

## Key Features

    • Dynamic PDF Processing: Upload any PDF, and the system will automatically parse, chunk, and store it for querying.

    • Conversational Chat Interface: Ask questions in natural language and engage in a dialogue with your document.

    • Context-Aware Memory: The chatbot remembers the previous turns in the conversation, allowing for follow-up questions like "can you elaborate on that?"

    • Source-Based Answers: All answers are generated directly from the information present in the PDF, with a fallback to a general AI model if the document lacks the necessary context.

    • Robust Logic with LangGraph: The backend uses a stateful graph to manage the flow of logic, deciding whether to rephrase a question, query the document, or use general knowledge.

## Architecture

The application is a monorepo composed of two main services: a frontend web application and a backend API.

[Frontend (Next.js on Vercel)] <--> [Backend API (Node.js/Express on Render)] <--> [Vector DB (Supabase pgvector)]

    Frontend: A responsive web interface built with Next.js and React that allows users to upload PDFs and interact with the chat. It is deployed on Vercel.

    Backend: A Node.js API built with Express and TypeScript that handles all the core logic, including PDF processing, embedding generation, and orchestrating the RAG chain. It is deployed on Render.

    Vector Database: We use Supabase with the pgvector extension to store document embeddings and perform efficient similarity searches.

## Core Logic: The RAG and LangGraph Engine

The heart of this project is its advanced Retrieval-Augmented Generation (RAG) pipeline, built using LangGraph. Instead of a simple linear chain, we use a stateful graph to create a more intelligent and resilient system.

This graph defines a series of nodes (steps) and edges (transitions) that the user's query travels through.

Here is the flow of our graph:

    rephraseQuestion Node: This is the entry point. It examines the chat history and the user's latest input. If the input is a follow-up question (e.g., "why?"), this node uses an LLM to transform it into a specific, standalone question that contains all the necessary context from the conversation.

    retrieveContext Node: The rephrased question is used to perform a vector search against the Supabase database. This node retrieves document chunks that are semantically similar to the question. It also filters these results based on a relevance score to ensure only high-quality context is used.

    decidePath (Conditional Edge): This is the "brain" of our graph. It checks if the retrieveContext node found any relevant document chunks.

        If context exists: It routes the flow to the generateAnswer node.

        If no context exists: It routes the flow to the fallbackToLlm node.

    generateAnswer Node (RAG): This node takes the original question and the retrieved context and feeds them into a strict LLM prompt. This prompt commands the model to answer the question based solely on the provided context, ensuring factual accuracy and preventing hallucination.

    fallbackToLlm Node: If the document doesn't contain the answer, this node allows a general-purpose LLM to answer the question from its own knowledge base, ensuring the user still gets a helpful response.

This graph-based approach makes the system robust, debuggable, and capable of handling complex conversational flows far better than a simple RAG chain.


## Tech Stack

Frontend  ---->  Next.js, React, TypeScript

Backend  ---->  Node.js, Express, TypeScript

AI & LLM  ---->  LangChain.js, LangGraph, Google Gemini

Database  ---->  Supabase (PostgreSQL with pgvector)

Deployment  ---->  Vercel (Frontend), Render (Backend)
