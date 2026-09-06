import { openDatabase } from '../db/connection.js';
import { deleteRecordFromDB } from '../db/delete.js';

export async function deleteRecords(recordIds) {
    const db = openDatabase();

    try {
        for (const recordId of recordIds) {
            try {
                const deletedRecord = deleteRecordFromDB(db, recordId);
                console.log(`Record #${deletedRecord} deleted`);
            } catch (error) {
                console.log(error.message);
            }
        }
    } finally {
        db.close();
    }
}
