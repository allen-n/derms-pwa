import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";

import App from "./App";
import Login from "./Login";
import Start from "./Start";


class Main extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <h1>Nav Bar</h1>
                    <ul className="header">
                        {/* to prop is identified to load correct content */}
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/app">App</NavLink></li>
                        <li><NavLink to="/login">Login</NavLink></li>
                    </ul>
                    <div className="content">
                        {/* exact prevents '/' from matching '/.*' */}
                        <Route exact path="/" component={Start} />
                        <Route path="/app" component={App} />
                        <Route path="/login" component={Login} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default Main;