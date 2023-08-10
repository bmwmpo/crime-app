export default EnumString = {
  signUpFailed: "SignUp Failed",
  emailRegex: /^[\w\.\-\_\&\*\&\%\$\#\!]+@[\w]+\.[\w]{2,4}$/,
  resetPasswordAlertTitle: "Password reset email sent",
  resetPasswordMsg: (email) =>
    `We sent instruction to change your password to ${email}, please check both your inbox and spam folder.`,
  invalidEmaillPassword: "Invalid email address or password",
  emailAlreadyInUse: "Email is already registered",
  emailIsMissing: "Email address is missing",
  invalidEmail: "Not a valid email address",
  welcomeMsg: (username) => `Weclome ${username}`,
  permissionMsg:
    "Please go to Setting > Privacy to grant the necessary permission",
  logOutTitle: "Log out",
  logOutMsg: "Are you sure you want to log out?",
  thankYouMsg:
    "Thank you for your interest in sharing the criminal information you have",
  postingCollection: "Postings",
  commentsSubCollection: "Comments",
  userInfoCollection: "UserInfo",
  logInMsg: "Please log in or create an account to continue",
  logInTilte: "Are you interested?",
  deleteStoryTitle: "Delete",
  deleteStoryMsg: "Are you sure you want to delete?",
  emptyCrimeStoriesList: " Report any crime you witness",
  emptyCommentsList: "Feel free to leave a comment on any crime story",
  initLocationAddress: "pinpoint the crime scene using the map",
};

const SHARE_URL = "exp://10.0.0.219:19000/--/crimeapp://CrimeDetail/";

const BG_IMG =
  "https://lh3.googleusercontent.com/p/AF1QipPCsEaUL6f2zgNEUMx14RwI3V4Rj8tODwPqPPz-=s680-w680-h510";

const BG_IMG_DARK = "https://images.pexels.com/photos/7003059/pexels-photo-7003059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const LIVE_CALL_API =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/ArcGIS/rest/services/C4S_Public_NoGO/FeatureServer/0/query?where=OBJECTID+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=OCCURRENCE_TIME+DESC&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";

const avatarColorSet = [
  "#1F45FC",
  "#0909FF",
  "#56A5EC",
  "#0000A5",
  "#00BFFF",
  "#50EBEC",
  "#008B8B",
  "#01F9C6",
  "#00A36C",
  "#006A4E",
  "#98FF98",
  "#3CB371",
  "#FFD801",
  "#FFDF00",
  "#FFA500",
  "#FBB117",
  "#FF5F1F",
  "#FF4500",
  "#FF0000",
  "#9F000F",
  "#800000",
  "#F52887",
  "#DC143C",
  "#FF1493",
  "#E30B5D",
  "#FF00FF",
  "#9400D3",
  "#8B008B",
  "#8A2BE2",
  "#9E7BFF",
];

export { avatarColorSet, SHARE_URL, BG_IMG, LIVE_CALL_API, BG_IMG_DARK };
