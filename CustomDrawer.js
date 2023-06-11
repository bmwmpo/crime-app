import { DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import { auth } from './config/firebase_config';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert, Button, Text, View, SafeAreaView } from 'react-native';
import { Drawer,Paragraph,Switch } from 'react-native-paper'
import styleSheet from './assets/StyleSheet';

//custom drawer content
const CustomDrawer = ({ navigation, currentUser, isDarkMode, setIsDarkMode }) =>
{
    //sign out function
const handleSignOut = async() => {
    try{
        await signOut(auth);
        navigation.navigate('BottomTabNavigation',{screen: 'Map'});
    }
    catch(err){
        Alert.alert(err.message);
    }
}

//sign out alert dialog
const signOutAlert = () =>{
    Alert.alert('Log Out', 'Are you sure you want to log out',
        [
            {
                text: 'Log Out',
                onPress: () => handleSignOut(),
                style: 'destructive'
            },
            {
                text: 'Cancel',
            },

        ]);
}
    
    return(
        <DrawerContentScrollView contentContainerStyle={ styleSheet.flex_1 } >
            { !currentUser ?
                //log in section
                (<Drawer.Section>
                    <Paragraph
                        style={ [styleSheet.drawerTextStyle, isDarkMode && styleSheet.textColor]}>
                        Stay informed about neighborhood crime by joining the Toronto Crime Tracker
                    </Paragraph>
                    <Drawer.Item label={ <Text style={ isDarkMode && styleSheet.textColor }>Log in / Sign up</Text> } onPress={ () => navigation.navigate('SignInSignUp') } icon={ ({ focused, color, size }) => <Icon name='person-circle-outline' color={ isDarkMode ? styleSheet.textColor.color : styleSheet.lightModeColor.color} size={ size } /> }
                    rippleColor={styleSheet.highLightTextColor.color}/>
                </Drawer.Section>)
                :
                (<View style={ {flex:1} }>
                    <Drawer.Section style={ styleSheet.flex_9 }>
                        {/* Dark mode section */}
                        <Text style={ [styleSheet.drawerTextStyle, isDarkMode && styleSheet.textColor] }>Perference</Text>
                        <View style={ styleSheet.drawerContainer }>
                            <Icon name='moon-outline' size={ 20 } color={ isDarkMode ? styleSheet.textColor.color : styleSheet.lightModeColor.color} />
                            <Text style={ isDarkMode && styleSheet.textColor }>Dark mode</Text>
                            <Switch value={isDarkMode} onValueChange={()=>setIsDarkMode(pre => !pre)}/>
                        </View>
                    </Drawer.Section>
                    {/* log out section */}
                    <Drawer.Section style={ styleSheet.flex_1 }>
                        <Drawer.Item label={ <Text style={isDarkMode && styleSheet.textColor }>Log out</Text>} onPress={ signOutAlert }
                            icon={ ({ focused, color, size }) =>
                                <Icon name='log-out-outline' color={ styleSheet.logoutColor.color } size={ size } /> }
                            rippleColor={styleSheet.highLightTextColor.color}
                        />
                        </Drawer.Section>
                    </View>)
            } 
        </DrawerContentScrollView>
    );
}

export default CustomDrawer;