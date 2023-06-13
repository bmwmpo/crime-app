import { SafeAreaView } from 'react-native';
import { Text, Button } from 'react-native-paper'
import styleSheet from '../assets/StyleSheet';

//user not log in screen
const NotLogInScreen = ({navigation}) => {
    //navigate to log in screen
    const toLogInScreen = () => navigation.navigate('SignInSignUp', {screen:'LogIn'});

    return(
        <SafeAreaView style={styleSheet.container}>
            <Text variant='displaySmall' style={{margin:20}}>
                Log in to report crime
            </Text>
            <Button mode='contained' onPress={ toLogInScreen }>Log in / Sign up</Button>
        </SafeAreaView>
    );
}

export default NotLogInScreen;