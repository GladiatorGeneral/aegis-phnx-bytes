'use client';

import { useState } from 'react';

export default function ConstructionAgentUI() {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');
  const [steps, setSteps] = useState<Array<{toolName: string; toolResult: any}>>([]);
  const [loading, setLoading] = useState(false);

  const examplePrompts = [
    'Process this invoice: https://example.com/docs/invoice-123.pdf',
    'Check if our roof drainage spec complies with IBC 2021',
    'Client emailed: "We need to add 3 more windows ASAP, budget around $5,000"',
    'Generate cash flow forecast for project PROJ-2024-001 for next 6 months'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setSteps([]);

    try {
      const res = await fetch('/api/construction-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data.response);
        setSteps(data.steps || []);
      } else {
        setResponse(`Error: ${data.error} - ${data.details || ''}`);
      }
    } catch (error) {
      setResponse(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">🏗️ Construction AI Agent</h1>
        <p className="text-gray-600 mb-6">Powered by DeepSeek & Vercel AI SDK</p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Example Prompts</h2>
          <div className="space-y-2">
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded text-sm text-blue-800 transition-colors"
                type="button"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context (Optional - Project ID, Phase, etc.)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="e.g., Project: PROJ-2024-001, Phase: Foundation"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Request
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-gray-900"
              placeholder="Describe what you need help with..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Send to AI Agent'}
          </button>
        </form>

        {response && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Response</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">{response}</p>
            </div>

            {steps.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Tool Usage</h3>
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <div key={i} className="bg-gray-50 rounded p-4 border border-gray-200">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md mb-2 font-mono">
                        {step.toolName}
                      </span>
                      <pre className="text-xs overflow-x-auto text-gray-700 bg-gray-100 p-2 rounded">
                        {JSON.stringify(step.toolResult, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
