import "react-native-gesture-handler";
import HomeScreen from "./screen/HomeScreen";
//to use toast in the app
import { RootSiblingParent } from "react-native-root-siblings";

import messaging from "@react-native-firebase/messaging";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import useStore from "./zustand/store";
import { db } from "./config/firebase_config";
import {
  collection,
  get,
  addDoc,
  doc,
  query,
  where,
  setDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import EnumString from "./assets/EnumString";

export default function App() {
  const { user: currentUser, signIn } = useStore((state) => state);
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    if (signIn) {
      if (requestUserPermission()) {
        messaging()
          .getToken()
          .then(async (token) => {
            const newData = {
              fcmToken: token
            };

            if (signIn) {
              const collectionRef = collection(db, "UserInfo");
              const q = query(collectionRef, where("userId", "==", currentUser.userId));
              const querySnapshot = await getDocs(q);
              const documents = querySnapshot.docs;
              if (documents.length > 0) {
                // Assuming there's only one matching document
                var docRef = querySnapshot.docs[0].ref;
                
              
                // Update the document
                await setDoc(docRef, { fcmToken: token }, { merge: true });
                console.log(13377)

                console.log("Document successfully updated:", doc.id);
              } else {
                console.log("No documents found with the specified field value.");
              }
            }

            console.log(token);
          });
      } else {
        console.log("failed to get token status", authStatus);
      }

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then(async (remoteMessage) => {
          if (remoteMessage) {
            console.log(
              "Notification caused app to open from quit state:",
              remoteMessage.notification
            );
          }
        });

      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log(
          "Notification caused app to open from background state:",
          remoteMessage.notification
        );
      });

      // Register background handler
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
      });

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        if (!signIn) {
          return;
        }
        console.log(JSON.stringify(remoteMessage))
        Alert.alert(
          JSON.stringify(remoteMessage.notification.title),
          JSON.stringify(remoteMessage.notification.body)
        );
      });
      return unsubscribe;
    }
  }, [signIn]);

  return (
    <RootSiblingParent>
      <HomeScreen />
    </RootSiblingParent>
  );
}
