// Gemini service removed by user request.
import { Pokemon, PokemonType } from "../types";

export const getStrategicAdvice = async (
  currentTeam: Pokemon[],
  bench: Pokemon[],
  nextWaveTypes: PokemonType[]
): Promise<string> => {
  return "Professor Gemini is on vacation.";
};