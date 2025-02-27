import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import Actor from "./actor.model";

class Movie extends Model {
    public id!: number;
    public title!: string;
    public year!: number;
    public format!: string;
    public source!: string;
    public addActors!: (actors: Actor[], options?: any) => Promise<void>;
    public setActors!: (actors: Actor[], options?: any) => Promise<void>;
}

Movie.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        year: { type: DataTypes.INTEGER, allowNull: false },
        format: { type: DataTypes.STRING, allowNull: false },
        source: { type: DataTypes.STRING, allowNull: true }
    },
    { sequelize, modelName: "Movie" }
);

Movie.belongsToMany(Actor, { through: "MovieActor", as: 'actors' });
Actor.belongsToMany(Movie, { through: "MovieActor", as: 'movies' });

export default Movie;
