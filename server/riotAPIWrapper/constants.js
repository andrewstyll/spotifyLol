// This will be a list of all constants and their mappings required by the riot games API

// to use, add an API key.js file containing an API key to /spotifyLol/server/riotAPIWrapper and export the key. It will be added here
const KEY = require('./key');

const API_POSTFIX = '?api_key='+ KEY;

const HOST_BASE = '.api.riotgames.com';

// I might want to extend this to other regions, but currently only really want for this to work in NA
const REGION = {
    BR: 'BR1',
    EUNE: 'EUN1',
    EUW: 'EUW1',
    JP: 'JP1',
    KR: 'KR',
    LATIN_AMERICA_N: 'LA1',
    LATIN_AMERICA_S: 'LA2',
    NA:'NA1',
    OCEANIA: 'OC1',
    TURKEY: 'TR1',
    RUSSIA: 'RU',
};

const API_CALL_BASE = {
    SUMMONER_BY_NAME: '/lol/summoner/v3/summoners/by-name/',
    MATCH_BY_ACC_ID: '/lol/match/v3/matchlists/by-account/', // also reused for recent matches
    MATCH_BY_MATCH_ID: '/lol/match/v3/matches/',
    
    // STATIC CALLS
    PROFILE_ICONS: '/lol/static-data/v3/profile-icons',
    CHAMP_LIST: '/lol/static-data/v3/champions'
};

module.exports = {
    API_POSTFIX
    HOST_BASE,
    REGION,
    API_CALL_BASE,
};
