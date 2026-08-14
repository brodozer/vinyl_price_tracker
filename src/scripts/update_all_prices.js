// use id
import { openDatabase } from '../db/connection.js';
import { getProduct } from '../parsers/get_record.js';
import { updatePrice } from '../db/update.js';

const db = openDatabase();

const listings = db
    .prepare(
        `
    SELECT id, url
    FROM listings
`,
    )
    .all();

for (const listing of listings) {
    try {
        const product = await getProduct(listing.url);

        const result = updatePrice(db, product);

        console.log(`Listing #${listing.id}: ${result.priceChanged ? 'цена изменилась' : 'без изменений'}`);
    } catch (error) {
        console.error(`Listing #${listing.id}: ${error.message}`);
    }
}

db.close();
