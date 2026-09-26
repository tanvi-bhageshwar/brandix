import React, { useEffect, useState } from 'react';
import { Cpu, Clock } from 'lucide-react';
import { PipelineStage, AppTheme } from '../types/brandix';

interface ContextualThinkingProps {
  targetStage: PipelineStage;
  stageName: string;
  theme?: AppTheme;
}

const STAGE_REASONING_STEPS: Record<PipelineStage, string[]> = {
  1: [
    'Deconstructing raw startup idea into foundational components...',
    'Isolating primary early-adopter friction and buyer vs. user dynamics...',
    'Synthesizing macroeconomic context and why-now triggers...',
    'Formulating adaptive interview questions to probe hidden trade-offs...',
    'Validating structured JSON against discovery schema...',
  ],
  2: [
    'Absorbing Stage 1 discovery findings and user input...',
    'Scouting adjacent market categories to carve a differentiated niche...',
    'Analyzing incumbent weaknesses and status-quo traps...',
    'Formulating defensible positioning statement and strategic pillars...',
    'Locking competitive wedge into structured schema...',
  ],
  3: [
    'Infusing positioning foundation into brand archetypes...',
    'Calibrating personality traits against user audience psychology...',
    'Synthesizing phonetics, metaphors, and high-recall naming directions...',
    'Crafting high-voltage taglines and one-line elevator hook...',
    'Enforcing strict brand identity constraints...',
  ],
  4: [
    'Translating brand personality into typographic hierarchy...',
    'Selecting Google Fonts pairing with complementary display & body tension...',
    'Synthesizing harmonious 5-color palette with exact hex codes...',
    'Drafting mood composition and banning visual design cliches...',
    'Rendering visual identity preview assets...',
  ],
  5: [
    'Assembling strategic debaters: Growth Strategist vs. Risk Critic...',
    'Scanning identity output for common startup clichés and buzzwords...',
    'Critic running stress-tests against user churn and market cynicism...',
    'Strategist uncovering asymmetric upside opportunities...',
    'Formulating 3 actionable decisions for founder resolution...',
  ],
  6: [
    'Compiling definitive Brand Intelligence Kit from all 5 prior stages...',
    'Drafting real voice-in-action communications across realistic scenarios...',
    'Formulating launch headlines, social announcement copy, and CTAs...',
    'Running cross-stage consistency audit (voice, visuals, positioning)...',
    'Calculating launch readiness score and finalizing brand book...',
  ],
};

export const ContextualThinking: React.FC<ContextualThinkingProps> = ({
  targetStage,
  stageName,
  theme = 'midnight',
}) => {
  const steps = STAGE_REASONING_STEPS[targetStage] || STAGE_REASONING_STEPS[1];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const isPaper = theme === 'paper';

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2400);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 text-center">
      <div
        className={`border rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-colors duration-200 ${
          isPaper
            ? 'bg-white border-[#E4DFD5] text-slate-800 shadow-xl'
            : 'bg-slate-900/80 border-slate-800 text-slate-100'
        }`}
      >
        {/* Subtle ambient lighting */}
        <div
          className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isPaper ? 'bg-amber-500/10' : 'bg-amber-500/10'
          }`}
        />
        <div
          className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isPaper ? 'bg-emerald-500/10' : 'bg-emerald-500/10'
          }`}
        />

        {/* Animated Icon Ring */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center relative z-10 animate-pulse ${
              isPaper
                ? 'bg-amber-100 border-amber-300 text-amber-700'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <Cpu className="w-8 h-8" />
          </div>
          <div className="absolute -inset-2 rounded-2xl border border-amber-500/20 animate-ping opacity-25" />
        </div>

        {/* Stage Title */}
        <div
          className={`text-xs uppercase font-mono tracking-widest mb-2 font-semibold ${
            isPaper ? 'text-amber-800' : 'text-amber-400'
          }`}
        >
          Stage 0{targetStage} Reasoning Pipeline
        </div>
        <h3
          className={`font-display text-2xl font-bold mb-2 ${
            isPaper ? 'text-slate-950' : 'text-white'
          }`}
        >
          Synthesizing {stageName}
        </h3>
        <p
          className={`text-sm max-w-md mx-auto mb-8 ${
            isPaper ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          Gemini 3.8 Flash is reasoning sequentially, enforcing JSON schemas and propagating upstream context.
        </p>

        {/* Active Reasoning Step with live ticker */}
        <div
          className={`border rounded-xl p-4 text-left mb-6 font-mono text-xs ${
            isPaper
              ? 'bg-[#FAF8F3] border-[#DDD7CB] text-slate-800'
              : 'bg-slate-950/80 border-slate-800/80 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2 text-[11px]">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className={isPaper ? 'text-amber-900 font-bold' : 'text-amber-300 font-semibold'}>
                Active AI Thought
              </span>
            </span>
            <span className={`flex items-center space-x-1 ${isPaper ? 'text-slate-500' : 'text-slate-500'}`}>
              <Clock className="w-3 h-3" />
              <span>{secondsElapsed}s elapsed</span>
            </span>
          </div>

          <div
            className={`min-h-[40px] flex items-center transition-all duration-300 ${
              isPaper ? 'text-slate-900 font-medium' : 'text-slate-200'
            }`}
          >
            {steps[currentStepIndex]}
          </div>

          {/* Micro Progress Bar */}
          <div
            className={`w-full h-1.5 rounded-full overflow-hidden mt-3 ${
              isPaper ? 'bg-slate-200' : 'bg-slate-800/80'
            }`}
          >
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min(95, ((currentStepIndex + 1) / steps.length) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Sub-steps preview list */}
        <div className="space-y-1.5 text-left max-w-md mx-auto text-xs">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-2 transition-colors ${
                idx < currentStepIndex
                  ? isPaper
                    ? 'text-emerald-700 font-medium'
                    : 'text-emerald-400/70'
                  : idx === currentStepIndex
                  ? isPaper
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-300 font-medium'
                  : isPaper
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-[10px] font-mono">
                {idx < currentStepIndex ? '✓' : idx === currentStepIndex ? '›' : '·'}
              </span>
              <span className="truncate">{step}</span>
            </div>
          ))}
        </div>

        {secondsElapsed > 12 && (
          <div
            className={`mt-6 text-xs rounded-lg p-2.5 border ${
              isPaper
                ? 'text-amber-900 bg-amber-50 border-amber-300'
                : 'text-amber-300/80 bg-amber-500/10 border-amber-500/20'
            }`}
          >
            Taking a moment to craft depth and verify schema integrity. Still running...
          </div>
        )}
      </div>
    </div>
  );
};
