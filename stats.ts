import renderWakatimeCard from "./github-readme-stats/src/cards/wakatime";
import fetchWakatimeStats from "./github-readme-stats/src/fetchers/wakatime";
import renderStatsCard from "./github-readme-stats/src/cards/stats";
import fetchStats from "./github-readme-stats/src/fetchers/stats";

const THEME = 'graywhite';
const WAKATIME_USERNAME = 'GodMode';
const GITHUB_USERNAME = 'Godmoded';

export const CACHE: {
    data: {
        wakaTime: string | null;
        githubStats: string | null;
    };
    timestamp: number;
    duration: number;
} = {
    data: {
        wakaTime: null,
        githubStats: null,
    },
    timestamp: 0,
    duration: 24 * 60 * 60 * 1000, // 1 day
};

export default async function getStats(): Promise<string> {
    const now = Date.now();
    if (
        CACHE.data.wakaTime &&
        CACHE.data.githubStats &&
        now - CACHE.timestamp < CACHE.duration
    ) {
        return [CACHE.data.wakaTime, CACHE.data.githubStats].join('\n');
    }

    const stats = await fetchWakatimeStats({
        username: WAKATIME_USERNAME,
        api_domain: 'wakatime.com',
    });

    const wakaTimeCard = renderWakatimeCard(stats, {
        layout: 'compact',
        langs_count: 10,
        hide_border: true,
        hide_progress: true,
        /* @ts-ignore */ 
        theme: THEME
    }).replace("<svg", `<svg x="100px" y="250px"`);

    const githubStats = await fetchStats(GITHUB_USERNAME, true, [], true, false, false, undefined);
    const githubStatsCard = renderStatsCard(githubStats, {
        show_icons: true,
        hide_border: true,
        /* @ts-ignore */
        theme: THEME
    }).replace("<svg", `<svg x="100px" y="450px"`);

    CACHE.data.wakaTime = wakaTimeCard;
    CACHE.data.githubStats = githubStatsCard;
    CACHE.timestamp = now;

    return [wakaTimeCard, githubStatsCard].join('\n');
}