import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { openDatabase } from '../db/connection.js';
import { deleteRelease } from '../db/delete.js';

const readline = createInterface({ input, output });

try {
    const releaseId = await readline.question('Input the id of record to delete: ');

    const db = openDatabase();

    try {
        const result = deleteRelease(db, releaseId);

        console.log(`Record #${result.releaseId} was deleted`);
    } finally {
        db.close();
    }
} finally {
    readline.close();
}
