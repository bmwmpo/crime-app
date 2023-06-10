import { useState } from 'react';
import { auth } from '../config/firebase_config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons'
import
    {
        Alert, Text, TextInput, TouchableOpacity, View, Pressable, KeyboardAvoidingView, Platform
    } from 'react-native';
import styleSheet from '../assets/StyleSheet';
import EnumString from '../assets/EnumString';

const LogInScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [vaildEmailFormat, setVaildEmailFormat] = useState(false);
    const [errorTextInput, setErrorTextInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //shows or hides the password
    const showHidePasswordPress = () => setHidePassword(!hidePassword);

    //delete email text input
    const deletePress = () => setEmail('');

    //login function
    const handleLogin = async () => {
        try {

            setIsLoading(true);
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            
            Alert.alert('Welcome');
            navigation.navigate("BottomTabNavigation");
        }
        catch(err){
            Alert.alert('Error', EnumString.invaildEmaillPassword);
            setIsLoading(false);
            console.log(err);
        }
        finally{
            setIsLoading(false)
        }
    }

    //check whether the email or password is empty or not
    const isEmailAddressPasswordEmpty = () =>{
        if(email.trim() === '' || password.trim() === '' ){        
            return true;
        }
        else {
            return false;
        }
    }

    //verify the email address format
    const isVaildEmailAddress = (newText) => {
        const regex = EnumString.emailRegex;
        const result = regex.test(newText);

        setVaildEmailFormat(result);
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

    //send forgot password email
    const handleForgotPassword = async() => {
        setErrorTextInput(false);
        
        try{
            await sendPasswordResetEmail(auth, email);
            
            Alert.alert(EnumString.resetPasswordAlertTitle, EnumString.resetPasswordMsg(email));
        }
        catch(err){
            console.log(err.message);
            setErrorTextInput(true);
        }
    }

    //navigate to SignUpScreen
    const toSignUpScreen = () => navigation.navigate('SignUp');
    
    return (
        <KeyboardAvoidingView style={ [styleSheet.container, styleSheet.screenBackGroundColor] } behavior={ Platform.OS === 'ios' && 'padding' }>
            <Text style={ [styleSheet.headerStyle, styleSheet.textColor] }>Log in to Toronto Crime Tracker</Text>
            {/* email text input */ }
            <View style={ styleSheet.formatContainer }>
                <View style={ [errorTextInput ? styleSheet.errorInputContainer : styleSheet.inputContainer, styleSheet.textInputBackGroundColor] }>
                    <TextInput
                        style={ [styleSheet.inputStyle, styleSheet.textColor] }
                        placeholder='Email'
                        placeholderTextColor={ styleSheet.textColor.color }
                        value={ email }
                        onChangeText={ onEmailTextChange }
                        onFocus={ () => setErrorTextInput(false) }
                        autoCapitalize='none'
                        autoCorrect={ false }
                        keyboardType='email-address'
                        autoFocus={ true }
                    />
                    {
                        !(email === '') &&
                        <Pressable style={ styleSheet.iconStyle } onPress={ deletePress }>
                            <Icon name='close-circle-outline' size={ 25 } />
                        </Pressable>
                    }
                </View>
                { errorTextInput && <Text style={ styleSheet.errorTextStyle }>Not a vaild email address</Text> }
            </View>
            {/* password text input */ }
            <View style={ styleSheet.formatContainer }>
                <View style={ [styleSheet.inputContainer, styleSheet.textInputBackGroundColor] }>
                    <TextInput
                        style={ [styleSheet.inputStyle, styleSheet.textColor] }
                        placeholder='Password'
                        placeholderTextColor={ styleSheet.textColor.color }
                        value={ password }
                        onChangeText={ setPassword }
                        secureTextEntry={ hidePassword }
                        autoCapitalize='none'
                        autoCorrect={ false }
                        onFocus={ showError }
                    />
                    <Pressable style={ styleSheet.iconStyle } onPress={ showHidePasswordPress }>
                        {
                            //shows or hides password eye icon
                            hidePassword ? <Icon name='eye-outline' size={ 25 } /> : <Icon name='eye-off-outline' size={ 25 } />
                        }
                    </Pressable>
                </View>
                {/* forgot password button */ }
                <Pressable onPress={ handleForgotPassword }>
                    <Text style={ styleSheet.underLineTextStyle }>Forgot your password?</Text>
                </Pressable>
            </View>
            {/* Log in button */ }
            <TouchableOpacity
                style={ isEmailAddressPasswordEmpty() ||
                    !vaildEmailFormat ? styleSheet.disabledButtonStyle : styleSheet.buttonStyle }
                onPress={ handleLogin }
                disabled={ isEmailAddressPasswordEmpty() || !vaildEmailFormat }
            >
                <Text style={ styleSheet.buttonTextStyle }>Log in</Text>
            </TouchableOpacity>
            {/* Go to Sign Up Screen*/ }
            <View style={ styleSheet.flexRowContainer }>
                <Text style={ [styleSheet.textStyle, styleSheet.textColor] }>Don't have an account? </Text>
                <Pressable onPress={ toSignUpScreen }>
                    <Text style={ styleSheet.underLineTextStyle }>Sign Up here</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

export default LogInScreen;