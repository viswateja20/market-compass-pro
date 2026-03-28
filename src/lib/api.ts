import { supabase } from "@/integrations/supabase/client";

export interface MarketAnalysisResult {
  query: string;
  results: {
    news?: { articles?: Array<{ title: string; description: string; url: string; source: { name: string }; publishedAt: string }> };
    trends?: any;
    reddit?: { posts?: Array<{ title: string; score: number; num_comments: number; subreddit: string; url: string }> };
    twitter?: { data?: Array<{ text: string; public_metrics?: any }> };
  };
  timestamp: string;
}

export async function fetchMarketAnalysis(query: string, sources?: string[]): Promise<MarketAnalysisResult> {
  const { data, error } = await supabase.functions.invoke('market-analysis', {
    body: { query, sources },
  });
  if (error) throw new Error(error.message);
  return data;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(message: string, conversationHistory: ChatMessage[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-advisor', {
    body: { message, conversationHistory },
  });
  if (error) throw new Error(error.message);
  return data.reply;
}
