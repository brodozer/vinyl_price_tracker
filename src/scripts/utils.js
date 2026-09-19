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

export async function checkChrome(url) {
    try {
        const response = await fetch(`${url}/json/version`);

        if (!response.ok) {
            throw new Error(`Chrome DevTools returned ${response.status}`);
        }
    } catch {
        throw new Error('Chrome is not running or remote debugging is not available on port 9222');
    }
}
