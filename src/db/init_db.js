import fs from 'node:fs';
import { PATHS } from '../../config/paths.js';
import { openDatabase } from './connection.js';

const sql = fs.readFileSync(PATHS.sql.init, 'utf8');

const db = openDatabase();

try {
    db.exec(sql);
    console.log('Database was created successfully');
} finally {
    db.close();
}
