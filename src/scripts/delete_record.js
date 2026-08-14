import { openDatabase } from '../db/connection.js';
import { deleteRecordFromDB } from '../db/delete.js';

export async function deleteRecord(recordId) {
    const db = openDatabase();

    try {
        const deletedRecord = deleteRecordFromDB(db, recordId);

        console.log(`Record #${deletedRecord} was deleted`);
    } finally {
        db.close();
    }
}
