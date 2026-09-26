# Brandix · AI Brand Intelligence Platform

> A multi-stage AI reasoning pipeline that transforms raw startup ideas into complete, highly differentiated brand identities, strategic positioning, visual design systems, and exportable brand specifications.

---

## 🌟 Overview

**Brandix** is a full-stack, enterprise-grade brand architecture engine. Instead of generating surface-level marketing cliches, Brandix guides founders and product teams through a rigorous **6-stage brand strategy methodology** powered by Google Gemini and real-time reasoning models.

From extracting user tensions and defining contrarian strategic wedges to generating voice-in-action scenarios, live interactive visual tokens, stress-testing against VC critiques, and producing high-resolution **Brand Books (.pdf & .json)**, Brandix operates as an automated fractional Chief Brand Officer.

---

## 🚀 Key Features & Pipeline Stages

Brandix organizes brand creation into six sequential, verifiable stages:

```
[ Stage 1: Discover ] ──▶ [ Stage 2: Position ] ──▶ [ Stage 3: Shape ]
          │                         │                        │
          ▼                         ▼                        ▼
[ Stage 4: Visualize ] ──▶ [ Stage 5: Challenge ] ──▶ [ Stage 6: Deliver ]
```

### 1. Stage 1 — Discover & Deconstruct
- **Root Problem Extraction**: Unpacks the core friction, emotional drag, and systemic inertia behind the startup idea.
- **Audience Archetypes**: Differentiates daily users from economic buyers and maps behavioral characteristics.
- **Strategic Calibration**: Generates contextual inquiry prompts with instant quick-choice chips to fine-tune product direction before positioning.

### 2. Stage 2 — Strategic Positioning
- **Category Definition**: Positions the startup into a defensible, modern market category.
- **Wedge & Differentiator**: Defines the 10x unfair advantage and competitive counter-move against incumbents.
- **Positioning Statement & Strategic Pillars**: Produces clear, actionable strategic pillars.

### 3. Stage 3 — Shape Brand Voice & Naming
- **Naming Directions**: Generates distinct naming candidates across five linguistic archetypes (Compound, Evocative, Direct, Metaphorical, Invented) with rationale and vibe scores.
- **Personality Pillars**: Defines three high-signal traits, guidelines on traits to avoid, and punchy taglines.
- **Real-Time Interactive Selection**: Choose or customize names and taglines seamlessly across the pipeline.

### 4. Stage 4 — Visualize & Design Tokens
- **Curated Typography Pairings**: High-contrast editorial display fonts paired with ergonomic UI body typefaces (Syne, Plus Jakarta Sans, Space Grotesk, Instrument Serif, Cinzel, Inter).
- **Harmonized Color Palettes**: Semantic tokens (Primary, Kinetic Accent, Supporting, Surface Base, Text) with psychological rationale.
- **Interactive Component Playground**: Live preview card with active CTAs and one-click hex copying.

### 5. Stage 5 — Challenge & Stress-Test (Debate Arena)
- **Cliche Detection**: Audits the brand against overused startup tropes and provides concrete remedies.
- **Dual Perspective Arena**:
  - **Growth & Moat Architect**: Identifies category expansion opportunities, pricing power, and strategic wedges.
  - **Venture Skeptic & Brand Auditor**: Highlights switching friction, incumbent copycats, and harsh positioning vulnerabilities.
- **Strategic Decision Matrix**: Actionable tradeoffs and consensus resolutions.

