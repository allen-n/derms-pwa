const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Functionality disabled and moved inside Signup
// exports.storeNewUser = functions.auth.user().onCreate((user) => {
//     var newUser = {
//         name: user.displayName,
//         email: user.email,
//         photoUrl: user.photoURL,
//         emailVerified: user.emailVerified,
//         uid: user.uid
//     }

//     newUser.dateCreated = admin.firestore.FieldValue.serverTimestamp();
//     newUser.lastLogIn = admin.firestore.FieldValue.serverTimestamp();
//     newUser.status = 0
//     newUser.reportQuality = 0
//     newUser.referralSignUps = 0
//     newUser.isBusiness = false
//     newUser.reports = []


//     admin.firestore().collection('users').doc(newUser.uid).set(newUser)
//         // .then(writeResult => {
//         //     // write is complete here
//         // })
//         .catch(error => { console.error("Error adding new user: ", error) });

//     // Cloud function supposed to return promise or value
//     return 0
// });

