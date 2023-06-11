import { DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import { auth } from './config/firebase_config';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert, Button, Text, View} from 'react-native';
import { Drawer,Switch } from 'react-native-paper'
import styleSheet from './assets/StyleSheet';

//sign out function
const handleSignOut = async(props) => {
    try{
        await signOut(auth);
        props.navigation.navigate('BottomTabNavigation',{screen: 'Map'});
    }
    catch(err){
        Alert.alert(err.message);
    }
}

//sign out alert dialog
const signOutAlert = (props) =>{
    Alert.alert('Log Out', 'Are you sure you want to log out',
    [
        {
            text:'Log Out',
            onPress: () => handleSignOut(props),
            style:'destructive'
        },
        {
            text:'Cancel',
        },

    ])
}

//custom drawer content
const customDrawer = (props, currentUser, isDarkMode, setIsDarkMode) =>{
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView>
            {/* <DrawerItemList {...props} /> */}
            <View>
            {   !currentUser &&
                (<Drawer.Section>
                    <Text style={{textAlign:'center'}}>Stay informed about neighborhood crime by joining the Toronto Crime Tracker</Text>
                    <Drawer.Item 
                    label='SignIn/SignUp' onPress={()=>props.navigation.navigate('SignInSignUp')} 
                    icon={ ({focused, color, size})=><Icon name='person-circle-outline' color={color} size={size}/>}/>
                </Drawer.Section>)
            } 
            </View>
            {   
                currentUser && (
                    <View>
                        <Drawer.Section style={{flex:9}}>
                            <View style={styleSheet.drawerContainer}>
                            <Text>Perference</Text>
                            <Switch 
                            value={isDarkMode} 
                            onValueChange={()=>setIsDarkMode(pre => !pre)}/>
                            </View>
                        </Drawer.Section>
                        <Drawer.Section>
                        <Drawer.Item label='Log out' onPress={()=>signOutAlert(props)}
                            icon={ ({focused, color, size})=>
                                <Icon name='log-out-outline' color={ isDarkMode ? styleSheet.textColor.color : color} size={size}/>}/>
                        </Drawer.Section>
                    </View>)
            } 
        </DrawerContentScrollView>
        </View>
    );
}

export default customDrawer;