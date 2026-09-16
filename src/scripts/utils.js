import fs from 'node:fs';
import { PATHS } from '../../config/paths.js';

export function readFile(folder, file) {
    const pathToFile = PATHS[folder][file];
    console.log('path ', pathToFile);
    return fs.readFileSync(pathToFile, 'utf8');
}

export function getUrlsFromFile(folder, file) {
    const content = readFile(folder, file);
    const urls = content
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean);
    return urls;
}
