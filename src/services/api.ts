import {
  Stage1DiscoverData,
  Stage2PositionData,
  Stage3ShapeData,
  Stage4VisualizeData,
  Stage5ChallengeData,
  Stage6DeliverData,
} from '../types/brandix';

async function postJson<T>(url: string, body: any): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || `HTTP error ${response.status}`);
  }

  return json.data as T;
}

export const api = {
  async runStage1Discover(rawIdea: string): Promise<Stage1DiscoverData> {
    return postJson<Stage1DiscoverData>('/api/pipeline/stage1-discover', { rawIdea });
  },

  async runStage2Position(payload: {
    rawIdea: string;
    stage1Data: Stage1DiscoverData;
    userAnswers: Record<string, string>;
  }): Promise<Stage2PositionData> {
    return postJson<Stage2PositionData>('/api/pipeline/stage2-position', payload);
  },

  async runStage3Shape(payload: {
    rawIdea: string;
    stage1Data: Stage1DiscoverData;
    stage2Data: Stage2PositionData;
    userSteering?: string;
  }): Promise<Stage3ShapeData> {
    return postJson<Stage3ShapeData>('/api/pipeline/stage3-shape', payload);
  },

  async runStage4Visualize(payload: {
    rawIdea: string;
    stage1Data: Stage1DiscoverData;
    stage2Data: Stage2PositionData;
    stage3Data: Stage3ShapeData;
    selectedName?: string;
  }): Promise<Stage4VisualizeData> {
    return postJson<Stage4VisualizeData>('/api/pipeline/stage4-visualize', payload);
  },

  async runStage5Challenge(payload: {
    rawIdea: string;
    stage1Data: Stage1DiscoverData;
    stage2Data: Stage2PositionData;
    stage3Data: Stage3ShapeData;
    stage4Data: Stage4VisualizeData;
    selectedName?: string;
  }): Promise<Stage5ChallengeData> {
    return postJson<Stage5ChallengeData>('/api/pipeline/stage5-challenge', payload);
  },

  async runStage6Deliver(payload: {
    rawIdea: string;
    stage1Data: Stage1DiscoverData;
    stage2Data: Stage2PositionData;
    stage3Data: Stage3ShapeData;
    stage4Data: Stage4VisualizeData;
    stage5Data: Stage5ChallengeData;
    selectedName?: string;
    selectedDecisions?: Record<string, string>;
  }): Promise<Stage6DeliverData> {
    return postJson<Stage6DeliverData>('/api/pipeline/stage6-deliver', payload);
  },

  async checkHealth(): Promise<{ status: string; hasApiKey: boolean }> {
    const res = await fetch('/api/health');
    return res.json();
  },
};
