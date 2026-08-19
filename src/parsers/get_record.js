import { scrapeGramodesky } from './gramodesky.js';
import { scrapeMuziker } from './muziker.js';

const stores = {
    'gramodesky.cz': { name: 'Gramodesky', scraper: scrapeGramodesky },
    'muziker.cz': { name: 'Muziker', scraper: scrapeMuziker },
};

async function parseRecord(url) {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const store = stores[hostname.replace(/^www\./, '')];
    // parsedUrl.search = '';
    // const cleanURL = parsedUrl.toString();

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
