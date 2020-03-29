import React from 'react'
import { withFirebase } from '../firebase/withFirebase'
import ItemTypeSelect from './ItemTypeSelect'


const SearchItemType = props => {
    const { searchData } = props.firebase

    return (
        <ItemTypeSelect
            routeClickDest={"/"}
            routeBackwardDest={"/"}
            searchData={searchData}>
        </ItemTypeSelect>
    );
}

export default withFirebase(SearchItemType)