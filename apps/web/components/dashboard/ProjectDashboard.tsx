'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EvmCalculator } from './EvmCalculator';
import { RiskHeatmap } from './RiskHeatmap';
import { ChangeOrderAnalyzer } from './ChangeOrderAnalyzer';
import { McpPipelineVisualizer } from '../diagrams/McpPipelineVisualizer';

export function ProjectDashboard({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Downtown Office Tower</h1>
          <p className="text-white/60 mt-1">Project ID: {projectId}</p>
        </div>
        <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30">
          ✓ On Track
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h2 className="text-sm font-semibold text-white mb-3">MCP Agent Pipeline</h2>
        <McpPipelineVisualizer />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">🏛️ Strategic Overview</TabsTrigger>
          <TabsTrigger value="tactical">⚙️ Tactical Analysis</TabsTrigger>
          <TabsTrigger value="operational">🔧 Operational Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Financial Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">CPI:</span>
                    <span className="text-green-400 font-bold">1.05</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">SPI:</span>
                    <span className="text-yellow-400 font-bold">0.98</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Budget:</span>
                    <span className="text-white">$12.5M / $12M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Risk Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskHeatmap projectId={projectId} />
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-purple-500/20 text-purple-300 px-3 py-2 rounded border border-purple-500/30">
                    <strong>Design-Build</strong> advised for this project
                  </div>
                  <p className="text-xs text-white/60">
                    Based on complexity, timeline constraints, and risk analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-24 text-sm text-white/60">Foundation</div>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <div className="w-16 text-sm text-green-400">Complete</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 text-sm text-white/60">Structure</div>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="w-16 text-sm text-blue-400">65%</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 text-sm text-white/60">MEP</div>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                  <div className="w-16 text-sm text-yellow-400">30%</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 text-sm text-white/60">Finishing</div>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }} />
                  </div>
                  <div className="w-16 text-sm text-white/40">Not Started</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tactical" className="mt-4">
          <ChangeOrderAnalyzer projectId={projectId} />
        </TabsContent>

        <TabsContent value="operational" className="mt-4">
          <EvmCalculator projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
