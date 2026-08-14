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
            throw new Error('Сначала открой ссылку товара вручную в Chrome');
        }

        const title = await page.title();

        if (/cloudflare|captcha|just a moment/i.test(title)) {
            throw new Error('Страница показывает проверку. Пройди её вручную в Chrome');
        }

        const product = await page.evaluate((productUrl) => {
            const normalizeText = (element) => element.textContent.replace(/\s+/g, ' ').trim();

            const table = document.querySelector('#tab-detail table[wire\\:key]');

            const details = Object.fromEntries(
                [...table.querySelectorAll('tbody tr')].map((row) => {
                    const cells = row.querySelectorAll('td');

                    return [normalizeText(cells[0]), normalizeText(cells[1])];
                }),
            );

            const productId = details['ID produktu'];

            const isStock = () => {
                const stockBtn = document.querySelector(`[id*="${productId}"]`);
                return stockBtn.dataset.availableId === 1;
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
                labels: details.Vydavatelství,
                releaseDate,
                price: 597,
                currency: 'CZK',
                inStock: isStock(),
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
