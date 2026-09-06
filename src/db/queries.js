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
            ORDER BY id
        `,
        )
        .all(store);
}

export function getPriceHistory(db, recordId) {
    // price history is array of prices or empty []
    return db
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
}

export function getAllRecords(db) {
    return db.prepare(`SELECT id, artist, album, price, currency, stock, store FROM records`).all();
}

export function executeSQL(db, sql) {
    //const statement = db.prepare(sql);

    // if (statement.reader) {
    //     console.table(statement.all());
    // } else {
    //     console.log(statement.run());
    // }
    db.exec(sql);
}
