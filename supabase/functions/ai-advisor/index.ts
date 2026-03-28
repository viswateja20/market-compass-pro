import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getMarketData(query: string) {
  const newsKey = Deno.env.get('NEWS_API_KEY');
  const serpKey = Deno.env.get('SERP_API_KEY');
  
  const results: string[] = [];

  // Fetch news
  if (newsKey) {
    try {
      const res = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5&apiKey=${newsKey}`);
      if (res.ok) {
        const data = await res.json();
        const headlines = data.articles?.map((a: any) => `- ${a.title} (${a.source?.name})`).join('\n') || 'No articles found';
        results.push(`**Recent News:**\n${headlines}`);
      }
    } catch (_) {}
  }

  // Fetch trends
  if (serpKey) {
    try {
      const res = await fetch(`https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(query)}&api_key=${serpKey}`);
      if (res.ok) {
        const data = await res.json();
        results.push(`**Google Trends Data:** Interest over time data available`);
      }
    } catch (_) {}
  }

  // Fetch Reddit sentiment
  try {
    const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=5`, {
      headers: { 'User-Agent': 'MarketAdvisor/1.0' }
    });
    if (res.ok) {
      const data = await res.json();
      const posts = data?.data?.children?.slice(0, 5).map((c: any) => 
        `- [${c.data.score > 0 ? '👍' : '👎'} ${c.data.score}] ${c.data.title} (r/${c.data.subreddit})`
      ).join('\n') || 'No posts found';
      results.push(`**Reddit Sentiment:**\n${posts}`);
    }
  } catch (_) {}

  return results.join('\n\n');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract potential stock/product/company names from the message
    const marketData = await getMarketData(message);

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are an expert financial advisor and market analyst AI. Your job is to help users make informed investment and product decisions.

IMPORTANT RULES:
1. ALWAYS start your response with a clear "✅ YES" or "❌ NO" recommendation, then explain in detail.
2. Base your analysis on the real-time market data provided below.
3. Analyze company growth, market trends, social sentiment, and news.
4. Provide specific actionable advice - whether to buy, sell, hold, or invest.
5. Include risk assessment and potential returns.
6. Be confident but honest about uncertainties.
7. If asked about stocks, predict based on current data and trends.
8. Suggest alternatives when appropriate.

REAL-TIME MARKET DATA FOR THIS QUERY:
${marketData || 'No real-time data available for this query. Provide analysis based on general knowledge.'}

Remember: Start with YES or NO, then provide detailed analysis with reasoning.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    const aiResponse = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      return new Response(JSON.stringify({ error: `AI API error: ${aiResponse.status} - ${errText}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || 'Unable to generate response';

    return new Response(JSON.stringify({ reply, marketData: marketData ? 'included' : 'unavailable' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
