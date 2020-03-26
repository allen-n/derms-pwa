import React from 'react'
import ItemCarousel from './ItemCarousel'
import ItemList from './ItemList'
import { withFirebase } from '../firebase/withFirebase'


const ReportItemType = props => {
    return (
        <div>
            <ItemCarousel />
            <ItemList></ItemList>
        </div>

    );
}

export default withFirebase(ReportItemType)