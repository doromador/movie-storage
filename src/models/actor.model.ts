import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import Movie from "./movie.model";

class Actor extends Model {
    public id!: number;
    public name!: string;

    public addActors!: (actors: Actor[] | Actor) => Promise<void>;
    public setActors!: (actors: Actor[] | Actor) => Promise<void>;
}

Actor.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { sequelize, modelName: "Actor" }
);


export default Actor;
