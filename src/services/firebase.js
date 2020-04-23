import * as app from "firebase/app";
import "firebase/firestore";
import {
  getFirebaseApiKey,
  getFirebaseAuth,
  getFirebaseProjectId,
  getFirebaseStorageBucket,
  getFirebaseMessagingSenderId,
  getFirebaseDatabaseURL,
} from "../shared/utils";

const firebaseConfig = {
  projectId: getFirebaseProjectId(),
  storageBucket: getFirebaseStorageBucket(),
  messagingSenderId: getFirebaseMessagingSenderId(),
  apiKey: getFirebaseApiKey(),
  authDomain: getFirebaseAuth(),
  databaseURL: getFirebaseDatabaseURL(),
};
app.initializeApp(firebaseConfig);
const db = app.firestore();

export const getMoviesPropals = (propalId = "1") => {
  console.log({ propalId });
  return db.collection("weeks").doc(propalId).get();
};
