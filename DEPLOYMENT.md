# DLX Command Center - Deployment Guide

## Project Status: Ready for Production Resume ✅

All repairs complete! The application is ready to run.

---

## Quick Start

### 1. Configure API Keys

Edit `.env.local` and add your API keys:

```bash
# Required for Gemini features (Strategy Command, Aura Live)
API_KEY=your_gemini_api_key_here

# Optional API keys for additional features
OPENAI_API_KEY=your_openai_api_key_here  # For Copilot AI
GROQ_API_KEY=your_groq_api_key_here      # For Grok AI
```

**Get your Gemini API key:** https://aistudio.google.com/apikey

### 2. Run the Application

#### Option A: Run Both Services Together (Recommended)
```bash
npm start
```

#### Option B: Run Services Separately
Terminal 1 - Backend Server:
```bash
npm run server
```

Terminal 2 - Frontend Dev Server:
```bash
npm run dev
```

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Default Password:** `lux2.0`

---

## Architecture Overview

### Frontend (React + TypeScript + Vite)
- Port: 3000
- Framework: React 19.2.0 with TypeScript
- Build Tool: Vite 7.x
- Styling: Custom CSS with Phoenix theme

### Backend (Express + Node.js)
- Port: 3001
- Purpose: API proxy for secure API key management
- Endpoints:
  - `/api/gemini` - Google Gemini AI
  - `/api/grok` - Groq (formerly xAI)
  - `/api/copilot` - OpenAI GPT-4
  - `/api/bytebot/*` - Bytebot.ai integration
  - `/api/auth` - Simple authentication

---

## Features Overview

### Core Labs

1. **Operator Hub** (Home Dashboard)
   - Customizable widget-based interface
   - System health monitoring
   - Agent status tracking
   - Priority directives
   - Compliance alerts

2. **Aura Live Lab**
   - Real-time voice AI interaction
   - Powered by Gemini Live API
   - Voice transcription
   - Audio visualization

3. **Strategy Command Lab**
   - Interactive mind mapping
   - Directive creation from ideas
   - AI-powered strategy planning

4. **Orchestrator Lab**
   - Multi-agent task orchestration
   - Automated task assignment
   - Execution tracking

5. **Deployment Lab**
   - Code review management
   - Deployment staging
   - Production deployment controls

6. **Monitoring Lab**
   - System metrics visualization
   - Real-time performance tracking

7. **Chronicle Lab**
   - System event logging
   - Audit trail
   - Anomaly detection

8. **Bytebot Lab**
   - Task automation
   - Terminal command execution

9. **Desktop Lab**
   - Desktop control interface
   - Bytebot desktop integration

10. **Crypto Lab**
    - Cryptocurrency ticker (demo)

11. **Knowledge Base Lab**
    - Document management
    - File indexing

---

## Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The build output will be in the `dist/` directory.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `API_KEY` | Yes* | Gemini API key for AI features |
| `OPENAI_API_KEY` | No | OpenAI API for Copilot features |
| `GROQ_API_KEY` | No | Groq API for Grok features |

*Required for full functionality. The app will run with limited features if not provided.

---

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are in use:

1. Change frontend port in `vite.config.ts`:
   ```typescript
   server: { port: 3000 }  // Change to your preferred port
   ```

2. Change backend port in `src/api/proxy.ts`:
   ```typescript
   const port = 3001;  // Change to your preferred port
   ```

### API Key Issues
- Ensure `.env.local` exists in the project root
- Verify API keys are valid and active
- Check for extra spaces or quotes in `.env.local`

### TypeScript Errors
```bash
npx tsc --noEmit
```

### Missing Dependencies
```bash
npm install
```

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env.local` to version control** - It's already in `.gitignore`
2. **Backend proxy protects API keys** - Frontend never exposes keys directly
3. **Default password** (`lux2.0`) is for demo only - implement proper auth for production
4. **CORS is enabled** - Configure appropriately for production deployment

---

## External Dependencies

Optional external services:
- **Bytebot.ai** (localhost:9991) - For Bytebot and Desktop labs
  - If not running, these labs will show connection errors
  - Other labs will function normally

---

## Technology Stack

- **Frontend:**
  - React 19.2.0
  - TypeScript 5.8.2
  - Vite 7.1.11
  - CSS3 (Custom cyberpunk theme)

- **Backend:**
  - Node.js
  - Express 5.1.0
  - dotenv 17.2.3

- **AI/ML:**
  - @google/genai 1.25.0
  - Gemini 2.5 Flash
  - GPT-4 (via OpenAI)
  - Llama 3 (via Groq)

---

## Next Steps

1. ✅ Configure your API keys in `.env.local`
2. ✅ Run `npm start` to launch the application
3. ✅ Visit http://localhost:3000
4. ✅ Login with password: `lux2.0`
5. ✅ Explore the Operator Hub and customize your widgets

---

## Support & Documentation

- Original AI Studio App: https://ai.studio/apps/drive/12Cp3MzLmW0HcAGD5V5xuVodGbZyYSjJR
- Gemini API Docs: https://ai.google.dev/
- Project Repository: Check your git remotes

---

**Status:** 🟢 Production Ready
**Last Updated:** 2025-11-04
**Version:** Lux 2.0 Turbo HUD
