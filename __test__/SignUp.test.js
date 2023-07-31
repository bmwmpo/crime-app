import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "../screen/LogInSignUp/SignUpScreen";
import { PaperProvider } from "react-native-paper";
import { render, screen, fireEvent } from "@testing-library/react-native";
import {
  isValidPasswordLength,
  isEmailAddressEmpty,
  isPasswordEmpty,
  isUsernameEmpty,
} from "../functions/LogInSignUp";

describe("Test SignUp Screen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("test signUp textInput change", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    //email, password, and username textInput
    const emailTextInput = screen.getByTestId("Email");
    const passwordTextInput = screen.getByTestId("Password");
    const usernameTextInput = screen.getByTestId("Username");

    //change text
    fireEvent.changeText(emailTextInput, "cc@gmail.com");
    fireEvent.changeText(passwordTextInput, "123123");
    fireEvent.changeText(usernameTextInput, "testing");

    expect(emailTextInput.props.value).toBe("cc@gmail.com");
    expect(passwordTextInput.props.value).toBe("123123");
    expect(usernameTextInput.props.value).toBe("testing");
  });

  test("test password length", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    const passwordTextInput = screen.getByTestId("Password");

    //valid length
    fireEvent.changeText(passwordTextInput, "123456");
    expect(isValidPasswordLength(passwordTextInput.props.value)).toBeTruthy();

    //invalid length
    fireEvent.changeText(passwordTextInput, "123");
    expect(isValidPasswordLength(passwordTextInput.props.value)).toBeFalsy();
  });

  test("test are email, password, and username empty", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    const emailTextInput = screen.getByTestId('Email');
    const passwordTextInput = screen.getByTestId('Password');
    const usernameTextInput = screen.getByTestId('Username');

    //all fields are empty
    fireEvent.changeText(emailTextInput, '');
    fireEvent.changeText(passwordTextInput, '');
    fireEvent.changeText(usernameTextInput, '');

    expect(isEmailAddressEmpty(emailTextInput.props.value)).toBeTruthy();
    expect(isPasswordEmpty(passwordTextInput.props.value)).toBeTruthy();
    expect(isUsernameEmpty(usernameTextInput.props.value)).toBeTruthy();
  });
});
