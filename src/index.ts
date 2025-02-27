import express from 'express';
import movieRoutes from './routes/movie.routes';
import userRoutes from './routes/user.routes';
import sequelize from './database';
import path from "path";

const app = express();
app.use(express.json());
app.use(express.text({ type: '*/*' }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

sequelize.sync().then(() => {
    console.log('Database connected');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
