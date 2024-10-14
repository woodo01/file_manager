import crypto from 'crypto';
import fs from 'fs';
import { normalize } from 'path';

export const hash = async (filePath) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(normalize(filePath));

    stream.on('data', (chunk) => {
        hash.update(chunk);
    });

    stream.on('end', () => {
        console.log(`Hash of file ${filePath}: ${hash.digest('hex')}`);
    })
}
