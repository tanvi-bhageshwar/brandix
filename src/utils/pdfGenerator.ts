import { jsPDF } from 'jspdf';
import { Stage6DeliverData, Stage4VisualizeData } from '../types/brandix';

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return [isNaN(r) ? 30 : r, isNaN(g) ? 41 : g, isNaN(b) ? 59 : b];
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [isNaN(r) ? 30 : r, isNaN(g) ? 41 : g, isNaN(b) ? 59 : b];
  }
  return [30, 41, 59];
}

export async function generateBrandBookPdf(
  data: Stage6DeliverData,
  visualData?: Stage4VisualizeData
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const brandName = data.executiveSummary.brandName || 'Brand';
  const tagline = data.executiveSummary.tagline || '';

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 30) {
      doc.addPage();
      y = margin + 20;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(`${brandName.toUpperCase()} · BRAND INTELLIGENCE SPECIFICATION`, margin, 32);

    doc.setFont('helvetica', 'normal');
    doc.text(`CONFIDENTIAL`, pageWidth - margin, 32, { align: 'right' });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 38, pageWidth - margin, 38);
  };

  // --- COVER BANNER / HERO ---
  // Top Accent bar
  doc.setFillColor(245, 158, 11); // Amber accent
  doc.rect(margin, y, contentWidth, 5, 'F');
  y += 18;

  // Category Pill
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, y, 180, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    (data.executiveSummary.category || 'BRAND IDENTITY').toUpperCase().slice(0, 36),
    margin + 8,
    y + 12
  );
  y += 28;

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(brandName, margin, y + 10);
  y += 38;

  // Tagline
  if (tagline) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(217, 119, 6); // Amber-600
    doc.text(`“${tagline}”`, margin, y);
    y += 24;
  }

  // Pitch Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  const pitchLines = doc.splitTextToSize(data.executiveSummary.oneLinePitch || '', contentWidth - 24);
  const pitchBoxHeight = pitchLines.length * 14 + 20;
  doc.roundedRect(margin, y, contentWidth, pitchBoxHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('ELEVATOR POSITIONING', margin + 12, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(pitchLines, margin + 12, y + 30);
  y += pitchBoxHeight + 20;

  // Section divider helper
  const drawSectionTitle = (num: string, title: string) => {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(217, 119, 6); // Amber 600
    doc.text(`SECTION ${num}`, margin, y);
    y += 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, y);
    y += 10;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
  };

  // --- SECTION 01: STRATEGIC CONTEXT & PROBLEM ---
  drawSectionTitle('01', 'Strategic Foundation & Core Problem');

  // Core Problem Box
  checkPageBreak(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('The Underlying Problem:', margin, y);
  y += 13;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const probLines = doc.splitTextToSize(data.executiveSummary.coreProblem, contentWidth);
  doc.text(probLines, margin, y);
  y += probLines.length * 12 + 14;

  // Target Audience Box
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Primary Target Audience:', margin, y);
  y += 13;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const audLines = doc.splitTextToSize(data.executiveSummary.targetAudience, contentWidth);
  doc.text(audLines, margin, y);
  y += audLines.length * 12 + 22;

  // --- SECTION 02: POSITIONING & WEDGE ---
  drawSectionTitle('02', 'Strategic Positioning & Value Proposition');

  const addField = (label: string, value: string) => {
    const valLines = doc.splitTextToSize(value, contentWidth - 10);
    const needed = valLines.length * 12 + 22;
    checkPageBreak(needed);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(label, margin, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(valLines, margin, y);
    y += valLines.length * 12 + 12;
  };

  addField('Core Value Proposition:', data.brandPositioning.valueProposition);
  addField('Key Differentiator / Unfair Advantage:', data.brandPositioning.keyDifferentiator);
  addField('Contrarian Belief & Philosophy:', data.brandPositioning.contrarianBelief);
  y += 10;

  // --- SECTION 03: BRAND PERSONALITY & VOICE ---
  drawSectionTitle('03', 'Brand Personality & Voice System');

  // Traits Pills
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Core Personality Pillars:', margin, y);
  y += 14;

  let traitX = margin;
  data.brandPersonality.traits.forEach((t) => {
    const pillW = doc.getTextWidth(t) + 16;
    if (traitX + pillW > pageWidth - margin) {
      traitX = margin;
      y += 22;
    }
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(traitX, y - 10, pillW, 16, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(t, traitX + 8, y + 1);
    traitX += pillW + 8;
  });
  y += 24;

  addField('Voice Archetype & Style:', data.brandPersonality.voiceStyle);
  addField('Communication & Tone Guidelines:', data.brandPersonality.toneGuidelines);
  y += 10;

  // --- SECTION 04: VOICE IN ACTION ---
  if (data.voiceInAction && data.voiceInAction.length > 0) {
    drawSectionTitle('04', 'Voice in Action (Scenario Applications)');

    data.voiceInAction.forEach((sample) => {
      const copyLines = doc.splitTextToSize(`“${sample.exampleCopy}”`, contentWidth - 28);
      const noteLines = doc.splitTextToSize(`Tone Note: ${sample.toneNote}`, contentWidth - 28);
      const cardHeight = copyLines.length * 11 + noteLines.length * 10 + 38;

      checkPageBreak(cardHeight);

      // Card Box
      doc.setFillColor(250, 250, 250);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 5, 5, 'FD');

      // Scenario header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(sample.scenario, margin + 14, y + 16);

      // Example Copy
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(copyLines, margin + 14, y + 30);

      // Tone Note
      const noteY = y + 30 + copyLines.length * 11 + 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(noteLines, margin + 14, noteY);

      y += cardHeight + 12;
    });
    y += 10;
  }

  // --- SECTION 05: VISUAL IDENTITY & COLOR SYSTEM ---
  if (visualData) {
    drawSectionTitle('05', 'Visual Identity & Design Tokens');

    // Typography
    checkPageBreak(70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Typographic System:', margin, y);
    y += 14;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Display / Headline Font: ${visualData.typography.displayFont}`, margin, y);
    y += 12;
    doc.text(`Body / Interface Font: ${visualData.typography.bodyFont}`, margin, y);
    y += 14;

    const typoRationale = doc.splitTextToSize(visualData.typography.pairingRationale, contentWidth);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(typoRationale, margin, y);
    y += typoRationale.length * 10 + 16;

    // Color Swatches
    if (visualData.colorPalette && visualData.colorPalette.length > 0) {
      checkPageBreak(90);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Color Palette Tokens:', margin, y);
      y += 16;

      const swatchWidth = Math.min(84, (contentWidth - (visualData.colorPalette.length - 1) * 8) / visualData.colorPalette.length);
      const swatchHeight = 36;
      let swatchX = margin;

      visualData.colorPalette.forEach((swatch) => {
        const [r, g, b] = hexToRgb(swatch.hex);
        doc.setFillColor(r, g, b);
        doc.roundedRect(swatchX, y, swatchWidth, swatchHeight, 4, 4, 'F');

        // Hex & Name below swatch
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(swatch.hex.toUpperCase(), swatchX, y + swatchHeight + 11);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        const roleLabel = swatch.role.length > 15 ? swatch.role.slice(0, 15) + '…' : swatch.role;
        doc.text(roleLabel, swatchX, y + swatchHeight + 21);

        swatchX += swatchWidth + 8;
      });

      y += swatchHeight + 36;
    }
  }

  // --- SECTION 06: LAUNCH ASSETS ---
  drawSectionTitle('06', 'Launch Copy & Market Assets');

  addField('Hero Headline:', data.launchAssets.landingPageHeroHeadline);
  addField('Hero Subheadline:', data.launchAssets.landingPageHeroSubhead);
  addField('Primary Call to Action (CTA):', data.launchAssets.primaryCallToAction);

  // Social posts
  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Twitter / X Launch Announcement:', margin, y);
  y += 12;

  const twLines = doc.splitTextToSize(data.launchAssets.twitterAnnouncement, contentWidth);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(twLines, margin, y);
  y += twLines.length * 11 + 16;

  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('LinkedIn Founder Announcement:', margin, y);
  y += 12;

  const liLines = doc.splitTextToSize(data.launchAssets.linkedInAnnouncement, contentWidth);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(liLines, margin, y);
  y += liLines.length * 11 + 20;

  // --- SECTION 07: READINESS & AUDIT ---
  drawSectionTitle('07', 'Consistency Audit & Launch Readiness');

  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(data.consistencyAudit.passed ? 16 : 220, data.consistencyAudit.passed ? 149 : 38, data.consistencyAudit.passed ? 84 : 38);
  doc.text(
    `AUDIT STATUS: ${data.consistencyAudit.passed ? 'PASSED · ALL TOKENS ALIGNED' : 'FLAGGED FOR REVIEW'} (${data.readinessScore}/100 READINESS)`,
    margin,
    y
  );
  y += 14;

  addField('Friction Audited:', data.consistencyAudit.potentialFriction);
  addField('Strategic Resolution:', data.consistencyAudit.alignmentResolution);
  y += 15;

  // Add Footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Skip drawing header on page 1
    if (i > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`${brandName.toUpperCase()} · BRAND INTELLIGENCE SPECIFICATION`, margin, 26);
      doc.setFont('helvetica', 'normal');
      doc.text('CONFIDENTIAL', pageWidth - margin, 26, { align: 'right' });
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, 30, pageWidth - margin, 30);
    }

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated by Brandix Studio · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      margin,
      pageHeight - 16
    );

    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 16, { align: 'right' });
  }

  // Trigger browser download
  const safeFilename = `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brand-book.pdf`;
  doc.save(safeFilename);
}
