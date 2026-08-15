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

            if (!record.shop) {
                throw new Error('The shop was not found');
            }

            const currentRecord = db
                .prepare(
                    `
                    SELECT id, price
                    FROM records
                    WHERE store = ?
                      AND product_id = ?
                `,
                )
                .get(record.shop, record.productId);

            if (!currentRecord) {
                throw new Error(`Record not found: ${record.shop} / ${record.productId}`);
            }

            const priceChanged = currentRecord.price !== record.price;
            const stockStatus = currentRecord.stock !== record.stock;

            if (priceChanged || stockStatus) {
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
                priceChanged,
                stockStatus,
            });
        }

        return results;
    })();
}

// example what I need to get to update the record price
// {
//     shop: 'muziker',
//     productId: '338494',
//     price: 549,
//     stock: 'in_stock' 0 or 1
// }
