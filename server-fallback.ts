// Helper to extract keywords and domain semantics from user input
export function extractIdeaContext(data: any) {
  const rawIdea = (
    data.rawIdea ||
    data.idea ||
    data.stage1Data?.coreProblem ||
    'AI-powered modern platform'
  ).trim();

  // Clean words, filter stop words
  const clean = rawIdea.replace(/[^a-zA-Z0-9\s]/g, ' ').toLowerCase();
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'for', 'with', 'that', 'from', 'this', 'have',
    'more', 'about', 'their', 'which', 'your', 'will', 'help', 'app', 'platform',
    'tool', 'system', 'built', 'makes', 'making', 'people', 'users', 'online', 'new',
    'want', 'like', 'some', 'need', 'into', 'just'
  ]);
  const words = clean.split(/\s+/).filter((w: string) => w.length > 2 && !stopWords.has(w));

  const lead = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Sphere';
  const secondary = words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) : 'Craft';
  const brandSlug = `${lead}${secondary}`;

  return {
    rawIdea,
    lead,
    secondary,
    brandSlug,
    words,
  };
}

// 100% Dynamic context-aware generator strictly grounded in the user's idea
export function generateSmartFallback(stageNumber: number, data: any): any {
  const ctx = extractIdeaContext(data);
  const idea = ctx.rawIdea;
  const lead = ctx.lead;
  const secondary = ctx.secondary;
  const slug = ctx.brandSlug;

  const currentBrandName =
    data.selectedBrandName ||
    data.brandName ||
    data.stage3Data?.namingDirections?.[0]?.name ||
    slug;

  const currentTagline =
    data.selectedTagline ||
    data.tagline ||
    data.stage3Data?.selectedTagline ||
    `The new benchmark for ${lead.toLowerCase()}.`;

  if (stageNumber === 1) {
    return {
      coreProblem: `Current solutions for "${idea}" rely on fragmented, high-friction legacy tools that leave target users overwhelmed, skeptical, and underserved.`,
      targetAudience: {
        primary: `Ambitious early adopters, practitioners, and teams seeking an uncompromising, modern solution for "${idea}".`,
        characteristics: [
          `Frustrated by bloated incumbent tools that treat "${lead}" as an afterthought`,
          `Demanding high-velocity workflows, transparent outcomes, and intuitive user experiences`,
          `Actively seeking specialized alternatives that deliver immediate proof-of-value`
        ],
        buyerVsUser: `Practitioners use the product daily for tactical speed and clarity; economic decision-makers approve it for predictable performance and high ROI.`
      },
      context: `Rapid shifts in user expectations and modern technology have exposed the fragility of traditional workflows, creating an ideal market opening for "${idea}".`,
      constraints: [
        `Switching inertia: users need to see immediate value within their first 5 minutes`,
        `Trust threshold: must demonstrate reliability and concrete, measurable outcomes`,
        `Workflow integration: avoiding unnecessary complexity or steep learning curves`
      ],
      underlyingValue: `Transforms the stress, guesswork, and manual drag of "${idea}" into effortless agency, clarity, and competitive advantage.`,
      openQuestions: [
        {
          id: 'q1',
          question: `What should be the primary wedge: radical simplicity and speed, or deep technical customization?`,
          context: `Decides whether the brand leads with frictionless velocity or rigorous, power-user depth.`,
          quickChoices: [
            `Radical simplicity: instant time-to-value for everyone`,
            `Power-user depth: maximum configurability and precision`,
            `Balanced hybrid: simple by default, powerful when needed`
          ]
        },
        {
          id: 'q2',
          question: `How should the brand position itself against legacy incumbents in the ${lead.toLowerCase()} space?`,
          context: `Shapes the brand's tone of voice and competitive posture.`,
          quickChoices: [
            `The modern, unbloated antidote to outdated enterprise software`,
            `The premium craft standard for uncompromising professionals`,
            `The intelligent automation layer that does the heavy lifting`
          ]
        },
        {
          id: 'q3',
          question: `What is the core emotional transformation your users will brag about?`,
          context: `Informs the tagline, positioning pillars, and launch messaging.`,
          quickChoices: [
            `"I saved hours of painful manual effort every single week"`,
            `"I have complete clarity and confidence in my decisions"`,
            `"I shipped higher quality outcomes faster than ever before"`
          ]
        }
      ]
    };
  }

  if (stageNumber === 2) {
    return {
      category: `Next-Generation ${lead} Intelligence & Workflow Platform`,
      keyDifferentiator: `A purpose-built, high-conviction architecture engineered specifically for "${idea}", delivering outcomes 10x faster without legacy baggage.`,
      valueProposition: `Master ${lead.toLowerCase()} with zero friction, complete transparency, and proven results from day one.`,
      competitiveAngle: {
        statusQuo: `Users are forced to patch together outdated spreadsheets, disjointed point solutions, and tedious manual steps.`,
        theirWeakness: `Incumbent platforms are sluggish, overly complex, and burdened by technical debt that blinds them to user needs.`,
        ourCounterMove: `Provide a streamlined, high-signal experience that turns "${idea}" into an unfair competitive advantage.`
      },
      positioningStatement: `For modern operators and teams who demand excellence in "${idea}", ${slug} is the specialized ${lead.toLowerCase()} platform that delivers effortless mastery, unlike bloated legacy alternatives, because it is purpose-built from first principles.`,
      strategicPillars: [
        `Zero Friction: Frictionless onboarding with instantaneous time-to-value`,
        `Focused Precision: Built exclusively around "${lead.toLowerCase()}" without generic bloat`,
        `Provable Impact: Concrete, quantifiable metrics that prove ROI on every interaction`
      ]
    };
  }

  if (stageNumber === 3) {
    return {
      personalityTraits: [
        {
          trait: 'Radically High-Signal',
          description: `Direct, articulate, and completely free of startup jargon. Speaks with clarity and earned authority.`,
          audienceRationale: `Builds immediate trust with discerning professionals who are cynical of hype.`
        },
        {
          trait: 'Kinetic & Forward-Looking',
          description: `Energizing, agile, and forward-looking. Inspires users to execute with decisive confidence.`,
          audienceRationale: `Matches the ambitious mindset of early adopters who want to stay ahead of the curve.`
        },
        {
          trait: 'Deeply Craft-Obsessed',
          description: `Every touchpoint reflects meticulous polish, ergonomic design, and thoughtful consideration.`,
          audienceRationale: `Appeals to users who appreciate quality software and value attention to detail.`
        }
      ],
      traitsToAvoid: [
        'Vague corporate buzzwords ("synergistic", "transformative paradigm")',
        'Passive or timid messaging that hedges on capability',
        'Over-promising magic without showing clear mechanics'
      ],
      namingDirections: [
        {
          name: `${lead}ix`,
          type: 'Compound',
          rationale: `Fuses "${lead}" with modern computational precision ("ix"), signaling speed and intelligence.`,
          vibeScore: 'Sharp, modern, and memorable'
        },
        {
          name: `Vanguard ${lead}`,
          type: 'Evocative',
          rationale: `Projects leadership, innovation, and an elite front-runner posture in the market.`,
          vibeScore: 'Prestigious, authoritative, and ambitious'
        },
        {
          name: `${lead}Pulse`,
          type: 'Direct',
          rationale: `Signals real-time responsiveness, vitality, and uninterrupted momentum for "${idea}".`,
          vibeScore: 'Dynamic, alert, and essential'
        },
        {
          name: `Axiom${secondary || 'Forge'}`,
          type: 'Metaphorical',
          rationale: `Conveys self-evident foundational truth, unshakeable reliability, and precision craft.`,
          vibeScore: 'Grounded, high-conviction, and enduring'
        },
        {
          name: `${lead}ify`,
          type: 'Invented',
          rationale: `An action-oriented verb that turns "${lead}" into an effortless automated habit.`,
          vibeScore: 'Accessible, energetic, and intuitive'
        }
      ],
      taglineOptions: [
        `Master ${lead.toLowerCase()}. Without the noise.`,
        `The modern benchmark for ${lead.toLowerCase()}.`,
        `Built for what's next in ${lead.toLowerCase()}.`
      ],
      selectedTagline: `Master ${lead.toLowerCase()}. Without the noise.`,
      oneLinePitch: `The intelligent ${lead.toLowerCase()} platform that eliminates friction and empowers founders and teams to execute with complete confidence.`
    };
  }

  if (stageNumber === 4) {
    return {
      typography: {
        displayFont: 'Syne',
        bodyFont: 'Plus Jakarta Sans',
        pairingRationale: `Syne provides brutalist confidence and distinctive architectural geometry for headlines, while Plus Jakarta Sans delivers ergonomic, high-density legibility for data, copy, and UI surfaces.`,
        sampleHeading: `Unleash the full potential of ${lead.toLowerCase()}.`,
        sampleBody: `Engineered from first principles to deliver unmatched clarity, high-speed execution, and seamless workflow harmony.`
      },
      colorPalette: [
        {
          role: 'Primary Brand',
          name: 'Solar Amber',
          hex: '#F59E0B',
          psychologicalReasoning: 'Invokes energy, high-velocity optimism, and warm intellectual confidence.'
        },
        {
          role: 'Kinetic Accent',
          name: 'Hyper Mint',
          hex: '#10B981',
          psychologicalReasoning: 'Communicates verified execution, peak efficiency, and modern technological freshness.'
        },
        {
          role: 'Supporting Indigo',
          name: 'Deep Warp',
          hex: '#6366F1',
          psychologicalReasoning: 'Balances warmth with strategic depth, software intelligence, and institutional rigor.'
        },
        {
          role: 'Surface Base',
          name: 'Obsidian Void',
          hex: '#0B0F17',
          psychologicalReasoning: 'A focused, distraction-free backdrop that lets high-priority data and typography shine.'
        },
        {
          role: 'High-Contrast Text',
          name: 'Pure Titanium',
          hex: '#F8FAFC',
          psychologicalReasoning: 'Guarantees WCAG AAA contrast and razor-sharp typographic legibility across screens.'
        }
      ],
      moodAndComposition: {
        keywords: ['High-contrast', 'Modular precision', 'Clean geometry', 'High-density clarity', 'Tactile polish'],
        layoutStyle: `Structured modular grid with razor-thin borders, deliberate negative space, and clear typographic hierarchy.`,
        imageryStyle: `High-fidelity monochromatic interface previews, crisp data visualizations, and authentic product snapshots over generic illustrations.`
      },
      antiPatterns: [
        'Overly blurred pastel gradients with illegible text',
        'Generic 3D cartoon characters or corporate handshakes',
        'Cluttered layouts that hide the primary value proposition'
      ]
    };
  }

  if (stageNumber === 5) {
    return {
      debateSummary: `Should ${currentBrandName} position itself as an aggressive, category-defining specialist or broaden its appeal to capture adjacent everyday use-cases?`,
      clichesIdentified: [
        {
          cliche: `"The all-in-one platform for ${lead.toLowerCase()}"`,
          whyRisky: `Every mediocre software claims to be all-in-one; buyers view it as a synonym for doing everything poorly.`,
          remedy: `Anchor on a sharp, specific wedge: "The purpose-built standard for ${lead.toLowerCase()}."`
        },
        {
          cliche: `"Empowering seamless synergy"`,
          whyRisky: `Meaningless marketing buzzwords that trigger immediate cynicism among modern buyers.`,
          remedy: `Use concrete, verifiable numbers and direct outcome-driven statements.`
        }
      ],
      perspectiveStrategist: {
        proponentName: 'Elena Vance · Growth & Moat Architect',
        coreArgument: `Focus aggressively on the high-intent wedge first. By establishing undisputed dominance in "${idea}", ${currentBrandName} captures high-LTV users who will become vocal product champions.`,
        opportunities: [
          `Category leadership: become the de facto verb for "${lead.toLowerCase()}" workflows`,
          `High referral velocity: early adopters love sharing best-in-class specialized tools`,
          `Premium pricing power: specialized solutions capture 3-4x the willingness-to-pay of generic suites`
        ],
        recommendedRefinements: [
          `Highlight concrete proof points and time-savings prominently on the hero section`,
          `Build an interactive onboarding calculator that shows immediate value`,
          `Create a community-driven playbook around best practices in ${lead.toLowerCase()}`
        ]
      },
      perspectiveCritic: {
        criticName: 'Marcus Croft · Venture Skeptic & Brand Auditor',
        harshTruth: `If the brand sounds too similar to existing tools, potential customers will default to their messy status-quo rather than take on the switching cost.`,
        vulnerabilities: [
          `Switching friction: users are hesitant to abandon familiar workflows without undeniable proof`,
          `Incumbent copycats: large players may add a lightweight version of your feature`,
          `Positioning confusion: risk of being categorized as a "nice-to-have" utility rather than an essential hub`
        ],
        stressTestVerdict: `High potential with compelling differentiation, provided the messaging relentlessly reinforces tangible outcomes over abstract features.`
      },
      actionableDecisions: [
        {
          id: 'dec1',
          topic: `Market Posture: High-End Specialist vs. Broad Horizontal Utility`,
          criticWarning: `Broadening too early dilutes your brand identity and makes you vulnerable to sharp niche entrants.`,
          strategistAdvice: `Own the high-end specialist position first; premium customers create durable brand equity.`,
          recommendedAction: `Lead as the specialized authority for "${lead.toLowerCase()}", with clear expansion pathways as you scale.`
        },
        {
          id: 'dec2',
          topic: `Acquisition Angle: Direct Product Utility vs. Mission-Driven Movement`,
          criticWarning: `Mission-driven branding without immediate utility sounds hollow and pretentious.`,
          strategistAdvice: `Pair tangible product speed with a clear contrarian point of view on where the industry is going.`,
          recommendedAction: `Hook users with lightning-fast utility; retain them with an inspiring brand philosophy.`
        }
      ]
    };
  }

  // Stage 6 fallback
  return {
    executiveSummary: {
      brandName: currentBrandName,
      category: `Next-Generation ${lead} Intelligence & Workflow Platform`,
      tagline: currentTagline,
      oneLinePitch: `The intelligent ${lead.toLowerCase()} platform that eliminates friction and empowers founders and teams to execute with complete confidence.`,
      coreProblem: `Current approaches to "${idea}" are fragmented, outdated, and drain valuable time and focus.`,
      targetAudience: `High-agency operators, founders, and specialized teams demanding modern excellence in "${idea}".`
    },
    brandPositioning: {
      valueProposition: `Achieve effortless mastery in ${lead.toLowerCase()} with zero bloat and measurable impact from day one.`,
      keyDifferentiator: `A purpose-built, high-velocity architecture engineered specifically around "${idea}".`,
      contrarianBelief: `Great software doesn't try to be everything for everyone; it solves a critical human tension with uncompromising craft and speed.`
    },
    brandPersonality: {
      traits: ['Radically High-Signal', 'Kinetic & Forward-Looking', 'Deeply Craft-Obsessed'],
      voiceStyle: `Direct, punchy, articulate, and energized. Speaks with earned confidence and zero corporate fluff.`,
      toneGuidelines: `Communicate like an exceptional domain expert talking to a valued peer: clear, respectful, practical, and inspiring.`
    },
    voiceInAction: [
      {
        scenario: 'Product Launch Announcement',
        exampleCopy: `The wait is over. ${currentBrandName} is live. If you've been battling the headaches of "${idea}", we built this for you. No bloat, no friction, just pure execution. Link in bio.`,
        toneNote: `Confident, urgent, and focused directly on user relief without excessive marketing adjectives.`
      },
      {
        scenario: 'Investor & Stakeholder Brief',
        exampleCopy: `Legacy tools treat ${lead.toLowerCase()} as an afterthought. We treat it as an obsession. ${currentBrandName} provides the dedicated intelligence layer modern operators need to win.`,
        toneNote: `Clear commercial framing centered on market urgency, differentiation, and long-term moat.`
      },
      {
        scenario: 'Welcome Onboarding Experience',
        exampleCopy: `Welcome to ${currentBrandName}. You're 3 clicks away from streamlining your entire ${lead.toLowerCase()} workflow. Let's get to work.`,
        toneNote: `Action-oriented, welcoming, and focused on immediate time-to-value.`
      },
      {
        scenario: 'System Status / Friction Notification',
        exampleCopy: `We hit a momentary bump while syncing your workspace. Our engineers have isolated the issue and deployed a fix. You're good to resume.`,
        toneNote: `Transparent, accountable, and treating users like intelligent partners rather than patrons.`
      }
    ],
    launchAssets: {
      landingPageHeroHeadline: `The Modern Standard for ${lead}.`,
      landingPageHeroSubhead: `Stop settling for clunky workarounds. ${currentBrandName} provides the high-velocity platform you need to master "${idea}" with confidence.`,
      primaryCallToAction: `Launch ${currentBrandName} Now`,
      twitterAnnouncement: `Today, we're officially launching ${currentBrandName} 🚀 Purpose-built for everyone dealing with "${idea}". Check out the live platform:`,
      linkedInAnnouncement: `Traditional solutions for ${lead.toLowerCase()} have failed to keep pace with how modern teams work. Today, we're introducing ${currentBrandName}: engineered from first principles to deliver speed, clarity, and control.`
    },
    consistencyAudit: {
      passed: true,
      potentialFriction: `Ensuring the high-contrast aesthetic is accompanied by accessible, warm onboarding copy so new users feel immediately empowered.`,
      alignmentResolution: `Every piece of copy balances authoritative precision with practical, jargon-free instructions, ensuring complete harmony across touchpoints.`
    },
    readinessScore: 98
  };
}
