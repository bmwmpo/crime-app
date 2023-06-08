import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
<<<<<<< Updated upstream
// import LogInScreen from './LogInScreen';
// import SignUpScreen from './SignUpScreen';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AddPostScreen from './AddPostScreen';
import UserLogInSignUpStack from './UserLogInSignUpStack';

const Drawer = createDrawerNavigator();
=======
import React from 'react';

import LogInScreen from './LogInScreen';
import MapScreen from './MapScreen';
import HomeScreen from './HomeScreen';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Drawer, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Stack = createNativeStackNavigator();
>>>>>>> Stashed changes

export default function App() {
        
  const [DrawerOpened,setDrawerOpened] = React.useState(false)

  return (
<<<<<<< Updated upstream
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Posting" component={AddPostScreen}/>
        <Drawer.Screen name="LogInSignUp" component={UserLogInSignUpStack}/>
      </Drawer.Navigator>
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    //<AddPostScreen/>
=======

      <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'
      screenOptions={{headerStyle:{backgroundColor:'#ded9d9'},
      headerTitleAlign:'center'}}>
      
      <Stack.Screen name='Home' component={HomeScreen}/>
      <Stack.Screen name='Map' component={MapScreen}/>
      <Stack.Screen name='Login' component={LogInScreen}/>
      {/* <Stack.Screen name='Chart' component={DetailScreen}/> */}

      </Stack.Navigator>
    </NavigationContainer>


    // <div>
    //   <>
    //   <IconButton
    //   size='large'
    //   edge='start'
    //   color='default'
    //   on-Click={()=> setDrawerOpened(true)}>
    //     <MenuIcon/>
    //   </IconButton>
    //   <Drawer
    //   anchor='left'
    //   open={DrawerOpened}
    //   onClose={()=>setDrawerOpened(false)}
    //   >
    //     <Box p={2} width='250px' textAlign='center' role='presentation'>
    //       <Typography>Menu</Typography>
    //     </Box>
    //   </Drawer>

    // </>
    // </div>


        // {/* <LogInScreen/> */}



>>>>>>> Stashed changes
  );
}

;
