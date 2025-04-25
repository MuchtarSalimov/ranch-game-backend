import { simpleQuery } from "../dbPool";
import { PokedexEntry } from "../types/Pokedex";

async function getFullPokedex () {
  const result = await simpleQuery<PokedexEntry>('SELECT * from pokedex');
  console.log(result[0]);
  return result[0];
}

async function getPokedexEntry(pokedexNumber: number) {
  const result = await simpleQuery<PokedexEntry>(`SELECT * from pokedex WHERE pokedex_number=${pokedexNumber}`);
  console.log(result);
  return result;
}

export default {
  getFullPokedex,
  getPokedexEntry,
};