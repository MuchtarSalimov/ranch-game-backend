export interface PokedexEntry {
  pokedex_number: number;
  species: string;
  uri: string;
  is_basic: boolean;
  evolves_at: number;
  evolves_into: number;
}