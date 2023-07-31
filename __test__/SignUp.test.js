import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "../screen/LogInSignUp/SignUpScreen";
import { PaperProvider } from "react-native-paper";
import { render, screen, fireEvent } from "@testing-library/react-native";
import {
  isValidPasswordLength,
  isEmailAddressEmpty,
  isPasswordEmpty,
  isUsernameEmpty,
  isValidEmailAddress,
} from "../functions/LogInSignUp";

//SignUp screen uniting testing
describe("Test SignUp Screen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("email text should change properly", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    //email textInput
    const emailTextInput = screen.getByTestId("Email");

    //change text
    fireEvent.changeText(emailTextInput, "cc@gmail.com");
    expect(emailTextInput.props.value).toBe("cc@gmail.com");
  });

  test("password text should change properly", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    //password textInput
    const passwordTextInput = screen.getByTestId("Password");

    //change text
    fireEvent.changeText(passwordTextInput, "123123");
    expect(passwordTextInput.props.value).toBe("123123");
  });

  test("username text should change properly", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    //username textInput
    const usernameTextInput = screen.getByTestId("Username");

    //change text
    fireEvent.changeText(usernameTextInput, "Jansen");
    expect(usernameTextInput.props.value).toBe("Jansen");
  });

  test("password length validation: password length >= 6", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    const passwordTextInput = screen.getByTestId("Password");

    //valid length
    fireEvent.changeText(passwordTextInput, "123456");
    expect(isValidPasswordLength(passwordTextInput.props.value)).toBeTruthy();
  });

  test("password length validation: password length < 6", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    const passwordTextInput = screen.getByTestId("Password");

    //invalid length
    fireEvent.changeText(passwordTextInput, "123");
    expect(isValidPasswordLength(passwordTextInput.props.value)).toBeFalsy();
  });

  test("email address validation: should accept the email address", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    const emailTextInput = screen.getByTestId("Email");

    //valid email address
    fireEvent.changeText(emailTextInput, "abc@gmail.com");
    expect(isValidEmailAddress(emailTextInput.props.value)).toBeTruthy();
  });

  test("email address validation: should not accept invalid email address", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );

    const emailTextInput = screen.getByTestId("Email");

    //valid email address
    fireEvent.changeText(emailTextInput, "abcdsfsd.com");
    expect(isValidEmailAddress(emailTextInput.props.value)).toBeFalsy();
  });

  test("reset email button: email should be empty", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );
    //email textInput
    const emailTextInput = screen.getByTestId("Email");
    const resetButton = screen.getByTestId("ResetEmail");

    //email should not be empty
    fireEvent.changeText(emailTextInput, "123456");
    expect(emailTextInput.props.value).toBe("123456");

    //email should empty
    fireEvent.press(resetButton);
    expect(isEmailAddressEmpty(emailTextInput.props.value)).toBeTruthy();
  });

  test("reset username button: username should be empty", () => {
    render(
      <PaperProvider>
        <SignUpScreen />
      </PaperProvider>
    );
    //email textInput
    const usernameTextInput = screen.getByTestId("Username");
    const resetButton = screen.getByTestId("ResetUsername");

    //username should not be empty
    fireEvent.changeText(usernameTextInput, "jansen");
    expect(usernameTextInput.props.value).toBe("jansen");

    //username should empty
    fireEvent.press(resetButton);
    expect(isUsernameEmpty(usernameTextInput.props.value)).toBeTruthy();
  });
});
