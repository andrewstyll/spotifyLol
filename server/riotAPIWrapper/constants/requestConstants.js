// This will be a list of all constants and their mappings required by the riot games API

// to use, add an API key.js file containing an API key to /spotifyLol/server/riotAPIWrapper and export the key. It will be added here
const KEY = process.env.PROD_KEY || process.env.DEV_KEY;
//= require('./key');

const API_POSTFIX = 'api_key='+ KEY;

const HTTPS_HEAD = 'https://';
const HOST = '.api.riotgames.com';

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

const API_CALL = {
    SUMMONER_BY_NAME: '/lol/summoner/v3/summoners/by-name/', // {summonerName}
    
    // also reused for recent matches. needs a recent appended for recent matched after accountID
    MATCH_BY_ACC_ID: '/lol/match/v3/matchlists/by-account/', //{accountID} /recent
    MATCH_BY_MATCH_ID: '/lol/match/v3/matches/', //{match-ID}
    
    // STATIC CALLS
    PROFILE_ICONS: '/lol/static-data/v3/profile-icons',
    CHAMP_LIST: '/lol/static-data/v3/champions'
};

module.exports = {
    HTTPS_HEAD,
    API_POSTFIX,
    HOST,
    REGION,
    API_CALL
};
