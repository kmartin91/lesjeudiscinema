const getPasswordSite = () => process.env.SITE_PASSWORD;
const getFirebaseApiKey = () => process.env.FIREBASE_API_KEY;
const getFirebaseAuth = () => process.env.FIREBASE_AUTH_DOMAIN;
const getFirebaseStorageBucket = () => process.env.FIREBASE_STORAGE_BUCKET;
const getFirebaseProjectId = () => process.env.FIREBASE_PROJECT_ID;
const getFirebaseMessagingSenderId = () =>
  process.env.FIREBASE_MESSAGING_SENDER_ID;
const getFirebaseAppId = () => process.env.FIREBASE_APP_ID;
const getFirebaseMeasurementId = () => process.env.FIREBASE_MEASUREMENT_ID;
const getFirebaseDatabaseURL = () => process.env.FIREBASE_DATABASE_URL;
const getWeekNumber = () => process.env.WEEK_NUMBER;

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
};
