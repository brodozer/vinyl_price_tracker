import Database from 'better-sqlite3';

export function openDatabase(filename = 'database/vinyl.sqlite') {
    const db = new Database(filename);
    db.pragma('foreign_keys = ON');

    return db;
}
