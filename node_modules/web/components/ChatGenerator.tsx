'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Copy,
  RefreshCw,
  Send,
  User,
} from 'lucide-react';

const SUGGESTIONS = [
  'I have an OpenAPI spec — generate types + a client wrapper.',
  'Create a user management API client (CRUD) with TypeScript.',
  'Generate a client for GET /users and GET /users/{id}.',
  'Convert this REST shape into Zod schemas.',
];

function extractCodeBlocks(text: string): Array<{ lang?: string; code: string }> {
  const blocks: Array<{ lang?: string; code: string }> = [];
  const re = /```(\w+)?\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    blocks.push({ lang: m[1], code: m[2].trimEnd() });
  }
  return blocks;
}

type UiMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatGenerator() {
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Tell me what you're building (or paste an OpenAPI snippet). I'll generate types + a minimal client + optional hooks.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  const headerText = useMemo(() => {
    if (error) return error;
    if (isLoading) return 'Generating…';
    return 'Describe your API in plain English.';
  }, [error, isLoading]);

  const onCopyFirstBlock = async (content: string) => {
    const blocks = extractCodeBlocks(content);
    if (!blocks.length) return;
    await navigator.clipboard.writeText(blocks[0].code);
    setCopied('Copied');
    window.setTimeout(() => setCopied(null), 1200);
  };

  const startNewSession = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setError(null);
    setIsLoading(false);
    setMessages([messages[0]].filter(Boolean));
  };

  const send = async () => {
    if (isLoading) return;
    const text = input.trim();
    if (!text) return;

    setError(null);

    const userMsg: UiMessage = { id: `${Date.now()}-u`, role: 'user', content: text };
    const assistantId = `${Date.now()}-a`;
    const assistantMsg: UiMessage = { id: assistantId, role: 'assistant', content: '' };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const msg = await res.text().catch(() => 'Request failed.');
        throw new Error(msg || 'Request failed.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
        );
      }
    } catch (e) {
      if ((e as any)?.name === 'AbortError') {
        setError('Stopped.');
      } else {
        setError(e instanceof Error ? e.message : 'Request failed.');
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10'>
      <section className='glass-card border-white/10 overflow-hidden'>
        <div className='p-4 md:p-6 border-b border-white/10 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg border border-white/10 bg-white/5'>
              <Bot className='w-5 h-5 text-white' />
            </div>
            <div>
              <h1 className='text-xl md:text-2xl font-bold tracking-tight'>phnxbyte AI Assistant</h1>
              <p className='text-sm text-white/50 mt-1'>{headerText}</p>
            </div>
          </div>

          <button
            type='button'
            onClick={startNewSession}
            className='inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/80'
            title='Clear chat'
          >
            <RefreshCw className='w-4 h-4' />
            New Session
          </button>
        </div>

        <div className='p-4 md:p-6'>
          <div className='min-h-95 max-h-[55vh] overflow-y-auto pr-1 space-y-4'>
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === 'user' ? 'flex gap-3 justify-end' : 'flex gap-3'}
              >
                <div
                  className={
                    m.role === 'user'
                      ? 'hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black'
                      : 'hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/10'
                  }
                >
                  {m.role === 'user' ? (
                    <User className='w-4 h-4' />
                  ) : (
                    <Bot className='w-4 h-4 text-white/80' />
                  )}
                </div>

                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[90%] md:max-w-[78%] rounded-2xl bg-white text-black px-4 py-3 whitespace-pre-wrap'
                      : 'max-w-[90%] md:max-w-[78%] rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white/90'
                  }
                >
                  <div className='text-xs opacity-70 mb-1'>
                    {m.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className='text-sm leading-relaxed whitespace-pre-wrap'>{m.content}</div>

                  {m.role === 'assistant' && extractCodeBlocks(m.content).length > 0 && (
                    <div className='mt-3 flex items-center justify-end gap-2'>
                      <button
                        type='button'
                        onClick={() => void onCopyFirstBlock(m.content)}
                        className='inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/80 text-sm'
                      >
                        <Copy className='w-4 h-4' />
                        {copied ?? 'Copy code'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className='flex gap-3'>
                <div className='hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/10'>
                  <Bot className='w-4 h-4 text-white/80' />
                </div>
                <div className='rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white/70'>
                  <div className='flex gap-2 items-center'>
                    <span className='inline-block w-2 h-2 rounded-full bg-white/60 animate-bounce' />
                    <span
                      className='inline-block w-2 h-2 rounded-full bg-white/60 animate-bounce'
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className='inline-block w-2 h-2 rounded-full bg-white/60 animate-bounce'
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className='mt-5'>
            <div className='text-xs text-white/50 mb-2'>Try a prompt:</div>
            <div className='flex flex-wrap gap-2 mb-4'>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type='button'
                  onClick={() => setInput(s)}
                  className='px-3 py-1.5 text-xs rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/70'
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className='rounded-2xl border border-white/10 bg-black/20 p-2'
            >
              <div className='flex gap-2 items-end'>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Describe your API or paste OpenAPI…'
                  className='flex-1 resize-none bg-transparent border-none outline-none text-white placeholder:text-white/40 p-3 max-h-40'
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                />
                <button
                  type='submit'
                  disabled={isLoading || input.trim().length === 0}
                  className='px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50'
                  title='Send'
                >
                  <Send className='w-5 h-5' />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
