



import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {
  Button,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'rn-fetch-blob';
import {searchRequest} from '../YDconfigs/searchRequest';
import {ActivityIndicator} from 'react-native';


function Search() {
  const [pastedString, setPastedString] = useState('');
  const [downisloading, setDownloading] = useState(false);
  const {searchData, isloading, getList,setIsloading} = searchRequest(pastedString);

  const searchResult = async () => {
    await getList();
  };

  const requestStoragePermission = async ({link, title, artWorkImg}) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Downloader App Storage Permission',
          message:
            'Downloader App needs access to your storage ' +
            'so you can download files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadFile({link, title, artWorkImg});
      } else {
        console.log('storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadFile = async ({link, title, artWorkImg}) => {
    setDownloading(true)
    const {config, fs} = RNFetchBlob;
    const fileDir = fs.dirs.DownloadDir + '/Music/';
    RNFetchBlob.fs.mkdir(fileDir).catch(err => {
      console.log();
    });

    const url = 'https://zmanager-serv.herokuapp.com/download?url=';

    const response = await fetch(url + link);
    const urldata = await response.json();
    setDownloading(false)
    config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,

        path: fileDir + title +'.mp3',
        description: 'file download',
      }, 
    })
      .fetch('GET', urldata.item, {})
      .then(res => {
        // the temp file path
        
        console.log('The file saved to ', res.path());
            
        alert(`file downloaded successfully ${title}`);
      }).catch(err => {console.log(err)});
  };

  const renderItem = ({item}) => {
    const {artwork, link, title} = item;
    const artWorkImg = artwork.high.url;

    return (
      <View key={item.id} style={styles.infoSourceContainer}>
        <Image source={{uri: artwork.high.url}} style={styles.imgSource} />

        <View style={{gap: 12, width: '60%'}}>
          <Text style={styles.titleTxt}>{item.title}</Text>
          <Text
            style={{
              textAlign: 'center',
              width: 20,
              color: 'white',
              fontSize: 6,
              backgroundColor: 'black',
              padding: 2,
              borderRadius: 12,
            }}>
            mp3
          </Text>
        </View>

        <TouchableOpacity
          key={item.id}
          onPress={() => {
            if (link !== null) {
              requestStoragePermission({link, title, artWorkImg});
            } else {
              alert('Please select another way');
            }
          }}>
          <MaterialCommunityIcons
            name="download-circle"
            color={ "#0767a1"}
            size={30}
          />
        </TouchableOpacity>
      
      </View>
    );
  };
  return (
    <View style={styles.searchView}>
      <View style={styles.searchViewHeader}>
        <FontAwesome name="youtube-square" size={35} color="#d62f2f" />
        <TextInput
          placeholder="Youtube Search"
          placeholderTextColor="white"
          style={styles.searchInput}
          onChangeText={txt => setPastedString(txt)}
        />

        <TouchableOpacity
          onPress={searchResult}
          color="#071526"
          style={styles.searchButton}>
          <Text style={{color: 'white'}}>Search</Text>
        </TouchableOpacity>
      </View>
      {isloading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {searchData.length == 0 ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: 'white', padding: 12, fontSize: 12}}>
                There are no results found
              </Text>
            </View>
          ) : (<>
            {downisloading ? <ActivityIndicator/> : ''}
            <FlatList
              data={searchData}
              style={styles.flatlistContainer}
              keyExtractor={item => item.id}
              renderItem={item => renderItem(item)}
            /> 
            
            </>
          )}
         
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  searchView: {
    height: '100%',
    backgroundColor: '#071526',
  },
  searchInput: {
    width: '65%',
    height: 40,
    fontSize: 8,
    color: 'white',
    borderWidth: 0.7,
    borderColor: 'white',
    borderRadius: 8,
    paddingLeft: 10,
  },
  searchText: {
    color: 'white',
  },
  searchViewHeader: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  searchButton: {
    backgroundColor: '#071526',
    borderRadius: 8,
    fontSize: 12,
  },
  searchDataContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  flatlistContainer: {
    padding: 8,
  },
  infoSourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
    padding: 8,
  },
  imgSource: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  titleTxt: {
    fontSize: 10,
    color: 'white',
  },
});

export default Search;
