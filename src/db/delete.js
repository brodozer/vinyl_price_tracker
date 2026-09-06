export function deleteRecordFromDB(db, recordId) {
    // record id is always number
    if (recordId <= 0) {
        throw new Error(`Record id #${recordId} must be a positive number`);
    }

    const result = db
        .prepare(
            `
        DELETE FROM records
        WHERE id = ?
    `,
        )
        .run(recordId);

    if (result.changes === 0) {
        throw new Error(`No record found for id: #${recordId}`);
    }

    return recordId;
}
