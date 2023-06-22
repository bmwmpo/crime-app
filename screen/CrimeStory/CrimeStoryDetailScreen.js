import {
  View,
  Dimensions,
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { Text, Avatar } from "react-native-paper";
import ImageView from "react-native-image-viewing";
import styleSheet from "../../assets/StyleSheet";

const CrimeStoryDetailScreen = ({ route }) =>
{
  useEffect(() => {
    console.log(route.params);
  }, []);
 
    const [showImageView, setShowImageView] = useState({
    visible: false,
    index: 0,
  });
  
    const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const { postBy, photo, postingDateTime, story } = route.params.postingData;
  const { photoUri } = route.params;
  const dateAndTime = postingDateTime.toDate();

  return (
      <SafeAreaView style={ [styleSheet.flex_1, styleSheet.container]}>
      <ImageView
        images={photoUri}
        imageIndex={showImageView.index}
        visible={showImageView.visible}
        onRequestClose={() =>
          setShowImageView((pre) => ({ ...pre, visible: false }))
        }
      />
      <Avatar.Text label={postBy.substring(0, 1).toUpperCase()} />
      <Text>{postBy}</Text>
      <Text>{dateAndTime.toLocaleString()}</Text>
      <Text>{story}</Text>
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
                <Image
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
    </SafeAreaView>
  );
};

export default CrimeStoryDetailScreen;
