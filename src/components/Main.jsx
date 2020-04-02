import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";

import { Container } from 'react-bootstrap';

// TransitionShell may go out of date soon, currently causing warnings 
import TransitionShell from "./utils/TransitionShell"; 
import Login from "./Login";
import Start from "./Start";
import LocationSelect from "./report/LocationSelect";
import ReportItemType from "./report/ReportItemType";
import ReportItemInfo from "./report/ReportItemInfo";
import SearchItemType from "./search/SearchItemType";
import LocateItem from "./search/LocateItem";

/**
 * Main is the entry point of the app, and houses all the other views
 */
class Main extends Component {
    render() {
        return (
            <HashRouter>
                <Container fluid>
                    <div>
                        <h4>DERMS</h4>
                        <ul className="header">
                            {/* 'to' prop is identified to load correct content */}
                            <li><NavLink to="/">Home</NavLink></li>
                        </ul>
                        <div className="content">
                            {/* exact prevents '/' from wildcard matching '/.*' */}
                            <Route exact path="/" component={TransitionShell(Start)} />
                            <Route path="/login" component={TransitionShell(Login)} />
                            <Route path="/locate" component={TransitionShell(LocationSelect)} />
                            <Route path="/report-type" component={TransitionShell(ReportItemType)} />
                            <Route path="/report-info" component={TransitionShell(ReportItemInfo)} />
                            <Route path="/search-item-type" component={TransitionShell(SearchItemType)} />
                            <Route path="/locate-item" component={TransitionShell(LocateItem)} />
                        </div>
                    </div>
                </Container>
            </HashRouter>
        );
    }
}

export default Main;