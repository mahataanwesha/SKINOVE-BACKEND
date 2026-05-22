"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAi = exports.analyzeImage = void 0;
const genai_1 = require("@google/genai");
const AiRecommendation_1 = __importDefault(require("../models/AiRecommendation"));
// @desc    Analyze skin image
// @route   POST /api/ai/analyze
// @access  Public
const analyzeImage = async (req, res) => {
    try {
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
        }
        catch (parseError) {
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
        const aiRec = await AiRecommendation_1.default.create({
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
    }
    catch (error) {
        console.error('AI Analysis Error:', error);
        res.status(500).json({ success: false, message: `Failed to analyze image: ${error.message}` });
    }
};
exports.analyzeImage = analyzeImage;
// @desc    Chat with AI Assistant
// @route   POST /api/ai/chat
// @access  Public
const chatWithAi = async (req, res) => {
    try {
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.chatWithAi = chatWithAi;
