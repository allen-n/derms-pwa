import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";

import { Container, Row, Col } from 'react-bootstrap';

import TransitionShell from "./TransitionShell"; // This component may go out of date soon
import App from "./App";
import Login from "./Login";
import Start from "./Start";
import ReportItemType from "./ReportItemType";
import LocationSelect from "./LocationSelect";


class Main extends Component {
    render() {
        return (
            <HashRouter>
                <Container fluid>
                    <div>
                        <h4>DERMS</h4>
                        <ul className="header">
                            {/* to prop is identified to load correct content */}
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/app">App</NavLink></li>
                            <li><NavLink to="/login">Login</NavLink></li>
                            <li><NavLink to="/report">Report Item</NavLink></li>
                            <li><NavLink to="/locate">Locate</NavLink></li>

                        </ul>
                        <div className="content">
                            {/* exact prevents '/' from matching '/.*' */}
                            <Route exact path="/" component={TransitionShell(Start)} />
                            <Route path="/app" component={TransitionShell(App)} />
                            <Route path="/login" component={TransitionShell(Login)} />
                            <Route path="/report" component={TransitionShell(ReportItemType)} />
                            <Route path="/locate" component={TransitionShell(LocationSelect)} />
                        </div>
                    </div>
                </Container>
            </HashRouter>
        );
    }
}

export default Main;