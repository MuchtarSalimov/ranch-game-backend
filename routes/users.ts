import express, { Request, Response } from 'express';
import pokemonService from '../services/pokemonService';
//import { NewUserSchema } from '../utils';
//import userService from '../services/userService';

const usersRouter = express.Router();

const fakeUser = {
  userId: 1,
  username: 'admin',
  passwordHash: 'fakepass',
};
console.log(fakeUser);

usersRouter.get('/:userid/pokemon', async (req: Request, res: Response) => {
  try {
    const ownedPokemon = await pokemonService.getAllOwnedPokemon(parseInt(req.params.userid));
    res.json(ownedPokemon);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong :(';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

usersRouter.get('/:userId/pokemon/:pokedexNumber', async (req: Request, res: Response) => {
  try {
    const ownedPokemon = await pokemonService.getOneOwnedPokemon(parseInt(req.params.userId), parseInt(req.params.pokedexNumber));
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