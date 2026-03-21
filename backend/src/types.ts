export interface Source extends RawSource {
  bias: string;
  contradictory?: boolean;
}

export type AnalyzeResponse = {
  verdict: "Verified" | "Likely Misleading" | "Fake" | "Unknown";
  confidence: number;
  validated_summary: string;
  claim_summary: string;
  sources: Source[];
  tip?: string;
};

export type RawSource = {
  id: string;
  title: string;
  description: string;
  link: string;
  favicon: string;
  snippet: string;
  source: string;
};
