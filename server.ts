import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { generateSmartFallback } from './server-fallback.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK per guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Schemas for the 6 stages using Type enum from @google/genai
const stage1DiscoverSchema = {
  type: Type.OBJECT,
  properties: {
    coreProblem: {
      type: Type.STRING,
      description: 'The root human, organizational, or market pain point, stripped of corporate fluff.',
    },
    targetAudience: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: 'Specific early adopter profile' },
        characteristics: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Key behavioral characteristics, daily habits, or frustrations',
        },
        buyerVsUser: { type: Type.STRING, description: 'Important distinction between who pays vs who actually uses the product' },
      },
      required: ['primary', 'characteristics', 'buyerVsUser'],
    },
    context: {
      type: Type.STRING,
      description: 'Why now? Market shift, technological unlock, or cultural trend enabling this idea',
    },
    constraints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Critical market, technical, or psychological constraints',
    },
    underlyingValue: {
      type: Type.STRING,
      description: 'The deeper emotional or economic breakthrough when this problem is solved',
    },
    openQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING, description: 'Sharply focused adaptive interview question' },
          context: { type: Type.STRING, description: 'Why answering this directly unlocks brand clarity' },
          quickChoices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 to 3 realistic quick-tap answers',
          },
        },
        required: ['id', 'question', 'context', 'quickChoices'],
      },
      description: '2 to 3 adaptive follow-up questions to clarify strategic trade-offs',
    },
  },
  required: ['coreProblem', 'targetAudience', 'context', 'constraints', 'underlyingValue', 'openQuestions'],
};

const stage2PositionSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: 'The sharp market category created or redefined',
    },
    keyDifferentiator: {
      type: Type.STRING,
      description: 'The contrarian thesis or unfair advantage',
    },
    valueProposition: {
      type: Type.STRING,
      description: 'High-impact value proposition statement for the user',
    },
    competitiveAngle: {
      type: Type.OBJECT,
      properties: {
        statusQuo: { type: Type.STRING, description: 'What users settle for today' },
        theirWeakness: { type: Type.STRING, description: 'Where incumbents or workarounds fail' },
        ourCounterMove: { type: Type.STRING, description: 'How our brand turns their weakness into our wedge' },
      },
      required: ['statusQuo', 'theirWeakness', 'ourCounterMove'],
    },
    positioningStatement: {
      type: Type.STRING,
      description: 'Standard formula: For [target], [Product] is the [category] that [benefit], unlike [alternatives] because [differentiator].',
    },
    strategicPillars: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 strategic pillars anchoring this market position',
    },
  },
  required: ['category', 'keyDifferentiator', 'valueProposition', 'competitiveAngle', 'positioningStatement', 'strategicPillars'],
};

const stage3ShapeSchema = {
  type: Type.OBJECT,
  properties: {
    personalityTraits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trait: { type: Type.STRING, description: 'e.g. Relentlessly Pragmatic, High-Voltage Scrappy, Provocatively Honest' },
          description: { type: Type.STRING, description: 'How this trait shows up in product and interaction' },
          audienceRationale: { type: Type.STRING, description: 'Why this appeals specifically to the target audience psychology' },
        },
        required: ['trait', 'description', 'audienceRationale'],
      },
      description: '3 to 5 distinct brand personality traits',
    },
    traitsToAvoid: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 anti-traits that would ruin the brand vibe (e.g. Sterile Enterprise, Patronizing Buddy)',
    },
    namingDirections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Distinct brand name candidate' },
          type: { type: Type.STRING, description: 'Invented, Evocative, Direct, Compound, or Metaphorical' },
          rationale: { type: Type.STRING, description: 'Phonetic and conceptual rationale' },
          vibeScore: { type: Type.STRING, description: 'Atmospheric tone descriptor' },
        },
        required: ['name', 'type', 'rationale', 'vibeScore'],
      },
      description: '4 to 5 distinct naming directions',
    },
    taglineOptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 punchy, memorable taglines',
    },
    selectedTagline: {
      type: Type.STRING,
      description: 'The standout default tagline',
    },
    oneLinePitch: {
      type: Type.STRING,
      description: 'A punchy, conversational one-sentence elevator pitch',
    },
  },
  required: ['personalityTraits', 'traitsToAvoid', 'namingDirections', 'taglineOptions', 'selectedTagline', 'oneLinePitch'],
};

