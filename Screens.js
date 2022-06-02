import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, TouchableHighlight, Button, StyleSheet, Text, View, Linking, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest, refreshAsync } from 'expo-auth-session';
import { spotifyApi, auth, clientId } from './keys'
import "./spotpodlogo.png"
import styles from './Styles.js'
import * as FileSystem from 'expo-file-system';


WebBrowser.maybeCompleteAuthSession();


const Artists = ({ navigation, route }) => {

  const { artists } = route.params
  const artistsList = artists
  var elementArray = []

  elementArray = artistsList.map(artist => (
      <View style={styles.albumRow} key={artist.id}>
          <Image style={styles.artistImage}
                 source={{ uri: artist.images[1].url}}
          />
          <TouchableHighlight
            style={styles.box2}
            underlayColor="#80dfff"
            onPress={() => {
            navigation.push('Albums', {paramA: artistsList.indexOf(artist)})
            }}>
            <View style={styles.albumText}>
              <Text style={styles.text}>
                {artist.name}
              </Text>
            </View>
          </TouchableHighlight>
      </View>
          )
        )

  return (
    <ScrollView style={styles.container}>
    {elementArray}
    </ScrollView>
        )
}

const Albums = ({ navigation, route }) => {

  const { artists } = route.params
  const artistsList = artists
  const selectedArtist = route.params.paramA
  const array = artistsList[selectedArtist].albums
  const artistsImage = artistsList[selectedArtist].images[1].url

  var singleRow = (
    <View style={styles.albumRow}>
    <TouchableHighlight
      style={styles.box2}
      underlayColor="#80dfff"
      onPress={() => {
      navigation.push('Tracks', {paramA: selectedArtist,   paramA2: 0})
      }}>
      <View style={styles.albumText}>
      <Text style={styles.text}>
        {array[0].name}
      </Text>
      </ View>
    </TouchableHighlight >
    </View>
  )

  var elementArray = []

  elementArray = array.filter((el) => {
    return el.type === "album"
  }).map(album => (
    <View style={styles.albumRow} key={album.id}>
      <Image style={styles.albumImage}
             source={{ uri: album.images}}
      />
      <TouchableHighlight
        style={styles.box2}
        underlayColor="#80dfff"
        onPress={() => {
        navigation.push('Tracks', {paramA: selectedArtist,   paramA2: array.indexOf(album)})
        }}>
        <View style={styles.albumText}>
          <Text style={styles.text}>
            {album.name}
          </Text>
        </ View>
      </TouchableHighlight >
    </View>
  ))

  return (
    <View style={styles.container}>
    <Text style={styles.text2}>
    {artistsList[selectedArtist].name}
    </Text>
    <View style={styles.image}>
    <Image
        style={styles.artistsImage}
        source={{uri : artistsImage}}
      />
    </View >
    <ScrollView >
        {singleRow}
        {elementArray}
    </ScrollView>
    </ View>
        )
}

const Tracks = ({ navigation, route }) => {

    const handlePress = (url) => useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

    const { artists } = route.params
    const artistsList = artists
    const selectedArtist = route.params.paramA
    const selectedAlbum = route.params.paramA2

    const array = artistsList[selectedArtist].albums[selectedAlbum].tracks
    var elementArray = []

    elementArray = array.map(track => (
                            <TouchableHighlight
                              key={track.id}
                              style={styles.box}
                              underlayColor="#80dfff"
                              onPress={handlePress(track.url)}>
                                  <Text style={styles.text}>
                                    {track.name}
                                  </Text>
                            </TouchableHighlight>
                          )
                   )

  return (
    <ScrollView style={styles.container}>
      {elementArray}
    </ScrollView>
        )

}

const SignIn = ({ navigation, route }) => {
  return (
    <>
    <View style={styles.image}>
    <Image
    source={ require('./spotpodlogo.png')}
    style={styles.logo}
    />
    </View>
    <Button
      title={"Go to library"}
      onPress={() => {
         navigation.push('Artists')
        }}
    />
    <Button
      title={"Configurations"}
      onPress={() => {
         navigation.push('Configurations')
        }}
    />
    </>
  )
}

