'use client';

import { useState } from 'react';

interface AgentMetadata {
  tier: number;
  queryType: string;
  evmCalculated: boolean;
  frameworks: string[];
}

export default function ConstructionAgentUI() {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');
  const [metadata, setMetadata] = useState<AgentMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  const examplePrompts = [
    {
      category: 'TIER 1 - Strategic',
      prompts: [
        'What project delivery method should we use for a $50M hospital with aggressive schedule?',
        'Explain how Earned Value Management can help us track project health',
      ]
    },
    {
      category: 'TIER 2 - Tactical',
      prompts: [
        'Evaluate this change order: Steel reinforcement increased 15% due to revised loading. Claimed cost $125,000, claimed time 14 days.',
        'Analyze the delay on critical path - concrete pour was delayed 5 days due to rain',
      ]
    },
    {
      category: 'TIER 3 - Operational',
      prompts: [
        'Calculate EVM metrics: BAC: $1,000,000, PV: $400,000, EV: $350,000, AC: $380,000',
        'Calculate markup on change order: Labor $45,000, Materials $55,000, Equipment $8,000. O&P 15%, Sub markup 10%',
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setMetadata(null);

    try {
      const res = await fetch('/api/construction-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data.response);
        setMetadata(data.metadata || null);
      } else {
        setResponse(`Error: ${data.error} - ${data.details || ''}`);
      }
    } catch (error) {
      setResponse(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getTierBadgeColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-purple-500/30 text-purple-200 border-purple-400/30';
      case 2: return 'bg-blue-500/30 text-blue-200 border-blue-400/30';
      case 3: return 'bg-green-500/30 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/30 text-gray-200 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 text-white">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🏗️ Construction AI Agent
            </span>
          </h1>
          <p className="text-white/60">
            Three-Tier MCP Architecture • Strategic → Tactical → Operational
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="glass-panel p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white/90">Knowledge Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-400/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span className="font-semibold text-purple-200">TIER 1: Strategic</span>
              </div>
              <p className="text-sm text-white/60">Frameworks, Governance, Standards</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="font-semibold text-blue-200">TIER 2: Tactical</span>
              </div>
              <p className="text-sm text-white/60">Methodologies, Analysis, Processes</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-400/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="font-semibold text-green-200">TIER 3: Operational</span>
              </div>
              <p className="text-sm text-white/60">Calculations, Tasks, Execution</p>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="glass-panel p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white/90">Example Prompts by Tier</h2>
          <div className="space-y-4">
            {examplePrompts.map((category, i) => (
              <div key={i}>
                <h3 className={`text-sm font-medium mb-2 ${
                  i === 0 ? 'text-purple-300' : i === 1 ? 'text-blue-300' : 'text-green-300'
                }`}>{category.category}</h3>
                <div className="space-y-2">
                  {category.prompts.map((example, j) => (
                    <button
                      key={j}
                      onClick={() => setPrompt(example)}
                      className={`block w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                        i === 0 
                          ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-100 border border-purple-400/20' 
                          : i === 1 
                          ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-100 border border-blue-400/20'
                          : 'bg-green-500/10 hover:bg-green-500/20 text-green-100 border border-green-400/20'
                      }`}
                      type="button"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Project Context (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 text-white placeholder-white/40 transition-all"
              placeholder="e.g., Project: Downtown Office Tower, Phase: Structural"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Your Query
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 h-32 text-white placeholder-white/40 transition-all resize-none"
              placeholder="Ask about project delivery methods, analyze change orders, calculate EVM metrics..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading 
                ? 'bg-white/10 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze with MCP Framework'
            )}
          </button>
        </form>

        {/* Response */}
        {response && (
          <div className="glass-card p-6">
            {/* Metadata Header */}
            {metadata && (
              <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeColor(metadata.tier)}`}>
                  Tier {metadata.tier}: {metadata.queryType.charAt(0).toUpperCase() + metadata.queryType.slice(1)}
                </span>
                {metadata.evmCalculated && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                    EVM Calculated
                  </span>
                )}
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-4 text-white/90">Analysis Response</h2>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-white/80 leading-relaxed font-mono text-sm bg-white/5 p-4 rounded-lg border border-white/10 max-h-[600px] overflow-y-auto">
                {response}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
