import { useState } from 'react';
import { auth } from './config/firebase_config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons'
import { Alert, Text, TextInput, TouchableOpacity,View, StyleSheet, Pressable } from 'react-native';
import styleSheet from './assets/StyleSheet';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [vaildEmailFormat, setVaildEmailFormat] = useState(false);
    const [errorTextInput, setErrorTextInput] = useState(false)

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

    const isVaildEmailAddress = () => {
        const regex = /^[a-z0-9]+[\.\%\$\#\!\*]?[a-z0-9]+@[a-z0-9]+\.[a-z]{1,}$/i

        setVaildEmailFormat(regex.test(email));

        console.log(regex.test(email));
    }

    return(
        <View style={styleSheet.container}> 
            <Text style={styleSheet.headerStyle}>Log in</Text>
            {/* email text input */}
            <View style={styleSheet.formatContainer}>
                <View style={errorTextInput ? styleSheet.errorInputContainer : styleSheet.inputContainer}>
                    <TextInput 
                        style={styleSheet.inputStyle}
                        placeholder='Email address' 
                        value={email} 
                        onChangeText={setEmail}
                        onChange={isVaildEmailAddress}
                        onKeyPress={isVaildEmailAddress}
                        onFocus={()=>setErrorTextInput(false)}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                    <Pressable style={styleSheet.iconStyle} onPress={deletePress}> 
                        <Icon name='close-circle-outline' size={20}/>
                    </Pressable>
                </View>
                { errorTextInput && <Text style={styleSheet.errorTextStyle}>Not a vaild email address</Text>}
            </View>
            {/* password text input */}
            <View style={styleSheet.formatContainer}>
                <View style={styleSheet.inputContainer}>
                    <View style={styleSheet.inputStyle}>
                        <TextInput 
                        placeholder='Password' 
                        value={password} 
                        onChangeText={setPassword}
                        secureTextEntry={showPassword}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onFocus={()=>{
                            if(!vaildEmailFormat)
                                setErrorTextInput(true);
                            else 
                                setErrorTextInput(false);
                        }}
                        />
                    </View>
                <Pressable style={styleSheet.iconStyle} onPress={showPasswordPress}>
                    {
                        //shows or hides password eye icon
                        !showPassword ? <Icon name='eye-off-outline' size={20}/> : <Icon name='eye-outline' size={20}/> 
                    }
                </Pressable>
                </View>
            </View>
            <TouchableOpacity 
            style={isEmailAddressPasswordEmpty() || !vaildEmailFormat ? styleSheet.disabledButtonStyle : styleSheet.buttonStyle} 
            onPress={handleLogin} 
            disabled={isEmailAddressPasswordEmpty() || !vaildEmailFormat}>
                <Text>Log in</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen;