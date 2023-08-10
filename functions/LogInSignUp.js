//verify the email address format
const isValidEmailAddress = (newText) => {
  const regex = EnumString.emailRegex;

  return regex.test(newText.trim());
};

//check whether the email is empty or not
const isEmailAddressEmpty = (email) => email.trim() === "";

//check whether the password is empty or not
const isPasswordEmpty = (password) => password.trim() === "";

//check whether the username is empty or not
const isUsernameEmpty = (username) => username.trim() === "";

//verify the password length
const isValidPasswordLength = (password) => password.length >= 6;

export {
  isValidEmailAddress,
  isEmailAddressEmpty,
  isPasswordEmpty,
  isUsernameEmpty,
  isValidPasswordLength,
};
