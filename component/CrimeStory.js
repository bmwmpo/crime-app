import { ref, getDownloadURL } from "firebase/storage";
import { Text, Card, Badge } from "react-native-paper";
import { useState, useEffect } from "react";
import { storage } from "../config/firebase_config";
import { FlatList, Dimensions, Pressable, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import styleSheet from "../assets/StyleSheet";
import ImageView from "react-native-image-viewing";
import { StyleSheet } from "react-native";

//crime story component
const CrimeStory = ({ postingData }) => {
  //save the photo uri in an object {uri: }
  const [photoUri, setPhotoUri] = useState([]);
  const [showImageView, setShowImageView] = useState({
    visible: false,
    index: 0,
  });

  const storyBody = `${postingData.story.substring(
    0,
    postingData.story.indexOf("\n") + 1
  )}...`;
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const cardBorderColor = isDarkMode
    ? styleSheet.darkModeOutlinedColor
    : styleSheet.lightModeOutlinedColor;

  const postingDateTime = postingData.postingDateTime.toDate();

  //get post time passing
  const getTimePassing = () => {
    const timePassingInHrs = (new Date() - postingDateTime) / 1000 / 60 / 60;

    if (timePassingInHrs > 24) {
      return `${Math.ceil(timePassingInHrs / 24)}d`;
    } else if (timePassingInHrs < 1) {
      return `${Math.ceil(timePassingInHrs * 60)}m`;
    } else {
      return `${Math.ceil(timePassingInHrs)}h`;
    }
  };

  //retreive photos from firebase storage
  const retreivePhotoFromFirebaseStorage = async () => {
    setPhotoUri([]);
    try {
      for (photo of postingData.photo) {
        const photoRef = ref(storage, photo);
        const source = await getDownloadURL(photoRef);

        setPhotoUri((pre) => [...pre, { uri: source }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //retreive the photos when the page is first mounted
  useEffect(() => {
    retreivePhotoFromFirebaseStorage();
  }, []);

  return (
    <Card
      style={[
        styleSheet.flex_1,
        //styleSheet.container,
        backgroundColor,
        {
          borderColor: cardBorderColor.color,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      {/* image full screen */}
      <ImageView
        images={photoUri}
        imageIndex={showImageView.index}
        visible={showImageView.visible}
        onRequestClose={() =>
          setShowImageView((pre) => ({ ...pre, visible: false }))
        }
      />
      <Card.Content style={[styleSheet.height_100, styleSheet.width_100]}>
        {/* posting info: author, date and time */}
        <View
          style={[
            styleSheet.flexRowContainer,
            styleSheet.margin_Vertical,
            styleSheet.flexSpaceBetweenStyle,
            styleSheet.padding_Horizontal,
          ]}
        >
          {/* author */}
          <View style={styleSheet.container}>
            <Badge style={styleSheet.margin_Horizontal_right}>
              {postingData.postBy.substring(0, 1).toUpperCase()}
            </Badge>
          </View>
          {/* date and time */}
          <View style={[styleSheet.flexStartContainer]}>
            <Text
              variant="labelLarge"
              style={[
                styleSheet.margin_HorizontflexStartContaineral_right,
                textColor,
              ]}
            >
              {postingData.postBy}
            </Text>
            <Text variant="labelLarge" style={textColor}>
              {postingDateTime.toLocaleString()}
            </Text>
          </View>
          {/* passing time */}
          <View style={styleSheet.container}>
            <Text style={textColor}>{getTimePassing()}</Text>
          </View>
        </View>
        {/* story */}
        {postingData.story !== "" && (
          <Card.Content style={styleSheet.margin_Vertical}>
            <Text variant="titleMedium" style={textColor}>
              {storyBody}
            </Text>
          </Card.Content>
        )}
        {/* Photo section */}
        {photoUri.length > 0 && (
          <View style={[styleSheet.flex_1, styleSheet.container]}>
            <FlatList
              horizontal
              style={{ width: windowWidth * 0.8, height: windowHeight * 0.2 }}
              data={photoUri}
              keyExtractor={(item) => item.uri}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    setShowImageView({ visible: true, index });
                  }}
                >
                  <Card.Cover
                    source={{ uri: item.uri }}
                    style={{
                      width: windowWidth * 0.8,
                      height: windowHeight * 0.2,
                    }}
                  />
                </Pressable>
              )}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default CrimeStory;
