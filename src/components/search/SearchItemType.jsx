import React from 'react'
import { withFirebase } from '../../firebase/withFirebase'
import ItemTypeSelect from '../utils/ItemTypeSelect'


const SearchItemType = props => {
    const { searchData } = props.firebase

    return (
        <ItemTypeSelect
            routeClickDest={"/locate-item"}
            routeBackwardDest={"/"}
            searchData={searchData}>
        </ItemTypeSelect>
    );
}

export default withFirebase(SearchItemType)