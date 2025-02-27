import { Router } from 'express';
import MovieController from '../controllers/movie.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.post('/', authMiddleware, MovieController.createMovie);
router.delete('/:id', authMiddleware, MovieController.deleteMovie);
router.patch('/:id', authMiddleware, MovieController.updateMovie);
router.get('/:id', authMiddleware, MovieController.getMovieById);
router.get('/', authMiddleware, MovieController.getMovies);
router.get('/', authMiddleware,  MovieController.getMoviesByActor);
router.post('/import', authMiddleware, MovieController.importMovies);

export default router;
