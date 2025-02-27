import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/data/database.sqlite',
    logging: false,
});

async function closeConnection() {
    try {
        await sequelize.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error closing database connection:", error);
    }
}

process.on("SIGINT", async () => {
    await closeConnection();
    process.exit(0);
});

export default sequelize;

