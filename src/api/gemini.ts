import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
export const initializeAi = (apiKey: string) => { 
    if (!ai) {
        ai = new GoogleGenAI({ apiKey });
    }
    return { ai }; 
};
