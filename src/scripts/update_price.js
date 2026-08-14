import { openDatabase } from '../db/connection.js';
import { updatePrice } from '../db/update.js';
import { getRecord } from '../parsers/get_record.js';

// add shop like an parametr
const url = process.argv[2];

if (!url) {
    console.error('Usage: npm run update-price -- <product-url>');
    process.exit(1);
}

const record = await getRecord(url);
const db = openDatabase();

try {
    const result = updatePrice(db, record);
    console.log(result.priceChanged ? `The record #${result.recordId} - price has been updated` : `The record #${result.recordId} - price has not been updated`);
} finally {
    db.close();
}