const Configurations = ({ navigation, route }) => {

 const [loading, setLoading] = useState('Add your library')
 const [playlistLoading, setPlaylistLoading] = useState('Add your playlists')

 const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: clientId,
      scopes: ['user-follow-read', 'user-follow-modify'],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: "exp"
      }),
    },
     {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    }
  )

  useEffect(() => {

    if (response?.type === 'success') {

      async function login() {
         const { access_token } = response.params;

         spotifyApi.setAccessToken(access_token);


// Add artists

             const getArtists = await spotifyApi.getFollowedArtists({limit: 50});

             setLoading("loading...")

             const unsortedItems = getArtists.body.artists.items;

             var artistsItems = unsortedItems.sort(function(a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

             if(getArtists.body.artists.cursors.after !== null) {
               const nextArtists = await spotifyApi.getFollowedArtists({limit: 50, after: getArtists.body.artists.cursors.after})
               artistsItems = artistsItems.concat(nextArtists.body.artists.items)
             }

             var artists = { artists: [] };

             for(let a=0; a< artistsItems.length; a++) {
               let item = {};
               item.url = artistsItems[a].external_urls.spotify
               item.id =  artistsItems[a].id
               item.name = artistsItems[a].name
               item.images = artistsItems[a].images
               item.albums = []
               item.visible = true

               artists.artists.push(item)
             }

// Add Albums

             for(let i=0; i < artistsItems.length; i++) {

              const albums = await spotifyApi.getArtistAlbums(artistsItems[i].id, {limit: 50, include_groups:'album'});
              var albumItems = albums.body.items;

              if(albumItems.total > 50){
                const moreAlbums = await spotifyApi.getArtistAlbums(artistsItems[i].id, {limit: 50, offset: 50, include_groups:'album'});
                const moreAlbumsItems = moreAlbums.body.items;
                albumItems = albumItems.concat(moreAlbumsItems)
              }

              for(let b=0; b < albumItems.length ; b++) {
                 var album = {}
                 album.id = albumItems[b].id
                 album.name = albumItems[b].name
                 album.type = albumItems[b].type
                 album.images = albumItems[b].images[2].url
                 album.tracks = []
                 album.visible = true

                 artists.artists[i].albums.push(album)
              }

               for(let y=0; y < albumItems.length; y++) {
                 const albumTracks = await spotifyApi.getAlbumTracks(artists.artists[i].albums[y].id);
                 const albumTracksItems = albumTracks.body.items

                 for(let c=0; c < albumTracksItems.length; c++) {
                 var tracks = {}
                 tracks.id = albumTracksItems[c].id
                 tracks.name = albumTracksItems[c].name
                 tracks.url = albumTracksItems[c].external_urls.spotify

                 artists.artists[i].albums[y].tracks.push(tracks)
               }
             }

// Add Singles

             const single = await spotifyApi.getArtistAlbums(artistsItems[i].id, {limit: 50, include_groups:'single'});
             var singlesItems = single.body.items;

             var singles = {
                tracks:[],
                name: "Artist singles"
              }

             for(let d=0; d < singlesItems.length; d++) {
                var track = {}
                track.id = singlesItems[d].id
                track.name = singlesItems[d].name
                track.album_type = singlesItems[d].album_type
                track.url = singlesItems[d].external_urls.spotify

                singles.tracks.push(track)
             }

             artists.artists[i].albums.unshift(singles)
           }

            const aa = JSON.stringify(artists)
           FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'libra.json', aa)
           setLoading("Library added");
        }

       login();
     }
  }, [response]);

  return (
    <View>
    <Button
      title={loading}
      onPress={() => {
        promptAsync();
        }}
    />
    </ View>
  );
}

export { Artists, Albums, Tracks, SignIn, Configurations }
