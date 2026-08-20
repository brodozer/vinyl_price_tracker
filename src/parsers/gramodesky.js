import puppeteer from 'puppeteer';

const browserDebug = {
    browserURL: `http://127.0.0.1:9222`,
};

export async function scrapeGramodesky(url) {
    const browser = await puppeteer.connect(browserDebug);
    console.log('url ', url);

    try {
        const pages = await browser.pages();
        const page = pages.find((page) => page.url() === url);

        if (!page) {
            throw new Error(`Page is not open in Chrome: ${url}`);
        }

        const title = await page.title();

        if (/cloudflare|captcha|just a moment/i.test(title)) {
            throw new Error('The page shows check, you need to go checking');
        }

        const product = await page.evaluate((productUrl) => {
            console.log('scrape Gramodesky');
            const normalizeText = (element) => element.textContent.replace(/\s+/g, ' ').trim();

            const table = document.querySelector('#tab-detail table[wire\\:key]');

            const details = Object.fromEntries(
                [...table.querySelectorAll('tbody tr')].map((row) => {
                    const cells = row.querySelectorAll('td');

                    return [normalizeText(cells[0]), normalizeText(cells[1])];
                }),
            );

            console.log('details ', details);

            const productId = details['ID produktu'];

            const stockStatus = (id) => {
                const stock = document.querySelector(`.availability-date-container[data-release-id="${id}"]`);
                const stockStatus = stock.dataset.availableId === '1';
                return stockStatus ? 'in_stock' : 'out_of_stock';
            };

            const getPrice = (id) => {
                const release = document.querySelector(`[wire\\:key="variant-${id}"]`);
                if (!release) {
                    console.warn(`Price not found for release ${id}, setting price to 0`);
                    return 0;
                }
                return JSON.parse(release.dataset.dl).ecommerce.value;

                // release.dataset.dl contains artist name and album, price, currency
                //or  .ecomm_totalvalue
            };

            const date = details['Datum vydání'];

            const months = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

            const convertDate = (date) => {
                const [day, monthName, year] = date.split(' ');

                const monthIndex = months.indexOf(monthName);

                if (monthIndex === -1) {
                    return null;
                }

                const month = String(monthIndex + 1).padStart(2, '0');
                const formattedDay = day.replace('.', '').padStart(2, '0');

                return `${year}-${month}-${formattedDay}`;
            };

            const releaseDate = convertDate(date);

            // change the object of record and add EAN details[EAN] and discogs
            return {
                artist: details.Interpret,
                album: details.Titul,
                labels: details.Vydavatelství || null,
                ean: details.EAN || null,
                releaseDate: releaseDate || null,
                price: getPrice(productId),
                currency: 'CZK',
                stock: stockStatus(productId),
                productId,
                url: productUrl,
            };
        }, url);

        return product;
    } finally {
        await browser.disconnect();
        console.log('puppeteer disconnected');
    }
}
