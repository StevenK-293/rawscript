const express = require('express');
const axios = require('axios');

const app = express();

const rawScriptTable = {
    'test1': 'https://raw.githubusercontent.com/StevenK-293/rawscript/main/raw/scripts/main_1.lua',
};

// Styled welcome message
const welcomeMessage = `
************************************************
*                                              *
*    Welcome to the rawscript API endpoint     *
*                                              *
************************************************

Usage:
- /api/raw/<script_name>: Fetches the script content.

Available Scripts:
- test1: Retrieves main_1.lua script from GitHub.
`;

app.get('/', (req, res) => {
    res.send('Welcome to the home page.');
});

app.get('/api', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(welcomeMessage);
});

app.get('/api/raw/:script_name', async (req, res) => {
    const scriptName = req.params.script_name;

    if (!rawScriptTable.hasOwnProperty(scriptName)) {
        res.status(404).send('Script not found');
        return;
    }

    const fileUrl = rawScriptTable[scriptName];

    try {
        const response = await axios.get(fileUrl);
        res.set('Content-Type', 'text/plain');
        res.send(response.data);
    } catch (error) {
        console.error('Failed to fetch script:', error);
        res.status(error.response ? error.response.status : 500).send('Failed to fetch script');
    }
});

app.get('*', (req, res) => {
    res.status(404).send('Not the right endpoint');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;
