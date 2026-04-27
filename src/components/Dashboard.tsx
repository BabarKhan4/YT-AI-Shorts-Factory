import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ListVideo, Film, Settings as SettingsIcon, 
  Terminal, Plus, Play, ExternalLink, Activity, Clock, 
  AlertCircle, CheckCircle2, ChevronRight, BarChart3
} from 'lucide-react';
import { Settings, VideoJob } from '../types';
import { QueueManager } from './QueueManager';
import { ScriptGenerator } from './ScriptGenerator';
import { motion } from 'motion/react';

interface DashboardProps {
  settings: Settings;
}

export function Dashboard({ settings }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'generate' | 'outputs' | 'logs'>('overview');
  const [jobs, setJobs] = useState<VideoJob[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/queue');
      const data = await res.json();
      setJobs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const startBatchRender = async () => {
    const pendingJobs = jobs.filter(j => j.status === 'pending');
    if (pendingJobs.length === 0) return alert("No pending jobs found!");

    const job = pendingJobs[0];

    try {
      await fetch('/api/render/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id })
      });
      fetchJobs();
      
      const interval = setInterval(async () => {
        const res = await fetch('/api/queue');
        if (!res.ok) return clearInterval(interval);
        const updatedJobs = await res.json();
        const currentJob = updatedJobs.find((j: VideoJob) => j.id === job.id);
        
        setJobs(updatedJobs);
        
        if (currentJob?.status === 'completed' || currentJob?.status === 'failed') {
          clearInterval(interval);
        }
      }, 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'queue', label: 'Queue', icon: ListVideo },
    { id: 'generate', label: 'Generator', icon: Film },
    { id: 'outputs', label: 'Outputs', icon: BarChart3 },
    { id: 'logs', label: 'Debug Logs', icon: Terminal },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#1f1f1f] flex flex-col p-4">
        <div className="flex items-center gap-3 px-4 py-6 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-400 rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-bold tracking-tight text-lg">ShortsFactory</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-[#1a1a1a] text-white border border-[#2a2a2a]' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeTab === item.id ? 'bg-rose-500' : 'bg-transparent'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#1f1f1f] pt-4">
          <div className="bg-[#111] p-3 rounded-xl border border-[#1f1f1f] mb-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Storage</div>
            <div className="h-1 bg-zinc-800 rounded-full mb-2"><div className="w-2/3 h-full bg-rose-500 rounded-full"></div></div>
            <div className="text-[10px] text-zinc-400">14.2 GB / 25 GB used</div>
          </div>
          <div className="flex items-center gap-2 px-1 text-xs text-zinc-500 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            Local Server Active
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white">
            <SettingsIcon className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#050505] p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Factory Overview
            </h1>
            <p className="text-zinc-500 text-sm">Monitoring {jobs.length} pending jobs across 3 local workers</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="text-xs text-zinc-400">Ollama</div>
              <div className="text-xs font-mono text-emerald-400">{settings.ollamaModel} (Active)</div>
            </div>
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-2 flex items-center gap-3 font-semibold text-white">
               <Plus className="w-4 h-4" /> New Job
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
            {/* Main Progress Bento */}
            <div className="col-span-8 row-span-3 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 relative overflow-hidden">
               <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs text-rose-500 font-bold uppercase tracking-wider mb-1">Current Status</div>
                  <h2 className="text-xl font-bold">Queue Processing Cycle</h2>
                </div>
                <div className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-bold border border-rose-500/20">
                  Ready to Render
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs border border-zinc-700 text-zinc-400">01</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1"><span className="text-zinc-300">Queue Validation</span><span className="text-emerald-400 font-mono">Done</span></div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="w-full h-full bg-emerald-500"></div></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-xs border border-rose-500/30 text-rose-400">02</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1"><span className="text-rose-200">Asset Pre-caching</span><span className="text-rose-400 italic">Idle</span></div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full"></div>
            </div>

            {/* Preview Card Bento */}
            <div className="col-span-4 row-span-4 bg-[#111] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col">
              <div className="text-xs text-zinc-500 font-bold uppercase mb-3 px-2">Latest Result</div>
              <div className="flex-1 bg-black rounded-xl border border-[#222] relative overflow-hidden flex flex-col">
                 <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="w-32 h-56 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-700 relative border border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 px-4 text-center">
                        <div className="text-[8px] text-yellow-400 font-bold uppercase tracking-tighter">HIDDEN FACT</div>
                        <div className="text-[10px] font-bold text-white uppercase">Preview pending render...</div>
                      </div>
                      <Play className="w-8 h-8 text-white/20" />
                    </div>
                 </div>
                 <div className="p-3 bg-[#151515] border-t border-[#1f1f1f] flex items-center justify-between">
                    <div className="text-xs font-mono text-zinc-400">waiting...</div>
                 </div>
              </div>
            </div>

            {/* Batch Controller Bento */}
            <div className="col-span-8 row-span-2 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold">Batch Runner</h3>
                  <p className="text-xs text-zinc-500">Process queue into vertical exports</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-zinc-500 px-2 py-1 bg-zinc-800 rounded">n8n SYNC: {settings.n8nEnabled ? 'ON' : 'OFF'}</span>
                </div>
              </div>
              <div className="flex items-end gap-6">
                <div className="flex-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-3">Export Count</label>
                  <div className="flex justify-between px-1 mb-2">
                    <span className="text-xs text-rose-500 font-bold">1</span>
                    <span className="text-xs text-zinc-500">10</span>
                  </div>
                  <div className="h-6 flex items-center relative">
                    <div className="absolute w-full h-1 bg-zinc-800 rounded-full"></div>
                    <div className="absolute w-1/3 h-1 bg-rose-500 rounded-full"></div>
                    <div className="absolute left-1/3 -ml-2.5 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-rose-500"></div>
                  </div>
                </div>
                <div className="w-48">
                  <button 
                    onClick={startBatchRender}
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    Start Render
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Activity Bento */}
            <div className="col-span-12 row-span-2 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl flex overflow-hidden">
               <div className="w-1/4 border-r border-[#1f1f1f] p-4 flex flex-col justify-center items-center text-center">
                <div className="text-2xl font-bold font-mono">{jobs.filter(j => j.status === 'completed').length}</div>
                <div className="text-[10px] uppercase text-zinc-500 tracking-wider font-bold">Generated Today</div>
              </div>
              <div className="w-3/4 p-4">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Recent Activity</span>
                    <span className="text-xs text-rose-400 hover:underline cursor-pointer">View Queue</span>
                </div>
                <div className="space-y-2">
                  {jobs.slice(0, 2).map(job => (
                    <div key={job.id} className="flex items-center justify-between text-xs p-2 bg-[#111] rounded-lg border border-[#1f1f1f]">
                      <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${job.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="text-zinc-300">{job.title}</span>
                      </div>
                      <span className="font-mono text-zinc-500 uppercase text-[10px]">{job.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'queue' && <QueueManager jobs={jobs} onUpdate={fetchJobs} />}
        {activeTab === 'generate' && <ScriptGenerator settings={settings} onGenerate={fetchJobs} />}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    rose: 'bg-rose-500/10 text-rose-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };
  return (
    <div className="glass-card flex items-center gap-4 border-none shadow-none bg-white/5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ApiStatus({ label, status }: { label: string, status: 'active' | 'missing' | 'error' }) {
  const states = {
    active: { color: 'bg-emerald-500', text: 'Connected' },
    missing: { color: 'bg-slate-700', text: 'Disconnected' },
    error: { color: 'bg-rose-500', text: 'Invalid Key' }
  };
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${states[status].color}`} />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{states[status].text}</span>
      </div>
    </div>
  );
}
