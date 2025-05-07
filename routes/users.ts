import express, { RequestHandler, Response } from 'express';
import pokemonService from '../services/pokemonService';
import pokeballService from '../services/pokeballService';
import { RequestWithAuth } from '../types/RequestWithAuth';
import { isUserTokenMissing } from '../utils/utils';
//import { NewUserSchema } from '../utils';
//import userService from '../services/userService';

const usersRouter = express.Router();

usersRouter.put('/:userid/pokemon/:pokedexNumber', ( async (req: RequestWithAuth, res: Response) => {
  try {
    const userIdParam = parseInt(req.params.userid);
    if (isUserTokenMissing(req.userid)) {
      res.status(401).send('token invalid');
    } else if (req.userid !== userIdParam){
      res.status(401).send('unauthourized');
    } else {
      const catchResult = await pokemonService.catchPokemon(userIdParam, parseInt(req.params.pokedexNumber));
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
          break;
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('Something went wrong');
    }
  }
}) as RequestHandler);

usersRouter.get('/:userid/pokemon', ( async (req: RequestWithAuth, res: Response) => {
  try {
  //   if (isUserTokenMissing(req.userid)) {
  //     res.status(401).send('token invalid');
  //   } else if (req.userid !== req.params.userid){
  //     res.status(401).send('unauthourized');
  //   }

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


usersRouter.get('/:userid/pokemon/:pokedexNumber', ( async (req: RequestWithAuth, res: Response) => {
  try {
  //   if (isUserTokenMissing(req.userid)) {
  //     res.status(401).send('token invalid');
  //   } else if (req.userid !== req.params.userid){
  //     res.status(401).send('unauthourized');
  //   }
    const ownedPokemon = await pokemonService.getOneOwnedPokemon(parseInt(req.params.userid), parseInt(req.params.pokedexNumber));
    
    res.status(200).json(ownedPokemon);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);

usersRouter.put('/:userid/pokeballs', (async (req: RequestWithAuth, res: Response) => {
  try {
    const userIdParam = parseInt(req.params.userid);
    if (isUserTokenMissing(req.userid)) {
      res.status(401).send('token invalid');
    } else if (req.userid !== userIdParam){
      res.status(401).send('unauthourized');
    } else {
      const availablePokeballs = await pokeballService.getAvailablePokeballs(req.userid);
      res.status(200).json(availablePokeballs);
    }
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // REMEMBER TO un _req and re-async this route
    // const ownedPokemon = await pokemonService.getAllOwnedPokemon(parseInt(req.params.userid));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);


export default usersRouter;