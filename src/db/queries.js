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
            SELECT id, artist, album, price, currency, stock
            FROM records
            WHERE store = ?
        `,
        )
        .all(store);
}

export function getPriceHistory(db, recordId) {
    const history = db
        .prepare(
            `
        SELECT
            r.artist,
            r.album,
            ph.price,
            ph.currency,
            ph.checked_at
        FROM records AS r
        JOIN price_history AS ph
            ON ph.record_id = r.id
        WHERE r.id = ?
        ORDER BY ph.checked_at DESC
    `,
        )
        .all(recordId);

    if (!history.length) {
        console.log(`Record #${recordId} not found`);
        return;
    }

    return history;
}

export function getAllRecords(db) {
    return db.prepare(`SELECT id, artist, album, price, currency, stock, store FROM records`).all();
}
