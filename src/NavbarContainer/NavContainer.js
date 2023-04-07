import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Download from '../pages/Download';
import Search from '../pages/Search';

import Local from '../pages/Local';
import Music from '../pages/Music';




const Tab = createBottomTabNavigator();
 

export default function NavContainer() {

 

  return (
    <NavigationContainer>
        <Tab.Navigator  
        
        screenOptions={ ({route}) => ({
          tabBarActiveTintColor: '#7478b9',
          tabBarInactiveTintColor: '#074875',
          
          tabBarActiveBackgroundColor: '#020811',
          tabBarInactiveBackgroundColor: '#070919',
          tabBarLabelStyle:{
               fontSize:13
          },
          tabBarIconStyle:{
              
          },
          tabBarStyle: {
          backgroundColor: '#3E48A0',
           borderTopWidth: 0,
           height:55
           
        },
            tabBarIcon: ({focused,color,size}) => {
                 let iconName;
                 let rn = route.name;
 
  
                  if(rn === "Search") {
                    iconName = focused ? 'search': 'search-outline'
                  }else if(rn === "Downloads"){
                    iconName = focused ? 'download': 'download-outline'
                  }else if(rn === 'Local File'){
                    iconName = focused ? 'file-tray' : 'file-tray-outline'
                    }else if(rn === 'Music'){
                    iconName = focused ? 'musical-notes' : 'musical-notes-outline'
                    }else{
                    iconName = 'settings';
                  }
                    return <Ionicons  name={iconName} size={25} color={color} />
            }, 
            
        })}
        
         >   
                
            <Tab.Screen options={{headerShown: false}} name={"Music"} component={Music}/>
            <Tab.Screen options={{headerShown: false}} name={"Search"} component={Search}/>
            <Tab.Screen options={{headerShown: false}} name={"Downloads"} component={Download}/>
        </Tab.Navigator>


    </NavigationContainer>
  )
}