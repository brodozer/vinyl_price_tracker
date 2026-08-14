import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMuziker(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const details = $('.extended-product-short-description ul li strong')
        .map((_, el) => $(el).text().trim())
        .get();

    const productTitle = $('h1.product-title').text();

    const [artist, ...albumParts] = productTitle
        .replace(/\s*\(LP\)\s*$/, '')
        .split(' - ')
        .map((value) => value.trim());

    return {
        productId: $('meta[property="lb:id"]').attr('content') || null,
        artist,
        album: albumParts.join(' - '),
        labels: $('a[href*="lp-desky?param.739"]')
            .map((_, el) => $(el).text().trim())
            .get()
            .join(', '),
        releaseDate: details[0]?.replaceAll('.', '-') || null,
        url,
        price: Number($('[data-original-price-value]').attr('data-original-price-value')),
        currency: 'CZK',
        stock: $('.stock-status-detail.stock-status-green').length > 0 ? 'in_stock' : 'out_of_stock',
    };
}

// stock:
// in_stock
// out_of_stock
// on_order
// preorder
// unknown

//     id INTEGER PRIMARY KEY,
//     store TEXT NOT NULL,
//     product_id TEXT NOT NULL,
//     artist TEXT NOT NULL,
//     album TEXT NOT NULL,
//     labels TEXT,
//     release_date TEXT,
//     url TEXT NOT NULL,
//     price INTEGER NOT NULL,
//     currency TEXT NOT NULL,
//     stock TEXT NOT NULL,
//     last_checked TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE (store, product_id)
