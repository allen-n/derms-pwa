import React from 'react'
import { FirebaseContext } from '.'

/**
 * 
 * @param {*} Component, component to be injected with firebase connection
 * This HOC (Higher Order Component) essentially 'injects' the firebase prop
 * into the passed lower order component to stramline interfacing with our db
 */
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
)