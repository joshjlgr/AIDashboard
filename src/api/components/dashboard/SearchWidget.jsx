import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Globe, Loader2, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function SearchWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setResults(null);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Search the internet for: "${query}". Provide a clear, concise summary of the most relevant and up-to-date information. Include key facts, recent developments if any, and useful context. Keep it under 150 words. Format with markdown for readability.`,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
    });

    setResults(res);
    setIsLoading(false);
  };

  return (
    <Card className="h-full border-0 shadow-lg flex flex-col overflow-hidden">
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Web Search</h2>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !query.trim()} className="rounded-xl bg-primary">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-5 min-h-0">
        {!results && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-primary/30" />
            </div>
            <p className="text-sm text-muted-foreground">Search the web for anything</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Get instant AI-powered summaries</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Searching the web...</p>
          </div>
        )}

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Results for "{query}"</span>
              </div>
              <ReactMarkdown className="text-sm prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {results}
              </ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}