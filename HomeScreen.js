
import { StyleSheet, Text, View, Pressable } from 'react-native';

import React from 'react';
import styleSheet from './assets/StyleSheet';


const HomeScreen = ({navigation, route}) => {
        
  const [DrawerOpened,setDrawerOpened] = React.useState(false)

    const gotoMap =()=>{
        navigation.navigate("Map")
    }

    const gotoLogin =()=>{
        navigation.navigate("Login")
    }

    const gotoChart =()=>{
        navigation.navigate("Chart")
    }

  return (
    <View>
            <Pressable
            style={styleSheet.NaviButton}
            onPress={(gotoMap)}>
              <Text style={styleSheet.NaviButton}>Map</Text>
            </Pressable>  

            <Pressable
            style={styleSheet.NaviButton}
            onPress={(gotoLogin)}>
              <Text style={styleSheet.NaviButton}>Login</Text>
            </Pressable>  

            {/* <Pressable
            style={styleSheet.NaviButton}
            onPress={(gotoChart)}>
              <Text style={styleHome.NaviButton}>Chart</Text>
            </Pressable>   */}

    </View>

  );
}

export default HomeScreen