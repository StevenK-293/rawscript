const express = require('express');
const axios = require('axios');

const app = express();

const scriptRepoUrl = 'https://raw.githubusercontent.com/StevenK-293/rawscript/main/raw/scripts/';

async function fetchScript(scriptName) {
    const fileUrl = `${scriptRepoUrl}${scriptName}.lua`;
    try {
        const response = await axios.get(fileUrl);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch script:', error);
        throw error;
    }
}

app.get('/api/raw/:script_name', async (req, res) => {
    const scriptName = req.params.script_name;

    try {
        const scriptContent = await fetchScript(scriptName);
        res.set('Content-Type', 'text/plain');
        res.send(scriptContent);
    } catch (error) {
        console.error('Script not found or failed to fetch:', error);
        res.status(404).send('Script not found or failed to fetch');
    }
});

app.get('/api', (req, res) => {
    const instructions = `
    Welcome to the API endpoint.

    Usage:
    - /api/raw/<script_name>: Fetches the content of the script.

    Available Scripts:
    - test1: Retrieves main_1.lua script from GitHub.
    `;
    res.set('Content-Type', 'text/plain');
    res.send(instructions);
});

app.get('*', (req, res) => {
    res.status(404).send('Not the right endpoint');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;
