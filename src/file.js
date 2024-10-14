import fs from 'fs';
import { normalize, resolve, isAbsolute, basename, extname, sep, dirname } from 'path';
import { cwd } from 'process';
import { stat } from "fs/promises";
import { pipeline } from 'stream/promises';

const formatPath = (path) => {
    return isAbsolute(path) ? path : resolve(cwd(), normalize(path));
}

export const file = {
    async cat(path) {
        const readableStream = fs.createReadStream(formatPath(path), { encoding: 'utf-8' });
        readableStream.on('data', (chunk) => {
            console.log('\n' + chunk);
        });
        readableStream.on('error', () => {
            console.error('Operation failed');
        });
        readableStream.on('end', () => {
            console.log(`You are currently in ${cwd()}`);
        });
    },
    async add(fileName) {
        const filePath = formatPath(fileName);

        const dirContent = await fs.promises.readdir(cwd());
        if (dirContent.includes(fileName)) {
            console.log('File already exists');
            return;
        }

        try {
            const writeStream = fs.createWriteStream(filePath);
            writeStream.end();
            console.log('File added');
        } catch (error) {
            console.error('Operation failed: ' + error);
        }
    },
    async rn(oldFilePath, newFileName) {
        const dirContent = await fs.promises.readdir(dirname(formatPath(oldFilePath)));
        if (dirContent.includes(newFileName)) {
            console.log('File already exists');
            return;
        }

        const oldPath = formatPath(oldFilePath);
        const newPath = formatPath(newFileName);
        try {
            await fs.promises.rename(oldPath, newPath);
            console.log('File renamed');
        } catch(error) {
            console.error('Operation failed: ' + error);
        }
    },
    async cp(filePath, dirPath) {
        const source = formatPath(filePath);
        const destination = formatPath(dirPath);
        const fileName = basename(filePath);

        const stats = await stat(destination);
        if (!stats.isDirectory() || (extname(destination) && !destination.endsWith(sep))) {
            console.log('Destination is not directory');
            return 1;
        }

        const dirContent = await fs.promises.readdir(destination);
        if (dirContent.includes(fileName)) {
            console.log('File already exists');
            return 1;
        }
        const readableStream = fs.createReadStream(source);
        const writableStream = fs.createWriteStream(resolve(destination, normalize(fileName)));

        await pipeline(readableStream, writableStream);
        console.log(`File copied to ${destination}.`);
    },
    async mv(filePath, dirPath) {
        if (await this.cp(filePath, dirPath) !== 1) await this.rm(filePath);
    },
    async rm(filePath) {
        const resolvedPath = formatPath(filePath);

        try {
            await fs.access(resolvedPath, () => {});
            await fs.unlink(resolvedPath, () => {});
            console.log(`File ${resolvedPath} deleted.`)
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error(`File not found: ${resolvedPath}`);
            } else {
                console.error('Operation failed: ' + error);
            }
        }
    }
}
