export function getRecordById(db, recordId) {
    return db
        .prepare(
            `
            SELECT *
            FROM records
            WHERE id = ?
        `,
        )
        .get(recordId);
}

export function getRecordsByStore(db, store) {
    return db
        .prepare(
            `
            SELECT id, artist, album, price, currency
            FROM records
            WHERE store = ?
        `,
        )
        .all(store);
}

export function getPriceHistory(db, recordId) {
    return db
        .prepare(
            `
            SELECT *
            FROM price_history
            WHERE record_id = ?
            ORDER BY checked_at
        `,
        )
        .all(recordId);
}

export function getAllRecords(db) {
    return db.prepare(`SELECT id, artist, album, price, currency FROM records`).all();
}
