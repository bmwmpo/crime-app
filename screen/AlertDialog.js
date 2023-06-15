import { Text, Dialog, Portal, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import styleSheet from "../assets/StyleSheet";
import EnumString from "../assets/EnumString";

//error dialog
const LogInFailedDialog = ({ hideDialog, showDialog, errorMessage }) => {
  return (
    <Portal>
      <Dialog visible={showDialog} onDismiss={hideDialog}>
        <Dialog.Title>
          <Icon
            name="close-circle"
            color={styleSheet.errorTextStyle.color}
            size={30}
          />
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="titleMedium">{errorMessage}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Try again</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

//success dialog
const SendResetPasswordDialog = ({
  hideDialog,
  showDialog,
  message,
  title,
}) => {
  return (
    <Portal>
      <Dialog visible={showDialog} onDismiss={hideDialog}>
        <Dialog.Title>
          <Text variant="titleLarge">{title}</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="titleMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Continue</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

//log out dialog
const LogOutConfirmDialog = ({ hideDialog, showDialog, logOut }) => {
  return (
    <Portal>
      <Dialog visible={showDialog} onDismiss={hideDialog}>
        <Dialog.Title>
          <Text variant="titleLarge">Log out</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="titleMedium">{EnumString.logOutMsg}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button
            mode="contained"
            buttonColor={styleSheet.errorTextStyle.color}
            onPress={logOut}
          >
            Log out
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export { LogInFailedDialog, SendResetPasswordDialog, LogOutConfirmDialog };