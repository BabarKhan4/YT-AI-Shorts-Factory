export interface Settings {
  workspace: string;
  outputPath: string;
  cachePath: string;
  queuePath: string;
  pexelsKey: string;
  pixabayKey: string;
  preferredProvider: 'pexels' | 'pixabay';
  ollamaUrl: string;
  ollamaModel: string;
  resolution: string;
  fps: number;
  isSetupComplete: boolean;
  n8nEnabled: boolean;
  n8nWebhookUrl: string;
}

export interface VideoJob {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  output_filename: string;
  impact_words: string[];
  script_sections: {
    hook: string;
    tension: string;
    reveal: string;
    underground: string;
    cta: string;
  };
  section_queries: {
    hook: string[];
    tension: string[];
    reveal: string[];
    underground: string[];
    cta: string[];
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  privacy_status: 'private' | 'public' | 'unlisted';
  completed_at?: string;
  error?: string;
}
