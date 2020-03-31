import { createContext } from 'react'
import FirebaseApp from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';

import { firebaseConfig } from './config'

// Firebase class holds our firebase instance
class Firebase {
  constructor() {
    if (!FirebaseApp.apps.length) {
      FirebaseApp.initializeApp(firebaseConfig)
      FirebaseApp.firestore()
        .enablePersistence({ synchronizeTabs: true })
        .catch(err => console.log(err))
    }

    // instance variables
    // Firebase instance info
    this.db = FirebaseApp.firestore()
    this.firestore = FirebaseApp.firestore
    this.storage = FirebaseApp.storage()
    this.auth = FirebaseApp.auth()

    // db collections
    this.ideasCollection = this.db.collection('ideas') //TODO: Remove, was from tutorial
    this.usersCollection = this.db.collection('users')
    // this.reportCollection = this.db.collection('reports')
    this.itemsCollection = this.db.collection('items')
    this.itemCategoryCollection = this.db.collection('item-categories')

    // Location based db collections
    // Create a GeoFirestore reference
    this.geofirestore = new GeoFirestore(this.db);

    // Create a GeoCollection reference
    this.reportCollection = this.geofirestore.collection('reports', ref => ref.orderBy('timestamp'));

    // db write data
    this.reportData = {} // Dict where report data to be written will stay/maintain state
    this.searchData = {} // Dict where item search data to be written will stay/maintain state
    this.userData = null

    this.getUserData = () => {
      return this.userData
    }

    this.authToUser = (user) => {
      return ({
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid
      });
    }

    // Manage persistent login state from here
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log(user.email + "is signed in")
        this.userData = this.authToUser(user)
      } else {
        console.log("User is signed out")
        this.userData = null
      }
    });

  }
}

const FirebaseContext = createContext(null)

export { Firebase, FirebaseContext, FirebaseApp }
