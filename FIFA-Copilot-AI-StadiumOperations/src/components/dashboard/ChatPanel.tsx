import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateChatResponse } from '@/services/chatService';
import type { ChatContext, ChatMessage } from '@/lib/types';

interface ChatPanelProps {
  messages?: ChatMessage[];
  suggestions?: string[];
  context?: ChatContext;
  onSend?: (text: string) => void;
  className?: string;
}

export function ChatPanel({
  messages = [],
  suggestions = [],
  context,
  onSend,
  className,
}: ChatPanelProps) {
  const [draft, setDraft] = useState('');
  const [local, setLocal] = useState<ChatMessage[]>(messages);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setLocal(messages);
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [local, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLocal((prev) => [...prev, userMsg]);
    setDraft('');
    setTyping(true);

    window.setTimeout(() => {
      const response = context
        ? generateChatResponse(text, context)
        : 'Based on current telemetry, I am monitoring active incidents and pending recommendations. Connect live data for contextual responses.';

      const citations = context?.incidents.slice(0, 2).map((inc) => inc.code) ?? [];
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: citations.length > 0 ? citations : undefined,
      };

      setLocal((prev) => [...prev, aiMsg]);
      setTyping(false);
      onSend?.(text);
    }, 900);
  };

  return (
    <div className={cn('flex h-full flex-col rounded-xl border border-border bg-card', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
            <Bot className="h-4.5 w-4.5 text-primary" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-safe ring-2 ring-card" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Copilot</h3>
            <p className="text-[10px] text-muted-foreground">Operational intelligence assistant</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-safe/30 bg-safe/10 px-2.5 py-1 text-[10px] font-medium text-safe">
          <Sparkles className="h-3 w-3" /> Online
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="space-y-4 px-4 py-4">
          {local.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1',
                  msg.role === 'assistant'
                    ? 'bg-primary/15 text-primary ring-primary/25'
                    : 'bg-muted text-muted-foreground ring-border'
                )}
              >
                {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={cn('max-w-[80%]', msg.role === 'user' && 'text-right')}>
                <div
                  className={cn(
                    'inline-block rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                    msg.role === 'assistant'
                      ? 'rounded-tl-sm bg-background/60 text-foreground ring-1 ring-border'
                      : 'rounded-tr-sm bg-primary text-primary-foreground'
                  )}
                >
                  <p className="whitespace-pre-line text-left">{msg.content}</p>
                </div>
                <div className="mt-1 flex items-center gap-1.5 px-1">
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {msg.time}
                  </span>
                  {msg.citations && (
                    <span className="flex items-center gap-1">
                      {msg.citations.map((c) => (
                        <span
                          key={c}
                          className="rounded border border-border bg-background/40 px-1 py-0 font-mono text-[9px] text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/25">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-background/60 px-4 py-3 ring-1 ring-border">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-2.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(draft)}
          aria-label="Ask the AI Copilot"
          placeholder="Ask the AI Copilot…"
          className="h-9 flex-1 rounded-lg border border-border bg-background/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <Button size="icon" onClick={() => send(draft)} className="h-9 w-9" aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
