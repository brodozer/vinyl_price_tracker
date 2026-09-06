// launch prepared functions from db/queries.js to show data from the tables records and price_history

// example
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../../config/paths.js';

import inquirer from 'inquirer';
import menu from './config_menu.js';
import { openDatabase } from '../db/connection.js';

import { getAllRecords, getRecordsByStore, getRecordById, getPriceHistory, executeSQL } from '../db/queries.js';

// databaseMenu -> move to menu.js
export async function databaseMenu() {
    const db = openDatabase();
    let exit = false;
    try {
        while (!exit) {
            const { toDo } = await inquirer.prompt(menu.database.dbMenu);

            switch (toDo) {
                case 'records':
                    showRecords(db);
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
                    await executeSQLFile(db);
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

function tableName(name) {
    console.log(`=============${name}=============`);
}

async function showRecords(db) {
    const records = getAllRecords(db);
    tableName('RECORDS');
    console.table(records);
}

async function showByStore(db) {
    const { store } = await inquirer.prompt(menu.database.byStore);

    const records = getRecordsByStore(db, store);
    tableName('RECORDS BY STORE');
    console.table(records);
}

async function showById(db) {
    const { id } = await inquirer.prompt(menu.database.byID);

    const record = getRecordById(db, id);
    tableName('RECORDS BY ID');
    console.table(record);
}

async function showPriceHistory(db) {
    const { id } = await inquirer.prompt(menu.database.priceHistory);
    const records = getPriceHistory(db, id);
    if (records.length > 0) {
        tableName('PRICE HISTORY');
        console.log(`${records[0].artist} - ${records[0].album}`);

        console.table(
            records.map(({ price, currency, checked_at }) => ({
                price,
                currency,
                date: checked_at,
            })),
        );
    } else {
        console.log(`The id #${id} doesn't exist`);
    }

    //console.table(records);
}

export async function executeSQLFile(db) {
    const { file } = await inquirer.prompt(menu.database.sql);
    const sql = fs.readFileSync(path.join(ROOT, 'sql', `${file}`), 'utf8').trim();

    if (!sql) {
        console.log('SQL file is empty');
        return;
    }

    executeSQL(db, sql);

    console.log(`SQL file "${file}" executed successfully`);
}
