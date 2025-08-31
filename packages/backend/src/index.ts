import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { processAndStorePdf } from './services/rag.service';
import cors from 'cors'; // We'll need this to allow requests from our frontend
import { invokeRagChain } from './services/rag.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Configure CORS to allow our Next.js frontend to call the API
app.use(cors({
    origin: 'http://localhost:3000' // The default port for Next.js
}));

app.use(express.json());

// Configure multer for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.send('Hello from the AI Chatbot Backend!');
});

// The new endpoint for handling PDF uploads
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        console.log('Processing uploaded PDF...');
        await processAndStorePdf(req.file.buffer, req.file.originalname);
        res.status(200).send('PDF processed and stored successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing the PDF.');
    }
});

app.post('/api/chat', async (req, res) => {
    const { question, documentName, chat_history } = req.body;

    if (!question || !documentName) {
        return res.status(400).send('Question and documentName are required.');
    }

    try {
        const result = await invokeRagChain(question, documentName, chat_history || []);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during the chat process.');
    }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});