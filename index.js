const express = require('express');
const app = express();
const axios = require('axios');

const THEME = 'graywhite';

const externalSvgs = [`https://github-readme-stats.vercel.app/api?username=GodModed&show_icons=true&theme=${THEME}&hide_border=true`,
    `https://github-readme-stats.vercel.app/api/top-langs/?username=Godmoded&layout=compact&theme=${THEME}&hide_border=true`,
    `https://github-readme-stats.vercel.app/api/wakatime?username=GodMode&theme=${THEME}&layout=compact&langs_count=12&hide_border=true`]

// december 29, 2007
const birthday = new Date('2007-12-29');

const fs = require('fs');
let count = parseInt(fs.readFileSync('count.txt', 'utf8')) || 0;

const svg = fs.readFileSync('readme.svg', 'utf8');

app.get('/', async (req, res) => {
    count++;
    let replacedSvg = svg
        .replace('{viw}', count)
        .replace('{age}', Math.floor((10 * (new Date() - birthday) / 31556952000)) / 10);
    
    let stats = await getReadmeStats();
    replacedSvg = replacedSvg.replace('{stats}', stats.join('\n'));
    

    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    res.send(replacedSvg);
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