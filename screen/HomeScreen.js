import { useState, useEffect } from "react";
import { auth } from "../config/firebase_config";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebase_config";
import { collection, getDocs, query, where } from "firebase/firestore";
import DrawerNavigation from "../navigation/DrawerNavigation";
import useStore from "../zustand/store";

//main screen
const HomeScreen = () => {
  const {setSignedInUser, setLogOutUser,  } = useStore(state => state);
    
    


  //get user profile from firestore
  const getUserProfile = (email) => {
    setTimeout(async () => {
      try {
        const collectionRef = collection(db, "UserInfo");
        const filter = where("email", "==", email);
        const q = query(collectionRef, filter);

        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs;

        console.log(documents.length);
        if (documents.length > 0)
        {
          const email = documents[0].data().email;
          const username = documents[0].data().username;

          setSignedInUser(email, username);

        } else
        {
          
          setLogOutUser();

        }
      } catch (err) {
        console.log(err);
      }
    }, 2000);
  };

  //get the currently signed-in user
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserProfile(user.email);


      } else
      {
        setLogOutUser();

      }
    });
  }, []);

  return (
      <DrawerNavigation />
  );
};

export default HomeScreen;
