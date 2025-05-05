import express, { RequestHandler, Response } from 'express';
import pokemonService from '../services/pokemonService';
import { RequestWithAuth } from '../types/RequestWithAuth';
//import { NewUserSchema } from '../utils';
//import userService from '../services/userService';

const usersRouter = express.Router();

const fakeUser = {
  userId: 1,
  username: 'admin',
  passwordHash: 'fakepass',
};
console.log(fakeUser);

usersRouter.put('/:userid/pokemon/:pokedexNumber', ( async (req: RequestWithAuth, res: Response) => {
  try {
    if ( !req.user ) {
      res.status(401).json({ error: 'token invalid' });
    }

    const catchResult = await pokemonService.catchPokemon(parseInt(req.params.userid), parseInt(req.params.pokedexNumber));
    const CASE = catchResult.type;
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
        res.status(500).send('Error: Something went wrong');
        break;
      default:
        res.status(500).send('Error: Something went wrong');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('Something went wrong');
    }
  }
}) as RequestHandler);

usersRouter.put('/:userid/pokemon', ( async (req: RequestWithAuth, res: Response) => {
  try {
    if ( !req.user ) {
      res.status(401).json({ error: 'token invalid' });
    }
    const ownedPokemon = await pokemonService.getAllOwnedPokemon(parseInt(req.params.userid));
    res.status(200).json(ownedPokemon);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);


usersRouter.put('/:userId/pokemon/:pokedexNumber', ( async (req: RequestWithAuth, res: Response) => {
  try {
    if ( !req.user ) {
      res.status(401).json({ error: 'token invalid' });
    }
    const ownedPokemon = await pokemonService.getOneOwnedPokemon(parseInt(req.params.userId), parseInt(req.params.pokedexNumber));
    res.status(200).json(ownedPokemon);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);

usersRouter.put('/:userid/pokeballs', ( (req: RequestWithAuth, res: Response) => {
  try {
    if ( !req.user ) {
      res.status(401).json({ error: 'token invalid' });
    }
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // const ownedPokemon = await pokemonService.getAllOwnedPokemon(parseInt(req.params.userid));
    res.status(200).json(3);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);


export default usersRouter;