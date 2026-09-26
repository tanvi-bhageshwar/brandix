import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { PipelineStage, AppTheme } from '../types/brandix';

interface PipelineTrackerProps {
  currentStage: PipelineStage;
  completedStages: number[];
  onSelectStage: (stage: PipelineStage) => void;
  brandName?: string;
  theme?: AppTheme;
}

const STAGES = [
  { id: 1, name: 'Discover', subtitle: 'Problem & Audience' },
  { id: 2, name: 'Position', subtitle: 'Category & Moat' },
  { id: 3, name: 'Shape', subtitle: 'Naming & Archetype' },
  { id: 4, name: 'Visualize', subtitle: 'Palette & Typography' },
  { id: 5, name: 'Challenge', subtitle: 'Critique & Debate' },
  { id: 6, name: 'Deliver', subtitle: 'Final Brand Kit' },
];

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  currentStage,
  completedStages,
  onSelectStage,
  brandName,
  theme = 'midnight',
}) => {
  const isPaper = theme === 'paper';

  return (
    <div
      className={`w-full border-b sticky top-16 z-30 backdrop-blur-sm transition-colors duration-200 ${
        isPaper
          ? 'border-[#E4DFD5] bg-[#F4F1E8]/95'
          : 'border-slate-800/80 bg-[#0E131F]/95'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
          {STAGES.map((stage, idx) => {
            const isCompleted = completedStages.includes(stage.id);
            const isCurrent = currentStage === stage.id;
            const isAccessible = isCompleted || isCurrent;

            return (
              <React.Fragment key={stage.id}>
                <button
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => isAccessible && onSelectStage(stage.id as PipelineStage)}
                  className={`group flex items-center space-x-2.5 text-left py-1 px-2.5 rounded-lg transition-all ${
                    isCurrent
                      ? isPaper
                        ? 'bg-amber-100/90 border border-amber-300 text-amber-950 font-semibold shadow-xs'
                        : 'bg-amber-500/10 border border-amber-500/30 text-amber-200'
                      : isCompleted
                      ? isPaper
                        ? 'text-slate-700 hover:text-slate-950 hover:bg-white/80 cursor-pointer'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 cursor-pointer'
                      : isPaper
                      ? 'text-slate-400 opacity-60 cursor-not-allowed'
                      : 'text-slate-600 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                        : isCompleted
                        ? isPaper
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isPaper
                        ? 'bg-slate-200/80 text-slate-500 border border-slate-300'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span>0{stage.id}</span>
                    )}
                  </div>

                  <div className="whitespace-nowrap">
                    <div className="text-xs font-semibold tracking-wide flex items-center space-x-1.5">
                      <span>{stage.name}</span>
                      {stage.id === 6 && brandName && isCompleted && (
                        <span
                          className={`text-[10px] font-normal ${
                            isPaper ? 'text-amber-800' : 'text-amber-400'
                          }`}
                        >
                          · {brandName}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] hidden lg:block ${
                        isPaper ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {stage.subtitle}
                    </div>
                  </div>
                </button>

                {idx < STAGES.length - 1 && (
                  <div
                    className={`hidden sm:flex items-center ${
                      isPaper ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
