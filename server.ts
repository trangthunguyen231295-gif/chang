import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(cors());
app.use(express.json());

// API Routes
app.post("/api/analyze", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const audioData = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const prompt = `Analyze this sales call recording. 
    1. Diarized transcript: Provide a list of segments with speaker labels (A for Salesperson, B for Customer) and timestamps.
    2. Sentiment Graph: Provide engagement levels (0-100) for approximately 10-15 data points over the duration of the call.
    3. Coaching Card: List exactly 3 things the salesperson did well and 3 missed opportunities.
    
    Return the data in the following JSON format:
    {
      "transcript": [{"speaker": "string", "text": "string", "timestamp": "string"}],
      "sentiment": [{"time": "string", "engagement": number}],
      "coaching": {
        "strengths": ["string"],
        "missedOpportunities": ["string"]
      }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: audioData,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  text: { type: Type.STRING },
                  timestamp: { type: Type.STRING }
                },
                required: ["speaker", "text", "timestamp"]
              }
            },
            sentiment: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  engagement: { type: Type.NUMBER }
                },
                required: ["time", "engagement"]
              }
            },
            coaching: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                missedOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strengths", "missedOpportunities"]
            }
          },
          required: ["transcript", "sentiment", "coaching"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze recording" });
  }
});

// Vite middleware for development
async function setupServer() {
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
