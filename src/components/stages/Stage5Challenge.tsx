import React, { useState } from 'react';
import { Flame, ShieldAlert, Zap, AlertOctagon, CheckSquare, ArrowRight, MessageSquare, Scale } from 'lucide-react';
import { Stage5ChallengeData, ActionableDecision } from '../../types/brandix';

interface Stage5ChallengeProps {
  data: Stage5ChallengeData;
  onProceed: (selectedDecisions: Record<string, string>, updatedData: Stage5ChallengeData) => void;
  isLoading: boolean;
}

export const Stage5Challenge: React.FC<Stage5ChallengeProps> = ({
  data,
  onProceed,
  isLoading,
}) => {
  const [decisions, setDecisions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    data.actionableDecisions.forEach((dec) => {
      initial[dec.id] = dec.recommendedAction;
    });
    return initial;
  });

  const handleSelectDecision = (decisionId: string, choiceText: string) => {
    setDecisions((prev) => ({ ...prev, [decisionId]: choiceText }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceed(decisions, data);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            Stage 05 · Strategic Stress-Test & Debate
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            The Strategist vs. The Critic
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            A visible debate exposing startup clichés, existential vulnerabilities, and offensive moats.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg flex items-center space-x-2 text-xs">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-mono">Status: Adversarial Debate Live</span>
        </div>
      </div>

      {/* Central Debate Core Premise */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Core Strategic Tension</span>
        </div>
        <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
          {data.debateSummary}
        </p>
      </div>

      {/* TWO VISIBLE COLUMNS: STRATEGIST VS CRITIC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* THE STRATEGIST COLUMN */}
        <div className="bg-slate-900/50 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Persona Header */}
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                  Offensive Angle · The Growth Strategist
                </div>
                <h3 className="text-base font-bold text-white">
                  {data.perspectiveStrategist.proponentName}
                </h3>
              </div>
            </div>

            {/* Core Bullish Argument */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 mb-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Bullish Thematic Thesis:
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                "{data.perspectiveStrategist.coreArgument}"
              </p>
            </div>

            {/* High-Leverage Opportunities */}
            <div className="space-y-3 mb-4">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Asymmetric Market Upsides:
              </div>
              <ul className="space-y-2">
                {data.perspectiveStrategist.opportunities.map((opp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60"
                  >
                    <span className="text-emerald-400 font-bold font-mono">+{idx + 1}.</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategic Refinements */}
          <div className="pt-3 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Recommended Offensive Upgrades:
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              {data.perspectiveStrategist.recommendedRefinements.map((ref, idx) => (
                <div key={idx} className="flex items-center space-x-1.5">
                  <span className="text-emerald-400">▸</span>
                  <span>{ref}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* THE CRITIC COLUMN */}
        <div className="bg-slate-900/50 border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Persona Header */}
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-rose-400">
                  Devil's Advocate · The Venture Skeptic
                </div>
                <h3 className="text-base font-bold text-white">
                  {data.perspectiveCritic.criticName}
                </h3>
              </div>
            </div>

            {/* Harsh Unvarnished Truth */}
            <div className="bg-slate-950/70 border border-rose-900/30 rounded-xl p-4 mb-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400 mb-1">
                The Uncomfortable Reality:
              </div>
              <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                "{data.perspectiveCritic.harshTruth}"
              </p>
            </div>

            {/* Fatal Vulnerabilities */}
            <div className="space-y-3 mb-4">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Points of Fragility & Churn Risk:
              </div>
              <ul className="space-y-2">
                {data.perspectiveCritic.vulnerabilities.map((vuln, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60"
                  >
                    <span className="text-rose-400 font-bold font-mono">!{idx + 1}.</span>
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stress Test Verdict */}
          <div className="pt-3 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
              Stress Test Verdict:
            </div>
            <div className="text-xs font-mono text-slate-300 bg-rose-950/30 p-2 rounded-lg border border-rose-900/30">
              {data.perspectiveCritic.stressTestVerdict}
            </div>
          </div>
        </div>
      </div>

      {/* Cliches Identified & Remedies */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
          <AlertOctagon className="w-4 h-4" />
          <span>Startup Clichés Detected & Antidotes</span>
        </div>
        <h3 className="text-lg font-bold font-display text-white mb-4">
          Transcend Generic Patterns
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.clichesIdentified.map((item, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-rose-400 font-semibold">
                <span>✕ Cliché:</span>
                <span className="line-through text-slate-400">{item.cliche}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Why it's weak:</strong> {item.whyRisky}
              </p>
              <div className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-900/40 p-2 rounded-lg">
                <strong className="text-emerald-400">The Antidote:</strong> {item.remedy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Trade-Off Decisions: Let the User Steer */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
          <CheckSquare className="w-4 h-4" />
          <span>Founder's Call: Trade-Off Decisions</span>
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-2">
          Resolve the Debate Before Final Kit Compilation
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Choose which perspective to adopt for each tension. Your decisions will directly calibrate the final brand guidelines, voice samples, and launch copy.
        </p>

        <div className="space-y-6">
          {data.actionableDecisions.map((dec, idx) => {
            const currentChoice = decisions[dec.id] || dec.recommendedAction;

            return (
              <div
                key={dec.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                    0{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white">{dec.topic}</h4>
                </div>

                {/* 3 selectable stance buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {/* Strategist Stance */}
                  <button
                    type="button"
                    onClick={() => handleSelectDecision(dec.id, dec.strategistAdvice)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      currentChoice === dec.strategistAdvice
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200 font-semibold'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono text-emerald-400 mb-1">
                      Strategist Approach
                    </div>
                    <div>{dec.strategistAdvice}</div>
                  </button>

                  {/* Critic Stance */}
                  <button
                    type="button"
                    onClick={() => handleSelectDecision(dec.id, dec.criticWarning)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      currentChoice === dec.criticWarning
                        ? 'bg-rose-500/15 border-rose-500 text-rose-200 font-semibold'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono text-rose-400 mb-1">
                      Critic Caution
                    </div>
                    <div>{dec.criticWarning}</div>
                  </button>

                  {/* Recommended Synthesis */}
                  <button
                    type="button"
                    onClick={() => handleSelectDecision(dec.id, dec.recommendedAction)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      currentChoice === dec.recommendedAction
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-semibold'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono text-amber-400 mb-1">
                      ★ Recommended Synthesis
                    </div>
                    <div>{dec.recommendedAction}</div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proceed Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer disabled:opacity-50"
          >
            <span>Proceed to Stage 06: Deliver</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
