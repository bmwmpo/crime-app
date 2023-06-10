import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AddPostScreen from './screen/AddPostScreen';
import MapScreen from './screen/MapScreen';
import UserLogInSignUpStack from './UserLogInSignUpStack';
//import RouteScreen from './RouteScreen';
import BottomTabNavigation from './BottomTabNavigation';
import { auth } from './config/firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import customDrawer from './CustomDrawer';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
        
  //const [DrawerOpened,setDrawerOpened] = useState(false)
  const [currentUser, setCurrentuser] = useState(false);

  useEffect(()=>{
    return onAuthStateChanged(auth, (user) => {
      if(user)
        setCurrentuser(true);
      else
        setCurrentuser(false);
    })
  },[]);

  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
        <Stack.Screen name="RouteScreen" component={RouteScreen}/>
      </Stack.Navigator> */}
      <Drawer.Navigator 
      initialRouteName='BottomTabNavigation' 
      screenOptions={
        {
          headerTitle:'', 
          drawerStyle:{width:'60%'}
        }
      }
      drawerContent={(props) => customDrawer(props, currentUser)}
      >
        <Drawer.Screen name="BottomTabNavigation" 
        component={BottomTabNavigation} 
        options={
          {
            drawerItemStyle:{display:'none'}
          }
        }/>
        {!currentUser && 
          <Drawer.Screen name="SignInSignUp" component={UserLogInSignUpStack}
          options={
            {
              headerShown:false, 
              drawerIcon:({focused, size, color}) => (<Icon name='person-circle-outline' size={size} color={color}/>)
            }
          }/>}
    </Drawer.Navigator>
      {/* <Drawer.Navigator>
        <Drawer.Screen name="Posting" component={AddPostScreen}/>
        <Drawer.Screen name="LogInSignUp" component={UserLogInSignUpStack}/>
        <Drawer.Screen name="Map" component={MapScreen}/>
      </Drawer.Navigator> */}
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    //<AddPostScreen/>
  );
}

;
