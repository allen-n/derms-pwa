import { createContext } from 'react'
import FirebaseApp from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

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
    this.db = FirebaseApp.firestore()
    this.ideasCollection = this.db.collection('ideas') //TODO: Remove, was from tutorial
    this.usersCollection = this.db.collection('users')
    this.locationsCollection = this.db.collection('locations')
    this.itemsCollection = this.db.collection('items')
    this.auth = FirebaseApp.auth()

    // Manage persistent login state from here
    this.auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        console.log(user.email + "is signed in")
      } else {
        console.log("User is signed out")
      }
    });
  }
}

const FirebaseContext = createContext(null)

export { Firebase, FirebaseContext, FirebaseApp }
