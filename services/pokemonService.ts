import { simpleQuery } from "../dbPool";
interface Pokemon {
  userid: number;
  pokedex_number: number;
  nickname: string;
  level: number;
}

async function getAllOwnedPokemon (userId: number) {
  const result = await simpleQuery<Pokemon>(`SELECT * from pokemon WHERE userid=${userId}`);
  return result;
}

async function getOneOwnedPokemon(userId: number, pokedexNumber: number) {
  console.log(userId, pokedexNumber);
  const result = await simpleQuery<Pokemon>(`SELECT * from pokemon WHERE userid=${userId} AND pokedex_number=${pokedexNumber}`);
  return result[0];
}

export default {
  getAllOwnedPokemon,
  getOneOwnedPokemon,
};