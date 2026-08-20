import puppeteer from 'puppeteer';
import { parseGramodeskyFavoritesPage } from './gramodesky_favorites.js';

const browserDebug = {
    browserURL: `http://127.0.0.1:9222`,
};

export async function getGramodeskyRecords(urls) {
    const browser = await puppeteer.connect(browserDebug);

    try {
        const pages = await browser.pages();
        const records = [];

        for (const url of urls) {
            const page = pages.find((page) => page.url() === url);

            if (!page) {
                throw new Error(`Page is not open: ${url}`);
            }

            const favoriteRecords = await parseGramodeskyFavoritesPage(page);

            records.push(...favoriteRecords);
        }

        return records;
    } finally {
        await browser.disconnect();
    }
}
