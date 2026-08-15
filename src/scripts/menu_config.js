export default {
    main: [
        {
            type: 'select',
            name: 'action',
            message: 'Select action',
            choices: ['1. Add', '2. Update', '3. Delete', '4. Query database', 'Exit'],
        },
    ],

    add: [
        {
            type: 'select',
            name: 'source',
            message: 'Select source',
            choices: ['URL', 'Import File'],
        },
    ],

    addUrls: [
        {
            type: 'input',
            name: 'url',
            message: 'Enter URL..',
        },
    ],

    addFile: [
        {
            type: 'select',
            name: 'fileName',
            message: 'Select file',
            choices: ['gramodesky.txt', 'muziker.txt'],
        },
    ],

    update: [
        {
            type: 'select',
            name: 'store',
            message: 'Select store',
            choices: ['Gramodesky', 'Muziker'],
        },
    ],

    database: {
        dbMenu: [
            {
                type: 'select',
                name: 'toDo',
                message: 'What do you need to do?',
                choices: [
                    {
                        name: '1. Show all records',
                        value: 'records',
                    },
                    {
                        name: '2. Find record by store',
                        value: 'byStore',
                    },
                    {
                        name: '3. Find record by ID',
                        value: 'byID',
                    },
                    {
                        name: '4. Show price history',
                        value: 'priceHistory',
                    },
                    {
                        name: '5. Execute SQL file',
                        value: 'SQL',
                    },
                    {
                        name: 'Back to menu',
                        value: 'back',
                    },
                ],
            },
            // 1. Show all records
            // 2. Find record by ID
            // 3. Find records by store
            // 4. Show price history
            // 5. Execute SQL file
            // 6. Back
        ],
        byStore: [
            {
                type: 'select',
                name: 'store',
                message: 'Select the store',
                choices: ['Muziker', 'Gramodesky'],
            },
        ],
        byID: [
            {
                type: 'input',
                name: 'id',
                message: 'Type the record ID',
            },
        ],
        priceHistory: [
            {
                type: 'input',
                name: 'id',
                message: 'Type the record ID',
            },
        ],
        sql: [
            {
                type: 'input',
                name: 'file',
                message: 'Type the file name',
            },
        ],
    },

    delete: [
        {
            type: 'number',
            name: 'id',
            message: 'Enter id...',
        },
    ],
};

export const ACTIONS = {
    ADD: '1. Add',
    UPDATE: '2. Update',
    DELETE: '3. Delete',
    QUERY: '4. Query database',
    EXIT: 'Exit',
};

//main menu
// 1. Add URL
// 2. Import from file
// 3. Update prices
// 4. Delete record
// 5. Database
// 6. Exit
