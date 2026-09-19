import puppeteer from 'puppeteer';
import { checkChrome } from '../scripts/utils.js';
import { parseGramodeskyFavoritesPage } from './gramodesky_favorites.js';

const browserDebug = {
    browserURL: `http://127.0.0.1:9222`,
};

export async function getGramodeskyFavorites() {
    await checkChrome(browserDebug.browserURL);

    const browser = await puppeteer.connect(browserDebug);

    try {
        const pages = await browser.pages();
        console.log(
            'Open pages:',
            pages.map((page) => page.url()),
        );

        const favoritePages = pages.filter((page) => {
            return page.url().includes('https://www.gramodesky.cz/zakaznicka-sekce/oblibene');
        });

        if (favoritePages.length === 0) {
            throw new Error('Gramodesky favorites page is not open in Chrome');
        }

        const records = [];

        for (const page of favoritePages) {
            const favoriteRecords = await parseGramodeskyFavoritesPage(page);

            records.push(...favoriteRecords);
        }

        return records;
    } finally {
        await browser.disconnect();
        console.log('puppeteer disconnect');
    }
}
