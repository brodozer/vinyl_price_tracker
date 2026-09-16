import { readFile } from '../scripts/utils.js';

export function createDB(db) {
    const sql = readFile('sql', 'init');
    db.exec(sql);
    console.log('Database was created successfully');
}
