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

usersRouter.put('/:userid/pokemon/:pokedexNumber', async (req: Request, res: Response) => {
  try {
    console.log(req.params.userid, req.params.pokedexNumber);
    const catchResult = await pokemonService.catchPokemon(parseInt(req.params.userid), parseInt(req.params.pokedexNumber));
    const CASE = catchResult.type;
    console.log('case', JSON.stringify(catchResult));
    switch(CASE) {
      case "level":
        res.status(200).send(catchResult.message);
        break;
      case "evolve":
        res.status(200).send(catchResult.message);
        break;
      case "catch":
        res.status(201).send(catchResult.message);
        break;
      case "error":
        res.status(500).send('Error: Something went wrong :(');
        break;
      default:
        res.status(500).send('Error: Something went wrong :(');
    }
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong :(';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(500).send(errorMessage);
  }
});

usersRouter.get('/:userid/pokemon', async (req: Request, res: Response) => {
  try {
    const ownedPokemon = await pokemonService.getAllOwnedPokemon(parseInt(req.params.userid));
    res.status(200).json(ownedPokemon);
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
    res.status(200).json(ownedPokemon);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong :(';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

usersRouter.get('/:userid/pokeballs',  (_req: Request, res: Response) => {
  try {
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // const ownedPokemon = await pokemonService.getAllOwnedPokemon(parseInt(req.params.userid));
    res.status(200).json(3);
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