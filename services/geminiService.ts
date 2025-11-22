

import { GoogleGenAI } from "@google/genai";

const TEXT_MODEL = "gemini-3-pro-preview";
const IMAGE_MODEL = "gemini-3-pro-image-preview";

// Helper to get a fresh client instance. 
// This is crucial for flows where the API key might be selected/updated during the session.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePostContent = async (
  topic: string,
  platform: string,
  tone: string,
  type: string = "general"
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are an expert social media manager using the ${TEXT_MODEL} model.
      Write a ${tone} ${type} post for ${platform} about: "${topic}".
      
      Constraints:
      - optimize for ${platform} (e.g., character limits, formatting).
      - Use engaging hooks.
      - Do NOT include "Here is the post" or markdown code blocks. Just the raw text.
      - Include 3 relevant hashtags at the end.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Error generating post content:", error);
    return "Error: Could not contact AI service. Please check your API key.";
  }
};

export const generateProductPost = async (
  productName: string,
  productDesc: string,
  price: string,
  platform: string,
  tone: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Write a high-converting sales post for a product.
      Product: ${productName}
      Description: ${productDesc}
      Price: ${price}
      Platform: ${platform}
      Tone: ${tone}
      
      Constraints:
      - Focus on benefits and scarcity.
      - Include a Call to Action (CTA).
      - Include price if appropriate for the platform.
      - No markdown.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    return response.text || "Failed to generate product post.";
  } catch (error) {
    console.error("Error generating product post:", error);
    return "Error: Could not contact AI service.";
  }
};

export const refineContent = async (
  currentContent: string,
  instruction: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Refine this social media post:
      "${currentContent}"
      
      Instruction: ${instruction}
      
      Return only the refined text.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    return response.text || currentContent;
  } catch (error) {
    console.error("Error refining content:", error);
    return currentContent;
  }
};

export const generateHashtags = async (content: string): Promise<string[]> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Generate 5 trending, high-visibility hashtags for this content: "${content}".
      Return ONLY the hashtags separated by spaces.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    const text = response.text || "";
    return text.split(/\s+/).filter(t => t.startsWith('#'));
  } catch (error) {
    return [];
  }
};

export const generateSocialImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

export const generateReply = async (
  message: string,
  tone: 'supportive' | 'witty' | 'professional' | 'gratitude'
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a social media manager. Write a short, ${tone} reply to this user comment:
      "${message}"
      
      Constraints:
      - Keep it under 200 characters.
      - Be human and engaging.
      - Do not use hashtags unless necessary.
      - Return ONLY the reply text.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating reply:", error);
    return "";
  }
};

export const generateBio = async (
  username: string,
  niche: string,
  vibe: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Write a short, catchy social media bio for a profile.
      Username: ${username}
      Niche/Topic: ${niche}
      Vibe: ${vibe}
      
      Constraints:
      - Under 150 characters.
      - Use emojis if it fits the vibe.
      - Include a call to action at the end.
      - Just return the text.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "";
  }
};

export const suggestWorkflows = async (businessType: string): Promise<any[]> => {
    try {
      const ai = getAiClient();
      const prompt = `
        Suggest 3 automation workflows for a social media manager working for a "${businessType}".
        Return a JSON array where each object has:
        - name: Title of the workflow
        - description: Short description
        - trigger: What starts it
        - action: What happens
        
        Example:
        [{"name": "Auto-Reply", "description": "Reply to DMs", "trigger": "New DM", "action": "Send Welcome Msg"}]
      `;
  
      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
      });
  
      const text = response.text || "[]";
      // Basic cleanup to ensure we get array content
      const jsonStr = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error generating workflows:", error);
      return [];
    }
  };

export const generateVideoCaptions = async (description: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Generate a short, engaging 30-second script/caption transcript for a video about: "${description}".
      Format as time-stamped SRT style lines.
      Example:
      00:00 - Hey everyone!
      00:05 - Check this out.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    return response.text || "00:00 - [Music Playing]";
  } catch (error) {
    console.error("Error generating captions:", error);
    return "00:00 - [Error generating captions]";
  }
};