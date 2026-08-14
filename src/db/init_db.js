import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const filename = 'database/vinyl.sqlite';
mkdirSync(dirname(filename), { recursive: true });

const db = new Database(filename);
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE records (
    id INTEGER PRIMARY KEY,
    store TEXT NOT NULL,
    product_id TEXT NOT NULL,
    ean TEXT,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    labels TEXT,
    release_date TEXT,
    url TEXT NOT NULL, 
    price INTEGER NOT NULL, 
    currency TEXT NOT NULL,
    stock TEXT NOT NULL,
    last_checked TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (store, product_id)
  );

  CREATE TABLE price_history (
    id INTEGER PRIMARY KEY,
    record_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    currency TEXT NOT NULL,
    checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id)
        REFERENCES records(id)
        ON DELETE CASCADE
);

  CREATE INDEX idx_price_history_record_id
    ON price_history(record_id);

`);
db.close();

console.log(`Database created: ${filename}`);
