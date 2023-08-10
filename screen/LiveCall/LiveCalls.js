import React, { useState, useEffect } from "react";
import BottomTabNavigation from "../../navigation/BottomTabNavigation";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { BG_IMG, BG_IMG_DARK, LIVE_CALL_API } from "../../assets/EnumString";
import useStore from "../../zustand/store";
import Icon from "react-native-vector-icons/Ionicons";
import PopUpMap from "../../component/PopUpMap";
import LoadingScreen from "../LoadingScreen";
import { useTheme, useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

function timeConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

const LiveCalls = ({ navigation }) => {

  const isDarkMode = useTheme().dark;
  const imageSrc = isDarkMode
    ? BG_IMG_DARK
    : BG_IMG;
  // const backgroundColor = isDarkMode
  //   ? styleSheet.darkModeBackGroundColor
  //   : styleSheet.lightModeBackGroundColor;

  const { signIn } = useStore((state) => state);
  const isFocused = useIsFocused();
  const [data, setData] = useState(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const SPACING = 20;
  const AVATAR_SIZE = 70;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
  let newArray = [];

  const [showMapView, setShowMapView] = useState(false);
  const [coord, setCoord] = useState({
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [location, setLocation] = useState("");

  const showHideMapView = () => setShowMapView(!showMapView);

  const handleAddPost = (item) => {
    console.log("Add Post button pressed!");
    navigation.navigate("Report", {
      item: item.item,
    });
  };

  //fetch live call data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(LIVE_CALL_API);
      const json = await response.json();
      setData(json);
    };
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  if (!data) {
    return <LoadingScreen />;
  } else {
    newArray = data.features.map((feature) => ({
      OBJECTID: feature.attributes.OBJECTID,
      OCCURRENCE_TIME: timeConverter(feature.attributes.OCCURRENCE_TIME),
      CALL_TYPE: feature.attributes.CALL_TYPE,
      CROSS_STREETS: feature.attributes.CROSS_STREETS,
      geometry: feature.geometry,
    }));
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}></View>
        <Image
          source={{ uri: imageSrc }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={80}
        />
        <PopUpMap
          showMapView={showMapView}
          showHideMapView={showHideMapView}
          initRegion={coord}
          location={location}
          useDraggableMaker={false}
        />
        <Animated.FlatList
          data={newArray}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          keyExtractor={(item) => item.OBJECTID}
          contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight || 42,
          }}
          renderItem={({ item, index }) => {
            return (
              <Animated.View
                style={{
                  flexDirection: "row",
                  padding: SPACING,
                  marginBottom: SPACING,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                }}
              >
                {/* <Image
                      source={{uri: item.image}}
                      style={{width:AVATAR_SIZE, height:AVATAR_SIZE, borderRadius: AVATAR_SIZE,
                      marginRight: SPACING/2
                      }}
                  /> */}
                <View>
                  {/* date and time */}
                  <Text style={{ fontSize: 22, fontWeight: "700" }}>
                    {item.OCCURRENCE_TIME}
                  </Text>
                  {/* call type */}
                  <Text style={{ fontSize: 18, opacity: 0.7 }}>
                    {item.CALL_TYPE}
                  </Text>
                  {/* location */}
                  <TouchableOpacity
                    onPress={() => {
                      setCoord({
                        ...coord,
                        latitude: item.geometry.y,
                        longitude: item.geometry.x,
                      });

                      setLocation(item.CROSS_STREETS);
                      showHideMapView();
                    }}
                  >
                    <Text
                      style={{ fontSize: 14, opacity: 0.8, color: "#0099cc" }}
                    >
                      {item.CROSS_STREETS}
                    </Text>
                  </TouchableOpacity>
                  {/* add post button */}
                  {!signIn ? (
                    <></>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAddPost({ item: { item } })}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon
                        name="add-circle"
                        color="green"
                        size={20}
                        style={{ paddingTop: 5 }}
                      />
                      <Text style={{ paddingLeft: 5 }}>Add Post</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            );
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LiveCalls;
