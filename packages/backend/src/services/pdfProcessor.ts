import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const pdf = require("pdf-parse");    
export const processAndStorePdf = async (fileBuffer: Buffer, fileName: string) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase credentials not set.");

    const client: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY });
    const pdfData = await pdf(fileBuffer);
    const text = pdfData.text;

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
    const documents = await splitter.splitDocuments([new Document({ pageContent: text, metadata: { source: fileName } })]);

    await SupabaseVectorStore.fromDocuments(documents, embeddings, {
        client,
        tableName: "documents",
        queryName: "match_documents",
    });
    console.log(`Embeddings for ${fileName} stored successfully.`);
};