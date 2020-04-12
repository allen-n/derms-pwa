import React from 'react'
import { withFirebase } from '../../firebase/withFirebase'
import ItemTypeSelect from '../utils/ItemTypeSelect'


const ReportItemType = props => {
    const { reportData } = props.firebase

    return (
        <ItemTypeSelect
            routeClickDest={"/report-info"}
            routeBackwardDest={"/map-home"}
            reportData={reportData}>
        </ItemTypeSelect>
    );
}

export default withFirebase(ReportItemType)