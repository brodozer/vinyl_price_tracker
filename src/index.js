import inquirer from 'inquirer';

import menu, { ACTIONS } from './scripts/menu_config.js';

import { addRecordsMenu } from './scripts/add_records_menu.js';
import { queryDatabase } from './scripts/query_db.js';
import { updateRecords } from './scripts/update_records.js';
import { deleteRecord } from './scripts/delete_record.js';

while (true) {
    const { action } = await inquirer.prompt(menu.main);

    switch (action) {
        case ACTIONS.ADD: {
            await addRecordsMenu();

            break;
        }

        case ACTIONS.UPDATE: {
            const { store } = await inquirer.prompt(menu.update);

            await updateRecords(store);

            break;
        }

        case ACTIONS.DELETE: {
            const { id } = await inquirer.prompt(menu.delete);

            await deleteRecord(id);

            break;
        }

        case ACTIONS.QUERY: {
            await queryDatabase();
            break;
        }

        case ACTIONS.EXIT: {
            console.log('Goodbye!');
            process.exit(0);
        }
    }
}
