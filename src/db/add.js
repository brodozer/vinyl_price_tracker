export function addRecordsToDB(db, records) {
    return db.transaction(() => {
        const insertRecord = db.prepare(`
            INSERT INTO records (
                store,
                product_id,
                artist,
                album,
                labels,
                release_date,
                url,
                price,
                currency,
                stock
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const insertHistory = db.prepare(`
            INSERT INTO price_history (
                record_id,
                price,
                currency
            )
            VALUES (?, ?, ?)
        `);

        const result = [];

        for (const record of records) {
            const recordId = Number(insertRecord.run(record.store, record.productId, record.artist, record.album, record.labels ?? null, record.releaseDate ?? null, record.url, record.price, record.currency, record.stock).lastInsertRowid);

            insertHistory.run(recordId, record.price, record.currency);

            result.push(recordId);
        }

        return result;
    })();
}
