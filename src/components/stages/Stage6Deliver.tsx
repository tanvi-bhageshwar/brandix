import React, { useState } from 'react';
import { Download, Copy, Check, ShieldCheck, Printer, ArrowLeft, FileDown, Loader2 } from 'lucide-react';
import { Stage6DeliverData, Stage4VisualizeData, AppTheme } from '../../types/brandix';
import { generateBrandBookPdf } from '../../utils/pdfGenerator';

interface Stage6DeliverProps {
  data: Stage6DeliverData;
  visualData?: Stage4VisualizeData;
  onRestart: () => void;
  theme?: AppTheme;
}

export const Stage6Deliver: React.FC<Stage6DeliverProps> = ({
  data,
  visualData,
  onRestart,
  theme = 'midnight',
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [copiedFullDoc, setCopiedFullDoc] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExported, setPdfExported] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const brandName = data.executiveSummary.brandName;
  const isPaper = theme === 'paper';

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setPdfError(null);
    try {
      await generateBrandBookPdf(data, visualData);
      setPdfExported(true);
      setTimeout(() => setPdfExported(false), 3500);
    } catch (err: any) {
      console.error('Failed to generate PDF:', err);
      setPdfError(err?.message || 'Could not generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleExportJson = () => {
    const exportObject = {
      brandixVersion: '1.0',
      exportedAt: new Date().toISOString(),
      brandKit: data,
      visualSystem: visualData || null,
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-brand-kit.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const md = `# ${brandName} · Brand Intelligence Kit & Strategy Book
> ${data.executiveSummary.tagline}

**Elevator Pitch:** ${data.executiveSummary.oneLinePitch}
**Market Category:** ${data.executiveSummary.category}
**Launch Readiness:** ${data.readinessScore}/100

---

## 1. Executive Summary & Problem
- **Core Problem:** ${data.executiveSummary.coreProblem}
- **Target Audience:** ${data.executiveSummary.targetAudience}

---

## 2. Brand Positioning & Wedge
- **Value Proposition:** ${data.brandPositioning.valueProposition}
- **Key Differentiator:** ${data.brandPositioning.keyDifferentiator}
- **Contrarian Belief:** ${data.brandPositioning.contrarianBelief}

---

## 3. Brand Personality & Voice
- **Traits:** ${data.brandPersonality.traits.join(', ')}
- **Voice Style:** ${data.brandPersonality.voiceStyle}
- **Tone Guidelines:** ${data.brandPersonality.toneGuidelines}

---

## 4. Voice in Action (Sample Scenarios)
${data.voiceInAction
  .map(
    (item) => `### ${item.scenario}
> "${item.exampleCopy}"
*Tone Note: ${item.toneNote}*
`
  )
  .join('\n')}

---

## 5. Launch Assets & Headlines
- **Landing Page Hero:** "${data.launchAssets.landingPageHeroHeadline}"
- **Subheadline:** "${data.launchAssets.landingPageHeroSubhead}"
- **CTA:** "${data.launchAssets.primaryCallToAction}"

### Twitter / X Launch Post:
${data.launchAssets.twitterAnnouncement}

### LinkedIn Founder Post:
${data.launchAssets.linkedInAnnouncement}

---

## 6. Consistency Audit
- **Status:** ${data.consistencyAudit.passed ? 'PASSED' : 'FLAGGED'}
- **Friction Audited:** ${data.consistencyAudit.potentialFriction}
- **Resolution:** ${data.consistencyAudit.alignmentResolution}

Generated with Brandix Studio · Powered by Gemini Native JSON Pipeline
`;

    navigator.clipboard.writeText(md);
    setCopiedFullDoc(true);
    setTimeout(() => setCopiedFullDoc(false), 2500);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Direct print blocked in iframe, downloading PDF directly instead:', err);
      handleExportPdf();
    }
  };

  return (
    <div
      className={`space-y-10 animate-fadeIn print:space-y-6 ${
        isPaper ? 'text-slate-900' : 'text-slate-100'
      }`}
    >
      {/* Header & Export Toolbar */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between border-b pb-6 gap-4 print:hidden ${
          isPaper ? 'border-[#E4DFD5]' : 'border-slate-800'
        }`}
      >
        <div>
          <div
            className={`text-xs font-mono uppercase tracking-wider mb-1 ${
              isPaper ? 'text-amber-800 font-semibold' : 'text-amber-400'
            }`}
          >
            Stage 06 · Deliverable Brand Book
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold font-display tracking-tight ${
              isPaper ? 'text-slate-950' : 'text-white'
            }`}
          >
            The Definitive {brandName} Brand Kit
          </h2>
          <p className={`text-sm mt-1 ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
            Synthesized from 6 stages of structured AI reasoning into a complete, exportable brand asset.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-60 active:scale-95 ${
              isPaper
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
            title="Download high-resolution Brand Book PDF specification"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : pdfExported ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>{isExportingPdf ? 'Generating PDF…' : pdfExported ? 'PDF Downloaded!' : 'Export PDF'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              isPaper
                ? 'bg-white hover:bg-slate-100 border-[#DDD7CB] text-slate-800 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-200'
            }`}
            title="Copy entire kit as formatted Markdown"
          >
            {copiedFullDoc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFullDoc ? 'Copied Markdown!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              isPaper
                ? 'bg-white hover:bg-slate-100 border-[#DDD7CB] text-slate-800 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-200'
            }`}
            title="Download structured JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              isPaper
                ? 'bg-white hover:bg-slate-100 border-[#DDD7CB] text-slate-800 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-200'
            }`}
            title="Open browser print dialog or fallback to PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-between">
          <span>Failed to generate PDF: {pdfError}</span>
          <button
            onClick={() => setPdfError(null)}
            className="text-slate-400 hover:text-white font-mono px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Cover Card / Executive Summary */}
      <div
        className={`border rounded-3xl p-8 sm:p-12 relative overflow-hidden transition-all duration-200 ${
          isPaper
            ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F0] to-[#F5EFE4] border-[#D97706]/40 shadow-xl'
            : 'bg-gradient-to-br from-slate-900/90 via-[#0E1424] to-slate-950 border-amber-500/40 shadow-2xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center space-x-3">
              <span
                className={`text-xs uppercase font-mono tracking-widest px-2 py-0.5 rounded border ${
                  isPaper
                    ? 'text-amber-900 bg-amber-100 border-amber-300 font-semibold'
                    : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                }`}
              >
                Official Brand Guidelines
              </span>
              <span className={isPaper ? 'text-slate-400' : 'text-slate-400'}>·</span>
              <span className={`text-xs ${isPaper ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                {data.executiveSummary.category}
              </span>
            </div>

            <h1
              className={`text-4xl sm:text-6xl font-black font-display tracking-tight ${
                isPaper ? 'text-slate-950' : 'text-white'
              }`}
            >
              {brandName}
            </h1>

            <p
              className={`text-xl sm:text-2xl font-medium italic font-serif-display ${
                isPaper ? 'text-amber-900' : 'text-amber-200/90'
              }`}
            >
              "{data.executiveSummary.tagline}"
            </p>

            <p
              className={`text-sm sm:text-base leading-relaxed pt-2 ${
                isPaper ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {data.executiveSummary.oneLinePitch}
            </p>
          </div>

          {/* Readiness Score Gauge */}
          <div
            className={`border rounded-2xl p-6 text-center lg:min-w-[200px] shrink-0 ${
              isPaper ? 'bg-white border-[#E2DCCE] shadow-xs' : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div
              className={`text-[11px] font-mono uppercase tracking-wider mb-1 ${
                isPaper ? 'text-slate-600 font-semibold' : 'text-slate-400'
              }`}
            >
              Brand Launch Readiness
            </div>
            <div
              className={`text-5xl font-black font-display mb-1 ${
                isPaper ? 'text-emerald-700' : 'text-emerald-400'
              }`}
            >
              {data.readinessScore}
              <span className={`text-2xl font-normal ${isPaper ? 'text-slate-400' : 'text-slate-500'}`}>
                /100
              </span>
            </div>
            <div className={`text-xs ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
              Cross-Stage Consistency Verified
            </div>
          </div>
        </div>
      </div>

      {/* Visual Identity Strip if available */}
      {visualData && (
        <div
          className={`border rounded-2xl p-6 ${
            isPaper ? 'bg-white border-[#E4DFD5] shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                isPaper ? 'text-amber-900' : 'text-amber-400'
              }`}
            >
              Visual System Strip
            </div>
            <div className={`text-xs font-mono ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
              Typography: {visualData.typography.displayFont} + {visualData.typography.bodyFont}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {visualData.colorPalette.map((col, idx) => (
              <div
                key={idx}
                className={`rounded-xl overflow-hidden border ${
                  isPaper ? 'bg-[#F9F7F2] border-[#E2DCCE]' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="h-16 w-full" style={{ backgroundColor: col.hex }} />
                <div className="p-2.5">
                  <div
                    className={`text-xs font-bold truncate ${
                      isPaper ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {col.name}
                  </div>
                  <div
                    className={`text-[11px] font-mono ${
                      isPaper ? 'text-slate-600 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {col.hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Foundation: Problem, Audience & Positioning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Problem & Audience */}
        <div
          className={`border rounded-2xl p-6 space-y-4 ${
            isPaper ? 'bg-white border-[#E4DFD5] shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div
            className={`text-xs font-mono uppercase tracking-wider font-semibold ${
              isPaper ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Problem & Target Audience
          </div>
          <div>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isPaper ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Core Problem:
            </div>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isPaper ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              {data.executiveSummary.coreProblem}
            </p>
          </div>
          <div className={`pt-3 border-t ${isPaper ? 'border-[#EAE5DA]' : 'border-slate-800'}`}>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isPaper ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Target Audience:
            </div>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isPaper ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              {data.executiveSummary.targetAudience}
            </p>
          </div>
        </div>

        {/* Brand Positioning Wedge */}
        <div
          className={`border rounded-2xl p-6 space-y-4 ${
            isPaper ? 'bg-white border-[#E4DFD5] shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div
            className={`text-xs font-mono uppercase tracking-wider font-semibold ${
              isPaper ? 'text-emerald-800' : 'text-emerald-400'
            }`}
          >
            Positioning & Strategic Wedge
          </div>
          <div>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isPaper ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Value Proposition:
            </div>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isPaper ? 'text-emerald-900 font-medium' : 'text-emerald-200/90'
              }`}
            >
              {data.brandPositioning.valueProposition}
            </p>
          </div>
          <div className={`pt-3 border-t ${isPaper ? 'border-[#EAE5DA]' : 'border-slate-800'}`}>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isPaper ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Key Differentiator:
            </div>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isPaper ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              {data.brandPositioning.keyDifferentiator}
            </p>
          </div>
          <div className={`pt-3 border-t ${isPaper ? 'border-[#EAE5DA]' : 'border-slate-800'}`}>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isPaper ? 'text-amber-800' : 'text-amber-400'
              }`}
            >
              Contrarian Thesis:
            </div>
            <p
              className={`text-xs sm:text-sm italic leading-relaxed ${
                isPaper ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              "{data.brandPositioning.contrarianBelief}"
            </p>
          </div>
        </div>
      </div>

      {/* Personality & Tone Guidelines */}
      <div
        className={`border rounded-2xl p-6 sm:p-7 ${
          isPaper ? 'bg-white border-[#E4DFD5] shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div
          className={`text-xs font-mono uppercase tracking-wider mb-3 font-semibold ${
            isPaper ? 'text-amber-900' : 'text-amber-400'
          }`}
        >
          Personality & Tone of Voice
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.brandPersonality.traits.map((trait, idx) => (
            <span
              key={idx}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                isPaper
                  ? 'text-amber-900 bg-amber-50 border-amber-300'
                  : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
              }`}
            >
              {trait}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className={`text-xs ${isPaper ? 'text-slate-800' : 'text-slate-300'}`}>
            <strong className={`block mb-1 ${isPaper ? 'text-slate-950 font-bold' : 'text-white'}`}>
              Voice Style:
            </strong>
            {data.brandPersonality.voiceStyle}
          </div>
          <div className={`text-xs ${isPaper ? 'text-slate-800' : 'text-slate-300'}`}>
            <strong className={`block mb-1 ${isPaper ? 'text-slate-950 font-bold' : 'text-white'}`}>
              Tone Guidelines:
            </strong>
            {data.brandPersonality.toneGuidelines}
          </div>
        </div>
      </div>

      {/* Voice in Action (Sample Real-World Communications) */}
      <div
        className={`border rounded-2xl p-6 sm:p-7 ${
          isPaper ? 'bg-white border-[#E4DFD5] shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div
              className={`text-xs font-mono uppercase tracking-wider mb-1 font-semibold ${
                isPaper ? 'text-indigo-800' : 'text-indigo-400'
              }`}
            >
              Voice in Action
            </div>
            <h3
              className={`text-xl font-bold font-display ${
                isPaper ? 'text-slate-950' : 'text-white'
              }`}
            >
              Real-World Sample Communications
            </h3>
          </div>
          <span className={`text-xs font-mono hidden sm:block ${isPaper ? 'text-slate-500' : 'text-slate-400'}`}>
            Production-ready copy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.voiceInAction.map((sample, idx) => {
            const isCopied = copiedSnippet === `voice-${idx}`;
            return (
              <div
                key={idx}
                className={`border rounded-xl p-5 flex flex-col justify-between space-y-3 ${
                  isPaper
                    ? 'bg-[#FCFAF6] border-[#E6E0D4]'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-mono uppercase tracking-wider font-bold ${
                        isPaper ? 'text-amber-800' : 'text-amber-400'
                      }`}
                    >
                      {sample.scenario}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(sample.exampleCopy, `voice-${idx}`)}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isPaper
                          ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Copy sample copy"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed font-sans p-3 rounded-lg border ${
                      isPaper
                        ? 'bg-white border-[#DDD7CB] text-slate-900 font-medium'
                        : 'bg-slate-900/60 border-slate-800/60 text-slate-200'
                    }`}
                  >
                    "{sample.exampleCopy}"
                  </p>
                </div>
                <div
                  className={`text-[11px] pt-1 ${
                    isPaper ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  <span className={`font-medium ${isPaper ? 'text-slate-700' : 'text-slate-500'}`}>
                    Why it works:
                  </span>{' '}
                  {sample.toneNote}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Launch Copy Assets */}
      <div
        className={`border rounded-2xl p-6 sm:p-7 space-y-6 ${
          isPaper ? 'bg-white border-[#E4DFD5] shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div>
          <div
            className={`text-xs font-mono uppercase tracking-wider mb-1 font-semibold ${
              isPaper ? 'text-emerald-800' : 'text-emerald-400'
            }`}
          >
            Launch Assets
          </div>
          <h3
            className={`text-xl font-bold font-display ${
              isPaper ? 'text-slate-950' : 'text-white'
            }`}
          >
            Landing Page & Social Copy
          </h3>
        </div>

        {/* Landing Page Hero Pack */}
        <div
          className={`border rounded-xl p-5 space-y-3 ${
            isPaper ? 'bg-[#FCFAF6] border-[#E6E0D4]' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase font-semibold ${
                isPaper ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Landing Page Hero Headline & Subhead
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopyText(
                  `${data.launchAssets.landingPageHeroHeadline}\n${data.launchAssets.landingPageHeroSubhead}\nCTA: ${data.launchAssets.primaryCallToAction}`,
                  'hero'
                )
              }
              className={`text-xs flex items-center space-x-1 cursor-pointer ${
                isPaper ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              {copiedSnippet === 'hero' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Hero</span>
            </button>
          </div>

          <div
            className={`text-lg sm:text-xl font-bold font-display ${
              isPaper ? 'text-slate-950' : 'text-white'
            }`}
          >
            {data.launchAssets.landingPageHeroHeadline}
          </div>
          <p
            className={`text-xs sm:text-sm ${
              isPaper ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            {data.launchAssets.landingPageHeroSubhead}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleCopyText(data.launchAssets.primaryCallToAction, 'hero-cta-btn')}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 inline-flex items-center space-x-2 shadow-md cursor-pointer transition-all"
              title="Click to copy CTA and test interaction"
            >
              <span>{data.launchAssets.primaryCallToAction}</span>
              {copiedSnippet === 'hero-cta-btn' ? (
                <Check className="w-3.5 h-3.5 text-slate-950" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70" />
              )}
            </button>
            {copiedSnippet === 'hero-cta-btn' && (
              <span className="text-[11px] font-mono text-emerald-500 font-semibold animate-fadeIn">
                ✓ Call to Action copied to clipboard!
              </span>
            )}
          </div>
        </div>

        {/* Social Launch Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Twitter / X */}
          <div
            className={`border rounded-xl p-4 flex flex-col justify-between ${
              isPaper ? 'bg-[#FCFAF6] border-[#E6E0D4]' : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-mono uppercase font-bold ${
                    isPaper ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  Twitter / X Launch Post
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(data.launchAssets.twitterAnnouncement, 'twitter')}
                  className={`p-1 cursor-pointer ${
                    isPaper ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {copiedSnippet === 'twitter' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p
                className={`text-xs whitespace-pre-line leading-relaxed ${
                  isPaper ? 'text-slate-800' : 'text-slate-200'
                }`}
              >
                {data.launchAssets.twitterAnnouncement}
              </p>
            </div>
          </div>

          {/* LinkedIn */}
          <div
            className={`border rounded-xl p-4 flex flex-col justify-between ${
              isPaper ? 'bg-[#FCFAF6] border-[#E6E0D4]' : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-mono uppercase font-bold ${
                    isPaper ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  LinkedIn Founder Post
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(data.launchAssets.linkedInAnnouncement, 'linkedin')}
                  className={`p-1 cursor-pointer ${
                    isPaper ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {copiedSnippet === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p
                className={`text-xs whitespace-pre-line leading-relaxed ${
                  isPaper ? 'text-slate-800' : 'text-slate-200'
                }`}
              >
                {data.launchAssets.linkedInAnnouncement}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Consistency Audit */}
      <div
        className={`border rounded-2xl p-6 ${
          isPaper ? 'bg-white border-[#E4DFD5] shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div
          className={`flex items-center space-x-2 text-xs font-mono uppercase tracking-wider mb-2 font-semibold ${
            isPaper ? 'text-emerald-800' : 'text-emerald-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Brand Consistency Audit</span>
        </div>
        <div className={`space-y-2 text-xs ${isPaper ? 'text-slate-800' : 'text-slate-300'}`}>
          <div>
            <strong className={isPaper ? 'text-slate-600' : 'text-slate-400'}>
              Potential Tension Audited:
            </strong>{' '}
            {data.consistencyAudit.potentialFriction}
          </div>
          <div className="pt-1">
            <strong className={isPaper ? 'text-emerald-800 font-bold' : 'text-emerald-400'}>
              Alignment Resolution:
            </strong>{' '}
            {data.consistencyAudit.alignmentResolution}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t print:hidden ${
          isPaper ? 'border-[#E4DFD5]' : 'border-slate-800'
        }`}
      >
        <button
          onClick={onRestart}
          className={`flex items-center space-x-2 text-xs transition-colors cursor-pointer ${
            isPaper ? 'text-slate-600 hover:text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Run Another Startup Brand</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyMarkdown}
            className={`px-4 py-2.5 font-semibold text-xs rounded-xl transition-colors cursor-pointer border ${
              isPaper
                ? 'bg-white hover:bg-slate-100 text-slate-800 border-[#DDD7CB]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-transparent'
            }`}
          >
            {copiedFullDoc ? 'Copied Markdown' : 'Copy Full Brand Book'}
          </button>
          <button
            onClick={handleExportJson}
            className={`flex items-center space-x-1.5 px-4 py-2.5 font-semibold text-xs rounded-xl transition-colors cursor-pointer border ${
              isPaper
                ? 'bg-white hover:bg-slate-100 text-slate-800 border-[#DDD7CB]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-transparent'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-60 active:scale-95"
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : pdfExported ? (
              <Check className="w-4 h-4 text-slate-950" />
            ) : (
              <FileDown className="w-4 h-4 text-slate-950" />
            )}
            <span>{isExportingPdf ? 'Generating PDF…' : pdfExported ? 'PDF Downloaded!' : 'Export Brand Book (.pdf)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
