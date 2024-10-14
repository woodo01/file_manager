import fs from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import {isAbsolute, normalize, resolve} from 'path';
import { cwd } from 'process';

const formatPath = (path) => {
    return isAbsolute(path) ? path : resolve(cwd(), normalize(path));
}

export const compress = {
    async compressFile(inputPath, outputPath) {
        const source = fs.createReadStream(formatPath(inputPath));
        const destination = fs.createWriteStream(formatPath(outputPath));
        const brotli = createBrotliCompress();
        await pipeline(source, brotli, destination);
        console.log(`File has been compressed and saved to: ${outputPath}`);
    },
    async decompressFile(inputPath, outputPath) {
        const source = fs.createReadStream(formatPath(inputPath));
        const destination = fs.createWriteStream(formatPath(outputPath));
        const brotli = createBrotliDecompress();
        await pipeline(source, brotli, destination);
        console.log(`File has been decompressed and saved to: ${outputPath}`);
    }
}
