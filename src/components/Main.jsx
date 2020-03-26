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
import ReportItemType from "./ReportItemType";
import leafMap from "./leafMap";


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
                            <li><NavLink to="/leafMap">lMap</NavLink></li>

                        </ul>
                        <div className="content">
                            {/* exact prevents '/' from matching '/.*' */}
                            <Route exact path="/" component={Start} />
                            <Route path="/app" component={App} />
                            <Route path="/login" component={Login} />
                            <Route path="/report" component={ReportItemType} />
                            <Route path="/leafMap" component={leafMap} />
                        </div>
                    </div>
                </Container>
            </HashRouter>
        );
    }
}

export default Main;