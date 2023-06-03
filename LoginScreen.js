import { useState } from 'react';
import { auth } from './config/firebase_config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons'
import { Alert, Text, TextInput, TouchableOpacity,View, StyleSheet, Pressable } from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    //shows or hides the password
    const onShowPassword = () =>{
        setShowPassword(!showPassword);
        console.log(showPassword);
    }

    //login function
    const handleLogin = async () => {
        try {

            const userCredentials = await signInWithEmailAndPassword (auth, email, password);
            Alert.alert('OK', '');
        }
        catch(err){
            Alert.alert('Error', 'Invalid email address or password');
            console.log(err);
        }
    }

    //Check if either the email address or password is a empty string
    const isEmailAddressPasswordEmpty = () =>{
        if(email.trim() === '' || password.trim() === '' ){        
            return true;
        }
        else {
            return false;
        }
    }

    return(
        <View style={styleSheet.container}> 
            <Text style={styleSheet.headerStyle}>Log in</Text>
            {/* email text input */}
            <View style={styleSheet.usernameContainer}>
                <Text>Username</Text>
                <TextInput 
                placeholder='Email address' 
                value={email} 
                onChangeText={setEmail}
                autoCapitalize='none'
                autoCorrect={false}
                />
            </View>
            {/* password text input */}
            <View style={styleSheet.passwordContainer}>
                <View style={styleSheet.passwordInputStyle}>
                    <Text>Password</Text>
                    <TextInput 
                    placeholder='Password' 
                    value={password} 
                    onChangeText={setPassword}
                    secureTextEntry={showPassword}
                    autoCapitalize='none'
                    autoCorrect={false}/>
                </View>
            <Pressable style={styleSheet.eyeIconStyle} onPress={onShowPassword}>
                {
                    //shows or hides password eye icon
                    !showPassword ? <Icon name='eye-off-outline' size={20}/> : <Icon name='eye-outline' size={20}/> 
                }
            </Pressable>
            </View>
            <TouchableOpacity 
            style={isEmailAddressPasswordEmpty() ? styleSheet.disabledButtonStyle : styleSheet.buttonStyle} 
            onPress={handleLogin} 
            disabled={isEmailAddressPasswordEmpty()}>
                <Text>Log in</Text>
            </TouchableOpacity>
        </View>
    )
}

const styleSheet = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingHorizontal: 50,
      justifyContent: 'center',
    },
    usernameContainer:{
        width:'100%',
        height:65,
        borderWidth: 1,
        borderColor:'#ccc',
        borderRadius: 5,
        padding:10,
        marginBottom: 20,
    },
    passwordContainer:{
        flexDirection:'row',
        width:'100%',
        height: 65,
        borderWidth: 1,
        borderColor:'#ccc',
        borderRadius: 5,
        padding:10,
        marginBottom: 20
    },
    headerStyle:{
        marginBottom: 30,
        fontSize: 30
    },
    passwordInputStyle:{
        flex:9
    },
    eyeIconStyle:{
        justifyContent:'center',
        alignItems:'center'
    },
    buttonStyle:{
        backgroundColor: '#ff4500',
        width: '100%',
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 5
    },
    disabledButtonStyle:{
        backgroundColor: '#a9a9a9',
        width: '100%',
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    }  
});

export default LoginScreen;