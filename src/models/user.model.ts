import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
}

User.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'User' }
);

export default User;
