export function updateRecord(db, record) {
    if (!record.productId) {
        throw new Error('The product_id was not found');
    }

    if (!record.shop) {
        throw new Error('The shop was not found');
    }

    return db.transaction(() => {
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

        db.prepare(
            `
            UPDATE records
            SET price = ?,
                stock = ?,
                last_checked = CURRENT_TIMESTAMP
            WHERE id = ?
        `,
        ).run(record.price, record.stock, currentRecord.id);

        const priceChanged = currentRecord.price !== record.price;

        if (priceChanged) {
            db.prepare(
                `
                INSERT INTO price_history (
                    record_id,
                    price,
                    currency
                )
                VALUES (?, ?)
            `,
            ).run(currentRecord.id, record.price, record.currency);
        }

        return {
            recordId: currentRecord.id,
            priceChanged,
        };
    })();
}

// example what I need to get to update the record price
// {
//     shop: 'muziker',
//     productId: '338494',
//     price: 549,
//     stock: 'in_stock' 0 or 1
// }
