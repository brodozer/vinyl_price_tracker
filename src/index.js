import inquirer from 'inquirer';
import { addRecords } from './scripts/add_record.js';

async function main() {
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Add URL', 'Import from file', 'Update prices', 'Delete record', 'Exit'],
            },
        ]);

        switch (action) {
            case 'Add URL':
                await addUrl();
                break;

            case 'Import from file':
                const urls = await importFromFile();

                addRecords(urls);

                break;

            case 'Update prices':
                await updatePrices();
                break;

            case 'Delete record':
                await deleteRecord();
                break;

            case 'Exit':
                process.exit(0);
        }
    }
}

main();
