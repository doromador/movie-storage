import Movie from '../models/movie.model';
import Actor from "../models/actor.model";
import sequelize from "../database";

export class MovieService {
    async createMovie(data: any) {
        const { title, year, format, actors, source } = data;

        const transaction = await sequelize.transaction();

        try {
            const movie = await Movie.create(
                source ? { title, year, format, source } : { title, year, format },
                { transaction }
            );

            const actorRecords = await Promise.all(
                actors.map(async (name: any) => {
                    const [actor] = await Actor.findOrCreate({ where: { name }, transaction });
                    return actor;
                })
            );

            await movie.addActors(actorRecords, { transaction });

            await transaction.commit();

            movie.setDataValue("actors", actorRecords);
            return movie;

        } catch (error) {
            await transaction.rollback();
            console.error("❌ Error creating movie:", error);
            throw new Error("Failed to create movie");
        }
    }


    async deleteMovieById(id: number) {
        const movie = await Movie.findByPk(id);
        if (!movie) return null;
        await movie.destroy();

        return movie;
    }

    async updateMovie(id: number, data: any) {
        const { title, year, format, actors } = data;

        const movie = await Movie.findByPk(id, { include: { model: Actor, as: 'actors' } });
        if (!movie) throw new Error('Movie not found');

        await movie.update({ title, year, format });

        if (actors) {
            const existingActors = await Actor.findAll({ where: { name: actors } });

            const newActorNames = actors.filter(
                (actorName: string) => !existingActors.some((a) => a.name === actorName)
            );

            const newActors = await Promise.all(
                newActorNames.map((name: string) => Actor.create({ name }))
            );

            const allActors = [...existingActors, ...newActors];

            await movie.setActors(allActors, { as: 'actors' });
        }

        const updatedMovie = await this.getMovieById(id);

        return updatedMovie;
    }

    async  getMovies(sort: string = 'year', order: string = 'DESC', limit: number = 10, offset: number = 0) {
        const validSortFields = ['title', 'year', 'format'];
        const validOrder = ['ASC', 'DESC'];

        if (!validSortFields.includes(sort)) sort = 'year';

        if (!validOrder.includes(order.toUpperCase())) order = 'DESC';

        const movies = await Movie.findAll({
            include: [
                {
                    model: Actor,
                    attributes: ['id', 'name'],
                    as: 'actors',
                    through: { attributes: [] }
                }
            ],
            order: [[sort, order.toUpperCase()]],
            limit,
            offset
        });

        return movies;
    }


    async getMovieById(id: any) {
        return await Movie.findByPk(id, {
            include: [
                {
                    model: Actor,
                    attributes: ['id', 'name'],
                    as: 'actors',
                    through: { attributes: [] }
                }
            ]
        });
    }

    async getMoviesByActorName(actorName: string) {
        return await Movie.findAll({
            include: [
                {
                    model: Actor,
                    as: 'actors',
                    where: { name: actorName },
                    attributes: []
                }
            ]
        });
    }

    async createMovies(moviesData: any[]) {
        try {
            let createdMovies = [];
            for (const movie of moviesData) {
                const createdMovie = await this.createMovie(movie);
                if (createdMovie) {
                    createdMovies.push(createdMovie);
                }
            }
            return createdMovies;
        } catch (error) {
            console.error("❌ Error creating movies:", error);
            throw new Error("Could not save all movies");
        }
    }
}

export default new MovieService();
