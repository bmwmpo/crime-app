export default EnumString = {
    signUpFailed:'SignUp Failed',
    emailRegex: /^[\w\.\-\_\&\*\&\%\$\#\!]+@[\w]+\.[\w]{2,4}$/,
    resetPasswordAlertTitle: 'Password reset email sent',
    resetPasswordMsg: (email) => `We sent instruction to change your password to ${ email }, please check both your inbox and spam folder.`,
    invaildEmaillPassword: 'Invalid email address or password',
    emailAlreadyInUse: 'Email is already registered',
    
};

