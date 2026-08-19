import inquirer from 'inquirer';

import menu from './menu_config.js';
import { readFile } from './read_file.js';
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
        urls = await readFile('urls', fileName);
        console.log('urls ', urls);
    }

    await addRecords(urls);
}
