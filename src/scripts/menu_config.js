export default {
    main: [
        {
            type: 'select',
            name: 'action',
            message: 'Select action',
            choices: ['Add', 'Update', 'Delete', 'Exit'],
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
            name: 'shop',
            message: 'Select shop',
            choices: ['Gramodesky', 'Muziker'],
        },
    ],

    delete: [
        {
            type: 'number',
            name: 'id',
            message: 'Enter id...',
        },
    ],
};

export const ACTIONS = {
    ADD: 'Add',
    UPDATE: 'Update',
    DELETE: 'Delete',
    EXIT: 'Exit',
};
