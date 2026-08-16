import { openDatabase } from '../db/connection.js';
import { updateRecordsInDB, getUrlsByStore } from '../db/update.js';
import { getRecords } from '../parsers/get_record.js';
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
        console.log(message);
    }
}

export async function updateRecords(store) {
    if (!store) {
        throw new Error('The store was not specified');
    }

    const db = openDatabase();

    try {
        const urls = getUrlsByStore(db, store);

        if (urls.length === 0) {
            console.log(`No records found for store: ${store}`);
            return;
        }

        //const records = await getRecords(urls);

        //console.log('recordsByStore ', records);

        const updatedRecords = updateRecordsInDB(db, records);
        updatedRecords.forEach((record) => {
            getUpdateMessage(record);
        });
    } finally {
        db.close();
    }
}
