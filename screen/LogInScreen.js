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
import { useTheme } from '@react-navigation/native';
import LoadingScreen from './LoadingScreen';

const LogInScreen = ({navigation, route}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [vaildEmailFormat, setVaildEmailFormat] = useState(false);
    const [errorTextInput, setErrorTextInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isDarkMode = useTheme().dark;

    //shows or hides the password
    const showHidePasswordPress = () => setHidePassword(!hidePassword);

    //delete email text input
    const deletePress = () => setEmail('');

    //login function
    const handleLogin = async () => {
        try
        {
            //set to is loading
            setIsLoading(true);
            //hide the navigation header
            navigation.setOptions({ headerShown: false });

            //sign to firebase
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            
            Alert.alert('Welcome');

            //redirect to the Main Screen upon successful sign-in
            navigation.navigate("BottomTabNavigation");
        }
        catch(err){
            Alert.alert('Error', EnumString.invaildEmaillPassword);
            setIsLoading(false);
            console.log(err);
        }
        finally{
            setIsLoading(false)
            navigation.setOptions({ headerShown: true });
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
        //display loading screen when isLoading is true, otherwise display login form
        isLoading ? (<LoadingScreen />) : (
        <KeyboardAvoidingView style={ [styleSheet.container, isDarkMode? styleSheet.darkModeBackGroundColor : styleSheet.lightModeBackGroundColor] } behavior={ Platform.OS === 'ios' && 'padding' }>
            <Text style={ [styleSheet.headerStyle, isDarkMode? styleSheet.darkModeColor : styleSheet.lightModeColor] }>Log in to Toronto Crime Tracker</Text>
            {/* email text input */ }
            <View style={ styleSheet.formatContainer }>
                <View style={ [errorTextInput ? styleSheet.errorInputContainer : styleSheet.inputContainer,
                isDarkMode? styleSheet.darkModeTextInputBackGroundColor : styleSheet.lightModeTextInputBackGroundColor] }>
                    <TextInput
                        style={ [styleSheet.inputStyle, isDarkMode? styleSheet.darkModeColor : styleSheet.lightModeColor] }
                        placeholder='Email'
                        placeholderTextColor={ isDarkMode? styleSheet.darkModeColor.color : styleSheet.lightModeColor.color }
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
                            <Icon name='close-circle-outline' size={ 25 } color={isDarkMode? styleSheet.darkModeColor.color : styleSheet.lightModeColor.color}/>
                        </Pressable>
                    }
                </View>
                { errorTextInput && <Text style={ styleSheet.errorTextStyle }>Not a vaild email address</Text> }
            </View>
            {/* password text input */ }
            <View style={ styleSheet.formatContainer }>
                <View style={ [styleSheet.inputContainer,
                isDarkMode ? styleSheet.darkModeTextInputBackGroundColor : styleSheet.lightModeTextInputBackGroundColor] }>
                    <TextInput
                        style={ [styleSheet.inputStyle, isDarkMode? styleSheet.darkModeColor : styleSheet.lightModeColor] }
                        placeholder='Password'
                        placeholderTextColor={ isDarkMode? styleSheet.darkModeColor.color : styleSheet.lightModeColor.color }
                        value={ password }
                        onChangeText={ setPassword }
                        secureTextEntry={ hidePassword }
                        autoCapitalize='none'
                        autoCorrect={ false }
                        onFocus={ showError }
                    />
                    {/* shows or hides password eye icon */ }
                    <Pressable style={ styleSheet.iconStyle } onPress={ showHidePasswordPress }>
                        <Icon name={ hidePassword ? 'eye-outline' : 'eye-off-outline' } size={ 25 }
                            color={ isDarkMode ? styleSheet.darkModeColor.color : styleSheet.lightModeColor.color } /> 
                    </Pressable>
                </View>
                {/* forgot password button */ }
                <TouchableOpacity onPress={ handleForgotPassword }>
                    <Text style={ [styleSheet.underLineTextStyle, styleSheet.highLightTextColor] }>Forgot your password?</Text>
                </TouchableOpacity>
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
                <Text style={ [styleSheet.textStyle, isDarkMode? styleSheet.darkModeColor : styleSheet.lightModeColor] }>Don't have an account? </Text>
                <TouchableOpacity onPress={ toSignUpScreen }>
                    <Text style={ [styleSheet.underLineTextStyle, styleSheet.highLightTextColor]}>Sign Up here</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>)
    );
}

export default LogInScreen;