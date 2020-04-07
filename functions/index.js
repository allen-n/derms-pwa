const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.storeNewUser = functions.auth.user().onCreate((user) => {
    var newUser = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid
    }
    newUser.dateCreated = firestore.FieldValue.serverTimestamp();
    newUser.lastLogIn = firestore.FieldValue.serverTimestamp();
    newUser.status = 0
    newUser.reportQuality = 0
    newUser.referralSignUps = 0
    newUser.isBusiness = false
    newUser.reports = []

    admin.firestore().collection('users').doc(newUser.uid).set(newUser)
        // .then(writeResult => {
        //     // write is complete here
        // })
        .catch(error => { console.error("Error adding new user: ", error) });
});

