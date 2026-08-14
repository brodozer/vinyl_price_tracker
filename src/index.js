import inquirer from 'inquirer';
import fs from 'fs';

import menu, { ACTIONS } from './scripts/menu_config.js';

import { addRecords } from './scripts/add_record.js';
import { updatePrices } from './scripts/update_price.js';
import { deleteRecord } from './scripts/delete_record.js';

while (true) {
    const { action } = await inquirer.prompt(menu.main);

    switch (action) {
        case ACTIONS.ADD: {
            const { source } = await inquirer.prompt(menu.add);

            let urls = [];

            if (source === 'URL') {
                const { url } = await inquirer.prompt(menu.addUrls);

                urls = [url];
            }

            if (source === 'Import File') {
                const { fileName } = await inquirer.prompt(menu.addFile);

                urls = fs
                    .readFileSync(`./urls/${fileName}`, 'utf8')
                    .split(/\r?\n/)
                    .map((url) => url.trim())
                    .filter(Boolean);
            }

            await addRecords(urls);

            break;
        }

        case ACTIONS.UPDATE: {
            const { shop } = await inquirer.prompt(menu.update);

            await updatePrices(shop);

            break;
        }

        case ACTIONS.DELETE: {
            const { id } = await inquirer.prompt(menu.delete);

            await deleteRecord(id);

            break;
        }

        case ACTIONS.EXIT: {
            console.log('Goodbye!');
            process.exit(0);
        }
    }
}
