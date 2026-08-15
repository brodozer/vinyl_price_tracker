import Database from 'better-sqlite3';
import { PATHS } from '../../config/paths.js';

export function openDatabase(filename = PATHS.database) {
    const db = new Database(filename);
    db.pragma('foreign_keys = ON');

    return db;
}
