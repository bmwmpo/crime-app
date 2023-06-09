import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import MapScreen from './MapScreen';
import ChartScreen from './Chart';
import AddPostScreen from './AddPostScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = ({route, navigation}) =>{
    console.log(route.params);
    return (<Tab.Navigator screenOptions={({route}) => ({
        tabBarStyle:[{display: 'flex'}, null],
        tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if(route.name === 'Map'){
                iconName = 'map-outline'
            }
            else if(route.name === 'Chart'){
                iconName = 'bar-chart-outline'
            }
            else if(route.name === 'AddPost'){
                iconName = 'add-outline'
            }

            return <Icon name={iconName} color={color} size={size}/>
        }
    })}>
        <Tab.Screen name="Map" component={MapScreen} options={{headerShown:false}}/>
        <Tab.Screen name="Chart" component={ChartScreen} options={{headerShown:false}}/>
        <Tab.Screen name="AddPost" component={AddPostScreen} options={{headerShown:false}}/>
    </Tab.Navigator>);
}

export default BottomTabNavigation;