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
    this.firestore = FirebaseApp.firestore
    this.ideasCollection = this.db.collection('ideas') //TODO: Remove, was from tutorial
    this.usersCollection = this.db.collection('users')
    this.recordCollection = this.db.collection('records')
    this.itemsCollection = this.db.collection('items')
    this.itemCategoryCollection = this.db.collection('item-categories')

    this.dbData = {} // Dict where data to be written will stay/maintain state
    
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
