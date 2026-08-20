// parse favorites records from gramodesky.cz

export async function parseGramodeskyFavoritesPage(page) {
    return page.evaluate(() => {
        const records = [];
        console.log('scrape Gramodesky favorite page');

        const wishList = document.querySelectorAll('.wishlist-row');

        for (const wishListItem of wishList) {
            const stock = wishListItem.querySelector('.wishlist-col-availability span').textContent === 'Skladem';

            const price = wishListItem.querySelectorAll('.wishlist-col-price p')[1].textContent.replace(/\s*Kč\s*$/, '');

            const productId = wishListItem.querySelectorAll('a')[5].getAttribute('href').split('=')[1];

            records.push({
                price: Number(price),
                stock: stock ? 'in_stock' : 'out_of_stock',
                productId,
                store: 'Gramodesky',
            });
        }

        return records;
    });
}
