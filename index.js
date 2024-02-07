const express = require('express');
const app = express();

// december 29, 2007
const birthday = new Date('2007-12-29');

const fs = require('fs');
let count = parseInt(fs.readFileSync('count.txt', 'utf8')) || 0;

const svg = fs.readFileSync('readme.svg', 'utf8');

app.get('/', (req, res) => {
    count++;
    let replacedSvg = svg
        .replace('{viw}', count)
        .replace('{age}', Math.floor((10 * (new Date() - birthday) / 31556952000)) / 10);

    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    res.send(replacedSvg);
});


app.listen(9008, () => {
    console.log('Server is running on port 9008');
});

process.on('SIGINT', () => {
    fs.writeFileSync('count.txt', count.toString());
    process.exit();
});