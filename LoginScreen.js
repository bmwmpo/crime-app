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
    const showPasswordPress = () => setShowPassword(!showPassword);

    //delete email input
    const deletePress = () => setEmail('');

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
            <View style={styleSheet.inputContainer}>
                <TextInput 
                    style={styleSheet.inputStyle}
                    placeholder='Email address' 
                    value={email} 
                    onChangeText={setEmail}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <Pressable style={styleSheet.iconStyle} onPress={deletePress}> 
                    <Icon name='close-circle-outline' size={20}/>
                </Pressable>
            </View>
            {/* password text input */}
            <View style={styleSheet.inputContainer}>
                <View style={styleSheet.inputStyle}>
                    <TextInput 
                    placeholder='Password' 
                    value={password} 
                    onChangeText={setPassword}
                    secureTextEntry={showPassword}
                    autoCapitalize='none'
                    autoCorrect={false}/>
                </View>
            <Pressable style={styleSheet.iconStyle} onPress={showPasswordPress}>
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
      backgroundColor: '#696969',
      alignItems: 'center',
      paddingHorizontal: 50,
      justifyContent: 'center',
    },
    inputContainer:{
        flexDirection:'row',
        backgroundColor:'#d3d3d3',
        width:'100%',
        height: 50,
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
    usernameInputStyle:{
        width:'100%',
        height:50,
        borderWidth: 1,
        borderColor:'#ccc',
        borderRadius: 5,
        padding:5,
        marginBottom: 20,
    },
    inputStyle:{
        flex:9
    },
    iconStyle:{
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