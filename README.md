# ContentBridge AI (Part 1)
> **Fact-Anchored Social Media Content Engine**

ContentBridge AI transforms long-form source documents (clinical research, whitepapers, executive transcripts, blog posts) into platform-specific social media content while preserving factual accuracy and allowing every major claim to be traced back to the original source.

---

## 🚀 Key Features Implemented (Part 1 MVP)

### 1. Multi-Step Creation Studio
- **Step A: Source Ingestion**:
  - Drag-and-drop `.txt` / `.md` file upload with live preview.
  - Long-form rich text editor with real-time word count, character count, and estimated reading time.
  - Instant 1-click **Demo Sample Loaders** (Clinical AI Benchmark, SaaS PLG Playbook, Clean Energy Grid).
  - Robust input validation and error feedback.
- **Step B: Deep Source Analysis**:
  - Automated structured knowledge extraction: Core Topic, Executive Summary, Key Ideas, Factual Claims, Statistics & Numbers, Named Entities, Key Quotations, Intended Audience, Original Tone, and Primary Purpose.
- **Step C: Brand Voice & Platform Selection**:
  - Preset and custom brand voice profiles with 5 tone selectors (`Professional`, `Friendly`, `Educational`, `Bold`, `Conversational`).
  - Target audience specification and banned buzzword filters (e.g. *synergy*, *delve*, *game-changer*).
  - Multi-channel selection: **LinkedIn Post**, **X (Twitter) Thread**, **Instagram Carousel**, and **Short-Video Script**.
- **Step D: Generated Content Workspace**:
  - Dedicated platform cards with channel formatting (hooks, numbered tweets, slide storyboards, visual/audio cues).
  - Character and word count metrics with platform limits.
  - Inline editing with live save & cancel.
  - **Single Platform Regeneration**: Regenerate any single channel output with custom prompts without altering other channels.
  - **Fact Traceability**: Collapsible evidence drawers displaying source context and confidence scores.
  - Full project bundle export to Markdown.

### 2. Executive Dashboard & Project Management
- Interactive KPI cards: Total projects, generated pieces, verified claims, supported channels.
- Visual 5-stage workflow pipeline overview.
- Saved projects library with keyword search, source type filtering, reopening directly into Studio, and deletion.

### 3. Verification & Evidence Center
- Fact-check consistency metrics.
- Interactive Claim Tracer to test auditing any claim against source context.

### 4. Brand Voice Manager & Settings
- CRUD brand persona profiles.
- Server-side LLM provider status (OpenAI, Gemini, or Demo Mode).
- JSON backup export and local storage reset.

### 5. AI Service Abstraction & Realistic Demo Engine
- Clean service layer in `src/lib/ai/service.ts` supporting OpenAI and Gemini.
- Intelligent **Demo Simulation Engine** (`src/lib/ai/demo-engine.ts`) that produces rich, realistic, context-aware content and extracted claims immediately out-of-the-box without requiring API keys.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Custom Dark Navy SaaS Theme)
- **Icons**: Lucide React
- **Persistence**: LocalStorage with automatic schema management

---

## 💻 Commands to Run

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build Production Bundle
```bash
npm run build
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory (optional - works out-of-the-box in Demo Mode):

```env
# Provider: 'demo' | 'openai' | 'gemini'
AI_PROVIDER=demo

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini

# Google Gemini (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
```
