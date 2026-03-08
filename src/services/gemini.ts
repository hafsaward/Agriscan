import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DiseaseAnalysis {
  plantType: string;
  diseaseName: string;
  confidence: number;
  description: string;
  causes: string[];
  treatments: string[];
  prevention: string[];
}

export const analyzePlantLeaf = async (base64Image: string, mimeType: string): Promise<DiseaseAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this plant leaf image for diseases. 
    Provide the response in JSON format with the following structure:
    {
      "plantType": "Name of the plant (e.g., Tomato)",
      "diseaseName": "Name of the disease or 'Healthy'",
      "confidence": 0.95, (a float between 0 and 1)
      "description": "Short description of the disease or health status",
      "causes": ["Cause 1", "Cause 2"],
      "treatments": ["Treatment 1", "Treatment 2"],
      "prevention": ["Prevention 1", "Prevention 2"]
    }
    If the image is not a plant leaf, return an error-like structure but still JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType
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
          plantType: { type: Type.STRING },
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          causes: { type: Type.ARRAY, items: { type: Type.STRING } },
          treatments: { type: Type.ARRAY, items: { type: Type.STRING } },
          prevention: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["plantType", "diseaseName", "confidence", "description", "causes", "treatments", "prevention"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as DiseaseAnalysis;
};

export const chatWithAdvisor = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const model = "gemini-3-flash-preview";
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: "You are AgriScan AI, an expert agricultural advisor. Provide practical, sustainable, and accurate farming advice. Keep responses concise and helpful for farmers.",
    },
    history
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
