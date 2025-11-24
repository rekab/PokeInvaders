import { GoogleGenAI } from "@google/genai";
import { Pokemon, PokemonType } from "../types";

// Safety check for API key
const API_KEY = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const getStrategicAdvice = async (
  currentTeam: Pokemon[],
  bench: Pokemon[],
  nextWaveTypes: PokemonType[]
): Promise<string> => {
  if (!ai) return "Gemini API Key missing. Good luck, trainer!";

  const teamDesc = currentTeam.map(p => `${p.name} (${p.type}, Lvl ${p.level}, HP: ${p.stats.hp}/${p.stats.maxHp})`).join(', ');
  const benchDesc = bench.map(p => `${p.name} (${p.type}, Lvl ${p.level})`).join(', ');
  const enemyDesc = nextWaveTypes.join(', ');

  const prompt = `
    I am playing a Space Invaders style game with Pokemon mechanics.
    
    My Active Team: ${teamDesc}
    My Bench: ${benchDesc}
    
    Next Wave Enemies are primarily types: ${enemyDesc}
    
    Based on Pokemon type effectiveness (Water > Fire > Grass etc), give me a short, tactical suggestion (max 2 sentences) on who to put in my active team and who to lead with. Focus on type advantages.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Stay sharp, Trainer!";
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return "Communication with Professor Gemini lost...";
  }
};