### 6. Stage 6 — Deliver & Launch Kit
- **Executive Brand Specification**: Complete summary ready for stakeholders and investors.
- **Voice in Action**: Real-world copy scenarios (Product Launch, Investor Brief, Welcome Onboarding, System Alert).
- **Ready-to-Use Launch Copy**: Landing page hero headline, subhead, primary CTA, Twitter/X launch announcement, and LinkedIn founder note.
- **Comprehensive Export Suite**:
  - 📄 **Export Brand Book (.pdf)**: Publication-ready, multi-page vector PDF built with `jspdf` containing swatches, typography, scenarios, and audit metrics.
  - 💾 **Export Brand Kit (.json)**: Machine-readable specification for engineering, design systems, and design tokens.
  - 📋 **Copy Markdown**: One-click full-documentation clipboard copy.
  - 🖨️ **Print View**: Clean print stylesheet for direct archiving.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom font pairings and dynamic theme system (Dark Titanium & Archival Paper modes)
- **Icons & Motion**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) (Client-side vector document compiler)
- **Backend & Middleware**: [Express](https://expressjs.com/), [TSX](https://github.com/privatenumber/tsx)
- **AI Engine**: [@google/genai SDK](https://www.npmjs.com/package/@google/genai) with multi-model cascade (`gemini-2.5-flash`, `gemini-flash-latest`, `gemini-3.1-flash-lite`, `gemini-3.8-flash`) and semantic offline fallback generator

---

## 📁 Project Structure

```plaintext
├── server.ts                  # Express backend proxy with Gemini API cascade & endpoints
├── server-fallback.ts         # High-fidelity semantic offline fallback generator
├── index.html                 # App entry point with curated Google Font CDN links
├── metadata.json              # Studio project metadata and model permissions
├── package.json               # Dependencies and build scripts
├── src/
│   ├── main.tsx               # Client React DOM entry point
│   ├── App.tsx                # Main pipeline orchestrator, state management, & theme provider
│   ├── index.css              # Tailwind CSS styles and font classes
│   ├── components/
│   │   ├── Header.tsx         # Brand header, theme toggle (Dark / Paper), & reset workflow
│   │   ├── PipelineTracker.tsx# Interactive 6-stage navigation progress bar
│   │   ├── ContextualThinking.tsx # Real-time AI thinking indicator & reasoning viewer
│   │   └── stages/
│   │       ├── Stage1Discover.tsx   # Discovery, problem extraction, & audience analysis
│   │       ├── Stage2Position.tsx   # Strategic category, wedge, & positioning pillars
│   │       ├── Stage3Shape.tsx      # Naming matrix, personality traits, & tagline selection
│   │       ├── Stage4Visualize.tsx  # Typography, color tokens, & live interactive preview
│   │       ├── Stage5Challenge.tsx  # Critic vs. Strategist debate & cliche auditing
│   │       └── Stage6Deliver.tsx    # Brand Book hero, launch kit, & export suite
│   ├── services/
│   │   └── api.ts             # Strongly typed API client communicating with backend proxy
│   ├── types/
│   │   └── brandix.ts         # TypeScript interfaces and stage schemas
│   └── utils/
│       └── pdfGenerator.ts    # Multi-page PDF Brand Book generator
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm**
- **Gemini API Key** (Optional for local testing; the app includes a dynamic semantic fallback engine, but a key is recommended for real-time AI reasoning)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/brandix.git
   cd brandix
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 📦 Production Build & Scripts

- `npm run dev` — Starts the Express backend + Vite middleware development server
- `npm run build` — Compiles the TypeScript codebase and builds optimized Vite client assets
- `npm run start` — Runs the production Node/Express server via TSX
- `npm run lint` — Validates TypeScript types across the entire project (`tsc --noEmit`)
- `npm run clean` — Removes built artifacts and temporary build outputs

---

## 🎨 Design Philosophy

- **Zero-AI Slop**: Uses concrete domain language, direct evidence, and structured arguments rather than empty buzzwords.
- **Dual Aesthetic Themes**:
  - **Dark Titanium**: High-contrast, focused workstation interface with obsidian surfaces, amber accents, and clean borders.
  - **Archival Paper**: Warm, tactile editorial look reminiscent of printed brand manuals and physical publications.
- **Resilient AI Cascade**: Automatically handles model quotas and rate limits using a fallback chain, guaranteeing smooth turnarounds under all conditions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
