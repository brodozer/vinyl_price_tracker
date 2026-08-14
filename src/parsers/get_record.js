import { scrapeGramodesky } from './gramodesky.js';
import { scrapeMuziker } from './muziker.js';

const stores = {
    'gramodesky.cz': { name: 'Gramodesky', scraper: scrapeGramodesky },
    'muziker.cz': { name: 'Muziker', scraper: scrapeMuziker },
};

export async function getRecord(url) {
    const hostname = new URL(url).hostname.toLowerCase();
    const store = stores[hostname.replace(/^www\./, '')];

    if (!store) {
        throw new Error(`Для магазина ${hostname} ещё нет парсера`);
    }

    return {
        ...(await store.scraper(url)),
        store: store.name,
    };
}
