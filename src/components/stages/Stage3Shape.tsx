import React, { useState } from 'react';
import { Tag, Sparkles, CheckCircle2, Ban, ArrowRight, Lightbulb, MessageSquareQuote } from 'lucide-react';
import { Stage3ShapeData, NamingDirection } from '../../types/brandix';

interface Stage3ShapeProps {
  data: Stage3ShapeData;
  initialSelectedName?: string;
  onProceed: (selectedName: string, updatedData: Stage3ShapeData) => void;
  isLoading: boolean;
}

export const Stage3Shape: React.FC<Stage3ShapeProps> = ({
  data,
  initialSelectedName,
  onProceed,
  isLoading,
}) => {
  const [selectedName, setSelectedName] = useState(
    initialSelectedName || data.namingDirections[0]?.name || 'SquadForge'
  );
  const [customNameInput, setCustomNameInput] = useState('');
  const [selectedTagline, setSelectedTagline] = useState(data.selectedTagline);
  const [oneLinePitch, setOneLinePitch] = useState(data.oneLinePitch);

  const handleSelectName = (name: string) => {
    setSelectedName(name);
    setCustomNameInput('');
  };

  const handleCustomNameApply = () => {
    if (customNameInput.trim()) {
      setSelectedName(customNameInput.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customNameInput.trim() || selectedName;
    const updated: Stage3ShapeData = {
      ...data,
      selectedTagline,
      oneLinePitch,
    };
    onProceed(finalName, updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            Stage 03 · Brand Identity & Naming
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Shape Personality & Naming
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Select a brand name direction, calibrate personality traits, and lock the elevator hook.
          </p>
        </div>

        {/* Selected Name Pill Badge */}
        <div className="bg-slate-900 border border-amber-500/40 px-4 py-2 rounded-xl flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Chosen Name:</span>
          <span className="font-display font-bold text-amber-300 text-base">
            {customNameInput.trim() || selectedName}
          </span>
        </div>
      </div>

      {/* Naming Directions Interactive Selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Naming Directions</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Choose or Customize Your Brand Name
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:block">
            Click any card to select
          </span>
        </div>

        {/* Naming Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {data.namingDirections.map((item, idx) => {
            const isSelected = selectedName === item.name && !customNameInput;
            return (
              <div
                key={idx}
                onClick={() => handleSelectName(item.name)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {item.type}
                    </span>
                    {isSelected && (
                      <span className="flex items-center space-x-1 text-[11px] text-amber-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </span>
                    )}
                  </div>
                  <div className="font-display text-xl font-bold text-white mb-2">
                    {item.name}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.rationale}
                  </p>
                </div>
                <div className="text-[11px] font-mono text-amber-400/90 pt-2 border-t border-slate-800/80">
                  {item.vibeScore}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Name Override Input */}
        <div className="flex items-center space-x-3 pt-3 border-t border-slate-800/60 max-w-xl">
          <input
            type="text"
            value={customNameInput}
            onChange={(e) => setCustomNameInput(e.target.value)}
            placeholder="Or type a custom brand name..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
          />
          <button
            type="button"
            onClick={handleCustomNameApply}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Apply Custom Name
          </button>
        </div>
      </div>

      {/* Brand Personality Traits */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
          <Lightbulb className="w-4 h-4" />
          <span>Audience-Tied Personality Traits</span>
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-4">
          How This Brand Thinks & Speaks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {data.personalityTraits.map((t, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="font-display font-bold text-sm text-emerald-300 mb-1.5">
                {t.trait}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {t.description}
              </p>
              <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/50">
                <span className="font-medium text-slate-300">Audience Anchor:</span> {t.audienceRationale}
              </div>
            </div>
          ))}
        </div>

        {/* Traits to Avoid (Anti-Traits) */}
        <div className="pt-4 border-t border-slate-800/60">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
            <Ban className="w-3.5 h-3.5" />
            <span>Anti-Persona: Traits to Strictly Avoid</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.traitsToAvoid.map((trait, idx) => (
              <div
                key={idx}
                className="bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5"
              >
                <span>✕</span>
                <span>{trait}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Taglines & One-Line Pitch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tagline Selection */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <Tag className="w-4 h-4" />
            <span>Selectable Tagline Directions</span>
          </div>
          <div className="space-y-2 mb-3">
            {data.taglineOptions.map((tag, idx) => {
              const isSelected = selectedTagline === tag;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedTagline(tag)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 inline-block shrink-0" />
                    )}
                    <span>"{tag}"</span>
                  </div>
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={selectedTagline}
            onChange={(e) => setSelectedTagline(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            placeholder="Or edit tagline..."
          />
        </div>

        {/* One-Line Pitch */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              <MessageSquareQuote className="w-4 h-4" />
              <span>One-Line Elevator Pitch</span>
            </div>
            <textarea
              value={oneLinePitch}
              onChange={(e) => setOneLinePitch(e.target.value)}
              rows={4}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500/50 resize-y"
              placeholder="Elevator pitch..."
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            The instant, memorable answer to "So, what does your startup actually do?"
          </p>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer disabled:opacity-50"
        >
          <span>Proceed to Stage 04: Visualize</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
