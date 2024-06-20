const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const rawScriptTable = {
    'test1': 'https://raw.githubusercontent.com/StevenK-293/rawscript/main/raw/scripts/main_1.lua',
};

app.get('/', (req, res) => {
    res.send('Welcome to the home page.');
});

app.get('/api', (req, res) => {
    const instructions = `
    Welcome to the API endpoint.
    
    Usage:
    - /api/raw/<script_name>: Fetches the content of the script.
    
    Available Scripts:
    - test: Retrieves main_1.lua script from GitHub.
    `;
    res.set('Content-Type', 'text/plain');
    res.send(instructions);
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
        res.status(error.response ? error.response.status : 500).send('failed to fetch script');
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
