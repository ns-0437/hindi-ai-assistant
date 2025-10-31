# Hindi AI Assistant

A modern Hindi-speaking AI assistant with speech-to-text, Gemini responses, and Hindi text-to-speech. Built with React + TypeScript + Vite + Tailwind.

- Hindi input via Web Speech API (SpeechRecognition)
- Hindi output via Google Gemini and Web Speech API (SpeechSynthesis)
- Beautiful, responsive UI with Tailwind animations

## Quick Start

Prerequisites:
- Node.js 20+ (LTS recommended)
- Google Gemini API key

Setup:
```bash
# 1) Clone or download the project
cd hindi-ai-assistant

# 2) Create env file (root of the project)
# .env.local
VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE

# 3) Install deps and run
npm install
npm run dev
```
Open the printed Local URL (e.g., `http://localhost:5173`) in Chrome or Edge. Allow microphone access.

Production build:
```bash
npm run build
npm run preview
```

Troubleshooting:
- If the page says the API key is missing, ensure `.env.local` exists next to `package.json`, restart `npm run dev`, and hard-refresh the browser (Ctrl+F5).
- On Windows/OneDrive paths, file locking can cause issues; consider moving the project outside OneDrive (e.g., `C:\\Projects\\hindi-ai-assistant`).

## Technologies and Why
- React + TypeScript: Reliable, scalable UI with strong typing for maintainability.
- Vite: Fast dev server and build tooling.
- Tailwind CSS: Utility-first styling for rapid, consistent design and animations.
- Web Speech API (SpeechRecognition): Browser-native speech-to-text; no extra service needed for STT.
- Web Speech API (SpeechSynthesis): Browser-native Hindi text-to-speech playback.
- Google Gemini (`@google/genai`): High-quality LLM responses in Hindi.

## Project Structure
```
hindi-ai-assistant/
├── .env.local                 # not committed; contains VITE_API_KEY
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── src/
│   ├── components/
│   │   ├── Icons.tsx
│   │   └── MessageBubble.tsx
│   ├── services/
│   │   └── geminiService.ts
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   └── types.ts
```

## How It Works (End-to-End)
1. User clicks the microphone button → Web Speech API captures Hindi speech and returns transcript (`hi-IN`).
2. The transcript is sent to Gemini via `generateHindiResponse`.
3. The response is rendered as a message and also spoken back using SpeechSynthesis with a Hindi voice.

Key files:
- `src/services/geminiService.ts`: wraps Gemini API.
- `src/App.tsx`: UI logic, STT/TTS wiring, conversation flow.
- `src/components/*`: Icons and message bubbles.

## Demo Video (2–5 min) – What to Show
- Feature overview and live mic demo
- Setup summary (.env.local, dev server)
- Brief code walkthrough (App, geminiService, components)
- Any challenges and improvements (see below)

## Challenges and Solutions
- Browser STT differences: Web Speech API behaves best on Chrome/Edge; we detect support and show helpful errors.
- Hindi TTS voice availability: Selects `hi-IN` voice when available; falls back gracefully.
- Env handling in Vite: Reads `VITE_API_KEY` at build-time; clear messaging if missing.

## Ideas for Improvement
- Add text input mode for environments without mic access.
- Maintain multi-turn context for richer conversations.
- Streaming responses with incremental UI display.
- Safety/length controls, temperature tuning.
- Offline fallback for basic replies.
- PWA install support.

