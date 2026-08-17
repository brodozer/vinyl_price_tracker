import puppeteer from 'puppeteer';

const browserDebug = {
    browserURL: `http://127.0.0.1:9222`,
};

export async function scrapeGramodesky(url) {
    const browser = await puppeteer.connect(browserDebug);

    try {
        const pages = await browser.pages();

        const page = pages.find((page) => page.url() === url);

        if (!page) {
            throw new Error('Before you can continue, you need to open the Chrome debug');
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

            const isStock = () => {
                // document.querySelector('.btn[id*="${productId}"]')
                const stockBtn = document.querySelector(`.availability-date-container[data-release-id="${productId}"]`);
                console.log('stockBtn ', stockBtn);
                console.log('available ', stockBtn.dataset.availableId);
                return stockBtn.dataset.availableId === '1';
            };

            const stockStatus = isStock();

            console.log('stock ', stockStatus);

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
                price: 597,
                currency: 'CZK',
                stock: isStock() ? 'in_stock' : 'out_of_stock',
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
