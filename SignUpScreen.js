import { useState } from 'react';
import { auth } from './config/firebase_config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons'
import { Alert, Text, TextInput, TouchableOpacity,View, Pressable } from 'react-native';
import styleSheet from './assets/StyleSheet';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [vaildEmailFormat, setVaildEmailFormat] = useState(false);
    const [errorTextInput, setErrorTextInput] = useState(false)

    //shows or hides the password
    const showHidePasswordPress = () => setHidePassword(!hidePassword);

    //delete email input
    const deletePress = () => setEmail('');

    //sign up function
    const handleCreateNewAccount= async () => {
        try {

            const userCredentials = await createUserWithEmailAndPassword (auth, email, password);
            Alert.alert('OK', '');
        }
        catch(err){
            Alert.alert('Error', `${err.message}`);
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

    return(
        <View style={styleSheet.container}> 
            <Text style={styleSheet.headerStyle}>Welcome</Text>
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
                        secureTextEntry={hidePassword}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onFocus={showError}
                        />
                    </View>
                <Pressable style={styleSheet.iconStyle} onPress={showHidePasswordPress}>
                    {
                        //shows or hides password eye icon
                        hidePassword ? <Icon name='eye-outline' size={20}/> : <Icon name='eye-off-outline' size={20}/> 
                    }
                </Pressable>
                </View>
            </View>
            <TouchableOpacity 
            style={isEmailAddressPasswordEmpty() || !vaildEmailFormat ? styleSheet.disabledButtonStyle : styleSheet.buttonStyle} 
            onPress={handleCreateNewAccount} 
            disabled={isEmailAddressPasswordEmpty() || !vaildEmailFormat}>
                <Text>Create account</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUpScreen;