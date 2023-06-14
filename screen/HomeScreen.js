import { useState, useEffect } from "react";
import { auth } from "../config/firebase_config";
import { onAuthStateChanged } from "firebase/auth";
import DrawerNavigation from "../navigation/DrawerNavigation";
import UserContext from "../UserContext.js";

//main screen
const HomeScreen = () => {
  const [currentUser, setCurrentuser] = useState(false);

  //get the currently signed-in user
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) setCurrentuser(true);
      else setCurrentuser(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ currentUser }}>
      <DrawerNavigation />
    </UserContext.Provider>
  );
};

export default HomeScreen;
