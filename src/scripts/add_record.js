import { openDatabase } from '../db/connection.js';
import { addRecordsToDB } from '../db/add.js';
import { getRecords } from '../parsers/get_record.js';

// for gramodesky you must use command chrome-debag in CLI
// if we have array of links and it's not NULL we'll continue to work with it through method forEach
// or use the link in CLI

export async function addRecords(urls) {
    const records = await getRecords(urls);

    console.log('records ', records);

    const db = openDatabase();

    try {
        const newRecords = addRecordsToDB(db, records);
        console.log(`The records # ${newRecords.join(', ')} were saved`);
    } finally {
        db.close();
    }
}
