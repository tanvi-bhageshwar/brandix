import React, { useState } from 'react';
import { RotateCcw, Cpu, Layers, Moon, BookOpen, Check } from 'lucide-react';
import { AppTheme } from '../types/brandix';

interface HeaderProps {
  onReset: () => void;
  hasActiveSession: boolean;
  currentStage: number;
  theme: AppTheme;
  onToggleTheme: (theme: AppTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasActiveSession,
  theme,
  onToggleTheme,
}) => {
  const isPaper = theme === 'paper';
  const [confirmReset, setConfirmReset] = useState(false);

  const handleNewBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmReset) {
      setConfirmReset(false);
      onReset();
    } else {
      setConfirmReset(true);
      setTimeout(() => {
        setConfirmReset(false);
      }, 4000);
    }
  };

  return (
    <header
      className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 ${
        isPaper
          ? 'border-[#E4DFD5] bg-[#FAF8F3]/95 text-slate-800 shadow-xs'
          : 'border-slate-800/80 bg-[#0B0F17]/90 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black tracking-tight font-display text-lg">
            Bx
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`font-display font-bold text-lg tracking-tight ${
                  isPaper ? 'text-slate-900' : 'text-white'
                }`}
              >
                Brandix
              </span>
              <span
                className={`text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded border ${
                  isPaper
                    ? 'text-amber-800 bg-amber-100/70 border-amber-300/80'
                    : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                }`}
              >
                Studio
              </span>
            </div>
            <p
              className={`text-xs hidden sm:block ${
                isPaper ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              AI-Powered Brand Intelligence & Strategy Engine
            </p>
          </div>
        </div>

        {/* Center metadata / architecture indicator */}
        <div
          className={`hidden md:flex items-center space-x-4 text-xs ${
            isPaper ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>6-Stage Sequential Pipeline</span>
          </div>
          <span className={isPaper ? 'text-slate-300' : 'text-slate-700'}>·</span>
          <div className="flex items-center space-x-1.5">
            <Cpu className={`w-3.5 h-3.5 ${isPaper ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span>Gemini Native JSON Schemas</span>
          </div>
        </div>

        {/* Actions & Theme Switcher */}
        <div className="flex items-center space-x-3">
          {/* Theme Switcher Segmented Control */}
          <div
            className={`flex items-center p-1 rounded-lg border text-xs font-medium transition-colors ${
              isPaper
                ? 'bg-[#EFECE4] border-[#DDD7CB]'
                : 'bg-slate-900 border-slate-800'
            }`}
            role="group"
            aria-label="Theme Switcher"
          >
            <button
              type="button"
              onClick={() => onToggleTheme('midnight')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                !isPaper
                  ? 'bg-slate-800 text-amber-300 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Midnight dark mode"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Midnight</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleTheme('paper')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                isPaper
                  ? 'bg-white text-slate-900 shadow-xs font-semibold border border-[#D5CEC0]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Paper editorial light mode"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paper</span>
            </button>
          </div>

          {/* New Brand button with tactile inline confirm */}
          {hasActiveSession && (
            <button
              type="button"
              onClick={handleNewBrandClick}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer border ${
                confirmReset
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-md animate-pulse'
                  : isPaper
                  ? 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border-[#DDD7CB]'
                  : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border-slate-700/80'
              }`}
              title={confirmReset ? 'Click to confirm reset' : 'Start a new brand exploration'}
            >
              {confirmReset ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Confirm Reset?</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Brand</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