const stage4VisualizeSchema = {
  type: Type.OBJECT,
  properties: {
    typography: {
      type: Type.OBJECT,
      properties: {
        displayFont: { type: Type.STRING, description: 'Display font name (e.g. Syne, Space Grotesk, Instrument Serif, Cinzel, Outfit)' },
        bodyFont: { type: Type.STRING, description: 'Body font name (e.g. Plus Jakarta Sans, Inter, Roboto Mono)' },
        pairingRationale: { type: Type.STRING, description: 'Why this typographic tension reinforces the brand tone' },
        sampleHeading: { type: Type.STRING, description: 'High-impact headline showcasing font feel' },
        sampleBody: { type: Type.STRING, description: 'Sample sentence showing readable texture' },
      },
      required: ['displayFont', 'bodyFont', 'pairingRationale', 'sampleHeading', 'sampleBody'],
    },
    colorPalette: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING, description: 'Primary Brand, Secondary Supporting, Kinetic Accent, Background Base, High-Contrast Text' },
          name: { type: Type.STRING, description: 'Evocative color name (e.g. Solar Volt, Obsidian Carbon, Hyper Cobalt)' },
          hex: { type: Type.STRING, description: 'Valid 7-character hex code starting with # (e.g. #FF5500, #0F172A)' },
          psychologicalReasoning: { type: Type.STRING, description: 'The psychological trigger this color invokes' },
        },
        required: ['role', 'name', 'hex', 'psychologicalReasoning'],
      },
      description: 'A curated 5-color palette with real hex codes',
    },
    moodAndComposition: {
      type: Type.OBJECT,
      properties: {
        keywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '5 aesthetic keywords (e.g. Brutalist density, Electric neon, Raw tactile)',
        },
        layoutStyle: { type: Type.STRING, description: 'Layout structure and white-space treatment' },
        imageryStyle: { type: Type.STRING, description: 'Art direction for imagery, graphics, or renders' },
      },
      required: ['keywords', 'layoutStyle', 'imageryStyle'],
    },
    antiPatterns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 visual cliches strictly banned for this brand',
    },
  },
  required: ['typography', 'colorPalette', 'moodAndComposition', 'antiPatterns'],
};

const stage5ChallengeSchema = {
  type: Type.OBJECT,
  properties: {
    debateSummary: {
      type: Type.STRING,
      description: 'The central philosophical and commercial battleground for this brand',
    },
    clichesIdentified: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          cliche: { type: Type.STRING, description: 'Generic pattern detected in current naming/positioning' },
          whyRisky: { type: Type.STRING, description: 'How it commoditizes the company or invites cynicism' },
          remedy: { type: Type.STRING, description: 'The counter-intuitive fix to stand out' },
        },
        required: ['cliche', 'whyRisky', 'remedy'],
      },
      description: 'Lazy startup tropes detected and how to avoid them',
    },
    perspectiveStrategist: {
      type: Type.OBJECT,
      properties: {
        proponentName: { type: Type.STRING, description: 'Strategist persona (e.g. Elena Vance · Growth & Moat Architect)' },
        coreArgument: { type: Type.STRING, description: 'The bullish case for market domination' },
        opportunities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 high-leverage brand opportunities',
        },
        recommendedRefinements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Tactical positioning upgrades',
        },
      },
      required: ['proponentName', 'coreArgument', 'opportunities', 'recommendedRefinements'],
    },
    perspectiveCritic: {
      type: Type.OBJECT,
      properties: {
        criticName: { type: Type.STRING, description: 'Critic persona (e.g. Marcus Croft · Venture Skeptic & Brand Auditor)' },
        harshTruth: { type: Type.STRING, description: 'The unvarnished, uncomfortable truth founders ignore' },
        vulnerabilities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 vulnerable assumptions in current thinking',
        },
        stressTestVerdict: { type: Type.STRING, description: 'Verdict status and summary risk rating' },
      },
      required: ['criticName', 'harshTruth', 'vulnerabilities', 'stressTestVerdict'],
    },
    actionableDecisions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          topic: { type: Type.STRING, description: 'Strategic debate topic' },
          criticWarning: { type: Type.STRING, description: 'What the critic warns against' },
          strategistAdvice: { type: Type.STRING, description: 'What the strategist urges to double down on' },
          recommendedAction: { type: Type.STRING, description: 'The synthesized tactical compromise' },
        },
        required: ['id', 'topic', 'criticWarning', 'strategistAdvice', 'recommendedAction'],
      },
      description: '3 key debate topics with founder trade-offs',
    },
  },
  required: ['debateSummary', 'clichesIdentified', 'perspectiveStrategist', 'perspectiveCritic', 'actionableDecisions'],
};

