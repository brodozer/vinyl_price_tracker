import { openDatabase } from '../db/connection.js';
import { addRecordsToDB } from '../db/add.js';
import { getRecords } from '../parsers/get_record.js';

// for gramodesky you must use command chrome-debag in CLI
// if we have array of links and it's not NULL we'll continue to work with it through method forEach
// or use the link in CLI

function notifications(newRecords) {
    const saved = newRecords.filter(({ success }) => success).map(({ id }) => id);
    const rejected = newRecords.filter(({ success }) => !success).map(({ url }) => url);

    if (saved.length > 0) {
        console.log(`The records # ${saved.join(', ')} were saved`);
    }

    if (rejected.length > 0) {
        console.log(`The records ${rejected.join(', ')} weren't saved`);
    }
}

export async function addRecords(urls) {
    const records = await getRecords(urls);

    console.log('records ', records);

    const db = openDatabase();

    try {
        const newRecords = addRecordsToDB(db, records);
        notifications(newRecords);
    } finally {
        db.close();
    }
}
