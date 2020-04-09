import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/entry/Main'
import './components/entry/Main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FirebaseContext, Firebase } from './firebase'

const rootNode = document.querySelector('#root')

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <Main />
    </FirebaseContext.Provider>,
    rootNode
)