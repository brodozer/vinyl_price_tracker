import { scrapeGramodesky } from './gramodesky.js';
import { scrapeMuziker } from './muziker.js';

const stores = {
    'gramodesky.cz': { name: 'Gramodesky', scraper: scrapeGramodesky },
    'muziker.cz': { name: 'Muziker', scraper: scrapeMuziker },
};

async function parseRecord(url) {
    const hostname = new URL(url).hostname.toLowerCase();
    const store = stores[hostname.replace(/^www\./, '')];

    if (!store) {
        throw new Error(`The store ${hostname} doesn't have a parser`);
    }

    return {
        ...(await store.scraper(url)),
        store: store.name,
    };
}

export async function getRecords(urls) {
    const records = [];
    for (let url of urls) {
        const record = await parseRecord(url);
        records.push(record);
    }
    return records;
}
