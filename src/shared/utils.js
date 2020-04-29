const getPasswordSite = () => process.env.SITE_PASSWORD;
const getFirebaseApiKey = () => process.env.FIREBASE_API_KEY;
const getFirebaseAuth = () => process.env.FIREBASE_AUTH_DOMAIN;
const getFirebaseStorageBucket = () => process.env.FIREBASE_STORAGE_BUCKET;
const getFirebaseProjectId = () => process.env.FIREBASE_PROJECT_ID;
const getFirebaseMessagingSenderId = () => process.env.FIREBASE_MESSAGING_SENDER_ID;
const getFirebaseAppId = () => process.env.FIREBASE_APP_ID;
const getFirebaseMeasurementId = () => process.env.FIREBASE_MEASUREMENT_ID;
const getFirebaseDatabaseURL = () => process.env.FIREBASE_DATABASE_URL;
const getWeekNumber = () => process.env.WEEK_NUMBER;
const getMaxPropal = () => process.env.MAX_PROPAL;
const getMaxVote = () => process.env.MAX_VOTE;
const getMovieApi = () => process.env.MOVIE_DB_API;
const getMovieImgUrl = () => process.env.MOVIE_DB_IMG_URL;

export {
  getPasswordSite,
  getFirebaseApiKey,
  getFirebaseAuth,
  getFirebaseStorageBucket,
  getFirebaseProjectId,
  getFirebaseMessagingSenderId,
  getFirebaseAppId,
  getFirebaseMeasurementId,
  getFirebaseDatabaseURL,
  getWeekNumber,
  getMaxPropal,
  getMaxVote,
  getMovieApi,
  getMovieImgUrl,
};
