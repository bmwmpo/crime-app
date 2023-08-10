import { auth } from "../config/firebase_config";
import { updateProfile } from "firebase/auth";
import { getDocs, query, where } from "firebase/firestore";

//Update new user profile in firebase
const setNewUserProfile = async (username) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName: username.trim().toLowerCase(),
    });
  } catch (err) {
    console.log(err);
  }
};

//Verify if the username is already in use
const duplicatedUsername = async (
  collectionRef,
  newUsername,
  setValidNewUsername
) => {
  const trimUsername = newUsername.trim();
  const capitalizeUsername =
    trimUsername[0].toUpperCase() +
    trimUsername.toLowerCase().substring(1, trimUsername.length);

  try {
    const filter = where("username", "==", capitalizeUsername);

    const q = query(collectionRef, filter);

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs;

    //if a document with the given username is found, then return false
    if (documents.length > 0) {
      setValidNewUsername(false);
      return true;
    } else {
      setValidNewUsername(true);
      return false;
    }
  } catch (err) {
    console.log("username error:", err);
    return true;
  }
};

export { setNewUserProfile, duplicatedUsername };
