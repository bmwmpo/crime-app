import "react-native-gesture-handler";
import HomeScreen from "./screen/HomeScreen";
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
  return (
    <RootSiblingParent>
      <HomeScreen />
    </RootSiblingParent>
  );
}
