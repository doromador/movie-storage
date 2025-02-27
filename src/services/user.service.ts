import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { config  } from '../config';
const STATUS = 1;
export class UserService {

    async registerUser(email: string, name: string, password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, name, password: hashedPassword });
        const token = jwt.sign({ id: user.id, email: user.email },  config.secretKey, { expiresIn: '12h' });

        return { status: STATUS, token };
    }

    async loginUser(email: string, password: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user.id, email: user.email }, config.secretKey, { expiresIn: '12h' });

        return { status: STATUS, token };
    }
}

export default new UserService();
