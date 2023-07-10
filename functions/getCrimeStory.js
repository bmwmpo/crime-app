import { storage } from "../config/firebase_config";
import { ref, getDownloadURL } from "firebase/storage";
import { onSnapshot } from "firebase/firestore";

//retrieve and update the voting status from Firestore for a specific crime story 
const retreivePhotoFromFirebaseStorage = async (setPhotoUri, postingData) => {
  setPhotoUri([]);
  try {
    for (photo of postingData.photo) {
      const photoRef = ref(storage, photo);
      const source = await getDownloadURL(photoRef);

      setPhotoUri((pre) => [...pre, { uri: source }]);
    }
  } catch (err) {
    console.log(err);
  }
};

//get crime story publisher info
const getUserData = (userDocRef, setUserAvatarColor, setCreator) => {
  onSnapshot(userDocRef, (snapshot) => {
    setUserAvatarColor(snapshot.data().preference.avatarColor);
    setCreator(snapshot.data().username);
  });
};

export { retreivePhotoFromFirebaseStorage, getUserData };
