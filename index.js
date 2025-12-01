const express = require('express');
const app = express();
const axios = require('axios');

const THEME = 'graywhite';
const WAKATIME_USERNAME = 'GodMode';
const GITHUB_USERNAME = 'Godmoded';

// title 
const TITLE = 'Hey!! I am Dylan.';
// {age} will be replaced with the actual age
const SUBTITLE = 'I am {age} years old';
// year-month-day
const BIRTHDAY = '2007-12-29';
const DISCORD = 'GodModed';
const TWITTER = 'IGNGod_Mode';

const externalSvgs = [`http://localhost:9000/api?username=${GITHUB_USERNAME}&show_icons=true&theme=${THEME}&hide_border=true`,
    `http://localhost:9000/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=${THEME}&hide_border=true`,
    `http://localhost:9000/api/wakatime?username=${WAKATIME_USERNAME}&theme=${THEME}&layout=compact&langs_count=12&hide_border=true`]

// december 29, 2007
const birthday = new Date(BIRTHDAY);

const fs = require('fs');
let count = parseInt(fs.readFileSync('count.txt', 'utf8')) || 0;

const svg = fs.readFileSync('readme.svg', 'utf8');
app.get('/', async (req, res) => {

    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');

    count++;
    const age = Math.floor((10 * (new Date() - birthday) / 31556952000)) / 10;
    let replacedSvg = svg
        .replace('{count}', count)
        .replace('{title}', TITLE)
        .replace('{subtitle}', SUBTITLE.replace('{age}', age))
        .replace('{discord}', DISCORD)
        .replace('{twitter}', TWITTER);
    
    // let stats = await getReadmeStats();
    // replacedSvg = replacedSvg.replace('{stats}', stats.join('\n'));
    res.write(replacedSvg);
    const stats = await getReadmeStats();

    res.write(stats.join('\n'));
    res.end('</svg>');
});

async function getReadmeStats() {
    let promises = externalSvgs.map(url => axios.get(url));
    let results = await Promise.all(promises);
    results = results.map((result, i) => {
        return "<g transform='translate(100, " + (i * 200 + 250) + ")'>" + result.data + "</g>";
    });

    return results;
}


app.listen(9008, () => {
    console.log('Server is running on port 9008');
});

process.on('SIGINT', () => {
    fs.writeFileSync('count.txt', count.toString());
    process.exit();
});
