import React from 'react'
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, View, Alert } from 'react-native';
import { DocumentDirectoryPath, writeFile } from 'react-native-fs';

function Local() {
  const [fileText, setFileText] = useState('');
  
 
  const saveFile = async () => {
    const path = `${DocumentDirectoryPath}/${Date.now()}.txt`;

    try {
      await writeFile(path, fileText, 'utf8');
      Alert.alert('File saved', null, [{ text: 'OK' }]);
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <>
   <View style={{height:'100%',backgroundColor:'#071526'}}>
      <TextInput
          value={fileText}
          onChangeText={setFileText}
          multiline
          textAlignVertical="top"
        />
     <Button  title='create local file' onPress={saveFile}/>

   </View>
   </>
  )
}

export default Local