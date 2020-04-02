import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/**
 * react-addons-css-transition-group is causing the following error, and may need to be dropped:
 * Warning: componentWillMount has been renamed, and is not recommended for use.
 * Move code with side effects to componentDidMount, and set initial state in the constructor.
 * Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. 
 * In React 17.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, 
 * you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.
 * Please update the following components: CSSTransitionGroupChild, TransitionGroup
 **/

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