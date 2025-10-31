import { GoogleGenAI } from "@google/genai";

// Vite exposes env vars at build-time via `import.meta.env`.
// Read it safely and avoid crashing the whole app if missing.
const apiKey = (import.meta as any).env?.VITE_API_KEY as string | undefined;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateHindiResponse(prompt: string): Promise<string> {
    if (!ai) {
        console.error("VITE_API_KEY is missing. Add it to .env.local and restart the dev server.");
        return "कृपया .env.local में VITE_API_KEY सेट करें और सर्वर को पुनः शुरू करें।";
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are a friendly and helpful AI assistant. Your primary language is Hindi. Respond to all user prompts in Hindi. Keep your responses concise and natural.",
            },
        });
        
        return response.text;

    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        if (error instanceof Error) {
            return `माफ़ कीजिए, मुझे जवाब देने में कुछ समस्या आ रही है। Error: ${error.message}`;
        }
        return "माफ़ कीजिए, मुझे जवाब देने में कुछ समस्या आ रही है।";
    }
}
