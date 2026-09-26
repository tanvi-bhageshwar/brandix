import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Layers, Cpu, ShieldCheck, Zap, AlertCircle, RefreshCw, Compass, HelpCircle, Palette, Flame, BookOpen } from 'lucide-react';
import { Header } from './components/Header';
import { PipelineTracker } from './components/PipelineTracker';
import { ContextualThinking } from './components/ContextualThinking';
import { Stage1Discover } from './components/stages/Stage1Discover';
import { Stage2Position } from './components/stages/Stage2Position';
import { Stage3Shape } from './components/stages/Stage3Shape';
import { Stage4Visualize } from './components/stages/Stage4Visualize';
import { Stage5Challenge } from './components/stages/Stage5Challenge';
import { Stage6Deliver } from './components/stages/Stage6Deliver';
import {
  PipelineStage,
  Stage1DiscoverData,
  Stage2PositionData,
  Stage3ShapeData,
  Stage4VisualizeData,
  Stage5ChallengeData,
  Stage6DeliverData,
  AppTheme,
} from './types/brandix';
import { api } from './services/api';

const SAMPLE_IDEAS = [
  'I want an app that helps students find teammates for hackathons',
  'An AI financial risk co-pilot for freelance motion designers and creators',
  'A collaborative 3D schematic workspace for remote hardware engineering teams',
  'An autonomous micro-grant network for open-source framework maintainers',
];

const STAGE_NAMES: Record<PipelineStage, string> = {
  1: 'Discovery & Interview',
  2: 'Strategic Positioning',
  3: 'Brand Shape & Naming',
  4: 'Visual System & Palette',
  5: 'Strategic Stress-Test Debate',
  6: 'Definitive Brand Kit',
};

const STORAGE_KEY = 'brandix_active_session_v1';
const THEME_STORAGE_KEY = 'brandix_active_theme_v1';

