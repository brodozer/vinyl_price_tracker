import path from 'node:path';

export const ROOT = process.cwd();

export const PATHS = {
    database: path.join(ROOT, 'database', 'records.sqlite'),
    sql: {
        init: path.join(ROOT, 'sql', 'init.sql'),
        test: path.join(ROOT, 'sql', 'test.sql'),
    },
    urls: {
        gramodesky: path.join(ROOT, 'urls', 'gramodesky.txt'),
        muziker: path.join(ROOT, 'urls', 'muziker.txt'),
        favorites: path.join(ROOT, 'urls', 'favorites.txt'),
    },
};
