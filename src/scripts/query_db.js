// launch prepared functions from db/queries.js to show data from the tables records and price_history

// example
import inquirer from 'inquirer';
import menu from './menu_config.js';
import { openDatabase } from '../db/connection.js';
import { executeSQL } from './execute_sql.js';
import { getAllRecords, getRecordsByStore, getRecordById, getPriceHistory } from '../db/queries.js';

export async function queryDatabase() {
    const db = openDatabase();
    let exit = false;
    try {
        while (!exit) {
            const { toDo } = await inquirer.prompt(menu.database.dbMenu);

            switch (toDo) {
                case 'records':
                    showTable(db);
                    break;

                case 'byStore':
                    await showByStore(db);
                    break;

                case 'byID':
                    await showById(db);
                    break;
                case 'priceHistory':
                    await showPriceHistory(db);
                    break;
                case 'SQL':
                    const { file } = await inquirer.prompt(menu.database.sql);
                    await executeSQL(db, file);
                    break;
                case 'back':
                    exit = true;
                    break;
            }
        }
    } finally {
        db.close();
    }
}

async function showTable(db) {
    const records = getAllRecords(db);

    console.table(records);
}

async function showByStore(db) {
    const { store } = await inquirer.prompt(menu.database.byStore);

    const records = getRecordsByStore(db, store);

    console.table(records);
}

async function showById(db) {
    const { id } = await inquirer.prompt(menu.database.byID);

    const record = getRecordById(db, id);

    console.table(record);
}

async function showPriceHistory(db) {
    const { id } = await inquirer.prompt(menu.database.priceHistory);
    const records = getPriceHistory(db, id);
    console.table(records);
}
