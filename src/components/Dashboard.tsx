import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Newspaper, MessageCircle, BarChart3, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchMarketAnalysis, MarketAnalysisResult } from '@/lib/api';
import { toast } from 'sonner';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<MarketAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await fetchMarketAnalysis(query);
      setData(result);
    } catch (err: any) {
      toast.error('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search market data... (e.g., Tesla, iPhone, Bitcoin)"
          className="bg-card border-border"
        />
        <Button onClick={handleSearch} disabled={loading} className="gradient-primary border-0 shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {!data && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Newspaper, title: 'News Analysis', desc: 'Real-time news from 80,000+ sources', color: 'text-primary' },
            { icon: BarChart3, title: 'Google Trends', desc: 'Search interest & trending topics', color: 'text-accent' },
            { icon: MessageCircle, title: 'Social Sentiment', desc: 'Reddit & Twitter buzz analysis', color: 'text-destructive' },
          ].map((item, i) => (
            <Card key={i} className="glass">
              <CardContent className="flex flex-col items-center text-center py-8">
                <item.icon className={`w-10 h-10 ${item.color} mb-3`} />
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {data && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Results for "{data.query}"</h2>
            <Badge variant="outline" className="text-xs">{new Date(data.timestamp).toLocaleString()}</Badge>
          </div>

          {/* News */}
          {data.results.news?.articles && data.results.news.articles.length > 0 && (
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Newspaper className="w-4 h-4 text-primary" /> Latest News
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.results.news.articles.map((article, i) => (
                  <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" 
                     className="block p-3 rounded-lg hover:bg-accent/50 transition-colors border border-transparent hover:border-border">
                    <p className="font-medium text-sm text-foreground">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{article.source?.name}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Reddit */}
          {data.results.reddit?.posts && data.results.reddit.posts.length > 0 && (
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="w-4 h-4 text-accent" /> Reddit Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.results.reddit.posts.map((post, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                    <div className={`flex flex-col items-center ${post.score > 0 ? 'text-primary' : 'text-destructive'}`}>
                      {post.score > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="text-xs font-bold">{post.score}</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{post.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">r/{post.subreddit}</Badge>
                        <span className="text-xs text-muted-foreground">{post.num_comments} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
