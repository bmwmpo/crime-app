import { storage, db } from "../config/firebase_config";
import { ref, getDownloadURL } from "firebase/storage";
import {
  onSnapshot,
  deleteDoc,
  doc,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import EnumString from "../assets/EnumString";

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

//delete crime story from firestore
const deleteCrimeStory = async (postingId, useDocId) => {
  const docRef = doc(db, EnumString.postingCollection, postingId);
  const userDocRef = doc(db, EnumString.userInfoCollection, useDocId);
  try {
    //delete crime story from Postings collection
    await deleteDoc(docRef);
    //remove deleted posting doc ref from 'yourStory' field from userInfo
    await updateDoc(userDocRef, { yourStory: arrayRemove(docRef) });
  } catch (err) {
    console.log(err);
  }
};

//delete comment from firestore
const deleteComment = async (postingRef, commentId, useDocId) => {
  const commentRef = doc(
    db,
    EnumString.postingCollection,
    postingRef.id,
    EnumString.commentsSubCollection,
    commentId
  );

  //const postingRef = doc(db, EnumString.postingCollection, postingId);
  const docRef = {
    commentRef,
    postingRef,
  };

  const userDocRef = doc(db, EnumString.userInfoCollection, useDocId);
  try {
    //delete comment from Comment sub collection
    await deleteDoc(commentRef);
    //remove deleted comment doc ref from 'yourComments' field from userInfo
    await updateDoc(userDocRef, { yourComments: arrayRemove(docRef) });
  } catch (err) {
    console.log(err);
  }
};

export {
  retreivePhotoFromFirebaseStorage,
  getUserData,
  deleteCrimeStory,
  deleteComment,
};
