# AI Shorts Factory

A local-first AI YouTube Shorts automation system.

## Features
- **Local AI**: Connects to your local Ollama instance for script generation.
- **Stock Automation**: Searches Pexels/Pixabay for relevant vertical clips.
- **Rendering Pipeline**: Uses FFmpeg to composite audio, video, and animated subtitles.
- **Queue System**: Manage multiple video jobs and batch render them.

## Local Setup (Mac)
1. **Install Dependencies**:
   - `brew install ffmpeg`
   - `brew install ollama`
2. **Run Ollama**:
   - `ollama serve`
   - `ollama pull qwen2.5` (or your preferred model)
3. **Run this App**:
   - `npm install`
   - `npm run dev`
4. **Configuration**:
   - Open the app and follow the Setup Wizard.
   - Enter your Pexels/Pixabay API keys.
   - Set your workspace folders.

## Built With
- React + TypeScript + Vite
- Express (Node.js Backend)
- Tailwind CSS (Modern Dark UI)
- Framer Motion
- Fluent FFmpeg
