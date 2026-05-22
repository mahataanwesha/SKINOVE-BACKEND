import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import AiRecommendation from '../models/AiRecommendation';

// @desc    Analyze skin image
// @route   POST /api/ai/analyze
// @access  Public
export const analyzeImage = async (req: Request, res: Response) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    // Convert multer file buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `You are an expert dermatologist AI. Analyze this skin image. 
Return ONLY a JSON object with the following exact structure (no markdown, no extra text):
{
  "condition": "Name of the condition",
  "severity": "Mild | Moderate | Severe",
  "recommendations": ["rec1", "rec2"],
  "treatments": ["treatment1", "treatment2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          prompt,
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          }
        ]
      });

      const text = response.text || '{}';
      // Clean up potential markdown blocks if the AI still adds them
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let analysisResult;
      try {
        analysisResult = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response:', cleanedText);
        // Fallback response
        analysisResult = {
          condition: 'Analysis Pending',
          severity: 'Unknown',
          recommendations: ['Please consult a dermatologist for accurate diagnosis.'],
          treatments: ['Professional consultation recommended.'],
        };
      }

      // Save to database
      const aiRec = await AiRecommendation.create({
        condition: analysisResult.condition,
        severity: analysisResult.severity,
        recommendations: analysisResult.recommendations,
        treatments: analysisResult.treatments,
        // If we uploaded to Cloudinary, we could store the URL here
      });

      res.json({
        success: true,
        data: analysisResult,
      });
    } catch (error: any) {
      console.error('AI Analysis Error:', error);
      res.status(500).json({ success: false, message: `Failed to analyze image: ${error.message}` });
    }
  };

  // @desc    Chat with AI Assistant
  // @route   POST /api/ai/chat
  // @access  Public
  export const chatWithAi = async (req: Request, res: Response) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const { message } = req.body;

      const prompt = `You are a helpful and professional dermatology assistant for "Skinova AI". 
  Respond to the following user message concisely and helpfully. 
  User Message: "${message}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
      });

      res.json({
        success: true,
        data: response.text,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
