import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const PageShell = Page => {
    return props =>
        <div className="page">
            <ReactCSSTransitionGroup
                transitionAppear={true}
                transitionAppearTimeout={600}
                transitionEnterTimeout={600}
                transitionLeaveTimeout={200}
                transitionName={'SlideIn'}
            // transitionName={props.match.path === '/thanks' ? 'SlideIn' : 'SlideOut'}
            >
                <Page {...props} />
            </ReactCSSTransitionGroup>
        </div>;
};
export default PageShell;