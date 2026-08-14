import { openDatabase } from '../db/connection.js';
import { addRecordsToDB } from '../db/add.js';
import { getRecord } from '../parsers/get_record.js';

// for gramodesky you must use command chrome-debag in CLI
// if we have array of links and it's not NULL we'll continue to work with it through method forEach
// or use the link in CLI

// const urls = process.argv[2].slice(2);
// if (urls.length === 0) {
//     console.error('Usage: npm run add -- <record-url>');
//     process.exit(1);
// }

// const records = [url_1, url_2...]
// const releases = []
// records.foreach((url) => {releases.push(getrecord(url))})

export async function addRecords(urls) {
    const records = [];

    for (let url of urls) {
        const record = await getRecord(url);
        records.push(record);
    }

    console.log('records ', records);

    const db = openDatabase();

    try {
        const newRecords = addRecordsToDB(db, records);
        console.log(`The records #${newRecords.join(', ')} was saved`);
    } finally {
        db.close();
    }
}
