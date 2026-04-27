import React, { useState } from 'react';
import { Settings, VideoJob } from '../types';
import { Sparkles, Wand2, PlusCircle, AlertCircle, Loader2, Activity } from 'lucide-react';
import { SAMPLE_JOBS } from '../constants';

interface ScriptGenProps {
  settings: Settings;
  onGenerate: () => void;
}

export function ScriptGenerator({ settings, onGenerate }: ScriptGenProps) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [niche, setNiche] = useState('Mystery & History');
  const [tone, setTone] = useState('mysterious');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, niche, tone })
      });
      
      if (!res.ok) throw new Error("Failed to generate script");
      
      onGenerate(); // Refresh the queue in dashboard
      setTopic('');
    } catch (e) {
      console.error(e);
      alert("Ollama connection failed. Make sure 'ollama serve' is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass-card border-[#1f1f1f] bg-[#111]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="text-rose-400" /> AI Creative Lab
          </h3>
          <p className="text-zinc-500 text-sm mb-6">
            Enter a topic and let local AI draft your full script, generate stock search queries, and plan impact words.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Video Niche</label>
              <select 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] focus:outline-none"
              >
                <option>Mystery & History</option>
                <option>Travel Secrets</option>
                <option>Forbidden Places</option>
                <option>Technology Truths</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Topic / Hook Idea</label>
              <textarea 
                placeholder="Ex: The hidden subway station under New York City..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-32 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] resize-none focus:outline-none focus:ring-1 focus:ring-rose-500/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Narrative Tone</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-3 py-2 text-sm text-[#EDEDED] focus:outline-none"
                >
                  <option value="mysterious">Mysterious</option>
                  <option value="conspiracy">Conspiracy Style</option>
                  <option value="educational">Educational</option>
                  <option value="dark">Dark Curiosity</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Length</label>
                <div className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-3 py-2 text-sm flex items-center justify-between text-zinc-500">
                  <span>30-60s</span>
                  <Activity className="w-3 h-3 opacity-50" />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Deep Dreaming...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Generate AI Script
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card bg-white/5 border-none">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <PlusCircle className="text-accent" /> Custom Job Entry
          </h3>
          <div className="p-8 border-2 border-dashed border-slate-800 rounded-2xl text-center">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-sm mb-4">Or drag and drop a .txt script file to process manually.</p>
            <button className="text-blue-400 font-semibold hover:underline">Upload Document</button>
          </div>
        </div>

        <div className="glass-card bg-emerald-500/5 border-none ring-1 ring-emerald-500/10 p-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-2">Pro Tip</h4>
            <p className="text-slate-400 text-xs leading-relaxed italic">
                "Short scripts with curiosity gaps in the first 3 seconds perform 70% better on TikTok. Ensure your hook query is high-energy."
            </p>
        </div>
      </div>
    </div>
  );
}
