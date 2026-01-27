'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EvmMetrics {
  pv: number; // Planned Value
  ev: number; // Earned Value
  ac: number; // Actual Cost
  cpi: number; // Cost Performance Index
  spi: number; // Schedule Performance Index
  cv: number; // Cost Variance
  sv: number; // Schedule Variance
}

export function EvmCalculator({ projectId }: { projectId: string }) {
  const [pv, setPv] = useState<string>('1000000');
  const [ev, setEv] = useState<string>('950000');
  const [ac, setAc] = useState<string>('980000');
  const [metrics, setMetrics] = useState<EvmMetrics | null>(null);

  const calculateEvm = () => {
    const plannedValue = parseFloat(pv);
    const earnedValue = parseFloat(ev);
    const actualCost = parseFloat(ac);

    const cpi = earnedValue / actualCost;
    const spi = earnedValue / plannedValue;
    const cv = earnedValue - actualCost;
    const sv = earnedValue - plannedValue;

    setMetrics({
      pv: plannedValue,
      ev: earnedValue,
      ac: actualCost,
      cpi,
      spi,
      cv,
      sv,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Earned Value Management Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-white/70">Planned Value (PV)</label>
              <Input
                type="number"
                value={pv}
                onChange={(e) => setPv(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Earned Value (EV)</label>
              <Input
                type="number"
                value={ev}
                onChange={(e) => setEv(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Actual Cost (AC)</label>
              <Input
                type="number"
                value={ac}
                onChange={(e) => setAc(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={calculateEvm} className="w-full">
            Calculate Metrics
          </Button>

          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-xs text-white/50">CPI</div>
                <div className={`text-2xl font-bold ${metrics.cpi >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.cpi.toFixed(2)}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-xs text-white/50">SPI</div>
                <div className={`text-2xl font-bold ${metrics.spi >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.spi.toFixed(2)}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-xs text-white/50">Cost Variance</div>
                <div className={`text-2xl font-bold ${metrics.cv >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(metrics.cv / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-xs text-white/50">Schedule Variance</div>
                <div className={`text-2xl font-bold ${metrics.sv >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(metrics.sv / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
