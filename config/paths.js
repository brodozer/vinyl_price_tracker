import path from 'node:path';

export const ROOT = process.cwd();

export const PATHS = {
    database: path.join(ROOT, 'database', 'vinyl.sqlite'),
    sql: {
        init: path.join(ROOT, 'sql', 'init.sql'),
        test: path.join(ROOT, 'sql', 'test.sql'),
    },
};
