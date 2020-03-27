import { createContext } from 'react'
import FirebaseApp from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

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
    this.recordCollection = this.db.collection('records')
    this.itemsCollection = this.db.collection('items')
    this.itemCategoryCollection = this.db.collection('item-categories')

    // db write data
    this.reportData = {} // Dict where report data to be written will stay/maintain state
    this.userData = null



    // Manage persistent login state from here
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log(user.email + "is signed in")
        this.userData = {
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          emailVerified: user.emailVerified,
          uid: user.uid
        }
      } else {
        console.log("User is signed out")
        this.userData = null
      }
    });
  }
}

const FirebaseContext = createContext(null)

export { Firebase, FirebaseContext, FirebaseApp }
