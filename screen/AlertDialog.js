import { Text, Dialog, Portal, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import styleSheet from "../assets/StyleSheet";

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

const SendResetPasswordDialog = ({ hideDialog, showDialog, message, title }) => {
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

export { LogInFailedDialog, SendResetPasswordDialog };
