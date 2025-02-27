import fs from 'fs';
import util from 'util';
import path from "path";
import {config} from "../config";

const readFileAsync = util.promisify(fs.readFile);

export const parseMoviesFromFile = async (filePath: string) => {
    try {
        const data = await readFileAsync(filePath, 'utf-8');
        const blocks = data.split(/(?=Title: )/g);

        const movies = blocks.map(block => {
            const lines = block.split('\n').map(line => line.trim());

            const title = lines.find(line => line.startsWith('Title:'))?.replace('Title: ', '').trim();
            const year = lines.find(line => line.startsWith('Release Year:'))?.replace('Release Year: ', '').trim();
            const format = lines.find(line => line.startsWith('Format:'))?.replace('Format: ', '').trim();
            const stars = lines.find(line => line.startsWith('Stars:'))?.replace('Stars: ', '').trim();

            if (title && year && format && stars) {
                return {
                    title,
                    year: parseInt(year, 10),
                    format,
                    actors: stars.split(',').map(actor => actor.trim()),
                    source: `http://localhost:${config.port}/uploads/${path.basename(filePath)}`,
                };
            }
            return null;
        }).filter(movie => movie !== null);

        return movies;
    } catch (error) {
        console.error('File parsing error:', error);
        throw new Error('Failed to process file');
    }
};