const stage6DeliverSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.OBJECT,
      properties: {
        brandName: { type: Type.STRING },
        category: { type: Type.STRING },
        tagline: { type: Type.STRING },
        oneLinePitch: { type: Type.STRING },
        coreProblem: { type: Type.STRING },
        targetAudience: { type: Type.STRING },
      },
      required: ['brandName', 'category', 'tagline', 'oneLinePitch', 'coreProblem', 'targetAudience'],
    },
    brandPositioning: {
      type: Type.OBJECT,
      properties: {
        valueProposition: { type: Type.STRING },
        keyDifferentiator: { type: Type.STRING },
        contrarianBelief: { type: Type.STRING },
      },
      required: ['valueProposition', 'keyDifferentiator', 'contrarianBelief'],
    },
    brandPersonality: {
      type: Type.OBJECT,
      properties: {
        traits: { type: Type.ARRAY, items: { type: Type.STRING } },
        voiceStyle: { type: Type.STRING },
        toneGuidelines: { type: Type.STRING },
      },
      required: ['traits', 'voiceStyle', 'toneGuidelines'],
    },
    voiceInAction: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scenario: { type: Type.STRING, description: 'e.g. Viral Launch Post, Welcome Onboarding, 404 System Error, Investor Elevator Note' },
          exampleCopy: { type: Type.STRING, description: 'Direct copy written precisely in this brand voice' },
          toneNote: { type: Type.STRING, description: 'Why this copy aligns with the brand principles' },
        },
        required: ['scenario', 'exampleCopy', 'toneNote'],
      },
      description: '4 concrete sample communications in brand voice',
    },
    launchAssets: {
      type: Type.OBJECT,
      properties: {
        landingPageHeroHeadline: { type: Type.STRING },
        landingPageHeroSubhead: { type: Type.STRING },
        primaryCallToAction: { type: Type.STRING },
        twitterAnnouncement: { type: Type.STRING },
        linkedInAnnouncement: { type: Type.STRING },
      },
      required: ['landingPageHeroHeadline', 'landingPageHeroSubhead', 'primaryCallToAction', 'twitterAnnouncement', 'linkedInAnnouncement'],
    },
    consistencyAudit: {
      type: Type.OBJECT,
      properties: {
        passed: { type: Type.BOOLEAN },
        potentialFriction: { type: Type.STRING, description: 'Any slight dissonance detected between name, audience, or visual tone' },
        alignmentResolution: { type: Type.STRING, description: 'How the final system resolves the dissonance into harmony' },
      },
      required: ['passed', 'potentialFriction', 'alignmentResolution'],
    },
    readinessScore: {
      type: Type.INTEGER,
      description: 'Brand launch readiness score out of 100',
    },
  },
  required: ['executiveSummary', 'brandPositioning', 'brandPersonality', 'voiceInAction', 'launchAssets', 'consistencyAudit', 'readinessScore'],
};

