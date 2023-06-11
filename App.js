import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserLogInSignUpStack from './UserLogInSignUpStack';
//import RouteScreen from './RouteScreen';
import BottomTabNavigation from './BottomTabNavigation';
import { auth } from './config/firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import CustomDrawer from './CustomDrawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { Pressable, Text } from 'react-native';
import styleSheet from './assets/StyleSheet';
import { PaperProvider } from 'react-native-paper';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {   
  const [currentUser, setCurrentuser] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(()=>{
    return onAuthStateChanged(auth, (user) => {
      if(user)
        setCurrentuser(true);
      else
        setCurrentuser(false);
    })
  },[]);

  return (
    <PaperProvider>
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      {/* <Stack.Navigator>
        <Stack.Screen name="RouteScreen" component={RouteScreen}/>
      </Stack.Navigator> */}
      <Drawer.Navigator initialRouteName='BottomTabNavigation'
        screenOptions={ ({ navigation}) =>(
          {
            headerTitle: '',
            drawerStyle: { width: '60%' },
            headerLeft: () => (<Pressable>
              <Icon name='list-outline'
                color={ isDarkMode ? styleSheet.textColor.color : styleSheet.lightModeColor.color }
                size={ 30 }
                style={ { marginHorizontal: '10%' } }
                onPress={()=>navigation.toggleDrawer()}
              />
            </Pressable>)
          })
        }
        drawerContent={ props => <CustomDrawer { ...props } isDarkMode={ isDarkMode } setIsDarkMode={ setIsDarkMode } currentUser={ currentUser} /> }
      >
        <Drawer.Screen name="BottomTabNavigation" component={ BottomTabNavigation } />
        <Drawer.Screen name="SignInSignUp" component={ UserLogInSignUpStack } options={ { headerShown: false } } />
      </Drawer.Navigator>
      </NavigationContainer>
      </PaperProvider>
  );
}

;
