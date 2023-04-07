


import React, {useRef, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {View, Text, Image, FlatList} from 'react-native';
import MusicPlayer from '../musicplayer/MusicPlayer';
import {TouchableOpacity} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {useEffect} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {ScrollView} from 'react-native';
import {RefreshControl} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { setupsPlayer } from '../musicplayer/MusicPlayer';

const {width, height} = Dimensions.get('window');
function Music() {
  const [songs, setSongs] = useState([]);
  const unknownSongImg = require('../musicplayer/unknown2.jpg');
  const [player, setPlayer] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const dirs = RNFetchBlob.fs.dirs;
  const PATH_TO_READ = dirs.DownloadDir + '/Music/';


  const onRefresh = React.useCallback( () => {
    setRefreshing(true);
    RNFetchBlob.fs
      .lstat(PATH_TO_READ)
      .then(stats => {
        stats.map((item, index) => {
          (item.id = index + 1),
            (item.title = item.filename),
            (item.url = `file://${item.path}`),
            (item.artwork = unknownSongImg);
        });

        setRefreshing(false);
        setSongs(stats);
        setupsPlayer({stats});
        
       
      })
      .catch(err => {});

     
    
  }, [refreshing]);
    

const sp =  async() => {if(refreshing){
     await  TrackPlayer.updateMetadataForTrack()
     await TrackPlayer.clearNowPlayingMetadata()
     await TrackPlayer.updateNowPlayingMetadata({title,artwork})

   }}

  useEffect(() => {
    onRefresh();
 sp()
  }, []);

  const skipToindex = async item => {
    const indexNumb = item - 1;
    setSongIndex(indexNumb);
    await TrackPlayer.skip(indexNumb);
  };
  const RenderItem = ({item}) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => skipToindex(item.id)}
        style={styles.musicContainer}>
        <Image
          source={item.artwork || unknownSongImg}
          style={styles.musicImg}
        />
        <View style={styles.musicinfoContainer}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',

              color: '#EEEEEE',
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: '200',

              color: '#EEEEEE',
            }}>
            {item.artist || 'unknown'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{height: '100%', backgroundColor: '#071526'}}>
      <View style={player ? styles.hidden : styles.MusicPlayer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
          <MaterialIcons name="playlist-play" size={50} color="#0767a1" />
          <Text
            style={{
              color: 'white',
              paddingLeft: 12,
              fontSize: 18,
              padding: 12,
            }}>
            Your Playlist
          </Text>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {songs.length == 0  ? (
            <View style={{justifyContent: 'center',
                alignItems: 'center',}}>
            <Text
              style={{
                color: 'white',
                padding: 12,
                fontSize: 12,
                
              }}>
              There are no folders/playlists
            </Text>
            </View>
          ) : (
            songs.map(item => (
              <View key={item.id}>
                <RenderItem item={item} />
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <MusicPlayer
        songs={songs}
        setplayer={setPlayer}
        songIndex={songIndex}
        setSongIndex={setSongIndex}
        width={width}
      />
    </View>
  );
}

export default Music;

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },

  MusicPlayer: {
    height: '92%',
    padding: 8,
    flexDirection: 'column',
    gap: 12,
  },
  musicContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  musicinfoContainer: {},
  musicImg: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
});
