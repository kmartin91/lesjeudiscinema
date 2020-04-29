import * as app from 'firebase/app';
import 'firebase/firestore';
import {
  getFirebaseApiKey,
  getFirebaseAuth,
  getFirebaseProjectId,
  getFirebaseStorageBucket,
  getFirebaseMessagingSenderId,
  getFirebaseDatabaseURL,
} from '../shared/utils';

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

export const getMoviesPropals = (propalId = '1') =>
  db.collection('weeks').doc(propalId).collection('propositions').get();

export const streamMoviesPropals = (propalId, observer) => {
  return db.collection('weeks').doc(propalId).collection('propositions').onSnapshot(observer);
};

export const getMoviesVote = (propalId = '1') =>
  db.collection('weeks').doc(propalId).collection('votes').get();

export const streamMoviesVotes = (propalId, observer) => {
  return db.collection('weeks').doc(propalId).collection('votes').onSnapshot(observer);
};

export const addPropal = async (title, propalId, user, poster) =>
  getMoviesPropals(propalId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((propositionsListItems) =>
      propositionsListItems.find(
        (propositionListItem) =>
          propositionListItem.data().title.toLowerCase() === title.toLowerCase(),
      ),
    )
    .then((matchingItem) => {
      if (!matchingItem) {
        return db.collection('weeks').doc(propalId).collection('propositions').add({
          title,
          user,
          poster,
        });
      }
      throw new Error('duplicate-item-error');
    })
    .catch((err) => {
      return err;
    });

export const addOrRemoveVote = async (title, propalId, user, canVote) => {
  return getMoviesVote(propalId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((propositionsListItems) =>
      propositionsListItems.find(
        (propositionListItem) =>
          propositionListItem.data().title.toLowerCase() === title.toLowerCase() &&
          propositionListItem.data().user.toLowerCase() === user.toLowerCase(),
      ),
    )
    .then((matchingItem) => {
      if (!matchingItem) {
        if (canVote) {
          return db.collection('weeks').doc(propalId).collection('votes').add({
            title,
            user,
          });
        }
      } else {
        const { id } = matchingItem;
        return db.collection('weeks').doc(propalId).collection('votes').doc(id).delete();
      }
    });
};
