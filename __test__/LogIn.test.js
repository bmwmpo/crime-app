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

  test("test login textInput change", async () => {
    render(
      <PaperProvider>
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
      </PaperProvider>
    );

    //email and password textInput
    const emailTextInput = await screen.getByTestId("Email");
    const passwordTextInput = await screen.getByTestId("Password");

    //screen title header
    const header = screen.getByText("Log in to Toronto Crime Tracker");

    //change text
    fireEvent.changeText(emailTextInput, "cc@gmail.com");
    fireEvent.changeText(passwordTextInput, "123123");

    expect(emailTextInput.props.value).toBe("cc@gmail.com");
    expect(passwordTextInput.props.value).toBe("123123");
    expect(header).not.toBeNull();
  });

  test("test navigation: Log in screen to Sign up screen", async () => {
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

  test("test email validation", () => {
    render(
      <PaperProvider>
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
      </PaperProvider>
    );

    const emailTextInput = screen.getByTestId("Email");

    //invalid email address
    fireEvent.changeText(emailTextInput, "dsgsdgs");
    expect(isValidEmailAddress(emailTextInput.props.value)).toBeFalsy();

    //valid email address
    fireEvent.changeText(emailTextInput, "abc@gmail.com");
    expect(isValidEmailAddress(emailTextInput.props.value)).toBeTruthy();
  });

  test("test are email and password empty", () => {
    render(
      <PaperProvider>
        <NavigationContainer>
          <UserLogInSignUpStack />
        </NavigationContainer>
      </PaperProvider>
    );

    //email and password textInput
    const emailTextInput = screen.getByTestId("Email");
    const passwordTextInput = screen.getByTestId("Password");
    
    //both email and password are empty
    fireEvent.changeText(emailTextInput, "");
    fireEvent.changeText(passwordTextInput, "");

    expect(isEmailAddressEmpty(emailTextInput.props.value)).toBeTruthy();
    expect(isPasswordEmpty(passwordTextInput.props.value)).toBeTruthy();
   
    //password is empty
    fireEvent.changeText(emailTextInput, "cc@gmail.com");
    fireEvent.changeText(passwordTextInput, "");

    expect(isEmailAddressEmpty(emailTextInput.props.value)).toBeFalsy();
    expect(isPasswordEmpty(passwordTextInput.props.value)).toBeTruthy();

    //email is empty
    fireEvent.changeText(emailTextInput, "");
    fireEvent.changeText(passwordTextInput, "123123");

    expect(isEmailAddressEmpty(emailTextInput.props.value)).toBeTruthy();
    expect(isPasswordEmpty(passwordTextInput.props.value)).toBeFalsy();

    //both email and password are not empty
    fireEvent.changeText(emailTextInput, "cc@gmail.com");
    fireEvent.changeText(passwordTextInput, "123123");

    expect(isEmailAddressEmpty(emailTextInput.props.value)).toBeFalsy();
    expect(isPasswordEmpty(passwordTextInput.props.value)).toBeFalsy();
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
