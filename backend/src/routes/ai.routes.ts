import { Router, Request, Response } from 'express';
import prisma from '../utils/db';
import { GoogleGenAI } from '@google/genai'; // Assuming this imports correctly

const router = Router();

// Initialize SDK using Vertex AI credentials or regular API Key fallback
const ai = new GoogleGenAI({
  vertexai: true, 
  project: process.env.GOOGLE_CLOUD_PROJECT || 'practical-mason-448013-k8', 
  location: 'us-central1'
});

// 1. Diagnostics endpoint
router.get('/status', async (req: Request, res: Response) => {
    try {
        const diagnostics: any = {
            db: false,
            apiKey: !!process.env.GEMINI_API_KEY || !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
            aiEngine: false,
            geminiVersion: 'gemini-2.5-flash', // Default model
            error: null
        };

        // Test DB
        try {
            await (prisma as any).virtualAgent.findFirst();
            diagnostics.db = true;
        } catch (dbError) {
            console.error('[Diagnostic] DB error:', dbError);
        }

        // Test AI Ping
        if (diagnostics.apiKey) {
            try {
                const response = await ai.models.generateContent({
                    model: diagnostics.geminiVersion,
                    contents: 'Reply with the word "OK"',
                });
                
                if (response.text && response.text.includes('OK')) {
                    diagnostics.aiEngine = true;
                }
            } catch (aiError: any) {
                console.error('[Diagnostic] AI Ping error:', aiError);
                diagnostics.error = aiError.message;
            }
        }

        res.json(diagnostics);
    } catch (error: any) {
        console.error('Error fetching AI status:', error);
        res.status(500).json({ error: 'Failed to fetch AI diagnostics' });
    }
});

// 2. Chat Tester
router.post('/test-chat', async (req: Request, res: Response) => {
    try {
        const { message, model } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const selectedModel = model || 'gemini-2.5-flash';

        const response = await ai.models.generateContent({
            model: selectedModel,
            contents: message,
        });

        res.json({ reply: response.text });
    } catch (error: any) {
        console.error('Error in AI test chat:', error);
        res.status(500).json({ error: 'AI processing failed', details: error.message });
    }
});

export default router;
