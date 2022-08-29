import Constants from 'expo-constants';
const SpotifyWebApi = require('spotify-web-api-node');


const spotifyApi = new SpotifyWebApi({
  clientId: Constants.manifest.extra.clientId ,
  clientSecret: Constants.manifest.extra.clientSecret ,
  redirectUri: Constants.manifest.extra.redirectUri
});

const clientId = clientId: Constants.manifest.extra.clientId;


export {  spotifyApi,  clientId }
