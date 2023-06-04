import { useState } from 'react';
import { auth } from './config/firebase_config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
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

    //Check if either the email address or password is an empty string
    const isEmailAddressPasswordEmpty = () =>{
        if(email.trim() === '' || password.trim() === '' ){        
            return true;
        }
        else {
            return false;
        }
    }

    //verify the email address
    const isVaildEmailAddress = (newText) => {
        const regex = /^[\w\.\-\_\&\*\&\%\$\#\!]+@[\w]+\.[\w]{2,4}$/

        const result = regex.test(newText)

        setVaildEmailFormat(result);

        console.log('email',result,newText, vaildEmailFormat);

        return result;
    }

    //update and verify the email state value
    const onEmailTextChange = (newText) => {
        setEmail(newText);
        isVaildEmailAddress(newText);
    }

    //display the error message
    const showError = () => {
        if(!vaildEmailFormat)
            setErrorTextInput(true);
        else 
            setErrorTextInput(false);
    }

    //send a password reset email
    const forgotPassword = async() => {
        setErrorTextInput(false);

        try {
            await sendPasswordResetEmail(auth, email);
            
            Alert.alert('Password reset email sent', 
            `We sent a password reset instruction to ${email}, please check both your inbox and spam folder.`)
            
            console.log('send');
        }
        catch(err){
            console.log(err.message);
            setErrorTextInput(true);
        }
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
                        onChangeText={onEmailTextChange}
                        onFocus={()=>setErrorTextInput(false)}
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='email-address'
                    />
                    {
                        !(email === '') && 
                        <Pressable style={styleSheet.iconStyle} onPress={deletePress}> 
                            <Icon name='close-circle-outline' size={20}/>
                        </Pressable>
                    }
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
                        onFocus={showError}
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
            <Pressable onPress={forgotPassword}>
                <Text>Forgot your password?</Text>
            </Pressable>
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