const express = require('express');
const axios = require('axios');

const app = express();

const rawScriptTable = {
    'test1': 'https://raw.githubusercontent.com/StevenK-293/rawscript/main/raw/scripts/main_1.lua',
    'test_2': 'https://raw.githubusercontent.com/StevenK-293/rawscript/main/raw/scripts/main_2.lua',
    'StrucidV2': 'https://raw.githubusercontent.com/StevenK-293/AdvanceTech/main/StrucidV2.lua',
    'esp_1': 'https://raw.githubusercontent.com/StevenK-293/Loadstrings/main/esp.lua', // NOT made by AdvanceFalling Team
    'Arrow': 'https://raw.githubusercontent.com/StevenK-293/ESPs/main/Arrows.lua', // NOT made by AdvanceFalling Team
    'REALISTIC_HOOD': 'https://raw.githubusercontent.com/StevenK-293/rawscript/main/raw/scripts/REALISTIC_HOOD.lua',
};

const welcomeMessage = `
***************************************
*                                     *
*   Welcome to the API endpoint        *
*                                     *
***************************************

Usage:
- /api/raw/<script_name>: Fetches the script content.

Available Scripts:
- test1: Retrieves main_1.lua script from GitHub.
- test_2: Retrieves main_2.lua script from the raw/scripts folder/dict.
- StrucidV2: Retrieves StrucidV2.lua script from GitHub.
- esp_1: Retrieves esp.lua script from GitHub.
- Arrow: Retrieves Arrows.lua script from GitHub.
- REALISTIC_HOOD: Retrieves script from Pastebin.
`;

app.use(express.json({ limit: '1mb' }));

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
        const response = await axios.get(fileUrl, { responseType: 'text' });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
