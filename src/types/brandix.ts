export interface TargetAudience {
  primary: string;
  characteristics: string[];
  buyerVsUser: string;
}

export interface OpenQuestion {
  id: string;
  question: string;
  context: string;
  quickChoices: string[];
  userAnswer?: string;
}

export interface Stage1DiscoverData {
  coreProblem: string;
  targetAudience: TargetAudience;
  context: string;
  constraints: string[];
  underlyingValue: string;
  openQuestions: OpenQuestion[];
}

export interface CompetitiveAngle {
  statusQuo: string;
  theirWeakness: string;
  ourCounterMove: string;
}

export interface Stage2PositionData {
  category: string;
  keyDifferentiator: string;
  valueProposition: string;
  competitiveAngle: CompetitiveAngle;
  positioningStatement: string;
  strategicPillars: string[];
}

export interface PersonalityTrait {
  trait: string;
  description: string;
  audienceRationale: string;
}

export interface NamingDirection {
  name: string;
  type: string;
  rationale: string;
  vibeScore: string;
}

export interface Stage3ShapeData {
  personalityTraits: PersonalityTrait[];
  traitsToAvoid: string[];
  namingDirections: NamingDirection[];
  taglineOptions: string[];
  selectedTagline: string;
  oneLinePitch: string;
}

export interface TypographyConfig {
  displayFont: string;
  bodyFont: string;
  pairingRationale: string;
  sampleHeading: string;
  sampleBody: string;
}

export interface ColorSwatch {
  role: string;
  name: string;
  hex: string;
  psychologicalReasoning: string;
}

export interface MoodAndComposition {
  keywords: string[];
  layoutStyle: string;
  imageryStyle: string;
}

export interface Stage4VisualizeData {
  typography: TypographyConfig;
  colorPalette: ColorSwatch[];
  moodAndComposition: MoodAndComposition;
  antiPatterns: string[];
}

export interface ClicheItem {
  cliche: string;
  whyRisky: string;
  remedy: string;
}

export interface StrategistPerspective {
  proponentName: string;
  coreArgument: string;
  opportunities: string[];
  recommendedRefinements: string[];
}

export interface CriticPerspective {
  criticName: string;
  harshTruth: string;
  vulnerabilities: string[];
  stressTestVerdict: string;
}

export interface ActionableDecision {
  id: string;
  topic: string;
  criticWarning: string;
  strategistAdvice: string;
  recommendedAction: string;
  userSelection?: 'strategist' | 'critic' | 'balanced' | 'custom';
  customNotes?: string;
}

export interface Stage5ChallengeData {
  debateSummary: string;
  clichesIdentified: ClicheItem[];
  perspectiveStrategist: StrategistPerspective;
  perspectiveCritic: CriticPerspective;
  actionableDecisions: ActionableDecision[];
}

export interface VoiceSample {
  scenario: string;
  exampleCopy: string;
  toneNote: string;
}

export interface LaunchAssets {
  landingPageHeroHeadline: string;
  landingPageHeroSubhead: string;
  primaryCallToAction: string;
  twitterAnnouncement: string;
  linkedInAnnouncement: string;
}

export interface ConsistencyAudit {
  passed: boolean;
  potentialFriction: string;
  alignmentResolution: string;
}

export interface Stage6DeliverData {
  executiveSummary: {
    brandName: string;
    category: string;
    tagline: string;
    oneLinePitch: string;
    coreProblem: string;
    targetAudience: string;
  };
  brandPositioning: {
    valueProposition: string;
    keyDifferentiator: string;
    contrarianBelief: string;
  };
  brandPersonality: {
    traits: string[];
    voiceStyle: string;
    toneGuidelines: string;
  };
  voiceInAction: VoiceSample[];
  launchAssets: LaunchAssets;
  consistencyAudit: ConsistencyAudit;
  readinessScore: number;
}

export type PipelineStage = 1 | 2 | 3 | 4 | 5 | 6;

export type AppTheme = 'midnight' | 'paper';

export interface BrandixSession {
  rawIdea: string;
  currentStage: PipelineStage;
  completedStages: number[];
  stage1?: Stage1DiscoverData;
  stage2?: Stage2PositionData;
  stage3?: Stage3ShapeData;
  stage4?: Stage4VisualizeData;
  stage5?: Stage5ChallengeData;
  stage6?: Stage6DeliverData;
  selectedBrandName?: string;
  selectedTagline?: string;
  selectedDecisions?: Record<string, string>;
}
