import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {RefreshControl, ScrollView, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import {Image} from 'react-native';
import {View, Text, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const unkwown2 = require('../musicplayer/unknown2.jpg');

function Download() {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const dirs = RNFetchBlob.fs.dirs;
  const PATH_TO_READ = dirs.DownloadDir + '/Music/';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    RNFetchBlob.fs
      .lstat(PATH_TO_READ)
      .then(stats => {
        stats.map((item, index) => {
          item.id = index + 1;
        });
        setData(stats);
        setRefreshing(false);
      })
      .catch(err => {});
  }, [refreshing]);

  useEffect(() => {
    onRefresh();
  }, []);

  const handleDelete = ({path}) => {
    RNFetchBlob.fs
      .unlink(path)
      .then(() => {
        alert('file deleted successfully');
      })
      .catch(err => {});
  };

  const RenderItem = ({item}) => {
    const {path} = item;

    return (
      <View style={styles.downloadShowInfo}>
        <Image source={unkwown2} style={styles.downloadShowImg} />
        <View style={{gap: 12, width: 200}}>
          <Text style={{color: 'white'}}>{item.filename}</Text>
          <Text style={{color: 'white', fontSize: 7}}>size:{item.size}MB</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => handleDelete({path})}>
            <MaterialCommunityIcons
              name="delete-circle"
              color="red"
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{height: '100%', backgroundColor: '#071526'}}>
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          alignItems: 'center',
          padding: 12,
        }}>
        <FontAwesome5 name="file-download" size={35} color="#0767a1" />
        <Text style={{color: 'white', padding: 12, fontSize: 18}}>
          Downloaded Files
        </Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.downloadShowContainer}>
          {data.length == 0 ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', padding: 12, fontSize: 12}}>
                There are no folders/playlists
              </Text>
            </View>
          ) : (
            data.map(item => (
              <View key={item.id}>
                <RenderItem item={item} />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default Download;

const styles = StyleSheet.create({
  downloadShowContainer: {
    padding: 8,
  },
  downloadShowInfo: {
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downloadShowImg: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
});
