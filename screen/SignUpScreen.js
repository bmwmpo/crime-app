import { useState } from 'react';
import { auth } from '../config/firebase_config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Alert, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Text, HelperText } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { db } from '../config/firebase_config';
import { collection, addDoc } from 'firebase/firestore';
import EnumString from '../assets/EnumString';
import LoadingScreen from './LoadingScreen';
import styleSheet from '../assets/StyleSheet';

//user sign up screen
const SignUpScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [validEmailFormat, setValidEmailFormat] = useState(true);
    const [validPasswordLength, setValidPasswordLength] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isDarkMode = useTheme().dark;
    const textColor = isDarkMode ? styleSheet.darkModeColor.color : styleSheet.lightModeColor.color;
    const outlinedColor = isDarkMode ? styleSheet.darkModeOutlinedColor.color : styleSheet.lightModeOutlinedColor.color

    //shows or hides the password
    const showHidePasswordPress = () => setHidePassword(!hidePassword);

    //delete the email text input
    const deletePress = () => setEmail('');

    //save the new user infomation in firestore
    const saveUserInfoInFirestore = async ({email, uid})=> {
        try {
            const collectionRef = collection(db, 'UserInfo');

            const data = {
                email,
                userId:uid
            }

            const docAdded = await addDoc(collectionRef, data);
        }
        catch(err) {
            Alert.alert("Error", err.message);
        }
    }

    //sign up function
    const handleCreateNewAccount= async () => {
        try {
            //set is loading to ture
            setIsLoading(true);
            //hide the navigation header
            navigation.setOptions({ headerShown: false });

            //create new user in firebase
            const userCredentials = await createUserWithEmailAndPassword (auth, email, password);
            await saveUserInfoInFirestore(userCredentials.user);

            Alert.alert('Welcome');
             //redirect to the Main Screen upon successful create new account
            navigation.navigate('BottomTabNavigation', {screen:'Map'});
        }
        catch (err) {
            setIsLoading(false);
            Alert.alert(EnumString.signUpFailed, EnumString.emailAlreadyInUse);
            console.log(err);
        }
        finally {
            setIsLoading(false);
            navigation.setOptions({ headerShown: true });
        }
    }

    //Check if either the email address or password is an empty string
    const isEmailAddressPasswordEmpty = () =>{
        if(email.trim() === '' || password.trim() === '' ) {        
            return true;
        }
        else {
            return false;
        }
    }

    //verify the email address
    const isValidEmailAddress = (newText) => {
        const regex = EnumString.emailRegex;
        // const result = regex.test(newText)

        setValidEmailFormat(regex.test(newText));
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

    return (
        //display loading screen when isLoading is true, otherwise display sign up form
        isLoading ? (<LoadingScreen />) :
            (
                <KeyboardAvoidingView style={ [styleSheet.container,
                isDarkMode ? styleSheet.darkModeBackGroundColor : styleSheet.lightModeBackGroundColor] }
                    behavior={ Platform.OS === 'ios' && 'padding' }
                >
                    <Text
                        variant='headlineSmall'
                        style={ [styleSheet.headerStyle,
                        isDarkMode ? styleSheet.darkModeColor : styleSheet.lightModeColor] }
                    >
                        Welcome to Toronro Crime Tracker
                    </Text>
                    {/* email text input */ }
                    <View style={ styleSheet.formatContainer }>
                        <TextInput
                            style={ [styleSheet.inputStyle, isDarkMode ? styleSheet.darkModeTextInputBackGroundColor : styleSheet.lightModeTextInputBackGroundColor] }
                            label='Email'
                            textColor={ textColor }
                            mode='outlined'
                            activeOutlineColor={ outlinedColor }
                            value={ email }
                            onChangeText={ onEmailTextChange }
                            outlineColor={ !validEmailFormat ? styleSheet.errorTextStyle.color : 'transparent' }
                            autoCapitalize='none'
                            autoCorrect={ false }
                            keyboardType='email-address'
                            autoFocus={ true }
                            right={ !(email === '') &&
                                <TextInput.Icon
                                    icon='close-circle'
                                    onPress={ deletePress }
                                    iconColor={ textColor }
                                />
                            }
                        />
                        <HelperText
                            type='error'
                            padding='none'
                            style={ styleSheet.errorTextStyle }
                            visible={ !validEmailFormat }
                        >
                            Not a valid email address
                        </HelperText>
                    </View>
                    {/* password text input */ }
                    <View style={ styleSheet.formatContainer }>
                        <TextInput
                            style={ [styleSheet.inputStyle, isDarkMode ? styleSheet.darkModeTextInputBackGroundColor : styleSheet.lightModeTextInputBackGroundColor] }
                            label='Password'
                            mode='outlined'
                            textColor={ textColor }
                            activeOutlineColor={ outlinedColor }
                            outlineColor='transparent'
                            value={ password }
                            onChangeText={ onPasswordTextChange }
                            autoCapitalize='none'
                            autoCorrect={ false }
                            secureTextEntry={ hidePassword }
                            right={
                                <TextInput.Icon
                                    icon={ hidePassword ? 'eye' : 'eye-off' }
                                    onPress={ showHidePasswordPress }
                                    iconColor={ textColor }
                                />
                            }
                        />
                        <HelperText
                            type='error'
                            padding='none'
                            style={ styleSheet.errorTextStyle }
                            visible={ !validPasswordLength }
                        >
                            Password must be at least 6 characters
                        </HelperText>
                    </View>
                    <TouchableOpacity
                        style={ isEmailAddressPasswordEmpty()
                            || !validEmailFormat || !validPasswordLength
                            ? styleSheet.disabledButtonStyle : styleSheet.buttonStyle }
                        onPress={ handleCreateNewAccount }
                        disabled={ isEmailAddressPasswordEmpty() || !validEmailFormat || !validPasswordLength }
                    >
                        <Text variant="labelLarge" style={ styleSheet.buttonTextStyle }>Create account</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )
    );
}

export default SignUpScreen;