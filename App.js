import "react-native-gesture-handler";
import HomeScreen from "./screen/HomeScreen";
//to use toast in the app
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  return (
    <RootSiblingParent>
      <HomeScreen />
    </RootSiblingParent>
  );
}
