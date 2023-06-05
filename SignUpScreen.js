import { useState } from 'react';
import { auth } from './config/firebase_config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons'
import { Alert, Text, TextInput, TouchableOpacity,View, Pressable } from 'react-native';
import styleSheet from './assets/StyleSheet';
import { db } from './config/firebase_config';
import { collection, addDoc } from 'firebase/firestore'

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [validEmailFormat, setValidEmailFormat] = useState(false);
    const [validPasswordLength, setValidPasswordLength] = useState(false);
    const [errorTextEmail, setErrorTextEmail] = useState(false);
    const [errorTextPassword, setErrorTextPassword] = useState(false);

    //shows or hides the password
    const showHidePasswordPress = () => setHidePassword(!hidePassword);

    //delete email input
    const deletePress = () => setEmail('');

    //save new user infomation in firestore
    const saveUserInfoInFirestore = async ()=>{
        try{
            const collectionRef = collection(db, 'UserInfo');

            const data = {
                email
            }

            const docAdded = await addDoc(collectionRef, data);
        }
        catch(err){
            Alert.alert("Error", err.message);
        }
    }

    //sign up function
    const handleCreateNewAccount= async () => {
        try {

            const userCredentials = await createUserWithEmailAndPassword (auth, email, password);
            saveUserInfoInFirestore();
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
    const isValidEmailAddress = (newText) => {
        const regex = /^[\w\.\-\_\&\*\&\%\$\#\!]+@[\w]+\.[\w]{2,4}$/

        const result = regex.test(newText)

        setValidEmailFormat(result);

        console.log('email',result,newText, validEmailFormat);
    }

    //verify the password length
    const isValidPasswordLength = (newText) => setValidPasswordLength(newText.length >= 6);

    //update and verify the email state value
    const onEmailTextChange = (newText) => {
        setEmail(newText);
        isValidEmailAddress(newText);
    }

    //update and verify the password state value
    const onPasswordTextChange = (newText) => {
        setPassword(newText);
        isValidPasswordLength(newText);
    }

    //display the email error message
    const showEmailError = () => {
        if(!validEmailFormat)
            setErrorTextEmail(true);
        else 
            setErrorTextEmail(false);
    }

    //display the password error message
    const showPasswordError = () => {
        if(!validPasswordLength)
            setErrorTextPassword(true);
        else 
            setErrorTextPassword(false);
    }

    return(
        <View style={styleSheet.container}> 
            <Text style={styleSheet.headerStyle}>Welcome</Text>
            {/* email text input */}
            <View style={styleSheet.formatContainer}>
                <View style={errorTextEmail ? styleSheet.errorInputContainer : styleSheet.inputContainer}>
                    <TextInput 
                        style={styleSheet.inputStyle}
                        placeholder='Email address' 
                        value={email} 
                        onChangeText={onEmailTextChange}
                        onFocus={()=>{
                            setErrorTextEmail(false);
                            showPasswordError();
                            
                        }}
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
                {/* error message */}
                { errorTextEmail && <Text style={styleSheet.errorTextStyle}>Not a valid email address</Text>}
            </View>
            {/* password text input */}
            <View style={styleSheet.formatContainer}>
                <View style={errorTextPassword ? styleSheet.errorInputContainer : styleSheet.inputContainer}>
                    <View style={styleSheet.inputStyle}>
                        <TextInput 
                        placeholder='Password' 
                        value={password} 
                        onChangeText={onPasswordTextChange}
                        secureTextEntry={hidePassword}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onFocus={()=>{
                            setErrorTextPassword(false);
                            showEmailError();  
                        }}
                        />
                    </View>
                <Pressable style={styleSheet.iconStyle} onPress={showHidePasswordPress}>
                    {
                        //shows or hides password eye icon
                        hidePassword ? <Icon name='eye-outline' size={20}/> : <Icon name='eye-off-outline' size={20}/> 
                    }
                </Pressable>
                </View>
                {/* error message */}
                { errorTextPassword && <Text style={styleSheet.errorTextStyle}>Password must be at least 6 characters</Text>}
            </View>
            <TouchableOpacity 
            style={isEmailAddressPasswordEmpty() || !validEmailFormat || !validPasswordLength ? styleSheet.disabledButtonStyle : styleSheet.buttonStyle} 
            onPress={handleCreateNewAccount} 
            disabled={isEmailAddressPasswordEmpty() || !validEmailFormat || !validPasswordLength}>
                <Text style={styleSheet.buttonTextStyle}>Create account</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUpScreen;