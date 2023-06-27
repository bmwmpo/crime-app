import { useState, useEffect } from "react";
import { auth } from "../config/firebase_config";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebase_config";
import { collection, getDocs, query, where } from "firebase/firestore";
import DrawerNavigation from "../navigation/DrawerNavigation";
import useStore from "../zustand/store";
import LoadingScreen from "./LoadingScreen";

//main screen
const HomeScreen = () => {
  const { setSignedInUser, setLogOutUser } = useStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  //get user profile from firestore
  const getUserProfile = async (email) => {
    setIsLoading(true);

    //wait while the user information is being saved in firestore
    //then get user doc from firestore
    setTimeout(async () => {
      try {
        const collectionRef = collection(db, "UserInfo");
        const filter = where("email", "==", email);
        const q = query(collectionRef, filter);

        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs;

        //user document is found
        if (documents.length > 0) {
          const email = documents[0].data().email;
          const username = documents[0].data().username;
          const docID = documents[0].data().docID;
          const userId = documents[0].data().userId;
          const preference = documents[0].data().preference
          
          //set the user state
          setSignedInUser(email, username, docID, userId, preference.darkMode);
        } else {
          setLogOutUser();
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  //get the currently signed-in user
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserProfile(user.email);
      } else {
        setLogOutUser();
      }
    });
  }, []);

  return isLoading ? <LoadingScreen /> : <DrawerNavigation />;
};

export default HomeScreen;
