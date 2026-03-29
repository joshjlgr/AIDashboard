import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const AVATAR_URL = "https://media.base44.com/images/public/69bec7fbf108d9139d5095f9/79b4b9a49_generated_image.png";

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    generateGreeting();
  }, []);

  const generateGreeting = async () => {
    setIsLoading(true);
    const now = new Date();
    const hour = now.getHours();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a warm, friendly personal AI assistant named Aria. It's ${timeOfDay} on ${dayName}, ${dateStr}. 
      Give a brief, warm greeting and suggest 3-4 productive things the user could do today. 
      Be encouraging, personal, and concise. Use a friendly tone like you're talking to a close friend.
      Format the suggestions as a short bulleted list. Keep the whole response under 100 words.`,
    });
    setGreeting(res);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are Aria, a warm and helpful personal AI assistant. Be concise, friendly, and actionable. 
      The user says: "${userMsg}"
      
      Previous conversation context: ${messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}
      
      Respond helpfully in under 80 words.`,
    });
    
    setMessages(prev => [...prev, { role: "assistant", content: res }]);
    setIsLoading(false);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-primary/5">
      {/* Header */}
      <div className="p-5 border-b border-border/50 flex items-center gap-4">
        <div className="relative">
          <img
            src={AVATAR_URL}
            alt="Aria"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-card"
          />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-card" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-lg">Aria</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-accent" />
            Your personal AI assistant
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Greeting */}
        {greeting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <img src={AVATAR_URL} alt="" className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0" />
            <div className="bg-secondary/80 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
              <ReactMarkdown className="text-sm prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {greeting}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {!greeting && isLoading && (
          <div className="flex gap-3 items-center">
            <img src={AVATAR_URL} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <div className="bg-secondary/80 rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Conversation */}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <img src={AVATAR_URL} alt="" className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0" />
              )}
              <div className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-secondary/80 rounded-tl-sm'
              }`}>
                <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  {msg.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex gap-3 items-center">
            <img src={AVATAR_URL} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <div className="bg-secondary/80 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aria anything..."
            className="flex-1 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}