import inquirer from 'inquirer';

import { getUrlsFromFile } from '../scripts/utils.js';
import { addRecords } from '../scripts/add_records.js';

import menu, { ACTIONS } from './config_menu.js';

import { updateRecords } from '../scripts/update_records.js';
import { deleteRecords } from '../scripts/delete_records.js';
import { databaseMenu } from './database_menu.js';

export async function showMenu() {
    while (true) {
        const { action } = await inquirer.prompt(menu.main);

        switch (action) {
            case ACTIONS.ADD: {
                await addRecordsMenu();

                break;
            }

            case ACTIONS.UPDATE: {
                await updateRecordsMenu();

                break;
            }

            case ACTIONS.DELETE: {
                await deleteRecordsMenu();

                break;
            }

            case ACTIONS.DATABASE: {
                await databaseMenu();
                break;
            }

            case ACTIONS.EXIT: {
                console.log('Goodbye!');
                process.exit(0);
            }
        }
    }
}

async function addRecordsMenu() {
    const { source } = await inquirer.prompt(menu.add);

    let urls = [];

    if (source === 'URL') {
        const { url } = await inquirer.prompt(menu.addUrls);

        urls = [url];
    }

    if (source === 'Import File') {
        const { fileName } = await inquirer.prompt(menu.addFile);
        urls = getUrlsFromFile('urls', fileName);
        console.log('urls ', urls);
    }

    await addRecords(urls);
}

async function updateRecordsMenu() {
    const { store } = await inquirer.prompt(menu.update);

    try {
        await updateRecords(store);
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteRecordsMenu() {
    const { ids } = await inquirer.prompt(menu.delete);
    const recordIDs = ids.split(',').map((id) => Number(id.trim()));
    await deleteRecords(recordIDs);
}
