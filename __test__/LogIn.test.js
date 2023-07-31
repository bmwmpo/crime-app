import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import UserLogInSignUpStack from "../navigation/UserLogInSignUpStack";
import { render, screen, fireEvent } from "@testing-library/react-native";
import {
  isValidEmailAddress,
  isEmailAddressEmpty,
  isPasswordEmpty,
} from "../functions/LogInSignUp";

//Login screen uniting testing
describe("Test Login Screen", () => {
  // beforeEach(() => {
  //   jest.useFakeTimers();
  // });

  test("email text should change properly", async () => {
    render(
      <PaperProvider>
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
      </PaperProvider>
    );

    //email textInput
    const emailTextInput = await screen.getByTestId("Email");

    //change text
    fireEvent.changeText(emailTextInput, "cc@gmail.com");
    expect(emailTextInput.props.value).toBe("cc@gmail.com");
  });

  test("password text should change properly", async () => {
    render(
      <PaperProvider>
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
      </PaperProvider>
    );

    //email textInput
    const passwordTextInput = await screen.getByTestId("Password");

    //change text
    fireEvent.changeText(passwordTextInput, "123123");
    expect(passwordTextInput.props.value).toBe("123123");
  });

  test("click SignUp button should navigate to SignUp screen", async () => {
    render(
      <PaperProvider>
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
      </PaperProvider>
    );

    //to signUp button
    const toSignUpScreenButton = await screen.getByTestId("ToSignUp");
    //press the signUp button
    fireEvent(toSignUpScreenButton, "press");

    const header = await screen.getByText("Welcome to Toronro Crime Tracker");
    expect(header).not.toBeNull();
  });

  test("email address validation: should accept the email address", () => {
    render(
      <PaperProvider>
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
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
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
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
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
      </PaperProvider>
    );

    //email textInput
    const emailTextInput = screen.getByTestId("Email");
    const resetButton = screen.getByTestId("ResetEmail");

    //email should empty
    fireEvent.changeText(emailTextInput, "123456");
    expect(emailTextInput.props.value).toBe("123456");

    fireEvent.press(resetButton);
    expect(isEmailAddressEmpty(emailTextInput.props.value)).toBeTruthy();
  });

  //   test("AllCrimeStories", async () => {
  //     render(<AllCrimeStoriesScreen />);

  //     expect(screen.toJSON()).toMatchSnapshot();
  //   });
  //   test("test logIn submit", async () => {
  //     const logInFun = jest.fn();
  //     render(
  //       <PaperProvider>
  //         <NavigationContainer>
  //           <UserLogInSignUpStack />
  //         </NavigationContainer>
  //       </PaperProvider>
  //     );

  //     //email and password textInput
  //     const emailTextInput = await screen.getByTestId("Email");
  //     const passwordTextInput = await screen.getByTestId("Password");

  //     //change text
  //     fireEvent.changeText(emailTextInput, "cc@gmail.com");
  //     fireEvent.changeText(passwordTextInput, "123123");

  //     const logInButton = await screen.getByTestId("LogIn");
  //   });
});
