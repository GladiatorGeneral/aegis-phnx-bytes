'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle,
  ChevronRight,
  Cloud,
  Cpu,
  FileCode,
  GitBranch,
  Package,
  Settings,
  Zap,
} from 'lucide-react';

type Tab = 'generate' | 'projects' | 'settings';

type FrameworkId = 'react' | 'vue' | 'svelte' | 'angular' | 'node';

const frameworks: Array<{ id: FrameworkId; label: string; color: string }> = [
  { id: 'react', label: 'React', color: 'bg-blue-500' },
  { id: 'vue', label: 'Vue', color: 'bg-green-500' },
  { id: 'svelte', label: 'Svelte', color: 'bg-orange-500' },
  { id: 'angular', label: 'Angular', color: 'bg-red-500' },
  { id: 'node', label: 'Node.js', color: 'bg-green-600' },
];

const features = [
  { id: 'types', label: 'TypeScript Types', description: 'Interfaces and DTOs' },
  { id: 'hooks', label: 'React Hooks', description: 'Dependency-free hooks' },
  { id: 'zod', label: 'Zod Schemas', description: 'Runtime validators' },
  { id: 'client', label: 'Fetch Client', description: 'Minimal typed client' },
  { id: 'adapters', label: 'Adapters', description: 'Map DTOs → view models' },
] as const;

const recentProjects = [
  { name: 'user-service', lastGenerated: '2 hours ago', endpointCount: 12 },
  { name: 'payment-api', lastGenerated: '1 day ago', endpointCount: 8 },
  { name: 'inventory-system', lastGenerated: '3 days ago', endpointCount: 24 },
];

