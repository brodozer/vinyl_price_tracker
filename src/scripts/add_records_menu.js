import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';

import menu from './menu_config.js';
import { ROOT } from '../../config/paths.js';
import { addRecords } from './add_record.js';

export async function addRecordsMenu() {
    const { source } = await inquirer.prompt(menu.add);

    let urls = [];

    if (source === 'URL') {
        const { url } = await inquirer.prompt(menu.addUrls);

        urls = [url];
    }

    if (source === 'Import File') {
        const { fileName } = await inquirer.prompt(menu.addFile);
        const pathToFile = path.join(ROOT, 'urls', fileName);
        urls = fs
            .readFileSync(pathToFile, 'utf8')
            .split(/\r?\n/)
            .map((url) => url.trim())
            .filter(Boolean);
    }

    await addRecords(urls);
}
