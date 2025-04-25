import express, { Request, Response } from 'express';
import pokemonService from '../services/pokemonService';
//import { NewUserSchema } from '../utils';
//import userService from '../services/userService';

const usersRouter = express.Router();

usersRouter.get('/:userid/pokemon', (req: Request, res: Response) => {
  try {
    const ownedPokemon = pokemonService.getAllOwnedPokemon(req.params.userid);
    res.json(ownedPokemon);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong :(';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

usersRouter.get('/:userId/pokemon/:pokedexNumber', (req: Request, res: Response) => {
  try {
    const ownedPokemon = pokemonService.getOneOwnedPokemon(req.params.userId, parseInt(req.params.pokedexId));
    res.json(ownedPokemon);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong :(';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

//usersRouter.use(errorMiddleware);

export default usersRouter;