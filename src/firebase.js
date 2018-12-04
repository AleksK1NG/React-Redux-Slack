import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


const config = {
  // Firebase project config
};
firebase.initializeApp(config);

export default firebase;