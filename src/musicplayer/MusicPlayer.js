import Slider from '@react-native-community/slider';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';

const unknownSong = require('./unknown2.jpg');
const widthConst = Dimensions.get('screen').width;





export const setupsPlayer = async ({stats}) => {
  try {
    await TrackPlayer.setupPlayer();
   await TrackPlayer.getBufferedPosition();
    await TrackPlayer.updateOptions({
     capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        
      ],
    });
    console.log(stats);
    await TrackPlayer.add(stats);
   
  } catch (error) {
    console.log(error);
  }

};


  
 const togglePlayBack = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();

  console.log(currentTrack, playBackState, State.Playing);
  if (currentTrack != null) {
    if (playBackState == State.Paused || playBackState == State.Ready || playBackState == 'idle') {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};
function MusicPlayer({songs, setplayer, songIndex, setSongIndex, width}) {


 
  const [sizeMode, setSizeMode] = useState(true);
  const [repeatMode, setRepeatMode] = useState('off');
  const [like, setLike] = useState(false);
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtwork, setTrackArtwork] = useState();
  const scrollX = useRef(new Animated.Value(0)).current;  
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const dirs = RNFetchBlob.fs.dirs;
  const PATH_TO_READ = dirs.DownloadDir + '/Music/';


  const songSlider = useRef(null);
  const resizeMode = () => {
    setSizeMode(prev => !prev);
    setplayer(prev => !prev);
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title} = track;
      setTrackTitle(title);
    }
  });

  const repeatIcon = () => {
    if (repeatMode == 'off') {
      return 'repeat-off';
    }

    if (repeatMode == 'track') {
      return 'repeat-once';
    }

    if (repeatMode == 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode == 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    }

    if (repeatMode == 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    }

    if (repeatMode == 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    scrollX.addListener(({value}) => {
      const index = Math.round(value / width);

      skipTo(index);
      setSongIndex(index);
    
    });
    return  () => {
      scrollX.removeAllListeners(); 
     
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };
  const handleFavorite = () => {
    setLike(prev => !prev);
  };
 
  const renderSongs = ({item, index}) => {
    return (
      <Animated.View
        style={{width: width, justifyContent: 'center', alignItems: 'center'}}>
        <View style={sizeMode ? styles.hidden : styles.artImgWrapp}>
          <Image source={trackArtwork || unknownSong} style={styles.artImg} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={sizeMode ? styles.containerMin : styles.container}>
      <View style={sizeMode ? styles.mainContainerMin : styles.mainContainer}>
        <TouchableOpacity
          style={sizeMode ? styles.sizemodeMin : styles.sizemode}
          onPress={resizeMode}>
          <Ionicons
            name={sizeMode ? 'chevron-up' : 'chevron-down'}
            size={38}
            color="#1b6675"
          />
        </TouchableOpacity>
        <Animated.FlatList
          ref={songSlider}
          data={songs}
          renderItem={renderSongs}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: scrollX},
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        <View>
          <Text style={sizeMode ? styles.titleMin : styles.title}>
            {trackTitle || 'unknown'}
          </Text>
        </View>

        <View>
          {!sizeMode ? (
            <Slider
              style={styles.progressContainer}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              thumbTintColor="#1b6675"
              minimumTrackTintColor="#1b6675"
              maximumTrackTintColor="#FFF"
              onSlidingComplete={async value => {
                await TrackPlayer.seekTo(value);
              }}
            />
          ) : null}

          <View
            style={sizeMode ? styles.hidden : styles.progressLabelContainer}>
            <Text style={styles.progressLabelTxt}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)
                .split('AM')}
            </Text>
            <Text style={styles.progressLabelTxt}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3)
                .split('AM')}
            </Text>
          </View>
        </View>

        <View
          style={sizeMode ? styles.musicControllsMin : styles.musicControlls}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons
              name="play-skip-back-outline"
              size={sizeMode ? 18 : 35}
              color="#1b6675"
              style={sizeMode ? {marginTop: 12} : {marginTop: 25}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
            <Ionicons
              name={
                playBackState === State.Playing
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
              size={sizeMode ? 40 : 75}
              color="#1b6675"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={sizeMode ? 18 : 35}
              color="#1b6675"
              style={sizeMode ? {marginTop: 12} : {marginTop: 25}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={sizeMode ? styles.hidden : styles.bottomContainer}>
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={handleFavorite}>
            <Ionicons
              name={like ? 'heart' : 'heart-outline'}
              size={30}
              color="#1b6675"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons
              name={`${repeatIcon()}`}
              size={30}
              color={repeatMode !== 'off' ? '#1b6675' : '#1b6675'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070919',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artImgWrapp: {
    width: 300,
    height: 270,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artImg: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },

  progressLabelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelTxt: {
    color: '#FFF',
  },

  musicControlls: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },

  bottomContainer: {
    borderTopColor: '#393E46',
    borderTopWidth: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  containerMin: {
    width: '100%',
    height: 70,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#060f1b',
  },
  sizemode: {
    width: '100%',
  },
  sizemodeMin: {
    width: 30,
    left: 10,
  },
  mainContainerMin: {
    width:widthConst,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 50,
    gap: 25,
  },
  titleMin: {
    width:80,
    fontSize: 8,
    color: 'white',
  },
  artistMin: {
    fontSize: 4,
    color: 'white',
  },
  artImgMin: {
    width: 100,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },

  musicControllsMin: {
  
    flexDirection: 'row',
    width: '35%',
    justifyContent:'space-between'

  },
  hidden: {
    display: 'none',
  },
});
