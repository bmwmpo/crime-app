import { DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import { auth } from './config/firebase_config';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert, Text, View} from 'react-native';

const handleSignOut = async(props) => {
    try{
        await signOut(auth);
        props.navigation.navigate('BottomTabNavigation',{screen: 'Map'});
    }
    catch(err){
        Alert.alert(err.message);
    }
}

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

const customDrawer = (props, currentUser) =>{
    return(
        <DrawerContentScrollView style={{flex: 1}}>
            <DrawerItemList {...props} />
            {   currentUser &&
                <DrawerItem label='Log out' onPress={()=>signOutAlert(props)} 
                icon={ ({focused, color, size})=><Icon name='log-out-outline' color={color} size={size}/>}/>
            } 
        </DrawerContentScrollView>
    );
}

export default customDrawer;