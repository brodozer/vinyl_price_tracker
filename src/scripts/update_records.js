import { openDatabase } from '../db/connection.js';
import { updateRecordsInDB, getUrlsByStore } from '../db/update.js';
import { getMuzikerRecords } from '../parsers/muziker.js';
import { getGramodeskyFavorites } from '../parsers/get_records_from_favorites.js';

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
    if (record.updateStatus === 'unchanged') {
        return;
    }

    return `The record #${record.recordId} - ${messages[record.updateStatus]}`;
}

const updateSources = {
    Gramodesky: {
        getRecords: () => getGramodeskyFavorites(),
    },

    Muziker: {
        getRecords: async (db) => {
            const urls = await getUrlsByStore(db, 'Muziker');

            return getMuzikerRecords(urls);
        },
    },
};

export async function updateRecords(store) {
    if (!store) {
        throw new Error('The store was not specified');
    }

    const db = openDatabase();

    try {
        const source = updateSources[store];

        const records = await source.getRecords(db);

        console.log('recordsByStore ', records);

        const updatedRecords = updateRecordsInDB(db, records);
        updatedRecords.forEach((record) => {
            const message = getUpdateMessage(record);
            if (message) {
                console.log(message);
            }
        });
        console.log('update completed');
    } finally {
        db.close();
    }
}
