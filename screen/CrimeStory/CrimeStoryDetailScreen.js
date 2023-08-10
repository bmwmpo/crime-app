import {
  View,
  Dimensions,
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
  Share,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { Text, Avatar, Appbar, Button, Card } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { db } from "../../config/firebase_config";
import {
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  collection,
  getDocs,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";
import { LogInDialog } from "../../component/AlertDialog";
import {
  getCountSuffix,
  updateVoteCount,
  getVoteState,
  updateVoters,
  getRealTimeUpdate,
} from "../../functions/voting";
import { MemoizedCommentItem } from "../../component/CommentItem";
import {
  retreivePhotoFromFirebaseStorage,
  getUserData,
} from "../../functions/getCrimeStory";
import { onShare } from "../../functions/shareLink";
import { BottomSheet, Icon } from "@rneui/themed";
import MapView, { Marker } from "react-native-maps";
import ImageView from "react-native-image-viewing";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";
import EnumString from "../../assets/EnumString";
import LoadingScreen from "../LoadingScreen";
import PopUpMap from "../../component/PopUpMap";

//Crime story detail
const CrimeStoryDetailScreen = ({ route, navigation }) => {
  //current user infor
  const { user: currentUser, signIn } = useStore((state) => state);

  //state values
  const [commentList, setCommentList] = useState([]);
  const [photoUri, setPhotoUri] = useState([]);
  const [showImageView, setShowImageView] = useState({
    visible: false,
    index: 0,
  });
  const [upVoteCount, setUpVoteCount] = useState(0);
  const [voteStatus, setVoteStatus] = useState(false);
  const [votersList, setVoterslist] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAvatarColor, setUserAvatarColor] = useState("#9400D3");
  const [creator, setCreator] = useState("");
  const [story, setStory] = useState("");
  const [postingDateTime, setPostingDateTime] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [initRegion, setInitRegion] = useState({
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [showMapView, setShowMapView] = useState(false);

  //posting data
  const { postingId } = route.params;

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const docRef = doc(db, EnumString.postingCollection, postingId);

  const showHideMapView = () => setShowMapView(!showMapView);

  //navigate to CommentScreen
  const toCommentScreen = () => {
    if (signIn) navigation.navigate("Comment", { postingId });
    else setShowDialog(true);
  };

  //to log in screen
  const toLogInScreen = () =>
    navigation.navigate("SignInSignUp", { screen: "LogIn" });

  const hideDialog = () => setShowDialog(false);

  //trigger the upvote
  const onUpVote = () => {
    if (signIn) {
      updateVoteCount(voteStatus, upVoteCount, docRef);
      updateVoters(
        voteStatus,
        setVoteStatus,
        votersList,
        docRef,
        currentUser.userId
      );
    } else {
      setShowDialog(true);
    }
  };

  //get real time comment list with firestore
  const getComments = async () => {
    const subCollectionRef = collection(
      db,
      EnumString.postingCollection,
      postingId,
      EnumString.commentsSubCollection
    );

    const q = query(subCollectionRef, orderBy("replyDateTime"));
    let list = [];

    onSnapshot(q, (snapshot) => {
      //handle docChange
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          list.unshift(change.doc.data());
        }
        //update the commentId for the new comment othwewise commentId is underfined
        else if (change.type === "modified") {
          for (let comment of list)
            if (
              comment.replyDateTime.toDate().getTime() ===
              change.doc.data().replyDateTime.toDate().getTime()
            )
              comment.commentId = change.doc.data().commentId;
        } else if (change.type === "removed") {
          list = list.filter(
            (item) => item.commentId !== change.doc.data().commentId
          );
        }
      });
      setCommentList(list);
    });
  };
  
  //retreive crime story data from firestore
  const getCrimeStoryData = async () => {
    const docRef = doc(db, EnumString.postingCollection, postingId);

    try {
      const document = await getDoc(docRef);

      if (document.exists()) {
        //console.log(document.data());
        // setCreatorDocRef(document.data().user);
        setStory(document.data().story);
        setPostingDateTime(
          document.data().postingDateTime.toDate().toLocaleString()
        );
        setLocationAddress(document.data().locationAddress);
        setInitRegion((pre) => ({ ...pre, ...document.data().coords }));
        retreivePhotoFromFirebaseStorage(setPhotoUri, document.data());
        getUserData(document.data().user, setUserAvatarColor, setCreator);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get the real time udapte with firestore with the associated posting
  useEffect(() => {
    setIsLoading(true);
    getRealTimeUpdate(docRef, setVoterslist, setUpVoteCount);
    getComments();
    getCrimeStoryData();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    console.log(navigation.getState().routes[0]);
  }, [postingId]);

  //get the current user vote state
  useEffect(() => {
    getVoteState(votersList, setVoteStatus, currentUser.userId);
  }, [votersList, upVoteCount]);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView
      style={[styleSheet.flex_1, styleSheet.container, backgroundColor]}
    >
      {/* show the dialog if the user is not logged in */}
      <LogInDialog
        hideDialog={hideDialog}
        showDialog={showDialog}
        navigateToLogIn={toLogInScreen}
        message={EnumString.logInMsg}
        title={EnumString.logInTilte}
      />
      {/* full image view */}
      <ImageView
        images={photoUri}
        imageIndex={showImageView.index}
        visible={showImageView.visible}
        onRequestClose={() =>
          setShowImageView((pre) => ({ ...pre, visible: false }))
        }
      />
      {/* Map view */}
      <PopUpMap
        showMapView={showMapView}
        showHideMapView={showHideMapView}
        initRegion={initRegion}
        location={locationAddress}
        useDraggableMaker={false}
      />
      <ScrollView
        style={[
          { padding: "2%", width: windowWidth, height: windowHeight * 0.75 },
          styleSheet.margin_Vertical,
          styleSheet.padding_Horizontal,
        ]}
        contentContainerStyle={styleSheet.flexStartContainer}
        nestedScrollEnabled={true}
      >
        {/* posting information: author, posting date, and time */}
        <View
          style={[
            styleSheet.flexRowContainer,
            styleSheet.flexSpaceBetweenStyle,
            styleSheet.margin_Vertical,
            { width: windowWidth * 0.7 },
          ]}
        >
          <Avatar.Text
            label={creator.substring(0, 1).toUpperCase()}
            size={45}
            style={[
              { backgroundColor: userAvatarColor },
              styleSheet.margin_Horizontal_right,
            ]}
          />
          {/* author */}
          <Text
            variant="labelLarge"
            style={[textColor, styleSheet.margin_Horizontal_right]}
          >
            {creator}
          </Text>
          {/* date and time */}
          <Text variant="labelLarge" style={textColor}>
            {postingDateTime}
          </Text>
        </View>
        {/* crime scene location */}
        <TouchableOpacity
          style={[styleSheet.flexRowContainer, styleSheet.alignCenter]}
          onPress={showHideMapView}
        >
          <Icon name="map" color={textColor.color} />
          <Card.Title
            title={locationAddress}
            titleNumberOfLines={5}
            titleStyle={[
              textColor,
              styleSheet.margin_Vertical,
              styleSheet.underLineTextStyle,
            ]}
          />
        </TouchableOpacity>
        {/* story */}
        <Text
          variant="titleLarge"
          style={[textColor, styleSheet.margin_Vertical]}
        >
          {story}
        </Text>
        {/* photo section */}
        {photoUri.length > 0 && (
          <View style={[styleSheet.flex_1, styleSheet.container]}>
            <FlatList
              horizontal
              style={{ width: windowWidth, height: windowHeight * 0.7 }}
              data={photoUri}
              keyExtractor={(item) => item.uri}
              ItemSeparatorComponent={() => (
                <View style={{ paddingRight: windowWidth * 0.1 }}></View>
              )}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    setShowImageView({ visible: true, index });
                  }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={{
                      width: windowWidth,
                      height: windowHeight * 0.7,
                    }}
                  />
                </Pressable>
              )}
            />
          </View>
        )}
      </ScrollView>
      {/* app bar */}
      <Appbar
        style={[
          styleSheet.width_100,
          { height: windowHeight * 0.06 },
          backgroundColor,
        ]}
      >
        {/* like */}
        <Appbar.Action
          icon={voteStatus ? "thumb-up" : "thumb-up-outline"}
          color={textColor.color}
          onPress={onUpVote}
        />
        <Text style={textColor}>{getCountSuffix(upVoteCount)}</Text>
        {/* share */}
        <Appbar.Action
          icon="share"
          onPress={() => onShare(postingId)}
          color={textColor.color}
        />
        {/* comment */}
        <View style={[styleSheet.flexEndStyle, { width: windowWidth * 0.9 }]}>
          <Button mode="contained" onPress={toCommentScreen}>
            Add a comment
          </Button>
        </View>
      </Appbar>
      {/* comments section */}
      {commentList.length === 0 ? (
        <Text variant="titleMedium" style={textColor}>
          Be the first one to respond
        </Text>
      ) : (
        <FlatList
          style={[{ height: windowHeight * 0.3, width: windowWidth }]}
          data={commentList}
          renderItem={({ item }) => (
            <MemoizedCommentItem
              key={item.commentId}
              commentData={item}
              postingId={postingId}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default CrimeStoryDetailScreen;
