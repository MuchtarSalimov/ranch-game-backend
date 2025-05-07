/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { paramsQuery } from "../dbPool";
import { pool } from "../dbPool";

interface Pokemon {
  userid: number;
  pokedex_number: number;
  nickname: string;
  level: number;
}

async function catchPokemon(userId: number, pokedexNumber: number){
  // response in the form of { type : "level"|"evolve"|"catch"|"error", pokemon: Pokemon|null, message: string}
  const client = await pool.connect();

  try {
    // Begin Transaction
    await client.query('BEGIN');
    
    // add an entry to catch_activity to count as using up a pokeball
    const { rows: catchActivityUpdate } = await client.query(`
      INSERT INTO catch_activity (userid)
      VALUES ($1)
      RETURNING *
    `, [userId]);
    if (catchActivityUpdate.length === 0) {
      throw new Error('could not update catch_activity');
    }

    // Check if pokemon from the same evolution line (the caught pokemon is a basic, so checks if any future evolutions already exist as well).
    const { rows: existingPokemon } = await client.query(`
      SELECT * FROM POKEMON p
      JOIN POKEDEX d ON p.pokedex_number = d.pokedex_number
      WHERE p.userid = $1 AND d.basic_number = $2
    `, [userId, pokedexNumber]);

    if (existingPokemon.length > 0) {
      const newLevel = existingPokemon[0].level + 5;

      // update the existing pokemon's level
      const { rows: updatedPokemon } = await client.query(`
        UPDATE POKEMON
        SET level = $1
        WHERE userid = $2 AND pokedex_number = $3
        RETURNING *
        `, [newLevel, userId, existingPokemon[0].pokedex_number]
      );

      const { rows: evolveRows } = await client.query(`
        SELECT * FROM POKEDEX WHERE pokedex_number = $1 AND evolves_at <= $2
        `, [updatedPokemon[0].pokedex_number, updatedPokemon[0].level]);

      if (evolveRows.length > 0) {
        await client.query(`
          UPDATE POKEMON
          SET pokedex_number = $1
          WHERE userid = $2 AND pokedex_number = $3
          RETURNING pokedex_number, nickname, level
          `, [evolveRows[0].evolves_into, userId, updatedPokemon[0].pokedex_number]);
        await client.query('COMMIT');
        return {
          type: 'evolve',
          pokemon: updatedPokemon[0],
          message: `${updatedPokemon[0].nickname ? updatedPokemon[0].nickname : existingPokemon[0].species} has evolved!`
        };
      } else {
        await client.query('COMMIT');
        return {
          type: 'level',
          pokemon: updatedPokemon[0],
          message: `${updatedPokemon[0].nickname ? updatedPokemon[0].nickname : existingPokemon[0].species} has reached level ${updatedPokemon[0].level}.`
        };
      }
    } else {
      // catch new basic pokemon at level 5
      const { rows: pokedexEntries } = await client.query(`
        SELECT * FROM POKEDEX
        WHERE pokedex_number = $1
        `, [pokedexNumber]);
      const { rows: caughtPokemon } = await client.query(`
        INSERT INTO POKEMON (userid, pokedex_number, level)
        VALUES ($1, $2, $3)
        RETURNING *
        `, [userId, pokedexNumber, 5]);
      await client.query('COMMIT');
      return {
        type: 'catch',
        pokemon: caughtPokemon[0],
        message: `${pokedexEntries[0].species} has been caught!`
      };
    }
    // unreachable
  } catch (err) {
    console.error(`Error running query: ${err}`);
    await client.query('ROLLBACK');

    return {
      type: 'error',
      pokemon: null,
      message: `there was an error`
    };
  } finally {
    client.release();
  }
}

async function getAllOwnedPokemon (userId: number) {
  const result = await paramsQuery<Pokemon>(`
    SELECT p.pokedex_number, p.nickname, p.level, d.species, d.uri FROM POKEMON p
    JOIN POKEDEX d ON p.pokedex_number = d.pokedex_number
    WHERE userid = $1
    `, [userId]);
  return result;
}

async function getOneOwnedPokemon(userId: number, pokedexNumber: number) {
  const result = await paramsQuery<Pokemon>(`
    SELECT p.pokedex_number, p.nickname, p.level, d.species, d.uri FROM POKEMON p
    JOIN POKEDEX d ON p.pokedex_number = d.pokedex_number
    WHERE p.userid = $1 AND p.pokedex_number = $2
    `, [userId, pokedexNumber]);
  return result[0];
}

export default {
  getAllOwnedPokemon,
  getOneOwnedPokemon,
  catchPokemon,
};