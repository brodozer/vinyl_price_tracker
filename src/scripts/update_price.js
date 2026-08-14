import { openDatabase } from '../db/connection.js';
import { updatePricesInDB } from '../db/update.js';
import { getRecords } from '../parsers/get_record.js';

// add shop like an parametr for updating all prices

export async function updatePrices(urls) {
    const records = await getRecords(urls);
    const db = openDatabase();

    try {
        const updatedRecords = updatePricesInDB(db, records);
        updatedRecords.forEach((record) => {
            console.log(record.priceChanged ? `The record #${record.recordId} - price has been updated` : `The record #${record.recordId} - price has not been updated`);
        });
    } finally {
        db.close();
    }
}
