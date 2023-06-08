import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import LogInScreen from './LogInScreen';
// import SignUpScreen from './SignUpScreen';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AddPostScreen from './AddPostScreen';
import MapScreen from './MapScreen';
import UserLogInSignUpStack from './UserLogInSignUpStack';

const Drawer = createDrawerNavigator();

export default function App() {
        
  //const [DrawerOpened,setDrawerOpened] = useState(false)

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Posting" component={AddPostScreen}/>
        <Drawer.Screen name="LogInSignUp" component={UserLogInSignUpStack}/>
        <Drawer.Screen name="Map" component={MapScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    //<AddPostScreen/>
  );
}

;
