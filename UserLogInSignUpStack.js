import {createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from './LogInScreen';
import SignUpScreen from './SignUpScreen';
import { Button, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack =  createNativeStackNavigator();

const UserLogInSignUpStack = ({navigation})=>{

    const cancelPress = () => {
        navigation.navigate('BottomTabNavigation');
    }
    return (
    <Stack.Navigator initialRouteName='LogIn'
    screenOptions={
        {
            //headerShown:false
        }
    }
    >
        <Stack.Screen name="LogIn" component={LogInScreen} options={({route}) => ({
            headerLeft:() => <Pressable onPress={cancelPress}>
                <Icon name='close-circle-outline' size={30}/>
            </Pressable>,
            headerTitle:''
        })}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
    </Stack.Navigator>);
};

export default UserLogInSignUpStack;