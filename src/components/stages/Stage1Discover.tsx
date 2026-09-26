import React, { useState } from 'react';
import { Target, Users, AlertCircle, Sparkles, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Stage1DiscoverData, OpenQuestion } from '../../types/brandix';

interface Stage1DiscoverProps {
  data: Stage1DiscoverData;
  rawIdea: string;
  onProceed: (answers: Record<string, string>, updatedData: Stage1DiscoverData) => void;
  isLoading: boolean;
}

export const Stage1Discover: React.FC<Stage1DiscoverProps> = ({
  data,
  rawIdea,
  onProceed,
  isLoading,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    data.openQuestions.forEach((q) => {
      initial[q.id] = q.quickChoices[0] || '';
    });
    return initial;
  });

  const [coreProblem, setCoreProblem] = useState(data.coreProblem);
  const [primaryAudience, setPrimaryAudience] = useState(data.targetAudience.primary);
  const [underlyingValue, setUnderlyingValue] = useState(data.underlyingValue);

  const handleSelectChoice = (questionId: string, choice: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleCustomTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Stage1DiscoverData = {
      ...data,
      coreProblem,
      targetAudience: {
        ...data.targetAudience,
        primary: primaryAudience,
      },
      underlyingValue,
    };
    onProceed(answers, updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            Stage 01 · Strategic Discovery
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Deconstruct & Discover
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Extracted core problem, target audience dynamics, and adaptive trade-off questions.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg max-w-sm truncate">
          <span className="text-slate-500 font-mono">Raw Input:</span> "{rawIdea}"
        </div>
      </div>

      {/* Main Grid: Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Problem */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            <span>Core Problem to Solve</span>
          </div>
          <textarea
            value={coreProblem}
            onChange={(e) => setCoreProblem(e.target.value)}
            rows={3}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 resize-y"
            placeholder="Edit core problem..."
          />
          <p className="text-[11px] text-slate-500 mt-1.5">
            Tip: You can edit or clarify this definition before passing to Stage 2.
          </p>
        </div>

        {/* Target Audience */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Target Audience Breakdown</span>
          </div>
          <input
            type="text"
            value={primaryAudience}
            onChange={(e) => setPrimaryAudience(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 mb-3"
            placeholder="Primary early adopter..."
          />
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="font-medium text-slate-300">Audience Habits & Traps:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              {data.targetAudience.characteristics.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800/60">
              <strong className="text-slate-400">Buyer vs User:</strong> {data.targetAudience.buyerVsUser}
            </div>
          </div>
        </div>

        {/* Why Now & Market Context */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Why Now Context & Market Shifts</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            {data.context}
          </p>
          <div className="pt-3 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Underlying Transformation:
            </div>
            <textarea
              value={underlyingValue}
              onChange={(e) => setUnderlyingValue(e.target.value)}
              rows={2}
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 resize-y"
            />
          </div>
        </div>

        {/* Critical Constraints */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Friction & Structural Constraints</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {data.constraints.map((constraint, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-rose-400 font-mono font-bold">0{idx + 1}.</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Adaptive Follow-up Interview Section */}
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Adaptive Brand Interview</span>
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-2">
          Answer 2-3 Strategic Questions to Steer Your Brand
        </h3>
        <p className="text-sm text-slate-400 mb-6 max-w-2xl">
          The AI detected key forks in your positioning. Select quick choices or type a custom answer to directly shape Stage 2 (Positioning) and Stage 3 (Naming).
        </p>

        <div className="space-y-6">
          {data.openQuestions.map((q, idx) => {
            const currentAnswer = answers[q.id] || '';

            return (
              <div
                key={q.id}
                className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {q.question}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {q.context}
                    </p>
                  </div>
                </div>

                {/* Quick Choice Buttons */}
                <div className="space-y-2 pt-1 pl-9">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-slate-500">
                    Recommended Directions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {q.quickChoices.map((choice, cIdx) => {
                      const isSelected = currentAnswer === choice;
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleSelectChoice(q.id, choice)}
                          className={`text-xs px-3 py-2 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-medium shadow-sm shadow-amber-500/20'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            <span>{choice}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Or custom answer */}
                  <div className="pt-2">
                    <input
                      type="text"
                      value={currentAnswer}
                      onChange={(e) => handleCustomTextChange(q.id, e.target.value)}
                      placeholder="Or enter your custom perspective..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit & Move to Stage 2 */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer disabled:opacity-50"
          >
            <span>Proceed to Stage 02: Position</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
