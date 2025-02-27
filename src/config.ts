import dotenv from 'dotenv';
import path from "path";

dotenv.config({path: path.join(__dirname, '..', '.env')});

export const config = {
    secretKey: process.env.SECRET_KEY || 'wqddcdsvsf',
    port: process.env.PORT || 3000,
};
