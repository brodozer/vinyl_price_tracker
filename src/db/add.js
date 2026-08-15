export function addRecordsToDB(db, records) {
    return db.transaction(() => {
        const insertRecord = db.prepare(`
            INSERT OR IGNORE INTO records (
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
            const newRecord = insertRecord.run(record.store, record.productId, record.artist, record.album, record.labels ?? null, record.releaseDate ?? null, record.url, record.price, record.currency, record.stock);
            // check result
            if (newRecord.changes === 0) {
                result.push({ success: false, id: null, url: record.url });
                // add reason to obj
                continue;
            }

            const recordId = Number(newRecord.lastInsertRowid);

            insertHistory.run(recordId, record.price, record.currency);

            result.push({ success: true, id: recordId, url: record.url });
        }

        return result;
    })();
}
