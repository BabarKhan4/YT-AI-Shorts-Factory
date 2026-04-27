import React, { useState } from 'react';
import { VideoJob } from '../types';
import { 
  Plus, MoreVertical, Edit2, Trash2, 
  Search, Filter, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface QueueProps {
  jobs: VideoJob[];
  onUpdate: () => void;
}

export function QueueManager({ jobs, onUpdate }: QueueProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteJob = async (id: string) => {
    const updated = jobs.filter(j => j.id !== id);
    await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search active jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-slate-800 transition-all text-slate-300">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-slate-800 transition-all text-slate-300 font-bold uppercase tracking-widest">
            Export JSON
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-0 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a] border-b border-[#1f1f1f]">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#555]">Video Information</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#555]">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#555]">Validation</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#555] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f1f1f]">
            {filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div>
                    <p className="font-bold text-[#EDEDED]">{job.title}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">{job.id}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] text-emerald-500">Validated</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition-all text-slate-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteJob(job.id)}
                      className="p-2 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-all text-slate-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredJobs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No jobs found in the queue. Start by generating or adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VideoJob['status'] }) {
  const config = {
    pending: { color: 'bg-slate-800 text-slate-400', icon: null, text: 'Queued' },
    processing: { color: 'bg-blue-500/20 text-blue-400 border border-blue-500/20', icon: null, text: 'Rendering' },
    completed: { color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20', icon: CheckCircle, text: 'Finished' },
    failed: { color: 'bg-rose-500/20 text-rose-400 border border-rose-500/20', icon: AlertTriangle, text: 'Failed' },
  };
  const { color, text } = config[status];
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>
      {text}
    </span>
  );
}
