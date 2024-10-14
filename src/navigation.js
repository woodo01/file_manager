import fs from 'fs/promises';
import { normalize, resolve } from 'path';
import { chdir, cwd } from 'process';
import { dirname } from 'path';

const isDirectory = async (path) => {
    try {
        const stats = await fs.stat(path);
        return stats.isDirectory();
    } catch {
        return false;
    }
};

export const navigation = {
    async up() {
        const currentDir = cwd();
        const parentDir = dirname(currentDir);

        if (currentDir === parentDir) {
            console.error('Already at the root directory, cannot go up.');
            return;
        }

        await this.cd(parentDir);
    },
    async ls() {
        const currentDir = cwd();
        try {
            const files = await fs.readdir(currentDir, { withFileTypes: true });
            const allFiles = files.map((file) => {
                const name = file.name;
                const type = file.isDirectory() ? 'directory' : 'file';
                return {
                    name,
                    type,
                };
            });

            console.table(allFiles);
        } catch (err) {
            console.error(`Error reading directory: ${err.message}`);
        }
    },
    async cd(pathToDirectory) {
        const cdDirectory = resolve(cwd(), normalize(pathToDirectory));
        const isDir = await isDirectory(cdDirectory);

        if (isDir) {
            chdir(cdDirectory);
            console.log(`Changed directory to ${cdDirectory}`);
        } else {
            console.error(`Error: "${cdDirectory}" is not a valid directory.`);
        }
    },
}