// Multi-model cascade for quota resilience
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];

// Retry helper with multi-model cascade and backoff
async function executeGeminiWithRetry(options: {
  systemInstruction: string;
  prompt: string;
  responseSchema: any;
  maxRetries?: number;
}) {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    let delay = 1200;
    const maxAttemptsForModel = 2;

    for (let attempt = 1; attempt <= maxAttemptsForModel; attempt++) {
      try {
        console.log(`[Gemini Pipeline] Querying model: ${model} (attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: model,
          contents: options.prompt,
          config: {
            systemInstruction: options.systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: options.responseSchema,
            temperature: 0.7,
          },
        });

        const text = response.text;
        if (!text) {
          throw new Error('Empty response from model');
        }

        const parsed = JSON.parse(text);
        console.log(`[Gemini Pipeline] Success with model: ${model}`);
        return parsed;
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        console.warn(`[Gemini Pipeline] Model ${model} failed on attempt ${attempt}:`, msg);

        // If it's a quota / 429 error, don't waste time on this model; cascade immediately
        const isQuotaError =
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('quota') ||
          msg.includes('rate-limits');

        if (isQuotaError) {
          console.warn(`[Gemini Pipeline] Quota exhausted on ${model}, cascading to next model...`);
          break; // break attempt loop to try next model in CANDIDATE_MODELS
        }

        if (attempt < maxAttemptsForModel) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }
  }

  throw lastError || new Error('All candidate Gemini models failed.');
}

// Smart dynamic fallback is imported from server-fallback.js

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Stage 1: DISCOVER
app.post('/api/pipeline/stage1-discover', async (req, res) => {
  try {
    const { rawIdea } = req.body;
    if (!rawIdea || typeof rawIdea !== 'string' || !rawIdea.trim()) {
      return res.status(400).json({ error: 'rawIdea is required' });
    }

    const systemInstruction = `You are an elite Silicon Valley brand strategist, venture scout, and product anthropologist. 
Your objective is to dissect a raw startup idea, peel back the obvious layers, and expose the underlying human tension, economic urgency, and hidden constraints.
Formulate 2 to 3 sharply focused, provocative adaptive follow-up questions that challenge the founder to clarify essential strategic trade-offs.
Return strict, valid JSON adhering to the provided schema. No markdown formatting, no conversational preamble.`;

    const prompt = `Analyze this raw startup / product idea:
"${rawIdea.trim()}"

Deconstruct:
1. The root core problem (no corporate jargon).
2. The specific target audience (primary early adopters, behavioral traits, buyer vs user dynamics).
3. Why now context (market or tech trend).
4. Critical constraints (friction, behavioral bottlenecks).
5. The underlying emotional/economic payoff.
6. 2-3 adaptive follow-up interview questions with 2-3 realistic quickChoices each to help steer the brand.`;

    try {
      const data = await executeGeminiWithRetry({
        systemInstruction,
        prompt,
        responseSchema: stage1DiscoverSchema,
      });
      return res.json({ success: true, data });
    } catch (geminiError: any) {
      console.warn('Gemini call failed, using smart fallback for Stage 1:', geminiError?.message);
      const fallback = generateSmartFallback(1, { rawIdea });
      return res.json({ success: true, data: fallback, isFallback: !apiKey });
    }
  } catch (error: any) {
    console.error('Stage 1 Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process Stage 1 Discover' });
  }
});

// Stage 2: POSITION
app.post('/api/pipeline/stage2-position', async (req, res) => {
  try {
    const { rawIdea, stage1Data, userAnswers } = req.body;
    if (!stage1Data) {
      return res.status(400).json({ error: 'stage1Data is required' });
    }

    const systemInstruction = `You are a world-renowned product positioning authority in the tradition of April Dunford and Al Ries.
Your task is to take the Stage 1 discovery insights and user-clarified trade-offs, and carve out an undeniable market category, a defensible competitive wedge, and a crisp value proposition.
Avoid cliches like "all-in-one platform", "seamless experience", or "the Uber for X".
Return strict, valid JSON adhering to the provided schema.`;

    const prompt = `Foundational context from Stage 1:
- Raw Idea: "${rawIdea || ''}"
- Core Problem: ${stage1Data.coreProblem}
- Target Audience: ${JSON.stringify(stage1Data.targetAudience)}
- Context / Why Now: ${stage1Data.context}
- Constraints: ${JSON.stringify(stage1Data.constraints)}
- User Answers / Steering: ${JSON.stringify(userAnswers || {})}

Formulate the strategic positioning:
1. Category: Distinct, sharp market category.
2. Key Differentiator: The unfair advantage or contrarian wedge.
3. Value Proposition: Quantifiable, concrete outcome for the user.
4. Competitive Angle: Contrast with the status quo, incumbent weaknesses, and our brand counter-move.
5. Positioning Statement: Classic formulaic structure.
6. 3 Strategic Pillars.`;

    try {
      const data = await executeGeminiWithRetry({
        systemInstruction,
        prompt,
        responseSchema: stage2PositionSchema,
      });
      return res.json({ success: true, data });
    } catch (geminiError: any) {
      console.warn('Gemini call failed, using smart fallback for Stage 2:', geminiError?.message);
      const fallback = generateSmartFallback(2, { rawIdea, stage1Data });
      return res.json({ success: true, data: fallback, isFallback: !apiKey });
    }
  } catch (error: any) {
    console.error('Stage 2 Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process Stage 2 Position' });
  }
});

// Stage 3: SHAPE
app.post('/api/pipeline/stage3-shape', async (req, res) => {
  try {
    const { rawIdea, stage1Data, stage2Data, userSteering } = req.body;
    if (!stage1Data || !stage2Data) {
      return res.status(400).json({ error: 'stage1Data and stage2Data are required' });
    }

    const systemInstruction = `You are an elite naming director and brand archetype architect at a premier brand studio.
Using the problem, audience, and market positioning from Stages 1 and 2, define the brand's psychological personality and invent 4-5 memorable, phonetically compelling naming directions with taglines.
Do not invent generic .io syllable mush (like "Teamly" or "Collabio"). Craft names with real cultural resonance, lexical punch, and emotional weight.
Return strict, valid JSON adhering to the provided schema.`;

    const prompt = `Strategic context:
- Raw Idea: "${rawIdea || ''}"
- Problem & Audience: ${stage1Data.coreProblem} | Target: ${stage1Data.targetAudience?.primary}
- Category & Position: ${stage2Data.category} | Differentiator: ${stage2Data.keyDifferentiator}
- Positioning Statement: ${stage2Data.positioningStatement}
- User Feedback / Steering: ${JSON.stringify(userSteering || {})}

Generate:
1. 3-5 distinct Brand Personality Traits with descriptions and audience rationales.
2. 3 Traits to Avoid (anti-personas).
3. 4-5 Naming Directions across types (Compound, Evocative, Direct, Metaphorical, Invented).
4. 3 Tagline Options + one standout selectedTagline.
5. A high-voltage oneLinePitch.`;

    try {
      const data = await executeGeminiWithRetry({
        systemInstruction,
        prompt,
        responseSchema: stage3ShapeSchema,
      });
      return res.json({ success: true, data });
    } catch (geminiError: any) {
      console.warn('Gemini call failed, using smart fallback for Stage 3:', geminiError?.message);
      const fallback = generateSmartFallback(3, { rawIdea, stage1Data, stage2Data });
      return res.json({ success: true, data: fallback, isFallback: !apiKey });
    }
  } catch (error: any) {
    console.error('Stage 3 Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process Stage 3 Shape' });
  }
});

// Stage 4: VISUALIZE
app.post('/api/pipeline/stage4-visualize', async (req, res) => {
  try {
    const { rawIdea, stage1Data, stage2Data, stage3Data, selectedName } = req.body;
    if (!stage1Data || !stage2Data || !stage3Data) {
      return res.status(400).json({ error: 'Stages 1-3 data are required' });
    }

    const systemInstruction = `You are a visionary Design Director at a top-tier brand identity consultancy (Pentagram, Collins, Instrument).
Your goal is to define an authentic, tactile visual design system rooted in the brand's personality and positioning.
Provide exact valid 6-digit hex color codes with explicit emotional rationales.
Pair complementary typography fonts (display + body) that are available on Google Fonts (e.g. Syne, Space Grotesk, Instrument Serif, Cinzel, Plus Jakarta Sans, Inter).
Define a distinct visual atmosphere and strictly ban design cliches (e.g. generic purple SaaS gradient blobs).
Return strict, valid JSON adhering to the provided schema.`;

    const prompt = `Brand Context:
- Brand Name: "${selectedName || stage3Data.namingDirections?.[0]?.name || 'Brand'}"
- Tagline: "${stage3Data.selectedTagline}"
- Category: ${stage2Data.category}
- Audience: ${stage1Data.targetAudience?.primary}
- Personality: ${stage3Data.personalityTraits?.map((t: any) => t.trait).join(', ')}
- Traits to Avoid: ${stage3Data.traitsToAvoid?.join(', ')}

Create the Visual Design Brief:
1. Typography direction (display font + body font, pairing rationale, sample headline & body).
2. A 5-color palette with exact hex codes (Primary Brand, Secondary Supporting, Kinetic Accent, Background Base, High-Contrast Text).
3. Mood, layout style, and imagery guidelines.
4. 3 banned visual anti-patterns.`;

    try {
      const data = await executeGeminiWithRetry({
        systemInstruction,
        prompt,
        responseSchema: stage4VisualizeSchema,
      });
      return res.json({ success: true, data });
    } catch (geminiError: any) {
      console.warn('Gemini call failed, using smart fallback for Stage 4:', geminiError?.message);
      const fallback = generateSmartFallback(4, { rawIdea, stage1Data, stage2Data, stage3Data });
      return res.json({ success: true, data: fallback, isFallback: !apiKey });
    }
  } catch (error: any) {
    console.error('Stage 4 Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process Stage 4 Visualize' });
  }
});

// Stage 5: CHALLENGE
app.post('/api/pipeline/stage5-challenge', async (req, res) => {
  try {
    const { rawIdea, stage1Data, stage2Data, stage3Data, stage4Data, selectedName } = req.body;
    if (!stage1Data || !stage2Data || !stage3Data || !stage4Data) {
      return res.status(400).json({ error: 'Stages 1-4 data are required' });
    }

    const systemInstruction = `You are staging a high-level strategic stress-test between two formidable brand minds:
1. The Strategist (proposes bold expansion, defensible moats, and growth leverage).
2. The Critic (ruthlessly dissects startup cliches, exposes weak assumptions, and anticipates market cynicism).
Showcase their debate openly and identify common startup cliches in the brand's trajectory. Formulate 2-3 actionable trade-off decisions for the founder to decide.
Return strict, valid JSON adhering to the provided schema.`;

    const prompt = `Synthesize and challenge the current brand architecture:
- Selected Name: "${selectedName || stage3Data.namingDirections?.[0]?.name}"
- Tagline: "${stage3Data.selectedTagline}"
- Problem: ${stage1Data.coreProblem}
- Category & Differentiation: ${stage2Data.category} | ${stage2Data.keyDifferentiator}
- Target Audience: ${stage1Data.targetAudience?.primary}
- Visual Direction: ${stage4Data.typography?.displayFont} / ${stage4Data.colorPalette?.map((c: any) => c.name).join(', ')}

Conduct the Challenge:
1. Uncover startup tropes & cliches in this concept and how to transcend them.
2. Strategist perspective: Bullish thesis, 3 high-upside opportunities, recommended tweaks.
3. Critic perspective: Unvarnished reality check, 3 core failure vulnerabilities, risk verdict.
4. Actionable Decisions: 2-3 specific strategic trade-offs for the founder to steer.`;

    try {
      const data = await executeGeminiWithRetry({
        systemInstruction,
        prompt,
        responseSchema: stage5ChallengeSchema,
      });
      return res.json({ success: true, data });
    } catch (geminiError: any) {
      console.warn('Gemini call failed, using smart fallback for Stage 5:', geminiError?.message);
      const fallback = generateSmartFallback(5, { rawIdea, stage1Data, stage2Data, stage3Data, stage4Data });
      return res.json({ success: true, data: fallback, isFallback: !apiKey });
    }
  } catch (error: any) {
    console.error('Stage 5 Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process Stage 5 Challenge' });
  }
});

// Stage 6: DELIVER
app.post('/api/pipeline/stage6-deliver', async (req, res) => {
  try {
    const { rawIdea, stage1Data, stage2Data, stage3Data, stage4Data, stage5Data, selectedName, selectedDecisions } = req.body;
    if (!stage1Data || !stage2Data || !stage3Data || !stage4Data || !stage5Data) {
      return res.status(400).json({ error: 'All previous stages data are required' });
    }

    const systemInstruction = `You are the Chief Brand Officer finalizing the comprehensive Brand Intelligence Playbook and Brand Kit.
Synthesize all prior decisions, the visual direction, and the resolved debate tensions into an executive-grade deliverable.
Include authentic voice-in-action copy examples for realistic scenarios (product launch, error state, pitch intro), complete launch headlines, and an internal consistency audit.
Return strict, valid JSON adhering to the provided schema.`;

    const chosenName = selectedName || stage3Data.namingDirections?.[0]?.name || 'Brandix';
    const prompt = `Synthesize the complete Brand Kit for:
- Brand Name: "${chosenName}"
- Raw Idea: "${rawIdea || ''}"
- Problem & Audience: ${stage1Data.coreProblem} | ${stage1Data.targetAudience?.primary}
- Category & Differentiation: ${stage2Data.category} | ${stage2Data.keyDifferentiator}
- Personality: ${stage3Data.personalityTraits?.map((t: any) => t.trait).join(', ')}
- Visual Identity: ${stage4Data.typography?.displayFont} / Palette: ${stage4Data.colorPalette?.map((c: any) => c.hex).join(', ')}
- Debate Decisions Adopted: ${JSON.stringify(selectedDecisions || {})}

Deliver:
1. Executive Summary & Brand Positioning.
2. Personality & Voice guidelines.
3. Voice in Action: 4 concrete copy examples across scenarios (Launch post, Investor pitch, 404 error, Push/Notification).
4. Launch Assets (Hero headline, subhead, CTA, Twitter post, LinkedIn post).
5. Brand Consistency Audit (check for any friction between visual, voice, and name, and how it is resolved).
6. Launch Readiness Score (out of 100).`;

    try {
      const data = await executeGeminiWithRetry({
        systemInstruction,
        prompt,
        responseSchema: stage6DeliverSchema,
      });
      return res.json({ success: true, data });
    } catch (geminiError: any) {
      console.warn('Gemini call failed, using smart fallback for Stage 6:', geminiError?.message);
      const fallback = generateSmartFallback(6, { rawIdea, brandName: chosenName, stage1Data, stage2Data, stage3Data, stage4Data, stage5Data });
      return res.json({ success: true, data: fallback, isFallback: !apiKey });
    }
  } catch (error: any) {
    console.error('Stage 6 Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process Stage 6 Deliver' });
  }
});

// Start Server & Vite Integration
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Brandix Server] running on http://0.0.0.0:${PORT} (Gemini AI Key: ${apiKey ? 'Configured' : 'Fallback Ready'})`);
  });
}

startServer().catch((err) => {
  console.error('[Brandix Server] Fatal startup error:', err);
  process.exit(1);
});
