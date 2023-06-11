import { useState } from 'react';
import { auth } from '../config/firebase_config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons'
import { Alert, Text, TextInput, TouchableOpacity,View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import styleSheet from '../assets/StyleSheet';
import { db } from '../config/firebase_config';
import { collection, addDoc } from 'firebase/firestore';
import EnumString from '../assets/EnumString';
import { StatusBar } from 'expo-status-bar';

const SignUpScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [validEmailFormat, setValidEmailFormat] = useState(false);
    const [validPasswordLength, setValidPasswordLength] = useState(false);
    const [errorTextEmail, setErrorTextEmail] = useState(false);
    const [errorTextPassword, setErrorTextPassword] = useState(false);

    //shows or hides the password
    const showHidePasswordPress = () => setHidePassword(!hidePassword);

    //delete the email text input
    const deletePress = () => setEmail('');

    //save the new user infomation in firestore
    const saveUserInfoInFirestore = async ({email, uid})=>{
        try{
            const collectionRef = collection(db, 'UserInfo');

            const data = {
                email,
                userId:uid
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
            await saveUserInfoInFirestore(userCredentials.user);

            Alert.alert('Welcome');
            navigation.navigate('BottomTabNavigation', {screen:'Map'});
        }
        catch(err){
            Alert.alert(EnumString.signUpFailed, EnumString.emailAlreadyInUse);
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
        const regex = EnumString.emailRegex;
        const result = regex.test(newText)

        setValidEmailFormat(result);
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
        <KeyboardAvoidingView style={[styleSheet.container, styleSheet.screenBackGroundColor]} behavior={Platform.OS === 'ios' && 'padding'}> 
            <Text style={[styleSheet.headerStyle, styleSheet.textColor]}>Welcome to Toronro Crime Tracker</Text>
            {/* email text input */}
            <View style={styleSheet.formatContainer}>
                <View style={[errorTextEmail ? styleSheet.errorInputContainer : styleSheet.inputContainer, styleSheet.textInputBackGroundColor]}>
                    <TextInput 
                        style={ [styleSheet.inputStyle, styleSheet.textColor] }
                        placeholder='Email address' 
                        placeholderTextColor={ styleSheet.textColor.color }
                        value={email} 
                        onChangeText={onEmailTextChange}
                        onFocus={()=>{
                            setErrorTextEmail(false);
                            showPasswordError();
                            
                        }}
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='email-address'
                        autoFocus={true}
                    />
                    {
                        !(email === '') && 
                        <Pressable style={styleSheet.iconStyle} onPress={deletePress}> 
                                <Icon name='close-circle-outline' size={ 25 } color={ styleSheet.textColor.color } />
                        </Pressable>
                    }
                </View>
                {/* error message */}
                { errorTextEmail && <Text style={styleSheet.errorTextStyle}>Not a valid email address</Text>}
            </View>
            {/* password text input */}
            <View style={styleSheet.formatContainer}>
                <View style={[errorTextPassword ? styleSheet.errorInputContainer : styleSheet.inputContainer, styleSheet.textInputBackGroundColor]}>
                    <TextInput 
                        style={ [styleSheet.inputStyle, styleSheet.textColor] }
                        placeholder='Password' 
                        placeholderTextColor={ styleSheet.textColor.color }
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
                <Pressable style={styleSheet.iconStyle} onPress={showHidePasswordPress}>
                    {
                        //shows or hides password eye icon
                            hidePassword ? <Icon name='eye-outline' size={ 25 } color={ styleSheet.textColor.color } />
                                : <Icon name='eye-off-outline' size={ 25 } color={ styleSheet.textColor.color }/> 
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
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen;