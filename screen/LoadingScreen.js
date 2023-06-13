import { SafeAreaView } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import styleSheet from '../assets/StyleSheet';

const LoadingScreen = () => {
    return (
        <SafeAreaView style={ styleSheet.loadingViewStyle}>
            <ActivityIndicator  
            animating={ true } 
            color={ styleSheet.highLightTextColor.color} 
            size={'large'}/>
        </SafeAreaView>
     );
}

export default LoadingScreen;