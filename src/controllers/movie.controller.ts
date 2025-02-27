import { Request, Response } from 'express';
import MovieService from '../services/movie.service';
import { parseMoviesFromFile } from "../utils/fileHandler";
import { saveFile } from "../utils/fileUtils";

export default class MovieController {
    static async createMovie(req: Request, res: Response) {
        try {
            const movie = await MovieService.createMovie(req.body);
            res.status(201).json(movie);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create movie' });
        }
    }


    static async getMovieById(req: Request, res: Response) {
        try {
            const movie = await MovieService.getMovieById(req.params.id);
            res.json(movie);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve movies' });
        }
    }

    static async deleteMovie(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid movie ID" });
            }
            const deletedMovie = await MovieService.deleteMovieById(id);

            if (!deletedMovie) {
                return res.status(404).json({ error: "Movie not found" });
            }
            return res.json({ message: "Movie deleted successfully" });
        } catch (error) {
            console.error("Error deleting movie:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async updateMovie(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid movie ID" });
            }

            const updatedMovie = await MovieService.updateMovie(id, req.body);

            if (!updatedMovie) {
                return res.status(404).json({ error: "Movie not found" });
            }

            return res.json(updatedMovie);
        } catch (error) {
            console.error("Error updating movie:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getMovies(req: Request, res: Response) {
        try {
            const { sort, order, limit, offset } = req.query;

            const movies = await MovieService.getMovies(
                sort as string,
                order as string,
                limit ? parseInt(limit as string, 10) : 10,
                offset ? parseInt(offset as string, 10) : 0
            );

            res.json(movies);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch movies' });
        }
    }

    static async getMoviesByActor(req: Request, res: Response) {
        try {
            const { actorName } = req.query;
            if (!actorName) {
                return res.status(400).json({ error: 'actorName is required' });
            }

            const movies = await MovieService.getMoviesByActorName(actorName as string);
            res.json(movies);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async importMovies(req: Request, res: Response) {
        try {
            const filePath = await saveFile(req);

            const movies = await parseMoviesFromFile(filePath);

            res.json({ data: await MovieService.createMovies(movies) });
        } catch (error) {
            console.error('File processing error:', error);
            res.status(500).json({ error: 'Failed to process file' });
        }
    }
}