export default function App() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'paper' || saved === 'midnight') return saved;
    } catch {}
    return 'midnight';
  });

  const [rawIdea, setRawIdea] = useState('');
  const [currentStage, setCurrentStage] = useState<PipelineStage>(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [targetLoadingStage, setTargetLoadingStage] = useState<PipelineStage>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stage Data States
  const [stage1Data, setStage1Data] = useState<Stage1DiscoverData | null>(null);
  const [stage2Data, setStage2Data] = useState<Stage2PositionData | null>(null);
  const [stage3Data, setStage3Data] = useState<Stage3ShapeData | null>(null);
  const [stage4Data, setStage4Data] = useState<Stage4VisualizeData | null>(null);
  const [stage5Data, setStage5Data] = useState<Stage5ChallengeData | null>(null);
  const [stage6Data, setStage6Data] = useState<Stage6DeliverData | null>(null);

  // User Steering Choices
  const [userInterviewAnswers, setUserInterviewAnswers] = useState<Record<string, string>>({});
  const [selectedBrandName, setSelectedBrandName] = useState<string>('');
  const [selectedTagline, setSelectedTagline] = useState<string>('');
  const [selectedDecisions, setSelectedDecisions] = useState<Record<string, string>>({});

  // Restore session from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rawIdea) setRawIdea(parsed.rawIdea);
        if (parsed.currentStage) setCurrentStage(parsed.currentStage);
        if (parsed.completedStages) setCompletedStages(parsed.completedStages);
        if (parsed.stage1Data) setStage1Data(parsed.stage1Data);
        if (parsed.stage2Data) setStage2Data(parsed.stage2Data);
        if (parsed.stage3Data) setStage3Data(parsed.stage3Data);
        if (parsed.stage4Data) setStage4Data(parsed.stage4Data);
        if (parsed.stage5Data) setStage5Data(parsed.stage5Data);
        if (parsed.stage6Data) setStage6Data(parsed.stage6Data);
        if (parsed.selectedBrandName) setSelectedBrandName(parsed.selectedBrandName);
        if (parsed.selectedTagline) setSelectedTagline(parsed.selectedTagline);
        if (parsed.userInterviewAnswers) setUserInterviewAnswers(parsed.userInterviewAnswers);
        if (parsed.selectedDecisions) setSelectedDecisions(parsed.selectedDecisions);
      }
    } catch (e) {
      console.warn('Failed to parse cached session', e);
    }
  }, []);

  // Save session to localStorage
  useEffect(() => {
    if (stage1Data) {
      const session = {
        rawIdea,
        currentStage,
        completedStages,
        stage1Data,
        stage2Data,
        stage3Data,
        stage4Data,
        stage5Data,
        stage6Data,
        selectedBrandName,
        selectedTagline,
        userInterviewAnswers,
        selectedDecisions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [
    rawIdea,
    currentStage,
    completedStages,
    stage1Data,
    stage2Data,
    stage3Data,
    stage4Data,
    stage5Data,
    stage6Data,
    selectedBrandName,
    selectedTagline,
    userInterviewAnswers,
    selectedDecisions,
  ]);

  // Sync theme with document.body and html classes
  useEffect(() => {
    if (theme === 'paper') {
      document.body.className = 'theme-paper antialiased min-h-screen';
      document.documentElement.className = 'theme-paper';
    } else {
      document.body.className = 'theme-midnight antialiased min-h-screen';
      document.documentElement.className = 'theme-midnight';
    }
  }, [theme]);

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear cached session', e);
    }
    setRawIdea('');
    setCurrentStage(1);
    setCompletedStages([]);
    setStage1Data(null);
    setStage2Data(null);
    setStage3Data(null);
    setStage4Data(null);
    setStage5Data(null);
    setStage6Data(null);
    setSelectedBrandName('');
    setSelectedTagline('');
    setUserInterviewAnswers({});
    setSelectedDecisions({});
    setErrorMessage(null);
  };

  // Launch Pipeline: Stage 1 (Discover)
  const handleStartPipeline = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rawIdea.trim()) return;

    setErrorMessage(null);
    setIsLoading(true);
    setTargetLoadingStage(1);

    try {
      const data = await api.runStage1Discover(rawIdea.trim());
      setStage1Data(data);
      setCurrentStage(1);
      setCompletedStages([]);
    } catch (err: any) {
      console.error('Stage 1 pipeline error:', err);
      setErrorMessage(err.message || 'Failed to complete Stage 1 Discover. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 1 -> Stage 2 (Position)
  const handleProceedToStage2 = async (
    answers: Record<string, string>,
    updatedStage1Data: Stage1DiscoverData
  ) => {
    setErrorMessage(null);
    setUserInterviewAnswers(answers);
    setStage1Data(updatedStage1Data);
    setIsLoading(true);
    setTargetLoadingStage(2);

    try {
      const data = await api.runStage2Position({
        rawIdea: rawIdea.trim(),
        stage1Data: updatedStage1Data,
        userAnswers: answers,
      });
      setStage2Data(data);
      setCompletedStages((prev) => Array.from(new Set([...prev, 1])));
      setCurrentStage(2);
    } catch (err: any) {
      console.error('Stage 2 pipeline error:', err);
      setErrorMessage(err.message || 'Failed to complete Stage 2 Position. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 2 -> Stage 3 (Shape)
  const handleProceedToStage3 = async (updatedStage2Data: Stage2PositionData) => {
    if (!stage1Data) return;
    setErrorMessage(null);
    setStage2Data(updatedStage2Data);
    setIsLoading(true);
    setTargetLoadingStage(3);

    try {
      const data = await api.runStage3Shape({
        rawIdea: rawIdea.trim(),
        stage1Data,
        stage2Data: updatedStage2Data,
      });
      setStage3Data(data);
      setSelectedBrandName(data.namingDirections[0]?.name || 'SquadForge');
      setSelectedTagline(data.selectedTagline);
      setCompletedStages((prev) => Array.from(new Set([...prev, 1, 2])));
      setCurrentStage(3);
    } catch (err: any) {
      console.error('Stage 3 pipeline error:', err);
      setErrorMessage(err.message || 'Failed to complete Stage 3 Shape. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 3 -> Stage 4 (Visualize)
  const handleProceedToStage4 = async (
    chosenName: string,
    updatedStage3Data: Stage3ShapeData
  ) => {
    if (!stage1Data || !stage2Data) return;
    setErrorMessage(null);
    setSelectedBrandName(chosenName);
    setSelectedTagline(updatedStage3Data.selectedTagline);
    setStage3Data(updatedStage3Data);
    setIsLoading(true);
    setTargetLoadingStage(4);

    try {
      const data = await api.runStage4Visualize({
        rawIdea: rawIdea.trim(),
        stage1Data,
        stage2Data,
        stage3Data: updatedStage3Data,
        selectedName: chosenName,
      });
      setStage4Data(data);
      setCompletedStages((prev) => Array.from(new Set([...prev, 1, 2, 3])));
      setCurrentStage(4);
    } catch (err: any) {
      console.error('Stage 4 pipeline error:', err);
      setErrorMessage(err.message || 'Failed to complete Stage 4 Visualize. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 4 -> Stage 5 (Challenge)
  const handleProceedToStage5 = async (updatedStage4Data: Stage4VisualizeData) => {
    if (!stage1Data || !stage2Data || !stage3Data) return;
    setErrorMessage(null);
    setStage4Data(updatedStage4Data);
    setIsLoading(true);
    setTargetLoadingStage(5);

    try {
      const data = await api.runStage5Challenge({
        rawIdea: rawIdea.trim(),
        stage1Data,
        stage2Data,
        stage3Data,
        stage4Data: updatedStage4Data,
        selectedName: selectedBrandName || stage3Data.namingDirections[0]?.name,
      });
      setStage5Data(data);
      setCompletedStages((prev) => Array.from(new Set([...prev, 1, 2, 3, 4])));
      setCurrentStage(5);
    } catch (err: any) {
      console.error('Stage 5 pipeline error:', err);
      setErrorMessage(err.message || 'Failed to complete Stage 5 Challenge. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 5 -> Stage 6 (Deliver)
  const handleProceedToStage6 = async (
    decisions: Record<string, string>,
    updatedStage5Data: Stage5ChallengeData
  ) => {
    if (!stage1Data || !stage2Data || !stage3Data || !stage4Data) return;
    setErrorMessage(null);
    setSelectedDecisions(decisions);
    setStage5Data(updatedStage5Data);
    setIsLoading(true);
    setTargetLoadingStage(6);

    try {
      const data = await api.runStage6Deliver({
        rawIdea: rawIdea.trim(),
        stage1Data,
        stage2Data,
        stage3Data,
        stage4Data,
        stage5Data: updatedStage5Data,
        selectedName: selectedBrandName || stage3Data.namingDirections[0]?.name,
        selectedDecisions: decisions,
      });
      setStage6Data(data);
      setCompletedStages((prev) => Array.from(new Set([...prev, 1, 2, 3, 4, 5, 6])));
      setCurrentStage(6);
    } catch (err: any) {
      console.error('Stage 6 pipeline error:', err);
      setErrorMessage(err.message || 'Failed to complete Stage 6 Deliver. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const handleStageTabClick = (stage: PipelineStage) => {
    setCurrentStage(stage);
  };

  const hasActiveSession = Boolean(stage1Data || rawIdea.trim());
  const isPaper = theme === 'paper';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isPaper
          ? 'theme-paper bg-[#F7F5EE] text-slate-900 selection:bg-amber-500/30 selection:text-amber-950'
          : 'theme-midnight bg-[#0B0F17] text-slate-100 selection:bg-amber-500/20 selection:text-amber-200'
      }`}
    >
      {/* Header with Theme Switcher */}
      <Header
        onReset={handleReset}
        hasActiveSession={hasActiveSession}
        currentStage={currentStage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Pipeline Navigation Bar (shown when session has started) */}
      {hasActiveSession && (
        <PipelineTracker
          currentStage={currentStage}
          completedStages={completedStages}
          onSelectStage={handleStageTabClick}
          brandName={selectedBrandName || stage3Data?.namingDirections?.[0]?.name}
          theme={theme}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start space-x-3 text-rose-200 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Pipeline Processing Notice</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 text-xs font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LOADING STATE: Contextual AI Thinking between stages */}
        {isLoading ? (
          <ContextualThinking
            targetStage={targetLoadingStage}
            stageName={STAGE_NAMES[targetLoadingStage]}
            theme={theme}
          />
        ) : !stage1Data ? (
          /* HERO / WELCOME SCREEN */
          <div className="max-w-4xl mx-auto py-8 sm:py-16 space-y-12">
            {/* Title & Pitch */}
            <div className="text-center space-y-4">
              <div
                className={`inline-flex items-center space-x-2 text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full border ${
                  isPaper
                    ? 'text-amber-900 bg-amber-100 border-amber-300 font-semibold'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Brand Intelligence Platform</span>
              </div>

              <h1
                className={`text-4xl sm:text-6xl font-black font-display tracking-tight leading-[1.1] ${
                  isPaper ? 'text-slate-950' : 'text-white'
                }`}
              >
                One rough sentence in. <br />
                <span
                  className={`text-transparent bg-clip-text ${
                    isPaper
                      ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-700'
                      : 'bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400'
                  }`}
                >
                  A winning brand out.
                </span>
              </h1>

              <p
                className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
                  isPaper ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Brandix runs your startup idea through six sequential AI reasoning stages — carrying forward structured JSON from each stage to produce a complete, exportable brand kit.
              </p>
            </div>

            {/* Input Box Card */}
            <div
              className={`border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-200 ${
                isPaper
                  ? 'bg-white border-[#E2DCCE] shadow-lg'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                  isPaper ? 'bg-amber-500/10' : 'bg-amber-500/5'
                }`}
              />

              <form onSubmit={handleStartPipeline} className="space-y-4">
                <label
                  className={`block text-xs font-mono uppercase tracking-wider font-semibold ${
                    isPaper ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  Describe Your Startup Idea in One Rough Sentence:
                </label>
                <div className="relative">
                  <textarea
                    value={rawIdea}
                    onChange={(e) => setRawIdea(e.target.value)}
                    rows={3}
                    placeholder="e.g. I want an app that helps students find teammates for hackathons"
                    className={`w-full border rounded-xl p-4 text-base transition-colors resize-none shadow-inner focus:outline-none ${
                      isPaper
                        ? 'bg-[#FAF8F3] border-[#DDD7CB] text-slate-900 placeholder-slate-400 focus:border-amber-600'
                        : 'bg-slate-950 border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Sample Starter Chips */}
                <div className="space-y-2">
                  <div
                    className={`text-[11px] font-mono uppercase tracking-wider ${
                      isPaper ? 'text-slate-600 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    Or click a sample submission:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_IDEAS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRawIdea(sample)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors text-left truncate max-w-full cursor-pointer border ${
                          isPaper
                            ? 'bg-[#FAF8F3] hover:bg-[#EFECE4] border-[#DDD7CB] text-slate-700 hover:text-slate-950'
                            : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        "{sample}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!rawIdea.trim()}
                    className="flex items-center space-x-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Run 6-Stage Brand Pipeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* The 6 Stages Architecture Overview */}
            <div className="space-y-6 pt-4">
              <div className="text-center">
                <div
                  className={`text-xs font-mono uppercase tracking-widest mb-1 ${
                    isPaper ? 'text-slate-600 font-semibold' : 'text-slate-500'
                  }`}
                >
                  Sequential Chain-of-Thought Pipeline
                </div>
                <h3
                  className={`text-xl font-bold font-display ${
                    isPaper ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  6 Dedicated AI Stages • No Single Generic Prompts
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  className={`border rounded-xl p-4.5 space-y-2 ${
                    isPaper ? 'bg-white border-[#E2DCCE] shadow-xs' : 'bg-slate-900/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-600 font-bold">
                    <span>01</span>
                    <span>·</span>
                    <span>DISCOVER</span>
                  </div>
                  <h4 className={`text-sm font-semibold ${isPaper ? 'text-slate-900' : 'text-white'}`}>
                    Adaptive Strategic Interview
                  </h4>
                  <p className={`text-xs leading-relaxed ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
                    Extracts the core problem, early adopters, and asks 2-3 provocative follow-up questions to uncover hidden trade-offs.
                  </p>
                </div>

                <div
                  className={`border rounded-xl p-4.5 space-y-2 ${
                    isPaper ? 'bg-white border-[#E2DCCE] shadow-xs' : 'bg-slate-900/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 font-bold">
                    <span>02</span>
                    <span>·</span>
                    <span>POSITION</span>
                  </div>
                  <h4 className={`text-sm font-semibold ${isPaper ? 'text-slate-900' : 'text-white'}`}>
                    Category & Competitive Wedge
                  </h4>
                  <p className={`text-xs leading-relaxed ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
                    Carves an uncontested category, attacks incumbent flaws, and crafts a formulaic positioning statement.
                  </p>
                </div>

                <div
                  className={`border rounded-xl p-4.5 space-y-2 ${
                    isPaper ? 'bg-white border-[#E2DCCE] shadow-xs' : 'bg-slate-900/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-xs font-mono text-indigo-600 font-bold">
                    <span>03</span>
                    <span>·</span>
                    <span>SHAPE</span>
                  </div>
                  <h4 className={`text-sm font-semibold ${isPaper ? 'text-slate-900' : 'text-white'}`}>
                    Naming & Brand Archetypes
                  </h4>
                  <p className={`text-xs leading-relaxed ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
                    Generates 4-5 lexical naming directions, personality traits rooted in audience psychology, and anti-traits to avoid.
                  </p>
                </div>

                <div
                  className={`border rounded-xl p-4.5 space-y-2 ${
                    isPaper ? 'bg-white border-[#E2DCCE] shadow-xs' : 'bg-slate-900/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-700 font-bold">
                    <span>04</span>
                    <span>·</span>
                    <span>VISUALIZE</span>
                  </div>
                  <h4 className={`text-sm font-semibold ${isPaper ? 'text-slate-900' : 'text-white'}`}>
                    Rendered Design System
                  </h4>
                  <p className={`text-xs leading-relaxed ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
                    Provides actual hex swatches, typography pairing, and live rendered brand card preview — not just abstract text.
                  </p>
                </div>

                <div
                  className={`border rounded-xl p-4.5 space-y-2 ${
                    isPaper ? 'bg-white border-[#E2DCCE] shadow-xs' : 'bg-slate-900/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-xs font-mono text-rose-600 font-bold">
                    <span>05</span>
                    <span>·</span>
                    <span>CHALLENGE</span>
                  </div>
                  <h4 className={`text-sm font-semibold ${isPaper ? 'text-slate-900' : 'text-white'}`}>
                    The Strategist vs. The Critic
                  </h4>
                  <p className={`text-xs leading-relaxed ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
                    A visible two-column adversarial debate exposing startup clichés and forcing founder decisions.
                  </p>
                </div>

                <div
                  className={`border rounded-xl p-4.5 space-y-2 ${
                    isPaper ? 'bg-white border-[#E2DCCE] shadow-xs' : 'bg-slate-900/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 font-bold">
                    <span>06</span>
                    <span>·</span>
                    <span>DELIVER</span>
                  </div>
                  <h4 className={`text-sm font-semibold ${isPaper ? 'text-slate-900' : 'text-white'}`}>
                    Complete Brand Kit & Assets
                  </h4>
                  <p className={`text-xs leading-relaxed ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
                    Production-ready brand book, 4 voice-in-action scenarios, launch headlines, social copy, and instant JSON/Markdown export.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE PIPELINE STAGE VIEWS */
          <div className="max-w-5xl mx-auto">
            {currentStage === 1 && stage1Data && (
              <Stage1Discover
                data={stage1Data}
                rawIdea={rawIdea}
                onProceed={handleProceedToStage2}
                isLoading={isLoading}
              />
            )}

            {currentStage === 2 && stage2Data && (
              <Stage2Position
                data={stage2Data}
                onProceed={handleProceedToStage3}
                isLoading={isLoading}
              />
            )}

            {currentStage === 3 && stage3Data && (
              <Stage3Shape
                data={stage3Data}
                initialSelectedName={selectedBrandName}
                onProceed={handleProceedToStage4}
                isLoading={isLoading}
              />
            )}

            {currentStage === 4 && stage4Data && (
              <Stage4Visualize
                data={stage4Data}
                brandName={selectedBrandName || stage3Data?.namingDirections?.[0]?.name || 'SquadForge'}
                tagline={selectedTagline || stage3Data?.selectedTagline || ''}
                onProceed={handleProceedToStage5}
                isLoading={isLoading}
              />
            )}

            {currentStage === 5 && stage5Data && (
              <Stage5Challenge
                data={stage5Data}
                onProceed={handleProceedToStage6}
                isLoading={isLoading}
              />
            )}

            {currentStage === 6 && stage6Data && (
              <Stage6Deliver
                data={stage6Data}
                visualData={stage4Data || undefined}
                onRestart={handleReset}
                theme={theme}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 print:hidden transition-colors duration-200 ${
          isPaper ? 'border-[#E4DFD5] bg-[#FAF8F3] text-slate-600' : 'border-slate-800/80 bg-[#0B0F17] text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`font-display font-semibold ${
                isPaper ? 'text-slate-900' : 'text-slate-300'
              }`}
            >
              Brandix
            </span>
            <span>·</span>
            <span>AI Brand Intelligence & Reasoning Pipeline</span>
          </div>
          <div>
            Built with Gemini 3.8 Flash · Sequential JSON Schema Pipeline
          </div>
        </div>
      </footer>
    </div>
  );
}
