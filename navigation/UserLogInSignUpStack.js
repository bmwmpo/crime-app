import {createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from '../screen/LogInScreen';
import SignUpScreen from '../screen/SignUpScreen';
import { Button, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styleSheet from '../assets/StyleSheet';
import { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';

const Stack =  createNativeStackNavigator();

const UserLogInSignUpStack = ({navigation, route})=>{
    const cancelPress = () => {
        navigation.navigate('BottomTabNavigation');
    }

    const isDarkMode = useTheme().dark;

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
                <Icon name='close-circle-outline' size={ 30 } color={ 
                    isDarkMode ? styleSheet.darkModeColor.color : styleSheet.lightModeColor.color
                }/>
            </Pressable>,
                headerTitle: '',
        })}/>
            <Stack.Screen name="SignUp" component={ SignUpScreen } options={ {headerTitle:''} }/>
    </Stack.Navigator>);
};

export default UserLogInSignUpStack;