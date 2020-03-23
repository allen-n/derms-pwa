import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";

import { Container, Row, Col } from 'react-bootstrap';

import App from "./App";
import Login from "./Login";
import Start from "./Start";
import Gmap from "./Gmap";
import ReportItemType from "./ReportItemType";


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
                            <li><NavLink to="/gmap">gMap</NavLink></li>
                            <li><NavLink to="/report">Report Item</NavLink></li>

                        </ul>
                        <div className="content">
                            {/* exact prevents '/' from matching '/.*' */}
                            <Route exact path="/" component={Start} />
                            <Route path="/app" component={App} />
                            <Route path="/login" component={Login} />
                            <Route path="/gmap" component={Gmap} />
                            <Route path="/report" component={ReportItemType} />
                        </div>
                    </div>
                </Container>
            </HashRouter>
        );
    }
}

export default Main;