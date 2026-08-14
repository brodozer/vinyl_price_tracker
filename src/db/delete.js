export function deleteRecordFromDB(db, recordId) {
    // record id is always number
    if (recordId <= 0) {
        throw new Error('recordId must be positive number');
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
        throw new Error(`Record with id ${recordId} hasn't found`);
    }

    return recordId;
}
