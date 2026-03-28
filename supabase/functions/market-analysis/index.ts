import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchNews(query: string): Promise<any> {
  const apiKey = Deno.env.get('NEWS_API_KEY');
  if (!apiKey) return { error: 'NEWS_API_KEY not set', articles: [] };
  
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return { error: `NewsAPI error: ${res.status}`, articles: [] };
    return await res.json();
  } catch (e) {
    return { error: String(e), articles: [] };
  }
}

async function fetchTrends(query: string): Promise<any> {
  const apiKey = Deno.env.get('SERP_API_KEY');
  if (!apiKey) return { error: 'SERP_API_KEY not set', trends: [] };
  
  try {
    const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(query)}&api_key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return { error: `SerpAPI error: ${res.status}`, trends: [] };
    return await res.json();
  } catch (e) {
    return { error: String(e), trends: [] };
  }
}

async function fetchReddit(query: string): Promise<any> {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=10`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MarketAnalyzer/1.0' }
    });
    if (!res.ok) return { error: `Reddit error: ${res.status}`, posts: [] };
    const data = await res.json();
    const posts = data?.data?.children?.map((c: any) => ({
      title: c.data.title,
      score: c.data.score,
      num_comments: c.data.num_comments,
      subreddit: c.data.subreddit,
      url: c.data.url,
      created: c.data.created_utc,
    })) || [];
    return { posts };
  } catch (e) {
    return { error: String(e), posts: [] };
  }
}

async function fetchTwitter(query: string): Promise<any> {
  const apiKey = Deno.env.get('TWITTER_API_KEY');
  if (!apiKey) return { error: 'TWITTER_API_KEY not set', tweets: [] };
  
  try {
    const url = `https://api.x.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=created_at,public_metrics`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!res.ok) return { error: `Twitter error: ${res.status}`, tweets: [] };
    return await res.json();
  } catch (e) {
    return { error: String(e), tweets: [] };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sources } = await req.json();
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const selectedSources = sources || ['news', 'trends', 'reddit', 'twitter'];
    const results: Record<string, any> = {};

    const promises: Promise<void>[] = [];
    
    if (selectedSources.includes('news')) {
      promises.push(fetchNews(query).then(r => { results.news = r; }));
    }
    if (selectedSources.includes('trends')) {
      promises.push(fetchTrends(query).then(r => { results.trends = r; }));
    }
    if (selectedSources.includes('reddit')) {
      promises.push(fetchReddit(query).then(r => { results.reddit = r; }));
    }
    if (selectedSources.includes('twitter')) {
      promises.push(fetchTwitter(query).then(r => { results.twitter = r; }));
    }

    await Promise.all(promises);

    return new Response(JSON.stringify({ query, results, timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
