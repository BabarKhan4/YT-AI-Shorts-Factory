import { VideoJob } from "./types";

export const SAMPLE_JOBS: VideoJob[] = [
  {
    id: "london_secret_001",
    title: "London's Five-Foot House?",
    description: "Discovering London's narrowest house and its hidden history.",
    hashtags: ["#london", "#architecture", "#secrets"],
    output_filename: "london_secret_001.mp4",
    impact_words: ["TINY", "HIDDEN", "STUNNING"],
    script_sections: {
      hook: "Did you know London has a house only five feet wide?",
      tension: "Most people walk right past it, never noticing the entrance.",
      reveal: "But inside, it's a multi-million-dollar architectural marvel.",
      underground: "It was built in a narrow gap between two existing townhouses.",
      cta: "Subscribe for more hidden city secrets!"
    },
    section_queries: {
      hook: ["narrow house london", "five foot house", "tiny architecture"],
      tension: ["london street walking", "hidden doorway london"],
      reveal: ["modern luxury interior", "architectural model house"],
      underground: ["london historical map", "construction timelapse"],
      cta: ["london skyline night", "subscribe button animation"]
    },
    status: "pending",
    privacy_status: "private"
  }
];
