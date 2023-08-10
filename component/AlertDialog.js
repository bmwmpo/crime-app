import { Text, Dialog, Portal, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import styleSheet from "../assets/StyleSheet";
import EnumString from "../assets/EnumString";

//error dialog
const FailDialog = ({ hideDialog, showDialog, errorMessage }) => {
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
const SuccessDialog = ({ hideDialog, showDialog, message, title }) => {
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

//Request log in dialog
const LogInDialog = ({
  hideDialog,
  navigateToLogIn,
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
          <Button
            onPress={() => {
              hideDialog();
              navigateToLogIn();
            }}
          >
            Log in/Sign up
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

//comfirm dialog
const ConfirmDialog = ({ hideDialog, showDialog, action, title, msg }) => {
  return (
    <Portal>
      <Dialog visible={showDialog} onDismiss={hideDialog}>
        <Dialog.Title>
          <Text variant="titleLarge">{ title}</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="titleMedium">{msg}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button
            mode="contained"
            buttonColor={styleSheet.errorTextStyle.color}
            onPress={action}
          >
            {title}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export { FailDialog, SuccessDialog, ConfirmDialog, LogInDialog };
