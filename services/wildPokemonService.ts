import { paramsQuery } from "../dbPool";
import { PokedexEntry } from "../types/Pokedex";
import { sha256 } from 'js-sha256';

const basics = [ 1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 134, 135, 136, 137, 138, 140, 142, 143, 144, 145, 146, 147, 150, 151 ];

function simpleStringHash(str: string): number {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = hash + char; 
  }
  // Return the absolute value to ensure a positive integer (optional)
  return Math.abs(hash);
}

async function getHourlyWildPokemon(userid: number) {
  const now = new Date();
  const uniqueUserDateHourString = `${userid}-${now.toDateString()}-${now.getHours()}`;
  // uniqueUserDateHourString
  const abc = sha256(uniqueUserDateHourString);
  let first = ( simpleStringHash(abc.slice(0, 5)) % 82);
  let second = ( simpleStringHash(abc.slice(6, 10)) % 82);
  let third = ( simpleStringHash(abc.slice(11, 15)) % 82);

  if (first === second && second === third) {
    first = 1;
    second = 4;
    third = 7;
  } else if (first === second || second === third || first === third) {
    second = first + 20 % 82;
    third = first + 40 % 82;
  }

  const result = await paramsQuery<PokedexEntry>(`
    SELECT * FROM pokedex
    WHERE pokedex_number IN ($1, $2, $3)
  `, [basics[first], basics[second], basics[third]]);
  return result;
}

export default {
  getHourlyWildPokemon
};