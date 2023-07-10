import { SafeAreaView, Dimensions, TouchableOpacity, View } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import EnumString, { avatarColorSet } from "../../assets/EnumString";
import { db } from "../../config/firebase_config";
import { doc, updateDoc } from "firebase/firestore";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";

//edit avatar screen
const EditAvatarScreen = ({ navigation }) => {
  //current user info
  const {
    user: currentUser,
    preference: { darkMode, avatarColor, autoDarkMode },
    docID,
    setAvatarColor,
  } = useStore((state) => state);

  //state values
  const [isLoading, setIsLoading] = useState(false);
  const [newAvatarColor, setNewAvatarColor] = useState(avatarColor);
  const [selected, setSelected] = useState(avatarColorSet.indexOf(avatarColor));

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const avatarLabel = currentUser.username.substring(0, 1).toUpperCase();

  //update user avatar color in firestore and useStore
  const updateUserAvatarColor = async () => {
    const docRef = doc(db, EnumString.userInfoCollection, docID);

    setIsLoading(true);
    try {
      await updateDoc(docRef, {
        preference: { darkMode, avatarColor: newAvatarColor, autoDarkMode },
      });

      //update the useStore
      setAvatarColor(newAvatarColor);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styleSheet.container, styleSheet.flex_1]}>
      <Text
        variant="headlineSmall"
        style={[textColor, styleSheet.margin_Vertical]}
      >
        Choose an Avatar Color
      </Text>
      {/* Avatar */}
      <Avatar.Text
        label={avatarLabel}
        size={80}
        style={[
          { backgroundColor: newAvatarColor },
          styleSheet.margin_Vertical,
        ]}
      />
      {/* color set */}
      <View
        style={[
          styleSheet.flexRowContainer,
          { flexWrap: "wrap" },
          styleSheet.margin_Vertical,
        ]}
      >
        {/* color set */}
        {avatarColorSet.map((item, index) => {
          const selectedIndex = selected === index;
          return (
            <TouchableOpacity
              key={item}
              style={[
                {
                  backgroundColor: item,
                  height: windowHeight * 0.04,
                  width: windowWidth * 0.08,
                  borderRadius: 9999,
                  margin: "1%",
                },
                selectedIndex && {
                  borderWidth: 3.5,
                  borderColor: textColor.color,
                },
              ]}
              onPress={() => {
                setSelected(index);
                setNewAvatarColor(avatarColorSet[index]);
              }}
            ></TouchableOpacity>
          );
        })}
      </View>
      {/* update button */}
      <Button
        title="Update"
        buttonStyle={[styleSheet.buttonStyle, { width: windowWidth * 0.9 }]}
        titleStyle={styleSheet.buttonTextStyle}
        loading={isLoading}
        onPress={updateUserAvatarColor}
      />
    </SafeAreaView>
  );
};

export default EditAvatarScreen;
