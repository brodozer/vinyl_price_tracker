import { openDatabase } from '../db/connection.js';
import { updateRecordsInDB, getUrlsByStore } from '../db/update.js';
import { getRecords } from '../parsers/get_record.js';
import { getGramodeskyRecords } from '../parsers/get_records_from_favorites.js';
import { readFile } from './read_file.js';

//import { records } from './records.js'; // import records from DB

// add shop like an parametr for updating all prices by the store

const messages = {
    priceAndStock: 'price and stock status have been updated',
    price: 'price has been updated',
    stock: 'stock status has been updated',
    unchanged: 'has the same price and stock status',
};

function getUpdateMessage(record) {
    return `The record #${record.recordId} - ${messages[record.updateStatus]}`;
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
        const urls = await source.getUrls(db);
        console.log('urls ', urls);
        const records = await source.getRecords(urls);

        console.log('recordsByStore ', records);

        const updatedRecords = updateRecordsInDB(db, records);
        updatedRecords.forEach((record) => {
            console.log(getUpdateMessage(record));
        });
    } finally {
        db.close();
    }
}
