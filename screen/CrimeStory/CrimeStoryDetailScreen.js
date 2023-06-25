import {
  View,
  Dimensions,
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { Text, Avatar, TextInput, Appbar, Button } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native";
import ImageView from "react-native-image-viewing";
import styleSheet from "../../assets/StyleSheet";

const CrimeStoryDetailScreen = ({ route }) => {
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [showImageView, setShowImageView] = useState({
    visible: false,
    index: 0,
  });
  const [KeyboardStatus, setKeyboardStatus] = useState(false);
  const [textInputHeight, setTextInputHeight] = useState(windowHeight * 0.06);

  //posting data
  const { postBy, photo, postingDateTime, story } = route.params.postingData;
  const { photoUri } = route.params;
  const dateAndTime = postingDateTime.toDate();

  useEffect(() => {
    const showKeyboard = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });

    const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={[styleSheet.flex_1, styleSheet.container, backgroundColor]}
    >
      {/* full image view */}
      <ImageView
        images={photoUri}
        imageIndex={showImageView.index}
        visible={showImageView.visible}
        onRequestClose={() =>
          setShowImageView((pre) => ({ ...pre, visible: false }))
        }
      />
      <ScrollView
        style={[
          { padding: "4%", width: windowWidth },
          styleSheet.margin_Vertical,
        ]}
        contentContainerStyle={styleSheet.flexStartContainer}
      >
        {/* posting information: author, posting date, and time */}
        <View
          style={[
            styleSheet.flexRowContainer,
            styleSheet.flexSpaceBetweenStyle,
            styleSheet.margin_Vertical,
            { width: windowWidth * 0.7 },
          ]}
        >
          <Avatar.Text label={postBy.substring(0, 1).toUpperCase()} size={45} />
          <Text variant="labelLarge" style={textColor}>
            {postBy}
          </Text>
          <Text variant="labelLarge" style={textColor}>
            {dateAndTime.toLocaleString()}
          </Text>
        </View>
        {/* story */}
        <Text
          variant="titleLarge"
          style={[textColor, styleSheet.margin_Vertical]}
        >
          {story}
        </Text>
        {/* photo section */}
        {photoUri.length > 0 && (
          <View style={[styleSheet.flex_1, styleSheet.container]}>
            <FlatList
              horizontal
              style={{ width: windowWidth, height: windowHeight * 0.7 }}
              data={photoUri}
              keyExtractor={(item) => item.uri}
              ItemSeparatorComponent={() => (
                <View style={{ paddingRight: windowWidth * 0.1 }}></View>
              )}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    setShowImageView({ visible: true, index });
                  }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={{
                      width: windowWidth,
                      height: windowHeight * 0.7,
                    }}
                  />
                </Pressable>
              )}
            />
          </View>
        )}
      </ScrollView>
      <TextInput
        style={[styleSheet.width_100, backgroundColor]}
        textColor={textColor.color}
        placeholder="add a comment"
        multiline={true}
      />

      <Appbar
        style={[
          styleSheet.width_100,
          { height: windowHeight * 0.06 },
          backgroundColor,
        ]}
      >
        <Appbar.Action icon="thumb-up" />
        <Appbar.Action icon="share" />
        {KeyboardStatus && (
          <View style={[styleSheet.flexEndStyle, styleSheet.width_100]}>
            <Button mode="contained" style={[styleSheet.margin_Horizontal]}>
              Reply
            </Button>
          </View>
        )}
      </Appbar>
    </SafeAreaView>
  );
};

export default CrimeStoryDetailScreen;
