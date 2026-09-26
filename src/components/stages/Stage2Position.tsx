import React, { useState } from 'react';
import { Compass, ShieldCheck, Zap, Swords, ArrowRight, CheckCircle, Edit3 } from 'lucide-react';
import { Stage2PositionData } from '../../types/brandix';

interface Stage2PositionProps {
  data: Stage2PositionData;
  onProceed: (updatedData: Stage2PositionData) => void;
  isLoading: boolean;
}

export const Stage2Position: React.FC<Stage2PositionProps> = ({
  data,
  onProceed,
  isLoading,
}) => {
  const [category, setCategory] = useState(data.category);
  const [keyDifferentiator, setKeyDifferentiator] = useState(data.keyDifferentiator);
  const [valueProposition, setValueProposition] = useState(data.valueProposition);
  const [positioningStatement, setPositioningStatement] = useState(data.positioningStatement);
  const [ourCounterMove, setOurCounterMove] = useState(data.competitiveAngle.ourCounterMove);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Stage2PositionData = {
      ...data,
      category,
      keyDifferentiator,
      valueProposition,
      positioningStatement,
      competitiveAngle: {
        ...data.competitiveAngle,
        ourCounterMove,
      },
    };
    onProceed(updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            Stage 02 · Strategic Positioning
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Category & Competitive Moat
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Crafted market wedge, contrarian differentiation, and competitive attack angle.
          </p>
        </div>
      </div>

      {/* Hero Positioning Statement Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>Strategic Positioning Statement</span>
        </div>
        <textarea
          value={positioningStatement}
          onChange={(e) => setPositioningStatement(e.target.value)}
          rows={3}
          className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-base sm:text-lg font-medium text-amber-100 leading-relaxed focus:outline-none focus:border-amber-500/60 resize-y"
        />
        <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>Editable formulaic positioning passed directly into brand naming and copy.</span>
        </div>
      </div>

      {/* Grid: Category, Differentiator, Value Prop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Market Category</span>
          </div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-emerald-500/50"
          />
          <p className="text-[11px] text-slate-400 mt-2">
            The category context that makes your product intuitive to evaluate.
          </p>
        </div>

        {/* Key Differentiator */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Key Differentiator</span>
          </div>
          <textarea
            value={keyDifferentiator}
            onChange={(e) => setKeyDifferentiator(e.target.value)}
            rows={3}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 resize-y"
          />
          <p className="text-[11px] text-slate-400 mt-2">
            The single unfair advantage that cannot be copied easily by incumbents.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" />
            <span>Core Value Proposition</span>
          </div>
          <textarea
            value={valueProposition}
            onChange={(e) => setValueProposition(e.target.value)}
            rows={3}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-y"
          />
          <p className="text-[11px] text-slate-400 mt-2">
            The tangible, immediate breakthrough delivered to the user.
          </p>
        </div>
      </div>

      {/* Competitive Battleground Angle */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
          <Swords className="w-4 h-4" />
          <span>Competitive Angle & Flank Attack</span>
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-4">
          Status Quo vs. Incumbent Flaw vs. Our Counter-Move
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Quo */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Current Workaround / Status Quo
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.competitiveAngle.statusQuo}
            </p>
          </div>

          {/* Their Weakness */}
          <div className="bg-slate-950/70 border border-rose-900/30 rounded-xl p-4">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
              Incumbent Fatal Flaw
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.competitiveAngle.theirWeakness}
            </p>
          </div>

          {/* Our Counter Move */}
          <div className="bg-slate-950/70 border border-emerald-900/40 rounded-xl p-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Our Tactical Counter-Move
            </div>
            <textarea
              value={ourCounterMove}
              onChange={(e) => setOurCounterMove(e.target.value)}
              rows={3}
              className="w-full bg-transparent border-0 p-0 text-xs text-emerald-200 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
          3 Strategic Foundation Pillars
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.strategicPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-start space-x-3"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs font-medium text-slate-200">{pillar}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer disabled:opacity-50"
        >
          <span>Proceed to Stage 03: Shape</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
