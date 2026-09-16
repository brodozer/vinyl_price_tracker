import { openDatabase } from '../db/connection.js';
import { updateRecordsInDB, getUrlsByStore } from '../db/update.js';
import { getRecords } from '../parsers/get_record.js';
import { getGramodeskyRecords } from '../parsers/get_records_from_favorites.js';
import { getUrlsFromFile } from './utils.js';

//import { records } from './records.js'; // import records from DB

// add shop like an parametr for updating all prices by the store

const messages = {
    priceAndStock: 'price and stock updated',
    price: 'price updated',
    stock: 'stock updated',
    unchanged: 'has the same price and stock status',
};

function getUpdateMessage(record) {
    if (record.updateStatus === 'not_found') {
        return `Record not found: ${record.store} / ${record.productId}`;
    }

    return `The record #${record.recordId} - ${messages[record.updateStatus]}`;
}

const updateSources = {
    Gramodesky: {
        getUrls: () => getUrlsFromFile('urls', 'favorites'),
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
