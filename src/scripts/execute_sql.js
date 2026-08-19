// execute custom queries from ./sql/test.sql

import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../../config/paths.js';

export async function executeSQL(db, file) {
    const sql = fs.readFileSync(path.join(ROOT, 'sql', `${file}`), 'utf8').trim();

    const statement = db.prepare(sql);

    if (statement.reader) {
        console.table(statement.all());
    } else {
        console.log(statement.run());
    }
}
