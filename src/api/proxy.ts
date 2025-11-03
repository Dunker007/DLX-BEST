// Fix: Changed the express import to use the default import. Using namespaced types 
// (e.g., express.Request) is necessary to avoid conflicts with global DOM types 
// that were causing compilation errors.
// FIX: Explicitly import Request and Response to prevent type conflicts with global DOM types.
import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- Environment Variables ---
const { API_KEY, OPENAI_API_KEY, GROQ_API_KEY } = process.env;

// --- AI Service Initialization ---
let geminiAi: GoogleGenAI | null = null;
if (API_KEY) {
  geminiAi = new GoogleGenAI({ apiKey: API_KEY });
}

// --- AI Proxy Endpoints ---

// Google Gemini Proxy
// Refactored to use the @google/genai SDK for improved security and maintainability.
app.post('/api/gemini', async (req: Request, res: Response) => {
  if (!geminiAi) {
    return res.status(500).json({ error: 'Gemini API key not configured on server.' });
  }
  const { contents, config, useSearch } = req.body;
  if (!contents) {
    return res.status(400).json({ error: 'A "contents" property is required in the request body.' });
  }

  try {
    const generateContentRequest: any = {
      model: 'gemini-2.5-flash',
      contents: contents, // SDK handles string or object contents
      config: config,
    };
    
    if (useSearch) {
      generateContentRequest.config = {
        ...generateContentRequest.config,
        tools: [{ googleSearch: {} }],
      };
    }
    
    const response = await geminiAi.models.generateContent(generateContentRequest);
    
    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ uri: web.uri, title: web.title }));

    res.json({ text, sources });

  } catch (error: any) {
    console.error('Gemini Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch from Gemini API.' });
  }
});

// Groq (formerly Grok/xAI) Proxy - PIVOTED
// Fix: Use express.Request and express.Response types to resolve type conflicts.
app.post('/api/grok', async (req: Request, res: Response) => {
    if (!GROQ_API_KEY) {
        return res.status(500).json({ error: 'Groq API key not configured on server.' });
    }
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // Using a standard Groq model
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Groq API Error:', errorData);
            return res.status(response.status).json({ error: `Failed to fetch from Groq API: ${errorData.error?.message || 'Unknown error'}` });
        }

        const data = await response.json();
        res.json({ text: data.choices?.[0]?.message?.content || 'No response from Groq.' });
    } catch (error) {
        console.error('Groq Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch from Groq API.' });
    }
});

// OpenAI (Copilot) Proxy
// Fix: Use express.Request and express.Response types to resolve type conflicts.
app.post('/api/copilot', async (req: Request, res: Response) => {
    if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured on server.' });
    }
    const { prompt } = req.body;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        const data = await response.json();
        res.json({ text: data.choices?.[0]?.message?.content || 'No response from OpenAI.' });
    } catch (error) {
        console.error('OpenAI Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch from OpenAI API.' });
    }
});

// Bytebot.ai Proxy
app.post('/api/bytebot/tasks', async (req: Request, res: Response) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Task name and description are required.' });
    }
    try {
        // The Bytebot service is expected to be running on localhost:9991 as per the user's screenshot
        const bytebotResponse = await fetch('http://localhost:9991/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description }),
        });

        if (!bytebotResponse.ok) {
            let errorBody;
            try {
                errorBody = await bytebotResponse.json();
            } catch (e) {
                errorBody = { error: bytebotResponse.statusText };
            }
            console.error('Bytebot Service Error:', errorBody);
            return res.status(bytebotResponse.status).json(errorBody);
        }

        const data = await bytebotResponse.json();
        res.status(201).json(data); // Assuming 201 Created on success
    } catch (error) {
        console.error('Bytebot Proxy Error:', error);
        res.status(503).json({ error: 'Bytebot service is unavailable.' });
    }
});

// Bytebot.ai Desktop Control Proxy
app.get('/api/bytebot/desktop', async (_req: Request, res: Response) => {
    try {
        const response = await fetch('http://localhost:9991/v1/desktop');
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: response.statusText }));
            return res.status(response.status).json(errorBody);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Bytebot Desktop Proxy Error (GET):', error);
        res.status(503).json({ error: 'Bytebot service is unavailable.' });
    }
});

app.post('/api/bytebot/desktop/mouse/click', async (req: Request, res: Response) => {
    try {
        const response = await fetch('http://localhost:9991/v1/desktop/mouse/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: response.statusText }));
            return res.status(response.status).json(errorBody);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Bytebot Desktop Proxy Error (Click):', error);
        res.status(503).json({ error: 'Bytebot service is unavailable.' });
    }
});

app.post('/api/bytebot/desktop/keyboard/type', async (req: Request, res: Response) => {
    try {
        const response = await fetch('http://localhost:9991/v1/desktop/keyboard/type', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: response.statusText }));
            return res.status(response.status).json(errorBody);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Bytebot Desktop Proxy Error (Type):', error);
        res.status(503).json({ error: 'Bytebot service is unavailable.' });
    }
});


// --- Authentication ---
// A simple auth endpoint for the landing page
app.post('/api/auth', (req: Request, res: Response) => {
    const { password } = req.body;
    // In a real application, this should be a securely stored and compared password.
    // Using a value from the UI for thematic consistency.
    if (password === 'lux2.0') {
        res.status(200).json({ message: 'Access Granted' });
    } else {
        res.status(401).json({ error: 'Access Denied' });
    }
});


app.listen(port, () => {
  console.log(`🚀 DLX Backend Proxy listening on http://localhost:${port}`);
  
  const missingKeys: string[] = [];
  if (!API_KEY) missingKeys.push('API_KEY (for Gemini)');
  if (!OPENAI_API_KEY) missingKeys.push('OPENAI_API_KEY');
  if (!GROQ_API_KEY) missingKeys.push('GROQ_API_KEY');

  if (missingKeys.length > 0) {
    console.warn(`⚠️  Warning: The following environment variables are missing from your .env file: ${missingKeys.join(', ')}. The application may not function correctly.`);
  } else {
    console.log('✅ All required environment variables are loaded.');
  }
});