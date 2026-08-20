import { openDatabase } from '../db/connection.js';
import { updateRecordsInDB, getUrlsByStore } from '../db/update.js';
import { getRecords } from '../parsers/get_record.js';
import { getGramodeskyRecords } from '../parsers/get_records_from_favorites.js';
import { readFile } from './read_file.js';

import { records } from './records.js'; // import records from DB

// add shop like an parametr for updating all prices by the store

function getUpdateMessage(record) {
    let message = '';
    if (record.priceChanged && record.stockStatus) {
        message = `The record #${record.recordId} - price and stock status has been updated`;
    } else if (record.priceChanged) {
        message = `The record #${record.recordId} - price has been updated`;
    } else if (record.stockStatus) {
        message = `The record #${record.recordId} - stock status has been updated`;
    } else {
        message = `The record #${record.recordId} - has the same price and stock status`;
    }

    if (message) {
        return message;
    }
}

const updateSources = {
    Gramodesky: {
        getUrls: () => readFile('urls', 'favorites.txt'),
        getRecords: getGramodeskyRecords,
    },

    Muziker: {
        getUrls: (db) => getUrlsByStore(db, 'Muziker'),
        getRecords: getRecords,
    },
};

export async function updateRecords(store) {
    if (!store) {
        throw new Error('The store was not specified');
    }

    const db = openDatabase();

    try {
        const source = updateSources[store];
        const urls = source.getUrls(db);
        //const records = await source.getRecords(urls);

        console.log('recordsByStore ', records);

        const updatedRecords = updateRecordsInDB(db, records);
        updatedRecords.forEach((record) => {
            console.log(getUpdateMessage(record));
        });
    } finally {
        db.close();
    }
}
