'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Risk {
  id: string;
  name: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
}

const mockRisks: Risk[] = [
  { id: '1', name: 'Weather Delays', likelihood: 4, impact: 3 },
  { id: '2', name: 'Material Shortage', likelihood: 3, impact: 4 },
  { id: '3', name: 'Labor Strike', likelihood: 2, impact: 5 },
  { id: '4', name: 'Design Changes', likelihood: 3, impact: 3 },
  { id: '5', name: 'Permit Delays', likelihood: 2, impact: 2 },
];

export function RiskHeatmap({ projectId }: { projectId: string }) {
  const getColor = (score: number) => {
    if (score >= 15) return 'bg-red-500/80';
    if (score >= 9) return 'bg-orange-500/80';
    if (score >= 5) return 'bg-yellow-500/80';
    return 'bg-green-500/80';
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-sm">Risk Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mockRisks.map((risk) => {
            const score = risk.likelihood * risk.impact;
            return (
              <div key={risk.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getColor(score)}`} />
                <div className="text-xs text-white/70 flex-1">{risk.name}</div>
                <div className="text-xs text-white/50">
                  L:{risk.likelihood} I:{risk.impact}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
