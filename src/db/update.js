function getUpdateStatus(priceChanged, stockChanged) {
    if (priceChanged && stockChanged) {
        return 'priceAndStock';
    }

    if (priceChanged) {
        return 'price';
    }

    if (stockChanged) {
        return 'stock';
    }

    return 'unchanged';
}

export function getUrlsByStore(db, store) {
    return db
        .prepare(
            `
            SELECT url
            FROM records
            WHERE store = ?
        `,
        )
        .all(store)
        .map((record) => record.url);
}

export function updateRecordsInDB(db, records) {
    return db.transaction(() => {
        const results = [];

        for (const record of records) {
            if (!record.productId) {
                throw new Error('The product_id was not found');
            }

            if (!record.store) {
                throw new Error('The store was not found');
            }

            const currentRecord = db
                .prepare(
                    `
                    SELECT id, price, stock
                    FROM records
                    WHERE store = ?
                      AND product_id = ?
                `,
                )
                .get(record.store, record.productId);

            if (!currentRecord) {
                //throw new Error(`Record not found: ${record.store} / ${record.productId}`);
                results.push({
                    productId: record.productId,
                    updateStatus: 'not_found',
                    store: record.store,
                });

                continue;
            }

            const priceChanged = currentRecord.price !== record.price;
            const stockChanged = currentRecord.stock !== record.stock;

            const updateStatus = getUpdateStatus(priceChanged, stockChanged);

            //console.log(record.store, record.productId, record.price);

            if (priceChanged || stockChanged) {
                db.prepare(
                    `
                UPDATE records
                SET price = ?,
                    stock = ?,
                    last_checked = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                ).run(record.price, record.stock, currentRecord.id);
            }

            if (priceChanged) {
                db.prepare(
                    `
                    INSERT INTO price_history (
                        record_id,
                        price,
                        currency
                    )
                    VALUES (?, ?, ?)
                `,
                ).run(currentRecord.id, record.price, record.currency);
            }

            results.push({
                recordId: currentRecord.id,
                updateStatus,
            });
        }

        return results;
    })();
}
