// parse favorites records from gramodesky.cz

import { availableStatus } from './gramodesky.js';

export async function parseGramodeskyFavoritesPage(page) {
    return page.evaluate((availableStatus) => {
        const records = [];
        console.log('scrape Gramodesky favorite page');

        const wishList = document.querySelectorAll('.wishlist-row');

        for (const wishListItem of wishList) {
            const statusSite = wishListItem.querySelector('.wishlist-col-availability span').textContent;
            const stock = availableStatus.find((status) => {
                return status.site === statusSite.toLowerCase();
            });

            const price = wishListItem.querySelectorAll('.wishlist-col-price p')[1].textContent.replace(/\s*Kč\s*$/, '');
            //console.log('item ', wishListItem);

            const productId = wishListItem.querySelector('a').getAttribute('href').split('=')[1];

            records.push({
                price: Number(price),
                stock: stock.db ?? 'out_of_stock',
                productId,
                store: 'Gramodesky',
                currency: 'CZK',
            });
        }

        return records;
    }, availableStatus);
}
