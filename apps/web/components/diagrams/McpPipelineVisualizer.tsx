'use client';
import ReactFlow, { Node, Edge, Controls, Background, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 50, y: 200 },
    data: { label: '🎯 User Query' },
    type: 'input',
    style: { background: '#1e293b', color: 'white', border: '2px solid #3b82f6' },
  },
  {
    id: '2',
    position: { x: 300, y: 50 },
    data: { label: '🏛️ Tier 1: Strategic\nFrameworks • Governance\nProject Delivery Methods' },
    style: { background: '#7c3aed', color: 'white', padding: 20 },
  },
  {
    id: '3',
    position: { x: 300, y: 200 },
    data: { label: '⚙️ Tier 2: Tactical\nChange Orders • Analysis\nRisk Assessment' },
    style: { background: '#2563eb', color: 'white', padding: 20 },
  },
  {
    id: '4',
    position: { x: 300, y: 350 },
    data: { label: '🔧 Tier 3: Operational\nEVM • Calculations\nDocument Search' },
    style: { background: '#0891b2', color: 'white', padding: 20 },
  },
  {
    id: '5',
    position: { x: 550, y: 200 },
    data: { label: '✅ Synthesized Answer' },
    type: 'output',
    style: { background: '#059669', color: 'white', border: '2px solid #10b981' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'Strategic?', animated: true },
  { id: 'e1-3', source: '1', target: '3', label: 'Tactical?', animated: true },
  { id: 'e1-4', source: '1', target: '4', label: 'Operational?', animated: true },
  { id: 'e2-5', source: '2', target: '5', style: { stroke: '#7c3aed' } },
  { id: 'e3-5', source: '3', target: '5', style: { stroke: '#2563eb' } },
  { id: 'e4-5', source: '4', target: '5', style: { stroke: '#0891b2' } },
];

export function McpPipelineVisualizer() {
  return (
    <div style={{ height: 500, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: '#0f172a' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Background color="#1e293b" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
