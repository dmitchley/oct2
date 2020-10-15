
const api = `https://api.the-odds-api.com/v3/odds/?sport=soccer_epl&region=uk&dateFormat=iso&apiKey=891ddb8da07686592d4420b157334ffc`;
const fetch = require('node-fetch');
const moment = require('moment-timezone');
console.log('soccer.js start');

let matches;
let matchesById;

async function fetchMatches() {
    if (!matches) {
        console.log('fetching matches...');
        
        const response = await fetch(api)
        const data = await response.json();

        matches = data.data;

        // create a unique matchId for each match
        matches.forEach((match) => {
            const {teams, commence_time} = match;
            match.matchId = `${commence_time}_${teams.join(',')}`
            match.time_london = moment(commence_time).tz('Europe/London').format('LLL');
        });
        
        matchesById = Object.fromEntries(matches.map(match => [match.matchId, match]));
    }
    return matches;
}

async function getMatchById(matchId) {
    await fetchMatches();
    return matchesById[matchId] || null;
}

function getMatchOddsNow(match, team) {
    const { matchId, teams } = match;
    const site = match.sites[0];
    const odds = site.odds.h2h;
    const teamIndex = !team ? 1 : teams.indexOf(team);
    if (teamIndex < 0) {
        throw new Error(`invalid team "${team}" does not play in match ${matchId}`);
    }

    return odds[teamIndex];
}


async function getMatchOdds(matchId, team) {
    const match = await getMatchById(matchId);
    return getMatchOddsNow(match, team);
}

module.exports = {
    fetchMatches,
    getMatchById,
    getMatchOdds,
    getMatchOddsNow
};
