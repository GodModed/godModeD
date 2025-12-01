import Counter from "./counter";
import getStats from "./stats";

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

const birthDate = new Date(BIRTHDAY);
const counter = new Counter();
const svgText = await Bun.file("readme.svg").text();

const calculateAge = (birthDate: Date): number => Math.floor((100 * (Date.now() - birthDate.getTime()) / 31556952000)) / 100;

const server = Bun.serve({
    port: 9008,
    routes: {
        "/": async (req) => {
            counter.increment();
            const age = calculateAge(birthDate);
            

            let text = svgText.replace('{count}', counter.getCount().toString())
                .replace('{title}', TITLE)
                .replace('{subtitle}', SUBTITLE.replace('{age}', age.toString()))
                .replace('{discord}', DISCORD)
                .replace('{twitter}', TWITTER);

            text += await getStats();
            text += `</svg>`;

            const res = new Response(text);
            res.headers.set('Content-Type', 'image/svg+xml; charset=utf-8');
            res.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
            return res;
        }
    }
})

console.log("Server running at " + server.url);