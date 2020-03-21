import React, { useState, useEffect, useRef } from 'react'
import Idea from './Idea'
import { withFirebase } from '../firebase/withFirebase'
import './App.less'

const App = props => {
    const { ideasCollection } = props.firebase
    // useRef() returns a mutable ref object whose .current 
    // property is initialized to the passed argument
    const ideasContainer = useRef(null)
    // Gives functions state, returns current state and function
    // that updates it (i.e. setIdeaInput, setIdeas), pass init state
    const [idea, setIdeaInput] = useState('')
    const [ideas, setIdeas] = useState([])

    // useEffect() lets us perform 'side effects' when
    // the component mounts OR updates
    useEffect(() => {
        const unsubscribe = ideasCollection
            .orderBy('timestamp', 'desc')
            .onSnapshot(({ docs }) => { //fires any time the db changes
                const ideasFromDB = []

                docs.forEach(doc => {
                    const details = {
                        id: doc.id,
                        content: doc.data().idea,
                        timestamp: doc.data().timestamp
                    }

                    ideasFromDB.push(details)
                })

                setIdeas(ideasFromDB)
            })

        return () => unsubscribe() // prevents a memory leak
    }, [])

    const onIdeaDelete = event => {
        const { id } = event.target
        ideasCollection.doc(id).delete()
    }

    const onIdeaAdd = event => {
        // prevent default form submission behavior
        event.preventDefault()

        if (!idea.trim().length) return // return if empty

        setIdeaInput('')
        ideasContainer.current.scrollTop = 0 // scroll to top of container

        ideasCollection.add({
            idea,
            timestamp: new Date()
        })
    }

    const renderIdeas = () => {
        if (!ideas.length)
            return <h2 className="app__content__no-idea">Add a new Idea...</h2>

        return ideas.map(idea => (
            <Idea key={idea.id} idea={idea} onDelete={onIdeaDelete} />
        ))

    }

    // This returns the JSX that is the skeleton of the app 
    return (
        <div className="app">
            <header className="app__header">
                <h1 className="app__header__h1">Idea Box</h1>
            </header>

            <section ref={ideasContainer} className="app__content">
                {renderIdeas()}
            </section>

            <form className="app__footer" onSubmit={onIdeaAdd}>
                <input
                    type="text"
                    className="app__footer__input"
                    placeholder="Add a new idea"
                    value={idea}
                    onChange={e => setIdeaInput(e.target.value)}
                />
                <button type="submit" className="app__btn app__footer__submit-btn">
                    +
            </button>
            </form>
        </div>
    )
}

// This export injects the firebase prop into the App component
export default withFirebase(App)