import { readFile } from 'node:fs/promises';
import inquirer from 'inquirer';

export async function importFromFile() {
    const { filename } = await inquirer.prompt([
        {
            type: 'input',
            name: 'filename',
            message: 'Enter file path:',
        },
    ]);

    const content = await readFile(filename, 'utf8');

    const urls = content
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean);

    return urls;
}
