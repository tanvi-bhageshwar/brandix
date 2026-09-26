import React, { useState } from 'react';
import { Palette, Type as TypeIcon, Copy, Check, Eye, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Stage4VisualizeData, ColorSwatch } from '../../types/brandix';

interface Stage4VisualizeProps {
  data: Stage4VisualizeData;
  brandName: string;
  tagline: string;
  onProceed: (updatedData: Stage4VisualizeData) => void;
  isLoading: boolean;
}

const AVAILABLE_DISPLAY_FONTS = [
  { name: 'Syne', fontClass: 'font-display', family: "'Syne', sans-serif" },
  { name: 'Space Grotesk', fontClass: 'font-mono-code', family: "'Space Grotesk', sans-serif" },
  { name: 'Instrument Serif', fontClass: 'font-serif-display', family: "'Instrument Serif', serif" },
  { name: 'Cinzel', fontClass: 'font-cinzel', family: "'Cinzel', serif" },
];

const AVAILABLE_BODY_FONTS = [
  { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Inter', family: "'Inter', sans-serif" },
];

export const Stage4Visualize: React.FC<Stage4VisualizeProps> = ({
  data,
  brandName,
  tagline,
  onProceed,
  isLoading,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedDisplayFont, setSelectedDisplayFont] = useState(data.typography.displayFont || 'Syne');
  const [selectedBodyFont, setSelectedBodyFont] = useState(data.typography.bodyFont || 'Plus Jakarta Sans');
  const [customColors, setCustomColors] = useState<ColorSwatch[]>(data.colorPalette);
  const [previewActionFeedback, setPreviewActionFeedback] = useState<string | null>(null);

  const handleSimulateClick = (actionName: string) => {
    setPreviewActionFeedback(actionName);
    setTimeout(() => setPreviewActionFeedback(null), 3000);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleColorChange = (index: number, newHex: string) => {
    const updated = [...customColors];
    updated[index] = { ...updated[index], hex: newHex };
    setCustomColors(updated);
  };

  const primaryColor = customColors[0]?.hex || '#F59E0B';
  const secondaryColor = customColors[1]?.hex || '#10B981';
  const accentColor = customColors[2]?.hex || '#6366F1';
  const surfaceColor = customColors[3]?.hex || '#0B0F17';
  const textColor = customColors[4]?.hex || '#F8FAFC';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Stage4VisualizeData = {
      ...data,
      typography: {
        ...data.typography,
        displayFont: selectedDisplayFont,
        bodyFont: selectedBodyFont,
      },
      colorPalette: customColors,
    };
    onProceed(updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            Stage 04 · Visual Identity System
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Visualize Design Brief & Aesthetics
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Rendered color swatches with psychological anchors, live typography pairing, and simulated brand card.
          </p>
        </div>
      </div>

      {/* Live Brand Identity Preview Card (Simulated UI) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Eye className="w-4 h-4" />
            <span>Interactive Brand Preview Card</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Renders live with your selected palette & typography
          </span>
        </div>

        {/* The Live Rendered Card */}
        <div
          className="rounded-2xl p-6 sm:p-10 border transition-all duration-300 shadow-2xl relative overflow-hidden"
          style={{
            backgroundColor: surfaceColor,
            borderColor: `${primaryColor}40`,
            color: textColor,
            fontFamily: selectedBodyFont,
          }}
        >
          {/* Ambient glow in card */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: primaryColor }}
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15"
            style={{ backgroundColor: accentColor }}
          />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {brandName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: selectedDisplayFont }}
                  >
                    {brandName}
                  </h4>
                  <p className="text-xs opacity-75">{tagline}</p>
                </div>
              </div>

              <div
                className="text-xs font-semibold px-3 py-1 rounded-md border"
                style={{
                  backgroundColor: `${secondaryColor}20`,
                  color: secondaryColor,
                  borderColor: `${secondaryColor}40`,
                }}
              >
                Verified Identity
              </div>
            </div>

            {/* Simulated Hero Copy */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3
                className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ fontFamily: selectedDisplayFont }}
              >
                {data.typography.sampleHeading || `The next generation of ${brandName}`}
              </h3>
              <p className="text-sm sm:text-base opacity-80 max-w-2xl leading-relaxed">
                {data.typography.sampleBody ||
                  `Experience the power of high-precision brand intelligence engineered for founders who ship.`}
              </p>
            </div>

            {/* Action Buttons in Brand Colors */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSimulateClick('Launch Experience')}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center space-x-1.5"
                style={{ backgroundColor: primaryColor }}
                title="Click to simulate primary conversion button"
              >
                <span>Launch Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSimulateClick('Documentation')}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer active:scale-95"
                style={{
                  borderColor: `${textColor}40`,
                  color: textColor,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                }}
                title="Click to simulate documentation button"
              >
                Documentation
              </button>
              {previewActionFeedback && (
                <span
                  className="text-xs font-mono font-medium px-3 py-1.5 rounded-lg animate-fadeIn shadow-xs flex items-center space-x-1.5"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    color: textColor,
                  }}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Interactive Preview: "{previewActionFeedback}" clicked!</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette Grid with Swatches */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
          <Palette className="w-4 h-4" />
          <span>Curated Color Palette (Real CSS Swatches)</span>
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-4">
          Palette Architecture & Psychological Intent
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {customColors.map((swatch, idx) => {
            const isCopied = copiedHex === swatch.hex;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col"
              >
                {/* Swatch color block */}
                <div
                  className="h-28 w-full relative p-3 flex flex-col justify-between transition-colors shadow-inner"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs font-bold">
                      {swatch.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHex(swatch.hex)}
                      className="p-1 rounded bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title="Copy Hex Code"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="font-mono text-xs font-bold text-white bg-black/40 px-2 py-0.5 rounded w-fit backdrop-blur-xs">
                    {swatch.hex}
                  </div>
                </div>

                {/* Swatch details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="font-semibold text-xs text-slate-100 flex items-center justify-between">
                      <span>{swatch.name}</span>
                      <input
                        type="color"
                        value={swatch.hex}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                        title="Fine-tune hex color"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {swatch.psychologicalReasoning}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Click color box to adjust
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typography Pairing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display & Body Font Controls */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <TypeIcon className="w-4 h-4" />
            <span>Interactive Typography Pairing</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Display Headline Font:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_DISPLAY_FONTS.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => setSelectedDisplayFont(font.name)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    selectedDisplayFont.toLowerCase().includes(font.name.toLowerCase())
                      ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  <div className="text-sm">{font.name}</div>
                  <div className="text-[10px] opacity-70 font-sans">Bold & Expressive</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Body & UI Font:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_BODY_FONTS.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => setSelectedBodyFont(font.name)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    selectedBodyFont.toLowerCase().includes(font.name.toLowerCase())
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  <div className="text-sm">{font.name}</div>
                  <div className="text-[10px] opacity-70">Ergonomic & Clean</div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
            <strong className="text-slate-300">Pairing Rationale:</strong>{' '}
            {data.typography.pairingRationale}
          </div>
        </div>

        {/* Mood, Art Direction & Banned Cliches */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Mood & Aesthetic Direction</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Keywords:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {data.moodAndComposition.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-800/80 border border-slate-700/60 text-slate-200 px-2.5 py-1 rounded-md"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-300">
                <span className="font-semibold text-slate-200">Layout Style:</span>{' '}
                {data.moodAndComposition.layoutStyle}
              </div>

              <div className="text-xs text-slate-300">
                <span className="font-semibold text-slate-200">Imagery Art Direction:</span>{' '}
                {data.moodAndComposition.imageryStyle}
              </div>
            </div>
          </div>

          {/* Banned Visual Anti-Patterns */}
          <div className="pt-3 border-t border-slate-800/60">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Banned Visual Anti-Patterns</span>
            </div>
            <ul className="space-y-1 text-xs text-rose-300/90">
              {data.antiPatterns.map((pat, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{pat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer disabled:opacity-50"
        >
          <span>Proceed to Stage 05: Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
