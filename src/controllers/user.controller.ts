import { Request, Response } from 'express';
import UserService from '../services/user.service';

export default class UserController {

    static async register(req: Request, res: Response) {
        try {
            const { email, password, name, confirmPassword } = req.body;
            res.status(201).json(await UserService.registerUser(email, name, password, confirmPassword));
        } catch (error) {
            res.status(500).json({ error: 'Failed to register user' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await UserService.loginUser(email, password);
            res.json( token );
        } catch (error) {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
}
