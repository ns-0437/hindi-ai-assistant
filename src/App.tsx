import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateHindiResponse } from './services/geminiService';
import type { Message } from './types';
import { MicIcon, StopIcon, AiBrainIcon } from './components/Icons';
import { MessageBubble } from './components/MessageBubble';

/**
 * Hindi AI Assistant
 *
 * This application demonstrates a simple Hindi-speaking AI assistant with a stunning, modern interface.
 *
 * Core Technologies Used:
 * 1.  React & TypeScript: For building a robust and scalable user interface.
 * 2.  Tailwind CSS: For rapid, utility-first styling and creating the custom theme.
 * 3.  Web Speech API (SpeechRecognition): For converting user's Hindi speech into text, directly in the browser.
 *     - Why: It's a browser-native API, requiring no external dependencies or API keys for STT, making it ideal for a client-side application.
 * 4.  Google Gemini API (@google/genai): For generating intelligent and context-aware responses in Hindi.
 *     - Why: Gemini is a powerful LLM capable of understanding and generating natural language, making the assistant more interactive.
 * 5.  Web Speech API (SpeechSynthesis): For converting the generated Hindi text back into speech.
 *     - Why: Like SpeechRecognition, it's a browser-native API that provides a simple way to add TTS functionality.
 *
 * Setup and Run Instructions:
 * 1.  Ensure you have a modern web browser that supports the Web Speech API (e.g., Google Chrome, Microsoft Edge).
 * 2.  An API key for the Google Gemini API is required. It must be provided in a .env.local file as VITE_API_KEY.
 * 3.  The application will request permission to use your microphone for speech input. Please grant this permission.
 * 4.  Click the microphone button to start speaking in Hindi. The assistant will transcribe your speech, generate a response, and speak it back to you.
 */

// Minimal shapes for the parts of the Web Speech API this component reads; the browser types
// for SpeechRecognition are not in TypeScript's DOM lib.
interface SpeechResultEvent {
    results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechErrorEvent {
    error: string;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechSupported = !!SpeechRecognitionAPI;

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isListening, setIsListening] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speakHindi = useCallback((text: string) => {
        if (!window.speechSynthesis) {
            setError("Your browser does not support Text-to-Speech.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
            if (hindiVoice) {
                utterance.voice = hindiVoice;
            }
            utterance.lang = 'hi-IN';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        };
        
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = setVoice;
        } else {
            setVoice();
        }
    }, []);

    const processTranscription = useCallback(async (transcript: string) => {
        if (transcript.trim() === "") return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', text: transcript };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const responseText = await generateHindiResponse(transcript);
            const modelMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
            speakHindi(responseText);
        } catch (err) {
            const errorMessage = "An error occurred while getting the response.";
            setError(errorMessage);
            const modelMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: errorMessage };
            setMessages(prev => [...prev, modelMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [speakHindi]);

    useEffect(() => {
        if (!isSpeechSupported) {
            setError("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'hi-IN';

        recognition.onresult = (event: SpeechResultEvent) => {
            const transcript = event.results[0][0].transcript;
            processTranscription(transcript);
        };

        recognition.onerror = (event: SpeechErrorEvent) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [processTranscription]);

    const handleMicClick = () => {
        if (isLoading) return;

        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
        setIsListening(prev => !prev);
    };

    return (
        <div className="flex flex-col h-screen font-sans text-slate-100 bg-transparent">
            <header className="p-4 text-center border-b border-white/10 shadow-lg backdrop-blur-sm sticky top-0 z-10">
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-violet via-brand-blue to-brand-cyan">
                    हिंदी AI सहायक (Hindi AI Assistant)
                </h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.length === 0 && !isLoading && (
                         <div className="text-center py-20 text-slate-400 animate-fade-in-up">
                            <AiBrainIcon className="w-24 h-24 mx-auto text-slate-600 mb-6" />
                            <h2 className="text-3xl font-bold text-slate-200">नमस्ते!</h2>
                            <p className="text-lg mt-2">मैं आपकी क्या मदद कर सकता हूँ?</p>
                            <p className="mt-4">बोलना शुरू करने के लिए माइक्रोफ़ोन बटन दबाएं।</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isLoading && messages[messages.length-1]?.role === 'user' && (
                       <div className="flex items-start gap-3 md:gap-4 animate-fade-in-up">
                            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                               <AiBrainIcon className="w-5 h-5 md:w-6 md:h-6 text-brand-violet" />
                            </div>
                            <div className="flex items-center gap-2 max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-lg bg-slate-800 rounded-bl-none text-slate-400">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-typing-dot"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-typing-dot [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-typing-dot [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="p-4 bg-transparent sticky bottom-0">
                <div className="max-w-3xl mx-auto text-center">
                    {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
                    <div className="relative inline-flex items-center justify-center">
                        {isListening && (
                            <div className="absolute inset-0 rounded-full bg-brand-red animate-wave"></div>
                        )}
                        <button
                            onClick={handleMicClick}
                            disabled={!isSpeechSupported || isLoading}
                            className={`relative w-20 h-20 rounded-full text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed
                            ${isListening ? 'bg-brand-red' : 'bg-brand-blue animate-breathing focus:ring-blue-500/50'}
                            ${isLoading ? 'bg-slate-600 animate-none' : ''}`}
                            aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
                        >
                           <span className="absolute inset-0 flex items-center justify-center">
                             {isListening ? (
                                <StopIcon className="w-8 h-8"/>
                             ): (
                                <MicIcon className="w-8 h-8" />
                             )}
                           </span>
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                        Powered by Gemini & Web Speech API.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;

