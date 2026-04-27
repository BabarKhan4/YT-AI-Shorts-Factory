import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, Lock, CheckCircle2, ChevronRight, 
  ChevronLeft, Play, Cpu, Globe, Film, Activity
} from 'lucide-react';
import { Settings } from '../types';

interface WizardProps {
  onComplete: () => void;
}

export function SetupWizard({ onComplete }: WizardProps) {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<Partial<Settings>>({
    workspace: '/Users/user/ai-shorts-factory',
    outputPath: '/Users/user/ai-shorts-factory/outputs',
    cachePath: '/Users/user/ai-shorts-factory/assets_cache',
    queuePath: '/Users/user/ai-shorts-factory/content_queue.json',
    ollamaUrl: "http://127.0.0.1:11434",
    ollamaModel: "qwen2.5",
    resolution: "1080x1920",
    fps: 30,
    preferredProvider: 'pexels',
    isSetupComplete: false
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, isSetupComplete: true })
    });
    onComplete();
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-400 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Play className="w-10 h-10 text-white fill-current" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-center tracking-tight text-[#EDEDED]">AI Shorts Factory</h1>
            <p className="text-zinc-500 text-center max-w-md mx-auto leading-relaxed">
              Generate viral short-form videos automatically using local AI models and premium stock footage.
            </p>
            <button onClick={next} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
              Get Started <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Folder className="text-blue-500" /> Workspace Paths
            </h2>
            <div className="space-y-4">
              {['workspace', 'outputPath', 'cachePath'].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-400 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input 
                    type="text" 
                    value={settings[key as keyof Settings] as string}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={prev} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest">Back</button>
              <button onClick={next} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20 uppercase text-xs tracking-widest">Continue</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Globe className="text-accent" /> Stock API Keys
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-2">Pexels API Key</label>
                <input 
                  type="password" 
                  value={settings.pexelsKey}
                  placeholder="px_****"
                  onChange={(e) => setSettings({ ...settings, pexelsKey: e.target.value })}
                  className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-2">Pixabay API Key</label>
                <input 
                  type="password" 
                  value={settings.pixabayKey}
                  placeholder="pb_****"
                  onChange={(e) => setSettings({ ...settings, pixabayKey: e.target.value })}
                  className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={prev} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest">Back</button>
              <button onClick={next} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest shadow-lg shadow-rose-600/20">Continue</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="text-purple-500" /> AI Engine (Ollama)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-2">Ollama URL</label>
                <input 
                  type="text" 
                  value={settings.ollamaUrl}
                  onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
                  className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-2">Default Model</label>
                <input 
                  type="text" 
                  value={settings.ollamaModel}
                  onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
                  className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={prev} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest">Back</button>
              <button onClick={next} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest shadow-lg shadow-rose-600/20">Continue</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Film className="text-pink-500" /> Rendering Config
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-2">Resolution</label>
                <select 
                  value={settings.resolution}
                  onChange={(e) => setSettings({ ...settings, resolution: e.target.value })}
                  className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] focus:outline-none"
                >
                  <option value="1080x1920">1080x1920 (Shorts)</option>
                  <option value="720x1280">720x1280 (HD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-2">FPS</label>
                <input 
                  type="number" 
                  value={settings.fps}
                  onChange={(e) => setSettings({ ...settings, fps: parseInt(e.target.value) })}
                  className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#EDEDED] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={prev} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest">Back</button>
              <button onClick={save} className="flex-1 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                <CheckCircle2 className="w-5 h-5 text-white" /> Finish Setup
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="glass-card">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  step >= s ? "bg-rose-500" : "bg-[#1f1f1f]"
                )} 
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