export default function VSCodeSidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [selectedFramework, setSelectedFramework] = useState<FrameworkId>('react');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'types',
    'client',
    'hooks',
    'zod',
  ]);

  const detected = useMemo(
    () => ({ fileName: 'openapi.yaml', path: '/project/specs/openapi.yaml' }),
    []
  );

  return (
    <div className='h-190 w-90 bg-[#0f1115] text-gray-200 flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl'>
      <div className='p-4 border-b border-white/10 bg-black/20'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg'>
            <Cpu className='w-5 h-5' />
          </div>
          <div>
            <div className='font-bold text-lg leading-tight'>phnxbyte</div>
            <div className='text-xs text-gray-400'>Type-safe client generator</div>
          </div>
        </div>
      </div>

      <div className='flex border-b border-white/10'>
        <button
          onClick={() => setActiveTab('generate')}
          className={
            activeTab === 'generate'
              ? 'flex-1 py-3 flex flex-col items-center gap-1 bg-white/5 text-purple-300'
              : 'flex-1 py-3 flex flex-col items-center gap-1 hover:bg-white/5 text-gray-300'
          }
        >
          <FileCode className='w-4 h-4' />
          <span className='text-xs'>Generate</span>
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={
            activeTab === 'projects'
              ? 'flex-1 py-3 flex flex-col items-center gap-1 bg-white/5 text-blue-300'
              : 'flex-1 py-3 flex flex-col items-center gap-1 hover:bg-white/5 text-gray-300'
          }
        >
          <Package className='w-4 h-4' />
          <span className='text-xs'>Projects</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={
            activeTab === 'settings'
              ? 'flex-1 py-3 flex flex-col items-center gap-1 bg-white/5 text-green-300'
              : 'flex-1 py-3 flex flex-col items-center gap-1 hover:bg-white/5 text-gray-300'
          }
        >
          <Settings className='w-4 h-4' />
          <span className='text-xs'>Settings</span>
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        {activeTab === 'generate' && (
          <div className='space-y-6'>
            <div className='rounded-xl p-4 border border-white/10 bg-white/5'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                  <FileCode className='w-4 h-4 text-blue-300' />
                  <span className='text-sm font-medium'>Detected File</span>
                </div>
                <span className='text-xs text-gray-400'>{detected.fileName}</span>
              </div>
              <div className='text-xs text-gray-400 p-2 bg-black/30 rounded font-mono overflow-x-auto'>
                {detected.path}
              </div>
            </div>

            <div>
              <div className='flex items-center gap-2 mb-3'>
                <Package className='w-4 h-4 text-purple-300' />
                <span className='text-sm font-medium'>Target Framework</span>
              </div>
              <div className='grid grid-cols-3 gap-2'>
                {frameworks.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setSelectedFramework(fw.id)}
                    className={
                      selectedFramework === fw.id
                        ? 'p-3 rounded-lg border border-purple-500/40 bg-white/5'
                        : 'p-3 rounded-lg border border-white/10 bg-white/5 hover:border-white/20'
                    }
                  >
                    <div className='flex items-center justify-between'>
                      <span className='text-xs'>{fw.label}</span>
                      <div className={`w-2 h-2 rounded-full ${fw.color}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className='flex items-center gap-2 mb-3'>
                <Zap className='w-4 h-4 text-yellow-300' />
                <span className='text-sm font-medium'>Generate</span>
              </div>
              <div className='space-y-2'>
                {features.map((f) => {
                  const checked = selectedFeatures.includes(f.id);
                  return (
                    <label
                      key={f.id}
                      className={
                        checked
                          ? 'flex items-center gap-3 p-3 rounded-lg border border-purple-500/30 bg-white/5 cursor-pointer'
                          : 'flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 cursor-pointer'
                      }
                    >
                      <input
                        type='checkbox'
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeatures([...selectedFeatures, f.id]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter((x) => x !== f.id));
                          }
                        }}
                        className='hidden'
                      />
                      <div
                        className={
                          checked
                            ? 'w-5 h-5 rounded border border-purple-500 bg-purple-500 flex items-center justify-center'
                            : 'w-5 h-5 rounded border border-white/20 flex items-center justify-center'
                        }
                      >
                        {checked && <CheckCircle className='w-3 h-3 text-white' />}
                      </div>
                      <div className='flex-1'>
                        <div className='text-sm'>{f.label}</div>
                        <div className='text-xs text-gray-400'>{f.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              className='w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-shadow flex items-center justify-center gap-2'
              onClick={() => {
                // Placeholder: actual extension would call the generator.
                // We keep the UI interactive for now.
                void 0;
              }}
            >
              <Zap className='w-4 h-4' />
              Generate Client
            </button>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>Recent Projects</h3>
              <button className='text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1'>
                <Cloud className='w-3 h-3' />
                Sync All
              </button>
            </div>

            {recentProjects.map((p) => (
              <div
                key={p.name}
                className='rounded-xl p-4 border border-white/10 bg-white/5 hover:border-white/20 transition-colors'
              >
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <GitBranch className='w-4 h-4 text-blue-300' />
                    <span className='font-mono text-sm'>{p.name}</span>
                  </div>
                  <ChevronRight className='w-4 h-4 text-gray-500' />
                </div>
                <div className='flex items-center justify-between text-xs text-gray-400'>
                  <span>{p.endpointCount} endpoints</span>
                  <span>Updated {p.lastGenerated}</span>
                </div>
              </div>
            ))}

            <button className='w-full py-2 text-center border border-dashed border-white/15 rounded-xl text-gray-400 hover:text-gray-300 hover:border-white/25 transition-colors'>
              + Add New Project
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className='space-y-4'>
            <div className='rounded-xl p-4 border border-white/10 bg-white/5'>
              <h3 className='font-medium mb-3'>Code Generation</h3>
              <div className='space-y-3'>
                <label className='flex items-center justify-between gap-3'>
                  <span className='text-sm'>Type Safety</span>
                  <select className='bg-black/40 border border-white/10 rounded px-2 py-1 text-xs'>
                    <option>Strict</option>
                    <option>Moderate</option>
                    <option>Loose</option>
                  </select>
                </label>
                <label className='flex items-center justify-between gap-3'>
                  <span className='text-sm'>Auto-Format</span>
                  <input type='checkbox' defaultChecked />
                </label>
                <label className='flex items-center justify-between gap-3'>
                  <span className='text-sm'>Include Comments</span>
                  <input type='checkbox' defaultChecked />
                </label>
              </div>
            </div>

            <div className='rounded-xl p-4 border border-white/10 bg-white/5'>
              <h3 className='font-medium mb-3'>Integration</h3>
              <div className='space-y-2'>
                <button className='w-full text-left p-2 rounded bg-black/30 hover:bg-black/40 transition-colors text-sm'>
                  Connect to Vercel
                </button>
                <button className='w-full text-left p-2 rounded bg-black/30 hover:bg-black/40 transition-colors text-sm'>
                  GitHub Actions Setup
                </button>
                <button className='w-full text-left p-2 rounded bg-black/30 hover:bg-black/40 transition-colors text-sm'>
                  VS Code Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='p-3 border-t border-white/10 text-xs text-gray-400 bg-black/20'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
            <span>Ready</span>
          </div>
          <span>v0.1.0</span>
        </div>
      </div>
    </div>
  );
}
