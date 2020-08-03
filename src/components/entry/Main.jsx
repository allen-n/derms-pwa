import React from "react";
import {
    Route,
    HashRouter
} from "react-router-dom";

import TransitionShell from "../utils/TransitionShell";
import Landing from "./Landing"
import Signup from "./Signup"
import Login from "./Login";
import ReportItemType from "../report/ReportItemType";
import ReportItemInfo from "../report/ReportItemInfo";
import SearchItemType from "../search/SearchItemType";
import LocateItem from "../search/LocateItem";
import MapHome from "../map/MapHome"
import ConfirmStore from "../report/ConfirmStore"

/**
 * Main is the entry point of the app, and houses all the other views
 */
const Main = () => {

    return (
        <HashRouter>
            {/* Notes:
                    * 'to' prop is identified to load correct content 
                    * exact prevents '/' from wildcard matching '/.*' */}
            <div className="content">
                <Route exact path="/" component={TransitionShell(Landing)} />
                <Route path="/login" component={TransitionShell(Login)} />
                <Route path="/signup" component={TransitionShell(Signup)} />
                <Route path="/map-home" component={TransitionShell(MapHome)} />
                <Route path="/confirm-store" component={TransitionShell(ConfirmStore)} />
                <Route path="/report-type" component={TransitionShell(ReportItemType)} />
                <Route path="/report-info" component={TransitionShell(ReportItemInfo)} />
                <Route path="/search-item-type" component={TransitionShell(SearchItemType)} />
                <Route path="/locate-item" component={TransitionShell(LocateItem)} />
            </div>
        </HashRouter>
    );
}

export default Main;