import fs from 'fs';
import path from 'path';

export const saveFile = (req: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const uploadDir = path.join(__dirname, '..', 'uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const timestamp = new Date().toISOString()
                .replace(/[-T:]/g, '')
                .split('.')[0];
            const fileName = `${timestamp}.txt`;
            const filePath = path.join(uploadDir, fileName);

            let bodyContent = req.body.toString();

            const fileStart = bodyContent.indexOf('Title:');
            if (fileStart !== -1) {
                bodyContent = bodyContent.substring(fileStart);
            }

            let lines = bodyContent.split('\n');

            const validKeys = ['Title:', 'Release Year:', 'Format:', 'Stars:'];

            let lastValidIndex = lines.length - 1;
            while (lastValidIndex >= 0) {
                const line = lines[lastValidIndex].trim();
                if (validKeys.some((key) => line.startsWith(key))) {
                    break;
                }
                lastValidIndex--;
            }

            if (lastValidIndex >= 0) {
                lines = lines.slice(0, lastValidIndex + 1);
            }

            fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

            resolve(filePath);
        } catch (error) {
            reject(error);
        }
    });
};
