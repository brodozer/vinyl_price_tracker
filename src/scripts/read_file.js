import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../../config/paths.js';

export async function readFile(folder, file) {
    const pathToFile = path.join(ROOT, folder, file);
    const urls = fs
        .readFileSync(pathToFile, 'utf8')
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean);
    return urls;
}
