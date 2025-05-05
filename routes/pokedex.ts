import express, { Request, RequestHandler, Response } from 'express';
import pokedexService from '../services/pokedexService';
import { z } from 'zod';

const pokedexRouter = express.Router();

pokedexRouter.get('/', ( async (_req: Request, res: Response) => {
  try {
    const pokedexData = await pokedexService.getFullPokedex();
    res.json(pokedexData);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);

pokedexRouter.get('/:pokedexNumber', ( async (req: Request, res: Response) => {
  try {
    const pokeDexNumber = z.number().parse(parseInt(req.params.pokedexNumber));
    const pokedexEntry = await pokedexService.getPokedexEntry(pokeDexNumber);
    res.json(pokedexEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);

export default pokedexRouter;