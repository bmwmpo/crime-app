import { View, Dimensions, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { TextInput, Text } from "react-native-paper";
import { Button } from "@rneui/themed";
import { auth } from "../../config/firebase_config";
import { sendPasswordResetEmail } from "firebase/auth";
import { SuccessDialog } from "../../component/AlertDialog";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";
import EnumString from "../../assets/EnumString";

//change password screen
const ChangePasswordScreen = () => {
  const {
    user: { email },
  } = useStore((state) => state);

  const [showDialog, setShowDialog] = useState(false);

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const inputTextBackGroundColor = isDarkMode
    ? styleSheet.darkModeTextInputBackGroundColor
    : styleSheet.lightModeTextInputBackGroundColor;
  const windowWidth = Dimensions.get("window").width;

  const hideDialog = () => setShowDialog(false);

  //handle change password 
  const updateUserPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setShowDialog(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView style={styleSheet.container}>
      <SuccessDialog
        hideDialog={hideDialog}
        showDialog={showDialog}
        message={EnumString.resetPasswordMsg(email)}
        title={EnumString.resetPasswordAlertTitle}
      />
      <View style={[styleSheet.formatContainer, { marginTop: "5%" }]}>
        <Text variant="titleMedium" style={textColor}>
          Email
        </Text>
        {/* username textInput */}
        <TextInput
          style={[styleSheet.inputStyle, inputTextBackGroundColor]}
          disabled={true}
          placeholder="email"
          value={email}
        />
        {/* update button */}
        <Button
          title="Send a password change email"
          buttonStyle={[styleSheet.buttonStyle, { width: windowWidth * 0.9 }]}
          titleStyle={styleSheet.buttonTextStyle}
          onPress={updateUserPassword}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordScreen;
