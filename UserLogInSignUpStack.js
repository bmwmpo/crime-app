import {createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from './LogInScreen';
import SignUpScreen from './SignUpScreen';
import { Button, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack =  createNativeStackNavigator();

const UserLogInSignUpStack = ({navigation})=>{
    return (
    <Stack.Navigator initialRouteName='LogIn'
    // screenOptions={
    //     {
    //         headerBackImage: ()=><Icon name='eye-outline' size={20}/> 
    //     }
    // }
    >
        <Stack.Screen name="LogIn" component={LogInScreen}
        options={({route})=> ({
            headerRight: () => (<Button title='Sign Up' onPress={()=>{navigation.navigate('SignUp')}}/>)
        })
        }/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
    </Stack.Navigator>);
};

export default UserLogInSignUpStack;