'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AnalysisResult {
  justification: string;
  costAssessment: string;
  scheduleImpact: string;
  riskFlags: string[];
  recommendation: 'approve' | 'deny' | 'request_info';
  confidence: number;
}

export function ChangeOrderAnalyzer({ projectId }: { projectId: string }) {
  const [description, setDescription] = useState('');
  const [claimedCost, setClaimedCost] = useState('');
  const [claimedDays, setClaimedDays] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeChangeOrder = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-change-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          changeDescription: description,
          claimedCost: parseFloat(claimedCost),
          claimedTimeDays: parseFloat(claimedDays),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Tactical Change Order Analyzer</CardTitle>
          <p className="text-sm text-white/60">
            AI-powered analysis of change order justification, cost, and schedule impact
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Change Order Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the change order (e.g., 'Additional steel reinforcement required due to unforeseen soil conditions')"
              className="mt-1 min-h-24"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">Claimed Cost ($)</label>
              <Input
                type="number"
                value={claimedCost}
                onChange={(e) => setClaimedCost(e.target.value)}
                placeholder="50000"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Claimed Time Impact (days)</label>
              <Input
                type="number"
                value={claimedDays}
                onChange={(e) => setClaimedDays(e.target.value)}
                placeholder="15"
                className="mt-1"
              />
            </div>
          </div>
          <Button
            onClick={analyzeChangeOrder}
            disabled={analyzing || !description || !claimedCost}
            className="w-full"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Change Order'}
          </Button>

          {result && (
            <div className="mt-6 space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Recommendation</h3>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    result.recommendation === 'approve'
                      ? 'bg-green-500/20 text-green-400'
                      : result.recommendation === 'deny'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {result.recommendation.toUpperCase().replace('_', ' ')} (
                  {(result.confidence * 100).toFixed(0)}% confidence)
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Justification Assessment</h3>
                <p className="text-sm text-white/70">{result.justification}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Cost Assessment</h3>
                <p className="text-sm text-white/70">{result.costAssessment}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Schedule Impact</h3>
                <p className="text-sm text-white/70">{result.scheduleImpact}</p>
              </div>
              {result.riskFlags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Risk Flags</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {result.riskFlags.map((flag, i) => (
                      <li key={i} className="text-sm text-red-400">
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
