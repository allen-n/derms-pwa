import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";

import { Container } from 'react-bootstrap';

// TransitionShell may go out of date soon, currently causing warnings 
import TransitionShell from "../utils/TransitionShell";
import Landing from "./Landing"
import Signup from "./Signup"
import Login from "./Login";
import LocationSelect from "../report/LocationSelect";
import ReportItemType from "../report/ReportItemType";
import ReportItemInfo from "../report/ReportItemInfo";
import SearchItemType from "../search/SearchItemType";
import LocateItem from "../search/LocateItem";
import MapHome from "../map/MapHome"
import ConfirmStore from "../report/ConfirmStore"

/**
 * Main is the entry point of the app, and houses all the other views
 */
class Main extends Component {
    render() {
        return (
            <HashRouter>
                <Container fluid>
                    {/* Notes:
                    * 'to' prop is identified to load correct content 
                    * exact prevents '/' from wildcard matching '/.*' */}
                    <div>
                        <NavLink to="/"><h4>DERMS</h4></NavLink>

                        <ul className="header">
                            {/* <li><NavLink to="/">Home</NavLink></li> */}
                            {/* <li><NavLink to="/start">Sign In/Out (Dev)</NavLink></li> */}
                        </ul>
                        <div className="content">
                            <Route exact path="/" component={TransitionShell(Landing)} />                            
                            <Route path="/login" component={TransitionShell(Login)} />
                            <Route path="/signup" component={TransitionShell(Signup)} />
                            <Route path="/map-home" component={TransitionShell(MapHome)} />
                            <Route path="/confirm-store" component={TransitionShell(ConfirmStore)} />
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