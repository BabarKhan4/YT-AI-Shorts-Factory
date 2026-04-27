import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // --- Persistence Layer ---
  const getWorkspacePath = () => {
    // Default to project root for the applet environment, 
    // but the user can configure a custom path in settings.
    return process.cwd();
  };

  const getSettingsPath = () => path.join(getWorkspacePath(), 'settings.json');
  const getQueuePath = () => path.join(getWorkspacePath(), 'content_queue.json');

  const readData = (filePath: string, defaultValue: any): any => {
    if (!fs.existsSync(filePath)) return defaultValue;
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      return defaultValue;
    }
  };

  const writeData = (filePath: string, data: any) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  };

  // --- API Routes ---

  app.get("/api/settings", (req, res) => {
    const settings = readData(getSettingsPath(), {
      ollamaUrl: "http://127.0.0.1:11434",
      ollamaModel: "qwen2.5",
      pexelsKey: "",
      pixabayKey: "",
      resolution: "1080x1920",
      fps: 30,
      workspace: getWorkspacePath(),
      isSetupComplete: false
    });
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    writeData(getSettingsPath(), req.body);
    res.json({ success: true });
  });

  app.get("/api/queue", (req, res) => {
    res.json(readData(getQueuePath(), []));
  });

  app.post("/api/queue", (req, res) => {
    writeData(getQueuePath(), req.body);
    res.json({ success: true });
  });


  app.post("/api/render/start", async (req, res) => {
    const { jobId } = req.body;
    const queue = readData(getQueuePath(), []);
    const job = queue.find(j => j.id === jobId);
    
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Update status to processing
    job.status = 'processing';
    writeData(getQueuePath(), queue);

    // Simulate rendering pipeline
    console.log(`Starting render for ${job.title}...`);
    
    // In a real local setup, we would:
    // 1. Search Pexels/Pixabay for section_queries
    // 2. Download clips to assets_cache
    // 3. Generate TTS audio
    // 4. Use fluent-ffmpeg to mix everything
    
    setTimeout(() => {
      job.status = 'completed';
      job.completed_at = new Date().toISOString();
      writeData(getQueuePath(), queue);
      console.log(`Render completed for ${job.title}`);
    }, 15000);

    res.json({ success: true, message: "Render started" });
  });

  app.post("/api/generate-job", async (req, res) => {
    const { topic, niche, tone } = req.body;
    const settings = readData(getSettingsPath(), {});
    
    const systemPrompt = `You are an expert viral video creator for YouTube Shorts and TikTok.
    Generate a structured video job in JSON format.
    Topic: ${topic}
    Niche: ${niche}
    Tone: ${tone}

    The JSON must follow this exact structure:
    {
      "title": "Short title",
      "description": "Video description",
      "hashtags": ["#tag1", "#tag2"],
      "impact_words": ["WORD1", "WORD2"],
      "script_sections": {
        "hook": "...",
        "tension": "...",
        "reveal": "...",
        "underground": "...",
        "cta": "..."
      },
      "section_queries": {
        "hook": ["query 1", "query 2"],
        "tension": ["query 1", "query 2"],
        "reveal": ["query 1", "query 2"],
        "underground": ["query 1", "query 2"],
        "cta": ["query 1", "query 2"]
      }
    }
    The script should be fast-paced. Impact words should be important keywords from the script. 
    Queries should be suitable for Pexels/Pixabay stock video searches.
    Return ONLY valid JSON.`;

    try {
      const response = await axios.post(`${settings.ollamaUrl}/api/generate`, {
        model: settings.ollamaModel,
        prompt: systemPrompt,
        stream: false,
        format: "json"
      });

      const jobData = JSON.parse(response.data.response);
      const queue = readData(getQueuePath(), []);
      
      const newJob = {
        ...jobData,
        id: `job_${Date.now()}`,
        status: 'pending',
        privacy_status: 'private',
        output_filename: `video_${Date.now()}.mp4`
      };

      queue.push(newJob);
      writeData(getQueuePath(), queue);
      
      res.json({ success: true, job: newJob });
    } catch (error) {
      console.error("Ollama Error:", error);
      res.status(500).json({ error: "Failed to communicate with local Ollama instance." });
    }
  });

  app.get("/api/stock/search", async (req, res) => {
    const { query, provider } = req.query;
    const settings = readData(getSettingsPath(), {});
    
    try {
      if (provider === 'pexels' && settings.pexelsKey) {
        const response = await axios.get(`https://api.pexels.com/videos/search?query=${query}&per_page=5&orientation=portrait`, {
          headers: { Authorization: settings.pexelsKey }
        });
        return res.json(response.data);
      }
      
      if (provider === 'pixabay' && settings.pixabayKey) {
        const response = await axios.get(`https://pixabay.com/api/videos/?key=${settings.pixabayKey}&q=${query}&video_type=film&per_page=5`);
        return res.json(response.data);
      }

      res.status(400).json({ error: "Provider not configured or key missing" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Shorts Factory running on http://localhost:${PORT}`);
  });
}

startServer();
