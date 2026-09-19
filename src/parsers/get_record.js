import { getGramodeskyRecords } from './gramodesky.js';
import { getMuzikerRecords } from './muziker.js';

export async function getRecords(store, urls = []) {
    switch (store) {
        case 'Muziker':
            return getMuzikerRecords(urls);

        case 'Gramodesky':
            return getGramodeskyRecords();
    }
}
